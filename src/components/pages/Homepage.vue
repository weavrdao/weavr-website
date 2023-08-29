<template>
  <div class="container p-5 is-dark">
    <div class="columns is-desktop is-centered">
      <div class="column p-5 mt-6 connect-container">
        <h1 class="title has-text-white">
          The
          <br />
          <span class="word-container">
            <transition name="fade" mode="out-in">
              <span class="rotating-word" :key="currentWord">{{ currentWord }}</span>
            </transition>
          </span>
          <br />
          <span class="has-text-mediumBlue">Owners Club</span>
        </h1>
      </div>
      <div class="column logo-container p-6">
        <div class="image is-fullwidth p-4">
          <img class="p-6" src="../../assets/for-builders.svg" alt="" />
        </div>
        <a class="button is-primary is-fullwidth is-size-4"
          href="https://3a567f7a.sibforms.com/serve/MUIEAAkS53zR0h7rhxExKB1X1JotCHaM4o7FBy9qRH3V7h92zXfDojr8PpuqQVRtRIYoeLgWddoOz_IVgW3DofxtESXPIwfentMntmPtVWwU_sTQTpYSt6ESaeVmSheGFH20mDIsMgM1UbzffXQ9ghnsJl8wKxqmH0Lxs7_Ppe1Kd6CVHsywoa4e0jFJBCru4UTyeIdV_z53X2yd"
          target="_blank">
          Apply for Access
        </a>
      </div>
    </div>
    <section class="pl-5 is-flex is-flex-direction-column is-align-items-center-mobile mb-5">
      <b class="is-size-4">Powered By</b>
      <div class="is-flex is-mobile-justify-content-center is-justify-content-start my-4">
        <a class="mx-5" href="https://fractional.finance" target="_blank">
          <img src="../../assets/logo/3rd-party/ffi.png" alt="fractional finance" class="image is-64x64" />
        </a>
        <a class="mr-5" href="https://ipfs.io" target="_blank">
          <img src="../../assets/logo/3rd-party/ipfs_logo.png" alt="ipfs" class="image is-64x64" />
        </a>
        <a class="mr-5" href="https://arbitrum.io" target="_blank">
          <img src="../../assets/logo/3rd-party/arbitrum/arbitrum.png" alt="arbitrum" class="image is-64x64" />
        </a>
        <a class="mr-5" href="https://tenderly.com" target="_blank">
          <img src="../../assets/logo/3rd-party/tenderly.png" alt="tenderly" class="image is-64x64" />
        </a>
      </div>
    </section>
    <div class="columns mt-0">
      <div class="column is-full has-text-lightGray has-text-centered">
        <span class="title is-size-1 has-border-bottom primary-border-2">
          <!-- <unicon name="eye-slash" fill="lightGray"></unicon> -->
          <b>Welcome to the Club</b>
        </span>
      </div>
    </div>

    <div class="box columns is-centered has-text-white p-5">
      <div class="column is-half is-5">
        <div class="image p-3">
          <img src="../../assets/for-buyers.svg" alt="" />
        </div>
      </div>
      <div class="column is-half">
        <div class="subtitle is-size-3 has-text-primary"><b>For Buyers</b></div>
        <div
          class="has-radius-md mb-3 is-size-6 has-background-darkGray py-3 px-0 is-flex-mobile is-flex-direction-column-mobile is-align-items-center-mobile"
          v-for="text in forBuyers" :key="text">
          <span class="has-radius-md p-3 has-background-primary">◉</span>
          <span class="has-radius-md has-text-white p-3 is-size-6-desktop">{{ text }}</span>
        </div>
      </div>
    </div>

    <div class="box columns is-centered has-text-white p-5">
      <div class="column is-half">
        <div class="subtitle is-size-3 has-text-primary">
          <b>For Dreamers</b>
        </div>
        <div class="has-radius-md mb-3 is-size-6 has-background-darkGray py-3 px-0 is-flex-mobile is-flex-direction-column-mobile is-align-items-center-mobile" v-for="text in forDreamers"
          :key="text">
          <span class="has-radius-md p-3 has-background-primary">◉</span>
          <span class="has-radius-md has-text-white p-3 is-size-6-desktop">{{ text }}</span>
        </div>
      </div>
      <div class="column is-half is-4">
        <div class="image">
          <img src="../../assets/hero-image.svg" alt="" />
        </div>
      </div>
    </div>
    <div class="has-radius-lg p-3 is-full">
      <div class="is-vcentered is-one-fifth px-6 is-3">
        <div class="title is-1 is-size-3-mobile mt-3 has-text-centered">What makes us Unique?</div>
      </div>
      <div class=" columns mt-0 is-6">
        <div class="column is-full p-5 is-centered">
          <div class="columns is-centered is-multiline is-desktop">
            <div class="column is-two-fifths is-5 has-radius-lg has-background-darkGray mt-4"
              v-for="point in uniquePoints" :key="point.id">
              <div class="block bullet-point"></div>
              <div class="subtitle">{{ point.heading }}</div>
              <div class="is-multiline is-size-6 has-text-mediumGray">
                {{ point.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!--    <div class="box columns has-text-white p-5 is-5">-->
    <!--      <div class="column is-half is-5">-->
    <!--        <div class="image has-radius-lg has-full-borders-primary p-5">-->
    <!--          <img src="../../assets/arbitrum-network.png" alt="" />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="column is-half is-5">-->
    <!--        <div class="subtitle is-1 has-text-primary">Arbitrum Network</div>-->
    <!--        <div class="text has-text-lightGray">-->
    <!--          Arbitrum is a Layer 2 protocol that enables super fast and cheap EVM-->
    <!--          transactions, while relying on the Ethereum mainnet for security.-->
    <!--        </div>-->
    <!--        <a-->
    <!--            class="button is-primary mt-4"-->
    <!--            href="https://arbitrum.io/"-->
    <!--            target="_blank"-->
    <!--        >Learn more</a-->
    <!--        >-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div-->
    <!--        class="box columns has-background-white has-text-darkGray columns p-5 m-3"-->
    <!--    >-->
    <!--      <div class="column is-three-quarters p-3">-->
    <!--        <div class="w-75">-->
    <!--          <h1 class="is-size-3"><b>Gain Access to our Marketplace</b></h1>-->
    <!--          <hr />-->
    <!--          <p class="is-size-5">-->
    <!--            Join our newsletter and learn to gain your access Weavr-->
    <!--          </p>-->
    <!--        </div>-->
    <!--        <a-->
    <!--            class="button is-primary"-->
    <!--            href="https://3a567f7a.sibforms.com/serve/MUIEAAkS53zR0h7rhxExKB1X1JotCHaM4o7FBy9qRH3V7h92zXfDojr8PpuqQVRtRIYoeLgWddoOz_IVgW3DofxtESXPIwfentMntmPtVWwU_sTQTpYSt6ESaeVmSheGFH20mDIsMgM1UbzffXQ9ghnsJl8wKxqmH0Lxs7_Ppe1Kd6CVHsywoa4e0jFJBCru4UTyeIdV_z53X2yd"-->
    <!--        >Subscribe-->
    <!--        </a>-->
    <!--      </div>-->
    <!--      <div class="column p-5">-->
    <!--        <div class="image">-->
    <!--          <img src="../../assets/envelope.svg" alt="" />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<style scoped lang="scss">
@import "../../styles/weavr-custom.scss";

.is-size-7 {
  font-size: 0.6rem !important;
}

/* Mobile First: Default title size for mobile */
.title {
  font-size: 1.5rem; // Adjust this size as required for mobile screens
}

/* Adjust for larger mobile devices or small tablets */
@media (min-width: 480px) {
  .title {
    font-size: 2rem;
  }
}

/* Adjust for larger tablets */
@media (min-width: 640px) {
  .title {
    font-size: 2.5rem;
  }
}

/* Adjust for small desktops or large tablets in landscape mode */
@media (min-width: 768px) {
  .title {
    font-size: 3rem;
  }
}

/* Adjust for standard desktop screens */
@media (min-width: 1024px) {
  .title {
    font-size: 3.5rem;
  }
}

/* Adjust for large desktop screens */
@media (min-width: 1200px) {
  .title {
    font-size: 4rem; // This could be your original size for larger desktops
  }
}


.content.is-vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  /* used this for multiple child */
}

.bullet-point {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 1000px;
  background: $primary;
  transition: all 150ms;
  cursor: pointer;
}

/* Mobile First Styles */
.word-container {
  width: 90%;
  /* Adjust for mobile first */
  height: auto;
  line-height: normal;
}

/* Media Query for Tablets and Above */
@media (min-width: 768px) {
  .word-container {
    width: 500px;
    height: 120px;
    line-height: 60px;
  }
}

/* Media Query for Desktops and Above */
@media (min-width: 1024px) {
  .columns.is-desktop {
    display: flex;
    /* Use flexbox for desktop */
  }
}

/* Mobile Adjustments */
@media (max-width: 767px) {

  .columns,
  .column {
    flex-direction: column;
    /* Stack columns vertically on mobile */
  }

  .image img {
    width: 100%;
    /* Make images full width on mobile */
    height: auto;
  }

  .is-size-3-mobile {
    font-size: 1.5rem;
    /* Adjust font size for mobile */
  }

  .title,
  .subtitle {
    text-align: center;
    /* Center titles and subtitles on mobile */
  }

  /* Add any other mobile-specific styles here */
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}

.primary-border-2 {
  border-color: $primary !important;
  border-width: 4px;
}

.columns {
  /* Bulma uses negative margin and ruins alignment  */
  margin-left: unset !important;
  margin-right: unset !important;
  margin-top: 1.5rem;
  gap: 1.5rem;
}

.is-align-items-center-mobile {
  @media screen and (max-width: 1024px) {
    align-items: center !important;
  }
}

.bubble-background {
  border-radius: 50px;
  /* You can adjust this value for more or less rounding */
  padding: 20px;
  /* Adjust padding as needed */
  display: inline-block;
}

.bullet-text {
  @media screen and (max-width: 350) {
    font-size: 0.6rem !important;
  }
}
</style>

<script>
export default {
  name: "Homepage",
  data() {
    return {
      words: ["Hotel in Marrakesh", "Restaurant Franchise", "Campground", "Condominium", "Strip Mall"],
      currentIndex: 0,
      OpacityLevel: 1,
      forBuyers: [
        "Buy asset tokens within weavrDAO",
        "Manage the asset collaboratively with likeminded owners",
        "See your token value increase as the asset value increases",
        "Sell at any time, no muss no fuss",
      ],
      forDreamers: [
        "Find the Real estate project of your dreams",
        "Submit your proposal to Weavr",
        "Find likeminded owners who will help to acquire it",
      ],
      uniquePoints: [
        {
          id: 1,
          heading: "See appreciation & work with likeminded owners",
          text: "As the Asset collects rents, vote and you'll be compensated for your hard work." +
            " You may see the value of your tokens increase with land value. " +
            "\n Access one of the most value stable asset classes in the world, without having to reach for your wallet.",
        },
        {
          id: 2,
          heading: "Full Control",
          text: "With Weavr, you are in drivers seat. You can always have a voice on how to manage assets. Want to repurpose the building and turn it into a vertical garden? You can.",
        },
        {
          id: 3,
          heading: "Sell anytime",
          text: "There are no restrictions on token trading. Buy and sell in seconds on our own Decentralized Exchange.",
        },
        {
          id: 4,
          heading: "Decentralized governance",
          text: "WeavrDAO is run and managed by its members. If you have an idea on how to make an even better product, join the community and let’s build it together.",
        },
        {
          id: 5,
          heading: "Defi enabled",
          text: "Both the WEAV and Thread Tokens are ERC20 tokens and are freely tradable. Any approved DeFi protocol can be utilized instantly, without any limitations or restrictions.",
        },
        {
          id: 6,
          heading: "No need to wait",
          text: "Once you've been vouched for, you have access to buy/sell any token in our protocol in seconds. No account generation, no nothing. Welcome to the club.",
        },
      ],
    };
  },
  computed: {
    currentWord() {
      return this.words[this.currentIndex];
    }
  },
  mounted() {
    this.interval = setInterval(this.changeWord, 3000);
  },
  beforeDestroy() {
    clearInterval(this.interval); // Clear the interval when the component is destroyed
  },
  methods: {
    changeWord() {
      this.OpacityLevel = 0;
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.words.length;
        this.OpacityLevel = 1;
      }, 1000); // After 1 second of fade-out, change the word and fade it in.
    },
    goBack() {
      this.$router.back();
    },
  }
};
</script>