<script setup lang="ts">
import {
  ArrowRightEndOnRectangleIcon,
  Bars3CenterLeftIcon,
  CommandLineIcon,
} from "@heroicons/vue/24/outline";
import logo from "@/assets/logo.png";
import { computed, onMounted, ref } from "vue";
import { reviewService } from "@/services/review.service";
import { filterReviewsByDate } from "@/utils/helpers";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useReviewStore } from "@/stores/review.store";
import { useAuthStore } from "@/stores/auth.store";
import { RouterLink } from "vue-router";
import HistoryGroup from "./HistoryGroup.vue";

const isLoading = ref(false);
const reviewStore = useReviewStore();
const authStore = useAuthStore();
const isSidebarOpen = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await reviewService.getReviewHistory();
    reviewStore.setReviewHistory(response);
  } catch (error) {
    console.error("Error fetching review history:", error);
  } finally {
    isLoading.value = false;
  }
});

const handleLogout = async () => {
  await authStore.logout();
};

const toggleSideBar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const groupedReviews = computed(() => filterReviewsByDate(reviewStore.reviewHistory));
</script>

<template>
  <div
    :class="[
      isSidebarOpen ? 'w-64 px-6' : 'w-20 items-center',
      'hidden sm:flex flex-col gap-y-5 overflow-y-auto overflow-x-hidden bg-gray-900 relative transition-all duration-300 ease-in-out',
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex h-16 shrink-0 items-center pt-4">
        <img :class="[isSidebarOpen ? 'md:h-10' : 'md:h-8', 'h-8 w-auto']" :src="logo" alt="logo" />
      </div>

      <div
        class="flex items-center hover:bg-gray-800 text-gray-400 hover:text-white p-2 rounded-md cursor-pointer"
        v-if="isSidebarOpen"
        @click="toggleSideBar"
      >
        <Bars3CenterLeftIcon class="size-5 shrink-0" />
      </div>
    </div>

    <div
      class="flex items-center hover:bg-gray-800 text-gray-400 hover:text-white p-3 rounded-md cursor-pointer"
      v-if="!isSidebarOpen"
      @click="toggleSideBar"
    >
      <Bars3CenterLeftIcon class="size-5 shrink-0" />
    </div>

    <RouterLink
      to="/"
      :class="[
        isSidebarOpen
          ? 'w-32 rounded-md bg-[#5DC596] text-white text-sm font-semibold hover:bg-[#328a62]'
          : 'hover:bg-gray-800 text-gray-400 hover:text-white rounded-md',
        'flex items-center p-3',
      ]"
    >
      <CommandLineIcon class="size-5 shrink-0" />
      <span v-if="isSidebarOpen" class="ml-2">New review</span>
    </RouterLink>
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <ClipLoader />
    </div>
    <nav v-else class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col">
        <li v-if="isSidebarOpen">
          <ul role="list" class="-mx-2 mt-2 space-y-1">
            <HistoryGroup title="Today" :reviews="groupedReviews.today" />
            <HistoryGroup title="Yesterday" :reviews="groupedReviews.yesterday" />
            <HistoryGroup title="Last 7 Days" :reviews="groupedReviews.last7Days" />
          </ul>
        </li>

        <div
          @click="handleLogout"
          :class="[
            isSidebarOpen
              ? '-mx-6 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800'
              : 'hover:bg-gray-800 text-gray-400 hover:text-white p-3 rounded-md mb-3',
            'mt-auto flex items-center cursor-pointer',
          ]"
        >
          <ArrowRightEndOnRectangleIcon class="size-5 shrink-0" />
          <span class="ml-2 whitespace-nowrap" v-if="isSidebarOpen">Sign out</span>
        </div>
      </ul>
    </nav>
  </div>
</template>
