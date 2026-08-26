# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24.19.0

FROM node:${NODE_VERSION}-bookworm-slim AS development

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY apps/front/package.json apps/front/package.json
COPY apps/api/package.json apps/api/package.json
RUN --mount=type=secret,id=npm_ca,required=false \
    if [ -f /run/secrets/npm_ca ]; then \
      NODE_EXTRA_CA_CERTS=/run/secrets/npm_ca npm ci; \
    else \
      npm ci; \
    fi

COPY . .

CMD ["npm", "run", "verify"]
