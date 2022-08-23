import { Model } from "vue-mc";

/**
 * Auction model
 */

export default class Auction extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            seller: "",
            token: "",
            traded: "",
            totalAmount: null,
            start: null,
            lenth: null,
            batches: []
        }
    }
}