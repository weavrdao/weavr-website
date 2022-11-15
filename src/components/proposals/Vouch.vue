<template>
  <div class="container p-5">
    <div class="tag has-background-mediumBlue has-text-white mb-5 is-medium">Participant Vouch</div>
    <div class="field">
      <label class="label">Participant</label>
      <div class="control">
        <input class="input" v-model="participant" type="text" placeholder="Address">
      </div>
    </div>

    <div class="is-flex is-justify-content-space-between mt-5">
      <button @click="publish" class="button has-background-mint has-text-white has-text-weight-bold">Vouch</button>
      <button @click="onCancel" class="button has-background-red has-text-white has-text-weight-bold">Cancel</button>
    </div>
    <!-- End Form -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { ethers } from 'ethers';
import { DAO } from "../../services/constants"

export default {

  name: "Vouch",
  props: {
    assetId: {
      type: String,
      required: true,
    },
  },
  data(){
    return {    
      participant: "",
    }
  },
  computed: {
  
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      vouch: "vouchParticipant"
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
      await this.vouch({participant: participant})
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