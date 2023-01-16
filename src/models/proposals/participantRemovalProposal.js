/**
 * Participant Removal Proposal model.
 */

export class ParticipantProposal {
  constructor(id, thread, frabric, creator, type, state, votes, supermajority, startTimestamp, endTimestamp, info, removalFee, participant, signatures, proposer) {
    this.type = type;
    this.id = id;
    this.thread = thread;
    this.frabric = frabric;
    this.creator = creator;
    this.state = state;
    this.votes = votes;
    this.supermajority = supermajority;
    this.startTimestamp = startTimestamp;
    this.endTimestamp = endTimestamp;
    this.info = info;
    this.removalFee = removalFee;
    this.signatures = signatures;
    this.participant = participant;
    this.proposer = proposer;
  }
}
