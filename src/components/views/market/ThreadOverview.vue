<template>
   <div class="">
     <div :style="getCoverStyle()" class="cover-image mb-1">
       <div class="information-container">
         <!--        <div class="tag-container mb-2">-->
         <!--          <span class="tag has-background-mediumBlue has-text-white">Residential</span>-->
         <!--        </div>-->
         <h3 class="has-text-white property-title mb-4">{{ thread.name }}</h3>
         <Address :value="this.thread.id" />
       </div>
       <div class="weavr-icon-container">
         <img src="../../../assets/logo/new-logo.svg" alt="">
       </div>
     </div>

    <div class="notification is-primary is-clickable has-radius-lg subtitle" v-if="shouldShowRedeem" @click="redeemThreadTokens">
      <p>You have {{crowdfundTokenBalance}} thread tokens to redeem!</p>
    </div>
    <div class="columns">
      <div class="column is-two-thirds mb-5">  
        <div class="p-3">
          <!-- <div class="columns">
            <div 
              class="field has-addons" 
              @click="redeemThreadTokens" 
              v-if="true"
            >
              <p class="control">
                <button class="button is-full is-primary">
                  <span>Redeem</span>
                  <span class="icon is-small">
                    {{crowdfundTokenBalance}}
                  </span>
                </button>
              </p>
            </div>
          </div> -->
          <div 
            class="level p-3 border-lightGray is-clickable " 
            @click="redeemThreadTokens" 
            v-if="shouldShowRedeem"
          >
            <div class="button is-secondary has-text-white">
              Redeem
            </div>
            <div class="tag is-primary has-text-white">{{crowdfundTokenBalance}}</div>
          </div>
          <div class="card mb-5">
            <div class="columns">
              <div class="column">
                <div class="block">
                  <div class="label">Thread Address:</div>
                <Address :value="threadId"></Address>
                </div>
                <div class="block">
                  <div class="label">Token Address:</div>
                <Address :value="thread.erc20.id"></Address>
                </div>
              </div>
              <div class="column is-flex is-justify-content-end	">
                <div class="block is-pulled-right">
                  <div class="label">Holders:</div>
                  <div class="has-text-white tag is-primary is-medium">{{holders.length}}</div> 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-5">
          <div class=" image-container">
            <Carousel :autoplay="8000" :items-to-show="1" :wrap-around="true">
              <Slide v-for="imageHash in thread.imagesHashes" v-bind:key="imageHash">
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
          <vue-markdown class="content markdown-body"  :watches="['source']"  :source="thread.descriptor"/>
        </div>
        <div class="card mt-5">
          <p class="label mb-3">Documents</p>
          <div class="is-flex is-flex-direction-column is-justify-content-flex-start" v-for="document in thread.documentHashes" v-bind:key="document">
            <a class="ipfs-document-link" :href="getIpfsUrl(document)"><span>{{ document }}</span></a>
          </div>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="card p-3 has-radius-lg border-lightGray">
          <p class="subtitle mb-3">Metrics</p>
          <div class="columns mb-0" v-for="metric in metrics" :key="metric">
            <div class="column is-half">
              <div class="label">{{ metric.label}}:</div>
            </div>
            <div class="column">{{ metric.value}}</div>
          </div>
        </div>
        <!-- <div class="card p-3 mt-5 has-radius-lg border-lightGray">
          <p class="subtitle mb-3">Thread Token balance:</p>
          {{getTreadBalance}}
        </div> -->
        
        <div class="card p-3 mt-5 has-radius-lg border-lightGray">
          <p class="subtitle mb-3">Holders</p>
          <div class="columns mb-0 is-GAP-1" v-for="holder in holders" :key="holder">
            <div class="column" v-on:click="copy">
              <Address :value="holder"></Address>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import  VueMarkdown  from "vue-markdown-render"
import { useRoute } from "vue-router";
import "vue3-carousel/dist/carousel.css"
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { isJson } from "@/utils/common";
import styles from "@/styles/weavr-custom.scss"
import Address from "../address/Address.vue";
export default {
  name: "ThreadOverview",
  components: {
    VueMarkdown,
    Carousel,
    Slide,
    Pagination,
    Navigation,
    Address,
  }, 
  data() {
    return {
      threadId: useRoute().params.threadId,
      colors:  styles.primaryColor  
    }  
  },
  computed: {
    ...mapGetters({
      threads: "threadById",
      crowdfundTokenBalance: "userCrowdfundTokenAllowance",
      isConnected: "isConnected",
      userWalletAddress: "userWalletAddress"
    }),
    shouldShowRedeem() {
      if(!this.isConnected) return false;
      return Number(this.crowdfundTokenBalance) > 0;
    },
    thread() {
      return this.threads.get(this.$route.params.threadId)
    },
    erc20() {
      return {
        address: this.thread.erc20.address,
        symbol: this.thread.erc20.symbol,
        supply: this.thread.erc20.supply,
      }
    },
    getTreadBalance() {
      const to = this.thread.erc20.holders
      console.log("HOLDER", this.userWalletAddress, to.get(this.userWalletAddress));
      return null
    },
    holders() {
      console.log("HOLDERSSSSSSSS::: ", Array.from(this.thread.erc20.holders.keys()));
      return Array.from(this.thread.erc20.holders.keys())
    },
    metrics() {
      if(!isJson(this.thread?.metrics)) return {}
      const obj = JSON.parse(this.thread.metrics);
      const keys = Object.keys(obj);
      const values = Object.values(obj);
      const metrics = []
      for(let i=0; i<keys.length; i++) {
        metrics.push({label: keys[i], value: values[i]})
      }  
      return metrics
    },
  },
  methods: {
    ...mapActions({
      fetchThreads: "refreshThreads",
      redeem: "redeem",
      fetchNeedleTokenData: "fetchThreadTokenData"

    }),
    redeemThreadTokens() {
      this.redeem({
        crowdfundAddress: this.thread.crowdfund
      });
    },
    copy() {
      navigator.clipboard.writeText(this.threadId).then(function() {
        console.log("Async: Copying to clipboard was successful!");
      }, function(err) {
        console.error("Async: Could not copy text: ", err);
      });
    },
    getIpfsUrl(path) {
      return path
        ? `${process.env.VUE_APP_IFPS_GATEWAY_BASE_URL}/${path}`
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
    },
    getCoverStyle() {
      if(!this.thread?.imagesHashes) {
        return { "background-image": `linear-gradient(to left, rgba(22, 23, 30, 0), rgba(22, 23, 30, 1)), url(${
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png"
        })`}
      }
      const url = this.thread.imagesHashes
        ? `${process.env.VUE_APP_IFPS_GATEWAY_BASE_URL}/${this.thread.imagesHashes[0]}`
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";

      return { "background-image": `linear-gradient(to left, rgba(22, 23, 30, 0), rgba(22, 23, 30, 1)), url(${url})`}
    },
  },
  mounted() {
    console.log(this.thread);
    this.fetchNeedleTokenData({
      assetId: this.thread.crowdfund,
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/weavr-custom.scss";
@import "@/styles/markdown.scss";


</style>>
