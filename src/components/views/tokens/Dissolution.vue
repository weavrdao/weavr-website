<template>
    <h1>Title</h1>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Dissolution",

  data() {
    return {
      
    }
  },
  computed:{
    ...mapGetters({
      walletAddress: "userWalletAddress",
      
    })
  }
}
</script>