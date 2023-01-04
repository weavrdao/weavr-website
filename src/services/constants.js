export const _NETWORKS = {
  arbitrum: { 
    name: "Arbitrum One", 
    id: 42161, 
    graph: "https://api.thegraph.com/subgraphs/name/abstrucked/weavr_goerli",
    contracts: {
      TOKEN_ADDRESS:"0x90BE6F8f30931322e60b913ecE49d1724D996054",
      BEACON_ADDRESS:"0x09f78bbefec822c6d81efb7a1474dee5727cc610",
      WEAVR:"0x43240c0f5dedb375afd28206e02110e8fed8cFc0",
      THREAD_DEPLOYER:"0xB32469F1fba93806C60d8c736EB5830BfE7b5fD4",
      BOND:"0xCe5A042ED87Ed92AFE33e3D4fFf600e39d0Cef2F",
      FRABRIC_CODE:"0x117b32BeCE1d46A45fE55470B22fD7C019691a58",
      TRADE_TOKEN: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
    }
  },
  arbitrum_goerli: { 
    name: "Arbitrum Goerli Testnet", 
    id: 421613, 
    graph: "https://api.thegraph.com/subgraphs/name/abstrucked/arbitrum-goerli",
    contracts: {
      TOKEN_ADDRESS:"0x81723083222A35091Cbca6400a1c104cc28934a4",
      BEACON:"0x5A2D7Bdd03F3d5Ead6eaA8B11995713d373Ce2bb",
      WEAVR:"0x1c537448C8E3a631821Fe543e6DD5d16F74eafCe",
      THREAD_DEPLOYER:"0xa12EE7B34a973222cf952e4813928abCEA01CDA2",
      BOND:"0xA92F9C64e1216359b5Bdd1A40357beb51E079c0d",
      FRABRIC_CODE:"0x7338eA4B2837Fe57a7576Af6B53389e5f3332efA",
      TRADE_TOKEN: "0xaa72fbFa8120Bb295A126C34348bb3d018c70efD"
    }
  },
  goerli: { 
    name: "Goerli", 
    id: 5, 
    graph: "https://api.thegraph.com/subgraphs/name/0xnshuman/frabric-goerli",
    contracts: {
      TOKEN_ADDRESS:"0x9018f685FdceE5d8A4Db8420C456c7CfBE42352E",
      BEACON:"0x54e59bB020b4607f752F51F8Ce3C734A6E8650fC",
      WEAVR:"0xC3F52C10ca3f76e53496aFED490a0D672Fd3D5e9",
      THREAD_DEPLOYER:"0x0545608D01fdEF4b0E9564E00e525DAa9438E4Bc",
      BOND:"0xa875Fa4a7BbCA6e63f7DFc9df9839a752283d439",
      FRABRIC_CODE:"0x3bdA099e802152d9FD0EAd7716fF4c78FC841Cf0",
      TRADE_TOKEN: "0xd35cceead182dcee0f148ebac9447da2c4d449c4"
    }
  },

  ethereum: { name: "Ethereum", id: 1 },
  rinkeby: { name: "Rinkeby", id: 4 },
  polygon: { name: "Polygon", id: 137 },
  optimism: { name: "Optimism", id: 10 },
  avalanche: { name: "Avalanche", id: 43114 },
};
export const DAO = "weavr";
export const GUEST = "0x0000000000000000000000000000000000000000";
export const NETWORK = _NETWORKS.arbitrum_goerli;
export const CONTRACTS = NETWORK.contracts;

