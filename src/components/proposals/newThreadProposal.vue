<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Thread Proposal</div>
    <!-- PAPER PROPOSAL FORM -->
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
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input class="input" v-model="name" type="text" placeholder="Thread Name">
      </div>
    </div>
    <div class="field">
      <label class="label">Symbol</label>
      <div class="control">
        <input class="input" v-model="symbol" type="text" placeholder="FBRC">
      </div>
    </div>
    <div class="field">
      <label class="label">Trade Token Address</label>
      <div class="control">
        <input class="input" v-model="tradeToken" type="text" placeholder="0x0">
      </div>
    </div>
    <div class="field">
    <label class="label">Crowdfunding target</label>
      <div class="control">
        <input class="input" v-model="target" type="text" placeholder="250000">
      </div>
      <p>Denominated in trade token</p>
    </div>
    <div class="field">
      <label class="label">Thread Descriptor</label>
      <div class="control">
        <textarea class="textarea" v-model="descriptor" type="text" placeholder="Descriptor"></textarea>
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
import { WEAVR_ADDRESS, DAO } from "../../services/constants";

export default {

  name: "newThreadProposal",
  data(){
    return {
      name: "",
      descriptor: "",
      symbol: "",
      title: "",
      description: "",
      tradeToken: "0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c",
      target: "",
    }
  },
  props: {
    assetId: {
      type: String,
      required: true,
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
      createThreadProposal: "createThreadProposal",
    }),
    async publish() {
      if (!ethers.utils.isAddress(this.tradeToken)) {
        return;
      }

      console.dir({
        assetId: this.assetId,
        name: this.name,
        descriptor: this.descriptor,     
        description: this.description,
        symbol: this.symbol,
        title: this.title,
        tradeToken: this.tradeToken,
        target: this.target,
      })

      await this.createThreadProposal({
        assetId: this.assetId || WEAVR_ADDRESS,
        name: this.name,
        descriptor: this.descriptor,     
        description: this.description,
        symbol: this.symbol,
        title: this.title,
        tradeToken: this.tradeToken,
        target: this.target,
        $toast: this.$toast
      });
    },
    onCancel() {
      this.$router.push("/".concat(DAO));
    }
  }
}
</script>

<style lang="scss" scoped>
</style>