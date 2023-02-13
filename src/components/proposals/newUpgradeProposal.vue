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
    <div v-if="preview">
      <Proposal :proposal="proposal" />
    </div>
    <div class="block">
      <div :class="[preview ? 'is-primary ': 'is-secondary ', 'button has-text-white is-size-5 p-3']" @click=togglePreview>
          <span class="mr-2">
            <unicon 
            height="18" 
            width="18" 
            fill="white"
            :name="preview ? 'pen' : 'eye'"></unicon>

          </span>
        {{ preview ? "Edit" : "Preview" }}</div>
    </div>
    <div class="block is-flex is-justify-content-space-between mt-5">
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
      <button @click="publish"  class="button has-background-success has-text-white has-text-weight-bold">Submit Proposal</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ethers } from "ethers";
import { CONTRACTS } from "../../services/constants" 
const GOERLI_TEST = {
  governor: "0xA28C6A770dC1E6DCd94Ea93B7464E3B3DF77689D",
  signer: "0xd7623F78545a3D1138Ae435c7D224F7bC32Ae038"
}

export default {
  name: "newUpgradeProposal",
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
    assetId() {
      if(this.$route.params.threadId) {
        return this.$route.params.threadId
      }
      return this.$route.params.assetId
    }
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
      let assetAddress = this.$route.params.assetId;
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
      this.$router.back();
    }
  },
  mounted() {
    
  },
}
</script>

<style lang="scss" scoped>
</style>