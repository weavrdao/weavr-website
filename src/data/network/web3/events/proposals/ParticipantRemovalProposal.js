import {BaseProposal} from "@/data/network/web3/events/proposals/BaseProposal";

export class ParticipantRemovalProposal extends BaseProposal {
  constructor(baseProposal, data) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const {participant, fee} = data
    this.participant = participant
    this.fee = fee
  }
}