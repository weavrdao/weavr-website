<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Participant Proposal</div>
    <!-- PAPER PROPOSAL FORM -->
    <div class="button has-background-grey-light" @click=togglePreview>Preview</div>
    <div class="field" v-if="!preview">
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
    <div class="field" v-if="!preview" >
      <label class="label">Address</label>
      <div class="control">
        <input class="input" v-model="address" type="text" placeholder="Text input">
      </div>
    </div>
    <div class="field" v-if="!preview">
      <label class="label">Forum link</label>
      <input v-model="forumLink" type="text" class="input"/>
    </div>
    <div v-if="preview">
      <Proposal :proposal="proposal" />
    </div>
    <div class="is-flex is-justify-content-space-between mt-5">
      <button @click="publish" class="button has-background-mint has-text-white has-text-weight-bold">Submit Proposal</button>
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    </div>
    <!-- End Form -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {ParticipantType} from "@/models/common.js";
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
      selectedType: "Individual",
      forumLink: "",
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
      this.title = `Proposing ${this.address} for level ${this.pTypeList[this.selectedType]}`
      this.proposal = {
        title: this.title,
        description: this.description,
        type: this.selectedType,
        address: this.address,
        forumLink: this.forumLink

      }
      this.preview = !this.preview
    },
    async publish() {
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
        title: `Proposing ${participant} for level ${this.pTypeList[this.selectedType]}`,
        assetId: this.assetId,
        participantType: this.pTypeList[this.selectedType],
        participant: this.address,
        info: this.description,
        $toast: this.$toast
      }

      console.log("ParticipantType:  ", props['participantType']);
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