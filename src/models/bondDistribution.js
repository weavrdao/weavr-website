import { Model } from "vue-mc";

/**
 * Bond Distribution model
 */

export default class BondDistribution extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            bond: [],
            distribution: []
        }
    }
}