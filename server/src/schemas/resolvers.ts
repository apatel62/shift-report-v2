import Report from '../models/report.js';
import OTSReport from '../models/OTSReport.js';
import { ReportDocument } from '../models/report.js';
import User from '../models/user.js';
import { signToken } from '../services/auth.js';
import sgMail from "@sendgrid/mail";                           //imports SendGrid API
import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId } from 'mongodb';


//Custom Date Scalar to define Date type in GraphQL
const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'A custom scalar type for Date',
  
    serialize(value) {
      if (value instanceof Date) {
        return value.toISOString(); 
      }
      return null; 
    },
  
    parseValue(value) {
      return new Date(value as string); 
    },
  
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value); 
      }
      return null; 
    },
  });

//Interfaces created for the arguments passed from the client to GraphQL to the server
interface User {
    _id: string;
    username: string;
    email: string;
    role: number;
    savedReports: string[];
}

interface IUserContext {
    user?: User;
}

interface LoginArgs {
    username: string;
    password: string;
}

interface AddUserArgs {
    username: string;
    email: string;
    role: string;
    password: string;
}

interface CreateReportArgs {
    report: {
        shiftNumber: string;
        date: Date;
        assignedUserId: string;
    }
}

interface SaveMachineArgs {
    machine: {
        machine: string;
        machineStatus: string;
        partsMade: number;
        comments?: string;
    }
}

interface SendEmailArgs {
    reportId: string;
}

interface GetHistoryArgs {
    history: {
        startDate: string;
        endDate: string;
        selectedMachines: string[];
        interval: number;
    }
}

interface CreatePDFArgs {
    create: {
        date: string;
        week: string;
        month: string;
        machines: string[];
    }
}

interface GetPDFArgs {
    docId: string;
}

interface UserIdArgs {
    userId: string;  
  }

  interface CreateOTSReportArgs {
    report: {
        shiftNumber: string;
        date: Date;
        assignedUserId: string;
    }
}

interface SaveOTSMachineArgs {
    reportId: string;
    machine: {
        machine: string;
        machineStatus: string;
        partsMade: number;
        comments?: string;
    }
}
interface ReportIdArgs {
    reportId: string;  
  }

//Function that formats the date so its in MM-dd-YYYY 
const formatDate = (date: Date): string => {
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Month is 0-indexed
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
  
    return `${month}-${day}-${year}`;
  };

//Resolvers defined to handle the requests made from the client and the corresponding data is returned from the database
const resolvers = {
    Date: DateScalar,
    //Queries are used to read and retrieve data from the database
    Query: {
        //me query returns the user that is logged in
        me: async(_parent: unknown, _args: unknown, context: IUserContext) => {
            try {
                if (context.user) {
                    return await User.findOne({_id: context.user._id}).select('-__v -password');
                } else {
                    return;
                }
            } catch (error) {
                console.error('Error fetching user', error);
                throw new Error('Failed to fetch user data');
            }
        },
        //getAllReports returns an array of Report documents within the collection used to display the tiles for supervisors to look over & approve on OTS page
        getAllReports: async(_parent: unknown, _args: unknown, context: IUserContext) => {
            try {
                if (context.user) {
                    const allReports = await Report.find();
                    return allReports;
                } else {
                    return;
                }
            } catch (error) {
                console.error('Error fetching reports', error);
                throw new Error('Failed to fetch reports');
            }
        },
        //getUserById returns the user based on the userId provided
        //Used for tiles on OTS page so supervisors know who created the report
        getUserById: async(_parent: unknown, {userId}: UserIdArgs, context: IUserContext) => {
            try {
                if (context.user) {
                    const userObjectId = new ObjectId(userId);
                    const user = await User.findOne({ _id: userObjectId });
                    return user; 
                } else {
                    return;
                }
                
            } catch (error) {
                console.error('Error fetching user with id', error);
                throw new Error('Failed to fetch user with id');
            }
        },
    },
    //Mutations are used to modify documents in the collections
    Mutation: {
        //login will check if user is in collection and log them in
        login: async (_parent: unknown, {username, password}: LoginArgs) => {
            const user = await User.findOne({ username: username});
            if (!user) {
                console.error({ message: "Can't find this user" });
                throw new Error('Failed to find user');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                if(user.password !== password) {
                    console.error({ message: "Wrong Password" });
                    throw new Error('Wrong Password Entered');
                }
              }
              const token = signToken(user.username, user.email, user.role, user._id);
              return ({ token, user });
        },
        //adduser will allow sueprvisors to create an account on behalf of someone
        addUser: async(_parent: unknown, {username, email, role, password}: AddUserArgs) => {
            const user = await User.create({username, email, role, password});
            if (!user) {
                console.error({ message: "Cannot create user" });
                throw new Error('Failed to create user');
              }
            return user;
        },
        //createReport allows users to submit a shift report into the database
        //also adds the newly created report's id to the user document's savedReports array
        createReport: async(_parent: unknown, reportArgs: CreateReportArgs, context: IUserContext) => {
            try {
                if (context.user) {
                    const report = await Report.create(reportArgs.report); 
                    await User.findOneAndUpdate(
                        { _id: context.user._id},
                        { $addToSet: { savedReports: report._id } },
                        { new: true, runValidators: true }
                      );
                      return report;
                } else {
                    throw new Error('Context user works but failed to save report to user');
                }
              } catch (error) {
                console.log(error);
                console.error({ message: "Cannot create report and save to user" });
                throw new Error('Failed to create report and save it to user');
              }
        },
        //saveMachine allows users to add mutiple machines to the report they created
        saveMachine: async(_parent: unknown, machineArgs: SaveMachineArgs, context: IUserContext) => {
            try{
                if(context.user) {
                    const user = await User.findById(context.user._id).populate('savedReports').sort({date: -1}); //populates & sorts the reports saved in that user's savedReport array by date
                    if(user?.savedReports.length === 0) {
                        throw new Error("No reports found for this user.");
                    }
                    const reports = user?.savedReports as unknown as ReportDocument[];
                    const mostRecentReport = reports[0];    //grabs most recent date
                    //updates that report by adding the machine info into savedMachines array
                    const updatedReport = await Report.findByIdAndUpdate(
                        {_id: mostRecentReport?._id},
                        { $addToSet: { savedMachines: machineArgs.machine } },
                        { new: true, runValidators: true }
                    );

                    return updatedReport;

                } else {
                    console.error({ message: "Couldn't find report associated to this user!" });
                    throw new Error('Failed to find report to this user');            
                }
            } catch (error) {
                console.log(error);
                console.error({ message: "Cannot save machine to report" });
                throw new Error('Failed to save machine to report');
            }
        },
        //sends the email via SendGrid API out to supervisors after user are done filling out their report
        sendEmail: async(_parent: unknown, sendEmailArgs: SendEmailArgs, context: IUserContext) => {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
            try{
                if (context.user) {
                    const report = await Report.findById(sendEmailArgs.reportId);
                    if(report?.date) {
                        const dateFormatted: string = formatDate(report?.date);
                        const supervisorEmails = await User.find({role: "supervisor"}).select("email");
                        let machinesEmail = report?.savedMachines.map((machine) => {
                            return `<p style = "font-weight: 200">${machine.machine} - Status: ${
                              machine.machineStatus
                            } Parts Made: ${machine.partsMade} ${
                              machine.comments ? `Comments: ${machine.comments}` : ""
                            }</p>`;
                          });
                        let emailHTML = [
                            `<h1 style = "font-weight: 400">${dateFormatted} Shift ${report?.shiftNumber} Report</h1>`,
                            ...machinesEmail,
                        ];
                        const msg = {
                              to: supervisorEmails,
                              from: "arjunpatel9217@gmail.com", 
                              subject: "Shift Report",
                              html: emailHTML.join("\n"),
                            };
                        
                        await sgMail.send(msg);
                    }
                    return report;
                } else {
                    console.error({ message: "Couldn't find report and email it!" });
                    throw new Error('Failed to find report and email it');  
                }

            } catch (error) {
                console.log(error);
                console.error({ message: "Cannot send email out to everyone" });
                throw new Error('Failed to send out to everyone');
            }
        },
        //When users are on the Shift History page, the requested reports will be returned based on the date range they specified on the front-end
        getHistory: async(_parent: unknown, getHistoryArgs: GetHistoryArgs) => {
            try{
                const reports = await OTSReport.find({
                    date: {$gte: new Date(getHistoryArgs.history.startDate), $lte: new Date(getHistoryArgs.history.endDate)},
                    'savedMachines.machine': {$in: getHistoryArgs.history.selectedMachines},
                });
                if (reports) {
                    return reports;
                } else {
                    console.error({ message: "Couldn't find reports and grab its history!" });
                    throw new Error('Failed to find reports and its history');  
                }

            } catch (error) {
                console.log(error);
                console.error({ message: "Cannot get history of requested dates" });
                throw new Error('Failed to get history of requested dates');
            }
        },
        //CreatePDF generates the pdf based on the user's requested report history data
        //PDF is in same format like the table shown in the front-end of Shift History page
        //returns the docId to the client
        createPDF: async(_parent: unknown, createPDFArgs: CreatePDFArgs) => {
            try{
                const response = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${process.env.PDF_API_KEY}`,
                    },
                    body: JSON.stringify({
                      document: {
                        document_template_id: process.env.DOCUMENT_TEMPLATE_ID, // Template ID
                        status: "pending",
                        payload: {
                          shiftTitle: "Filtered Shift History",
                          createPDFArgs,
                        },
                        meta: {
                          _filename: "filtered_history.pdf", // Desired filename of the generated PDF
                        },
                      },
                    }),
                  });
              
                  if (!response.ok) {
                    const errorDetails = await response.json();
                    console.error("Error from PDF Monkey API:", errorDetails);
                    throw new Error(`PDF Monkey API error: ${response.status}`);
                  }
                  const result = await response.json();
                  
                if (result) {
                    const docId = result.document.id;
                   return docId;
                } else {
                    console.error({ message: "Couldn't generate pdf!" });
                    throw new Error('Failed to generate pdf');  
                }

            } catch (error) {
                console.log(error);
                console.error({ message: "Cannot create pdf from user requested data" });
                throw new Error('Failed to create pdf from user requested data');
            }
        },
        //GetPDF returns the download link of the requested PDF so users can download it
        //Takes in the docID from createPDF 
        getPDF: async(_parent: unknown, getPDFArgs: GetPDFArgs) => {
            try{
                const response = await fetch(
                    `https://api.pdfmonkey.io/api/v1/documents/${getPDFArgs.docId}`,
                    {
                      method: "GET", // HTTP method to fetch the document details
                      headers: {
                        Authorization: `Bearer ${process.env.PDF_API_KEY}`, // Authorization header with API key
                        "Content-Type": "application/json", // Ensure content type is set to JSON
                      },
                    }
                  );
              
                  if (!response.ok) {
                    const errorDetails = await response.json();
                    console.error("Error fetching document details:", errorDetails);
                    throw new Error(`Error fetching document details: ${response.status}`);
                  }
              
                  const result = await response.json(); // Parse the response as JSON
                  if (result.document.download_url) {
                    return result.document.download_url;
                  } else {
                    console.error({ message: "Couldn't get pdf!" });
                    throw new Error('Failed to get pdf');  
                }

            } catch (error) {
                console.log(error);
                console.error({ message: "Cannot download pdf from doc Id" });
                throw new Error('Failed to download pdf from doc Id');
            }
        },

        //createOTSReport creates an OTSReport document when supervisors approve a shift report
        //returns created OTSReport where its _id will be used to save the that shift report's machines to this report
        createOTSReport: async(_parent: unknown, reportArgs: CreateOTSReportArgs, context: IUserContext) => {
            try {
                if (context.user) {
                    const reportOTS = await OTSReport.create(reportArgs.report); 
                    await User.findOneAndUpdate(
                        { _id: context.user._id},
                        { $addToSet: { savedOTSReports: reportOTS._id } },
                        { new: true, runValidators: true }
                      );
                      return reportOTS;
                } else {
                    throw new Error('Context user works but failed to save OTSReport to user');
                }
              } catch (error) {
                console.log(error);
                console.error({ message: "Cannot create OTRReport and save to user" });
                throw new Error('Failed to create OTSReport and save it to user');
              }
        },
        
        //saveOTSMachines saves the machines to the corresponding OTSReport via its _id which is passed along as an argument
        saveOTSMachines: async(_parent: unknown, machineArgs: SaveOTSMachineArgs, context: IUserContext) => {
            try{
                if(context.user) {
                    const updatedOTSReport = await OTSReport.findByIdAndUpdate(
                        {_id: machineArgs?.reportId},
                        { $addToSet: { savedMachines: machineArgs.machine } },
                        { new: true, runValidators: true }
                    );

                    return updatedOTSReport;

                } else {
                    console.error({ message: "Couldn't find OTSReport associated to this user!" });
                    throw new Error('Failed to find OTSReport to this user');            
                }
            } catch (error) {
                console.log(error);
                console.error({ message: "Cannot save machine to OTSReport" });
                throw new Error('Failed to save machine to OTSReport');
            }
        },

        removeReport: async(_parent: unknown, {reportId}: ReportIdArgs, context: IUserContext) => {
            try {
                if (context.user) {
                    const id = new ObjectId(reportId);
                    await Report.deleteOne({_id: id});
                    return "Report has been removed"; 
                } else {
                    return;
                }
            } catch (error) {
                console.error('Error deleting report with id', error);
                throw new Error('Failed to delete report with id');
            }

        },
    },

};

export default resolvers;
