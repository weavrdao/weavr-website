<template>
   <div class="">
    <div class="columns">
      <div class="column is-two-thirds">
        <div class="box py-6">
          <div class="title has-text-white is-size-2">{{thread.name}}</div>
          <div class="has-text-primary is-size-4">(holders)</div>
          <div class="mt-6 py-6" style="border-top: 1px gray  solid;">
            <div class="label is-size-3">
              Token Address
              </div>
            <div class="has-text-primary is-size-4">{{thread.id}}</div>
              <div class="label">Documents</div>
            <div class="label">Tags</div>
          </div>

        </div>
        <div class="card">
          <div class=" image-container">
          <!-- <p class="has-text-white mb-3">Images</p> -->
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
        <div class="card     mt-5">
          <p class="has-text-white mb-3">Property Description</p>
          <vue-markdown class="content markdown-body"  :watches="['source']"  :source="thread.descriptor"/>
          <!-- <div class="box">Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, mollitia labore dolor quasi ipsa temporibus neque fugiat inventore illo praesentium eius, nulla vel consequatur cum ad! Autem iste fugiat ratione.</div> -->
        </div>
      </div>
      <div class="column is-on-third">
        <div class="border-lightGray p-2">
          <div class="is-size-4 has-text-weight-bold	">$ {{210000}}</div>
          <ul class="py-5">
            <li><span class="has-text-weight-bold has-text-white">Current Rent:</span> ${{"20000"}}</li>
            <li><span class="has-text-weight-bold has-text-white">Market Value:</span> ${{"20000"}}</li>
            <li><span class="has-text-weight-bold has-text-white">Living Space:</span> ${{"20000"}}</li>
            <li><span class="has-text-weight-bold has-text-white">Rooms:</span> ${{"20000"}}</li>
            <li><span class="has-text-weight-bold has-text-white">Year Built:</span> ${{"20000"}}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="dark-card mt-5">
      <p class="has-text-white mb-3">Documents</p>
      <div class="is-flex is-flex-direction-column is-justify-content-flex-start" v-for="document in thread.documentHashes" v-bind:key="document">
        <a class="ipfs-document-link" :href="getIpfsUrl(document)"><span>{{ document }}</span></a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import  VueMarkdown  from "vue-markdown-render"
import { useRoute } from 'vue-router';
import "vue3-carousel/dist/carousel.css"
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import styles from "@/styles/weavr-custom.scss"
export default {
  name: "ThreadOverview",
  components: {
    VueMarkdown,
    Carousel,
    Slide,
    Pagination,
    Navigation
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
      return this.threads.get(this.$route.params['threadId'])
    },
    erc20() {
      return {
        address: this.thread.erc20.address,
        symbol: this.thread.erc20.symbol,
        supply: this.thread.erc20.supply,
      }
    }
  },
  methods: {
    ...mapActions({
      fetchThreads: "refreshThreads",
    }),
    
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
