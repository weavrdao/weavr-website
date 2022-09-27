<template>
<div class="proposal-selector  my-5 mx-0 p-5">
  <div class="column is-half-desktop">
    <label for="proposal-selector">Type of Proposal</label>
    <select class="select is-medium has-background-darkGray has-text-white px-3 my-2"  v-model="selectedAction">
      <option v-for="option in actionTypes" :value="option.id" v-bind:key="option.id">
        {{ option.name }}
      </option>
    </select>
    
  </div>
  <div class="column is-half-desktop">
    <button class="has-background-mediumBlue button has-text-white mt-5 p-5" @click="routeToSelectedPage">Create Proposal</button>
  </div>
</div>
</template>

<script>
import {DAO} from "../../services/constants"
export default {
  name: "NewProposalSelector",
  data () {
    return {
      selectedAction: "paperProposal",
      // The id field here must match the desired page path
      actionTypes: [
        {
          id: "paperProposal",
          name: "Paper Proposal"
        },
        {
          id: "tokenProposal",
          name: "Token Action",
        },
        {
          id: "participantProposal",
          name: "Participant Proposal"
        },
        {
          id: "upgradeProposal",
          name: "Upgrade Proposal",
        },
        {
          id: "threadProposal",
          name: "Thread Proposal",
        }
      ],
    }
  },
  methods: {
    routeToSelectedPage() {
      this.$router.push(`/${DAO}/${this.selectedAction}`);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/frabric-custom.scss";

.proposal-selector {
  border: 1px solid #575757;
  border-radius: 10px;
}

.select {
  display: block;
}

</style>