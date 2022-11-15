<template>
  <div>
      <div class="tabs is-centered is-boxed">
  <ul>
    <li class="is-active">
      <a>
        <span class="icon is-small"><i class="fas fa-image" aria-hidden="true"></i></span>
        <span>Info</span>
      </a>
    </li>
    <li>
      <a>
        <span class="icon is-small"><i class="fas fa-music" aria-hidden="true"></i></span>
        <span>Swap</span>
      </a>
    </li>
  </ul>
</div>
      <a role="button" class="card">
        <div class="card-header">
          <div class="card-title">
            {{asset.address}}
          </div>
        </div>
        <div class="media">
          <div class="media-left">
            <div class="card-image">
            <figure class="image is-128x128">
              <img :src="coverPictureURI" alt="">
            </figure>
          </div>
          </div>
          <div class="media-content">
            <Address :value="walletAddress"></Address>
          </div>
        </div>
      </a>
    </div>
</template>

<script>
import { toFixedNumber } from "../../../utils/common";
import { mapGetters, mapActions } from "vuex";
import Address from "../address/Address.vue";
import Button from "../common/Button.vue";

export default {
  name: "MarketListItem",
  components: {
    Address,
    // Button,
  },
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      numberFormat: new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 3,
      }),
      orderFromValue: "",
      orderToValue: "",
      coverPictureURI: require("../../../assets/pics/fbra.jpg"),
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
  },
  methods: {
    ...mapActions({
      swap: "swapToAsset",
    }),
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