<template>
<div>
    <div class="p-5">
        <div class="title-box">
          <h3>Connect Wallet</h3>
        </div>
        <div class="close-icon" @click="routeToHome">
             <unicon
                class="is-flex is-align-self-center" 
                name="times" 
                fill="lightGray"
                hoverFill="lightGray-invert"
            >
            </unicon>
        </div>
        <div class="is-flex is-justify-content-center">
          <div class="is-inline-flex is-justify-content-space-evenly is-flex-direction-column">
              <div 
                :class='["wallet-box", "my-2", "p-0", wallet.disabled ? "disabled" : "is-clickable"]'
                v-for="wallet in wallets"
                :key="wallet.name"
                @click="!wallet.disabled ? onClick(wallet.name) : ''"
                :aria-disabled="wallet.disabled">
                <div class="wallet-connector" >
                    <img class="image is-64x64 mr-2 ml-5" :src="wallet.icon"/>
                    <h4 class="is-flex is-flex-wrap">{{ wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1) }}</h4>
                </div>
              </div>
              <p class="warning-message notification is-primary">Please ensure you are connected to {{networkName}}</p>
          </div>
      </div>
    </div>
</div>    
</template>
<script>
// import {mapActions}
import { mapActions, mapGetters } from "vuex"
import { DAO } from "@/services/constants.js"
import { NETWORK } from "../../services/constants"
export default {
  name: "WalletConnect",
  computed: {
    ...mapGetters({
      address: "userWalletAddress",
    }),
    hover: false,
    networkName() {
      return NETWORK.name
    }
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
        },
        //  ledger: {
        //   name: "ledger",
        //   icon: require("@/assets/icons/ledger-wallet.png"),
        //   disabled: true
        // },
        // walletConnect: {
        //   name: "walletConnect",
        //   icon: require("@/assets/icons/coinbase-wallet.png"),
        //   disabled: false
        // },
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

.title-box {
  padding: 10px;
  border-top-left-radius: 8px;
  background: $mediumBlue;
  position: absolute;
  top: 0;
  left: 0;

  h3 {
    color: white;
    font-weight: 400;
  }
}

.wallet-connector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
  padding: 10px 20px 10px 0;
  background: rgba(255,255,255, 0.03);
  transition: all 150ms linear;
  border-radius: 8px;
  max-width: min(400px, 100%);
  border-left: 8px solid $mediumBlue;
  gap: 4rem;

  @media screen and (max-width: 415px) {
    flex-direction: column;
    padding-right: 0px;
    gap: 10px;

    .image {
      margin-left: 0px !important;
    }
  }

  &:hover {
    background-color: $mediumDarkGray;
    transform: translateY(-3px);
  }

  h4 {
    color: white;
    font-weight: 400;
    font-size: 1.4rem;
    width: 8ch;
  }
}

.warning-message {
  max-width: 32ch;
  text-align: center;
}
</style>