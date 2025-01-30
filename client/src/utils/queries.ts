import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      role
    }
  }
`;

export const GET_ALL_REPORTS = gql`
  query getAllReports {
    getAllReports {
      _id
      shiftNumber
      date
      assignedUserId
      savedMachines {
        machine
        machineStatus
        partsMade
        comments
      }
    }
  }
`;
export const GET_USER_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
      username
    }
  }
`;
