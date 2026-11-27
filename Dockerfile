# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

# The check above is skipped because the VITE_* build args are public values
# (the Supabase anon key is meant to be shipped to browsers), not secrets.
# Parser directives must come first: BuildKit stops reading them at the first
# ordinary comment or blank line.

# Production image (forge, via Coolify): built by GitHub Actions, never on the
# server. The final stage holds only the built front (dist/) and the bundled
# server (dist-server/): no node_modules, no sources.

# --- Build ---------------------------------------------------------------------
FROM node:26-alpine AS build
WORKDIR /app

# Node 25+ no longer ships Corepack: install it to get the Yarn version of
# package.json (packageManager).
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN npm install --global corepack@0.36.0 && corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN --mount=type=cache,target=/root/.yarn/berry/cache \
    yarn install --immutable

COPY . .

# Read by Vite at build time (public values: Supabase URL and anon key until
# the move to our own sessions, credits address of the subscription page).
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUBSCRIPTION_CREDITS_ADDRESS

# Build args reach RUN as environment variables. An empty one would hide the
# front's own fallback (`value ?? default` keeps ''), so it is unset instead.
RUN for name in VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY VITE_SUBSCRIPTION_CREDITS_ADDRESS; do \
      [ -n "$(printenv "$name")" ] || unset "$name"; \
    done; \
    yarn build && yarn build:server

# --- Runtime -------------------------------------------------------------------
FROM node:26-alpine
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    STATIC_ROOT=/app/dist \
    MIGRATIONS_DIR=/app/migrations

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/dist-server ./dist-server
# Applied at startup when DB_MIGRATE=1 (server/node.ts).
COPY --from=build --chown=node:node /app/server/db/migrations ./migrations

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "--enable-source-maps", "dist-server/index.js"]
