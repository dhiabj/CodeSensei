<script setup lang="ts">
import {
  CommandLineIcon,
  ArrowRightEndOnRectangleIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/vue/24/outline";
import logo from "@/assets/logo.png";
import { computed, onMounted, ref } from "vue";
import { reviewService } from "@/services/review.service";
import { filterReviewsByDate } from "@/utils/helpers";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useReviewStore } from "@/stores/review.store";
import { useAuthStore } from "@/stores/auth.store";
import { RouterLink, useRoute } from "vue-router";

const isLoading = ref(false);
const reviewStore = useReviewStore();
const authStore = useAuthStore();

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

const handleLogout = () => {
  authStore.logout();
};

const isActiveLink = (routePath: string) => {
  const route = useRoute();
  return route.path === routePath;
};

const groupedReviews = computed(() => filterReviewsByDate(reviewStore.reviewHistory));
</script>

<template>
  <div class="flex flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 w-64">
    <div class="flex h-16 shrink-0 items-center pt-4">
      <img class="h-10 w-auto" :src="logo" alt="logo" />
    </div>
    <RouterLink
      to="/"
      class="flex items-center rounded-md bg-[#5DC596] text-white text-sm font-semibold p-3 w-35 hover:bg-[#328a62]"
    >
      <ChatBubbleBottomCenterTextIcon class="size-5 shrink-0" />
      <span class="ml-2">New review</span>
    </RouterLink>
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <ClipLoader />
    </div>
    <nav v-else class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col">
        <li>
          <ul role="list" class="-mx-2 mt-2 space-y-1">
            <!-- Today -->
            <li v-if="groupedReviews.today.length">
              <div class="text-xs/6 font-semibold text-gray-400 mt-4">Today</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="review in groupedReviews.today" :key="review._id">
                  <RouterLink
                    :to="{ name: 'home', params: { id: review._id } }"
                    :class="[
                      isActiveLink(`/${review._id}`)
                        ? 'bg-gray-800 text-white'
                        : 'hover:bg-gray-800 hover:text-white',
                      'flex items-center gap-x-3 rounded-md p-2 text-sm/6 text-gray-400',
                    ]"
                  >
                    <CommandLineIcon class="size-5 shrink-0" />
                    <span class="truncate">{{ review.title }}</span>
                  </RouterLink>
                </li>
              </ul>
            </li>

            <!-- Yesterday -->
            <li v-if="groupedReviews.yesterday.length">
              <div class="text-xs/6 font-semibold text-gray-400 mt-4">Yesterday</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="review in groupedReviews.yesterday" :key="review._id">
                  <RouterLink
                    :to="{ name: 'home', params: { id: review._id } }"
                    :class="[
                      isActiveLink(`/${review._id}`)
                        ? 'bg-gray-800 text-white'
                        : 'hover:bg-gray-800 hover:text-white',
                      'flex items-center gap-x-3 rounded-md p-2 text-sm/6 text-gray-400',
                    ]"
                  >
                    <CommandLineIcon class="size-5 shrink-0" />
                    <span class="truncate">{{ review.title }}</span>
                  </RouterLink>
                </li>
              </ul>
            </li>

            <!-- Last 7 Days -->
            <li v-if="groupedReviews.last7Days.length">
              <div class="text-xs/6 font-semibold text-gray-400 mt-4">Last 7 Days</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="review in groupedReviews.last7Days" :key="review._id">
                  <RouterLink
                    :to="{ name: 'home', params: { id: review._id } }"
                    :class="[
                      isActiveLink(`/${review._id}`)
                        ? 'bg-gray-800 text-white'
                        : 'hover:bg-gray-800 hover:text-white',
                      'flex items-center gap-x-3 rounded-md p-2 text-sm/6 text-gray-400',
                    ]"
                  >
                    <CommandLineIcon class="size-5 shrink-0" />
                    <span class="truncate">{{ review.title }}</span>
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li class="-mx-6 mt-auto">
          <RouterLink
            to="/login"
            @click="handleLogout"
            class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800"
          >
            <ArrowRightEndOnRectangleIcon class="size-5 shrink-0" />
            <span class="sr-only">Sign out</span>
            <span aria-hidden="true">Sign out</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
