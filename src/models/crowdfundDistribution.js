import { Model } from "vue-mc";

/**
 * Crowdfund Distribution Model
 */

export default class CrowdfundDistribution extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            crowdfund: [],
            distribution: []
        }
    }
}