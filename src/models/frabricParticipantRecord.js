import { Model } from "vue-mc";

/**
 * Frabric Participant Record model
 */

export default class FrabricParticipantRecord extends Model {

    // Defaults attribute that define the "empty" state.
    defaults() {
        return {
            id: null,
            frabric: [],
            address: "",
            type: []
        }
    }
}