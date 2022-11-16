const { ethers } = require("ethers");

export class MetaMaskConnector {
  constructor(metaMaskProvider) {
    this.provider = metaMaskProvider;
    // this.getCoinbaseEthereumAddress()
    // this.getChainId()
  }

  getAddress = async () => {
    try {
      return this.provider
        .request({
          method: "eth_requestAccounts",
        })
        .then((response) => {
          const accounts = response;
          console.log(`User's address is ${accounts[0]}`);
          return accounts[0];
        });
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

  signTypedData = async (domain, types, data) => {
    await this.provider._signTypedData(domain, types, data)
  }
  /***********************************************************/
  /* Handle user accounts and accountsChanged (per EIP-1193) */
  /***********************************************************/
  
  
  

  /**********************************************************/
  /* Handle chain (network) and chainChanged (per EIP-1193) */
  /**********************************************************/
  // getChainId = async () => {
  //   const chainId = await this.provider.request({ method: 'eth_chainId' });
  //   this.handleChainChanged(chainId);
  // }
  
  handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }
  
  // handleAccountsChanged(accounts) {
  //   if (accounts.length === 0) {
  //     // MetaMask is locked or the user has not connected any accounts
  //     console.log('Please connect to MetaMask.');
  //   } else if (accounts[0] !== currentAccount) {
  //     currentAccount = accounts[0];
  //     // Do any other work!
  //   }
  // }

  
}


export default MetaMaskConnector;
