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
import {ParticpantType} from "@/models/common.js"

export default {

  name: "newPaperProposal",
  data(){
    return {
      assetId: "0",
      address: "",
      pType: ParticpantType.null,
      
    }
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      createProposal: "createProposal",
    }),
    async publish() {
      if (this.title.length < 1 || this.description.length < 1) {
        return;
      }
      
      const  assetId = this.assetId;
      const  title = this.title;
      const  description = this.description;
      
      await this.createProposal({assetId, title, description});
    },
  }
}
</script>