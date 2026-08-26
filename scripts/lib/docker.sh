#!/bin/sh

require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker Desktop と Docker Compose v2 が必要です。Dockerをインストールしてから再実行してください。" >&2
    exit 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    echo "Docker Compose v2 が必要です。Docker Desktopの構成を確認してください。" >&2
    exit 1
  fi

  if ! docker info >/dev/null 2>&1; then
    echo "Docker daemonへ接続できません。Docker Desktopを起動してから再実行してください。" >&2
    exit 1
  fi
}

build_workspace_image() {
  if [ -n "${NPM_CA_FILE:-}" ]; then
    if [ ! -f "$NPM_CA_FILE" ]; then
      echo "NPM_CA_FILEで指定されたCA fileが見つかりません: $NPM_CA_FILE" >&2
      exit 1
    fi

    docker build "$@" \
      --secret "id=npm_ca,src=$NPM_CA_FILE" \
      --target development \
      --tag matsu-ai-dev-flow-lab:local \
      .
    return
  fi

  docker build "$@" \
    --target development \
    --tag matsu-ai-dev-flow-lab:local \
    .
}

run_setup_container() {
  if [ -n "${NPM_CA_FILE:-}" ]; then
    ca_mount_source=$NPM_CA_FILE
    if command -v cygpath >/dev/null 2>&1; then
      ca_mount_source=$(cygpath -w "$NPM_CA_FILE")
    fi

    MSYS_NO_PATHCONV=1 NODE_EXTRA_CA_CERTS=/run/secrets/npm_ca \
      docker compose run --rm \
      --volume "$ca_mount_source:/run/secrets/npm_ca:ro" \
      --env NODE_EXTRA_CA_CERTS \
      setup
    return
  fi

  docker compose run --rm setup
}
