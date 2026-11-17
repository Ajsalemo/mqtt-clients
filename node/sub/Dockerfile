FROM node:26.13-alpine3.24 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm prune --omit=dev

FROM node:26.13-alpine3.24 AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/ ./

EXPOSE 3000
CMD ["node", "server.js"]
