#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
exec sh pdf-size-reducer-ready/pdf-size-reducer/run_linux_mac.sh --toolbox
