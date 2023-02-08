<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white  mb-5 is-medium">New Token Action Proposal</div>
    <!-- Token Action Form -->
    <div v-if="!preview">
      <div v-if="price === 0" class="field">
        <label class="label">Target Address</label>
        <div class="control">
          <input class="input" v-model="targetAddress" type="text" placeholder="Target address">
        </div>
        <span class="has-text-mediumBlue ml-3" v-if="isTargetingSelf">This contract</span>
        <span class="has-text-mediumBlue ml-3" v-if="isTargetingUser">You</span>
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
      <p class="has-text-mediumBlue" v-if="price !== 0">Token actions with a price will target the DAO contract</p>
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
    <div class="field">
      <label class="label">Forum link</label>
      <input v-model="forumLink" type="text" class="input" />
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
          :name="preview ? 'pen' : 'eye'"
        >
        </unicon>
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
import { MintType } from "@/models/common.js";
import { ProposalTypes} from "@/models/common.js";
import {ethers} from "ethers";
import { CONTRACTS } from "../../services/constants";
import Proposal from "@/components/proposals/Proposal.vue"


export default {
  name: "newTokenAction",
  components: {
    Proposal
  },
  data(){
    return {
      amount: 0,
      title: "",
      price: 0,
      description: "",
      targetAddress: CONTRACTS.WEAVR,
      forumLink: "",
      mintType: "No",
      mintTypes: MintType,
      preview: false,
      proposal: null,
      proposalType: ProposalTypes.TokenAction,
    }
  },
  computed: {
    ...mapGetters({
      assetMap: "assetsById",
      userWalletAddress: "userWalletAddress"
    }),
    assetId() {
      return this.$route.params.assetId
    },
    isTargetingSelf() {
      return this.targetAddress === CONTRACTS.WEAVR;
    },
    isTargetingUser() {
      return this.targetAddress === this.userWalletAddress;
    },
  },
  methods: {
    ...mapActions({
      createTokenActionProposal: "createTokenActionProposal",
    }),
    async publish() {
      if (!ethers.utils.isAddress(this.targetAddress)) {
        this.$toast.warning("Invalid target address", {
          position: "bottom",
        });
        return;
      }
      await this.createTokenActionProposal({
        assetId: this.assetId || CONTRACTS.WEAVR,
        mint: this.mintTypes[this.mintType],
        target: this.price === 0 ? this.targetAddress : this.assetId,
        price: this.price,
        amount: this.amount,
        title: this.title,
        description: this.description,
        forumLink: this.forumLink.includes("https://forum.weavr.org/") ? this.forumLink : "https://forum.weavr.org/c/dao-proposals/",
        $toast: this.$toast
      });
    },
    onCancel() {
      this.$router.back();
    },
    togglePreview() {
      this.proposal = {
        title: this.title,
        description: this.description,
        type: this.proposalType,
        creator: '0x00000',
        startTimeStamp: 0,
        endTimeStamp: 0,
        forumLink: this.forumLink.includes("https://forum.weavr.org/") ? this.forumLink : "https://forum.weavr.org/c/dao-proposals/",
        mint: this.mintTypes[this.mintType],
        target: this.price === 0 ? this.targetAddress : this.assetId,
        price: this.price,
        amount: this.amount,
        assetId: this.assetId
      }
      this.preview = !this.preview
    },
  }
}
</script>

<style lang="scss" scoped>
label {
  margin-top: 25px;
}
</style>