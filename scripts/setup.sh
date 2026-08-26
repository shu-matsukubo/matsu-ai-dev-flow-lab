#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPOSITORY_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)

. "$SCRIPT_DIR/lib/docker.sh"
require_docker

cd "$REPOSITORY_ROOT"
build_workspace_image
run_setup_container

echo "Setup completed. Run: docker compose up front api"
