/**
 * Paper Proposal model.
*/

// This is very dirty but we are using this as a workaround currently
export class PaperProposal {
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
  ) {
    this.id = id,
    this.thread = thread,
    this.frabric = frabric,
    this.creator = creator,
    this.type = type,
    this.state = state,
    this.votes = votes,
    this.supermajority = supermajority,
    this.startTimestamp = startTimestamp,
    this.endTimestamp = endTimestamp
    this.info = info;
  }
}
