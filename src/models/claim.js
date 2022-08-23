import { Model } from "vue-mc";

/**
 * Claim model
 */

export default class Claim extends Model {

    // Default attributes that define the "empty" state.
    defaults () {
        return {
            id: null,
            distribution: [],
            person: "",
            amount: null
        }
    }
}