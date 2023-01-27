<template>
<div class="is-flex is-justify-content-flex-end">
    <button
      @click="refreshData"
      :class="`button is-${style} has-text-white p-3`"
    >
      <unicon name="sync" fill="white" :width="size" :height="size"></unicon>
    </button>
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
    },
    style: {
      type: String,
      default: "success"
    }
  },
  data() {
    return {
      size: 24,
    }
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
    }),
    refreshData() {
      this.refresh({ assetId: this.assetId, forceRefresh: true });
    }
  }
}
</script>

