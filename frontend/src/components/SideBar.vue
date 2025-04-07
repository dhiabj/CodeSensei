<script setup lang="ts">
import { CommandLineIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/vue/24/outline";
import logo from "@/assets/logo.png";
import { computed, onMounted, reactive } from "vue";
import type { Review } from "@/types/review";
import { reviewService } from "@/services/review.service";
import { filterReviews } from "@/utils/helpers";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";

interface State {
  reviewHistory: Review[];
  isLoading: boolean;
}

const state = reactive<State>({
  reviewHistory: [],
  isLoading: false,
});

onMounted(async () => {
  state.isLoading = true;
  try {
    const response = await reviewService.getReviewHistory();
    state.reviewHistory = response;
  } catch (error) {
    console.error("Error fetching review history:", error);
  } finally {
    state.isLoading = false;
  }
});

// const selectedReview = ref<(typeof reviewHistory.value)[number] | null>(null);

const todayReviews = computed(() => filterReviews(0, state.reviewHistory));
const yesterdayReviews = computed(() => filterReviews(1, state.reviewHistory));
const last7DaysReviews = computed(() => {
  return state.reviewHistory.filter((review) => {
    const reviewDate = new Date(review.createdAt);
    const daysDifference = Math.floor((Date.now() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDifference >= 2 && daysDifference <= 7;
  });
});

// const selectReview = (review: (typeof reviewHistory.value)[number]) => {
//   selectedReview.value = review;
// };
</script>

<template>
  <div class="flex flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 w-64">
    <div class="flex h-16 shrink-0 items-center pt-4">
      <img class="h-10 w-auto" :src="logo" alt="logo" />
    </div>
    <div v-if="state.isLoading" class="flex items-center justify-center h-full">
      <ClipLoader />
    </div>
    <nav v-else class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col">
        <li>
          <ul role="list" class="-mx-2 mt-2 space-y-1">
            <!-- Today -->
            <li v-if="todayReviews.length">
              <div class="text-xs/6 font-semibold text-gray-400 mt-4">Today</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="review in todayReviews" :key="review._id">
                  <a
                    class="cursor-pointer flex items-center gap-x-3 rounded-md p-2 text-sm/6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <CommandLineIcon class="size-5 shrink-0" />
                    <span class="truncate">{{ review.title }}</span>
                  </a>
                </li>
              </ul>
            </li>

            <!-- Yesterday -->
            <li v-if="yesterdayReviews.length">
              <div class="text-xs/6 font-semibold text-gray-400 mt-4">Yesterday</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="review in yesterdayReviews" :key="review._id">
                  <a
                    class="cursor-pointer flex items-center gap-x-3 rounded-md p-2 text-sm/6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <CommandLineIcon class="size-5 shrink-0" />
                    <span class="truncate">{{ review.title }}</span>
                  </a>
                </li>
              </ul>
            </li>

            <!-- Last 7 Days -->
            <li v-if="last7DaysReviews.length">
              <div class="text-xs/6 font-semibold text-gray-400 mt-4">Last 7 Days</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="review in last7DaysReviews" :key="review._id">
                  <a
                    class="cursor-pointer flex items-center gap-x-3 rounded-md p-2 text-sm/6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <CommandLineIcon class="size-5 shrink-0" />
                    <span class="truncate">{{ review.title }}</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li class="-mx-6 mt-auto">
          <a
            href="#"
            class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800"
          >
            <ArrowRightEndOnRectangleIcon class="size-5 shrink-0" />
            <span class="sr-only">Sign out</span>
            <span aria-hidden="true">Sign out</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
