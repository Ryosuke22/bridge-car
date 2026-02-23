# バイクオークション監視スクリプト

毎週月曜日 09:00 JST に自動実行され、各オークションサイトの検索URLを生成してレポートを更新します。

## セットアップ

```bash
cd scripts/bike_monitor
npm install
cp .env.example .env  # SUPABASE_URL と SUPABASE_KEY を設定
```

## cron 設定

```
# 毎週月曜日 09:00 JST (UTC 00:00)
0 0 * * 1 TZ=Asia/Tokyo /path/to/run_monitor.sh
```

## 対象オークションサイト

- ヤフオク
- メルカリ
- BikeBros（バイクブロス）
- Goo-net バイク
- バイク王（BIKE-O-KING）
- eBay (International)
