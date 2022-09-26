<template>
  <div class="proposal-list column py-3 px-5">
    <h3 class="title is-size-3 my-4">{{ proposalStatus }}</h3>
    <div v-if="this.proposals.length !== 0">
      <div v-for="proposal in this.filteredProposals" v-bind:key="proposal.id">
        <ProposalListItem :proposal="proposal" :assetId="assetId"/>
      </div>
    </div>
    <div class="loading-container is-flex is-justify-content-center is-flex-direction-column is-align-items-center " v-else>
      <img class="loading-icon" src="../../assets/logo/new-logo-white.svg" alt="">
      <span>Loading resolutions</span>
    </div>
  </div>
</template>

<script>
import ProposalListItem from "../views/voting/ProposalListItem.vue";
import { ProposalTypes } from "../../models/common";
import { getProposalTypeStyling } from "@/data/helpers";

export default {
  name: "ProposalList",
  data() {
    return {
      filterMenuIsOpen: false,
      // Create object with shape { [proposalType]: true }
      proposalTypesFilter: Object.fromEntries(
        Object.values(ProposalTypes)
          .map(v => [v, true])
      ),
    }
  },
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
  },
  computed: {
    filteredProposals() {
      return this.proposals
        .filter(proposal => this.proposalTypesFilter[proposal.type])
        .sort((p1, p2) => p1.endTimestamp < p2.endTimestamp);
    },
    filterButtons() {
      return Object.values(ProposalTypes).map(proposal => ({
        key: proposal,
        selected: this.proposalTypesFilter[proposal],
        ...getProposalTypeStyling(proposal)}
      ));
    },
  },
  methods: {
    // Switch a given filter on or off
    toggleFilter(proposalType) {
      this.proposalTypesFilter = {
        ...this.proposalTypesFilter,
        [proposalType]: !this.proposalTypesFilter[proposalType],
      }
    }
  },
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

.no-proposals-image {
  height: 20rem;
  width: 20rem;
  transform: translateX(-1.5rem);
}

.filter-menu-toggler {
  border-radius: $tiny-radius;
  transition: 150ms all ease-in-out;
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255, 0);
  padding: 8px 5px;
  height: 25px;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;

  .label {
    line-height: 25px;
    margin-bottom: 0;
    cursor: pointer;
  }

  strong {
    display: inline-flex;
    margin-left: 5px;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    transform: rotate(-180deg) scale(1, 0.8);
    transition: 300ms all ease-in-out;
    width: 25px;
    height: 25px;
    font-stretch: expanded;
  }
  
  &:hover {
    background: rgba(255,255,255, 0.45);
  }
}

.filter-button-container {
  gap: 8px;
  height: 0px;
  opacity: 0;
  transition: all 150ms ease-in-out;
  overflow: hidden;
}

.open {
  transform: rotate(0deg) scale(1, 0.8) !important;
}

.container-open {
  opacity: 1;
  height: 50px;
}

.filter-button {
  font-weight: 400;
  padding: 5px 10px;
  color: white;
  border: 2px solid white;
  border-radius: 0.5rem !important;
  transition: all 150ms;

  &:hover {
    color: white;
  }
}

.paper {
  border-color: #00EDC4;
  background: #00EDC4;
}

.participant {
  border-color: whitesmoke;
  color: black;
  background: whitesmoke;

  &:hover {
    color: black;
  }
}

.upgrade {
  border-color: #D841DE;
  background: #D841DE;
}

.token-action {
  border-color: $red;

  background: $red;
}

.unselected {
  color: white;
  background: none !important;
}

.loading-container {
  padding: 100px 0;
  gap: 50px;

  span {
    font-size: 1.2rem;
  }
}

@keyframes fade {
  0%,100% { opacity: 0 }
  50% { opacity: 1 }
}

.loading-icon {
  height: 3rem;
  width: 3rem;
  opacity: 0;
  animation: fade 2.5s ease-in-out infinite;
}

</style>