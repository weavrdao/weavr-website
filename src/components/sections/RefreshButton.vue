<template>
<div class="is-flex is-justify-content-flex-end">
    <button
        @click="refreshData"
        class="button has-background-mediumBlue has-text-white">Refresh</button>
</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RefreshButton",
  props: {
    assetId: {
      type: String,
      requried: true,
    }
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
    }),
    refreshData() {
      this.syncWallet();
      this.refresh({ assetId: this.assetId });
    }
  }
}
</script>