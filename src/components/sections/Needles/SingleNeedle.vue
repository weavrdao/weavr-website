<template>
<div class="container">
    <div :style="getCoverStyle()" class="cover-image mb-5">
      <div class="information-container">
        <div class="tag-container mb-2">
          <span class="tag has-background-mediumBlue has-text-white">Residential</span>
        </div>
        <h3 class="has-text-white property-title mb-4">{{ needle.name }}</h3>
        <Address :value="this.needle.id" />
      </div>
        <div class="weavr-icon-container">  
          <img src="../../../assets/logo/new-logo.svg" alt="">
        </div>
    </div>
    
    <div>
    <div class="columns">
      <div class="column is-two-thirds">
        <div class="card">
          <div class="progress-bar-container p-2">
          <p class="label mb-3">Funding progress</p>
          <p class="target-text has-text-right is-size-5">🎯 {{ target }} <strong>USDC</strong></p>
          <progress class="progress is-primary" max="100">{{ 100*deposited/target}}</progress>
          <p class="target-text has-text-left is-size-5">💰 {{ deposited }} <strong>USDC</strong></p>
          <div v-if="crowdfundState !== null" class="is-flex is-justify-content-flex-end">
            <span class="tag has-background-mediumBlue has-text-white">{{ crowdfundState.value }}</span>
          </div>
          <div v-else class="is-flex is-justify-content-flex-end">
            <span class="tag has-background-mediumBlue has-text-white">...</span>
          </div>
        </div>
        <div v-if="shouldShowRedeem" class="card redeem-container is-flex is-align-items-center mb-5">
          <span class="celebration">🥳</span>
          <div>
            <h4>This needle has been executed</h4>
            <h4>Please redeem your thread tokens</h4>
          </div>
          <div class="is-flex-grow-1 is-flex is-justify-content-flex-end">
            <button @click="redeemThreadTokens" class="has-text-white button shiny-button has-background-gold mt-0"><i></i><strong>Redeem</strong></button>
          </div>
        </div>
        </div>


        <div class="card">
          <div class=" image-container">
          <p class="label">Images</p>
          <Carousel :autoplay="8000" :items-to-show="1" :wrap-around="true">
            <Slide v-for="imageHash in needle.imagesHashes" v-bind:key="imageHash">
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
        <div class="card mt-6">
          <p class="label mb-3">Property Description</p>
          <vue-markdown class="content markdown-body" :options="{html: true}"  :source="needle.descriptor || '' " />
        </div>
        <div class="card mt-6">
          <p class="label mb-3">Property Documents</p>
          <div class="is-flex is-flex-direction-column is-justify-content-flex-start" v-for="document in needle.documentHashes" v-bind:key="document">
            <a class="ipfs-document-link" :href="getIpfsUrl(document)"><span>{{ document }}</span></a>
          </div>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="card py-5">
          <p class="label mb-3">Purchase</p>
          <div class="is-flex is-justify-content-space-between">
            <p class="has-text-white">Available:</p>
            <p class="has-text-white">{{ tradeTokenBalance }} <span class="has-text-mediumBlue">USDC</span></p>
          </div>
          <input v-model="purchaseAmount" class="input my-2" type="number" />
          <div class="is-flex is-justify-content-space-between">
            <p class="has-text-white">Shares:</p>
            <p class="has-text-white">{{ crowdfundTokenBalance }} <span class="has-text-mediumBlue">CROWDFUND</span></p>
          </div>
          <div class="mt-2">
            <button v-if="!allowance" class="button has-background-mediumBlue has-text-white">...</button>
            <button v-else-if="Number(allowance) === 0" @click="approve" class="button has-background-mint has-text-white">Approve</button>
            <button v-else @click="purchase" :disabled="crowdfundState.key !== 0" class="button has-background-mint has-text-white">Purchase</button>
          </div>
        </div>
        <div class="card mt-5">
          <p class="label mb-3">Withdraw</p>
          <div class="is-flex is-justify-content-space-between">
            <p class="has-text-white">Available:</p>
            <p class="has-text-white">{{ crowdfundTokenBalance }} <span class="has-text-mediumBlue">CROWDFUND</span></p>
          </div>
          <input v-model="withdrawAmount" class="input my-2" type="number" />
          <div class="mt-2">
            <button v-if="!allowance" class="button has-background-danger has-text-white">...</button>
            <button v-else @click="withdrawFunds" :disabled="crowdfundState.key !== 0" class="button has-background-danger has-text-white">Withdraw</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import "vue3-carousel/dist/carousel.css"
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { ethers } from "ethers";
import Address from "../../views/address/Address.vue";
import VueMarkdown from "vue-markdown-render";

export default {
  name: "SingleNeedle",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    Address,
    VueMarkdown,
  },
  data() {
    return {
      needleId: this.$route.params.needleId.toLowerCase(),
      purchaseAmount: 0,
      withdrawAmount: 0,
    }
  },
  computed: {
    ...mapGetters({
      needles: "allNeedles",
      allowance: "userTradeTokenAllowance",
      tradeTokenBalance: "userTradeTokenBalance",
      crowdfundTokenBalance: "userCrowdfundTokenAllowance",
      crowdfundState: "crowdfundState",
    }),
    
    needle() {
      return this.needles
        .find(n => n.id === this.needleId);
    },
    target() {
      return Number(ethers.utils.formatUnits(this.needle.target, 6)).toLocaleString();
    },
    deposited() {
      return Number(ethers.utils.formatUnits(this.needle.amountDeposited, 6)).toLocaleString();
    },
    shouldShowRedeem() {
      if(!this.crowdfundState) return false;
      return this.crowdfundState.key === 3 && Number(this.crowdfundTokenBalance) > 0;
    }
  },
  methods: {
    ...mapActions({
      deposit: "deposit",
      withdraw: "withdraw",
      approveTradeToken: "approveTradeToken",
      fetchNeedleTokenData: "fetchNeedleTokenData",
      redeem: "redeem",
    }),
    getIpfsUrl(path) {
      return path
        ? `${process.env.VUE_APP_IFPS_GATEWAY_BASE_URL}/${path}`
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
    },
    getCoverStyle() {
      const url = this.needle.imagesHashes
        ? `${process.env.VUE_APP_IFPS_GATEWAY_BASE_URL}/${this.needle.imagesHashes[0]}`
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
    
      return { "background-image": `linear-gradient(to left, rgba(22, 23, 30, 0), rgba(22, 23, 30, 1)), url(${url})`}
    },
    purchase() {
      console.log(this.purchaseAmount);
      this.deposit({
        crowdfundAddress: this.$route.params.needleId,
        amount: this.purchaseAmount,
      })
    },
    withdrawFunds() {
      this.withdraw({
        crowdfundAddress: this.$route.params.needleId,
        amount: this.withdrawAmount,
      })
    },
    approve() {
      this.approveTradeToken({
        assetId: this.needleId,
      })
    },
    getFormattedNeedleBalance() {
      return ethers.utils.parseEthers(this.crowdfundTokenBalance);
    },
    redeemThreadTokens() {
      this.redeem({
        crowdfundAddress: this.$route.params.needleId
      });
    }
  },
  mounted() {
    console.log(this.needle);
    this.fetchNeedleTokenData({
      assetId: this.needleId,
    })
  }
}
</script>
<style scoped lang="scss">
@import "../../../styles/_variables.sass";
@import "../../../styles/weavr-custom.scss";
@import "../../../styles/markdown.scss";


</style>