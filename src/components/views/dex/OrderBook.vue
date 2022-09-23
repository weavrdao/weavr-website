<template>
<div class="container">
    <h3>{{buy ? "Buy Orders" : "Sell Orders"}}</h3>
    <div class="columns is-flex-mobile headers">
      <div class="column is-one-quarter">
        Amount
      </div>
      <div class="column is-one-quarter">
        Rate (1 FBRC)
      </div>
      <div class="column is-one-quarter is-flex">
        Total
      </div>
      <div class="column is-one-quater"></div>
    </div>
    <ul>
      <li
          v-for="order in orders"
          v-bind:key="order.id">
          <OrderListItem :order="order"/>
      </li>
    </ul>
</div>
</template>

<script>
import OrderListItem from "./OrderListItem.vue";
export default {
  name: "OrderBook",
  components: {
    OrderListItem,
  },
  props: {
    buy: {
      type: Boolean,
      default: true,
    },
    orders: {
      type: Array,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/frabric-custom.scss";

h3 {
  color: white;
  font-size: 1.6rem;
  margin-bottom: 10px;
}

hr {
    height: 0px;
    border: 1px solid #2F2C38;
    margin: 8px 0;
}

.container {
  border: 2px solid #575757;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px !important;
}

.headers {
  font-size: 1.1rem;
  color: $mediumGray;
}
</style>