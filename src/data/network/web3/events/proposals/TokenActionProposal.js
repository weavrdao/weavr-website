import {BaseProposal} from "@/data/network/web3/events/proposals/BaseProposal";
import {VoteType} from "@/models/vote";
import {BigNumber} from "ethers";

export class TokenActionProposal extends BaseProposal {
  constructor(baseProposal, payload) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const {token, target, mint, price, amount} = payload
    this.token = token
    this.target = target
  this.mint = mint
  this.price = price
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