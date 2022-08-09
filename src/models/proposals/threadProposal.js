import BaseProposal from "./baseProposal";

/**
 * Thread Proposal model.
*/

export default class ThreadProposal extends BaseProposal{

  // Default attributes that define the "empty" state.
  defaults(){
    return {
      id: null,
      frabric: [],
      governor: "",
      name: "",
      symbol: "",
      descriptor: "",
      data: ""
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
  //   governor,
  //   name,
  //   symbol,
  //   descriptor,
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
  //   this.name = name;
  //   this.symbol = symbol;
  //   this.descriptor = descriptor;
  //   this.data = data;
  //   this.governor = governor;
  // }
}