import { Model } from "vue-mc";

/**
 * Distribution model
 */

export default class Distribution extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            token: "",
            amount: null,
            claims: []
        }
    }
}