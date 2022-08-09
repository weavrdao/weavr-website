import BaseProposal from "./baseProposal";

/**
 * Ecosystem Leave With Upgrades Proposal model.
*/

export default class EcosystemLeaveWithUpgradesProposal extends BaseProposal{
  
  // Default attributes that define the "empty" state.
  defaults(){
    return {
      id: null,
      thread: [],
      frabric: "",
      governor: ""  
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
  //   newFrabric,
  //   governor
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
  //   this.newFrabric = newFrabric;
  //   this.governor = governor;
  // }
}