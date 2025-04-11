import type { Review } from "@/types/review";
import { defineStore } from "pinia";

interface ReviewHistoryState {
  reviewHistory: Review[];
  selectedReview: Review | null;
  code: string;
  selectedLanguage: string;
}

export const useReviewStore = defineStore("review", {
  state: (): ReviewHistoryState => ({
    reviewHistory: [],
    selectedReview: null,
    code: `function sum(a, b) { return a + b }`,
    selectedLanguage: "javascript",
  }),
  actions: {
    addReviewHistory(review: Review) {
      this.reviewHistory = [...this.reviewHistory, review];
    },
    clearReviews() {
      this.reviewHistory = [];
    },
    setReviewHistory(reviews: Review[]) {
      this.reviewHistory = reviews;
    },
    setSelectedReview(review: Review) {
      this.selectedReview = review;
    },
    setCode(code: string) {
      this.code = code;
    },
    setSelectedLanguage(language: string) {
      this.selectedLanguage = language;
    },
    clearSelectedReview() {
      this.selectedReview = null;
    },
    resetCode() {
      this.code = `function sum(a, b) { return a + b }`;
    },
    resetSelectedLanguage() {
      this.selectedLanguage = "javascript";
    },
  },
});
