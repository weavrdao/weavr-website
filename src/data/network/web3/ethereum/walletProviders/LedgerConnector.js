const { ethers } = require("ethers");
import ledgerService from "@ledgerhq/hw-app-eth/lib/services/ledger"


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

  signTransaction = async (transaction) => {
    let unsignedTx = ethers.utils.serializeTransaction(transaction).substring(2);
    // const resolution = await ledgerService.resolveTransaction(ethers.utils.hexlify(transaction));
    //Sign with the Ledger Nano (Sign what you see)
    const signature = await this.app.signTransaction(this.path, unsignedTx, null);

    //Parse the signature
    signature.r = "0x"+signature.r;
    signature.s = "0x"+signature.s;
    signature.v = parseInt(signature.v);
    signature.from = await this.getAddress();

    //Serialize the same transaction as before, but adding the signature on it
    let signedTx = ethers.utils.serializeTransaction(transaction, signature);
    return signedTx;
  };

  sendTransaction = async (transaction) => {
    const tx = await this.app.sendTransaction(transaction)
    return tx
  }
}

export default LedgerConnector;
