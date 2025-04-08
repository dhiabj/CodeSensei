import type { Review } from "@/types/review";
import moment from "moment";

export interface DateFilterGroups {
  today: Review[];
  yesterday: Review[];
  last7Days: Review[];
}

export function filterReviewsByDate(items: Review[]): DateFilterGroups {
  const todayStart = moment.utc().startOf("day");
  const yesterdayStart = moment.utc().subtract(1, "day").startOf("day");
  const sevenDaysAgo = moment.utc().subtract(7, "days").startOf("day");

  const groups = items.reduce(
    (groups: DateFilterGroups, item) => {
      const createdAt = moment.utc(item.createdAt);

      if (createdAt.isSameOrAfter(todayStart)) {
        groups.today.push(item);
      } else if (createdAt.isSameOrAfter(yesterdayStart)) {
        groups.yesterday.push(item);
      } else if (createdAt.isSameOrAfter(sevenDaysAgo)) {
        groups.last7Days.push(item);
      }

      return groups;
    },
    { today: [], yesterday: [], last7Days: [] }
  );

  const sortNewToOld = (a: Review, b: Review) =>
    moment.utc(b.createdAt).diff(moment.utc(a.createdAt));

  groups.today.sort(sortNewToOld);
  groups.yesterday.sort(sortNewToOld);
  groups.last7Days.sort(sortNewToOld);

  return groups;
}
