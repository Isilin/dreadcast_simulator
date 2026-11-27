# syntax=docker/dockerfile:1

# Production image (forge, via Coolify): built by GitHub Actions, never on the
# server. The final stage holds only the built front (dist/) and the bundled
# server (dist-server/): no node_modules, no sources.

# --- Build ---------------------------------------------------------------------
FROM node:26-alpine AS build
WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN --mount=type=cache,target=/root/.yarn/berry/cache \
    yarn install --immutable

COPY . .

# Read by Vite at build time (public values: Supabase URL and anon key until
# the move to our own sessions, credits address of the subscription page).
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUBSCRIPTION_CREDITS_ADDRESS
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_SUBSCRIPTION_CREDITS_ADDRESS=$VITE_SUBSCRIPTION_CREDITS_ADDRESS

RUN yarn build && yarn build:server

# --- Runtime -------------------------------------------------------------------
FROM node:26-alpine
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    STATIC_ROOT=/app/dist

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/dist-server ./dist-server

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "--enable-source-maps", "dist-server/index.js"]
