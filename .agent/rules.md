---
description: Project Rules
---

# Project Rules

1. **Always Push to Vercel**: After every meaningful code change, run `git push origin main` to trigger a Vercel deployment. Do not wait for the user to ask.
2. **Handle SSR Issues**: Next.js Server Components cannot use `ssr: false` directly. Use a Client Component wrapper.
3. **Verify Imports**: Check that imports match the file structure.
