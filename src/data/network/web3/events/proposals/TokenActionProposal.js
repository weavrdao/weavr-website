import {PaperProposal} from "@/data/network/web3/events/proposals/PaperProposal";
import {VoteType} from "@/models/vote";

export class TokenActionProposal extends PaperProposal {
  constructor(baseProposal, payload, state) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority, baseProposal.startTimestamp, state)
    const {token, target, mint, price, amount} = payload
    this.token = token
    this.target = target
  this.mint = mint
  this.price = price.toNumber()
  this.amount = amount
  }

  addVote(vote) {
    if(vote.voteDirection === 0) {
      vote.voteDirection = VoteType.Abstain
    } else if (vote.voteDirection === 1) {
      vote.voteDirection = VoteType.Yes
    } else  {
      vote.voteDirection = VoteType.No
    }
    this.votes.push(vote)
  }
}