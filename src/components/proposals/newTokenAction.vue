<template>
  <div class="container p-5">
    <!-- Token Action Form -->
    <h2>New Token Action Proposal</h2>
    <div class="field">
      <label class="label">Token Address</label>
      <div class="control">
        <input class="input" v-model="tokenAddress" type="text" placeholder="New contract address">
      </div>
    </div>
    <div class="field">
      <label class="label">Minting Proposal?</label>
      <div class="select">
        <select v-model="mintType">
          <option 
            v-for="(_, name) in mintTypes"
            :key="name">
            {{name}}
          </option>
        </select>
      </div>
    </div>
    <div class="field">
      <label class="label">Price</label>
      <div class="control">
        <input class="input" v-model="price" type="number">
      </div>
    </div>
    <div class="field">
      <label class="label">Amount</label>
      <div class="control">
        <input class="input" v-model="amount" type="number">
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
import { MintType } from "@/models/common.js";
import {ethers} from "ethers";
export default {
  name: "newTokenAction",
  data(){
    return {
      tokenAddress: ethers.constants.AddressZero,
      price: 0,
      amount: 0,
      title: "",
      description: "",
      mintType: "No",
      mintTypes: MintType,
    }
  },
  props: {
    assetId: {
      type: String,
      required: true,
    },
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
      createTokenActionProposal: "createTokenActionProposal",
    }),
    async publish() {
      if (!ethers.utils.isAddress(this.tokenAddress)) {
        return;
      }
      await this.createTokenActionProposal({
        tokenAddress: this.tokenAddress,
        targetAddress: this.assetId,
        mint: this.mintTypes[this.mintType],
        price: this.price,
        amount: this.amount,
        title: this.title,
        description: this.description,
      });
    },
  }
}
</script>

<style lang="scss" scoped>
textarea {
  min-height: 200px;
  max-width: 100%;
  min-width: 100%;
}

h2 {
  font-size: 1.6rem;
  color: white;
  font-weight: 600;
  margin-bottom: 20px;
}

label {
  margin-top: 25px;
  color: white;
}
</style>