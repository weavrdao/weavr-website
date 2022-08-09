import { Model } from "vue-mc";

/**
 * Whitelist Record model
 */

export default class WhitelistRecord extends Model {

    // Default attribute that defines the "empty" state.
    defaults() {
        return {
            id: null,
            frabricERC20: [],
            person: "",
            kycHash: "",
            removed: false
        }
    }
}