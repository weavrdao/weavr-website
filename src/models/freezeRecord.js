import { Model } from "vue-mc";

/**
 * Freeze Record model
 */

export default class FreezeRecord extends Model {

    // Default attribute that defines the "empty" state.
    defaults() {
        return {
            id: null,
            frabricERC20: [],
            person: "",
            frozenUntil: null
        }
    }
}