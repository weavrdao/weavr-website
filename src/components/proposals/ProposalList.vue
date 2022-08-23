<template>
  <div class="proposal-list column py-3 px-5">
    <h3 class="title is-size-3">{{ proposalStatus }}</h3>
    <div v-for="proposal in this.proposals" v-bind:key="proposal.id">
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

<style lang="scss" scoped>
@import "../../styles/_variables.sass";
@import "../../styles/frabric-custom.scss";

.proposal-list {
  border: 1px solid #575757;
  border-radius: 10px;

  h3 {
    color: white;
    font-size: 2rem;
  }
}

</style>