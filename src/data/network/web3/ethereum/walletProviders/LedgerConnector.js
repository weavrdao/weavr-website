const { ethers } = require("ethers");



export class LedgerConnector {
  
  constructor(provider, app, path) {
    this.provider = provider;
    this.app = app;
    this.path = path;

  }
  
    
  getAddress = async () => {
    try {
      let i;
      // for(i=0; i<10; i++) {
      //   const address = await this.provider.getAddress("44'/60'/"+i+"'/0/0").then(o => o.address)
      //   console.log(address)
      // }
      return await this.app.getAddress(this.path).then(o => o.address)
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
    const address = await this.getAddress();
    const block = this.provider.get
    const balance = this.provider.prepareRequest("eth_getBalance", [address, "latest"])
    console.log(balance);
  };
}

export default LedgerConnector;
