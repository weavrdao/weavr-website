import { Model } from "vue-mc";

/**
 * Auction Batch model
 */

export default class AuctionBatch extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            auction: [],
            bids: [],
            isComplete: false
        }
    }
}