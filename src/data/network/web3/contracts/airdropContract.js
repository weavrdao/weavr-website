import { CONTRACTS } from "../../../../services/constants";
import { ethers } from "ethers";
import { createToaster } from "@meforma/vue-toaster";
import contractAbi from "./abi/Airdrop";

class AirdropContract {
  constructor(
    ethereumClient,
    contractAddress
  ) {
    this.contract = ethereumClient.getContract(contractAddress, contractAbi);
    this.mutableContract = ethereumClient.getMutableContract(this.contract)
  }
  async viewClaim(address) {
    try {
      return (await this.contract.viewClaim(address));
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  async claim() {
    return (await this.mutableContract.claim());
  }
}
export default AirdropContract;