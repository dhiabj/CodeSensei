<script setup lang="ts">
import { onMounted, watch } from "vue";
import { reviewService } from "@/services/review.service";
import { useReviewStore } from "@/stores/review.store";
import { useRoute } from "vue-router";
import nProgress from "nprogress";
import CodeReview from "@/components/CodeReview.vue";

const reviewStore = useReviewStore();
const route = useRoute();

const fetchReview = async (id: string) => {
  if (!id) return;
  try {
    nProgress.start();
    const response = await reviewService.getReviewById(id);
    reviewStore.setReviewResult(response.reviewResult);
    reviewStore.setCode(response.code);
    reviewStore.setSelectedLanguage(response.language);
  } catch (error) {
    console.error("Error fetching review:", error);
  } finally {
    nProgress.done();
  }
};

onMounted(async () => {
  const initialId = route.params.id as string;
  await fetchReview(initialId);
});

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchReview(newId as string);
    }
  }
);
</script>

<template>
  <CodeReview />
</template>
