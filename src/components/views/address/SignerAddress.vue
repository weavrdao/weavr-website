<template>
  <div class="">
    <div class="member-actions">
      <div v-if="whitelisted && isConnected && !hasKyc" class="button is-clickable is-success is-size-7" @click="onKyc"><span class="mr-1"></span>Get Verified</div>
      <div v-if="whitelisted && isConnected && hasKyc" class="button has-background-cyan has-text-white is-size-7 mr-1" @click="onVouch">Vouch</div>
      <div v-if="whitelisted && isConnected && hasKyc" class="button is-size-7 has-background-mint " @click="kycInfo">
          <unicon name="user-check" :width="15" :height="15" fill="white" alt="address verified"/>
      </div>
    </div>
    <div @click="tokenDetails" style="cursor: pointer;" class="ml-4 tag is-large is-flex is-address-container" v-if="address !=null">
      <div>
        <span >{{ balance }}</span>
        <span class="has-text-mediumBlue ml-1"> {{ symbol }}</span>
      </div>
      <div
        :class="[`tag has-radius-xs is-large is-clickable`, hasKyc ? 'has-background-primary' : `is-dark`]"
        @click="onClick"
      >
        <div class="is-family-monospace address has-text-white">
          {{
            address.substring(0, 8) + "..." + address.substring(address.length - 4)
          }}
        </div>
      </div>
      <div class="dropdown is-right is-hoverable has-background-darkGray">
        <div class="dropdown-trigger">
          <button 
            class="button is-primary is-dropdown-icon" 
            role="button" ref="dropdownButton"
            @click="toggleDropdown()"
            aria-haspopup="true" aria-controls="dropdown-menu3">
            <span><unicon class="mr-0" :width="25" :height="25" name="angle-down" fill="darkGray"></unicon></span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu3" role="menu">
          <div class="dropdown-content ">
            <a  class="dropdown-item is-disabled has-text-mediumGray">
              Token Overview
            </a>
            <a @click="onLogout" class="dropdown-item">
              Logout
            </a>
            <hr class="dropdown-divider">
            
          </div>
        </div>
      </div>
    </div>
    
    <div
      v-else
      class="has-radius-xs is-large is-clickable connect"
      @click="onClick"
      :aria-disabled="true"
    >
      
      <div 
        :class="[isGuest? 'is-warning has-text-darkGray': 'is-primary has-text-white', ' button']">
        {{ isGuest ? "GUEST" : "Connect"}}
      </div>
    </div>
    <div id="toeknModal"></div>
  </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from "vuex";
  import { DAO, CONTRACTS } from "../../../services/constants"
  import { Modal } from "../modal/Modal.vue"
  import { ethers } from 'ethers';
  import { createToaster } from "@meforma/vue-toaster";
  export default {
    name: "SignerAddress",
    computed: {
      ...mapGetters({
        whitelisted: "isWhitelisted",
        hasKyc: "hasKyc",
        address: "userWalletAddress",
        balance: "userTokenBalance",
        symbol: "assetTokenSymbol",
        vouches: "vouchesPerSigner",
        guestCookie: "guestCookie"
      }),
      isConnected() {
        return ethers.utils.isAddress(this.address)
      },
      isGuest() {
        return this.guestCookie
      }
    },
    methods: {
      ...mapActions({
        sync: "syncWallet",
        tokenInfo: "tokenInfo",
        checkKyc: "checkKyc",
        logout: "logout",
        participantsList: "participantsByType"
      }),
      toggleDropdown() {
        
      },
      onClick() {
        if(ethers.utils.isAddress(this.address)){
          this.sync({$toast: this.$toast})
        }else {
          this.$router.push("/walletConnect")
        }
      },
      onVouch() {
        this.$router.push(`/${this.$route.params.assetId}/vouch`)
      },
      onKyc() {
        this.$router.push(`/${this.$route.params.assetId}/kyc`)
      },
      kycInfo() {
       this.$toast.success("You are a verified member with full voting abilities", { position: "top", duration: false})
      },
      onLogout() {
        this.logout()
        this.$router.go('/')
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
    async mounted() {
      this.participantsList({type: "GENESIS"})
      console.log("Calling kyc...")
    },
    
  };
  
  </script>
  
  <style lang="scss" scoped>
  @import "../../../styles/weavr-custom.scss";
  .member-actions {
    display: inline-flex;
  }
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
  
    // .has-text-medium-blue {
    //   color: $mediumBlue;
    // }
    .dropdown-menu {

    }
    .is-dropdown-icon {
  display: inline-flex !important;
      background: $darkGray !important;
      padding-right: 0px !important;
    }
  
    .connect {
      transition: all 150ms;
      &:hover {
        filter: contrast(120%);
      }
    }
  </style>
  