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




const ALL_ASSETS_QUERY = gql`
  query {
    deployedAssets {
      id
      mintedAsset {
        id
        dataURI
      }
      contract
      symbol
      numOfShares
      owners {
        id
        owner
        shares
      }
      marketOrders {
        id
        orderType
        price
        amount
      }
      proposals {
        id
        creator
        dataURI
        votes {
          id
          voter
          voteType
          count
        }
        startTimestamp
        endTimestamp
      }
    }
  }
`

const ALL_ASSET_PROPOSALS_QUERY = gql`
  query Proposals($assetId: String!) {
    proposals(asset: $assetId) {
      id
      creator
      dataURI
      votes {
        id
        voter
        voteType
        count
      }
      startTimestamp
      endTimestamp
    }
  }
`
export {
  THREAD_PROPOSAL_QUERY,
  ALL_ASSET_PROPOSALS_QUERY,
  ALL_ASSETS_QUERY
}
