const simpleWeavrAbi = [
  "function erc20() view returns (address)"
]

class WeavrContract {
  constructor(
    ethereumClient,
    contractAddress,
  ) {
    this.contract = ethereumClient.getContract(contractAddress, simpleWeavrAbi);
  }

  async getERC20Address() {
    const erc20Address = await this.contract.erc20();
    return erc20Address;
  }
  
}

export default WeavrContract;
