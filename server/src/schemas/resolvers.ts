import Report from '../models/report.js';
import { ReportDocument } from '../models/report.js';
import User from '../models/user.js';
import { signToken } from '../services/auth.js';
import sgMail from "@sendgrid/mail";
//console.log(process.env.SENDGRID_API_KEY);
import { GraphQLScalarType, Kind } from 'graphql';
// Custom Date Scalar
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
    userId: string;  // Type the 'userId' argument as a string
  }

const formatDate = (date: Date): string => {
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Month is 0-indexed
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
  
    return `${month}-${day}-${year}`;
  };

const resolvers = {
    Date: DateScalar,
    Query: {
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
        getUserById: async(_parent: unknown, {userId}: UserIdArgs, context: IUserContext) => {
            try {
                if (context.user) {
                    const user = await User.findById(userId);
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

    Mutation: {
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

        addUser: async(_parent: unknown, {username, email, role, password}: AddUserArgs) => {
            const user = await User.create({username, email, role, password});
            if (!user) {
                console.error({ message: "Cannot create user" });
                throw new Error('Failed to create user');
              }
            //const token = signToken(user.username, user.password, user.role, user._id);
            return user;
        },

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

        saveMachine: async(_parent: unknown, machineArgs: SaveMachineArgs, context: IUserContext) => {
            try{
                if(context.user) {
                    const user = await User.findById(context.user._id).populate('savedReports').sort({date: -1});
                    if(user?.savedReports.length === 0) {
                        throw new Error("No reports found for this user.");
                    }
                    const reports = user?.savedReports as unknown as ReportDocument[];
                    const mostRecentReport = reports[0]; 
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
                              from: "arjunpatel9217@gmail.com", // Use the email address or domain you verified above
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
        
        getHistory: async(_parent: unknown, getHistoryArgs: GetHistoryArgs) => {
            try{
                const reports = await Report.find({
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
    },

};

export default resolvers;
