import { Model } from "vue-mc";

/**
 * Crowdfund Withdrawl model
 */

export default class CrowdFundWithdrawl extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            crowdfund: [],
            depositor: "",
            amount: null
        }
    }
}