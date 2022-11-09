import DaoContract from "../contracts/daoContract";
import WhitelistInterface from "../contracts/whitelistContract";

class Whitelist {
  constructor(
    ethereumClient
  ) {
    this.client = ethereumClient;
  }

  async checkWhitelistedStatus(weavrAddress, userAddress) {
    const daoContract = new DaoContract(this.client, weavrAddress);
    const erc20Address = await daoContract.getERC20Address();
    const whitelistContract = new WhitelistInterface(this.client, erc20Address);
    const isWhitelisted = await whitelistContract.whitelisted(userAddress);
        
    return isWhitelisted;
  }
}

export default Whitelist;