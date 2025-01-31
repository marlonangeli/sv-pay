import {z} from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  WEB_APP_PORT: z.string().default('3000'),
  NEXT_PUBLIC_API_URL: z.string().default('https://localhost:5001')
});


export const env = EnvSchema.parse(process.env);