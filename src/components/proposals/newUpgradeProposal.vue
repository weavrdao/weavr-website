<template>
  <div class="container p-5">
    <!-- PAPER PROPOSAL FORM -->
    <div class="field">
      <label class="label">Upgrade Target</label>
      <div class="control">
        <input class="input" v-model="codeAddress" type="text" placeholder="New contract address">
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
      codeAddress: "",
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
        codeAddress: this.codeAddress,
        title: this.title,
        description: this.description,
      });
    },
  }
}
</script>

<style lang="scss" scoped>
</style>