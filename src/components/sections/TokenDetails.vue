<template>
<div>
  <div class="container p-5 relative">
    <div @click="routeToHome" class="close-icon">
      <div class="temp-close-dot"/> 
    </div>
    <div class="control">
      <div class="label">Total Supply: {{info}}</div>
    </div>
  </div>  
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import slider from "vue3-slider"
import { DAO, CONTRACTS } from "@/services/constants.js"
;
export default {
  // (bill) TODO: Make this reload data if loaded directly
  //              with a check to prevent extraneous calls.
  name: "tokenDetails",
  components: {
  
  },
  data () {
    return {
      
    }
  },
  props: {
    assetId: {
      type: String,
      required: true,
    }
  },
  computed: {
    ...mapGetters({
      info: "tokenInfo"  
    }),
    
  },
  methods: {
    ...mapActions({
     tokenInfo: "fetchTokenInfo"
    }), // Voting action
    routeToHome() {
      this.$router.push("/".concat(DAO));
    },
  },
  mounted() {
    this.info = this.tokenInfo(CONTRACTS.FRBC)
  },
  created() {

  },
}
</script>

<style lang="scss" scoped>
@import "../../styles/frabric-custom.scss";
.container {
  min-width: 80% !important;
}
.relative {
  position: relative;
}

.label {
  margin-top: 30px;
}

.close-icon {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 1000px;
  background: rgba(255, 255, 255, 0);
  transition: all 150ms;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .temp-close-dot {
    background: red;
    width: 15px;
    height: 15px;
    border-radius: 100px;
  }
}

.proposal-type {
  display: inline-block;
  font-weight: 400;
  padding: 5px 10px;
  border: 2px solid white;
  border-radius: $tiny-radius;
  margin-bottom: 20px;
}
.paper {
  border-color: #00EDC4;
  color: #00EDC4;
}

.participant {
  border-color: whitesmoke;
  color: whitesmoke;
}

.upgrade {
  border-color: #D841DE;
  color: #D841DE;
}

.thread {
  border-color: yellow;
  color: yellow;
}

.description-container {
  background: $mediumDarkGray;
  border-radius: $tiny-radius;

  p {
    max-width: 56ch;
  }
}
.votes-bar {
  width: 100%;
  height: 25px;
  background: $red;
  overflow: hidden;
  border: 2px solid white;
}

.green-bar {
  background: $mint;
  height: 30px;
}

.outcome-box {
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 15px 20px;
}

.slider {
  margin-bottom: 5px;
  height: 23px;
  transition: all 150ms;

  &:hover {
    filter: contrast(120%);
  }
}

.buttons-container {
  margin-top: 10px;
  .button {
    background: $mediumBlue;
    color: white;
    width: 3rem;
    height: 1.5rem;
    font-size: 12px;
    font-weight: 600;
  }
}
</style>