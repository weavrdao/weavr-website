const WEAVR = process.env.VUE_APP_WEAVR_ADDRESS;
const FRBC = process.env.VUE_APP_TOKEN_ADDRESS;
const THREAD_DEPLOYER = process.env.VUE_APP_THREAD_DEPLOYER_ADDRESS;
const BOND = process.env.VUE_APP_BOND_ADDRESS;
const BEACON = process.env.VUE_APP_BEACON_ADDRESS;
const FRABRIC_CODE = process.env.VUE_APP_FRABRIC_CODE_ADDRESS;
const TOKEN_ADDRESS = process.env.VUE_APP_TOKEN_ADDRESS;


export const _NETWORKS = {
  arbitrum: { 
    name: "Arbitrum One", 
    id: 42161, 
    graph: "https://api.thegraph.com/subgraphs/name/abstrucked/weavr_goerli",
    contracts: {
      TOKEN_ADDRESS:"0x90BE6F8f30931322e60b913ecE49d1724D996054",
      BEACON_ADDRESS:"0x09f78bbefec822c6d81efb7a1474dee5727cc610",
      WEAVR_ADDRESS:"0x43240c0f5dedb375afd28206e02110e8fed8cFc0",
      THREAD_DEPLOYER_ADDRESS:"0xB32469F1fba93806C60d8c736EB5830BfE7b5fD4",
      BOND_ADDRESS:"0xCe5A042ED87Ed92AFE33e3D4fFf600e39d0Cef2F",
      FRABRIC_CODE_ADDRESS:"0x117b32BeCE1d46A45fE55470B22fD7C019691a58",
      TRADE_TOKEN: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
    }
  },
  arbitrum_goerli: { 
    name: "Arbitrum Goerli Testnet", 
    id: 421613, 
    graph: "https://api.thegraph.com/subgraphs/name/abstrucked/arbitrum-goerli",
    contracts: {
      FRBC:"0x81723083222A35091Cbca6400a1c104cc28934a4",
      BEACON:"0x5A2D7Bdd03F3d5Ead6eaA8B11995713d373Ce2bb",
      WEAVR:"0x1c537448C8E3a631821Fe543e6DD5d16F74eafCe",
      THREAD_DEPLOYER:"0xa12EE7B34a973222cf952e4813928abCEA01CDA2",
      BOND:"0xA92F9C64e1216359b5Bdd1A40357beb51E079c0d",
      FRABRIC_CODE:"0x7338eA4B2837Fe57a7576Af6B53389e5f3332efA",
      TRADE_TOKEN: "0xaa72fbFa8120Bb295A126C34348bb3d018c70efD"
    }
  },
  ethereum: { name: "Ethereum", id: 1 },
  rinkeby: { name: "Rinkeby", id: 4 },
  goerli: { name: "Goerli", id: 5 },
  polygon: { name: "Polygon", id: 137 },
  optimism: { name: "Optimism", id: 10 },
  avalanche: { name: "Avalanche", id: 43114 },
};
export const DAO = "weavr";
export const GUEST = "0x0000000000000000000000000000000000000000";
export const NETWORK = _NETWORKS.arbitrum_goerli;
export const CONTRACTS = NETWORK.contracts;