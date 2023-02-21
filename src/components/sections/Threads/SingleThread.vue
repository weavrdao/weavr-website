<template>
  <div class="container">
    <div class="tabs is-toggle is-toggle-rounded is-centered  ">
      <ul>
        <li :class="[ isTabActive('overview') ? 'is-active' : '' ]">
          <a v-on:click="navigateTo('overview')">Overview</a>
        </li>
        <!-- <li :class="[ isTabActive('governance') ? 'is-active' : '' ]">
          <a disabled="true" aria-disabled="true" v-on:click="navigateTo('governance')">Governance</a>
        </li> -->
      </ul>
    </div>
    <div :style="getCoverStyle()" class="cover-image mb-5">
      <div class="information-container">
        <div class="tag-container mb-2">
          <span class="tag has-background-mediumBlue has-text-white">Residential</span>
        </div>
        <h3 class="has-text-white property-title mb-4">{{ thread.name }}</h3>
        <Address :value="this.thread.id" />
      </div>
        <div class="weavr-icon-container">  
          <img src="../../../assets/logo/new-logo.svg" alt="">
        </div>
    </div>
    
    <router-view></router-view>
   
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import "vue3-carousel/dist/carousel.css"
export default {
  name: "SingleThread",
  data() {
    return {
      threadId: this.$route.params.threadId.toLowerCase(),
      purchaseAmount: 0,
      withdrawAmount: 0,
    }
  },
  computed: {
    ...mapGetters({
      threads: "allThreads",

    }),
    thread() {
      return this.threads
        .find(n => n.id === this.threadId);
    },
  },
  methods: {
    ...mapActions({
      fetchThreadTokenData: "fetchThreadTokenData",
      refreshProposals: "refreshProposalsDataForAsset",
      setLoadingState: "setLoadingState"
    }),
    navigateTo(routeName) {
      this.$router.push({name: routeName})
    },
    isTabActive(tabName) {
      return this.$route.fullPath.includes(tabName)
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
}
</script>
  <style scoped lang="scss">
  @import "../../../styles/_variables.sass";
  @import "../../../styles/weavr-custom.scss";
  @import "../../../styles/markdown.scss";

  $tabs-link-active-color: $primary !important;
  .tabs ul {
    border-bottom-color: $primary !important;
  }
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
      height: 500px;
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