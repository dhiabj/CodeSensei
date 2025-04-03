<script setup lang="ts">
import CodeEditor from "@/components/CodeEditor.vue";
import CodeReview from "@/components/CodeReview.vue";
import { reactive, ref } from "vue";
import axios from "axios";
import PacmanLoader from "vue-spinner/src/PacmanLoader.vue";

const state = reactive({
  review: "",
  isLoading: false,
});
const code = ref(`console.log('Hello, world!')`);

const fetchReview = async () => {
  if (!code.value) {
    return;
  }
  try {
    state.isLoading = true;
    const response = await axios.post("/api/ai/review-code", {
      code: code.value,
    });
    console.log(response);
    state.review = response.data;
  } catch (error) {
    console.error("Error fetching review:", error);
  } finally {
    state.isLoading = false;
  }
};
</script>

<template>
  <main>
    <div class="grid md:grid-cols-2 h-screen">
      <div class="pt-4 bg-[#343434] flex flex-col gap-4">
        <CodeEditor :code="code" @update:code="code = $event" />
        <div class="ml-auto pr-4">
          <button
            @click="fetchReview"
            type="button"
            :disabled="state.isLoading || !code"
            class="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review code
          </button>
        </div>
      </div>
      <div v-if="state.isLoading" class="py-6 bg-black flex items-center justify-center">
        <PacmanLoader />
      </div>
      <div v-else class="h-full bg-black">
        <CodeReview :review="state.review" />
      </div>
    </div>
  </main>
</template>
