/**
 * Thread Proposal model.
*/

export class ThreadProposal {
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
    governor,
    name,
    symbol,
    descriptor,
  ) {
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
    this.governor = governor;
    this.name = name;
    this.symbol = symbol;
    this.descriptor = descriptor;
  }
}