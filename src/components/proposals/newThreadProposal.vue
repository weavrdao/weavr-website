<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Thread Proposal</div>
    <!-- PAPER PROPOSAL FORM -->
    <div v-if="!preview">
      <div class="field">
        <label class="label">Proposal Title</label>
        <div class="control">
          <input class="input" v-model="title" type="text" placeholder="Title">
        </div>
      </div>
      <div class="field">
        <label class="label">Proposal Description</label>
        <div class="control">
          <textarea class="textarea" v-model="description" type="text" placeholder="Description"></textarea>
        </div>
      </div>
      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input class="input" v-model="name" type="text" placeholder="Thread Name">
        </div>
      </div>
      <div class="field">
        <label class="label">Symbol</label>
        <div class="control">
          <input class="input" v-model="symbol" type="text" placeholder="T0001" maxlength="5">
        </div>
      </div>
      <div class="field">
        <label class="label">Trade Token Address</label>
        <div class="control">
          <input class="input" v-model="tradeToken" type="text" placeholder="0x0">
        </div>
      </div>
      <div class="field">
      <label class="label">Crowdfunding target</label>
        <div class="control">
          <input class="input" v-model="target" type="text" placeholder="250000">
        </div>
        <p>Denominated in trade token</p>
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
          <textarea class="textarea" v-model="metrics" type="text" placeholder="{metricName: metricValue}"></textarea>
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
    </div>
    <div v-if="preview">
      <Proposal :proposal="proposal" />
    </div>
    <div class="block mt-5">
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
  <div class="block p-6 is-flex is-justify-content-space-between">
    <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    <button @click="publish"  class="button has-background-success has-text-white has-text-weight-bold">Submit Proposal</button>
  </div>
    <!-- End Form -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {ethers} from "ethers";
import { CONTRACTS, DAO } from "../../services/constants";
import {ProposalTypes} from "@/models/common";
import Proposal from "@/components/proposals/Proposal.vue"
import { isJson } from "@/utils/common"
export default {

  name: "newThreadProposal",
  components: {
    Proposal
  },
  data(){
    return {
      blobVersion: 0,
      name: "",
      descriptor: "",
      symbol: "",
      title: "",
      description: "",
      metrics: "",
      tradeToken: CONTRACTS.TRADE_TOKEN,
      target: 0,
      forumLink: "",
      images: null,
      documents: null,
      preview: false,
      proposal: null,
      proposalType: ProposalTypes.Thread,
    }
  },
  computed: {
    ...mapGetters({
      assetMap: "assetsById",
    }),
    assetId() {
      return this.$route.params.assetId
    }
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      createThreadProposal: "createThreadProposal",
    }),
    // eslint-disable-next-line max-lines-per-function
    async publish() {
      if (!ethers.utils.isAddress(this.tradeToken)) {
        this.$toast.warning("Invalid trade token address", {
          duration: 2000,
          position: "bottom",
        });
        return;
      }

      if (this.name.length < 6 || this.name.length > 64 ) {
        this.$toast.warning("Name must be between 6 and 64 characters", {
          duration: 2000,
          position: "bottom",
        });
        return;
      }

      if (this.symbol.length < 2 || this.symbol.length > 5 ) {
        this.$toast.warning("Symbol must be between 2 and 5 characters", {
          duration: 2000,
          position: "bottom",
        });
        return;
      }
      if(isJson(this.metrics)) {
        this.metrics = JSON.stringify(JSON.parse(this.metrics))
      }else {
        this.$toast.warning("Metrics not in valid JSON format",
          {  
            duration: 2000,
            position: "bottom",
          }
        )
        return
      }
      const payload = {
        assetId: this.assetId || CONTRACTS.WEAVR,
        blobVersion: this.blobVersion,
        name: this.name,
        descriptor: this.descriptor,
        forumLink: this.forumLink.includes("https://forum.weavr.org/") ? this.forumLink : "https://forum.weavr.org/c/dao-proposals/",
        description: this.description,
        metrics: this.metrics,
        symbol: String(this.symbol).toUpperCase(),
        title: this.title,
        tradeToken: this.tradeToken,
        target: this.target,
        images: this.images,
        documents: this.documents,
        $toast: this.$toast
      }
      console.log(payload);
      await this.createThreadProposal(payload);
    },
    
    onChangeImages({ target: { files } }) {
      this.images = files;
    },
    onChangeDocuments({ target: { files } }) {
      this.documents = files;
    },
    onCancel() {
      this.$router.back();
    },
    togglePreview() {
      this.proposal = {
        title: this.title,
        description: this.description,
        type: this.proposalType,
        creator: '0x00000',
        startTimeStamp: 0,
        endTimeStamp: 0,
        address: this.address,
        forumLink: this.forumLink.includes("https://forum.weavr.org/") ? this.forumLink : "https://forum.weavr.org/c/dao-proposals/",
        tradeToken: this.tradeToken,
        target: this.target,
        images: this.images,
        documents: this.documents,
        symbol: this.symbol,
        assetId: this.assetId

      }
      this.preview = !this.preview
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/_variables.sass";
@import "../../styles/weavr-custom.scss";

.files-container {
  border-left: 4px solid $mediumBlue;
  border-radius: 4px;
  margin: 8px;
  margin-top: 14px;
  padding-left: 8px;
}

.file-input {
  outline-color: transparent !important;
}
</style>