<template>
<div class="is-flex is-jusify-content-space-between select my-5">
  <select v-model="selectedProposal">
    <option>Paper Proposal</option>
    <option>Token Action</option>
  </select>
  <button @click="routeToPage">Create Proposal</button>
</div>
</template>

<script>

const actionTypes = {
  "Paper Proposal": "paperProposal",
  "Token Action": "tokenProposal",
}


export default {
  name: "NewProposalSelector",
  data () {
    return {
      selectedAction: "Paper Proposal",
    }
  },
  methods: {
    routeToPage() {
      console.log(actionTypes[this.selectedAction])
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