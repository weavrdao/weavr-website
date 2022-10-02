const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "ActiveProposal",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "oldName",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "newName",
        type: "bytes32",
      },
    ],
    name: "DifferentContract",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lengthA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lengthB",
        type: "uint256",
      },
    ],
    name: "DifferentLengths",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "called",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        internalType: "bytes",
        name: "error",
        type: "bytes",
      },
    ],
    name: "ExternalCallFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "InactiveProposal",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        internalType: "enum IFrabric.ParticipantType",
        name: "status",
        type: "uint8",
      },
    ],
    name: "InvalidKYCSignature",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "InvalidName",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "enum IFrabric.ParticipantType",
        name: "pType",
        type: "uint8",
      },
    ],
    name: "InvalidParticipantType",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "fee",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "max",
        type: "uint8",
      },
    ],
    name: "InvalidRemovalFee",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "version",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedVersion",
        type: "uint256",
      },
    ],
    name: "InvalidVersion",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "participant",
        type: "address",
      },
    ],
    name: "Irremovable",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "specified",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "MintingDifferentToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "governor",
        type: "address",
      },
      {
        internalType: "enum IFrabricCore.GovernorStatus",
        name: "status",
        type: "uint8",
      },
    ],
    name: "NotActiveGovernor",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "NotBeacon",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
    ],
    name: "NotEnoughParticipation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "person",
        type: "address",
      },
    ],
    name: "NotKYC",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "address",
        name: "trader",
        type: "address",
      },
    ],
    name: "NotOrderTrader",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "enum IDAOCore.ProposalState",
        name: "state",
        type: "uint8",
      },
    ],
    name: "NotQueued",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "NotRoundAmount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "version",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "versionRequired",
        type: "uint256",
      },
    ],
    name: "NotUpgraded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "person",
        type: "address",
      },
    ],
    name: "NotWhitelisted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "NotYesVote",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "voucher",
        type: "address",
      },
    ],
    name: "OutOfVouchers",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "participant",
        type: "address",
      },
    ],
    name: "ParticipantAlreadyApproved",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "int256",
        name: "votes",
        type: "int256",
      },
    ],
    name: "ProposalFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "int256",
        name: "votes",
        type: "int256",
      },
    ],
    name: "ProposalPassed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "queuedUntil",
        type: "uint256",
      },
    ],
    name: "StillQueued",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "address",
        name: "expected",
        type: "address",
      },
    ],
    name: "TargetMalleability",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "label",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "enumValue",
        type: "uint256",
      },
    ],
    name: "UnhandledEnumCase",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "UnsortedVoter",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4",
      },
    ],
    name: "UnsupportedInterface",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAmount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "participant",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "slash",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BondRemovalProposal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "enum IFrabric.ParticipantType",
        name: "participantType",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "participant",
        type: "address",
      },
    ],
    name: "ParticipantChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "enum IFrabric.ParticipantType",
        name: "participantType",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "participant",
        type: "address",
      },
    ],
    name: "ParticipantProposal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "participant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "fee",
        type: "uint8",
      },
    ],
    name: "ParticipantRemovalProposal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalType",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "supermajority",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "info",
        type: "bytes32",
      },
    ],
    name: "Proposal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "enum IDAOCore.ProposalState",
        name: "state",
        type: "uint8",
      },
    ],
    name: "ProposalStateChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "variant",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "governor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "descriptor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "ThreadProposal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "thread",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalType",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "ThreadProposalProposal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "mint",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenActionProposal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "instance",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "version",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "code",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "UpgradeProposal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "enum IDAO.VoteDirection",
        name: "direction",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "votes",
        type: "uint112",
      },
    ],
    name: "Vote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voucher",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "vouchee",
        type: "address",
      },
    ],
    name: "Vouch",
    type: "event",
  },
  {
    inputs: [],
    name: "bond",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "proposer",
        type: "address",
      },
    ],
    name: "canPropose",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "voters",
        type: "address[]",
      },
    ],
    name: "cancelProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "commonProposalBit",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "completeProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractName",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "erc20",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "governor",
    outputs: [
      {
        internalType: "enum IFrabricCore.GovernorStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lapsePeriod",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxRemovalFee",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "netVotes",
    outputs: [
      {
        internalType: "int112",
        name: "",
        type: "int112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextProposalID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "participant",
    outputs: [
      {
        internalType: "enum IFrabric.ParticipantType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "passed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "proposalActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_governor",
        type: "address",
      },
      {
        internalType: "bool",
        name: "slash",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "info",
        type: "bytes32",
      },
    ],
    name: "proposeBondRemoval",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "supermajority",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "info",
        type: "bytes32",
      },
    ],
    name: "proposePaper",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IFrabric.ParticipantType",
        name: "participantType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_participant",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "info",
        type: "bytes32",
      },
    ],
    name: "proposeParticipant",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "participant",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "removalFee",
        type: "uint8",
      },
      {
        internalType: "bytes[]",
        name: "signatures",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "info",
        type: "bytes32",
      },
    ],
    name: "proposeParticipantRemoval",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "variant",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "descriptor",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "info",
        type: "bytes32",
      },
    ],
    name: "proposeThread",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "thread",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_proposalType",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "info",
        type: "bytes32",
      },
    ],
    name: "proposeThreadProposal",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "bool",
        name: "mint",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "info",
        type: "bytes32",
      },
    ],
    name: "proposeTokenAction",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "beacon",
        type: "address",
      },
      {
        internalType: "address",
        name: "instance",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "version",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "code",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "info",
        type: "bytes32",
      },
    ],
    name: "proposeUpgrade",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "queuePeriod",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "queueProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "requiredParticipation",
    outputs: [
      {
        internalType: "uint112",
        name: "",
        type: "uint112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "supermajorityRequired",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "threadDeployer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "totalVotes",
    outputs: [
      {
        internalType: "uint112",
        name: "",
        type: "uint112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_version",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_version",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "validateUpgrade",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IFrabric.ParticipantType",
        name: "pType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_participant",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "kycHash",
        type: "bytes32",
      },
    ],
    name: "verify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "int112[]",
        name: "votes",
        type: "int112[]",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "voteBlock",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "voteRecord",
    outputs: [
      {
        internalType: "int112",
        name: "",
        type: "int112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingPeriod",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_participant",
        type: "address",
      },
    ],
    name: "vouch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "vouchers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "withdrawProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default abi;
