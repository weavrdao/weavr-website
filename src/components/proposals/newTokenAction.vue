<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white  mb-5 is-medium">New Token Action Proposal</div>
    <!-- Token Action Form -->
    <div class="field">
      <label class="label">Token Address</label>
      <div class="control">
        <input class="input" v-model="tokenAddress" type="text" placeholder="New contract address">
      </div>
    </div>
  
    <div class="field">
      <label class="label">Minting Proposal?</label>
        <select class="select has-background-darkGray has-text-white px-3" v-model="mintType">
          <option 
            v-for="(_, name) in mintTypes"
            :key="name">
            {{name}}
          </option>
        </select>
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
import { MintType } from "@/models/common.js";
import {ethers} from "ethers";
import { TOKEN_ADDRESS, DAO } from "../../services/constants";

export default {
  name: "newTokenAction",
  data(){
    return {
      tokenAddress: TOKEN_ADDRESS,
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
label {
  margin-top: 25px;
}
</style>