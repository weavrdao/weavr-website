<template>
<div class="container">
    <h3>Create order</h3>
    <div class="selection-buttons-container">
        <button
          class="_button selection-button"
          v-bind:class="(this.orderType === this.orderTypes.BUY) && 'buy-button'"
          :onClick="() => this.setOrderType(this.orderTypes.BUY)">
          Buy
        </button>
        <button
          class="_button selection-button"
          v-bind:class="(this.orderType === this.orderTypes.SELL) && 'sell-button'"
          :onClick="() => this.setOrderType(this.orderTypes.SELL)">
          Sell
        </button>
    </div>
    <div class="is-flex is-justify-content-space-between my-4">
      <span>Avbl <img class="is-wallet-image" src="../.././../assets/pics/wallet-icon.svg"/></span>
      <span>
        <span>{{ this.balance }}</span>
        <span class="has-text-mediumBlue"> WEAV</span>
      </span>
    </div>
    <div class="is-flex is-justify-content-flex-end my-4">
      <span>
        <span>{{ this.tradeTokenBalance }}</span>
        <span class="has-text-mediumBlue"> USDC</span>
      </span>
    </div>
    <p>Price</p>
    <input class="is-price-input" type="number" placeholder="Price" v-model="price">
    <p>Quantity</p>
    <label>Whole numbers only</label>
    <input class="is-price-input" type="number" placeholder="Quantity" v-model="quantity" step="1">
    <div class="is-flex is-justify-content-flex-end">
      <p class="is-total">{{`Total: ${(quantity * price).toFixed(2)} USD`}}</p>
    </div>
    <button
      :disabled="!this.address"
      @click="approve"
      class="_button order-button buy-button"
      v-if="!!this.address && !!this.allowance & Number(this.allowance) === 0 && this.orderType === this.orderTypes.BUY">
      Approve
    </button>
    <button
      :disabled="!this.address || (this.price * this.quantity > Number(this.tradeTokenBalance))"
      @click="newBuyOrder"
      class="_button order-button buy-button"
      v-else-if="this.orderType === this.orderTypes.BUY">
      Buy
    </button>
    <button
      :disabled="!this.address || (this.quantity > Number(this.balance))"
      @click="newSellOrder"
      class="_button order-button sell-button"
      v-else>
      Sell
    </button>
</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";


const orderTypes = {
  sell: "Sell",
  buy: "Buy",
}

export default {
  name: "OrderPlacer",
  data() {
    return {
      orderTypes: {
        SELL: "Sell",
        BUY: "Buy",
      },
      orderType: orderTypes.buy,
      price: 0,
      quantity: 0,
      assetId: this.$route.query.assetId || process.env.VUE_APP_WEAVR_ADDRESS,
    }
  },
  computed: {
    ...mapGetters({
      orders: "assetMarketOrders",
      address: "userWalletAddress",
      balance: "userTokenBalance",
      allowance: "userTradeTokenAllowance",
      tradeTokenBalance: "userTradeTokenBalance",
    }),
  },
  methods: {
    ...mapActions({
      createBuyOrder: "createBuyOrder",
      createSellOrder: "createSellOrder",
      approveTradeToken: "approveTradeToken",
    }),
    setOrderType(type) {
      this.orderType = type;
      this.setPrice();
    },
    setPrice() {
      if(this.orders && this.orders.length > 0) {
        this.price = Number(this.orders
          .filter(o => o.type === this.orderType)
          .sort((o1, o2) => {
            if(this.orderType === this.orderTypes.BUY) {
              return o1 < o2;
            } else {
              return o1 > o2;
            }
          })[0].price);
      }
    },
    newBuyOrder: function() {
      this.createBuyOrder({
        assetId: this.assetId,
        price: this.price,
        amount: this.quantity,
      })
    },
    newSellOrder: function() {
      this.createSellOrder({
        assetId: this.assetId,
        price: this.price,
        amount: this.quantity,
      })
    },
    approve: function() {
      this.approveTradeToken({
        assetId: this.assetId,
      });
    }
  },
  props: {
    orders: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    console.dir({
      bal: this.balance,
      ttb: this.tradeTokenBalance,
      bd: this.buyDisabled,
      sd: this.sellDisabled,
      sa: this.showApprove,
      ad: this.approveDisabled,
    })
    this.setPrice();
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/frabric-custom.scss";

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}

label {
  font-size: 0.8rem;
  margin-top: -0.8rem;
}
.container {
    background: $darkGray;
    border-radius: $small-radius;
    padding: 20px;

    h3 {
        color: white;
        font-weight: 500;
        font-size: 22px;
        margin-bottom: 40px;
    }

    input {
        display: block;
        margin: 0 0 10px 0;
        background: $lightNavy;
        border: none !important;
        padding: 20px;
        width: 100%;
        border-radius: $tiny-radius;
        font-size: 22px;
        color: white;

        &:focus {
            outline: none !important;
            border: 1px solid $mediumBlue;
        }
    }
}

.is-wallet-image {
    width: 18px;
}

._button {
    padding: 12px;
    background: $mediumGray;
    color: white;
    font-size: 24px;
    font-weight: 400;
    border: none;
    border-radius: $tiny-radius;
    cursor: pointer;
    transition: all 200ms;
}

.selection-buttons-container {
    display: flex;
    gap: 12px;
}

.selection-button {
    flex-grow: 1;
}

.order-button {
    display: block;
    width: 100%;
    margin-top: 35px;
}

.order-button:disabled {
  background: gray !important;
  cursor: auto;
}

.sell-button {
    background: $red;
}

.buy-button {
    background: $mint;
}

.is-total {
  display: inline-block;
  padding: 2px 8px;
  text-align: right;
  background: $lightNavy;
  border-radius: $tiny-radius;
}
</style>