module.exports = {
  WhitelistStatus: {
    Null: 0,
    Removed: 1,
    Whitelisted: 2,
    KYC: 3
  },

  OrderType: {
    Null: 0,
    Buy: 1,
    Sell: 2,
    counter: type => (type % 2) + 1
  },

  ProposalState: {
    Null: 0,
    Active: 1,
    Queued: 2,
    Executed: 3,
    Cancelled: 4
  },

  VoteDirection: {
    Abstain: 0,
    Yes: 1,
    No: 2
  },

  CommonProposalType: {
    Paper: 256,
    Upgrade: 257,
    TokenAction: 258,
    ParticipantRemoval: 259
  },

  FrabricProposalType: {
    Participant: 0,
    BondRemoval: 1,
    Thread: 2,
    ThreadProposal: 3
  },

  ParticipantType: {
    Null: 0,
    Removed: 1,
    Genesis: 2,
    KYC: 3,
    Governor: 4,
    Voucher: 5,
    Individual: 6,
    Corporation: 7
  },

  GovernorStatus: {
    Null: 0,
    Active: 1,
    Removed: 2
  },

  MintType: {
    Yes: true,
    No: false,
  },

  ThreadProposalType: {
    DescriptorChange: 0,
    FrabricChange: 1,
    GovernorChange: 2,
    EcosystemLeaveWithUpgrades: 3,
    Dissolution: 4
  },

  ProposalTypes: {
    Upgrade: "upgrade",
    Participant: "participant",
    TokenAction: "token",
    Paper: "paper",
    Thread: "thread",
  },

  PASSED: {
    Yes: 0,
    No: 1,
    Tie: 2,
  },
} 
