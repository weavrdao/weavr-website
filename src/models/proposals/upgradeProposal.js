/* eslint-disable class-methods-use-this */
import BaseProposal from "./baseProposal";

/**
 * Proposal model.
 * @property {string} id ID of the proposal
 * @property {string} creatorAddress Address of the proposal creator
 * @property {number} startTimestamp Unix timestamp marking the start of the voting window
 * @property {number} endTimestamp Unix timestamp marking the end of the voting window
 * @property {Vote[]} votes Votes posted on the proposal
 * @property {bool} supermajority Signal if the supermagiority is required or not
 * @property {string} description Description of the proposal
 * @property {string} beacon
 * @property {string} instance
 * @property {string} version
 * @property {string} code
 * @property {string} data 
*/

/**
 * beacon: Bytes!
 * instance: Bytes!
 * version: BigInt!
 * code: Bytes! 
 * data: Bytes! 
*/

export class UpgradeProposal extends BaseProposal {
  defaults() {
    return {
      beacon: "",
      code: "",
      data: "",
      instance: "",
      version: "",
    }
  }
  // constructor(
  //   id,
  //   thread,
  //   frabric,
  //   creator,
  //   type,
  //   state,
  //   votes,
  //   supermajority,
  //   startTimestamp,
  //   endTimestamp,
  //   description,
  //   beacon,
  //   instance,
  //   version,
  //   code,
  //   data
  // ) {
  //   super(
  //     id,
  //     thread,
  //     frabric,
  //     creator,
  //     type,
  //     state,
  //     votes,
  //     supermajority,
  //     startTimestamp,
  //     endTimestamp
  //   );
  //   this.description = description;
  //   this.beacon = beacon;
  //   this.instance = instance;
  //   this.version = version;
  //   this.code = code;
  //   this.data = data;
  // }
}
