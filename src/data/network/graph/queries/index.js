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
query {
  crowdfunds(where: { state: "Finished"})  {
    state
    thread {
      frabric {
        id
      }
      id
      contract
      variant
      governor
      erc20 {
        id
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
}
`

export const ALL_NEEDLES_QUERY = gql`
query {
  
    crowdfunds(where: {state_not: Finished}) {
      id
      state
      amountDeposited
      target
      thread {
        id
        descriptor
        frabric {
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
`;

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
    paperProposals(orderBy: id, orderDirection: desc, where: { baseProposal_ : { thread: null}}) {
      id
      baseProposal (thread: null) {
        creator
        thread 
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
    participantRemovalProposals(orderBy: id, orderDirection: desc) {
        baseProposal {
            creator
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
        removalFee
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


export const THREAD_PROPOSALS = gql`
query ALL_PROPOSALS($thread: String!) {
  
 
  desriptorChangeProposals(orderBy: id, orderDirection: desc, where: { baseProposal_ : { thread: $thread}}) {
    id
    descriptor
    baseProposal {
      creator
      thread
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
  }
  governorChangeProposals(orderBy: id, orderDirection: desc, where: { baseProposal_ : { thread: $thread}}) {
    id
    governor
    baseProposal {
      creator
      thread
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
  }
  dissolutionProposals(orderBy: id, orderDirection: desc, where: { baseProposal_ : { thread: $thread}}) {
    id
    token
    price
    baseProposal {
    creator
    thread
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
  }
  participantProposals(orderBy: id, orderDirection: desc, where: { baseProposal_ : { thread: $thread}}) {
    id
    baseProposal {
      creator
      thread
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
  participantRemovalProposals(orderBy: id, orderDirection: desc, where: { baseProposal_ : { thread: $thread}}) {
    id
    baseProposal {
      creator
      thread
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
      removalFee
  }
  tokenActionProposals(orderBy: id, orderDirection: desc, where: { baseProposal_ : { thread: $thread}}) {
    amount
    id
    mint
    price
    target
    token
    baseProposal {
      creator
      thread
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
  }
  
}`;
