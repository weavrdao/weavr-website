import { Model } from "vue-mc";

/**
 * Executed Order model
 */

export default class ExecutedOrder extends Model {

    // Default attribute that defines the "empty" state.
    defaults() {
        return {
            id: null,
            frabricERC20: [],
            blockTimeStamp: null,
            orderer: "",
            executor: "",
            price: null,
            amount: null
        }
    }
}