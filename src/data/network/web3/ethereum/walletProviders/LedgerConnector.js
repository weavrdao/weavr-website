const { ethers } = require("ethers");



export class LedgerConnector {
  constructor(ledgerApp) {
    this.provider = ledgerApp;
    // this.getCoinbaseEthereumAddress()
    // this.getChainId()
  }

  getAddress = async () => {
    try {
      let i;
      for(i=0; i<10; i++) {
        const address = await this.provider.getAddress("44'/60'/"+i+"'/0/0").then(o => o.address)
        console.log(address)
      }
      return await this.provider.getAddress("44'/60'/"+i+"'/0/0").then(o => o.address)
    } catch (error) {}
  };

  getChainId = async () => {
    try {
      // Get current chain ID for connected wallet
      const chainId = await this.provider.request({
        method: "eth_chainId",
      });
      this.chainId = Number(chainId);
    } catch (error) {
      this.error = error;
    }
  };

  getSigner = async (chainId) => {
    const [provider, account] = await Promise.all([
      this.provider,
      await this.getAddress(),
    ]);
    console.log(provider, account);
    return new ethers.providers.Web3Provider(provider, chainId).getSigner(
      account
    );
  };

  getEthBalance = async () => {
    this.provider
      .request({
        method: "eth_getBalance",
        params: [this.account || (await this.getAddress()), "latest"],
      })
      .then((response) => {
        const accounts = response;
        console.log(`User's bal is ${accounts}`);
        return response;
      });
  };
}

export default MetaMaskConnector;
