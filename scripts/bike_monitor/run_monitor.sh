#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# バイクオークション監視スクリプト — cron ラッパー
# 実行タイミング: 毎週月曜日 09:00 JST
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${SCRIPT_DIR}/logs"
LOG_FILE="${LOG_DIR}/monitor_$(date +%Y-%m-%d).log"

mkdir -p "${LOG_DIR}"

echo "=======================================" >> "${LOG_FILE}"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 監視スクリプト開始" >> "${LOG_FILE}"

# Node.js のパスを明示（cron 環境では PATH が限定されるため）
NODE_BIN="$(which node 2>/dev/null || echo '/usr/bin/node')"

cd "${SCRIPT_DIR}"

"${NODE_BIN}" generate_auction_links.js >> "${LOG_FILE}" 2>&1
EXIT_CODE=$?

if [ ${EXIT_CODE} -eq 0 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 正常終了 (exit: 0)" >> "${LOG_FILE}"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] エラー終了 (exit: ${EXIT_CODE})" >> "${LOG_FILE}"
fi

echo "=======================================" >> "${LOG_FILE}"
exit ${EXIT_CODE}
