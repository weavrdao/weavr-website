<template>
  <div class="py-3 px-5">
    <div v-if="this.proposals.length !== 0">
      <div class="card m-0 p-0  filter-button-container"
           :class="filterMenuIsOpen && 'container-open'">
        <div
            v-for="{key, class: styles, text, selected} in filterButtons"
            @click="toggleFilter(key)"
            class="button filter-button"
            :class="[styles, !selected && 'unselected']"
            :key="key">
          {{ text }}
        </div>
      </div>
      <div class="columns is-multiline">
        <div class="column is-one-third" v-for="proposal in this.filteredProposals" v-bind:key="proposal.id">
          <ProposalListItem :proposal="proposal" :assetId="assetId"/>
        </div>
      </div>
    </div>
    <div v-else class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <figure>
        <img class="no-proposals-image my-5" src="@/assets/common/no-proposals.svg"/>
      </figure>
      <div class="label is-size-4">No {{ proposalStatus.toLowerCase() }} right now</div>
    </div>
  </div>
</template>

<script>
import ProposalListItem from "../views/voting/ProposalListItem.vue";
import { ProposalTypes } from "../../models/common";
import { getProposalTypeStyling } from "@/data/helpers";
import { mapActions } from "vuex";

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
        .filter(proposal => proposal.status !== "Cancelled")
        .sort((p1, p2) => p1.endTimestamp < p2.endTimestamp);
    },
    filterButtons() {
      return Object.values(ProposalTypes).map(proposal => ({
        key: proposal,
        selected: this.proposalTypesFilter[proposal],
        ...getProposalTypeStyling(proposal)
      }
      ));
    },
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
    }),
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
@import "../../styles/weavr-custom.scss";


.filter-menu-toggler {
  border-radius: $tiny-radius;
  transition: 150ms all ease-in-out;
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0);
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
    background: rgba(255, 255, 255, 0.45);
  }
}

.no-proposals-image {
  height: 20rem;
  transform: translateX(-1.5rem);
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

</style>