import { api } from "@/api";
import type { Review } from "@/types/review";

export const reviewService = {
  async reviewCode({ code, language }: { code: string; language: string }): Promise<Review> {
    const response = await api.post<Review>("/ai/review-code", { code, language });
    return response.data;
  },

  async getReviewHistory(): Promise<Review[]> {
    const response = await api.get<Review[]>("/review/history");
    return response.data;
  },

  async getReviewById(id: string): Promise<Review> {
    const response = await api.get<Review>(`/review/${id}`);
    return response.data;
  },
};
