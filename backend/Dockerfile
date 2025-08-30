FROM node:20-alpine AS base
WORKDIR /app

# Install OS deps required by Prisma engines
RUN apk add --no-cache openssl

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Build the app
FROM deps AS build
COPY tsconfig.json nest-cli.json ./
COPY src ./src
COPY main.ts ./
RUN npm run build

# Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/generated ./generated
COPY --from=build /app/dist ./dist
COPY package.json ./package.json

# Expose app port
EXPOSE 4000

CMD ["node", "dist/main.js"]


