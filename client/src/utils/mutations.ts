import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
        email
        role
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($uname: String!, $em: String!, $role: String!, $password: String!) {
    addUser(username: $uname, email: $em, role: $role, password: $password) {
      username
      email
    }
  }
`;

export const CREATE_REPORT = gql`
  mutation createReport($report: ReportInput!) {
    createReport(report: $report) {
      _id
      shiftNumber
      date
      assignedUserId
    }
  }
`;

export const SAVE_MACHINE = gql`
  mutation saveMachine($machine: MachineInput!) {
    saveMachine(machine: $machine) {
      _id
      shiftNumber
      date
    }
  }
`
export const SEND_EMAIL = gql`
  mutation sendEmail($reportId: String!) {
    sendEmail(reportId: $reportId) {
      _id
      shiftNumber
      date
    }
  }
`

export const GET_HISTORY = gql`
  mutation getHistory($history: HistoryInput!) {
    getHistory(history: $history) {
      date
      savedMachines {
        machine
        partsMade
      }
    }
  }
`
export const CREATE_PDF = gql`
  mutation createPDF($create: [CreateInput!]!) {
    createPDF(create: $create) 
  }
`

export const GET_PDF = gql`
  mutation getPDF($docId: String!) {
    getPDF(docId: $docId) 
  }
`;