import { Model } from "vue-mc";

/**
 * Price Point model
 */

export default class PricePoint extends Model {

    // Default attribute that defines the "empty" state.
    defaults() {
        return {
            id: null,
            frabricERC20: [],
            price: null,
            type: [],
            totalAmount: null
        }
    }
}