<template>
 <div class="my-5">
  <div class="is-flex is-justify-content-end" v-if="!showSelector">
      <button 
        :class="['is-primary', ' button']" 
        v-on:click="toggleSelector"
      >
        {{ "New Proposal" }}
      </button>
    </div>
  <div class="proposal-selector p-5" v-if="showSelector">
    <div class="columns"> 
    <div class="column is-hidden-mobile is-11">
      <label class="title is-size-3 p-3" for="proposal-selector">Select a Proposal</label>
    </div>
    <div class="column is-1 p-0">
      <div class="is-clickable is-pulled-right p-0" @click="toggleSelector">
        <unicon name="times-circle" fill="#d85a50" width="24" height="24"></unicon>
      </div>
    </div>
  </div>
    <div class="columns">
      <div class="column is-half is-three-quaters-widescreen is-full-mobile">
        <div class="field">
          <p class="control">
            <span class="select is-medium is-primary is-hovered has-text-white">
              <select class=" has-text-white " v-model="selectedAction">
              <option v-for="option in actionTypes" :value="option.id" v-bind:key="option.id">
                {{ option.name }}
              </option>
            </select>
            </span>
          </p>
        </div>
      </div>
      <div class="column is-half is-one-quater-widescreen is-full-mobile button-container">
        <button class="has-background-mediumBlue button has-text-white p-5  is-pulled-right is-flex-desktop-only" @click="routeToSelectedPage">Create Proposal
        </button>
      </div>  
    </div>
  </div>
 </div>
</template>

<script>
export default {
  name: "NewProposalSelector",
  props: {
    isThread: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  // eslint-disable-next-line max-lines-per-function
  data() {
    return {
      selectedAction: this.isThread ? "descriptorChange" : "paperProposal",
      actionTypes: [],
      showSelector: false,
      // The id field here must match the desired page path
      proposalTypes: [
        {
          id: "paperProposal",
          name: "Paper Proposal",
          type: "common",
          thread: true
        },
        {
          id: "tokenProposal",
          name: "Token Action Proposal",
          type: "common",
          thread: true
        },
        {
          id: "threadProposal",
          name: "Thread Proposal",
          type: "weavr",
          thread: false
        },
        {
          id: "participantProposal",
          name: "Participant Proposal",
          type: "common",
          thread: false
        },
        {
          id: "participantRemovalProposal",
          name: "Participant Removal Proposal",
          type: "common",
          thread: true
        },
        {
          id: "descriptorChange",
          name: "Descriptor Change Proposal",
          type: "thread",
          thread: true
        },
        {
          id: "dissolutionProposal",
          name: "Dissolution Proposal",
          type: "thread",
          thread: true
        },
        {
          id: "governorChange",
          name: "Governor Change Proposal",
          type: "thread",
          thread: true
        },
        {
          id: "upgradeProposal",
          name: "Upgrade Proposal",
          type: "common",
          thread: true,
          hide: true
        },
      ],
    }
  },
  mounted() {
    this.actionTypes = this.setActionTypes() 
    console.log(this.actionTypes)
  },
  methods: {
    routeToSelectedPage() {
      console.log(this.$route.path)
      this.$router.push({path: this.$route.path + `/${this.selectedAction}`});
    },
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
    setActionTypes() {
      let actions = []
      if(this.isThread) {
        this.proposalTypes.forEach(element => {
          if( 
            (element.type == "common" || "thread" ) &&
            element.thread == true && !element.hide
          ) {
            console.log(element);
            actions.push(element)
          }
        });
      }else {
        this.proposalTypes.forEach(element => {
          if(   
            (element.type == "common" || element.type == "weavr") 
            && element.hide != true
          ) {
            console.log(element);
            actions.push(element)
          }
        });
      }
      return actions 
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/weavr-custom.scss";
.proposal-selector {
  border: 1px solid #575757;
  border-radius: 10px;
}

.button-container {
  justify-content: flex-end;
}
// Bulma can smd
@media only screen and (max-width: 769px) {
  .button-container {
    justify-content: flex-start;
  }
}
</style>