<template>
  <div class="proposal-selector  my-5 mx-0 p-5 columns">
    <div class="column is-half is-three-quaters-widescreen">
      <label class="label" for="proposal-selector">Type of Proposal</label>
      <select class="select is-size-5 has-background-darkGray has-text-white px-3 my-2" v-model="selectedAction">
        <option v-for="option in actionTypes" :value="option.id" v-bind:key="option.id">
          {{ option.name }}
        </option>
      </select>

    </div>
    <div class="column is-half is-one-quaters-widescreen is-flex button-container">
      <button class="has-background-mediumBlue button has-text-white p-5" @click="routeToSelectedPage">Create Proposal
      </button>
    </div>
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {DAO} from "../../services/constants"

export default {
  name: "NewProposalSelector",
  data() {
    return {
      selectedAction: "paperProposal",
      // The id field here must match the desired page path
      actionTypes: [
        {
          id: "paperProposal",
          name: "Paper Proposal"
        },
        // {
        //   id: "upgradeProposal",
        //   name: "Upgrade Proposal",
        //   hide: true
        // },
        {
          id: "tokenProposal",
          name: "Token Action Proposal"
        },
        {
          id: "threadProposal",
          name: "Thread Proposal",
        },
        {
          id: "participantProposal",
          name: "Participant Proposal",
        },
        {
          id: "participantRemovalProposal",
          name: "Participant Removal Proposal",
        }
      ],
    }
  },
  methods: {
    routeToSelectedPage() {
      console.log(this.$route.path)
      this.$router.push({path: this.$route.path + `/${this.selectedAction}`});
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/weavr-custom.scss";

.proposal-selector {
  border: 1px solid #575757;
  border-radius: 10px;
}

.select {
  display: block;
}

.button-container {
  justify-content: flex-end;
  padding-right: 30px;
}

.button {
  height: 2.5rem;
  margin-top: 2rem;
}

// Bulma can smd
@media only screen and (max-width: 769px) {
  .button-container {
    justify-content: flex-start;
  }

  .button {
    height: 2.5rem;
    margin-top: 0;
  }
}
</style>