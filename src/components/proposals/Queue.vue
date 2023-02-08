<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">Queue Proposal</div>
    <div class="is-flex is-justify-content-space-between mt-5">
      <button @click="publish" class="button has-background-success has-text-white has-text-weight-bold">Queue</button>
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {

  name: "Queue",
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
      queue: "queueProposal"
    }),
    async publish() {
      const id = this.$route.params.proposalId
      await this.queue({proposalId: id})
    },
    onCancel() {
      this.$router.go(-1);
    }
  },
}
</script>