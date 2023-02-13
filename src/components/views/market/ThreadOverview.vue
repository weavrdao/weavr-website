<template>
   <div class="">
    <div class="columns">
      <div class="column is-two-thirds mb-5">  
        <div class="p-3">
          <div class="card">
            <div class="is-flex is-justify-content-end	">
              <div class="has-text-white tag is-primary is-medium">
                <span class="mr-1">{{holders.length}}</span> 
                <span>Holders</span>
              </div>
            </div>
          </div>
          <div class="card mb-5">
            <div class="label">Thread Address:</div>
            <Address :value="threadId"></Address>
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
        <div class="card p-3 mt-5 has-radius-lg border-lightGray">
          <p class="subtitle mb-3">Holders</p>
          <div class="columns mb-0 is-GAP-1" v-for="holder in holders" :key="holder.holder.id">
            <div class="column" v-on:click="copy">
              <Address :value="holder.holder.id"></Address>
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
    }),
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
    holders() {
      
      return this.thread.erc20.balances
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
    }),
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
  },
  mounted() {
    console.log(this.thread);
  }
}
</script>

<style lang="scss">
@import "@/styles/weavr-custom.scss";
@import "@/styles/markdown.scss";


</style>>
