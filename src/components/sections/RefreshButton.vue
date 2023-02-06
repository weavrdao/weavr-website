<template>
<div class="is-flex is-justify-content-flex-end">
    <button 
      :class="` button is-hover-transparent is-reponsive is-${style}`"
      @click="refreshData"
    >
      <i>
        <unicon name="sync" :fill="color" :width="size" :height="size"></unicon>
      </i>
    </button>
      <!-- <button
      @click="refreshData"
      :class="`button is-${style} has-text-white p-0`"
    > -->
      
    <!-- </button> -->
    
</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RefreshButton",
  emits: ['refreshed'],
  props: {
    assetId: {
      type: String,
      requried: true,
    },
    style: {
      type: String,
      default: "transparent"
    },
    color: {
      type: String,
      default: "gray"
    },
    size: {
      type: Number,
      default: 24
    }
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
    }),
    refreshData() {
      console.log("REFRESH")
      this.refresh({ assetId: this.assetId, forceRefresh: true });
      this.$emit("refreshed")
    }
  }
}
</script>
