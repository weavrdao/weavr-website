/**
 * Vote model.
 * @property {string} proposalID ID of the proposal this vote belongs to
 * @property {string} voterAddress Address of the voter
 * @property {VoteType} type Type of the vote posted
 * @property {number} count Voting power of the voter
 */
class Vote {
  constructor(
    proposalID,
    voterAddress,
    type,
    count
  ) {
    this.proposalID = proposalID
    this.voterAddress = voterAddress
    this.type = type
    this.count = count
  }
}

const VoteType = {
  Yes: "Yes",
  No: "No",
  Abstain: "Abstain"
}

export { Vote, VoteType }