const contractAddress = "0x0" // TODO: ADD CONTRACT ADDRESS
const contractAbi = [
  
]

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
