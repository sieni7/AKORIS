export interface Secret {
  key: string; // "GITHUB_TOKEN"
  value: string; // chiffré
  provider: string; // "github" | "supabase" | "vercel" | "netlify" | "openai" | "anthropic"
  createdAt: string;
  updatedAt: string;
}
