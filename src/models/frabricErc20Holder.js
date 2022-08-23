import { Model } from "vue-mc";

/**
 * Frabric ERC20 Holder model
 */

export default class FrabricERC20Holder extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            balances: [],
            transferFromEvents: [],
            transferToEvents: []
        }
    }
}