# Multi-stage build for both apps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build officer-app
FROM deps AS officer-builder
WORKDIR /app/officer-app
COPY officer-app .
RUN npm run build

# Build public-app
FROM deps AS public-builder
WORKDIR /app/public-app
COPY public-app .
RUN npm run build

# Runtime - Officer App
FROM node:20-alpine AS officer
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY officer-app ./officer-app
COPY --from=officer-builder /app/officer-app/.next ./officer-app/.next
COPY --from=officer-builder /app/officer-app/public ./officer-app/public

EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /app/officer-app
CMD ["npm", "start"]

# Runtime - Public App
FROM node:20-alpine AS public
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY public-app ./public-app
COPY --from=public-builder /app/public-app/.next ./public-app/.next
COPY --from=public-builder /app/public-app/public ./public-app/public

EXPOSE 3001
ENV NODE_ENV=production
WORKDIR /app/public-app
CMD ["npm", "start"]

# Combined runtime (run both apps)
FROM node:20-alpine
WORKDIR /app

# Install PM2 to manage both processes
RUN npm install -g pm2

# Copy from officer builder
COPY --from=officer-builder /app/node_modules ./node_modules
COPY officer-app ./officer-app
COPY --from=officer-builder /app/officer-app/.next ./officer-app/.next
COPY --from=officer-builder /app/officer-app/public ./officer-app/public

# Copy from public builder
COPY --from=public-builder /app/node_modules ./node_modules
COPY public-app ./public-app
COPY --from=public-builder /app/public-app/.next ./public-app/.next
COPY --from=public-builder /app/public-app/public ./public-app/public

# Create ecosystem config for PM2
RUN echo 'module.exports = { \
  apps: [{ \
    name: "officer-app", \
    cwd: "/app/officer-app", \
    script: "npm", \
    args: "start", \
    port: 3000, \
    env: { NODE_ENV: "production" } \
  }, { \
    name: "public-app", \
    cwd: "/app/public-app", \
    script: "npm", \
    args: "start", \
    port: 3001, \
    env: { NODE_ENV: "production", NEXT_PUBLIC_OFFICER_URL: "http://localhost:3000" } \
  }] \
};' > ecosystem.config.js

EXPOSE 3000 3001
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
