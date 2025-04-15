import type { Review } from "@/types/review";
import { defineStore } from "pinia";

interface ReviewHistoryState {
  reviewHistory: Review[];
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
    addReviewHistory(review: Review) {
      this.reviewHistory = [...this.reviewHistory, review];
    },
    setReviewHistory(reviews: Review[]) {
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
    clearReviewResult() {
      this.reviewResult = "";
    },
    resetCode() {
      this.code = `function sum(a, b) { return a + b }`;
    },
    resetSelectedLanguage() {
      this.selectedLanguage = "javascript";
    },
  },
});
