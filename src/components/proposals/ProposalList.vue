<template>
  <div>
    <h2 class="title is-size-3">{{ proposalStatus }}</h2>
    <div v-for="proposal in proposals" v-bind:key="proposal.id">
      <ProposalListItem :proposal="proposal" :assetId="assetId"/>
    </div>
  </div>
</template>

<script>
import ProposalListItem from "../views/voting/ProposalListItem.vue";

export default {
  name: "ProposalList",
  components: {
    ProposalListItem,
  },
  props: {
    proposalStatus: {
      type: String,
      required: true,
    },
    proposals: {
      type: Array,
      required: true,
    },
    assetId: {
      type: String,
      required: true,
    },
  }
}
</script>