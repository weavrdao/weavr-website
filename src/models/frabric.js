import { Model } from 'vue-mc'

/**
 * Frabric model
 */

export default class Frabric extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            id: null,
            token: [],
            participants: [],
            governorStatuses: [],
            threads: [],
            threadProposals: [],
            participantProposals: [],
            upgradeProposals: [],
            tokenActionProposals: [],
            participantRemovalProposals: [],
            bondRemovalProposals: [],
            threadProposalProposals: [],
            paperProposals: [],
            vouchers: []    
        }
    }
}