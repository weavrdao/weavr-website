<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">Participant Vouch</div>
    <!-- PAPER PROPOSAL FORM -->
    <div class="field">
      <label class="label">Participant</label>
      <div class="control">
        <input class="input" v-model="participant" type="text" placeholder="Address">
      </div>
    </div>

    <div class="is-flex is-justify-content-space-between mt-5">
      <button @click="publish" class="button has-background-mint has-text-white has-text-weight-bold">Vouch</button>
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
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
    onCancel() {
      this.$router.push("/frabric");
    }
  },
  mounted() {
    this.refresh({ assetId: this.assetId });
    this.syncWallet();
  },
}
</script>