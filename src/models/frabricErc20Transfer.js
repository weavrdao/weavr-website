import { Model } from "vue-mc";

/**
 * Frabric ERC20 Transfer model
 */

export default class FrabricERC20Transfer extends Model {

    // Default attributes that define the "empty" state.
    defaults () {
        return {
            id: null,
            timestamp: null,
            frabricERC20: [],
            from: [],
            fromBalance: [],
            to: [],
            toBalance: [],
            amount: null
        }
    }
}