<template>
  <div class="container p-5">
    <!-- PAPER PROPOSAL FORM -->
    <div class="field">
      <label class="label">Participant</label>
      <div class="control">
        <input class="input" v-model="participant" type="text" placeholder="Text input">
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
import { mapActions } from "vuex";
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
      participant: "",
    }
  },
  computed: {
  
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      vouchParticipant: "vouchParticipant",
    }),
    async publish() {
      // if (this.title.length < 1 || this.description.length < 1) {
      //   return;
      // }
      
      const assetAddr = this.assetId;
      
      const participant = this.participant;
      await this.vouchParticipant({assetAddr, participant})
      },
  },
  mounted() {
    this.refresh({ assetId: this.assetId });
    this.syncWallet();
  },
}
</script>