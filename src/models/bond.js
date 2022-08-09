import { Model } from "vue-mc";

/**
 * Bond model
 */

export default class Bond extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            holdings: []
        }
    }
}