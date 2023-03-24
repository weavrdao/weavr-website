import {BaseProposal} from "./BaseProposal";
import {VoteType} from "@/models/vote";

export class ParticipantRemovalProposal extends BaseProposal {
  constructor(baseProposal, data) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const {participant, fee} = data
    this.participant = participant
    this.fee = fee
  }
}
