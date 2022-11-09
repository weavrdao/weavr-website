<template>
  <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="show" class="max-w-sm w-full bg-level-2-light shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <RefreshIcon v-if="type == 'pending'" class="animate-spin h-6 w-6 text-foam" aria-hidden="true" />
            <InformationCircleIcon v-if="type == 'info'" class="h-6 w-6 text-foam" aria-hidden="true" />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-foam">
              {{ title }}
            </p>
            <p class="mt-1 text-sm text-foam text-opacity-75">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button @click="dismiss" class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span class="sr-only">Close</span>
              <XIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from "vuex"
import { RefreshIcon, InformationCircleIcon } from "@heroicons/vue/outline"
import { XIcon } from "@heroicons/vue/solid"

export default {
  name: "Alert",
  components: {
    RefreshIcon,
    InformationCircleIcon,
    XIcon,
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: "info"
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions({
      dismiss: "dismissAlert"
    })
  }
}
</script>