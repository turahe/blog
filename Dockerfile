# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=npmrc,target=/tmp/npmrc,required=false \
  if [ -s /tmp/npmrc ]; then cp /tmp/npmrc /root/.npmrc; fi && \
  npm ci --ignore-scripts

FROM base AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=npmrc,target=/tmp/npmrc,required=false \
  if [ -s /tmp/npmrc ]; then cp /tmp/npmrc /root/.npmrc && cp /tmp/npmrc .npmrc; fi && \
  npm ci --ignore-scripts
COPY . .
RUN chmod +x scripts/docker-entrypoint.sh
EXPOSE 3000
CMD ["npm", "run", "docker:start"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="postgresql://blog:blogpassword@db:5432/blog"
RUN npx prisma generate
RUN npm run build

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/prisma ./src/prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "run", "serve"]
