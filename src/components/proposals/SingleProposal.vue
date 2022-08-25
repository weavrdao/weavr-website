<template>
<div class="container p-5 relative">
  <div @click="routeToHome" class="close-icon">
    <!-- NOTE (bill) Just could not get this icon importing for the life of me -->
    <!-- <unicon name="multiply" fill="white"/> -->
    <div class="temp-close-dot"/> 
  </div>
  <div class="proposal-type" :class="this.typeStylingData.class">
    {{ `${this.typeStylingData.text} Proposal` }}
  </div>
  <h1 class="title has-text-white my-5">{{ proposal.title }}</h1>
  <label class="label">Creator</label>
  <Address :value="proposal.creator" />
  <label class="label">Description</label>
  <div class="description-container p-3">
    <p class="has-text-white">{{ proposal.description }}</p>
  </div>
</div>  
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getProposalTypeStyling } from "../../data/helpers";
import Address from "../views/address/Address.vue";

export default {
  // (bill) TODO: Make this reload data if loaded directly
  //              with a check to prevent extraneous calls.
  name: "SingleProposal",
  components: {
    Address,
  },
  data () {
    return {
      proposalId: Number(this.$route.params.proposalId),
    }
  },
  computed: {
    ...mapGetters({
      proposals: "assetProposals"
    }),
    proposal() {
      return this.proposals
        .find(p => p.id === this.proposalId);
    },
    typeStylingData() {
      return getProposalTypeStyling(this.proposal.type);
    },
  },
  methods: {
    ...mapActions({}), // Voting action
    routeToHome() {
      this.$router.push("/frabric");
    }
  },
  mounted() {
    console.log(this.$route.params);
    console.log(this.proposalId);
    console.log(this.proposals);
    console.log(this.proposal);
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/frabric-custom.scss";

.relative {
  position: relative;
}

.label {
  margin-top: 20px;
}

.close-icon {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 1000px;
  background: rgba(255, 255, 255, 0);
  transition: all 150ms;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .temp-close-dot {
    background: red;
    width: 15px;
    height: 15px;
    border-radius: 100px;
    transform: translateX(1px);
  }
}

.proposal-type {
  display: inline-block;
  font-weight: 400;
  padding: 5px 10px;
  border: 2px solid white;
  border-radius: $tiny-radius;
  margin-bottom: 20px;
}
.paper {
  border-color: #00EDC4;
  color: #00EDC4;
}

.participant {
  border-color: whitesmoke;
  color: whitesmoke;
}

.upgrade {
  border-color: #D841DE;
  color: #D841DE;
}

.description-container {
  background: $mediumDarkGray;
  border-radius: $tiny-radius;

  p {
    max-width: 56ch;
  }
}
</style>