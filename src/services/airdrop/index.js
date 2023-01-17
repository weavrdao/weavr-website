import AirdropContract from "../../data/network/web3/contracts/airdropContract"
import { CONTRACTS } from "../constants";


class Airdrop {
  constructor(ethereumClient, graphQLAPIClient, storageNetwork) {
    this.ethereumClient = ethereumClient;
    this.graphQLAPIClient = graphQLAPIClient;
    this.storageNetwork = storageNetwork;
  }
  
  async viewClaimedAmount(address) {
    const airdrop = new AirdropContract(this.ethereumClient, CONTRACTS.AIRDROP);
    return await airdrop.viewClaim(address);
  }

  async claim() {
    const airdrop = new AirdropContract(this.ethereumClient, CONTRACTS.AIRDROP);
    return await airdrop.claim();
  }
}

export default Airdrop;