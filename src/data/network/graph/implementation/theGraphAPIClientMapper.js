/* eslint-disable class-methods-use-this */
/* eslint-disable max-lines-per-function */
import GraphQLAPIMapper from "../graphQLAPIMapper"
import Asset from "../../../../models/asset"
import { getIpfsHashFromBytes32 } from "../../storage/ipfs/common"
import { ProposalTypes } from "../../../../models/common"
import { Vote } from "../../../../models/vote"
import { PaperProposal } from "../../../../models/proposals/paperProposal";
import { UpgradeProposal } from "../../../../models/proposals/upgradeProposal";
import { ParticipantProposal } from "../../../../models/proposals/participantProposal";
import { TokenActionProposal } from "../../../../models/proposals/tokenActionProposal";

class TheGraphAPIMapper extends GraphQLAPIMapper {

  // TODO(bill): This is invalid with the current data model and needs to be rewritten
  mapAssets(rawAssets) {
    console.log(rawAssets)
  }

  // Map all proposal kinds
  mapProposals(rawProposals) {
    console.log(rawProposals);
    if (!rawProposals || rawProposals.length < 1) return [];

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
          creator,
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
          creator,
          endTimestamp,
          startTimestamp,
          votes: this.mapVotes(votes),
          supermajority,
          state,
          info: getIpfsHashFromBytes32(info),
          type: ProposalTypes.Paper,
        })
      })
    } catch (e) {
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
          creator,
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
          creator,
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
    } catch (e) {
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
          creator,
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
          creator,
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
    } catch (e) {
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
          creator,
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
          creator,
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
    } catch (e) {
      console.log("Issue parsing participant proposals");
      console.error(e);
    }
    return tokenActionProposals;
  }

  // Map raw vote array to array of vue-mc models 
  mapVotes(rawVotes) {
    console.log(rawVotes);
    const votes = new Votes();
    rawVotes.forEach(({
      id,
      voter,
      voteDirection,
      count,
    }) => {
      votes.add(new Vote({
        id,
        voter,
        voteDirection,
        count,
      }))
    });
    return votes;
  }
}

export default TheGraphAPIMapper;
