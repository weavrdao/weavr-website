<template>
<div>
  
  <div class="button is-warning mr-5" @click="onVouch"><span class="mr-1">{{vouches}}</span>Vouch</div>
  <div class="tag is-large is-flex is-address-container" v-if="address !=null">
    <div>
      <span>{{ balance }}</span>
      <span class="has-text-medium-blue ml-1"> {{ symbol }}</span>
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
    class="tag is-primary has-radius-xs is-large is-clickable connect"
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
      balance: "userTokenBalance",
      symbol: "assetTokenSymbol",
      vouches: "vouchesPerSigner"
    }),
  },
  methods: {
    ...mapActions({
      sync: "syncWallet",
    }),
    onClick() {
      this.sync({ $toast: this.$toast })
      this.$toast.show("Syncing wallet...");
    },
    onVouch() {
      // this.vouch({participant: "0x403383c411c0eB14eA0Bd15E7c2AD5431a7410C2"})
      this.$router.push("/frabric/vouch")
    }
  },
  mounted() {
  }
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

  .connect {
    transition: all 150ms;
    &:hover {
      filter: contrast(120%);
    }
  }
</style>
