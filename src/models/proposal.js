/**
 * Proposal model.
 * @property {string} id ID of the proposal
 * @property {string} creatorAddress Address of the proposal creator
 * @property {string} dataURI Location of the off-chain data of the proposal
 * @property {number} startTimestamp Unix timestamp marking the start of the voting window
 * @property {number} endTimestamp Unix timestamp marking the end of the voting window
 * @property {Vote[]} votes Votes posted on the proposal
 * @property {string} title Title of the proposal
 * @property {string} description Body of the proposal
 */

 class Proposal {
  constructor(
    id,
    creatorAddress,
    dataURI,
    startTimestamp,
    endTimestamp,
    votes,
    title = null,
    description = null
  ) {
    this.id = id
    this.creatorAddress = creatorAddress
    this.dataURI = dataURI
    this.startTimestamp = startTimestamp
    this.endTimestamp = endTimestamp
    this.votes = votes,
    this.title = title
    this.description = description
  }
}


export default Proposal