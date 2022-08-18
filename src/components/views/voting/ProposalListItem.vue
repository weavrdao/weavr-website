import { ethers } from "ethers";
<template>
  <section class="proposal has-radius-md mb-5" aria-labelledby="proposal">
    <span class="proposal-type" :class="this.typeStylingData.class">
      {{ this.typeStylingData.text }}
    </span>
    <div class="is-flex is-flex-direction-column is-justify-content-space-between mb-2 mt-2 pt-4 pb-0 px-4">
      <div>
        <h2 class="is-size-5 has-text-mediumBlue">
          {{ this.startDate }}
        </h2>
        <h2 id="proposal-title" class="is-size-5 has-text-white mb-4">
          {{ proposal.title }}
        </h2>
        <p> {{ proposal.description }}</p>
      </div>
      <dl class="mt-5 mb-0 pb-0">
        <dt class="mt-2 mb-1 help">Creator:</dt>
        <dd class="mb-3">
          <Address :value="proposal.creator" />
        </dd>
      </dl>
    </div>
    <div v-if="!ended" class="is-flex is-justify-content-flex-end">
      <Button
        v-if="!embedded"
        label="Vote"
        extraClasses="p-5 is-mediumBlue bottom-right-corner"
        @click="openProposal"
      />
    </div>
    <div v-else class="is-flex is-justify-content-flex-end">
      <div class="outcome-box bottom-right-corner passed" v-if="this.passed == this.PASSED.Yes">PASSED</div>
      <div class="outcome-box bottom-right-corner failed" v-else-if="this.passed == this.PASSED.No">FAILED</div>
      <div class="outcome-box bottom-right-corner tie" v-else>TIE</div>
    </div>
  </section>
</template>

<script>
import Address from "../address/Address.vue";
import Button from "../common/Button.vue";
import { ProposalTypes } from "../../../models/common";
import { VoteType } from "../../../models/vote";

export default {
  name: "ProposalListItem",
  components: {
    Address,
    Button,
  },
  props: {
    assetId: {
      type: String,
      required: true,
    },
    proposal: {
      type: Object,
      required: true,
    },
    embedded: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {

      PASSED: {
        Yes: 0,
        No: 1,
        Tie: 2,
      },

      timeRemainingString: "",
    };
  },
  computed: {
    votes() {
      let yesVoteShares = 0;
      let noVoteShares = 0;

      this.proposal.votes.forEach((vote) => {
        if (vote.voteDirection == VoteType.Yes) {
          yesVoteShares += vote.count;
        } else if (vote.voteDirection == VoteType.No) {
          noVoteShares += vote.count;
        }
      });

      return {
        yes: {
          count: Number(yesVoteShares).toFixed(0),
          percentage: (yesVoteShares / (yesVoteShares + noVoteShares)) * 100,
        },
        no: {
          count: Number(noVoteShares).toFixed(0),
          percentage: (noVoteShares / (yesVoteShares + noVoteShares)) * 100,
        },
      };
    },

    startDate() {
      const startDate = new Date(this.proposal.startTimestamp * 1000);
      return `${this.padWithZeroes(startDate.getDate())}/${this.padWithZeroes(startDate.getMonth() + 1)}`;
    },

    startDateString() {
      return this.dateStringForTimestamp(this.proposal.startTimestamp);
    },

    endDateString() {
      return this.dateStringForTimestamp(this.proposal.endTimestamp);
    },

    ended() {
      let now = new Date().getTime() / 1000;
      let t = this.proposal.endTimestamp - now;

      return t < 0;
    },
  
    passed() {
      const votes = this.votes;
      if (votes.yes.count > votes.no.count) {
        return this.PASSED.Yes;
      } else if (votes.yes.count < votes.no.count) {
        return this.PASSED.No;
      }
      return this.PASSED.Tie;
    },

    typeStylingData() {
      switch(this.proposal.type) {
      case ProposalTypes.Paper:
        return {
          text: "Paper",
          class: "paper",
        };
      case ProposalTypes.Upgrade:
        return {
          text: "Upgrade",
          class: "upgrade"
        };
      case ProposalTypes.Participant:
        return {
          text: "Participant",
          class: "participant"
        };
      case ProposalTypes.TokenAction:
        return {
          text: "Token Action",
          class: "token-action",
        };
      default:
        return {
          text: "Unknown Type",
          class: "unknown",
        }
      }
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

    padWithZeroes(number){
      return (number < 10 ? "0" + number : number);
    },

    dateStringForTimestamp(timestamp) {
      var date = new Date(timestamp * 1000);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var suffix = " AM";

      if (hours > 11) {
        hours = 24 - hours;
        suffix = " PM";
      }

      return `${date.getFullYear()}-${this.padWithZeroes(
        date.getMonth() + 1
      )}-${this.padWithZeroes(date.getDate())}, ${this.padWithZeroes(
        hours
      )}:${this.padWithZeroes(minutes)} ${suffix}`;
    },

    openProposal() {
      this.$router.push(`/dao/${this.assetId}/proposals/${this.proposal.id}`);
    },
  },

  created() {
    this.setTimeRemainingCountdown();
  },
};
</script>

<style scoped lang="scss">
@import "../../../styles/frabric-custom.scss";
@import "../../../styles/_variables.sass";

.proposal {
  background-color: $darkGray;
  position: relative;
  min-width: 320px;
}

.proposal-type {
  font-weight: 400;
  padding: 5px 10px;
  border: 2px solid white;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0 0.5rem 0 0 !important;
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

.outcome-box {
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 15px 20px;
}

.bottom-right-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 0 0 0.5rem 0;
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