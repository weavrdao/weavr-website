<template>
  <div class="container">
    <div class="columns">
      <div class="column is-three-fifths has-radius-lg">
        <div class="p-1 m-2">
          <Accordion
            summary="Overview"
            extraClasses="mt-4  has-radius-lg"
            :open="true"
          >
            <dl>
              <dt class="help">
                <strong>Total value</strong>
              </dt>
              <dd>$ 6969.69</dd>
            </dl>
          </Accordion>
          <Accordion summary="Graph">
            <img class="image" src="https://via.placeholder.com/500" />
          </Accordion>
        </div>
      </div>
      <div class="column is-two-fifths">
        <div class="m-2">
          <label for="search" class="is-sr-only"> Filter by address </label>
          <div class="mt-1 relative rounded-lg">
            <input
              type="text"
              name="search"
              id="search"
              class="input has-radius-lg"
              placeholder="Filter by address..."
              v-model="searchQuery"
            />
          </div>
        </div>
        <div v-if="isAssetsLoaded">
          <ul>
            <li class="p-3 m-2">
              <AssetListItemPlaceholder />
            </li>
            <li v-for="asset in searchResults" :key="asset.id" class="p-1 m-3">
              <AssetListItem :asset="asset" />
            </li>
          </ul>
        </div>
        <div v-else>
          <ul>
            <li class="p-3 m-2">
              <Loader />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AssetListItem from "../views/assets/AssetListItem.vue";
import AssetListItemPlaceholder from "../views/assets/AssetListItemPlaceholder.vue";
import Accordion from "../utils/Accordion.vue";
import Loader from "../utils/Loader.vue";

export default {
  name: "MyAssets",
  components: {
    AssetListItem,
    AssetListItemPlaceholder,
    Accordion,
    Loader,
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  computed: {
    ...mapGetters({
      assets: "ownedAssets",
      address: "userWalletAddress",
    }),
    isAssetsLoaded() {
      return this.assets !== null;
    },
    searchResults() {
      if (this.searchQuery.trim().length == 0) {
        return this.assets;
      }

      return (
        this.assets?.filter((item) => {
          return item.address
            .toLowerCase()
            .includes(this.searchQuery.trim().toLowerCase());
        }) || []
      );
    },
  },
  methods: {
    ...mapActions({
      refresh: "refreshOwnedAssetsData",
      syncWallet: "syncWallet",
    }),
  },
  mounted() {
    this.refresh();
    this.syncWallet({ $toast: this.$toast });
  },
  watch: {
    $route: "refresh",
  },
};
</script>