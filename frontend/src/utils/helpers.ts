import type { ReviewHistoryItem } from "@/types/review.types";
import { startOfDay, subDays, isAfter, isSameDay, parseISO } from "date-fns";

export interface DateFilterGroups {
  today: ReviewHistoryItem[];
  yesterday: ReviewHistoryItem[];
  last7Days: ReviewHistoryItem[];
}

export function filterReviewsByDate(items: ReviewHistoryItem[] = []): DateFilterGroups {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = startOfDay(subDays(now, 1));
  const sevenDaysAgo = startOfDay(subDays(now, 7));

  const groups = items.reduce(
    (groups: DateFilterGroups, item) => {
      try {
        const createdAt = parseISO(item.createdAt);

        if (isSameDay(createdAt, todayStart)) {
          groups.today.push(item);
        } else if (isSameDay(createdAt, yesterdayStart)) {
          groups.yesterday.push(item);
        } else if (isAfter(createdAt, sevenDaysAgo)) {
          groups.last7Days.push(item);
        }
      } catch {
        console.warn(`Invalid date for review ${item._id}: ${item.createdAt}`);
      }

      return groups;
    },
    { today: [], yesterday: [], last7Days: [] },
  );

  const sortNewToOld = (a: ReviewHistoryItem, b: ReviewHistoryItem) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  groups.today.sort(sortNewToOld);
  groups.yesterday.sort(sortNewToOld);
  groups.last7Days.sort(sortNewToOld);

  return groups;
}
