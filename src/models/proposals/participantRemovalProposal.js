import BaseProposal from "./baseProposal";

/**
 * Participant Removal Proposal model.
*/

export default class ParticipantRemovalProposal extends BaseProposal{

  // Default attributes that define the "empty" state.
  defaults() {
    return {
      id:  null,
      frabric: [],
      thread: [],
      participant: "",
      removalFee: null
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
  //   participant,
  //   removalFee
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
  //   this.participant = participant;
  //   this.removalFee = removalFee;
  // }
}