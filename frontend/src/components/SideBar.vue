<script setup lang="ts">
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  Bars3CenterLeftIcon,
  CommandLineIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import logo from "@/assets/logo.png";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { reviewService } from "@/services/review.service";
import { filterReviewsByDate } from "@/utils/helpers";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useReviewStore } from "@/stores/review.store";
import { useAuthStore } from "@/stores/auth.store";
import HistoryGroup from "./HistoryGroup.vue";
import router from "@/router";
import { useRoute } from "vue-router";

const isLoading = ref(false);
const reviewStore = useReviewStore();
const authStore = useAuthStore();
const route = useRoute();
const isDesktop = ref(false);
const isDesktopSidebarOpen = ref(true);
const isMobileSidebarOpen = ref(false);

watch(
  () => authStore.isAuthenticated,
  async (isAuth) => {
    if (!isAuth) return;

    isLoading.value = true;

    try {
      const response = await reviewService.getReviewHistory();
      reviewStore.setReviewHistory(response);
    } catch (error) {
      console.error("Error fetching review history:", error);
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true },
);

const handleLogout = async () => {
  await authStore.logout();
};

const handleLogin = () => {
  router.push("/login");
};

const toggleSideBar = () => {
  if (isDesktop.value) {
    isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value;
    return;
  }
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};

const handleNewReview = () => {
  reviewStore.resetReview();
  router.push("/");
};

const groupedReviews = computed(() => filterReviewsByDate(reviewStore.reviewHistory));

const isSidebarOpen = computed(() => (isDesktop.value ? isDesktopSidebarOpen.value : true));

const updateViewport = () => {
  isDesktop.value = window.innerWidth >= 640;
  if (isDesktop.value) {
    isMobileSidebarOpen.value = false;
  }
};

onMounted(() => {
  updateViewport();
  window.addEventListener("resize", updateViewport);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateViewport);
});

watch(
  () => route.fullPath,
  () => {
    if (!isDesktop.value) {
      isMobileSidebarOpen.value = false;
    }
  },
);
</script>

<template>
  <button
    v-if="!isDesktop && !isMobileSidebarOpen"
    class="fixed right-4 top-4 z-40 flex items-center justify-center rounded-md bg-gray-900 p-2 text-gray-300 hover:text-white"
    @click="isMobileSidebarOpen = true"
    aria-label="Open sidebar"
  >
    <Bars3CenterLeftIcon class="size-5 shrink-0" />
  </button>

  <div
    v-if="!isDesktop && isMobileSidebarOpen"
    class="fixed inset-0 z-30 bg-black/50 sm:hidden"
    @click="isMobileSidebarOpen = false"
  />

  <div
    v-if="isDesktop || isMobileSidebarOpen"
    :class="[
      isDesktop
        ? isSidebarOpen
          ? 'w-64 px-6'
          : 'w-20 items-center'
        : 'fixed inset-y-0 left-0 z-40 w-64 px-6',
      'flex flex-col gap-y-5 overflow-y-auto overflow-x-hidden bg-gray-900 relative transition-all duration-300 ease-in-out',
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex h-16 shrink-0 items-center pt-4">
        <img :class="[isSidebarOpen ? 'md:h-10' : 'md:h-8', 'h-8 w-auto']" :src="logo" alt="logo" />
      </div>

      <button
        class="flex items-center hover:bg-gray-800 text-gray-400 hover:text-white p-2 rounded-md cursor-pointer"
        v-if="isSidebarOpen || !isDesktop"
        @click="toggleSideBar"
      >
        <Bars3CenterLeftIcon v-if="isDesktop" class="size-5 shrink-0" />
        <XMarkIcon v-else class="size-5 shrink-0" />
      </button>
    </div>

    <button
      class="flex items-center hover:bg-gray-800 text-gray-400 hover:text-white p-3 rounded-md cursor-pointer"
      v-if="isDesktop && !isSidebarOpen"
      @click="toggleSideBar"
    >
      <Bars3CenterLeftIcon class="size-5 shrink-0" />
    </button>

    <button
      @click="handleNewReview"
      :class="[
        isSidebarOpen
          ? 'w-32 rounded-md bg-[#5DC596] text-white text-sm font-semibold hover:bg-[#328a62]'
          : 'hover:bg-gray-800 text-gray-400 hover:text-white rounded-md',
        'flex items-center p-3 cursor-pointer',
      ]"
    >
      <CommandLineIcon class="size-5 shrink-0" />
      <span v-if="isSidebarOpen" class="ml-2">New review</span>
    </button>
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
          v-if="authStore.isAuthenticated"
          @click="handleLogout"
          :class="[
            isSidebarOpen
              ? '-mx-6 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800'
              : 'hover:bg-gray-800 text-gray-400 hover:text-white p-3 rounded-md mb-3',
            'mt-auto flex items-center cursor-pointer',
          ]"
        >
          <ArrowLeftEndOnRectangleIcon class="size-5 shrink-0" />
          <span class="ml-2 whitespace-nowrap" v-if="isSidebarOpen">Sign out</span>
        </div>
        <div
          v-else
          :class="[isSidebarOpen ? '-mx-6 px-6 py-3' : 'p-3 mb-3', 'mt-auto flex flex-col gap-3']"
        >
          <p v-if="isSidebarOpen" class="text-sm text-center font-semibold text-gray-300">
            Log in for saved chats.
          </p>
          <button
            @click="handleLogin"
            :class="[
              isSidebarOpen
                ? 'w-full rounded-md bg-[#5DC596] text-white text-sm font-semibold hover:bg-[#328a62] justify-center'
                : 'hover:bg-gray-800 text-gray-400 hover:text-white rounded-md',
              'flex items-center p-3 cursor-pointer',
            ]"
          >
            <ArrowRightEndOnRectangleIcon class="size-5 shrink-0" />
            <span class="ml-2 whitespace-nowrap" v-if="isSidebarOpen">Log in</span>
          </button>
        </div>
      </ul>
    </nav>
  </div>
</template>
