<template>
  <div class="is-rounded">
    <progress
      class="progress is-info"
      v-bind:min="minPassCount"
      v-bind:max="totalCount"
      v-bind:value="submittedCount"
      aria-label="Voting progress: {{ submittedCount }} / {{ totalCount }}"
    ></progress>
  </div>
</template>

<style scoped>
progress {
  width: 100%;
}

progress {
  border-radius: 0.4rem;
}
progress::-webkit-progress-bar {
  border-radius: 0.4rem;
}
progress::-webkit-progress-value {
  border-radius: 0.4rem;
}
progress::-moz-progress-bar {
  border-radius: 0.4rem;
}
</style>

<script>
export default {
  name: "VotingProgressBar",
  props: {
    totalCount: {
      type: Number,
      required: true,
    },
    submittedCount: {
      type: Number,
      required: true,
    },
    minPassCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>