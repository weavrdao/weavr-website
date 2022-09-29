<template>
<div>
  <!-- <div class="button is-warning mr-5" @click="onVouch"><span class="mr-1">{{vouches}}</span>Vouch</div> -->
  <div @click="tokenDetails" style="cursor: pointer;" class="tag is-large is-flex is-address-container" v-if="address !=null">
    <div>
      <span >{{ balance }}</span>
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
    <div class="m-0 p-0"><unicon class="m-0 p-0" :width="30" name="signout" fill="magenta"></unicon> </div>
  </div>
  <div
    v-else
    class="tag is-primary has-radius-xs is-large is-clickable connect"
    @click="onClick"
  >
    <div class="has-text-white">Connect Wallet</div>
  </div>
  <div id="toeknModal"></div>
</div>
</template>

<script>
import { createApp } from '@vue/runtime-dom';
import { mapGetters, mapActions } from "vuex";
import { DAO } from "../../../services/constants"
import { Modal } from "../modal/Modal.vue"
import { ethers } from 'ethers';
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
      tokenInfo: "tokenInfo"
    }),
    onClick() {
      if(ethers.utils.isAddress(this.address)){
        this.sync({$toast: this.$toast})
      }else {
        this.$router.push("/walletConnect")
      }
      
    },
    onVouch() {
      // this.vouch({participant: "0x403383c411c0eB14eA0Bd15E7c2AD5431a7410C2"})
      this.$router.push("/".concat(DAO).concat("/vouch"))
    },
    async tokenDetails() {
     
      // const info = await this.tokenInfo({assetId: this.assetId})
      // // Promise.all([info]).then( (res) => {
      // //   console.log(res)
      // // })
      // console.log("INFO: ", info)
      // this.$router.push(
      // {
      //   path: "/".concat(DAO).concat("/tokenInfo"), 
      //   props: {
      //     info: { totalSypply: "100000"}
      //   }
      // });

     
    // this.$router.push({name: "/"+DAO+"/tokenInfo", params: {assetId: this.assetId}})
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
