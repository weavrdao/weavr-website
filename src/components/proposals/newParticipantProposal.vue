<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">New Participant Proposal</div>
    <!-- PAPER PROPOSAL FORM -->
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
    <div class="field" v-if="selectedType!='Null'">
      <label class="label">Address</label>
      <div class="control">
        <input class="input" v-model="address" type="text" placeholder="Text input">
      </div>
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
export default {

  name: "newPaperProposal",
  props: {
    assetId: {
      type: String,
      required: true,
    },
  },
  emits: ['submited', "proposed"],
  data(){
    return {
      address: "",
      title: "",
      description: "",
      pTypeList: ParticipantType,
      selectedType: "Individual"
    }
  },
  computed: {
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      createProposal: "createParticipantProposal",
    }),
    async publish() {
      if(!ethers.utils.isAddress(this.address)) {
        this.$toast.error("Address not valid", {
          position: "top"
        });
        this.address=""
        return
      }
      
      this.$emit("submited");
      const assetId = this.assetId;
      const description = this.description;
      const isAddr = ethers.utils.isAddress(this.address);
      const participant = this.address
      const props = {
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
      this.$router.push("/".concat(DAO));
    }
  },
  mounted() {
    this.refresh({ assetId: this.assetId});

  }
}
</script>