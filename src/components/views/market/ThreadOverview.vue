<template>
   <div class="">
    <div class="dark-card">
      <p class="has-text-white mb-3">Property Description</p>
      <vue-markdown ref="mark" class="content markdown-body"  :watches="['source']"  :source="thread.descriptor"/>
    </div>
    <div class="dark-card mt-5">
      <p class="has-text-white mb-3">Property Documents</p>
      <div class="is-flex is-flex-direction-column is-justify-content-flex-start" v-for="document in thread.documentHashes" v-bind:key="document">
        <a class="ipfs-document-link" :href="getIpfsUrl(document)"><span>{{ document }}</span></a>
      </div>
    </div>
   <button class=" button is-primary" v-on:click="fr()">Refresh</button>
   </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { VueMarkdown } from "vue-markdown-render"
import { h } from '@vue/runtime-core';
import { useRoute } from 'vue-router';

export default {
  name: "ThreadOverview",
  components: [ 
    VueMarkdown 
  ],
  data() {
    return {
      threadId: useRoute().params.threadId,
      mark: ""
    }
  },
  computed: {
    ...mapGetters({
      threads: "threadById",
    }),
    thread() {
      return this.threads.get(this.$route.params['threadId'])
    },
  },
  methods: {
    ...mapActions({
      fetchThreads: "refreshThreads",
    }),
    
    getIpfsUrl(path) {
      return path
        ? `${process.env.VUE_APP_IFPS_GATEWAY_BASE_URL}/${path}`
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
    },
  },
  mounted() {   
    console.log(this.threads.get(this.$route.params['threadId'])); 
    const mark = this.$refs['mark']
    // mark.render(this.thread.descriptor)
    // console.log("NOUNTED:::::::::\n",this.thread)
    // this.$refs['mark'].source = this.thread.descriptor
    // this.render()
    console.log(mark);
    this.mark = mark;  
  }
}
</script>

<style lang="scss">
@import "@/styles/weavr-custom.scss";
@import "@/styles/markdown.scss"
</style>>
