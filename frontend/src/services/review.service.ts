import { api } from "@/api";
import { useAuthStore } from "@/stores/auth.store";
import type { Review, ReviewHistoryItem } from "@/types/review.types";

export const reviewService = {
  async reviewCode({ code, language }: { code: string; language: string }): Promise<Review> {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated) {
      const response = await api.post<Review>("/reviews", { code, language });
      return response.data;
    } else {
      const response = await api.post<Review>("/reviews/analyze", { code, language });
      return response.data;
    }
  },

  async getReviewHistory(): Promise<ReviewHistoryItem[]> {
    const response = await api.get<ReviewHistoryItem[]>("/reviews/history");
    return response.data;
  },

  async getReviewById(id: string): Promise<Review> {
    const response = await api.get<Review>(`/reviews/${id}`);
    return response.data;
  },
};
