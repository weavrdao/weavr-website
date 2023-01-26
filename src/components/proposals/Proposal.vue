<template>
  <div>
    <div @click="routeToHome" class="close-icon">
      <!-- NOTE (bill) Just could not get this icon importing for the life of me -->
      <!-- <unicon name="multiply" fill="white"/> -->
      <div class="temp-close-dot"/>
    </div>
    <div class="proposal-type" :class="this.typeStylingData.class">
      {{ `${this.typeStylingData.text} Proposal` }}
    </div>
    <h2 class="is-size-5 has-text-mediumBlue">
      {{ this.proposal.startDate }}
    </h2>
    <h3 :class="[this.proposal.state=='Cancelled' || this.proposal.state=='Failed' ? 'has-text-red' : 'has-text-success', 'p-2',]">{{this.proposal.state}}</h3>
    <h1 class="title has-text-white mb-5">{{ this.proposal.title }}</h1>
    <label class="label">Creator</label>
    <Address :value="this.proposal.creator" />
    <p class="mt-2">
      <strong
          :class="this.proposal.supermajority ? 'has-text-red' : 'has-text-success'">
        {{ this.proposal.supermajority ? 'Supermajority consensus required' : 'Supermajority consensus not required' }}
      </strong>
    </p>
    <a :href="this.proposal.forumLink" target="_blank" rel="noopener" class="button has-background-mediumBlue has-text-white mt-3">Forum link</a>
    <!-- Upgrade Proposal Information -->
    <div v-if="this.proposal.code">
      <label class="label">New Code Address</label>
      <Address :value="this.proposal.code" />
    </div>
    <div v-if="this.proposal.instance">
      <label class="label">Instance Address</label>
      <Address :value="this.proposal.instance" />
    </div>
    <div v-if="this.proposal.version">
      <label class="label">Proposed Version</label>
      <p><strong>{{this.proposal.version}}</strong></p>
    </div>
    <!-- End Upgrade Proposal Information -->

    <!-- Participant Proposal Upgrade -->
    <div v-if="this.proposal.participant">
      <label class="label">Participant Address</label>
      <Address :value="this.proposal.participant" />
    </div>
    <div v-if="this.proposal.participantType">
      <label class="label">Participant Type</label>
      <p><strong>{{this.proposal.participantType}}</strong></p>
    </div>
    <!-- End Participant Proposal Upgrade -->

    <!-- Token Action Proposal -->
    <div v-if="this.proposal.token">
      <label class="label">Token Address</label>
      <Address :value="this.proposal.token" />
    </div>
    <div v-if="this.proposal.target">
      <label class="label">Target Address</label>
      <Address :value="this.proposal.target" />
    </div>
    <div v-if="this.proposal.mint !== undefined">
      <label class="label">Mint?</label>
      <p>{{this.proposal.mint ? 'Yes': 'No'}}</p>
    </div>
    <div v-if="this.proposal.price">
      <label class="label">Price</label>
      <p><strong>{{this.proposal.price}}</strong></p>
    </div>
    <div v-if="this.proposal.amount">
      <label class="label">Amount</label>
      <p><strong>{{formatEther(this.proposal.amount)}}</strong></p>
    </div>
    <!-- End Token Action Proposal -->

    <div class="box has-background-darkGray">
      <label class="label">Description</label>
      <div class="description-container p-0">
        <vue-markdown class="content markdown-body" :options="{html: true}"  :source="this.proposal.description" />
      </div>
    </div>
    <div class="box has-background-darkGray">
      <label class="label">DAO Resolution</label>
      <div  :class="['p-0'].concat(this.proposal.daoResolution ? ['has-text-warning'] : ['has-text-success'])">
        <div>
          {{
            this.proposal.daoResolution==true
                ? "This proposal will influence the DAO"
                : "This proposal will not influence the DAO"
          }}
        </div>
      </div>
    </div>
    {{assetId}}
  </div>

</template>

<script>
import Address from "../views/address/Address.vue";
import VueMarkdown from "vue-markdown-render";
import {ethers} from "ethers";
import {dateStringForTimestamp, getProposalTypeStyling, padWithZeroes} from "@/data/helpers";

export default {
  name: "Proposal",
  components: {
    Address,
    VueMarkdown
  },
  props: ["proposal"],
  data() {
    return {
      typeStylingData: getProposalTypeStyling(this.proposal.type)
    }
  },
  methods: {
    routeToHome() {
      this.$router.back();
    },
    formatEther(amount) {
      return ethers.utils.formatEther(amount);
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
  }
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