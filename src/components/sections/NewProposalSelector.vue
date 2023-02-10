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
   <div class="columns"> <div class="column is-full is-flex is-justify-content-flex-end	is-full">
    <div class="is-clickable" @click="toggleSelector">
      <unicon name="times-circle" fill="#d85a50" width="24" height="24"></unicon>
    </div>
      
    </div>
  </div>
      <div class="columns is-flex">
        <div class="column is-half is-three-quaters-widescreen">
          <!-- <label class="label" for="proposal-selector">Type of Proposal</label> -->
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
        <div class="column is-half is-one-quater-widescreen is-flex button-container">
          <button class="has-background-mediumBlue button has-text-white p-5  " @click="routeToSelectedPage">Create Proposal
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
  data() {
    return {
      selectedAction: "paperProposal",
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
          thread: true
        },
        {
          id: "participantRemovalProposal",
          name: "Participant Removal Proposal",
          type: "common",
          thread: true
        },
        {
          id: "dissolutionProposal",
          name: "Dissolution Proposal",
          type: "thread",
          thread: true
        }
      ],
    }
  },
  mounted() {
    this.actionTypes = this.setActionTypes() 
    console.log(this.actionTypes)
  },
  computed: {
   
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
      console.log("STARTING");
      if(this.isThread) {
        console.log("IS_THREAD_SET_PROPERLY");
        this.proposalTypes.forEach(element => {
          if( 
            (element.type == "common" || "thread" ) &&
            element.thread == true 
          ) {
            console.log(element);
            actions.push(element)
          }
        });
      }else {
        this.proposalTypes.forEach(element => {
          if( 
            element.type == "common" || element.type == "weavr" 
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

.select {
    
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