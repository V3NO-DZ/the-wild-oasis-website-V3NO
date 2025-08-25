FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies from root package.json
FROM base AS deps
COPY /package.json /package-lock.json ./
RUN npm ci --include=dev

# Build Next.js app located in /frontend
FROM deps AS build
# Avoid pre-render data fetching during build
ENV NEXT_FORCE_DYNAMIC=1
ENV NEXT_SKIP_BUILD_STATIC_GENERATION=true
COPY /frontend ./frontend
COPY /next.config.mjs ./next.config.mjs
COPY /tsconfig.json ./tsconfig.json
COPY /public ./public
WORKDIR /app/frontend
RUN npm run build --workspace=false || npx next build

# Production runtime
FROM node:20-alpine AS runner
WORKDIR /app/frontend
ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules from root level and built assets
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/frontend/.next ./.next
COPY --from=build /app/frontend/public ./public
COPY /package.json ./package.json

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]


