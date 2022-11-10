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
        <span>5,250</span>
        <span class="has-text-mediumBlue"> FBRC</span>
      </span>
    </div>
    <p>Price</p>
    <input class="is-price-input" type="number" placeholder="Price" v-model="price">
    <p>Quantity</p>
    <input class="is-price-input" type="number" placeholder="Quantity" v-model="quantity">
    <div class="is-flex is-justify-content-flex-end">
      <p class="is-total">{{`Total: ${(quantity * price).toFixed(2)} USD`}}</p>
    </div>
    <button
      @click="newBuyOrder"
      class="_button order-button buy-button"
      v-if="this.orderType === this.orderTypes.BUY">
      Buy
    </button>
    <button
      @click="newSellOrder"
      class="_button order-button sell-button"
      v-else>
      Sell
    </button>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';


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
      assetId: this.$route.query.assetId || process.env.VUE_APP_FRABRIC_ADDRESS
    }
  },
  methods: {
    ...mapActions({
      createBuyOrder: "createBuyOrder",
      createSellOrder: "createSellOrder",
    }),
    setOrderType(type) {
      this.orderType = type;
      this.setPrice();
    },
    setPrice() {
      this.price = this.orders
        .filter(o => o.type === this.orderType)
        .sort((o1, o2) => {
          if(this.orderType === this.orderTypes.BUY) {
            return o1 < o2;
          } else {
            return o1 > o2;
          }
        })[0].price;
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
  },
  props: {
    orders: {
      type: Array,
      default: () => [],
    },
  },
  onMounted() {
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