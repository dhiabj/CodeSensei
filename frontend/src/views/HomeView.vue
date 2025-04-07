<script setup lang="ts">
import CodeEditor from "@/components/CodeEditor.vue";
import { computed, reactive, ref } from "vue";
import PacmanLoader from "vue-spinner/src/PacmanLoader.vue";
import VueMarkdown from "vue-markdown-render";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import DOMPurify from "dompurify";
import SideBar from "@/components/SideBar.vue";
import { reviewService } from "@/services/review.service";

const state = reactive({
  review: "",
  isLoading: false,
});
const code = ref(`function sum(a, b) { return a + b }`);

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
  if (!code.value) return;
  try {
    state.isLoading = true;
    const response = await reviewService.reviewCode({
      code: code.value,
    });
    state.review = response.reviewResult;
  } catch (error) {
    console.error("Error fetching review:", error);
  } finally {
    state.isLoading = false;
  }
};

const sanitizedReview = computed(() => DOMPurify.sanitize(state.review));
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
          <CodeEditor :code="code" @update:code="code = $event" />
          <div class="ml-auto">
            <button
              @click="handleReviewCode"
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
          <VueMarkdown :source="sanitizedReview" :options="markdownItOptions" class="text-white" />
        </div>
      </div>
    </div>
  </main>
</template>
