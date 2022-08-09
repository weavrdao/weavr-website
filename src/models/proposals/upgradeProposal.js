/* eslint-disable class-methods-use-this */
import BaseProposal from "./baseProposal";

/**
 * Upgrade Proposal model.
*/

/**
 * beacon: Bytes!
 * instance: Bytes!
 * version: BigInt!
 * code: Bytes! 
 * data: Bytes! 
*/

export default class UpgradeProposal extends BaseProposal {

  // Default attributes that define the "empty" state.
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
