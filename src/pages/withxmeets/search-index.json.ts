import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { formatMonth, getJstDateParts } from "../../utils/calendar";

/*
 * 検索の元となるWith×MEETSのjsonデータを作成する
 */
export const GET: APIRoute = async () => {
  const entries = (await getCollection("withxmeets"))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((entry) => {
      const date = getJstDateParts(entry.data.date);

      return {
        id: entry.id,
        title: entry.data.title,
        description: entry.data.description,
        date: `${date.year}-${formatMonth(date.month)}-${String(date.day).padStart(2, "0")}`,
        members: entry.data.members,
      };
    });

  return new Response(JSON.stringify(entries), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
