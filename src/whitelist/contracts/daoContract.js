const simpleWeavrAbi = [
  "funciton erc20() view returns (address)"
]

class WeavrContract {
  constructor(
    ethereumClient,
    contractAddress,
  ) {
    this.contract = ethereumClient.getContract(contractAddress, simpleWeavrAbi);
  }

  async erc20() {
    const erc20Address = await this.contract.erc20();
    return erc20Address;
  }
  
}

export default WeavrContract;
