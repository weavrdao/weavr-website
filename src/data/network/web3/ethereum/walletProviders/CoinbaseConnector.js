const { ethers } = require("ethers");

export class  CoinbaseConnector {

  constructor (coinbaseWeb3Provider){
    this.provider = coinbaseWeb3Provider
    // this.getCoinbaseEthereumAddress()
    // this.getChainId()
  }

  
  getAddress = async () => {
    try {
      return this.provider.request(
        { 
          method: 'eth_requestAccounts' 
        }
      ).then(response => {
        const accounts = response
        console.log(`User's address is ${accounts[0]}`)
        return accounts[0]
        
      }) 
    } catch (error) {
      
    }
  }
  
  getChainId = async () => {
    try{
      // Get current chain ID for connected wallet
      const chainId = await this.provider.request({
        method: "eth_chainId",
      });
      this.chainId = Number(chainId);
    } catch (error) {
      this.error = error;
    }
  }

  getSigner = async ( chainId ) => {
    const [provider, account] = await Promise.all([
      this.provider,
      await this.getAddress()
    ])
    console.log(provider, account);
    return new ethers.providers.Web3Provider(
      provider,
      chainId,
    ).getSigner(account)
  }
  
  getEthBalance = async () => {
    this.provider.request({ 
      method: 'eth_getBalance', 
      params: [ this.account || await this.getAddress(), "latest"] 
    })
    .then(response => {
      const accounts = response
      console.log(`User's bal is ${accounts}`)
      return response
    })
  }
}
 
export default CoinbaseConnector