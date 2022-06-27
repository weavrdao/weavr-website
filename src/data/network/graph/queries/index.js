// import {
//   gql
// } from "@apollo/client/core"
import gql from "graphql-tag";

const THREAD_PROPOSAL_QUERY = gql`
  query ThreadProposals {
    threadProposals {
        id
        governor
        name
        symbol
        descriptor
        data
        baseProposal {
          id
          thread {
            id
          }
          frabric {
            id
          }
          creator
          type
          state
          votes {
            id
            voter
            voteDirection
            count
          }
          info
        }
      }
  }
`

export {
  THREAD_PROPOSAL_QUERY
}
