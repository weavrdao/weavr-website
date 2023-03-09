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
</template>

<script>
import { mapActions} from "vuex";
import {ethers} from "ethers";
import Proposal from "@/components/proposals/Proposal.vue"
import {ProposalTypes} from "@/models/common";

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
      proposalType: ProposalTypes.ParticipantRemoval
    }
  },
  computed: {
    assetId() {
      return this.$route.params.assetId
    }
  },
  methods: {
    ...mapActions({
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
        proposalType: this.proposalType,
        forumLink: this.forumLink.includes("https://forum.weavr.org/") ? this.forumLink : "https://forum.weavr.org/c/dao-proposals/"
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
        forumLink: this.forumLink.includes("https://forum.weavr.org/") ? this.forumLink : "https://forum.weavr.org/c/dao-proposals/",
        $toast: this.$toast
      }
      await this.createProposal(props);
      this.$emit("proposed");
    },
    onCancel() {
      this.$router.back();
    }
  },
}
</script>