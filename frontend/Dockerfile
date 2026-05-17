# ──────────────────────────────────────────────
#  FDBAtech Invoice SaaS — Frontend Dockerfile
#  Multi-stage: Build React → Serve via Nginx
# ──────────────────────────────────────────────

# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve via Nginx (ultra-lightweight)
FROM nginx:1.25-alpine AS runner

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Security: remove default nginx configs
RUN rm -f /etc/nginx/conf.d/default.conf.bak

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
