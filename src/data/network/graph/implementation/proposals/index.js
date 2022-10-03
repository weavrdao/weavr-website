import { getIpfsHashFromBytes32 } from "../../../storage/ipfs/common"
import { ProposalTypes } from "../../../../../models/common"
import { Vote } from "../../../../../models/vote"
import { PaperProposal } from "../../../../../models/proposals/paperProposal";
import { UpgradeProposal } from "../../../../../models/proposals/upgradeProposal";
import { ParticipantProposal } from "../../../../../models/proposals/participantProposal";
import { TokenActionProposal } from "../../../../../models/proposals/tokenActionProposal";
import { ThreadProposal } from "../../../../../models/proposals/threadProposal"
// Map raw vote array to array of vue-mc models 
export function mapVotes(rawVotes) {
  return rawVotes.map(({
    id,
    voter,
    voteDirection,
    count,
  }) => new Vote({
    id,
    voter,
    voteDirection,
    count,
  }));
}




// Map raw paper proposals to array of vue-mc models 
export function mapPaperProposals(rawPaperProposals) {
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
      const mappedVotes = mapVotes(votes);
      const ifpsPath = getIpfsHashFromBytes32(info);
      return new PaperProposal(
        parseInt(id, 16),
        null, // thread
        null, // frabric
        creator,
        ProposalTypes.Paper,
        state,
        mappedVotes,
        supermajority,
        startTimestamp,
        endTimestamp,
        ifpsPath,
      )
    })
  } catch (e) {
    console.log("Issue parsing paper proposals");
    console.error(e);
  }
  return paperProposals;
}

// Map raw upgrade proposals to array of vue-mc models 
export function mapUpgradeProposals(rawUpgradeProposals) {
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
      const mappedVotes = mapVotes(votes);
      const ifpsPath = getIpfsHashFromBytes32(info);
      return new UpgradeProposal(
        parseInt(id, 16),
        null, // thread
        null, // frabric
        creator,
        ProposalTypes.Upgrade,
        state,
        mappedVotes,
        supermajority,
        startTimestamp,
        endTimestamp,
        ifpsPath,
        beacon,
        instance,
        parseInt(version),
        code,
        data,
      )
    })
  } catch (e) {
    console.log("Issue parsing upgrade proposals");
    console.error(e);
  }
  return upgradeProposals;
}

// Map raw participant proposals to array of vue-mc models 
export function mapParticipantProposals(rawParticipantProposals) {
  let participantProposals = [];
  try {
    participantProposals = rawParticipantProposals.map(({
      participant,
      participantType,
      proposer,
      baseProposal: {
        id,
        endTimestamp, // Not being pulled?
        info,
        startTimestamp,
        state,
        supermajority,
        votes,
      }
    }) => {
      const mappedVotes = mapVotes(votes);
      const ifpsPath = getIpfsHashFromBytes32(info);
      return new ParticipantProposal(
        parseInt(id, 16),
        null, // thread
        null, // frabric
        proposer,
        ProposalTypes.Participant,
        state,
        mappedVotes,
        supermajority,
        startTimestamp,
        endTimestamp,
        ifpsPath,
        participantType,
        participant,
        proposer,
      )
    })
  } catch (e) {
    console.log("Issue parsing participant proposals");
    console.error(e);
  }
  return participantProposals;
}

// Map raw token action proposals to array of vue-mc models 
export function mapTokenActionProposals(rawTokenActionProposals) {
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
      const mappedVotes = mapVotes(votes);
      const ifpsPath = getIpfsHashFromBytes32(info);
      return new TokenActionProposal(
        parseInt(id, 16),
        null, // thread
        null, // frabric
        creator,
        ProposalTypes.TokenAction,
        state,
        mappedVotes,
        supermajority,
        startTimestamp,
        endTimestamp,
        ifpsPath,
        token,
        target,
        mint,
        price,
        amount,
      )
    })
  } catch (e) {
    console.log("Issue parsing participant proposals");
    console.error(e);
  }
  return tokenActionProposals;
}
export function mapThreadProposals(rawThreadProposals) {
  let threadProposals = [];
  try {
    console.log(rawThreadProposals.startTimestamp);
    threadProposals = rawThreadProposals.map(({
      id,
      governor,
      name,
      symbol,
      descriptor,
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
      const mappedVotes = mapVotes(votes);
      const infoPath = getIpfsHashFromBytes32(info);
      const descriptorPath = getIpfsHashFromBytes32(descriptor);
      return new ThreadProposal(
        parseInt(id, 16),
        null, // thread
        null, // frabric
        creator,
        ProposalTypes.Thread,
        state,
        mappedVotes,
        supermajority,
        startTimestamp,
        endTimestamp,
        infoPath,
        governor,
        name,
        symbol,
        descriptorPath,
      )
    })
  } catch (e) {
    console.log("Issue parsing thread proposals");
    console.error(e);
  }
  return threadProposals;
}
