'use strict';
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ─── Supabase 接続 ─────────────────────────────────────────────────────────────
const supabaseUrl  = process.env.SUPABASE_URL;
const supabaseKey  = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[ERROR] SUPABASE_URL / SUPABASE_KEY が .env に設定されていません。');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── オークションサイト URL ジェネレータ ──────────────────────────────────────
/**
 * 各オークションサイトの検索 URL を生成する。
 * 追加・変更が必要な場合はこのオブジェクトを編集してください。
 *
 * @param {string} name  - 車両名（例: "Ducati 916 SP"）
 * @returns {Array<{site: string, url: string}>}
 */
function buildAuctionUrls(name) {
  const q = encodeURIComponent(name);

  return [
    {
      site: 'ヤフオク',
      url : `https://auctions.yahoo.co.jp/search/search?p=${q}&auccat=26318&va=${q}&exflg=1&b=1&n=100&s1=new&o1=d`,
    },
    {
      site: 'メルカリ',
      url : `https://jp.mercari.com/search?keyword=${q}&category_id=1345&sort=created_time&order=desc`,
    },
    {
      site: 'BikeBros（バイクブロス）',
      url : `https://www.bikebros.co.jp/vb/sports/search/?keyword=${q}`,
    },
    {
      site: 'Goo-net バイク',
      url : `https://www.goo-net.com/usedcar/spread/goo/13/700060001230/index.html?keyword=${q}`,
    },
    {
      site: 'バイク王（BIKE-O-KING）',
      url : `https://www.bike-oh.com/search/?keyword=${q}`,
    },
    {
      site: 'eBay (International)',
      url : `https://www.ebay.com/sch/i.html?_nkw=${q}&_sacat=6000&_sop=10`,
    },
  ];
}

// ─── Supabase からバイクリストを取得 ──────────────────────────────────────────
async function fetchBikeList() {
  const { data, error } = await supabase
    .from('wanted_vehicles')
    .select('id, name, category, tag, is_high_priority, sort_order')
    .or('category.eq.Bike,category.eq.Car/Bike')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[ERROR] Supabase からのデータ取得に失敗しました:', error.message);
    return [];
  }

  console.log(`[INFO] ${data.length} 件のバイク車両を取得しました。`);
  return data;
}

// ─── Markdown レポート生成 ────────────────────────────────────────────────────
function buildMarkdownReport(bikes, generatedAt) {
  const dateStr = generatedAt.toLocaleString('ja-JP', {
    timeZone    : 'Asia/Tokyo',
    year        : 'numeric',
    month       : '2-digit',
    day         : '2-digit',
    hour        : '2-digit',
    minute      : '2-digit',
    second      : '2-digit',
    hour12      : false,
  });

  const highPriority = bikes.filter(b => b.is_high_priority);
  const normal       = bikes.filter(b => !b.is_high_priority);

  let md = '';
  md += '# バイクオークション監視レポート\n\n';
  md += `> **生成日時:** ${dateStr} (JST)  \n`;
  md += `> **対象車両数:** ${bikes.length} 件（HIGH: ${highPriority.length} 件 / NORMAL: ${normal.length} 件）\n\n`;
  md += '---\n\n';

  // ── HIGH PRIORITY ──
  if (highPriority.length > 0) {
    md += '## ★ 特に探しています（HIGH PRIORITY）\n\n';
    for (const bike of highPriority) {
      md += buildVehicleSection(bike);
    }
  }

  // ── NORMAL ──
  if (normal.length > 0) {
    md += '## その他の強化車種（NORMAL）\n\n';
    for (const bike of normal) {
      md += buildVehicleSection(bike);
    }
  }

  md += '---\n\n';
  md += `*このレポートは毎週月曜日 09:00 (JST) に自動生成されます。*\n`;

  return md;
}

function buildVehicleSection(bike) {
  const urls = buildAuctionUrls(bike.name);
  let section = '';

  section += `### ${bike.name}\n\n`;
  section += `- **カテゴリ:** ${bike.category}\n`;
  if (bike.tag) {
    section += `- **タグ:** ${bike.tag}\n`;
  }
  section += '\n';
  section += '| オークションサイト | 検索リンク |\n';
  section += '|---|---|\n';
  for (const { site, url } of urls) {
    section += `| ${site} | [${bike.name} を検索](${url}) |\n`;
  }
  section += '\n';

  return section;
}

// ─── レポートをファイルに保存 ─────────────────────────────────────────────────
function saveReport(content, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`[INFO] レポートを保存しました: ${outputPath}`);
}

// ─── メイン処理 ───────────────────────────────────────────────────────────────
async function main() {
  console.log('[START] バイクオークション監視スクリプトを開始します...');
  const startedAt = new Date();

  const bikes = await fetchBikeList();

  if (bikes.length === 0) {
    console.warn('[WARN] 対象バイクが 0 件のためレポートを生成しません。');
    process.exit(0);
  }

  const reportContent = buildMarkdownReport(bikes, startedAt);

  // ── 最新レポートを上書き保存 ──
  const latestPath = path.join(__dirname, 'reports', 'bike_auction_report.md');
  saveReport(reportContent, latestPath);

  // ── 日付付きアーカイブも保存 ──
  const dateTag = startedAt.toISOString().slice(0, 10); // YYYY-MM-DD
  const archivePath = path.join(__dirname, 'reports', 'archive', `bike_auction_report_${dateTag}.md`);
  saveReport(reportContent, archivePath);

  console.log('[DONE] 処理が完了しました。');
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
