FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat python3 make g++
RUN corepack enable || true

FROM base AS deps
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json apps/web/
COPY apps/admin/package.json apps/admin/
COPY packages/database/package.json packages/database/
COPY packages/shared/package.json packages/shared/
RUN npm ci --legacy-peer-deps

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The application database stores media paths below /media, while the source
# assets live in the tracked WordPress upload tree. Populate Next's public
# directory before building so every standalone deployment serves those paths.
RUN cp -R wp-content/uploads/. apps/web/public/media/
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/packages/database/prisma/prod.db"
ARG NEXT_PUBLIC_STUDIO_SITE_TOKEN
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_STUDIO_SITE_TOKEN=$NEXT_PUBLIC_STUDIO_SITE_TOKEN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run db:generate --workspace=@feboko/database
RUN npm run db:push --workspace=@feboko/database
RUN npm run migrate:wp
RUN npm run build:web

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/packages/database/prisma/prod.db"
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
WORKDIR /app
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/prisma/prod.db ./packages/database/prisma/prod.db
RUN mkdir -p packages/database/prisma && chown -R nextjs:nodejs packages/database
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
