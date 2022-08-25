import { ProposalTypes } from "@/models/common";

export function getProposalTypeStyling(proposalType) {
  switch (proposalType) {
    case ProposalTypes.Paper:
      return {
        text: "Paper",
        class: "paper",
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
    case ProposalTypes.TokenAction:
      return {
        text: "Token Action",
        class: "token-action",
      };
    default:
      return {
        text: "Unknown Type",
        class: "unknown",
      }
  }
}
