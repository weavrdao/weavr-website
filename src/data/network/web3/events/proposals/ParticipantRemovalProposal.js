import {PaperProposal} from "@/data/network/web3/events/proposals/PaperProposal";
import {VoteType} from "@/models/vote";

export class ParticipantRemovalProposal extends PaperProposal {
  constructor(baseProposal, data, state) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority, baseProposal.startTimestamp, state)
    const {participant, fee} = data
    this.participant = participant
    this.fee = fee
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