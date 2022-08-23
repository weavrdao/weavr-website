/**
 * Participant Proposal model.
*/

export class ParticipantProposal {
  constructor(
    id,
    thread,
    frabric,
    creator,
    type,
    state,
    votes,
    supermajority,
    startTimestamp,
    endTimestamp,
    info,
    participantType,
    participant,
    proposer
  ) {
    this.type = type;
    this.id = id;
    this.thread = thread;
    this.frabric = frabric;
    this.creator = creator;
    this.type = type;
    this.state = state;
    this.votes = votes;
    this.supermajority = supermajority;
    this.startTimestamp = startTimestamp;
    this.endTimestamp = endTimestamp;
    this.info = info;
    this.participantType = participantType;
    this.participant = participant;
    this.proposer = proposer;
  }
}
