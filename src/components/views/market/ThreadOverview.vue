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
      background: transparent;
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
</style>>
