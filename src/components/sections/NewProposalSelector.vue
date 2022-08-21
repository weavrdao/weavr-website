<template>
<div class="is-flex is-jusify-content-space-between select my-5">
  <select v-model="selectedProposal">
    <option
      v-for="actionType in this.actionTypes"
      v-bind:value="{ path: actionType.path, name: actionType.name }"
      v-bind:key="actionType.path">
      {{ actionType.name }}
    </option>
  </select>
  <button @click="routeToPage">Create Proposal</button>
</div>
</template>

<script>
export default {
  name: "NewProposalSelector",
  data () {
    return {
      selectedAction: {
        path: "paperProposal",
        name: "Paper Proposal"
      },
      actionTypes: [
        {
          path: "paperProposal",
          name: "Paper Proposal"
        },
        {
          path: "tokenProposal",
          name: "Token Action",
        },
        {
          path: "participantProposal",
          name: "Participant Proposal"
        },
        {
          path: "upgradeProposal",
          name: "Upgrade Proposal",
        },
        {
          path: "vouch",
          name: "Participant Vouch",
        }
    ]}
  },
  methods: {
    routeToPage() {
      console.log(this.selectedAction.path);
    }
  }
}
</script>

<style lang="scss" scoped>
.proposal-selector {
  border: 1px solid #575757;
  border-radius: 10px;
}
</style>