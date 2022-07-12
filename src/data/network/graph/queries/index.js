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
query frabrics
  {
    frabrics {
      id
      paperProposals {
        id
        baseProposal {
          info
        }
      }
      token {
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
      participants {
        id
        address
        type
      }
      governorStatuses {
        id
        address
        status
      }
      threads {
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
        descriptorChangeProposals {
          id
          descriptor
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
        upgradeProposals {
          id
          frabric {
            id
          }
          thread {
            id
          }
          beacon
          instance
          version
          code
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
        tokenActionProposals {
          id
          frabric {
            id
          }
          thread {
            id
          }
          token
          target
          mint
          price
          amount
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
        participantRemovalProposals {
          id
          frabric {
            id
          }
          thread {
            id
          }
          participant
          removalFee
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
        frabricChangeProposals {
          id
          frabric
          thread {
            id
          }
          governor
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
        governorChangeProposals {
          id
          thread {
            id
          }
          governor
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
        ecosystemLeaveProposals {
          id
          frabric
          thread {
            id
          }
          governor
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
        dissolutionProposals {
          id
          thread {
            id
          }
          token
          price
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
      participantProposals {
        id
        proposer
        participant
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
      upgradeProposals {
        id
        frabric {
          id
        }
        thread {
          id
        }
        beacon
        instance
        version
        code
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
      tokenActionProposals {
        id
        frabric {
          id
        }
        thread {
          id
        }
        token
        target
        mint
        price
        amount
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
      participantRemovalProposals {
        id
        frabric {
          id
        }
        thread {
          id
        }
        participant
        removalFee
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
      bondRemovalProposals {
        id
        frabric {
          id
        }
        participant
        slash
        amount
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
      threadProposalProposals {
        id
        frabric {
          id
        }
        thread
        info
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
      vouchers {
        id
        signer
        participant
      }
    }
    bonds {
      id
      holdings {
        id
        governor
        amount
      }
    }
    crowdfunds {
      id
      state
      amountDeposited
      target
      thread {
        id
      }
      erc20 {
        id
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
    auctions {
      id
      seller
      token
      traded
      totalAmount
      start
      length
      batches {
        id
        bids {
          id
          bidder
          amount
        }
        isComplete
      }
    }
    timelocks {
      id
      timestamp
      token
      months
      amountClaimed
    }
  }  
`
export {
  
  ALL_ASSETS_QUERY
}
