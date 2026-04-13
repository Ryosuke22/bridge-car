#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# バイク監視スケジューラー 管理スクリプト
# 使用方法: ./manage_scheduler.sh {start|stop|restart|status}
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEDULER_PY="${SCRIPT_DIR}/scheduler.py"
PID_FILE="${SCRIPT_DIR}/scheduler.pid"
LOG_FILE="${SCRIPT_DIR}/logs/scheduler.log"

mkdir -p "${SCRIPT_DIR}/logs"

get_pid() {
  if [ -f "${PID_FILE}" ]; then
    local pid
    pid=$(cat "${PID_FILE}")
    if kill -0 "${pid}" 2>/dev/null; then
      echo "${pid}"
      return 0
    fi
  fi
  # PIDファイルがなくてもプロセスを探す
  pgrep -f "python3.*scheduler.py" | head -1
}

do_start() {
  local pid
  pid=$(get_pid)
  if [ -n "${pid}" ]; then
    echo "[INFO] スケジューラーは既に起動中です (PID: ${pid})"
    return 0
  fi

  echo "[INFO] スケジューラーを起動します..."
  TZ=Asia/Tokyo nohup python3 "${SCHEDULER_PY}" \
    >> "${LOG_FILE}" 2>&1 &
  local new_pid=$!
  echo "${new_pid}" > "${PID_FILE}"
  sleep 2
  if kill -0 "${new_pid}" 2>/dev/null; then
    echo "[INFO] 起動成功 (PID: ${new_pid})"
  else
    echo "[ERROR] 起動に失敗しました。ログを確認してください: ${LOG_FILE}"
    exit 1
  fi
}

do_stop() {
  local pid
  pid=$(get_pid)
  if [ -z "${pid}" ]; then
    echo "[INFO] スケジューラーは起動していません。"
    return 0
  fi

  echo "[INFO] スケジューラーを停止します (PID: ${pid})..."
  kill "${pid}" 2>/dev/null
  sleep 2
  if kill -0 "${pid}" 2>/dev/null; then
    kill -9 "${pid}" 2>/dev/null
  fi
  rm -f "${PID_FILE}"
  echo "[INFO] 停止しました。"
}

do_status() {
  local pid
  pid=$(get_pid)
  if [ -n "${pid}" ]; then
    echo "[STATUS] 実行中 (PID: ${pid})"
    echo "[STATUS] 次回実行予定: 毎週月曜日 09:00 JST"
    echo "[STATUS] ログ: ${LOG_FILE}"
  else
    echo "[STATUS] 停止中"
  fi
}

case "${1:-}" in
  start)   do_start ;;
  stop)    do_stop ;;
  restart) do_stop; do_start ;;
  status)  do_status ;;
  *)
    echo "使用方法: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
