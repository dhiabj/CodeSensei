<script setup lang="ts">
import NProgress from "nprogress";
import CodeEditor from "@/components/CodeEditor.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { Vue3Lottie } from "vue3-lottie";
import ReviewingCodeJSON from "@/assets/animations/ReviewingCodeJSON.json";
import VueMarkdown from "vue-markdown-render";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import DOMPurify from "dompurify";
import SideBar from "@/components/SideBar.vue";
import { reviewService } from "@/services/review.service";
import { useReviewStore } from "@/stores/review.store";
import { useRoute, useRouter } from "vue-router";

const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      try {
        NProgress.start();
        const response = await reviewService.getReviewById(newId as string);
        reviewStore.setSelectedReview(response);
        reviewStore.setCode(response.code);
        reviewStore.setSelectedLanguage(response.language);
      } catch (error) {
        console.error("Error fetching review:", error);
      } finally {
        NProgress.done();
      }
    } else {
      reviewStore.clearSelectedReview();
      reviewStore.resetCode();
      reviewStore.resetSelectedLanguage();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (!route.params.id) {
    reviewStore.clearSelectedReview();
    reviewStore.resetCode();
    reviewStore.resetSelectedLanguage();
  }
});

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
    reviewStore.clearSelectedReview();
    reviewStore.addReviewHistory(response);
    router.push({ name: "home", params: { id: response._id } });
  } catch (error) {
    console.error("Error fetching review:", error);
  } finally {
    isLoading.value = false;
  }
};

const sanitizedReview = computed(() =>
  DOMPurify.sanitize(reviewStore.selectedReview?.reviewResult || "")
);
</script>

<template>
  <main class="flex overflow-hidden h-screen">
    <!-- Sidebar -->
    <SideBar />
    <!-- Main Content -->
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
        <div v-if="isLoading" class="py-6 bg-black flex items-center justify-center">
          <Vue3Lottie :animationData="ReviewingCodeJSON" :height="200" :width="200" />
        </div>
        <div v-else class="bg-black p-6 overflow-auto">
          <VueMarkdown :source="sanitizedReview" :options="markdownItOptions" class="text-white" />
        </div>
      </div>
    </div>
  </main>
</template>
