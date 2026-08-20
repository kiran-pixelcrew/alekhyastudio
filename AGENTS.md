<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deploy safety

Always run `npm run build` successfully before pushing to any remote branch. A `.githooks/pre-push` hook enforces this locally once hooks are enabled (`npm run setup:hooks`).

# Admin subdomain

Production admin UI is served at `admin.alekhyastudio.com` (env `ADMIN_HOST`). Locally keep using `/admin` on localhost. Add the subdomain in Vercel Domains pointing at the same project.
