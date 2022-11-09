<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">Participant Approval</div>
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
    <div class="field">
      <label class="label">Participant</label>
      <div class="control">
        <input class="input" v-model="participant" type="text" placeholder="Address">
      </div>
    </div>
    <div class="field">
      <label class="label">KYC-hash</label>
      <div class="control">
        <input class="input" v-model="kycHash" type="text" placeholder="0x...">
      </div>
    </div>
    <div class="field">
      <label class="label">Nonce</label>
      <div class="control">
        <input class="input" v-model="nonce" disabled="true" type="number" placeholder="Address">
      </div>
    </div>
    <div class="is-flex is-justify-content-space-between mt-5">
      <button @click="publish" class="button has-background-mint has-text-white has-text-weight-bold">Approve</button>
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    </div>
    <!-- End Form -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { ethers } from 'ethers';
import { DAO } from "../../services/constants"
import {ParticipantType} from "@/models/common.js";

export default {

  name: "VerifyParticipant",
  props: {
    assetId: {
      type: String,
      required: true,
    },
  },
  data(){
    return { 
      pTypeList: ParticipantType,
      slectedType: "",
      participant: "",
      kycHash: "",
      nonce: "0"
    }
  },
  computed: {
  
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      verify: "verifyParticipant"
    }),
    async publish() {
      
      const participant = this.participant;
      if(!ethers.utils.isAddress(participant)) {
        this.$toast.error("Address not valid",
          {
            position: "top"
          });
        this.participant = "";
        return
      }
      console.log(
        {
          ptype: this.pTypeList[this.selectedType], 
          participant: participant, 
          kycHash: this.kycHash,
          nonce: this.nonce
        }
      );
      await this.verify({
        pType: this.pTypeList[this.selectedType], 
        participant: participant, 
        kycHash: this.kycHash,
        nonce: this.nonce
      })
    },
    onCancel() {
      this.$router.push("/".concat(DAO));
    }
  },
  mounted() {
    this.refresh({ assetId: this.assetId });
    this.syncWallet();
  },
}
</script>