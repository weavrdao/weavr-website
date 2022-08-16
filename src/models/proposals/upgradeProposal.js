/**
 * Upgrade Proposal model.
*/
export class UpgradeProposal {
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
    beacon,
    instance,
    version,
    code,
    data,
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
    this.beacon = beacon;
    this.instance = instance;
    this.version = version;
    this.code = code;
    this.data = data;
  }
}
