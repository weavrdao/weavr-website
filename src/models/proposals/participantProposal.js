/* eslint-disable class-methods-use-this */
import BaseProposal from "./baseProposal";

/**
 * Participant Proposal model.
*/

export default class ParticipantProposal extends BaseProposal {

  // Default attributes that define the "empty" state.
  defaults() {
    return {
      participant: "",
      proposer: "",
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
  //   participantType,
  //   participant
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
  //   this.participantType = participantType;
  //   this.participant = participant;
  // }
}
