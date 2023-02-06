<template>
<div class="container p-5">
  <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Paper Proposal</div>
  <!-- PAPER PROPOSAL FORM -->
  <div class="field"  v-if="!preview">
    <label class="label">Title</label>
    <div class="control">
      <input class="input" v-model="title" type="text" placeholder="Enter title here">
    </div>
  </div>
  
  <div class="field"  v-if="!preview">
    <label class="label">Description</label>
    <div class="control">
      <textarea class="textarea" v-model="description" placeholder="Enter description here"></textarea>
    </div>
  </div>
  <div class="field"  v-if="!preview">
    <label class="label">Forum link</label>
    <input v-model="forumLink" type="text" class="input"/>
  </div>
  <div class="field"  v-if="!preview">
    <label class="label">DAO resolution</label>
    <div class="control">
      <input type="checkbox" class="checkbox" v-model="daoResolution"/><span class="ml-1 has-text-mediumGray is-italic"> - check this if the proposal will make changes to the DAO</span>
    </div>
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
          :name="preview ? 'pen' : 'eye'"></unicon>

        </span>
      {{ preview ? "Edit" : "Preview" }}</div>
  </div>
  <div class="block is-flex is-justify-content-space-between mt-5">
    <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    <button @click="publish"  class="button has-background-success has-text-white has-text-weight-bold">Submit Proposal</button>
  </div>
  <!-- End Form -->
</div>

</template>

<script>
import { mapGetters, mapActions } from "vuex";

import {CommonProposalType, ProposalTypes} from "@/models/common.js"
import Proposal from "@/components/proposals/Proposal.vue"


export default {
  name: "newPaperProposal",
  components: {
    Proposal
  },
  emits: ['submited', "proposed"],
  computed: {
    assetId() {
      return this.$route.params.assetId
    }
  },
  data(){
    return {
      title: "",
      description: "",
      daoResolution: false,
      proposalType: ProposalTypes.Paper,
      preview: false,
      markdownSource: null,
      proposal: null,
      forumLink: ""
    }
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      createPaperProposal: "createPaperProposal",
    }),
    async publish() {
      this.$emit("submited")
      console.dir(this.trigger);
      if (this.title.length < 1 || this.description.length < 1) {
        return;
      }
      console.log("___ADDRESS___");
      const assetAddr = this.assetId;
      console.log("ADD:" + assetAddr)
      const title = this.title;
      const description = this.description;
      const proposalType = this.proposalType;
      const daoResolution = this.daoResolution;
      const forumLink = this.forumLink;
      await this.createPaperProposal({assetAddr, proposalType, title, description, daoResolution, forumLink,  $toast: this.$toast} );
      this.$emit("proposed");
    },
    togglePreview(){
      console.log("preview toggled");
      this.proposal = {
        title: this.title,
        description: this.description,
        daoResolution: this.daoResolution,
        type: this.proposalType,
        creator: "0x00000",
        startTimeStamp: 0,
        endTimeStamp: 0,
        forumLink: this.forumLink
      }
      this.preview = !this.preview
    },

    onCancel() {
      this.$router.back();
    }
  },
  mounted() {
    this.refresh({ assetId: this.assetId, $toast: this.$toast });
  },
}
</script>
