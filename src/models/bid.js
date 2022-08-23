import { Model } from "vue-mc";

/**
 * Bid model
 */

export default class Bid extends Model {

    // Default attribute that defines the "empty" state.
    defaults() {
        return {
            id: null,
            auctionBatch: [],
            bidder: "",
            amount: null
        }
    }
}