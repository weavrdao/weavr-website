<template>
  <div class="container p-5">
    <!-- PAPER PROPOSAL FORM -->
    <div class="field">
      <div class="select">
        <select
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
    </div>
    <div class="field" v-if="selectedType!='Null'">
      <label class="label">Address</label>
      <div class="control">
        <input class="input" v-model="address" type="text" placeholder="Text input">
      </div>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" @click="publish">Submit Proposal</button>
      </div>
      <div class="control">
        <button class="button is-link is-light">Cancel</button>
      </div>
    </div>
    <!-- End Form -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {ParticipantType} from "@/models/common.js";
import {ethers} from "ethers";
export default {

  name: "newPaperProposal",
  props: {
    assetId: {
      type: String,
      required: true,
    },
  },
  data(){
    return {
    
      address: "",
      title: "",
      description: "",
      pTypeList: ParticipantType,
      selectedType: "Null"


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
      if (this.address.length < 1) {
        return;
      }
      
      const  assetId = this.assetId;
      // const  title = this.title;
      const  description = this.description;
      const isAddr = ethers.utils.isAddress(this.address);
      const participant = this.address
      const props = {
        assetId: this.assetId,
        participantType: this.pTypeList[this.selectedType],
        participant: this.address,
        info: this.description
      }

      console.log("PArticipantType:  ", props['participantType']);
      await this.createProposal(props);
    },
  }
}
</script>