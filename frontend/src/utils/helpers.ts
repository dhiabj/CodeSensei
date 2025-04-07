import type { Review } from "@/types/review";

export const filterReviews = (daysAgo: number, reviewHistory: Review[]) => {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() - daysAgo);

  return reviewHistory.filter((review) => {
    const reviewDate = new Date(review.createdAt);
    return (
      reviewDate.getDate() === targetDate.getDate() &&
      reviewDate.getMonth() === targetDate.getMonth() &&
      reviewDate.getFullYear() === targetDate.getFullYear()
    );
  });
};
