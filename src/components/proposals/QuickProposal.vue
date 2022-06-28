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
        <button class="button is-link" @click="createProposal">Submit Proposal</button>
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

export default {

  name: "quickProposal",
  data(){
    return {
      assetId: "0",
      title: "",
      description: "",
      
    }
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      createProposal: "createProposal",
    }),
    publish() {
      if (this.title.length < 1 || this.description.length < 1) {
        return;
      }

      this.createProposal({
        assetId: this.assetId,
        title: this.title,
        description: this.description,
        $toast: this.$toast,
      });
    },
  }
}
</script>