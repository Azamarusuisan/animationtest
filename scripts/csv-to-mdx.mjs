import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '..', 'data', 'website_inventory.csv');
const outputDir = path.join(__dirname, '..', 'src', 'content', 'sites');

if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSVファイルが見つかりません: ${csvPath}`);
  process.exit(1);
}

// CSVを読み込む
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  bom: true,
});

// 出力ディレクトリを作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let count = 0;

records.forEach(record => {
  const title = record['プロジェクト名'] || 'Untitled';
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // 配列フィールドの処理
  const elements = record['サイト要素']
    ? record['サイト要素'].split('・').map(s => s.trim()).filter(Boolean)
    : [];
  const animations = record['アニメーション']
    ? record['アニメーション'].split('・').map(s => s.trim()).filter(Boolean)
    : [];
  const altUrls = record['代替URL/サブドメイン']
    ? record['代替URL/サブドメイン'].split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // タグの生成
  const tags = [];
  if (record['目的/タイプ']) tags.push(record['目的/タイプ']);
  if (record['プラットフォーム/フレームワーク']) tags.push(record['プラットフォーム/フレームワーク']);

  // MDXの生成
  const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${(record['備考'] || `${title}の制作サイト`).replace(/"/g, '\\"')}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
status: "${record['ステータス'] || ''}"
url: "${record['公開URL'] || ''}"
alt_urls: [${altUrls.map(u => `"${u}"`).join(', ')}]
platform: "${record['プラットフォーム/フレームワーク'] || ''}"
hosting: "${record['ホスティング'] || ''}"
domain: "${record['ドメイン管理'] || ''}"
repo: "${record['レポジトリURL'] || ''}"
analytics: "${record['アナリティクス'] || ''}"
search_console: "${record['Search Console プロパティ'] || ''}"
last_deployed: "${record['最終デプロイ日'] || ''}"
ownership: "${record['所有/共同'] || ''}"
collaborators: "${record['関係者'] || ''}"
notes: "${(record['備考'] || '').replace(/"/g, '\\"')}"
elements: [${elements.map(e => `"${e}"`).join(', ')}]
animations: [${animations.map(a => `"${a}"`).join(', ')}]
---

## 概要

${record['備考'] || `${title}の制作サイトです。`}

${record['公開URL'] ? `\n**URL:** [${record['公開URL']}](${record['公開URL']})\n` : ''}
${record['レポジトリURL'] ? `**リポジトリ:** [GitHub](${record['レポジトリURL']})\n` : ''}

## 技術スタック

${record['プラットフォーム/フレームワーク'] ? `- **プラットフォーム:** ${record['プラットフォーム/フレームワーク']}\n` : ''}
${record['ホスティング'] ? `- **ホスティング:** ${record['ホスティング']}\n` : ''}
${record['ドメイン管理'] ? `- **ドメイン:** ${record['ドメイン管理']}\n` : ''}

${elements.length > 0 ? `## サイト要素\n\n${elements.map(e => `- ${e}`).join('\n')}\n` : ''}
${animations.length > 0 ? `## アニメーション\n\n${animations.map(a => `- ${a}`).join('\n')}\n` : ''}

${record['アナリティクス'] ? `## アナリティクス\n\n${record['アナリティクス']}\n` : ''}
${record['最終デプロイ日'] ? `\n**最終デプロイ日:** ${record['最終デプロイ日']}\n` : ''}
`;

  const outputPath = path.join(outputDir, `${slug}.mdx`);
  fs.writeFileSync(outputPath, mdxContent, 'utf-8');
  count++;
  console.log(`✅ 生成: ${slug}.mdx`);
});

console.log(`\n🎉 ${count} 件のサイトを生成しました！`);
