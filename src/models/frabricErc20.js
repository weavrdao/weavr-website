import { Model } from "vue-mc";

/**
 * Frabric ERC20 model
 */

export default class FrabricERC20 extends Model {

    // Default attribute that define the "empty" state.
    defaults() {
        return {
            id: null,
            name: "",
            symbol: "",
            decimals: null,
            supply: null,
            tradeToken: "",
            globalAcceptance: false,
            whitelist: [],
            freezelist: [],
            orderBook: [],
            executedOrders: [],
            balances: []
        }
    }
}