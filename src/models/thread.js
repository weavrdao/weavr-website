import { Model } from 'vue-mc';

/**
 * Thread model
 */

export default class Thread extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            contract: "",
            variant: null,
            frabric: [],
            governor: "",
            erc20: [],
            descriptor: "",
            descriptorChangeProposals: [],
            upgradeProposals: [],
            tokenActionProposals: [],
            participantRemovalProposals: [],
            frabricChangeProposals: [],
            governorChangeProposals: [],
            ecosystemLeaveProposals: [],
            dissolutionProposals: []
        }
    }
}