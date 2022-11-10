<template>
<div class="container">
    <div :style="coverStyle" class="cover-image mb-5">
      <div class="information-container">
        <div class="tag-container mb-2">
          <span v-for="tag in property.tags" :key="tag" class="tag has-background-mediumBlue has-text-white">{{ tag }}</span>
        </div>
        <h3 class="has-text-white property-title mb-0">{{ property.name }}</h3>
        <p class="has-text-white">📍 {{ property.location }}</p>
        <div class="price-container">
            <p>💰 {{ property.target.toLocaleString() }} <strong>USDC</strong></p>
        </div>
      </div>
      <div class="weavr-icon-container">
        <img src="../../../assets/logo/new-logo.svg" alt="">
      </div>
    </div>
    <div class="dark-card call-to-action-container is-flex is-align-items-center mb-5">
      <span>🧵</span>
      <div class="has-text-white">
        <h3>Want to own a part of this property?</h3>
        <h4>Make a pledge, and become a part of history.</h4>
      </div>
      <div class="is-flex-grow-1 is-flex is-justify-content-flex-end button-container">
        <a target="_blank" rel="noopener" href="https://dkwnhnualcm.typeform.com/weavr-pledge" class="has-text-white button shiny-button has-background-mediumBlue mt-0"><i></i><strong>Pledge</strong></a>
      </div>
    </div>
    <div>
    <div class="dark-card image-container mb-5">
        <p class="has-text-white mb-3">Images</p>
        <Carousel :autoplay="8000" :items-to-show="1" :wrap-around="true">
        <Slide v-for="image in property.photos" v-bind:key="image">
            <div class="slide-image-container">
            <img v-bind:src="image" alt="">
            </div>
        </Slide>
        <template #addons>
            <Navigation />
            <Pagination />
        </template>
        </Carousel>
    </div>
    <div class="dark-card pt-5">
      <vue-markdown class="content markdown-body" :options="{html: true}"  :source="property.markdown" />
    </div>
    <div class="dark-card my-5">
      <p class="has-text-white mb-3">Property Documents</p>
      <div class="is-flex is-flex-direction-column is-justify-content-flex-start" v-for="document in property.documents" v-bind:key="document">
        <a class="ipfs-document-link" :href="document.url" target="_blank" rel="noopener">
          <span>{{ document.name }}</span>
        </a>
      </div>
    </div>
    <div class="dark-card pt-5">
      <vue-markdown class="content markdown-body" :options="{html: true}"  :source="property.disclaimer" />
    </div>
  </div>
</div>
</template>
<script>
import properties from "./properties";
import "vue3-carousel/dist/carousel.css"
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import VueMarkdown from "vue-markdown-render";

export default {
  name: "SingleComingSoonPage",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    VueMarkdown,
  },
  data() {
    return {
      property: properties[0],
      coverStyle: { "background-image": `linear-gradient(to left, rgba(22, 23, 30, 0), rgba(22, 23, 30, 1)), url(${properties[0].coverImage})`}
    }
  },
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
  height: calc(100% - 60px);
}

.price-container {
    position: absolute;
    bottom : 0px;
}

.dark-card {
  border-radius: 8px;
  border: 1px solid $darkGray;
  padding: 20px 30px;
  background: $boxGray;
}

.cover-image {
    position: relative;
    height: 250px;
    overflow: hidden;
    background-position: 50% 65%;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 12px;
    border: 1px solid $darkGray;

    @media screen and (max-width: 500px) {
      height: 300px;
      // background: linear-gradient(to bottom, rgba(22, 23, 30, 0), rgba(22, 23, 30, 1));
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
    width: 100%;
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
	25% {opacity: 0.4; }
	50% {opacity: 0.01; left: 100%}
	100% {opacity: 0.01; left: 100% }
}

.call-to-action-container {
  gap: 2rem;

  @media screen and (max-width: "700px") {
    flex-direction: column;
    
    .button-container {
      width: 100%;
    }
  }

  span {
    font-size: 3rem;
  }

  h3 {
    font-size: 1.6rem;
  }
}

.shiny-button {
  max-width: 10rem;
  height: 3.5rem;
  overflow: hidden;

  @media screen and (max-width: "700px") {
    max-width: 100rem !important;
    width: 100%;   
  }

  i {
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    background: linear-gradient(to right,  rgba(255,255,255,0) 0%,rgba(255,255,255,0.02) 1%,rgba(255,255,255,0.4) 30%,rgba(255,255,255,0.5) 50%,rgba(255,255,255,0.5) 70%,rgba(255,255,255,0.6) 71%,rgba(255,255,255,0) 100%);
    width: 15%;
    height: 100%;
    transform: skew(-10deg,0deg);
    animation: move 4s;
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