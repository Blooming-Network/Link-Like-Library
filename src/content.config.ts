import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/**
 * メンバー名の一覧
 */
const memberNames = [
  "日野下花帆",
  "村野さやか",
  "乙宗梢",
  "夕霧綴理",
  "大沢瑠璃乃",
  "藤島慈",
  "百生吟子",
  "徒町小鈴",
  "安養寺姫芽",
  "セラス柳田リリエンフェルト",
  "桂城泉",
];

const memberGeneration = [
  "101期生", // 沙知
  "102期生", // 梢・綴理・慈
  "103期生", // 花帆・さやか・瑠璃乃
  "104期生", // 吟子・小鈴・姫芽・泉
  "105期生", // セラス
];

const activities = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/activities" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
  }),
});

const withxmeets = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/withxmeets" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    members: z.array(z.enum(memberNames)),
    youtubeId: z.string().optional(),
    features: z
      .array(
        z.object({
          key: z.string(),
          items: z.array(z.string()).optional().default([]),
        }),
      )
      .optional(),
  }),
});

const members = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/members" }),
  schema: z.object({
    name: z.enum(memberNames),
    description: z.string(),
    generation: z.enum(memberGeneration),
    birthday: z.coerce.date(),
    unit: z.string(),
    groups: z.array(z.string()).optional(),
    url: z.string().optional(),
    youtubeId: z.string().optional(),
    order: z.number(),
    icon: z.string().optional(),
    image: z.string().optional(),
  }),
});

const features = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/features" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
  }),
});

export const collections = { activities, withxmeets, members, features, news };
