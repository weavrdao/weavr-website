<template>
  <div class="has-text-foam has-radius-lg">
    <div class="">
      <label for="search" class="is-sr-only">
        Search by token name or address
      </label>
      <div class="mt-1 relative " >
        <input
          type="text"
          name="search"
          id="search"
          class="input is-rounded is-borderless"
          placeholder="Search by token name or address"
          v-model="searchQuery"
        />
      </div>
    </div>
      <div class="mt-3">
        <div class="block is-flex is-justify-content-flex-end is-flex-wrap-wrap">
          <a role="button" @click="toggleView" v-show="!isMobile">
            <unicon  v-if="!isGrid" name="apps" :width="iconSize" :height="iconSize" fill="white" icon-style="solid"></unicon>
            <unicon  v-if="isGrid" name="list-ul" :width="iconSize" :height="iconSize" :fill="colors.foam" icon-style="solid"></unicon>
          </a>
        </div>
        <ul v-if="!isGrid && !isMobile">
          <li v-for="asset in searchResults" :key="asset.id" class="px-8 py-8">
            <div class="block p-3">
             <MarketListItem :is-grid="isGrid" :asset="asset" />
            </div>
          </li>
        </ul>
        <div class="block" v-if="isGrid">
          <div class="is-flex is-flex-direction-row is-flex-wrap-wrap is-flex-grow-3"   v-for="asset in searchResults" :key="asset.id">
          <div class="block p-3">
            <MarketListItem :isGrid="isGrid" :asset="asset" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import MarketListItem from "../views/market/MarketListItem.vue";
import {Colors} from "../../styles/theme"
export default {
  name: "Marketplace",
  components: {
    MarketListItem,
  },
  data() {
    return {
      searchQuery: "",
      isGrid: true,
      iconSize: "24",
      windowWidth: 0,
      colors: Colors
    };
  },
  computed: {
    ...mapGetters({
      assets: "marketplaceActiveAssets",
    }),
    searchResults() {
      if (this.searchQuery.length == 0) {
        return this.assets;
      }

      return this.assets.filter((item) => {
        console.log(item);
        return item.address
          .toLowerCase()
          .includes(this.searchQuery.trim().toLowerCase());
      });
    },
    isMobile(){
      return this.getWindowWidth() < 768;
    } 
  },
  methods: {
    ...mapActions({
      refresh: "refreshMarketplaceData",
      syncWallet: "syncWallet",
    }),
    toggleView(){
      this.isGrid = !this.isGrid
    },
    getWindowWidth() {
      this.windowWidth = document.documentElement.clientWidth;
      
      if( this.isMobile && !this.isGrid){
        this.isGrid = true
      }
    },
    
    
  },
  mounted() {
    this.refresh();
    this.syncWallet();
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);

      //Init
      this.getWindowWidth()
    })
  },
  watch: {
    $route: "refresh",
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.windowWidth);
  }
};
</script>

