import { api } from "@/api";
import type { Review } from "@/types/review";

export const reviewService = {
  async reviewCode({ code }: { code: string }): Promise<Review> {
    const response = await api.post<Review>("/ai/review-code", { code });
    return response.data;
  },

  async getReviewHistory(): Promise<Review[]> {
    const response = await api.get<Review[]>("/review/history");
    return response.data;
  },
};
