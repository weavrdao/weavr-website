import {BaseProposal} from "./BaseProposal";
import {VoteType} from "@/models/vote";

export class ParticipantProposal extends BaseProposal {
  constructor(baseProposal, data) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const {participantType, proposer, participant} = data
    this.participantType = participantType
    this.proposer = proposer
    this.participant = participant
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