/* eslint-disable class-methods-use-this */
/* eslint-disable max-lines-per-function */
import GraphQLAPIMapper from "../graphQLAPIMapper"
import Asset  from "../../../../models/asset"
import { getIpfsHashFromBytes32 } from "../../storage/ipfs/common"
import { ProposalTypes } from "../../../../models/common"
import { Vote }  from "../../../../models/vote"
import { PaperProposal } from "../../../../models/proposals/paperProposal";
import { UpgradeProposal } from "../../../../models/proposals/upgradeProposal";
import { ParticipantProposal } from "../../../../models/proposals/participantProposal";
import { TokenActionProposal } from "../../../../models/proposals/tokenActionProposal";

class TheGraphAPIMapper extends GraphQLAPIMapper {

  // TODO(bill): This is invalid with the current data model and needs to be rewritten
  mapAssets(rawAssets) {
    if (!rawAssets || rawAssets.length < 1) {
      return []
    }

    return rawAssets
      .map(rawAsset => {
        const proposals = this.mapProposals(rawAsset.proposals)

        var ownersMap = new Map()
        rawAsset.owners
          .forEach(ownership => { 
            ownersMap.set(ownership.owner, ownership.shares)
          })

        // let marketOrders = this.mapMarketOrders(rawAsset.marketOrders)

        return new Asset(
          rawAsset.id,
          rawAsset.mintedAsset.dataURI,
          rawAsset.contract,
          rawAsset.symbol,
          rawAsset.numOfShares,
          ownersMap,
          [], // marketOrders
          proposals
        )
      })
  }

  // Map all proposal kinds
  mapProposals(rawProposals) {
    if (!rawProposals || rawProposals.length < 1) {
      return [];
    }
  
    const paperProposals = this.mapPaperProposals(rawProposals.paperProposals);
    const upgradeProposals = this.mapUpgradeProposals(rawProposals.upgradeProposals);
    const participantProposals = this.mapParticipantProposals(rawProposals.participantProposals);
    const tokenActionProposals = this.mapTokenActionProposals(rawProposals.tokenActionProposals);

    return [
      ...paperProposals,
      ...upgradeProposals,
      ...participantProposals,
      ...tokenActionProposals,
    ];
  }

  // Map raw paper proposals to array of vue-mc models 
  mapPaperProposals(rawPaperProposals) {
    let paperProposals = [];
    try {
      paperProposals = rawPaperProposals.map(({
        id,
        baseProposal: {
          creator: creatorAddress,
          endTimestamp,
          info,
          startTimestamp,
          state,
          supermajority,
          votes,
        }
      }) => {
        return new PaperProposal({
          id,
          creatorAddress,
          endTimestamp,
          startTimestamp,
          votes: this.mapVotes(votes),
          supermajority,
          state,
          info: getIpfsHashFromBytes32(info),
          type: ProposalTypes.Paper,
        })
      })
    } catch(e) {
      console.log("Issue parsing paper proposals");
      console.error(e);
    }
    return paperProposals;
  }

  // Map raw upgrade proposals to array of vue-mc models 
  mapUpgradeProposals(rawUpgradeProposals) {
    let upgradeProposals = [];
    try {
      upgradeProposals = rawUpgradeProposals.map(({
        id,
        beacon,
        code,
        data,
        instance,
        version,
        baseProposal: {
          creator: creatorAddress,
          endTimestamp,
          info,
          startTimestamp,
          state,
          supermajority,
          votes,
        }
      }) => {
        return new UpgradeProposal({
          id,
          beacon,
          code,
          data,
          instance,
          creatorAddress,
          endTimestamp,
          startTimestamp,
          votes: this.mapVotes(votes),
          supermajority,
          state,
          info: getIpfsHashFromBytes32(info),
          version,
          type: ProposalTypes.Upgrade,
        })
      })
    } catch(e) {
      console.log("Issue parsing upgrade proposals");
      console.error(e);
    }
    return upgradeProposals;
  }

  // Map raw participant proposals to array of vue-mc models 
  mapParticipantProposals(rawParticipantProposals) {
    let participantProposals = [];
    try {
      participantProposals = rawParticipantProposals.map(({
        id,
        participant,
        proposer,
        baseProposal: {
          creator: creatorAddress,
          endTimestamp,
          info,
          startTimestamp,
          state,
          supermajority,
          votes,
        }
      }) => {
        return new ParticipantProposal({
          id,
          creatorAddress,
          participant,
          proposer,
          endTimestamp,
          startTimestamp,
          votes: this.mapVotes(votes),
          supermajority,
          state,
          info: getIpfsHashFromBytes32(info),
          type: ProposalTypes.Participant,
        })
      })
    } catch(e) {
      console.log("Issue parsing participant proposals");
      console.error(e);
    }
    return participantProposals;
  }

  // Map raw token action proposals to array of vue-mc models 
  mapTokenActionProposals(rawTokenActionProposals) {
    let tokenActionProposals = [];
    try {
      tokenActionProposals = rawTokenActionProposals.map(({
        id,
        amount,
        mint,
        price,
        target,
        token,
        baseProposal: {
          creator: creatorAddress,
          endTimestamp,
          info,
          startTimestamp,
          state,
          supermajority,
          votes,
        }
      }) => {
        return new TokenActionProposal({
          id,
          creatorAddress,
          amount,
          mint,
          price,
          target,
          token,
          startTimestamp,
          endTimestamp,
          votes: this.mapVotes(votes),
          supermajority,
          state,
          info: getIpfsHashFromBytes32(info),
          type: ProposalTypes.TokenAction,
        })
      })
    } catch(e) {
      console.log("Issue parsing participant proposals");
      console.error(e);
    }
    return tokenActionProposals;
  }

  // Map raw vote array to array of vue-mc models 
  mapVotes(rawVotes) {
    return rawVotes.map(rawVote => new Vote(rawVote)) || [];
  }
}

export default TheGraphAPIMapper