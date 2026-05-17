import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

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
    members: z.array(z.string()),
    youtubeId: z.string().optional(),
    features: z.array(z.object({
      key: z.string(),
      items: z.array(z.string()).optional().default([]),
    })).optional(),

  }),
});

const members = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/members" }),
  schema: z.object({
    name: z.string(),
    unit: z.string(),
    generation: z.string(),
    image: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    order: z.number(),  // 並び順 
  }),
});

export const collections = { activities, withxmeets, members };
