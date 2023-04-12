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
    <label class="label">DAO resolution</label>
    <div class="control">
      <input type="checkbox" class="checkbox" v-model="daoResolution"/><span class="ml-1 has-text-mediumGray is-italic"> - check this if the proposal will make changes to the DAO</span>
    </div>
  </div>
  <div class="field">
      <label class="label">Thread Descriptor</label>
      <div class="control">
        <textarea class="textarea" v-model="descriptor" type="text" placeholder="Descriptor"></textarea>
      </div>
    </div>
    <div class="field">
      <label class="label">Thread Metrics</label>
      <div class="control">
        <textarea class="textarea" v-model="thread.metrics" type="text" placeholder="{metricName: metricValue}"></textarea>
      </div>
    </div>
    <div class="file">
      <label class="file-label has-background-mediumBlue mt-3">
        <input
          class="file-input has-text-white has-background-mediumBlue"
          type="file"
          name="images"
          v-on:change="onChangeImages"
          multiple="multiple"
          accept=".png,.jpg,.jpeg,.webp,.tiff,image/*">
        <span class="file-cta has-text-white has-background-mediumBlue">
          <span class="file-icon mt-1 mr-3">
            <unicon name="camera" fill="white" />
          </span>
          <span class="file-label">
            Choose images
          </span>
        </span>
      </label>
    </div>
    <div class="files-container">
      <div v-for="image in images" v-bind:key="image.name">
        {{ image.name }}
      </div>
    </div>
    <div class="file">
      <label class="file-label has-background-mediumBlue mt-3">
        <input
          class="file-input has-text-white has-background-mediumBlue"
          type="file"
          name="images"
          v-on:change="onChangeDocuments"
          multiple="multiple"
          accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
        <span class="file-cta has-text-white has-background-mediumBlue">
          <span class="file-icon mt-1 mr-3">
            <unicon name="file-plus-alt" fill="white" />
          </span>
          <span class="file-label">
            Choose documents
          </span>
        </span>
      </label>
    </div>
    <div class="files-container">
      <p v-for="document in documents" v-bind:key="document.name">
        {{ document.name }}
      </p>
    </div>
    <div class="field">
      <label class="label">Forum link</label>
      <input v-model="forumLink" type="text" class="input"/>
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
  </div>
  <!-- End Form -->

</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { isJson } from "@/utils/common";
import { ProposalTypes} from "@/models/common.js"
import Proposal from "@/components/proposals/Proposal.vue"


export default {
  name: "newDescriptorChangeProposal",
  components: {
    Proposal
  },
  emits: ["submited", "proposed"],
  computed: {
    ...mapGetters({
      threads: "threadById",
    }),
    thread() {
      return this.threads.get(this.$route.params.threadId)
    },
    assetId() {
      return this.$route.params.threadId
    },
    metrics() {
      if(!isJson(this.thread?.metrics)) return {}
      const obj = JSON.parse(this.thread.metrics);
      const keys = Object.keys(obj);
      const values = Object.values(obj);
      const metrics = []
      for(let i=0; i<keys.length; i++) {
        metrics.push({label: keys[i], value: values[i]})
      }  
      return metrics.toString()
    },
  },
  data(){
    return {
      title: "",
      description: "",
      descriptor: "",
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
      createProposal: "createProposal",
    }),
    getIpfsUrl(path) {
      return path
        ? `${process.env.VUE_APP_IFPS_GATEWAY_BASE_URL}/${path}`
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
    },
    async publish() {
      this.$emit("submited")
      console.log(this.assetId);
      if (this.title.length < 1 || this.description.length < 1) {
        return;
      }  
      const assetAddr = this.assetId;
      const title = this.title;
      const description = this.description;
      const proposalType = this.proposalType;
      const daoResolution = this.daoResolution;
      const forumLink = this.forumLink.includes("https://forum.weavr.org/") ? this.forumLink : "https://forum.weavr.org/c/dao-proposals/";
      await this.createProposal({pType:"DescriptorChange", assetAddr, proposalType, title, description, daoResolution, forumLink,  $toast: this.$toast} );
      this.$emit("proposed");
    },

    togglePreview(){
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
    this.descriptor = this.thread.descriptor
    this.images = this.thread.imagesHashes
    console.log(this.images);
  }
}
</script>
