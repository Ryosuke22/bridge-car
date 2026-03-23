#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# バイクオークション監視スクリプト — cron ラッパー
# 実行タイミング: 毎週月曜日 09:00 JST
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
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

  # ── GitHub へレポートをコミット・プッシュ ──────────────────────────────────
  GIT_BIN="$(which git 2>/dev/null || echo '/usr/bin/git')"
  if [ -x "${GIT_BIN}" ] && [ -d "${REPO_DIR}/.git" ]; then
    DATE_TAG="$(TZ=Asia/Tokyo date +%Y-%m-%d)"
    cd "${REPO_DIR}"
    "${GIT_BIN}" add scripts/bike_monitor/reports/ >> "${LOG_FILE}" 2>&1
    if "${GIT_BIN}" diff --cached --quiet; then
      echo "[$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S') JST] [INFO] レポートに変更なし。コミットをスキップ。" >> "${LOG_FILE}"
    else
      "${GIT_BIN}" commit -m "chore: バイク監視レポートを更新 (${DATE_TAG})" >> "${LOG_FILE}" 2>&1
      "${GIT_BIN}" push origin main >> "${LOG_FILE}" 2>&1
      echo "[$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S') JST] [INFO] GitHub へプッシュ完了。" >> "${LOG_FILE}"
    fi
  else
    echo "[$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S') JST] [WARN] git が見つからないか .git ディレクトリが存在しません。スキップ。" >> "${LOG_FILE}"
  fi
else
  echo "[$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S') JST] エラー終了 (exit: ${EXIT_CODE})" >> "${LOG_FILE}"
fi

echo "=======================================" >> "${LOG_FILE}"
exit ${EXIT_CODE}
