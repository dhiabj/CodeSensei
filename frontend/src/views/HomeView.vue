<script setup lang="ts">
import CodeEditor from "@/components/CodeEditor.vue";
import { computed, reactive, ref } from "vue";
import PacmanLoader from "vue-spinner/src/PacmanLoader.vue";
import VueMarkdown from "vue-markdown-render";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import DOMPurify from "dompurify";
import history from "@/assets/data/history.json";
import { DocumentTextIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/vue/24/outline";
import logo from "@/assets/logo.png";
import { api } from "@/api";

const state = reactive({
  review: "",
  isLoading: false,
});
const code = ref(`function sum(a, b) { return a + b }`);
const reviewHistory = ref(history);
const selectedReview = ref<(typeof reviewHistory.value)[number] | null>(null);

// Date filtering utilities (modified for dummy data)
const filterReviews = (daysAgo: number) => {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() - daysAgo);

  return reviewHistory.value.filter((review) => {
    const reviewDate = new Date(review.timestamp);
    return (
      reviewDate.getDate() === targetDate.getDate() &&
      reviewDate.getMonth() === targetDate.getMonth() &&
      reviewDate.getFullYear() === targetDate.getFullYear()
    );
  });
};

const todayReviews = computed(() => filterReviews(0));
const yesterdayReviews = computed(() => filterReviews(1));
const last7DaysReviews = computed(() => {
  return reviewHistory.value.filter((review) => {
    const reviewDate = new Date(review.timestamp);
    const daysDifference = Math.floor((Date.now() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDifference >= 2 && daysDifference <= 7;
  });
});

console.log(last7DaysReviews.value, "last7DaysReviews.value");
console.log(todayReviews.value, "todayReviews.value");
console.log(yesterdayReviews.value, "yesterdayReviews.value");

// Configure markdown-it options
const markdownItOptions = reactive({
  html: false,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return "";
  },
});

const fetchReview = async () => {
  if (!code.value) return;

  try {
    state.isLoading = true;
    const response = await api.post("/ai/review-code", {
      code: code.value,
    });
    state.review = response.data;
  } catch (error) {
    console.error("Error fetching review:", error);
  } finally {
    state.isLoading = false;
  }
};

const sanitizedReview = computed(() => DOMPurify.sanitize(state.review));

const selectReview = (review: (typeof reviewHistory.value)[number]) => {
  selectedReview.value = review;
};
</script>

<template>
  <main class="flex overflow-hidden h-screen">
    <!-- Sidebar -->
    <div class="flex flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 w-64">
      <div class="flex h-16 shrink-0 items-center pt-4">
        <img class="h-10 w-auto" :src="logo" alt="logo" />
      </div>
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col">
          <li>
            <ul role="list" class="-mx-2 mt-2 space-y-1">
              <!-- Today -->
              <li v-if="todayReviews.length">
                <div class="text-xs/6 font-semibold text-gray-400 mt-4">Today</div>
                <ul role="list" class="-mx-2 mt-2 space-y-1">
                  <li v-for="review in todayReviews" :key="review.id">
                    <a
                      @click="selectReview(review)"
                      class="cursor-pointer flex gap-x-3 rounded-md p-2 text-sm/6 text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      <DocumentTextIcon class="size-5 shrink-0" />
                      <span class="truncate">{{ review.title }}</span>
                    </a>
                  </li>
                </ul>
              </li>

              <!-- Yesterday -->
              <li v-if="yesterdayReviews.length">
                <div class="text-xs/6 font-semibold text-gray-400 mt-4">Yesterday</div>
                <ul role="list" class="-mx-2 mt-2 space-y-1">
                  <li v-for="review in yesterdayReviews" :key="review.id">
                    <a
                      @click="selectReview(review)"
                      class="cursor-pointer flex gap-x-3 rounded-md p-2 text-sm/6 text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      <DocumentTextIcon class="size-5 shrink-0" />
                      <span class="truncate">{{ review.title }}</span>
                    </a>
                  </li>
                </ul>
              </li>

              <!-- Last 7 Days -->
              <li v-if="last7DaysReviews.length">
                <div class="text-xs/6 font-semibold text-gray-400 mt-4">Last 7 Days</div>
                <ul role="list" class="-mx-2 mt-2 space-y-1">
                  <li v-for="review in last7DaysReviews" :key="review.id">
                    <a
                      @click="selectReview(review)"
                      class="cursor-pointer flex gap-x-3 rounded-md p-2 text-sm/6 text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      <DocumentTextIcon class="size-5 shrink-0" />
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

    <!-- Main Content -->
    <div class="flex-1">
      <div class="grid md:grid-cols-2 h-screen">
        <!-- Left Column (Code Editor) -->
        <div class="p-4 flex flex-col gap-4">
          <CodeEditor :code="code" @update:code="code = $event" />
          <div class="ml-auto">
            <button
              @click="fetchReview"
              type="button"
              :disabled="state.isLoading || !code"
              class="rounded-md bg-[#5DC596] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#328a62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388E3C] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review code
            </button>
          </div>
        </div>

        <!-- Right Column (Review Results) -->
        <div v-if="state.isLoading" class="py-6 bg-black flex items-center justify-center">
          <PacmanLoader />
        </div>
        <div v-else class="bg-black p-6 overflow-auto">
          <div v-if="selectedReview">
            <button
              @click="selectedReview = null"
              class="mb-4 text-gray-400 hover:text-white flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to current review
            </button>
            <VueMarkdown
              :source="selectedReview.content"
              :options="markdownItOptions"
              class="text-white"
            />
          </div>
          <VueMarkdown
            v-else
            :source="sanitizedReview"
            :options="markdownItOptions"
            class="text-white"
          />
        </div>
      </div>
    </div>
  </main>
</template>
