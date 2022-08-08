// import {
//   gql
// } from "@apollo/client/core"
import gql from "graphql-tag";

// const DAO_LIST_ADDRESSES = gql`
//   query 
// `

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




const ALL_ASSETS_QUERY = gql`
  query Frabric
  {
    frabrics {
      id
      threads {
        id
      }
    }
  }  
`

const PARTICIPANTS_PER_DAO = gql`
  query Frabric
  {
    frabrics {
      id
      
      paperProposal {
        id
        address
        type
      }
    }
  }
`

export {
  PARTICIPANTS_PER_DAO,
  ALL_ASSETS_QUERY,
  THREAD_PROPOSAL_QUERY
}
