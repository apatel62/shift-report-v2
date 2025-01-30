//typeDefs describes the data and structure of the queries and mutations the GraphQL will support
const typeDefs = `
  scalar Date
  type User {
    _id: ID!
    username: String
    email: String
    role: String
    savedReports: [Report]
  }

  type Report {
    _id: ID!
    shiftNumber: String
    date: Date
    assignedUserId: String
    savedMachines: [Machine]
  }

  type Machine {
    machine: String
    machineStatus: String
    partsMade: Int
    comments: String
  }

  type OTSReport {
    _id: ID!
    shiftNumber: String
    date: Date
    assignedUserId: String
    savedMachines: [OTSMachine]
  }

  type OTSMachine {
    machine: String
    machineStatus: String
    partsMade: Int
    comments: String
    lotNumber: Int
  }

  type Auth {
    token: String
    user: User
  }

  input ReportInput {
    shiftNumber: String!      
    date: Date!
    assignedUserId: String!   
  }

  input OTSReportInput {
    shiftNumber: String!      
    date: Date!
    assignedUserId: String!   
  }

  input MachineInput {
    machine: String!
    machineStatus: String!
    partsMade: Int!
    comments: String         
  }

  input OTSMachineInput {
    machine: String!
    machineStatus: String!
    partsMade: Int!
    comments: String
    lotNumber: Int!         
  }

  input HistoryInput {
    startDate: String!
    endDate: String!
    selectedMachines: [String]!
    interval: Int!         
  }

  input HistoryMachineInput {
    machine: String!
    partsMade: Int!
  }

input CreateInput {
  date: String
  week: String
  month: String
  machines: [HistoryMachineInput]!  
}

  type Query {
    me: User
    getAllReports: [Report]
    getUserById(userId: String!): User
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, email: String!, role: String!, password: String!): User
    createReport(report: ReportInput!): Report
    saveMachine(machine: MachineInput!): Report
    sendEmail(reportId: String!): Report
    getHistory(history: HistoryInput!): [OTSReport]
    createPDF(create: [CreateInput!]!): String
    getPDF(docId: String!): String
    createOTSReport(report: OTSReportInput!): OTSReport
    saveOTSMachines(reportId: String!, machine: [OTSMachineInput!]!): OTSReport
    removeReport(reportId: String!): String
  }
`;

export default typeDefs;
