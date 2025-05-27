FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN corepack enable && corepack prepare yarn@4.9.1 --activate
RUN yarn install --frozen-lockfile || (cat /app/yarn-error.log && exit 1)
EXPOSE 3000

FROM base AS builder
WORKDIR /app
COPY . .
RUN yarn build

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
RUN yarn install --frozen-lockfile --production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

CMD ["yarn", "start"]

FROM base AS dev
ENV NODE_ENV=development
RUN yarn install
COPY . .
CMD ["yarn", "dev"]