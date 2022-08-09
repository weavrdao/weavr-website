import { Model } from "vue-mc";

/**
 * Time Lock model
 */

export default class TimeLock extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            timestamp: null,
            token: "",
            months: null,
            amountClaimed: null
        }
    }
}