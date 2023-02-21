<template>
    <section @click="openProposal" class="card p-4 proposal has-background-darkGray has-radius-lg mb-1 h-100" aria-labelledby="proposal">
      <div :class="this.typeStylingData.class">
        {{ this.typeStylingData.text }}
      </div>
      <div :class="[proposal.state=='Cancelled' || proposal.state=='Failed' ? 'has-text-red' : 'has-text-success']">{{proposal.state}}</div>
      <div class="proposal-date">
        <h2 class="is-size-5 has-text-mediumBlue">
            {{ this.startDate }}
        </h2>
      </div>
      <div class="card-content px-0 py-1">
        <div class=" py-0">
          <div class="py-0">
            <div id="proposal-title" class="proposal-title is-size-5 has-text-white mb-4">
              {{ proposal.title }}
            </div>    
          </div>
          <Address class="has-text-white" :value="proposal.creator"/>
          <div v-if="!ended" class="is-flex is-justify-content-flex-end">
          </div>
          <div v-else class="is-flex is-justify-content-flex-end">
            <div class="tag is-medium bottom-right-corner is-success" v-if="this.passed == this.PASSED.Yes">PASSED</div>
            <div class="tag is-medium bottom-right-corner has-backgorund-red" v-else-if="this.passed == this.PASSED.No">FAILED</div>
            <div class="tag is-medium bottom-right-corner is-warning" v-else>TIE</div>
          </div>
        </div>
      </div>
    </section>
</template>
  
<script>
import Address from "../address/Address.vue";

import {
  getProposalTypeStyling,
  padWithZeroes,
  getResult,
  hasEnded,
} from "@/data/helpers";
import { PASSED } from "@/models/common";
import { DAO } from "../../../services/constants";

export default {
  name: "ProposalListItem",
  components: {
    Address,
  },
  props: {
    proposal: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timeRemainingString: "",
      PASSED,
    };
  },
  computed: {

    startDate() {
      const startDate = new Date(this.proposal.startTimestamp * 1000);
      return `${padWithZeroes(startDate.getDate())}/${padWithZeroes(startDate.getMonth() + 1)}`;
    },

    ended() {
      return hasEnded(this.proposal);
    },

    passed() {
      return getResult(this.proposal);
    },

    typeStylingData() {
      return getProposalTypeStyling(this.proposal.type);
    },
  },
  methods: {
    setTimeRemainingCountdown() {
      clearInterval(this.countdownRef);

      this.countdownRef = setInterval(
        function () {
          let now = new Date().getTime() / 1000;

          let t = this.proposal.endTimestamp - now;

          if (t >= 0) {
            let days = Math.floor(t / (60 * 60 * 24));
            let hours = Math.floor((t % (60 * 60 * 24)) / (60 * 60));
            let mins = Math.floor((t % (60 * 60)) / 60);
            let secs = Math.floor(t % 60);

            this.timeRemainingString = `${days}d, ${hours}h, ${mins}m, ${secs}s`;
          } else {
            this.timeRemainingString = "The voting is over";
          }
        }.bind(this),
        1000
      );
    },
    openProposal() {
      this.$router.push(this.$route.path+`/proposal/${this.proposal.id}`);
    },
  },

  created() {
    this.setTimeRemainingCountdown();
  },

  routeToProposal() {
    this.$router.push(`/${DAO}/proposal/${this.proposal.id}`);
  },
};
</script>

<style scoped lang="scss">
@import "../../../styles/weavr-custom.scss";
@import "../../../styles/_variables.sass";
@import "../../../styles/markdown.scss";

.proposal {
  
  position: relative;
  height: 12rem;
  
  cursor: pointer;
  transition: all 150ms;
  &:hover {
    filter: contrast(95%);
  }
}

.proposal-type, .proposal-status {
  display: block;
  font-size: 1rem;
}

.proposal-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.proposal-date {
  font-weight: 400;
  padding: 5px 10px;
  position: absolute;
  top: 0;
  right: 0;
}

.outcome-box {
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 15px 20px;
}

.description {
  display: inline-block;
  line-height: 1.2rem;
  max-height: 7.2rem;
  white-space: nowrap;
  max-width: min(10ch, 56ch);
        
  overflow: hidden;
  text-overflow: ellipsis;
}

.markdown-body {
  background: transparent;
  max-height: 15ch;
    max-width: min(56ch, 100ch);
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 767px) {
    .markdown-body {
        padding: 15px;
    }
}

.bottom-right-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 0.5rem 0 !important;
}

.passed {
  background: $mint;
}

.failed {
  background: $red;
}

.tied {
  background: $cyan;
}

</style>