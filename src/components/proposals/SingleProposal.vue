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
  <h2 class="is-size-5 has-text-mediumBlue">
    {{ this.startDate }}
  </h2>
  <h1 class="title has-text-white mb-5">{{ proposal.title }}</h1>
  <label class="label">Creator</label>
  <Address :value="proposal.creator" />
  <div v-if="proposal.version">
    <label class="label">Proposed Version</label>
    <p><strong>{{proposal.version}}</strong></p>
  </div>
  <!-- Upgrade Proposal Information -->
  <div v-if="proposal.code">
    <label class="label">Beacon Address</label>
    <Address :value="proposal.beacon" />
  </div>
  <div v-if="proposal.instance">
    <label class="label">Instance Address</label>
    <Address :value="proposal.instance" />
  </div>
  <div v-if="proposal.version">
    <label class="label">Proposed Version</label>
    <p><strong>{{proposal.version}}</strong></p>
  </div>
  <!-- End Upgrade Proposal Information -->
  <label class="label">Description</label>
  <div class="description-container p-3">
    <p class="has-text-white">{{ proposal.description }}</p>
  </div>
  <label class="label">Consensus</label>
  <div class="votes-container">
    <div class="is-flex is-justify-content-space-between">
      <span class="has-text-mint has-text-weight-semibold">{{ this.votes.yes.percentage + ' %' }}</span>
      <span class="has-text-red has-text-weight-semibold">{{ this.votes.no.percentage + ' %' }}</span>
    </div>
    <div class="votes-bar my-1">
      <div class="green-bar" :style="{
        width: this.votes.yes.percentage + '%',
        // Prevent double borders for unanimous votes
        borderRight: (this.votes.yes.percentage >= 99 || this.votes.no.percentage >= 99) ? 'none' : '2px solid white',
      }"></div>
    </div>
    <div class="is-flex is-justify-content-space-between">
      <span class="has-text-mint has-text-weight-medium">{{ this.votes.yes.count + ' votes in favour' }}</span>
      <span class="has-text-red has-text-weight-medium">{{ this.votes.no.count + ' votes against' }}</span>
    </div>
    <label class="label">Voting</label>
    <div v-if="ended">
      <div class="is-flex is-justify-content-space-between is-align-items-center mt-5">
        <div>
          <p>Voting ended on <strong>{{ endDateString }}</strong></p>
          <p v-if="!!userVote">You voted <strong>{{ userVote.count }} votes {{ userVote.voteDirection === "Yes" ? "for" : "against" }}</strong></p>
        </div>
        <div class="outcome-box has-background-mint" v-if="this.passed == this.PASSED.Yes">PASSED</div>
        <div class="outcome-box has-background-red" v-else-if="this.passed == this.PASSED.No">FAILED</div>
        <div class="outcome-box has-background-cyan" v-else>TIE</div>
      </div>
    </div>
    <div v-else >
      <div v-if="!!address">
        <p class="has-text-mediumBlue">Power: {{ voteAmount.toFixed(1) }} </p>
        <slider
          class="slider"
          v-model="voteAmount"
          color="#5A50D8"
          track-color="#FEFEFE"
          :max=Number(balance)
          :min=0
          :step=0.1
          tooltop="true"
          tooltipText="%v votes"/>
          <div class="is-flex is-justify-content-space-between buttons-container">
            <button @click="voteAmount = 0" class="button">0 %</button>
            <button @click="voteAmount = Number(balance) / 4" class="button">25%</button>
            <button @click="voteAmount = Number(balance) / 2" class="button">50%</button>
            <button @click="voteAmount = 3 * Number(balance) / 4" class="button">75%</button>
            <button @click="voteAmount = Number(balance)" class="button">100%</button>
          </div>
      </div>
      <div class="is-flex is-justify-content-space-between is-align-items-center mt-5">
        <button @click="submitYesVote" :disabled="!address" class="button has-text-white has-background-mint has-text-weight-semibold">VOTE FOR</button>
        <button @click="submitNoVote" :disabled="!address" class="button has-text-white has-background-red has-text-weight-semibold">VOTE AGAINST</button>
      </div>
      <div class="mt-5">
        <p>Voting ends on <strong>{{ endDateString }}</strong></p> 
        <p>( {{ timeRemainingString }} )</p>
        <div v-if="!!userVote">
          <p>You voted <strong>{{ userVote.count }} votes {{ userVote.voteDirection === "Yes" ? "for" : "against" }}</strong></p>
        </div>
      </div>
    </div>
  </div>
</div>  
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import slider from "vue3-slider"
import {
  getProposalTypeStyling,
  padWithZeroes,
  dateStringForTimestamp,
  getVotes,
  hasEnded,
  getResult,
} from "../../data/helpers";
import { PASSED } from "../../models/common";
import Address from "../views/address/Address.vue";

export default {
  // (bill) TODO: Make this reload data if loaded directly
  //              with a check to prevent extraneous calls.
  name: "SingleProposal",
  components: {
    Address,
    slider,
  },
  data () {
    return {
      proposalId: Number(this.$route.params.proposalId),
      voteAmount: 0,
      timeRemainingString: "",
      PASSED,
    }
  },
  props: {
    assetId: {
      type: String,
      required: true,
    }
  },
  computed: {
    ...mapGetters({
      proposals: "assetProposals",
      address: "userWalletAddress",
      balance: "userTokenBalance",
    }),
    proposal() {
      return this.proposals
        .find(p => p.id === this.proposalId);
    },
    typeStylingData() {
      return getProposalTypeStyling(this.proposal.type);
    },
    votes() {
      return getVotes(this.proposal);
    },
    ended() {
      return hasEnded(this.proposal);
    },
    passed() {
      return getResult(this.proposal);
    },
    startDate() {
      const startDate = new Date(this.proposal.startTimestamp * 1000);
      return `${padWithZeroes(startDate.getDate())}/${padWithZeroes(startDate.getMonth() + 1)}`;
    },
    startDateString() {
      return dateStringForTimestamp(this.proposal.startTimestamp);
    },
    endDateString() {
      return dateStringForTimestamp(this.proposal.endTimestamp);
    },
    userVote() {
      if (!this.address) return null;
      return this.proposal.votes.find(vote => vote.voter.toLowerCase() === this.address.toLowerCase());
    },
  },
  methods: {
    ...mapActions({
      vote: "vote",
      loadProposalData: "refreshProposalsDataForAsset",
    }), // Voting action
    routeToHome() {
      this.$router.push("/frabric");
    },
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
            this.timeRemainingString = "Voting period has ended";
          }
        }.bind(this),
        1000
      );
    },
    submitYesVote() {
      this.vote({
        assetAddress: this.assetId,
        proposalId: this.$route.params.proposalId,
        votes: +this.voteAmount,
      })
    },
    submitNoVote() {
      this.vote({
        assetAddress: this.assetId,
        proposalId: this.$route.params.proposalId,
        votes: -this.voteAmount,
      })
    }
  },
  mounted() {
    this.setTimeRemainingCountdown();
    this.loadProposalData();
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/frabric-custom.scss";

.relative {
  position: relative;
}

.label {
  margin-top: 30px;
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
.votes-bar {
  width: 100%;
  height: 25px;
  background: $red;
  overflow: hidden;
  border: 2px solid white;
}

.green-bar {
  background: $mint;
  height: 30px;
}

.outcome-box {
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 15px 20px;
}

.slider {
  margin-bottom: 5px;
  height: 23px;
  transition: all 150ms;

  &:hover {
    filter: contrast(120%);
  }
}

.buttons-container {
  margin-top: 10px;
  .button {
    background: $mediumBlue;
    color: white;
    width: 3rem;
    height: 1.5rem;
    font-size: 12px;
    font-weight: 600;
  }
}
</style>