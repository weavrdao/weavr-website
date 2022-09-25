<template>
    <div class="container">
        <div class="is-flex is-justify-content-space-between">
          <AssetAddressDisplay :address="this.assetId"/>
          <button
            @click="refresh"
            class="button has-background-mediumBlue has-text-white">Refresh</button>
        </div>
        <div class="columns reverse-columns mt-3">
            <div class="column is-three-fifths">
              <OrderBook :assetId="this.assetId" :orders="getBuyOrders(orders)" :buy="true"/>
              <OrderBook :assetId="this.assetId" :orders="getSellOrders(orders)" :buy="false"/>
            </div>
            <div class="column">
                <OrderPlacer
                  :orders="this.orders"/>
            </div>
        </div>
    </div>
    
    </template>
    
<script>
import { mapActions, mapGetters } from "vuex";
import OrderPlacer from "../views/dex/OrderPlacer.vue";
import AssetAddressDisplay from "../layout/navigation/AssetAddressDisplay.vue";
import OrderBook from "../views/dex/OrderBook.vue";
    
export default {
  name: "DEX",
  components: {
    AssetAddressDisplay,
    OrderPlacer,
    OrderBook,
  },
  data() {
    return {
      orderBookMode: "buy",
      assetId: this.$route.query.assetId || process.env.VUE_APP_WEAVR_ADDRESS,
    }
  },
  computed: {
    ...mapGetters({
      orders: "assetMarketOrders",
    }),
  },
  methods: {
    ...mapActions({
      fetchOrders: "fetchOrders",
      fetchTradeTokenData: "fetchTradeTokenData",
    }),
    getBuyOrders: (orders) => (orders 
      ? orders
        .filter(o => o.type === "Buy")
        .sort((o1, o2) => o1.price > o2.price)
        .slice(0, 9)
      : []),
    getSellOrders: (orders) => (orders 
      ? orders
        .filter(o => o.type === "Sell")
        .sort((o1, o2) => o1.price < o2.price)
        .slice(0, 9)
      : []),
    refresh() {
      this.fetchOrders({
        assetId: this.assetId,
      });
      this.fetchTradeTokenData({
        assetId: this.assetId,
      })
    }
  },
  mounted() {
    this.fetchOrders({
      assetId: this.assetId,
    });
  }
}
</script>
    
    <style lang="scss" scoped>
    @import "../../styles/frabric-custom.scss";
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
  
    </style>