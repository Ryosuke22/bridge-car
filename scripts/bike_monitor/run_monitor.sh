#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# バイクオークション監視スクリプト — cron ラッパー
# 実行タイミング: 毎週月曜日 09:00 JST
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${SCRIPT_DIR}/logs"
LOG_FILE="${LOG_DIR}/monitor_$(TZ=Asia/Tokyo date +%Y-%m-%d).log"

mkdir -p "${LOG_DIR}"

echo "=======================================" >> "${LOG_FILE}"
echo "[$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S') JST] 監視スクリプト開始" >> "${LOG_FILE}"

# Node.js のパスを明示（cron 環境では PATH が限定されるため）
# nvm 経由でインストールされた node を優先して探す
NODE_BIN=""
for candidate in \
    "/home/ubuntu/.nvm/versions/node/v22.13.0/bin/node" \
    "$(which node 2>/dev/null)" \
    "/usr/local/bin/node" \
    "/usr/bin/node"; do
  if [ -x "${candidate}" ]; then
    NODE_BIN="${candidate}"
    break
  fi
done

if [ -z "${NODE_BIN}" ]; then
  echo "[$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S') JST] [ERROR] Node.js が見つかりません。" >> "${LOG_FILE}"
  exit 1
fi

echo "[$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S') JST] [INFO] Node: ${NODE_BIN}" >> "${LOG_FILE}"

cd "${SCRIPT_DIR}"

"${NODE_BIN}" generate_auction_links.js >> "${LOG_FILE}" 2>&1
EXIT_CODE=$?

if [ ${EXIT_CODE} -eq 0 ]; then
  echo "[$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S') JST] 正常終了 (exit: 0)" >> "${LOG_FILE}"
else
  echo "[$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S') JST] エラー終了 (exit: ${EXIT_CODE})" >> "${LOG_FILE}"
fi

echo "=======================================" >> "${LOG_FILE}"
exit ${EXIT_CODE}
