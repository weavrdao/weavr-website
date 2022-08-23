import { Model } from "vue-mc";

/**
 * Crowdfund model
 */

export default class Crowdfund extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            state: [],
            amountDeposited: null,
            target: null,
            thread: [],
            erc20: [],
            deposits: [],
            withdrawals: [],
            distributions: []
        }
    }
}