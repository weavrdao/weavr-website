<template>
  <div class="container p-5">
    <!-- PAPER PROPOSAL FORM -->
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input class="input" v-model="title" type="text" placeholder="Text input">
      </div>
    </div>
    
    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <textarea class="textarea" v-model="description" placeholder="e.g. Hello world"></textarea>
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
import { CommonProposalType } from "@/models/common.js"
export default {

  name: "newPaperProposal",
  props: {
    assetId: {
      type: String,
      required: true,
    },
  },
  data(){
    return {
    
      title: "",
      description: "",
      proposalType: CommonProposalType.Paper
    }
  },
  computed: {
    ...mapGetters({
      assetMap: "assetsById",
    }),
    
    asset() {
      return this.assetMap.get(this.assetId);
    },
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      createPaperProposal: "createPaperProposal",
    }),
    async publish() {
      if (this.title.length < 1 || this.description.length < 1) {
        return;
      }
      
      const assetAddr = this.assetId;
      console.log("ADD:" + assetAddr)
      const title = this.title;
      const description = this.description;
      const proposalType = this.proposalType
      
      await this.createPaperProposal({assetAddr, proposalType, title, description});
    },
  },
  mounted() {
    this.refresh({ assetId: this.assetId });
    this.syncWallet();
  },
}
</script>