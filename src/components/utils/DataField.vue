<template>
  <div class="columns form">
    <div class="field column is-two-fifths">
        <input :disabled="isSet" class="input" placeholder="Label" v-model="metaLabel"/>
    </div>
    <div class="field column is-two-fifths">
        <input :disabled="isSet" class="input" placeholder="Value" v-model="metaValue"/>
    </div>
    <div class="column is-one-fifths">
      <button class="button is-primary"  v-if="!isSet" v-on:click="sendMetaData">
          <unicon name="check" fill="white"></unicon>
      </button>
      <button class="button is-primary" v-else v-on:click="editMode">
          <unicon name="edit-alt" fill="white"></unicon>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["metaData"],
  name: "DataField",
  
  data() {
    return {
      metaLabel: "",
      metaValue: "",
      disabled: false
    }
      
  },
  computed: {
    isSet() {
      return this.disabled
    }
  },
  methods: {
    sendMetaData() {
      console.log(this.metaLabel,"|||||", this.metaValue);
      if( this.metaLabel == "" || this.metaValue =="" ) return
      this.$emit("metaData", [this.metaLabel, this.metaValue])
      this.disabled=true
    },
    editMode() {
      this.disabled = false;
    }
  }
}
</script>

<style>

</style>