import {BaseProposal} from "@/data/network/web3/events/proposals/BaseProposal";

export class ParticipantProposal extends BaseProposal {
  constructor(baseProposal, data) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const {participantType, proposer, participant} = data
    this.participantType = participantType
    this.proposer = proposer
    this.participant = participant
  }
}