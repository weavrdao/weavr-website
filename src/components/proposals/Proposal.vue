<template>
  <div>
    <div @click="routeToHome" class="close-icon">
      <!-- NOTE (bill) Just could not get this icon importing for the life of me -->
      <!-- <unicon name="multiply" fill="white"/> -->
      <unicon name="times-circle" fill="#d85a50" width="24" height="24"></unicon>
    </div>
    <div class="proposal-type" :class="this.typeStylingData.class">
      {{ `${this.typeStylingData.text} Proposal` }}
    </div>
    <h2 class="is-size-5 has-text-mediumBlue">
      {{ this.proposal.startDate }}
    </h2>
    <h4 :class="[this.proposal.state=='Cancelled' || this.proposal.state=='Failed' ? 'has-text-red' : 'has-text-success']">{{this.proposal.state}}</h4>
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

    <!-- Thread Proposal -->

    <div v-if="this.proposal.proposalType === ProposalTypes.Thread">
      <div class="columns">
        <div class="column is-two-thirds mb-5">
          <div class="p-3">
            <div class="card mb-5">
              <div class="label">Thread Address:</div>
              <Address value="0x00"></Address>
            </div>
          </div>
          <div class="card mt-5">
            <div class=" image-container">
              <Carousel :autoplay="8000" :items-to-show="1" :wrap-around="true">
                <Slide v-for="imageHash in this.proposal.imageHashes" v-bind:key="imageHash">
                  <div class="slide-image-container">
                    <img v-bind:src="getIpfsUrl(imageHash)" alt="">
                  </div>
                </Slide>
                <template #addons>
                  <Navigation />
                  <Pagination />
                </template>
              </Carousel>
            </div>
          </div>
          <div class="">
            <p class="label mt-5 mb-5">Property Description</p>
            <vue-markdown class="content markdown-body"  :source="this.proposal.descriptor"/>
          </div>
          <div class="card mt-5">
            <p class="label mb-3">Documents</p>
            <div class="is-flex is-flex-direction-column is-justify-content-flex-start" v-for="document in this.proposal.documentHashes" v-bind:key="document">
              <a class="ipfs-document-link" :href="getIpfsUrl(document)"><span>{{ document }}</span></a>
            </div>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="card p-3 has-radius-lg border-lightGray">
            <p class="subtitle mb-3">Metrics</p>
            <div class="columns mb-0" v-for="metric in this.proposal.metrics" :key="metric">
              <div class="column is-half">
                <div class="label">{{ metric.label}}:</div>
              </div>
              <div class="column">{{ metric.value}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- End Thread Proposal -->



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
import {Carousel, Navigation, Pagination, Slide} from "vue3-carousel";
import {ProposalTypes} from "@/models/common";
import {isJson} from "@/utils/common";

export default {
  name: "Proposal",
  computed: {
    ProposalTypes() {
      return ProposalTypes
    },
    metrics() {
      if(!isJson(this.proposal?.metrics)) return {}
      const obj = JSON.parse(this.proposal.metrics);
      const keys = Object.keys(obj);
      const values = Object.values(obj);
      const metrics = []
      for(let i=0; i<keys.length; i++) {
        metrics.push({label: keys[i], value: values[i]})
      }
      return metrics
    }
  },
  components: {
    Address,
    VueMarkdown,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  props: ["proposal"],
  data() {
    return {
      typeStylingData: getProposalTypeStyling(this.proposal.proposalType)
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
    getIpfsUrl(path) {
      return path
        ? `${process.env.VUE_APP_IFPS_GATEWAY_BASE_URL}/${path}`
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/weavr-custom.scss";
@import "../../styles/markdown.scss";
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
  transition: all 150ms;
  cursor: pointer;
}
.description-container {
  background: transparent !important;
  padding: 25px;
  border-radius: $tiny-radius;

  p {
    max-width: 56ch;
  }
}

</style>