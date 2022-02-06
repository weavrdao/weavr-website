<template>
    <div>
      <MarketListDetailVue id=""></MarketListDetailVue>
    </div>
</template>

<script>

import MarketListDetailVue from "../views/market/MarketListDetail.vue"

export default {
  name: "Details",

  components: {
    MarketListDetailVue
  },

  props: {
    id: {
      type: String,
      requir: true,
    }
  }
}

</script>