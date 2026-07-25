# ---- build ----
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /repo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --filter @portfolio/api...
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @portfolio/api build

# ---- runtime ----
FROM node:22-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/apps/api/package.json ./apps/api/
USER app
EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
