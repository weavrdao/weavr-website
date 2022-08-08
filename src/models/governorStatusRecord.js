import { Model } from "vue-mc";

/**
 * Governor Status Record
 */

class GovernorStatusRecord extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            frabric: [],
            address: "",
            status: []
        }
    }
}

export default GovernorStatusRecord;