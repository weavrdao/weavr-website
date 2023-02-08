<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">Complete Proposal</div>
    <div class="is-flex is-justify-content-space-between mt-5">
      <button @click="publish" class="button has-background-success has-text-white has-text-weight-bold">Complete Proposal</button>
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {

  name: "Complete",
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
      complete: "completeProposal"
    }),
    async publish() {
      
      console.log(this.$route.params.proposalId)
      const id = this.$route.params.proposalId
      await this.complete({proposalId: id})
    },
    onCancel() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.refresh({ assetId: this.assetId });
    this.syncWallet();
  },
}
</script>