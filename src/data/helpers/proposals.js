import {ProposalTypes, PASSED} from "@/models/common";
import {VoteType} from "@/models/vote";
import { ethers } from "ethers";

// eslint-disable-next-line max-lines-per-function
export function getProposalTypeStyling(proposalType) {
  switch (proposalType) {
  case ProposalTypes.Paper:
    return {
      text: "Paper",
      class: "paper",
    };
  case ProposalTypes.DescriptorChange:
    return {
      text: "Descriptor Change",
      class: "descriptorChange",
    };
  case ProposalTypes.Upgrade:
    return {
      text: "Upgrade",
      class: "upgrade"
    };
  case ProposalTypes.Participant:
    return {
      text: "Participant",
      class: "participant"
    };
  case ProposalTypes.GovernorChange:
    return {
      text: "Governor Change",
      class: "governorChange"
    };
  case ProposalTypes.ParticipantRemoval:
    return {
      text: "Participant Removal",
      class: "participantRemoval"
    }
  case ProposalTypes.Dissolution:
    return {
      text: "Dissolution",
      class: "dissolution"
    };
  case ProposalTypes.TokenAction:
    return {
      text: "Token Action",
      class: "token-action",
    };
  case ProposalTypes.Thread:
    return {
      text: "Thread",
      class: "thread",
    }
  default:
    return {
      text: "Unknown Type",
      class: "unknown",
    }
  }
}

export function padWithZeroes(number) {
  return (number < 10 ? "0" + number : number);
}

export function dateStringForTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  let suffix = " AM";

  if (hours > 11) {
    hours = 24 - hours;
    suffix = " PM";
  }

  return `${date.getFullYear()}-${padWithZeroes(
    date.getMonth() + 1
  )}-${padWithZeroes(date.getDate())}, ${padWithZeroes(
    hours
  )}:${padWithZeroes(minutes)} ${suffix}`;
}

export function getVotes(proposal) {
  const votes = Array.from(proposal.votes.values())
  const yesVoteShares = votes.reduce((total, vote) => {
    return vote.voteDirection === VoteType.Yes ? total + Number(vote.count) : total;
  }, 0);
  const noVoteShares = votes.reduce((total, vote) => {
    return vote.voteDirection === VoteType.No ? total + Number(vote.count) : total;
  }, 0);
  console.log({yesVoteShares: yesVoteShares, noVoteShares: noVoteShares})
  return {
    yes: {
      count: Number(yesVoteShares).toFixed(0),
      percentage: (yesVoteShares / (yesVoteShares + noVoteShares)) * 100,
    },
    no: {
      count: Number(noVoteShares).toFixed(0),
      percentage: (noVoteShares / (yesVoteShares + noVoteShares)) * 100,
    },
  };
}

export function getResult(proposal) {
  const votes = getVotes(proposal);
  console.log({ yes: votes.yes.count, no: votes.yes.count })
  if (votes.yes.count > votes.no.count) {
    return PASSED.Yes;
  } else  {
    return PASSED.No;
  }
}

export function hasEnded(proposal) {
  let now = new Date().getTime() / 1000;
  return proposal.endTimestamp < now;
}
