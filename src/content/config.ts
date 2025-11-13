import { defineCollection, z } from 'astro:content';

const modulesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    frameworks: z.array(z.string()).optional(),
    level: z.enum(['basic', 'intermediate', 'advanced']).optional(),
    demo_url: z.string().optional(),
    code_url: z.string().optional(),
    prompt_template: z.string().optional(),
  }),
});

const tipsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    category: z.string().optional(),
    level: z.enum(['basic', 'intermediate', 'advanced']).optional(),
    date: z.coerce.string().optional(),
  }),
});

const sitesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    status: z.string().optional(),
    url: z.string().optional(),
    alt_urls: z.array(z.string()).optional(),
    platform: z.string().optional(),
    hosting: z.string().optional(),
    domain: z.string().optional(),
    repo: z.string().optional(),
    analytics: z.string().optional(),
    search_console: z.string().optional(),
    last_deployed: z.string().optional(),
    ownership: z.string().optional(),
    collaborators: z.string().optional(),
    notes: z.string().optional(),
    elements: z.array(z.string()).optional(),
    animations: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const recipesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    modules_used: z.array(z.string()).optional(),
    level: z.enum(['basic', 'intermediate', 'advanced']).optional(),
    use_case: z.string().optional(),
    prompt_template: z.string().optional(),
  }),
});

const integrationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    service: z.string().optional(),
    level: z.enum(['basic', 'intermediate', 'advanced']).optional(),
    env_vars: z.array(z.string()).optional(),
    dependencies: z.array(z.string()).optional(),
    prompt_template: z.string().optional(),
  }),
});

export const collections = {
  modules: modulesCollection,
  tips: tipsCollection,
  sites: sitesCollection,
  recipes: recipesCollection,
  integrations: integrationsCollection,
};
