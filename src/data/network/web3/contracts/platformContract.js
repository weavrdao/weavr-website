import EthereumClient from "../ethereum/ethereumClient"

const contractAddress = "0x0" // TODO: ADD CONTRACT ADDRESS
const contractAbi = [
  
]
const startBlock = 0 // TODO: ADD CONTRACT DEPLOYMENT BLOCK TO AVOID QUERYING EXTRA HISTORY

/**
 * Platform contract
 * @param {EthereumClient} ethereumClient Ethereum client
 */
class PlatformContract {
  constructor(
    ethereumClient
  ) {
    this.contract = ethereumClient.getContract(contractAddress, contractAbi)
    this.mutableContract = ethereumClient.getMutableContract(this.contract)
  }
}

export default PlatformContract
