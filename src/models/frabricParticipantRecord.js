import { Model } from "vue-mc";

/**
 * Frabric Participant Record model
 */

class FrabricParticipantRecord extends Model {

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

export default FrabricParticipantRecord;