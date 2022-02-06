<template>
  <section aria-labelledby="proposal-title">
    <div class="panel mb-2 mt-2 p-4">
      <h2 id="proposal-title" class="is-size-5 has-text-weight-bold mb-4">
        {{ proposal.title }}
      </h2>
      <div class="mb-2 mt-2" v-if="ended">
        <span v-if="this.passed == this.PASSED.Yes" class="tag is-success"
          >PASSED</span
        >
        <span v-else-if="this.passed == this.PASSED.No" class="tag is-danger"
          >FAILED</span
        >
        <span v-else class="tag is-info">TIED</span>
      </div>
      <div v-else>
        <span class="tag is-success">ONGOING</span> — Ends on
        <strong>{{ endDateString }}</strong
        >, (<strong>{{ timeRemainingString }}</strong> left)
      </div>
      <dl>
        <dt class="mt-1 has-text-weight-bold help">Created By</dt>
        <dd class="mb-3">
          <Address :value="proposal.creatorAddress" />
        </dd>
        <dt class="mt-1 has-text-weight-bold help">Results</dt>
        <dd class="mb-3">
          <div>
            <span class="tag is-success">Yes</span> —
            {{ numberFormat.format(votes.yes.percentage) }}% ({{
              votes.yes.count
            }}
            shares)
          </div>
          <div>
            <span class="tag is-danger">No</span> —
            {{ numberFormat.format(votes.no.percentage) }}% ({{
              votes.no.count
            }}
            shares)
          </div>
        </dd>
      </dl>
      <Button
        v-if="!embedded"
        label="View Details"
        extraClasses="pt-1 is-info"
        @click="openProposal"
      />
      <div v-else>
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script>
import Address from "../address/Address.vue";
import Button from "../common/Button.vue";
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
      numberFormat: new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 3,
      }),

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
    dateStringForTimestamp(timestamp) {
      var date = new Date(timestamp * 1000);

      var hours = date.getHours();
      var minutes = date.getMinutes();
      var suffix = " AM";

      if (hours > 11) {
        hours = 24 - hours;
        suffix = " PM";
      }

      const padWithZeroes = (nr) => (nr < 10 ? "0" + nr : nr);

      return `${date.getFullYear()}-${padWithZeroes(
        date.getMonth() + 1
      )}-${padWithZeroes(date.getDate())}, ${padWithZeroes(
        hours
      )}:${padWithZeroes(minutes)} ${suffix}`;
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