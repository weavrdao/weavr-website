<template>
    <a :href="href">
      <div class="card">
        <div class="media" :style="{ backgroundImage: image }">
        <img :src="image" :alt="title" />
        </div>
        <div class="details">
        <h2 class="title">{{ title }}</h2>
        <p class="excerpt">{{ truncateText(excerpt, 99) }}</p>
        <div class="author">
            <div class="flex">
            <span class="name">{{ author }} </span>
            <span class="date">{{ formatDate(date) }}</span>
            </div>
        </div>
        </div>
    </div>
    </a>
  </template>
<script>
import moment from 'moment';


export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
  },
  methods: {
    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + "...";
      }
      return text;
    },
    formatDate(dateString) {
      return moment(dateString).format("MMMM Do YYYY");
    }
  },
};
</script>
<style scoped lang="scss">
.card {
  display: flex;
  overflow: hidden;
  background: var(--vp-c-bg-soft-mute);
  border-radius: 0.5rem;
  /* overflow: hidden; */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
  width: 100%;
  max-height: 10rem;
  min-height: 6rem;
  max-width: 50rem;
  margin: 1rem auto;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.45);
  filter: contrast(1.1);
  transition: ease-in-out 0.2s all;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.media {
  max-height: 100%;
  overflow: hidden;
  max-width: max(30%, 4rem);
  border-right: 4px solid var(--vp-c-brand);
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
}

.details {
  margin:  0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 100%;
}

.excerpt {
    color: var(--vp-custom-block-info-text)
}

.title {
  border-top: none;
  font-size: 1.2rem;
  font-weight: 600;
}

.name {
  color: var(--vp-c-brand);
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0;
  margin-right: 1rem;
}

@media screen and (max-width: 550px) {
    .media {
        border-bottom: 4px solid var(--vp-c-brand);
        border-right: none;
        max-width: unset;
        max-height: 10rem;
    }

    .card {
        max-height: unset;
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 1rem;
    }

    .details {
        gap: 1rem;
    }
}
</style>