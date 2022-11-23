<template>
<div class="container p-5">
  <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Paper Proposal</div>
  <!-- PAPER PROPOSAL FORM -->
  <div class="field">
    <label class="label">Title</label>
    <div class="control">
      <input class="input" v-model="title" type="text" placeholder="Enter title here">
    </div>
  </div>
  
  <div class="field">
    <label class="label">Description</label>
    <div class="control">
      <textarea class="textarea" v-model="description" @change="updateMarkdown" placeholder="Enter description here"></textarea>
      
      
        <div class="button" @click="!preview">Preview</div>
      
      
    </div>
    <!-- <div class="control markdown">
      <vue-markdown ref="markdownSource" v-show="preview" class="textarea" :source="description" placeholder="Enter description here"></vue-markdown>
    </div> -->
  </div>
  <div class="field">
    <label class="label">DAO resolution</label>
    <div class="control">
      <input type="checkbox" class="checkbox" v-model="daoResolution"/><span class="ml-1 has-text-mediumGray is-italic"> - check this if the proposal will make changes to the DAO</span>
    </div>
  </div>
  
  <div class="is-flex is-justify-content-space-between mt-5">
    <button @click="publish"  class="button has-background-mint has-text-white has-text-weight-bold">Submit Proposal</button>
    <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
  </div>
  <!-- End Form -->
  {{assetId}}
</div>

</template>

<script>
import { mapGetters, mapActions } from "vuex";

import { CommonProposalType } from "@/models/common.js"
import VueMarkdown from "vue-markdown-render";
import { createApp } from '@vue/runtime-dom';
import { CONTRACTS } from '../../services/constants';
import { useRoute, useRouter } from 'vue-router';


const mk = createApp({extends: VueMarkdown})

export default {
  name: "newPaperProposal",
  components: {
    // VueMarkdown
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
      proposalType: CommonProposalType.Paper,
      preview: false,
      markdownSource: null

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
      const proposalType = this.proposalType
      const daoResolution = this.daoResolution
      const proposal = await this.createPaperProposal({assetAddr, proposalType, title, description, daoResolution,  $toast: this.$toast} );
      this.$emit("proposed");
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
