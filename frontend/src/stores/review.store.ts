import type { ReviewHistoryItem } from "@/types/review.types";
import { defineStore } from "pinia";

interface ReviewHistoryState {
  reviewHistory: ReviewHistoryItem[];
  reviewResult: string;
  code: string;
  selectedLanguage: string;
}

export const useReviewStore = defineStore("review", {
  state: (): ReviewHistoryState => ({
    reviewHistory: [],
    reviewResult: "",
    code: `function sum(a, b) { return a + b }`,
    selectedLanguage: "javascript",
  }),
  actions: {
    addReviewHistory(review: ReviewHistoryItem) {
      this.reviewHistory = [...this.reviewHistory, review];
    },
    setReviewHistory(reviews: ReviewHistoryItem[]) {
      this.reviewHistory = reviews;
    },
    setReviewResult(result: string) {
      this.reviewResult = result;
    },
    setCode(code: string) {
      this.code = code;
    },
    setSelectedLanguage(language: string) {
      this.selectedLanguage = language;
    },
    resetReview() {
      this.reviewResult = "";
      this.code = `function sum(a, b) { return a + b }`;
      this.selectedLanguage = "javascript";
    },
  },
});
