<template>
<div class="container">
    <div class="columns reverse-columns">
        <div class="column is-three-fifths">
          <h2>Thread Orderbook</h2>
          <OrderBook :assetId="assetId" :orders="getBuyOrders(thread.orders)" :buy="true"/>
          <OrderBook :assetId="assetId" :orders="getSellOrders(thread.orders)" :buy="false"/>
        </div>
        <div class="column">
            <OrderPlacer :orders="orders"/>
        </div>
    </div>
    <h2>Your Orders</h2>
    <div class="columns is-full-width">
      <div class="column is-half-desktop">
        <OrderBook :assetId="assetId" :orders="getBuyOrders(thread.userOrders)" :buy="true" :isOwn="true"/>
      </div>
      <div class="column is-half-desktop">
        <OrderBook :assetId="assetId" :orders="getSellOrders(thread.userOrders)" :buy="false" :isOwn="true"/>
      </div>
    </div>
</div>

</template>

<script>
import { mapGetters } from "vuex";
import OrderPlacer from "../views/dex/OrderPlacer.vue";
import OrderBook from "../views/dex/OrderBook.vue";
import { CONTRACTS } from "../../services/constants";

export default {
  name: "DEX",
  components: {
    OrderPlacer,
    OrderBook,
  },
  data() {
    return {
      orderBookMode: "buy",
      assetId: this.$route.query.threadId || CONTRACTS.WEAVR,
    }
  },
  computed: {
    ...mapGetters({
      threads: "threadById",
    }),
    thread() {
      console.log(this.threads);
      console.log(this.threads.get(this.$route.params.threadId));
      return this.threads.get(this.$route.params.threadId);
    },
  },
  methods: {
    getBuyOrders: (orders) => {
      console.log("ORDERS IN ORDER METHOD")
      console.log(orders);
      const tempBuyOrders = (orders 
        ? orders
          .filter(o => o.orderType === "BUY")
          .sort((o1, o2) => Number(o1.price) > Number(o2.price))
          .slice(0, 9)
        : [])

      console.log(tempBuyOrders);

      return tempBuyOrders;
    },
    getSellOrders: (orders) => {
      const tempSellOrders = (orders 
        ? orders
          .filter(o => o.orderType === "SELL")
          .sort((o1, o2) => Number(o1.price) < Number(o2.price))
          .slice(0, 9)
        : []);

      console.log(tempSellOrders) ;

      return tempSellOrders;
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../styles/weavr-custom.scss";
@import "../../styles/_variables.sass";

@media(max-width: 767px) {
  .reverse-columns {
    flex-direction: column-reverse;
    display: flex;
  }
}

h1, h2 {
    color: white;
    font-size: 32px;
    margin-bottom: 52px;
}

.has-gap {
    gap: 17px;
}

.is-simple-container {
    border-radius: 10px;
    border: 1px solid $mediumGray;
    padding: 23px 38px;
    margin-bottom: 30px;
}

.is-price-input {
    background: #2F2C38;
    border: none !important;
    border-radius: 15px;
    outline: none;
    display: block;
    width: 100%;
    margin: 15px 0px;
    padding: 18px 27px;
    font-size: 18px;
}

.has-small-flex-gap {
    gap: 17px;
}

.button {
    width: 100%;
    font-size: 22px;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    border: none;
}

.buy-button {
    background: $mint;
}

.sell-button {
    background: $red;
}
</style>