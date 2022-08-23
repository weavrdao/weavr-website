import { Model } from "vue-mc";

/** 
 * Voucher model
 */

export default class Voucher extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            frabric: [],
            signer: "",
            participant: ""
        }
    }
}