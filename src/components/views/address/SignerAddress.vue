<template>
<div>
<div class="tag is-large is-flex is-address-container" v-if="address !=null">
  <div>
    <span>5,250 </span>
    <span class="has-text-medium-blue">FBRC</span>
  </div>
  <div
    class="tag is-primary has-radius-xs is-large is-clickable"
    @click="onClick"
  >
    <div class="is-family-monospace address">
      {{
        address.substring(0, 8) + "..." + address.substring(address.length - 4)
      }}
    </div>
  </div>
</div>
<div
    v-else
    class="tag is-primary has-radius-xs is-large is-clickable"
    @click="onClick"
  >
    <div class="has-text-white">Connect Wallet</div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SignerAddress",
  computed: {
    ...mapGetters({
      address: "userWalletAddress",
    }),
  },
  methods: {
    ...mapActions({
      sync: "syncWallet",
    }),
    onClick() {
      this.sync({ $toast: this.$toast });
      this.$toast.show("Syncing wallet...");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/frabric-custom.scss";

  .is-address-container {
    display: inline-flex !important;
    background: $darkGray !important;
    padding-right: 0px !important;
    gap: 10px;
    color: white;
    font-size: 1rem !important;
    height: 2.5em !important;
  }

  .address {
    font-size: 1rem;
  }

  .has-text-medium-blue {
    color: $mediumBlue;
  }
</style>
