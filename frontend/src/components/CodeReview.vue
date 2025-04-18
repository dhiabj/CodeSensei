<script setup lang="ts">
import CodeEditor from "@/components/CodeEditor.vue";
import { computed, reactive, ref } from "vue";
import { Vue3Lottie } from "vue3-lottie";
import ReviewingCodeJSON from "@/assets/animations/ReviewingCodeJSON.json";
import VueMarkdown from "vue-markdown-render";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import DOMPurify from "dompurify";
import { reviewService } from "@/services/review.service";
import { useReviewStore } from "@/stores/review.store";
import { useAuthStore } from "@/stores/auth.store";

const isLoading = ref(false);
const reviewStore = useReviewStore();
const authStore = useAuthStore();

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

const handleReviewCode = async () => {
  if (!reviewStore.code) return;
  try {
    isLoading.value = true;
    const response = await reviewService.reviewCode({
      code: reviewStore.code,
      language: reviewStore.selectedLanguage,
    });
    reviewStore.setReviewResult(response.reviewResult);
    if (authStore.isAuthenticated) reviewStore.addReviewHistory(response);
  } catch (error) {
    console.error("Error fetching review:", error);
  } finally {
    isLoading.value = false;
  }
};

const sanitizedReview = computed(() => DOMPurify.sanitize(reviewStore.reviewResult));
</script>

<template>
  <div class="flex-1">
    <div class="grid md:grid-cols-2 h-screen">
      <!-- Left Column (Code Editor) -->
      <div class="p-4 flex flex-col gap-4">
        <CodeEditor />
        <div class="ml-auto">
          <button
            @click="handleReviewCode"
            type="button"
            :disabled="isLoading || !reviewStore.code"
            class="rounded-md bg-[#5DC596] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#328a62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388E3C] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review code
          </button>
        </div>
      </div>

      <!-- Right Column (Review Results) -->
      <div class="flex flex-col gap-2 bg-black p-6 overflow-auto">
        <div v-if="!authStore.isAuthenticated" class="ml-auto space-x-2">
          <RouterLink
            to="/login"
            class="border border-[#5DC596] text-sm font-semibold text-[#5DC596] rounded-3xl px-3 py-2 hover:text-white hover:bg-[#5DC596]"
          >
            Sign in
          </RouterLink>
          <RouterLink
            to="/register"
            class="border bg-white text-sm font-semibold text-[#343434] rounded-3xl px-3 py-2"
          >
            Sign up
          </RouterLink>
        </div>
        <div v-if="isLoading" class="py-6 bg-black flex h-full items-center justify-center">
          <Vue3Lottie :animationData="ReviewingCodeJSON" :height="150" :width="150" />
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
</template>
