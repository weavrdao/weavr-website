<template>
 <div class="container p-5 is-dark">
  <div class="columns is-desktop is-centered  ">
      <div class="column p-5 mt-6 connect-container">
        <h1 class="title  is-extra-large has-text-white  p-2" >
          The Decentralized
        <br />Real Estate
          <span class="has-text-mediumBlue">Club</span>
        </h1>    
         <p class="is-size-4"></p>
        <div class="columns is-3-desktop">
          <div class="column">
            <a class="
              button
              is-primary
              is-fullwidth
              is-size-4 "
              href="https://weavr-dao.gitbook.io/weavr-dao/" target="_blank">
              Documentation
            </a>
          </div>
<!--          <div class="column">-->
<!--            <a class="-->
<!--              button -->
<!--              is-secondary -->
<!--              is-fullwidth -->
<!--              has-text-white  -->
<!--              is-size-4 "-->
<!--               @click="navigateToApp('weavr')">-->
<!--              Governance-->
<!--            </a>-->
<!--          </div>-->
          <div class="column">
            <a class="
              button
              is-secondary
              is-fullwidth
              has-text-white
              is-size-4 "
               @click="navigateToApp('marketplace/coming-soon')">
              Marketplace
            </a>
          </div>
        </div>
        
      </div>
      <div class="column logo-container p-6">
        <div class="image is-fullwidth p-4">
          <img class="p-6" src="../../assets/for-builders.svg" alt="">
        </div>
      </div>
  </div>

  <div class="columns mt-0">
      <div class="column is-full has-text-lightGray has-text-centered ">
        <span class="is-size-2 subtitle has-border-bottom primary-border-2">
          <!-- <unicon name="eye-slash" fill="lightGray"></unicon> -->
          <b>Welcome to the Community, you belong here.</b>
        </span>        
      </div>
  </div>
  
  <div class="box columns is-centered has-text-white p-5 ">
    <div class="column is-half is-5">
      <div class="image p-3">
        <img src="../../assets/for-buyers.svg" alt="">
      </div>
    </div>  
    <div class="column is-half">
      <div class="subtitle is-size-3 has-text-primary "><b>For Buyers</b></div>
      <div class="has-radius-md mb-3 has-background-darkGray py-3 px-0" v-for="text in forBuyers" :key="text">     
        <span class="has-radius-md p-3 has-background-primary ">◉</span>
        <span class="has-radius-md has-text-white p-3 is-size-7">{{text}}</span>
      </div>
    </div>  
  </div>

  <div class="box columns is-centered has-text-white p-5 ">
    <div class="column is-half">
      <div class="subtitle is-size-3 has-text-primary"><b>For Builders</b></div>
      <div class="has-radius-md mb-3 has-background-darkGray py-3 px-0" v-for="text in forBuilders" :key="text">     
        <span class="has-radius-md p-3 has-background-primary">◉</span>
        <span class="mx-2 has-radius-md has-text-white p-3 is-size-7 bullet-text has-text-left">{{text}}</span>
      </div>
    </div>
    <div class="column is-half is-4">
      <div class="image">
        <img src="../../assets/hero-image.svg" alt="">
      </div>
    </div>  
  </div>

  <div class="box columns is-6 has-background-dimmedBlue">
    <div class="column is-vcentered is-one-fifth p-6 is-3">
      <div class="title is-1 text-align-">What makes us Unique?</div>
    </div> 
    <div class="column is-full p-5">
      <div class="columns is-multiline ">
        <div 
          class="column is-one-third has-radius-lg has-background-darkGray mt-4" 
          v-for="point in uniquePoints" 
          :key="point.id"
        >
          <div class="block bullet-point"></div>
          <div class="subtitle">{{point.heading}}</div>
          <div class="is-multiline is-size-6 has-text-mediumGray">{{point.text}}</div>
        </div>
       </div>  
    </div> 
  </div>

  <div class="box columns has-text-white p-5 is-5 ">
    <div class="column is-half is-5">
      <div class="image has-radius-lg has-full-borders-primary p-5">
        <img src="../../assets/arbitrum-network.png" alt="">
      </div>
    </div>  
    <div class="column is-half is-5">
      <div class="subtitle is-1 has-text-primary">Arbitrum Network</div>
      <div class="text has-text-lightGray">Arbitrum is a Layer 2 protocol that enables super fast and cheap EVM transactions, while relying on the Ethereum mainnet for security.</div>
      <a class="button is-primary mt-4" href="https://arbitrum.io/" target="_blank" >Learn more</a>
    </div>  
  </div>

  <div class="box columns has-background-white has-text-darkGray columns p-5 m-3">
    <div class="column is-three-quarters p-3">
      <div class="w-75">
        <h1 class="is-size-3"><b>Gain Access to our Marketplace</b></h1>
      <hr>
      <p class="is-size-5">Join our newsletter and learn to gain your access Weavr</p>
      </div>
        <a 
          class="button is-primary"
          href="https://3a567f7a.sibforms.com/serve/MUIEAAkS53zR0h7rhxExKB1X1JotCHaM4o7FBy9qRH3V7h92zXfDojr8PpuqQVRtRIYoeLgWddoOz_IVgW3DofxtESXPIwfentMntmPtVWwU_sTQTpYSt6ESaeVmSheGFH20mDIsMgM1UbzffXQ9ghnsJl8wKxqmH0Lxs7_Ppe1Kd6CVHsywoa4e0jFJBCru4UTyeIdV_z53X2yd"
        >Subscribe
      </a>
    </div>
    <div class="column p-5">
      <div class="image">
        <img src="../../assets/envelope.svg" alt="">
      </div>
    </div>
  </div>

</div>
</template>

<style scoped lang="scss">
@import "../../styles/frabric-custom.scss";
.content.is-vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center; /* used this for multiple child */
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
.list-text{
  text-align: left !important;
  
}
.primary-border {
  border-color: $primary !important ;

}
.primary-border-2 {
  border-color: $primary !important ;  
  border-width: 4px;
}

.columns {
   /* Bulma uses negative margin and ruins alignment  */
  margin-left: unset !important;
  margin-right: unset !important;
  margin-top: 1.5rem;
  gap: 1.5rem;
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
      forBuyers:[
        "Buy property token in our marketplace",
        "Manage it collaboratively",
        "See your token value increase",
        "Sell anytime"
      ],
      forBuilders: [
        "Find the Real estate project of your dream",
        "Submit your proposal to Weavr",
        "Find likeminded investors who will help to buy it"
      ],
      uniquePoints: [
    {
        id: 1,
        heading: 'Earn appreciation & rental income',
        text: 'Earn as you collect rents, and see the value of your tokens increase with land value. \n Access one of the most value stable asset class.'
    },
    {
        id: 2,
        heading: 'Full Control',
        text: 'With Weavr, you are in control. You can always have a voice on how to manage assets. Want to repurpose the building and turn it into a vertical garden? You can.'
    },
    {
        id: 3,
        heading: 'Sell anytime',
        text: 'There are no restrictions on token trading. Buy and sell in seconds on our own Decentralized Exchange.'
    },
    {
        id: 4,
        heading: 'Decentralized governance',
        text: 'WeavrDAO is run and managed by its members. If you have an idea on how to make an even better product, join the community and let’s build it together.'
    },
    {
        id: 5,
        heading: 'Defi enabled',
        text: 'Both the WEAV and Thread Tokens are ERC20 tokens and are freely tradable. Any approved DeFi protocol can be utilized instantly, without any limitations or restrictions.'
    },
    {
        id: 6,
        heading: 'No need to wait',
        text: "Once you've been vouched for, you have access to buy/sell any token in our protocol in seconds. No account generation, no nothing. Welcome to the club."
    }
]
        
      
    }
  },

  methods: {
    goBack() {
      this.$router.back();
    },
    navigateToApp(path) {
      var route;
      if (location.href.includes("localhost")) {
        route = "http://localhost:9090/#/";+path
      } else {
        route = "https://app.weavr.org/#/"+path;
      }
      location.href = route;
    },
    navigateToStatic(path) {
      var route;
      if (location.href.includes("localhost")) {
        route = "http://localhost:8080/#/"+path;
      }
        else {
        route = "https://weavr.org/#/"+path;
      }
      this.$router.push()
    }
  }
};
</script>