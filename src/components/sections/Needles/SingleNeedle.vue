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
    <div class="dark-card progress-bar-container">
        <p class="has-text-white mb-3">Funding progress</p>
        <p class="target-text has-text-right is-size-5">🎯 {{ target }} <strong>USDC</strong></p>
        <div class="progress-bar">
          <div v-bind:style="getProgressBarStyle()" class="progress" />
        </div>
        <p class="target-text has-text-left is-size-5">💰 {{ deposited }} <strong>USDC</strong></p>
        <div v-if="crowdfundState !== null" class="is-flex is-justify-content-flex-end">
          <span class="tag has-background-mediumBlue has-text-white">{{ crowdfundState.value }}</span>
        </div>
        <div v-else class="is-flex is-justify-content-flex-end">
          <span class="tag has-background-mediumBlue has-text-white">...</span>
        </div>
    </div>
    <div v-if="shouldShowRedeem" class="dark-card redeem-container is-flex is-align-items-center mb-5">
      <span class="celebration">🥳</span>
      <div>
        <h4>This needle has been executed</h4>
        <h4>Please redeem your thread tokens</h4>
      </div>
      <div class="is-flex-grow-1 is-flex is-justify-content-flex-end">
        <button @click="redeemThreadTokens" class="has-text-white button shiny-button has-background-gold mt-0"><i></i><strong>Redeem</strong></button>
      </div>
    </div>
    <div>
    <div class="columns">
      <div class="column is-two-thirds">
        <div class="dark-card image-container">
          <p class="has-text-white mb-3">Images</p>
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
      <div class="column is-one-third">
        <div class="dark-card">
          <p class="has-text-white mb-3">Purchase</p>
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
        <div class="dark-card mt-5">
          <p class="has-text-white mb-3">Withdraw</p>
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
    <div class="dark-card">
      <p class="has-text-white mb-3">Property Description</p>
      <vue-markdown class="content markdown-body" :options="{html: true}"  :source="needle.descriptor" />
    </div>
    <div class="dark-card mt-5">
      <p class="has-text-white mb-3">Property Documents</p>
      <div class="is-flex is-flex-direction-column is-justify-content-flex-start" v-for="document in needle.documentHashes" v-bind:key="document">
        <a class="ipfs-document-link" :href="getIpfsUrl(document)"><span>{{ document }}</span></a>
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
    getProgressBarStyle() {
      return {
        width: `${100
          * Number(
            ethers.utils.formatUnits(this.needle.amountDeposited)
          ) / Number(
          ethers.utils.formatUnits(this.needle.target)
        )}%`
      }
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
@import "../../../styles/frabric-custom.scss";
@import "../../../styles/markdown.scss";

.carousel__prev,
.carousel__next {
	// border: 5px solid white;
	// background-color: red;
}

.property-title {
  font-size: 2rem !important;
}

.tag {
  padding: 5px 20px !important;
}

.information-container {
  position: absolute;
  top: 30px;
  left: 30px;
}

.dark-card {
  border-radius: 8px;
  border: 1px solid $darkGray;
  padding: 20px 30px;
  background: $boxGray;
}

.cover-image {
    position: relative;
    height: 200px;
    overflow: hidden;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 12px;
    border: 1px solid $darkGray;

    @media screen and (max-width: 500px) {
      height: 250px;
    }
}

.weavr-icon-container {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 45px;
    width: 45px;
    background: white;
    border-radius: 1000px;
    border: 2px solid $mediumBlue;
    margin: 0 auto;

    img {
      height: 28px;
      width: 28px;
    }
  }

.carousel-container {
    width: 66%;
    background: $darkGray;
    padding: 10px;
    border-radius: 12px;
}

//vue-carousel overrides

.carousel__icon {
  fill: white !important;
}

.carousel__slide--sliding {
  transition: 1s;
  animation-timing-function: ease;
}

.carousel__pagination-button::after {
  background-color: white;
}

.carousel {
  color: white !important;
}

.container {
    h3 {
        font-size: 2.2rem;
        font-weight: 600;
    }
}

.image-container {
  height: 100%;
}

.slide-image-container {
    height: 400px;

    img {
        object-fit: cover;
        height: 100%;
        border-radius: 12px;
    }
}

.progress-bar-container {
  margin: 24px 0;
  .progress-bar {
    width: 100%;
    background: $lightGray;
    height: 18px;
    border-radius: 12px;
    overflow: hidden;

    .progress {
      background: $mediumBlue;
      height: 19px;
      border-radius: 0px;
      margin: 10px 0;
    }
  }
}

.target-text {
  font-size: 1rem !important;
  color: $mediumGray;
  margin: 5px 0;

  strong {
    color: $mediumBlue;
  }
}

.button {
  margin-top: 20px;
  width: 100% !important;
}

input {
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

input[type=number] {
    -moz-appearance:textfield;
}

.redeem-container {
  gap: 2rem;
}

.celebration {
  font-size: 3rem;
}

@keyframes move {
	0%  { left: 0; opacity: 0.05; }
	5% {opacity: 0.1}
	48% {opacity: 0.4}
	80% {opacity: 0.01}
	100% { left: 100%}
}

.shiny-button {
  max-width: 8rem;
  overflow: hidden;

  &:hover {
    strong {
      transition: all 150ms;
      text-shadow: #000 0px 0px 2px,   #000 0px 0px 2px,   #000 0px 0px 2px,
        #000 0px 0px 2px,   #000 0px 0px 2px,   #000 0px 0px 2px;
    }
  }

  i {
    position: absolute;
		opacity: 0;
		top: 0;
		left: 0;
    background: linear-gradient(to right,  rgba(255,255,255,0) 0%,rgba(255,255,255,0.03) 1%,rgba(255,255,255,0.6) 30%,rgba(255,255,255,0.95) 50%,rgba(255,255,255,0.85) 70%,rgba(255,255,255,0.95) 71%,rgba(255,255,255,0) 100%);
    width: 15%;
		height: 100%;
    transform: skew(-10deg,0deg);
    animation: move 2s;
		animation-iteration-count: infinite;
		animation-delay: 2s;
  }
}

.ipfs-document-link {
  display: inline-block;
  max-width: 45ch;
  margin: 15px 0;
  padding: 10px 20px;
  background: rgba(255,255,255, 0.03);
  transition: all 150ms linear;
  border-radius: 8px;
  border-left: 8px solid $mediumBlue;
  color: $mediumBlue;
  overflow: hidden;
  &:hover {
    background-color: $mediumDarkGray;
    transform: translateY(-3px);
    border-left: 8px solid $mint;
    color: $mint;
  }
}
</style>