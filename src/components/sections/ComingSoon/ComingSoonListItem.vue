<template>
    <section v-on:click="routeToPropertyPage" class="card is-rounded-lg" >
      <div class="image-container is-rounded-lg">
        <img v-bind:src="property.coverImage" alt="">
      </div>
      <div class="tag-container mb-2">
        <span v-for="tag in property.tags" :key="tag" class="tag has-background-mediumBlue has-text-white">Residential</span>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <h3>{{ property.name || 'Unnamed' }}</h3>
        <div class="ml-2 is-flex is-align-items-center">
          <div class="weavr-icon-container">
            <img src="../../../assets/logo/new-logo.svg" alt="">
          </div>
        </div>
      </div>
      <p>📍 {{ property.location }}</p>
      <p class="target">{{ getDisplayTarget() }} <strong>USDC</strong></p>
    </section>
  </template>
  
<script>
  
export default {
  name: "ComingSoonListItem",
  components: {
    // Address,
  },
  props: {
    property: {
      type: Object,
      required: true,
    },
  },
  methods: {
    routeToPropertyPage() {
      this.$router.push(`/coming-soon/${this.property.id}`);
    },
    getDisplayTarget() {
      return Number(this.property.target).toLocaleString("en-US")
    },
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
        object-position: 50% 60%;
        height: 20rem;
        width: 100%;
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
  