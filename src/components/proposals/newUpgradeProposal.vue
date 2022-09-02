<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Upgrade Proposal</div>
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
        <p
          class="has-text-red mt-2"
          v-if="instanceAddress === '0x0000000000000000000000000000000000000000'"><strong class="has-text-red">Warning: </strong>Passing this instance address may cause the upgrade process to become stuck.</p>
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
import {ethers} from "ethers";

export default {

  name: "newUpgradeProposal",
  data(){
    return {
      assetId: "0",
      beaconAddress: "0x91a2b15d9f861a6b7b0b14049b47eebcb6aa49d1",
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
    onCancel() {
      this.$router.push("/frabric");
    }
  }
}
</script>

<style lang="scss" scoped>
</style>