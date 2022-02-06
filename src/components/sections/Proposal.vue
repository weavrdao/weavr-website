<template>
  <div v-if="proposal" class="container p-5">
    <StackNavigationBar class="mt-8" @onBack="goBack">
      {{ "Proposal — " + proposal.title }}
    </StackNavigationBar>
    <div class="columns is-full">
      <ProposalListItem
        :proposal="proposal"
        :assetId="proposal.id"
        :embedded="true"
        class="column is-half"
      >
        <div class="subtitle mt-2 mb-2">
          {{ holderCounts.voted }} / {{ holderCounts.total }} have voted
          <VotingProgressBar
            class="mt-2"
            :submittedCount="holderCounts.voted"
            :totalCount="holderCounts.total"
          />
        </div>
      </ProposalListItem>
    </div>

    <div class="columns">
      <div class="m-2 p-4 panel content column is-two-thirds">
        <h3 class="subtitle is-size-4 mt-3">Description</h3>
        <vue-markdown class="content" :source="proposal.description" />
      </div>

      <div class="m-2 p-4 column is-narrow panel ml-2 p-4" v-if="isVotable">
        <h3 class="subtitle is-size-4 mt-2">Your Vote</h3>
        <div v-for="(opt, i) in voteOptions" :key="opt">
          <label>
            <input
              class="radio-vote"
              type="radio"
              name="proposal-option"
              :aria-labelledby="`proposal-option-${i}-label`"
              @input="optionPickedAtIndex(i)"
            />
            <div class="button">{{ opt }}</div>
          </label>
        </div>
        <div v-if="isVotable" class="mt-8 flex flex-col items-stretch">
          <Button label="Vote" @click="vote" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radio-vote {
  appearance: none;
  -webkit-appearance: none;
}
.radio-vote ~ .button {
  min-width: 20ch;
  text-align: left;
  justify-content: flex-start;
  margin-top: 0.5rem;
}
.radio-vote:checked ~ .button {
  background: #3e8ed0;
  color: white;
  transition-duration: 0.2s;
}
</style>

<script>
import { mapGetters, mapActions } from "vuex";
import StackNavigationBar from "../layout/navigation/StackNavigationBar.vue";
import VotingProgressBar from "../views/voting/VotingProgressBar.vue";
import Button from "../views/common/Button.vue";
import { VoteType } from "../../models/vote";
import ProposalListItem from "../views/voting/ProposalListItem.vue";
import VueMarkdown from "vue-markdown-render";

export default {
  name: "Proposal",
  components: {
    StackNavigationBar,
    VotingProgressBar,
    Button,
    ProposalListItem,
    VueMarkdown,
  },
  props: {
    assetId: {
      type: String,
      required: true,
    },
    proposalId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      countdownRef: null,
      timeRemainingString: "",
      pickedOption: null,
    };
  },
  computed: {
    ...mapGetters({
      walletAddress: "userWalletAddress",
      assetMap: "assetsById",
      proposalsMap: "proposalsById",
    }),

    asset() {
      return this.assetMap.get(this.assetId);
    },

    proposal() {
      console.table({
        id: this.proposalId,
        val: this.proposalsMap.get(this.proposalId),
      });
      return this.proposalsMap.get(this.proposalId);
    },

    votes() {
      var yesVoteShares = 0;
      var noVoteShares = 0;

      this.proposal.votes.forEach((vote) => {
        if (vote.type == VoteType.Yes) {
          yesVoteShares += vote.count;
        } else if (vote.type == VoteType.No) {
          noVoteShares += vote.count;
        }
      });

      return {
        yes: {
          count: yesVoteShares,
          percentage: (yesVoteShares / (yesVoteShares + noVoteShares)) * 100,
        },
        no: {
          count: noVoteShares,
          percentage: (noVoteShares / (yesVoteShares + noVoteShares)) * 100,
        },
      };
    },

    holderCounts() {
      return {
        voted: this.proposal.votes.length,
        total:
          parseInt(this.proposalId, 10) < 3
            ? this.asset.owners.size - 1
            : this.asset.owners.size,
      };
    },

    voteOptions() {
      return Object.values(VoteType);
    },

    isVotable() {
      if (parseInt(this.proposalId, 10) < 3) {
        return false;
      }

      let hasWalletVoted = this.proposal.votes.find((v) => {
        return v.voterAddress == this.walletAddress;
      });

      return !hasWalletVoted;
    },
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      voteOnProposal: "voteOnProposal",
    }),

    goBack() {
      this.$router.back();
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

            this.timeRemainingString = `${days} days, ${hours}h : ${mins}m : ${secs}s`;
          } else {
            this.timeRemainingString = "The voting is over";
          }
        }.bind(this),
        1000
      );
    },
    /* eslint-disable indent */
    optionPickedAtIndex(optionIndex) {
      switch (optionIndex) {
        case 0:
          this.pickedOption = VoteType.Yes;
          break;
        case 1:
          this.pickedOption = VoteType.No;
          break;
        case 2:
          this.pickedOption = VoteType.Abstain;
          break;
        default:
          this.pickedOption = null;
          break;
      }
    },

    vote() {
      if (!this.pickedOption) {
        return;
      }

      this.voteOnProposal({
        assetId: this.assetId,
        proposalId: this.proposalId,
        voteType: this.pickedOption,
        $toast: this.$toast,
      });
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
  },
  mounted() {
    this.refresh({ assetId: this.assetId });
    this.syncWallet();
  },
  created() {
    this.setTimeRemainingCountdown();
  },
  unmounted() {
    clearInterval(this.countdownRef);
  },
};
</script>