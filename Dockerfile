ARG BASE_IMAGE=node:12-alpine

# Dependencies
FROM $BASE_IMAGE AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Builder
FROM $BASE_IMAGE AS builder

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Runner
FROM $BASE_IMAGE AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

RUN install -d -o nestjs -g nodejs /apk

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nestjs

CMD ["yarn", "start:prod"]