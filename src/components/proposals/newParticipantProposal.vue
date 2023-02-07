<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Participant Proposal</div>
    <!-- PAPER PROPOSAL FORM -->
    <div v-if="!preview">
    <div class="field">
      <label class="label">Participant Type</label>
      <select
        class="select is-small has-background-darkGray has-text-white px-3"
        v-model="selectedType"
      >
        <option 
          v-for="(value, name) in pTypeList"
          :key="name"
        >
          {{name}}
        </option>
      </select>
    </div>
    <div class="field" >
      <label class="label">Address</label>
      <div class="control">
        <input class="input" v-model="address" type="text" placeholder="Text input">
      </div>
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
  <div class="block p-6 is-flex is-justify-content-space-between mt-5">
    <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    <button @click="publish"  class="button has-background-success has-text-white has-text-weight-bold">Submit Proposal</button>
  </div>
    <!-- End Form -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {ParticipantType, ProposalTypes} from "@/models/common.js";
import { DAO } from "../../services/constants"
import {ethers} from "ethers";
import Proposal from "@/components/proposals/Proposal.vue"

export default {

  name: "newPaperProposal",
  components: {
    Proposal
  },
  emits: ['submited', "proposed"],
  data(){
    return {
      address: "",
      title: "",
      description: "",
      pTypeList: ParticipantType,
      proposalType: ProposalTypes.Participant,
      selectedType: "Individual",
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
      createProposal: "createParticipantProposal",
    }),
    togglePreview() {
      this.title = `Proposing ${this.address} as ${this.selectedType}`
      this.proposal = {
        title: this.title,
        description: this.description,
        type: this.proposalType,
        creator: '0x00000',
        startTimeStamp: 0,
        endTimeStamp: 0,
        address: this.address,
        forumLink: this.forumLink.includes("https://forum.weavr.org/") ? this.forumLink : "https://forum.weavr.org/c/dao-proposals/"
      }
      this.preview = !this.preview
    },
    async publish() {
      console.log(ParticipantType)
      if(!ethers.utils.isAddress(this.address)) {
        this.$toast.error("Address not valid", {
          position: "top"
        });
        this.address=""
        return
      }
      
      this.$emit("submited");
      const participant = this.address
      const props = {
        title: `Proposing ${participant} as ${this.selectedType}`,
        assetId: this.assetId,
        participantType: this.pTypeList[this.selectedType],
        participant: this.address,
        forumLink: this.forumLink.includes("https://forum.weavr.org/") ? this.forumLink : "https://forum.weavr.org/c/dao-proposals/",
        info: this.description,
        $toast: this.$toast
      }

      console.log("ParticipantType:  ", props['participantType']);
      console.log("FULL PROPS_______:  ", props);
      await this.createProposal(props);
      this.$emit("proposed");
    },
    onCancel() {
      this.$router.back();
    }
  },
  mounted() {
    this.refresh({ assetId: this.assetId});

  }
}
</script>