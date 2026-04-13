#!/usr/bin/env python3
"""
バイクオークション監視スケジューラー
毎週月曜日 09:00 JST に run_monitor.sh を自動実行します。
"""

import schedule
import time
import subprocess
import logging
import os
from datetime import datetime
from zoneinfo import ZoneInfo

# ─── ロギング設定 ────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR    = os.path.join(SCRIPT_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s JST] %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler(os.path.join(LOG_DIR, "scheduler.log"), encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

JST = ZoneInfo("Asia/Tokyo")
MONITOR_SCRIPT = os.path.join(SCRIPT_DIR, "run_monitor.sh")


def run_monitor():
    """バイク監視スクリプトを実行する。"""
    now_jst = datetime.now(JST).strftime("%Y-%m-%d %H:%M:%S")
    logger.info(f"[SCHEDULER] 監視スクリプトを起動します ({now_jst} JST)")

    try:
        result = subprocess.run(
            ["bash", MONITOR_SCRIPT],
            capture_output=True,
            text=True,
            timeout=300,  # 5分タイムアウト
        )
        if result.returncode == 0:
            logger.info("[SCHEDULER] 正常終了 (exit: 0)")
        else:
            logger.error(f"[SCHEDULER] エラー終了 (exit: {result.returncode})")
            if result.stderr:
                logger.error(f"[STDERR] {result.stderr[:500]}")
    except subprocess.TimeoutExpired:
        logger.error("[SCHEDULER] タイムアウト（5分超過）")
    except Exception as exc:
        logger.error(f"[SCHEDULER] 予期しないエラー: {exc}")


def get_next_run_info():
    """次回実行時刻を返す。"""
    jobs = schedule.get_jobs()
    if jobs:
        next_run = jobs[0].next_run
        return next_run.strftime("%Y-%m-%d %H:%M:%S")
    return "未設定"


# ─── スケジュール登録（月曜 09:00 JST = UTC 00:00） ──────────────────────────
# schedule ライブラリはシステム時刻を使用するため、
# TZ 環境変数を Asia/Tokyo に設定してから起動することを前提とします。
schedule.every().monday.at("09:00").do(run_monitor)

logger.info("=" * 60)
logger.info("バイクオークション監視スケジューラー 起動")
logger.info(f"スクリプト: {MONITOR_SCRIPT}")
logger.info(f"実行スケジュール: 毎週月曜日 09:00 JST")
logger.info(f"次回実行予定: {get_next_run_info()}")
logger.info("=" * 60)

# ─── メインループ ─────────────────────────────────────────────────────────────
while True:
    schedule.run_pending()
    time.sleep(30)  # 30秒ごとにチェック
