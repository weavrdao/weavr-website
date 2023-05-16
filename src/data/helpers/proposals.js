import {ProposalTypes, PASSED} from "@/models/common";
import {VoteType} from "@/models/vote";
import { ethers } from "ethers";

export function getProposalTypeStyling(proposalType) {
  switch (proposalType) {
  case ProposalTypes.Paper:
    return {
      text: "Paper",
      class: "paper",
    };
  case ProposalTypes.DescriptorChange:
    return {
      text: "DescriptorChange",
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
  case ProposalTypes.ParticipantRemoval:
    return {
      text: "Participant Removal",
      class: "participantremoval"
    }
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
  var date = new Date(timestamp * 1000);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var suffix = " AM";

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
    // console.log("VOTE:::", ethers.utils.f(vote.count));
    return vote.voteDirection === VoteType.Yes ? total + Number(vote.count) : total;
  }, 0);

  const noVoteShares = votes.reduce((total, vote) => {
    return vote.voteDirection === VoteType.No ? total + Number(vote.count) : total;
  }, 0);
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
  if (votes.yes.count > votes.no.count) {
    return PASSED.Yes;
  } else if (votes.yes.count < votes.no.count) {
    return PASSED.No;
  }
  return PASSED.Tie;
}

export function hasEnded(proposal) {
  let now = new Date().getTime() / 1000;
  return proposal.endTimestamp < now;
}
