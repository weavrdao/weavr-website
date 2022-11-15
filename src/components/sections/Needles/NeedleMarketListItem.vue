 <template>
  <section v-on:click="routeToNeedlePage" class="card is-rounded-lg" >
    <div class="image-container is-rounded-lg">
      <img v-bind:src="getCoverImageIpfsUrl()" alt="">
    </div>
    <div class="tag-container mb-2">
      <span class="tag has-background-mediumBlue has-text-white">Residential</span>
    </div>
    <div class="is-flex is-justify-content-space-between">
      <h3>{{ needle.name || 'Unnamed' }}</h3>
      <div class="ml-2 is-flex is-align-items-center">
        <div class="party-popper" v-if="finished">🎉</div>
        <div class="weavr-icon-container">
          <img src="../../../assets/logo/new-logo.svg" alt="">
        </div>
      </div>
    </div>
    <p class="target">{{ getDisplayTarget() }} <strong>USDC</strong></p>
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div v-bind:style="getProgressBarStyle()" class="progress" />
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Address from "@/components/views/address/Address.vue";
import { ethers } from "ethers";

export default {
  name: "NeedleMarketListItem",
  components: {
    // Address,
  },
  props: {
    needle: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      walletAddress: "userWalletAddress",
    }),
    finished() {
      return this.needle.state === "Finished"
    }
  },
  methods: {
    getCoverImageIpfsUrl() {
      return this.needle.imagesHashes
        ? `${process.env.VUE_APP_IFPS_GATEWAY_BASE_URL}/${this.needle.imagesHashes[0]}`
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
    },
    getDisplayTarget() {
      return Number(ethers.utils.formatUnits(this.needle.target, 6)).toLocaleString("en-US")
    },
    getProgressBarStyle() {
      return {
        width: `${100
          * Number(
            ethers.utils.formatUnits(this.needle.amountDeposited)
          ) / Number(
          ethers.utils.formatUnits(this.needle.target)
        )}%`
      }
    },
    routeToNeedlePage() {
      this.$router.push(`/needle/${this.needle.id}`);
    }
  },
};
</script>

<style scoped lang="scss">
@import "../../../styles/frabric-custom.scss";
@import "../../../styles/_variables.sass";

.card {
  background: $darkGray !important;
  padding: 15px 20px;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    filter: contrast(95%);
    transform: translateY(-1px);
  }

  .target {
    margin-top: 12px;
    text-align: right;
    font-size: 1.2rem;
  }

  .party-popper {
    font-size: 1.8rem;
    margin-right: 10px;
  }

  .weavr-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 35px;
    width: 35px;
    background: white;
    border-radius: 1000px;
    border: 2px solid $mediumBlue;
    margin: 0 auto;

    img {
      height: 21px;
      width: 21px;
    }
  }

  .image-container {
    border-radius: 12px;
    overflow: hidden;
    height: 20rem;
    margin-bottom: 15px;
    img {
      object-fit: cover;
      object-position: center;
      height: 20rem;
    }
  }

  h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: white;
  }
}

.progress-bar-container {
  margin-top: 12px;
  .progress-bar {
    width: 100%;
    background: $lightGray;
    height: 18px;
    border-radius: 8px;
    overflow: hidden;

    .progress {
      background: $mediumBlue;
      height: 18px;
      border-radius: 0px;
    }
  }
}
</style>
