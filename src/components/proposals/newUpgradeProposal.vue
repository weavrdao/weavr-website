<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Upgrade Proposal</div>
    <!-- PAPER PROPOSAL FORM -->
    <div class="field">
      <label class="label">New Contract Address</label>
      <div class="control">
        <input class="input" v-model="codeAddress" type="text" placeholder="0x...">
      </div>
    </div>
     <div class="field">
      <label class="label">Instance Address</label>
      <div class="control">
        <input class="input" v-model="instanceAddress" type="text" placeholder="0x...">
      </div>
    </div>
    <div class="field">
      <label class="label">Beacon</label>
      <div class="control">
        <input class="input" v-model="beaconAddress" type="text" placeholder="0x...">
      </div>
    </div>
    <div class="field">
      <label class="label">Version</label>
      <div class="control">
        <input class="input" v-model="version" type="number" placeholder="0x...">
      </div>
    </div>
    <div class="field">
      <label class="label">Proposal Title</label>
      <div class="control">
        <input class="input" v-model="title" type="text" placeholder="Title">
      </div>
    </div>
    <div class="field">
      <label class="label">Proposal Description</label>
      <div class="control">
        <textarea class="textarea" v-model="description" type="text" placeholder="Description"></textarea>
      </div>
    </div>
    <div class="is-flex is-justify-content-space-between mt-5">
      <button @click="publish" class="button has-background-mint has-text-white has-text-weight-bold">Submit Proposal</button>
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    </div>
    <!-- End Form -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ethers } from "ethers";
import { ProposalTypes } from "@/models/common"
import { CONTRACTS, DAO } from "../../services/constants" 
const GOERLI_TEST = {
  governor: "0xDba4eF785E003F7efc80Ba3900e260FA893804BC",
  signer: "0x4C3D84E96EB3c7dEB30e136f5150f0D4b58C7bdB"
}

export default {

  name: "newUpgradeProposal",
  props: {
    assetId: {
      type: String,
      required: true,
    }
  },
  data(){
    return {
      beaconAddress: CONTRACTS.BEACON,
      instanceAddress:ethers.constants.AddressZero,
      codeAddress: CONTRACTS.FRABRIC_CODE,
      version: 2,
      title: "Upgrade",
      description: "Upgrade Proposal",
      selectedType: "upgradeProposal",
      governor: GOERLI_TEST.governor,
      signer: GOERLI_TEST.signer
    }
  },
  computed: {
    ...mapGetters({
      assetMap: "assetsById",
    }),
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      createUpgradeProposal: "createUpgradeProposal",
      addressList: "platformContractAddresses"
    }),
    async publish() {
      if (!ethers.utils.isAddress(this.codeAddress)) {
        return;
      }
      console.log(this.signerAddress);
      let assetAddress = this.assetId
      console.log("#ASSET_ID: ", this.assetId);
      await this.createUpgradeProposal({
        assetAddress,
        beaconAddress: this.beaconAddress,
        codeAddress: this.codeAddress,
        instanceAddress: this.instanceAddress,
        title: this.title,
        description: this.description,
        version: this.version,
        signer: this.signer,
        governor: this.governor,
        $toast: this.$toast
      });
    },
    onCancel() {
      this.$router.push("/".concat(DAO));
    }
  },
  mounted() {
    this.refresh({ assetId: this.assetId});
    this.syncWallet();
  },
}
</script>

<style lang="scss" scoped>
</style>