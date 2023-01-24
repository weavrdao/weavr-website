<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Thread Proposal</div>
    <!-- PAPER PROPOSAL FORM -->
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
        <input class="input" v-model="symbol" type="text" placeholder="FBRC" maxlength="5">
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
    <div class="is-flex is-justify-content-space-between mt-5">
      <button @click="publish" class="button has-background-mint has-text-white has-text-weight-bold">Submit Proposal</button>
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    </div>
    <!-- End Form -->
    {{assetId}}
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {ethers} from "ethers";
import { CONTRACTS, DAO } from "../../services/constants";

export default {

  name: "newThreadProposal",
  data(){
    return {
      blobVersion: 0,
      name: "",
      descriptor: "",
      symbol: "",
      title: "",
      description: "",
      tradeToken: CONTRACTS.TRADE_TOKEN,
      target: 0,
      forumLink: "",
      images: null,
      documents: null,
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
      console.log({
        assetId: this.assetId || CONTRACTS.WEAVR,
        blobVersion: this.blobVersion,
        name: this.name,
        descriptor: this.descriptor,
        forumLink: this.forumLink,
        description: this.description,
        symbol: String(this.symbol).toUpperCase(),
        title: this.title,
        tradeToken: this.tradeToken,
        target: this.target,
        images: this.images,
        documents: this.documents,
        $toast: this.$toast
      });
      const payload = {
        assetId: this.assetId || CONTRACTS.WEAVR,
        blobVersion: this.blobVersion,
        name: this.name,
        descriptor: this.descriptor,
        forumLink: this.forumLink,
        description: this.description,
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