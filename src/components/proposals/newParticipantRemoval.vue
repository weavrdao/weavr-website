<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Participant Removal Proposal</div>
    <!-- PAPER PROPOSAL FORM -->
    <div v-if="!preview">
      <div class="field">
        <label class="label">Participant to Remove</label>
        <div class="control">
          <input class="input" v-model="address" type="text">
        </div>
      </div>
      <div class="field">
        <label class="label">Removal Fee</label>
        <input v-model="removalFee" type="text" class="input"/>
      </div>
      <div class="field" v-if="!preview">
        <label class="label">Description</label>
        <div class="control">
          <textarea class="textarea" v-model="description" placeholder="Enter description here"></textarea>
        </div>
      </div>
      <div class="field">
        <label class="label">Forum link</label>
        <input v-model="forumLink" type="text" class="input"/>
      </div>
    </div>
    <div v-if="preview">
      <Proposal :proposal="proposal"/>
    </div>
    <div class="is-flex is-justify-content-space-between mt-5">
      <button @click="publish" class="button has-background-mint has-text-white has-text-weight-bold">Submit Proposal
      </button>
      <div class="button has-background-grey-light" @click=togglePreview>Preview</div>
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    </div>
    <!-- End Form -->
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {ParticipantType, ProposalTypes} from "@/models/common.js";
import {DAO} from "../../services/constants"
import {ethers} from "ethers";
import Proposal from "@/components/proposals/Proposal.vue"

export default {

  name: "newParticipantRemovalProposal",
  components: {
    Proposal
  },
  emits: ["submited", "proposed"],
  data() {
    return {
      address: "",
      removalFee: 0,
      signatures: [],
      title: "",
      description: "",
      forumLink: "",
      proposal: null,
      preview: false,
    }
  },
  computed: {
    assetId() {
      return this.$route.params.assetId
    }
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      createProposal: "createParticipantRemovalProposal",
    }),
    togglePreview() {
      this.title = `${this.address} to be removed from Weavr DAO`
      this.proposal = {
        title: this.title,
        description: this.description,
        creator: "0x00000",
        startTimeStamp: 0,
        endTimeStamp: 0,
        address: this.address,
        removalFee: this.removalFee,
        signatures: this.signatures,
        forumLink: this.forumLink
      }
      this.preview = !this.preview
    },
    async publish() {
      if (!ethers.utils.isAddress(this.address)) {
        this.$toast.error("Address not valid", {
          position: "top"
        });
        this.address = ""
        return
      }

      this.$emit("submited");
      const props = {
        assetId: this.assetId,
        participant: this.address,
        removalFee: this.removalFee,
        signatures: this.signatures,
        title: `${this.address} to be removed from Weavr DAO`,
        description: this.description,
        forumLink: this.forumLink,
        $toast: this.$toast
      }

      console.log("ParticipantRemoval:  ", this.address);
      await this.createProposal(props);
      this.$emit("proposed");
    },
    onCancel() {
      this.$router.back();
    }
  },
  mounted() {
    this.refresh({assetId: this.assetId});

  }
}
</script>