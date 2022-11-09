const WEAVR = process.env.VUE_APP_WEAVR_ADDRESS;
const FRBC = process.env.VUE_APP_TOKEN_ADDRESS;
const THREAD_DEPLOYER = process.env.VUE_APP_THREAD_DEPLOYER_ADDRESS;
const BOND = process.env.VUE_APP_BOND_ADDRESS;
const BEACON = process.env.VUE_APP_BEACON_ADDRESS;
const FRABRIC_CODE = process.env.VUE_APP_FRABRIC_CODE_ADDRESS;
const TOKEN_ADDRESS = process.env.VUE_APP_TOKEN_ADDRESS;

export const CONTRACTS = {
  WEAVR,
  FRBC,
  THREAD_DEPLOYER,
  BOND,
  BEACON,
  FRABRIC_CODE,
  TOKEN_ADDRESS,
};
export const _NETWORKS = {
  arbitrum: { name: "Arbitrum One", id: 42161, graph: process.env.VUE_APP_GRAPH_PROD },
  arbitrum_goerli: { name: "Arbitrum Goerli Testnet", id: 421613, graph: process.env.VUE_APP_GRAPH_TEST },
  ethereum: { name: "Ethereum", id: 1 },
  rinkeby: { name: "Rinkeby", id: 4 },
  goerli: { name: "Goerli", id: 5 },
  polygon: { name: "Polygon", id: 137 },
  optimism: { name: "Optimism", id: 10 },
  avalanche: { name: "Avalanche", id: 43114 },
}
export const DAO = "weavr";
export const NETWORK = _NETWORKS.arbitrum
