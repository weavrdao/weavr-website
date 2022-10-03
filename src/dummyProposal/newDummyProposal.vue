<template>
  <div class="container p-5">
    <div class="control">
      <div class="field">
        <div class="label">Descriptor</div>
        <textarea class="textarea"></textarea>
      </div>
    </div>
    <div class="control mt-2">
      <div class="button-group">
        <button class="button is-primary">Publish</button>
      </div>
      
    </div>
    
  </div>
</template>
<script>
import { mapActions } from "vuex"
export default {
    name: "dummy-proposal",
    methods: {
      ...mapActions({
        publishToIPFS: "publishToIPFS"
      }),
      onClick() {
        
      }
    }
}
</script>