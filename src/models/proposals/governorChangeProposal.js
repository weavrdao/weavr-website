import BaseProposal from "./baseProposal";

/**
 * Governor Change Proposal model.
*/

export default class GovernorChangeProposal extends BaseProposal{

  // Default attributes that define the "empty" state.
  defaults(){
    return {
      id: null,
      thread: [],
      governor: "",
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
  //   this.governor = governor;
  // }
}