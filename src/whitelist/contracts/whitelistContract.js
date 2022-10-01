const whitelistAbi = [
  "function whitelisted(address person) view returns (bool)"
];

class WhitelistInterface {
  constructor(
    ethereumClient,
    contractAddress,
  ) {
    this.contract = ethereumClient.getContract(contractAddress, whitelistAbi);
  }

  async whitelisted(address) {
    const isWhitelisted = await this.contract.whitelisted(address);
    return isWhitelisted;
  }
}

export default WhitelistInterface;