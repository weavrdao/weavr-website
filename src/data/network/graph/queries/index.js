import gql from "graphql-tag";

export const THREAD_PROPOSAL_QUERY = gql`
  query ThreadProposals {
		threadProposals{
			id
      governor
      name
      symbol
      descriptor
      baseProposal {
        creator
        state
        votes {
					voter
          voteDirection
          count
        }
        supermajority
        info
        startTimestamp
        endTimestamp
      }
    }
  }
`;

export const VOUCHES_PER_PARTICIPANT = gql`
  query Frabric($id: String!, $signer: String!) {
    frabric(id: $id) {
      id
      voucher(signer: $signer) {
        id
        signer
        participant
      }
    }
}
`
export const ALL_ASSETS_QUERY = gql`
  query Frabric
  {
    frabrics {
      id
      threads {
        id
      }
    }
  }  
`;

export const PARTICIPANTS_PER_DAO = gql`
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
`;

export const ALL_THREADS_QUERY = gql`
query Threads($weavrId: String!) {
  threads {
    frabric(id: $weavrId)
    id
    contract
    variant
    governor
    erc20 {
      name
      symbol
      decimals
      supply
      tradeToken
      globalAcceptance
      whitelist {
        id
        person
        kycHash
        removed
      }
      freezelist {
        id
        person
        frozenUntil
      }
      orderBook {
        id
        price
        type
        totalAmount
      }
      executedOrders {
        id
        blockTimestamp
        orderer
        executor
        price
        amount
      }
      balances {
        id
        holder {
          id
        }
        amount
        transfersFrom {
          timestamp
          to {
            id
          }
          amount
        }
      }
    }
    descriptor
  }
}
`

export const ALL_NEEDLES_QUERY = gql`
query Crowdfunds($weavrId: String!) {
  crowdfunds {
    id
    state
    amountDeposited
    target
    thread {
      id
      descriptor
      frabric(id: $weavrId) {
        id
      }
      contract
      governor
    }
    deposits {
      id
      depositor
      amount
    }
    withdrawals {
      id
      depositor
      amount
    }
    distributions {
      id
      distribution {
        token
        amount
        claims {
          id
          person
          amount
        }
      }
    }
  }
}
`

export const ALL_ASSET_PROPOSALS_QUERY = gql`
  query Proposals($assetId: String!) {
    desriptorChangeProposals(first: 5) {
      id
      thread {
        id
      }
      descriptor
      baseProposal {
        id
      }
    } 
  }
`

export const FRABRIC_DEX_ORDERS_QUERY = gql`
  query Orders($frabricId: String!) {
    frabrics(id: $frabricId) {
      token {
        orderBook {
          id
          price
          type
          totalAmount
        }
      }
    }
  }
`;

export const THREAD_DEX_ORDERS_QUERY = gql`
  query Orders($frabricId: String!, $threadId: String!) {
    frabrics(id: $frabricId) {
      threads(id: $threadId) {
        erc20 {
          orderBook {
            id
            price
            type
            totalAmount
          }
        }
      }
    }
  }
`

export const ALL_PROPOSALS = gql`
query ALL_PROPOSALS($id: String!) {
  frabric(id: $id) {
    paperProposals(orderBy: id, orderDirection: desc) {
      id
      baseProposal {
        creator
        endTimestamp
        info
        startTimestamp
        state
        supermajority
        votes {
          id
          voteDirection
          voter
          count
        }
      }
    }
    upgradeProposals(orderBy: id, orderDirection: desc) {
      baseProposal {
        creator
        endTimestamp
        info
        startTimestamp
        state
        supermajority
        votes {
          id
          voteDirection
          voter
          count
        }
      }
      beacon
      code
      data
      id
      instance
      version
    }
    participantProposals(orderBy: id, orderDirection: desc) {
      baseProposal {
        id
        info
        startTimestamp
        endTimestamp
        state
        supermajority
        votes {
          id
          voteDirection
          voter
          count
        }
      }
      participant
      participantType
      proposer
    }
    tokenActionProposals(orderBy: id, orderDirection: desc) {
      amount
      id
      mint
      price
      target
      token
      baseProposal {
        creator
        endTimestamp
        info
        startTimestamp
        state
        supermajority
        type
        votes {
          id
          count
          voteDirection
          voter
        }
      }
    }
    threadProposals(orderBy: id, orderDirection: desc) {
			id
      governor
      name
      symbol
      descriptor
      baseProposal {
        creator
        state
        votes {
					voter
          voteDirection
          count
        }
        supermajority
        info
        startTimestamp
        endTimestamp
      }
    }
  }
}`;
