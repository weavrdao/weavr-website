<template>
<div class="columns is-flex-mobile is-align-items-center">
    <div class="column">
        {{ formatEther(order.amount) }} FBRC
    </div>
    <div class="column">
        {{ Number(order.price).toFixed(2) }} USD
    </div>
    <div class="column">
      {{ getTotalAmount(order) }}
    </div>
    <div class="column is-justify-content-flex-end">
      <div
          v-if="isOwn"
          class="purchase-type is-sell clickable"
          >CANCEL</div>
        <div
            v-else
            class="purchase-type"
            v-bind:class="order.orderType === 'BUY' ? 'is-buy' : 'is-sell'">
            {{ order.orderType === 'BUY' ? 'BUY' : 'SELL' }}
        </div>

    </div>
</div>
</template>

<script>
import { ethers } from "ethers";

export default {
  name: "OrderListItem",
  props: {
    order: {
      type: Object,
    },
    isOwn: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    formatEther: (amount) => Number(
      ethers.utils.formatEther(amount)
    ).toFixed(2),
    getTotalAmount: (order) => {
      return (
        ethers.utils.formatEther(
          order.amount.mul(
            ethers.BigNumber.from(order.price)
          )
        ).toString()
      );
    }
  }
}
</script>


<style lang="scss" scoped>
@import "../../../styles/weavr-custom.scss";


.columns {
    border-top: 1px solid #2F2C38;
    margin-top: 0.75rem !important;
}

.purchase-type {
    font-weight: 600;
    color: white;
    border-radius: 8px;
    padding: 10px 15px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.is-buy {
    background: $mint;
}

.is-sell {
    background: $red;
}

.clickable {
  transition: all 180ms;
  &:hover {
    cursor: pointer;
    background: white;
    color: $red;
    // filter: contrast(120%);
  }
}
</style>