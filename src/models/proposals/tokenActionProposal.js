/**
 * Token Action Proposal model.
*/

export class TokenActionProposal {
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
    token,
    target,
    mint,
    price,
    amount
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
    this.token = token;
    this.target = target;
    this.mint = mint;
    this.price = price;
    this.amount = amount;
  }
}
