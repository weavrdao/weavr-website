import { Model } from "vue-mc";

/**
 * Frabric ERC20 Balance model
 */

export default class FrabricERC20Balance extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            frabricERC20: [],
            holder: [],
            amount: null,
            transfersFrom: [],
            transfersTo: []
        }
    }
}