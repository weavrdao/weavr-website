<template>
  <section class="card  is-rounded-lg" >
      <div v-if="isGrid">
        <div class="card-image">
          <figure class="image is-4by3">
            <img :src="asset.coverPictureURI" alt="Placeholder image">
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img :src="asset.coverPictureURI" alt="Placeholder image">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4"><Address :value="asset.id"></Address></p>
            </div>
          </div>

          <div class="card-content">
            <div class="">
                <span class="tag mr-2 is-primary">tag</span>
                <span class="tag mr-2 is-primary">tag</span>
                <span class="tag mr-2 is-primary">tag</span>
                <span class="tag mr-2 is-primary">tag</span>
                <span class="tag mr-2 is-primary">tag</span>
                <span class="tag mr-2 is-primary">tag</span>
              </div>
            <p class="is-italic	">{{asset.description}}</p>
            <p class="has-text-weight-semibold">Year Built:<time class="has-text-weight-normal" datetime="2016">{{asset.yearBuilt}}</time></p>
            <p class="has-text-weight-semibold">Token Holders: <span class="has-text-weight-normal">{{ownersCount}}</span></p>
          </div>
        </div>
        <div class="card-footer" style="border: 0px;">
          <a role="button" @click="openDAO" class="button is-primary is-fullwidth">Open Thread</a>
        </div>
      </div>
      <div v-else>
        <div class="card-header p-3 ">
            <Address :value="asset.id"></Address>
        </div>
         <div class="card-content">
              <div class="media p-0">
                <div class="media-left">
                  <figure class="image is-128x128">
                    <img :src="asset.coverPictureURI" alt="Placeholder image">
                  </figure>
                  <a role="button" @click="openDAO" class="button has-background-foam">Open Thread</a>
                </div>
                <div class="media-content">
                  <div class="mb-2 is-flex is-flex-wrap-wrap is-hidden-thouch">
                    <span class="tag mr-2 is-primary">tag</span>
                    <span class="tag mr-2 is-primary">tag</span>
                    <span class="tag mr-2 is-primary">tag</span>
                    <span class="tag mr-2 is-primary">tag</span>
                    <span class="tag mr-2 is-primary">tag</span>
                    <span class="tag mr-2 is-primary">tag</span>
                  </div>
              <div class="p-0">
                <div class="media is-fullwidth">
                  <div class="media-content">
                    <p class="is-italic	">{{asset.description}}</p>
                    <p class="has-text-weight-semibold">Year Built:<time class="has-text-weight-normal" datetime="2016">{{asset.yearBuilt}}</time></p>
                    <p class="has-text-weight-semibold">Token Holders: <span class="has-text-weight-normal">{{ownersCount}}</span></p>         
                  </div>
                </div>
              </div>  
            </div>
          </div>   
        </div>
      </div>
  </section>
</template>

<script>
import { toFixedNumber } from "@/utils/common";
import { mapGetters, mapActions } from "vuex";
import Address from "@/components/views/address/Address.vue";

export default {
  name: "ThreadMarketListItem",
  components: {
    Address,
  },
  props: {
    asset: {
      type: Object,
      required: true,
    },
    isGrid: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      numberFormat: new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 3,
      }),
      orderFromValue: "",
      orderToValue: "",
      
    };
  },
  computed: {
    ...mapGetters({
      walletAddress: "userWalletAddress",
      ethBalance: "userEthBalance",
      assetPrices: "bestAssetPrices",
    }),
    shareBalance() {
      return this.asset.owners.get(this.walletAddress) ?? 0;
    },
    askPrice() {
      var askETH = this.assetPrices.get(this.asset.id).ask;

      if (askETH) {
        askETH = askETH.toString() / Math.pow(10, 18);
      } else {
        askETH = 0.0;
      }

      return askETH;
    },
    askPriceString() {
      return toFixedNumber(this.askPrice);
    },
    orderToString() {
      return toFixedNumber(this.orderToValue);
    },
    orderFromString() {
      return toFixedNumber(this.orderFromValue);
    },
    ownersCount() {
      console.log(this.asset.erc20)
      let i = 0
      this.asset.erc20.balances.forEach(() => {
        i = i+1
      })
      return i
    },
  },
  methods: {
    ...mapActions({
      swap: "swapToAsset",
    }),
    openDAO() {
      this.$router.push(`/thread/${this.asset.id}`);
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
    /* eslint-disable indent */
    orderInputUpdated(index, event) {
      switch (index) {
        case 0:
          this.orderFromValue = event.target.value;
          this.orderToValue = this.convertToShares(this.orderFromValue);
          break;
        case 1:
          this.orderToValue = event.target.value;
          this.orderFromValue = this.convertToETH(this.orderToValue);
          break;
        default:
          break;
      }
    },
    convertToETH(shares) {
      return shares * this.askPrice;
    },
    convertToShares(eth) {
      return eth / this.askPrice;
    },
    performSwap() {
      this.swap({
        asset: this.asset,
        amount: this.orderToValue,
        $toast: this.$toast,
      });
    },
  },
};
</script>