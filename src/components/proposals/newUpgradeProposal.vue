<template>
  <div class="container p-5">
    <!-- PAPER PROPOSAL FORM -->
    <div class="field">
      <label class="label">New Contract Address</label>
      <div class="control">
        <input class="input" v-model="codeAddress" type="text" placeholder="New contract address">
      </div>
    </div>
     <div class="field">
      <label class="label">Instance Address</label>
      <div class="control">
        <input class="input" v-model="instanceAddress" type="text" placeholder="New contract address">
      </div>
    </div>
    <div class="field">
      <label class="label">Beacon</label>
      <div class="control">
        <input class="input" v-model="beaconAddress" type="text">
      </div>
    </div>
    <div class="field">
      <label class="label">Version</label>
      <div class="control">
        <input class="input" v-model="version" type="number">
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
        <textarea class="input" v-model="description" type="text" placeholder="Description"></textarea>
      </div>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" @click="publish">Submit Proposal</button>
      </div>
      <div class="control">
        <button class="button is-link is-light">Cancel</button>
      </div>
    </div>
    <!-- End Form -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {ethers} from "ethers";
export default {

  name: "newUpgradeProposal",
  data(){
    return {
      assetId: "0",
      beaconAddress: "0xc4cad6434a405a3d9c89cbcb0d1a77b6eceb4bf7",
      instanceAddress: ethers.constants.AddressZero,
      codeAddress: ethers.constants.AddressZero,
      version: 4,
      title: "",
      description: "",
      selectedType: "Null"
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
    }),
    async publish() {
      if (!ethers.utils.isAddress(this.codeAddress)) {
        return;
      }
      
      const assetAddress = await this.assetMap.get(this.assetId);

      await this.createUpgradeProposal({
        assetAddress,
        instanceAddress: this.instanceAddress,
        beaconAddress: this.beaconAddress,
        codeAddress: this.codeAddress,
        title: this.title,
        description: this.description,
        version: this.version,
      });
    },
  }
}
</script>

<style lang="scss" scoped>
</style>