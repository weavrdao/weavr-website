<template>
  <div v-if="asset">
    <StackNavigationBar @onBack="goBack">
      {{ "New Proposal — " + asset.address }}
    </StackNavigationBar>

    <div class="panel p-3 mt-4">
      <div class="field">
        <label for="new-proposal-title" class="label">Name</label>
        <div class="control">
          <input
            class="input"
            type="text"
            name="new-proposal-title"
            id="new-proposal-title"
            placeholder="Title (required)"
            v-model="title"
            required
          />
        </div>
      </div>

      <div class="field">
        <label for="new-proposal-desc" class="label">Description</label>
        <div class="control">
          <textarea
            class="textarea is-family-monospace"
            type="text"
            id="new-proposal-desc"
            name="new-proposal-desc"
            placeholder="Description"
            rows="4"
            v-model="description"
          />
        </div>
      </div>

      <!--       <div class="field">
        <label for="new-proposal-start-date" class="label"
          >Start Date and Time</label
        >
        <div class="control">
          <input
            class="input"
            type="datetime-local"
            id="new-proposal-start-date"
            name="new-proposal-start-date"
            v-model="startDate"
          />
        </div>
      </div>

      <div class="field">
        <label for="new-proposal-end-date" class="label"
          >End Date and Time</label
        >
        <div class="control">
          <input
            class="input"
            type="datetime-local"
            id="new-proposal-end-date"
            name="new-proposal-end-date"
            v-model="endDate"
          />
        </div>
      </div> -->

      <Button label="Publish" extraClasses="w-full" @click="publish" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import StackNavigationBar from "../layout/navigation/StackNavigationBar.vue";
import Button from "../views/common/Button.vue";

export default {
  name: "NewProposal",
  components: {
    StackNavigationBar,
    Button,
  },
  props: {
    assetId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: "",
      description: "",
    };
  },
  computed: {
    ...mapGetters({
      assetMap: "assetsById",
    }),

    asset() {
      return this.assetMap.get(this.assetId);
    },
  },
  methods: {
    ...mapActions({
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      createProposal: "createProposal",
    }),

    goBack() {
      this.$router.back();
    },

    publish() {
      if (this.title.length < 1 || this.description.length < 1) {
        return;
      }

      this.createProposal({
        assetId: this.assetId,
        title: this.title,
        description: this.description,
        $toast: this.$toast,
      });
    },
  },
  mounted() {
    this.refresh({ assetId: this.assetId });
    this.syncWallet();
  },
};
</script>