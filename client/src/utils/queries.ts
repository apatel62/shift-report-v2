import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      role
    }
  }

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