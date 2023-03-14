<template>
  <div class="container p-5 relative">
    <div class="block p-0 has-background-darkGray">
      <div @click="simulate" v-if="this.simluation_results.length == 0 && !ended" class=" mt-5 is-pulled-right button is-small is-rounded has-text-mediumGray is-dark">
        <i><unicon name="cog" fill="#8D8D8D" :width="16" :heigth="16"/></i>
        <span class="ml-1 is-text-7">Simulate Proposal</span>
      </div>
      <div v-if="this.simluation_results.length !== 0" class="has-radius-lg mt-5 is-pulled-right">
        <!-- <span class="has-background-darkGray is-size-7 ">
            <p v-if="this.simluation_results[this.simluation_results.length-1].status=='fail'" class="has-text-white">Simulation Results, if there are any failures this proposal might not have enough votes to pass, or there might be another reason causing the proposal to fail.</p>
            <p v-else class="has-text-white">Simulation Sucessful, click here to navigate to the results.</p>
        </span> -->
        <a class="py-1"  v-for="{url, status} in this.simluation_results" :key="url"
          :href="url" target="_blank">
          <div :class="['tag  is-small has-text-white', status == 'fail' ? 'is-danger':'is-success']">
            {{status}}
          </div>
        </a>
      </div>
    </div>
    <div class="box">
      <Proposal :proposal="proposal" />
    </div>
    <div class="box has-background-darkGray">
      <label class="label">Consensus</label>
      <div class="votes-container">
        <div class="is-flex is-justify-content-space-between">
          <span class="has-text-success has-text-weight-semibold">{{ this.votes.yes.percentage + ' %' }}</span>
          <span class="has-text-red has-text-weight-semibold">{{ this.votes.no.percentage + ' %' }}</span>
        </div>
        <div class="votes-bar my-1">
          <div class="green-bar" :style="{
            width: this.votes.yes.percentage + '%',
            // Prevent double borders for unanimous votes
            borderRight: (this.votes.yes.percentage >= 99 || this.votes.no.percentage >= 99) ? 'none' : 'none',
          }"></div>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="has-text-success has-text-weight-medium">{{ this.votes.yes.count + ' votes in favour' }}</span>
          <span class="has-text-red has-text-weight-medium">{{ this.votes.no.count + ' votes against' }}</span>
        </div>
      </div>
    </div>
    <div class="box has-background-darkGray">
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
            handleScale="0"
            circleOffset="40"
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
        <div class="is-flex is-justify-content-space-between is-align-items-center mt-5" v-if="!cancelled || !ended">
          <button @click="submitYesVote" :disabled="!address" class="button has-text-white has-background-success has-text-weight-semibold">VOTE FOR </button>
          <button @click="submitNoVote" :disabled="!address"  class="button has-text-white has-background-red has-text-weight-semibold">VOTE AGAINST</button>
        </div>
        <div v-if="userIsCreator && !ended" class="is-flex is-justify-content-flex-end mt-5">
          <button class="button is-warning has-text-dark" @click="withdrawProposal">Withdraw Proposal</button>
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
import Proposal from "@/components/proposals/Proposal.vue"
import { ethers } from "ethers";
import {CONTRACTS} from "@/services/constants";

export default {
  name: "SingleProposal",
  components: {
    slider,
    Proposal
  },
  data () {
    return {
      proposalId: Number(this.$route.params.proposalId),
      simluation_results: [],
      voteAmount: 0,
      timeRemainingString: "",
      PASSED,
    }
  },
  computed: {
    ...mapGetters({
      proposals: "assetProposals",
      address: "userWalletAddress",
      balance: "userTokenBalance",
      quorum: "quorum",
    }),
    hasReachedQuorum() {
      console.log(this.quorum, this.participation);
      return this.quorum < this.participation
    },
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
    cancelled() {
      return this.proposal.state === "Cancelled"
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
      // Select user vote by matching voter address to user address
      const vote = this.proposal.votes.find(vote => vote.voter.toLowerCase() === this.address.toLowerCase());

      if(vote) {
        return {
          ...vote,
          count: Number(vote.count).toFixed(1),
        }
      } else {
        return null;
      }

    },
    userIsCreator() {
      if(this.address === null) return false;
      return this.address.toLowerCase() === this.proposal.creator.toLowerCase();
    },
  },
  methods: {
    ...mapActions({
      vote: "vote",
      getQuorum: "quorum",
      withdraw: "withdrawProposal",
      simulateProposal: "simulateProposalWillComplete",
    }),

    routeToHome() {
      this.$router.back();
    },

    async simulate() {
      this.simluation_results = await this.simulateProposal({
        proposalId: this.proposalId,
        endTimestamp: this.proposal.endTimestamp});
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
        $toast: this.$toast
      })
    },

    submitNoVote() {
      this.vote({
        assetAddress: this.assetId,
        proposalId: this.$route.params.proposalId,
        votes: -this.voteAmount,
        $toast: this.$toast
      })
    },

    formatEther(amount) {
      return ethers.utils.formatEther(amount);
    },

    withdrawProposal() {
      this.withdraw({
        assetAddress: this.assetId,
        proposalId: this.$route.params.proposalId,
        $toast: this.$toast,
      });
    }
  },

  mounted() {
    this.setTimeRemainingCountdown();
    this.getQuorum({assetId: this.$route.params.assetId})
  },

  created() {
    if(this.balance) {
      this.voteAmount = +this.balance;
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../styles/weavr-custom.scss";
@import "../../styles/markdown.scss";

.container {
  min-width: 80% !important;
}
.relative {
  position: relative;
}

.label {
  margin-top: 30px;
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

.thread {
  border-color: yellow;
  color: yellow;
}

.description-container {
  background: transparent !important;
  padding: 25px;
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
  border: none;
}

.green-bar {
  background: $success;
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