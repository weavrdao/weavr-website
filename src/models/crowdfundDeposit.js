import { Model } from "vue-mc";

/**
 * Crowdfund Deposit model
 */

export default class CrowdfundDeposit extends Model {

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