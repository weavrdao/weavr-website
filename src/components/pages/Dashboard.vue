<template>
  <div class="container p-5 is-dark">
    <div class="dashboard-container">
      <h3>Your Weavr
        <Address :value="address" />
      </h3>

      <div class="columns">
        <div class="column is-one-third">
          <button type="button" class="button is-link my-3">0.0 WEAV <span class='ml-1'>＋</span></button>
          <div>
            <span class="tag is-success mr-2">badge 1</span>
            <span class="tag is-primary mr-2">badge 2</span>
            <span class="tag is-info mr-2">badge 3</span>
            <span class="tag is-danger mr-2">badge 4</span>
          </div>
        </div>
        <div class="column is-two-thirds">
          <Accordion class="is-border" summary="Asset price graph">
            <img class="image" src="https://via.placeholder.com/500" />
          </Accordion>
        </div>
      </div>


      <h3 class="my-4">Your Assets</h3>

      <ul v-for="property in this.properties" :key="property.id">
        <li>
          <div class="card is-border">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="property.coverImage" alt="Property cover image">
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{ property.name }}</p>
                  <p class="subtitle is-6">You hold 42 tokens</p>
                </div>
              </div>

              <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus nec iaculis mauris.
              </div>
            </div>
          </div>
        </li>
      </ul>

    </div>
    <router-view></router-view>
    <!--
      input type=text name=addr id=addr
      DashboardInternal (bind)addr=#addr.value

      if loggedIn addr.value = user.wallet.address
    -->
    <!--
      user wallet address, all of their threads that they have a stake in, their member status, kyc/vouch/gov status badge, anything else
    -->
  </div>
</template>

<style lang="scss" scoped>
@import "../../styles/_variables.sass";
@import "../../styles/weavr-custom.scss";

.dashboard-container {
  width: 100%;
}

.content.is-vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  /* used this for multiple child */
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.columns {
  /* Bulma uses negative margin and ruins alignment  */
  margin-left: unset !important;
  margin-right: unset !important;
  margin-top: 1.5rem;
  gap: 1.5rem;
}

.is-border {
  border: 2px solid #575757;
}

.card {
  max-width: 40ch;
}
</style>

<script>
// import { toFixedNumber } from "../../utils/common";
import { mapGetters, mapActions } from "vuex";
import Address from '../views/address/Address.vue';
import properties from "../sections/ComingSoon/properties";
import Accordion from "../utils/Accordion.vue";
// import { CONTRACTS, DAO, GUEST, NETWORK } from "@/services/constants";

export default {
  name: "Governance",
  components: {
    Address, Accordion
  },
  computed: {
    ...mapGetters({
      assetMap: "assetsById",
      assetProposalMap: "assetProposals",
      ethBalance: "userEthBalance",
      assetPrices: "bestAssetPrices",
      address: "userWalletAddress",
      symbol: "assetTokenSymbol",
      userAssets: "ownedAssets",
      totalTokenCount: "getTotalSupply",
      wallet: "walletAndState",
      balance: "userTokenBalance",
    }),

    timestamp() {
      return Math.floor(Date.now() / 1000);
    },

    /*     somethin() {
          this.power({
            userAddress: this.address
          }).then(val => { this.x = val })
          return this.x
        }, */
  },

  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      swap: "swapToAsset",
      power: "getVotingPower"
    }),

    openConnectWalletPage() {
      this.$router.push("/walletConnect")
    },

    goBack() {
      this.$router.back();
    },

    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

  },

  data() {
    return {
      numberFormat: new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 3,
      }),
      orderFromValue: "",
      orderToValue: "",
      proposalsList: this.proposals,
      x: "",
      properties
    };
  },

  mounted() {
    console.log(this.assetMap);
  },

  afterUpdate() {

  }
};
</script>