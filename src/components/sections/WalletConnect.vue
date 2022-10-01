<template>
<div>
    <div class="cointainer p-5">
        <div class="close-icon" @click="routeToHome">
             <unicon
                class="is-flex is-align-self-center" 
                name="times" 
                fill="lightGray"
                hoverFill="lightGray-invert"
            >
            </unicon>
        </div>
        <div class="is-flex is-justify-content-space-evenly">
            <div :class='["wallet-box", "m-0", "p-0", wallet.disabled ? "disabled" : "is-clickable"]' v-for="wallet in wallets" :key="wallet.name" @click="!wallet.disabled ? onClick(wallet.name) : ''" :aria-disabled="wallet.disabled">
                <div class="image m-0 p-5 has-radius-md" >
                    <img :src="wallet.icon"/>
                </div>
            </div>
        </div>
    </div>
</div>    
</template>
<script>
// import {mapActions}
import { mapActions, mapGetters } from "vuex"
import { DAO } from "@/services/constants.js"

export default {
  name: "WalletConnect",
  computed: {
    ...mapGetters({
      address: "userWalletAddress",
    }),
    hover: false,
  },
  data() {
    return {
      ICON_SIZE: 150,
      wallets: {
        metamask: {
          name: "metamask",
          icon: require("@/assets/icons/metamask-fox.png"),
        },
        coinbase: {
          name: "coinbase",
          icon: require("@/assets/icons/coinbase-wallet.png"),
          disabled: false
        }
      }
    }
  },
  methods: {
    ...mapActions({
      connect: "connectWallet",
      sync: "syncWallet"
    }),
    onClick(wllt) {
      this.$toast.show("Syncing wallet... ");
      this.sync({ wallet: wllt, $toast: this.$toast})
        .then(() => {
          this.routeToHome();
        });
    },
    routeToHome() {
      this.$router.push("/".concat(DAO));
    },
  }    
}
</script>

<style lang="scss" scoped>
@import "@/styles/frabric-custom.scss";

.wallet-box :hover {
  background-color: $mediumDarkGray;
}

.disabled {
  opacity: 0.4;
}

.close-icon {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  justify-content: center;
  vertical-align: middle;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 1000px;
  background: rgba(255, 255, 255, 0);
  transition: all 150ms;
  cursor: pointer;

  &:hover {
    background: $red;
    
  }
}
</style>