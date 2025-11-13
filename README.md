# ZettAI Prompt Factory

あなた専用のプロンプト工房 - サイト要素・アニメーション・機能を一元管理

## 概要

これまで作ってきた **サイト要素・アニメーション・機能** と、実装時に使う **プロンプト** を、1か所で検索・再利用できる「自分専用プロンプト工房」です。

## 主な機能

- 🧩 **Modules**: UI/機能モジュール（実装部品）をプロンプト付きで管理
- 💡 **Tips**: 開発中に得た知見やベストプラクティスを蓄積
- 🌐 **Sites**: 制作サイトの詳細情報を一元管理
- 🔍 **検索**: Fuse.js による高速な曖昧検索
- 📋 **プロンプトコピー**: ワンクリックでプロンプトをコピー
- 📊 **CSV インポート**: 過去のサイト情報を一括登録

## クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:4321` を開く

### 3. CSVからサイト情報をインポート（オプション）

```bash
npm run import:csv
```

`data/website_inventory.csv` に過去サイト一覧を記載しておくと、自動的にサイトページが生成されます。

## ディレクトリ構成

```
.
├── public/              # 静的ファイル
│   ├── favicon.svg
│   └── robots.txt
├── data/                # データファイル
│   └── website_inventory.csv
├── scripts/             # ビルドスクリプト
│   ├── build-index.mjs      # 検索インデックス生成
│   └── csv-to-mdx.mjs       # CSV → MDX 変換
├── src/
│   ├── content/         # コンテンツ（MDX）
│   │   ├── config.ts
│   │   ├── modules/     # UI/機能モジュール
│   │   ├── tips/        # 知見・ベストプラクティス
│   │   └── sites/       # 制作サイト
│   ├── components/      # コンポーネント
│   │   ├── PromptCopy.astro
│   │   └── Search.astro
│   ├── layouts/         # レイアウト
│   │   └── Base.astro
│   ├── pages/           # ページ
│   │   ├── index.astro
│   │   ├── modules/
│   │   ├── tips/
│   │   └── sites/
│   └── styles/          # スタイル
│       └── global.css
├── package.json
├── astro.config.mjs
└── tsconfig.json
```

## コンテンツの追加方法

### Modules（UI/機能モジュール）

`src/content/modules/` に MDX ファイルを作成:

```mdx
---
title: ハンバーガーメニュー
description: モバイル/狭い幅でのナビゲーション展開
tags: [navigation, menu, accessibility]
frameworks: [Next.js, Tailwind]
level: basic
prompt_template: |
  次の要件でハンバーガーメニューを実装してください。
  - フレームワーク: Next.js + Tailwind
  - アクセシビリティ対応
---

## 実装方法

...
```

### Tips（知見・ベストプラクティス）

`src/content/tips/` に MDX ファイルを作成:

```mdx
---
title: スクロールリビールの設計指針
description: IntersectionObserver でパフォーマンスを落とさずに演出
tags: [animation, performance]
---

## 要点

...
```

### Sites（制作サイト）

**方法1: CSVから自動生成**

`data/website_inventory.csv` にサイト情報を記載して:

```bash
npm run import:csv
```

**方法2: 手動で作成**

`src/content/sites/` に MDX ファイルを作成:

```mdx
---
title: Portfolio 2023
description: 2023年版ポートフォリオ
tags: [portfolio, nextjs]
status: 稼働中
url: "https://example.com"
platform: "Next.js 13"
hosting: "Vercel"
elements: ["ハンバーガーメニュー", "Smooth Scroll"]
animations: ["Fade in", "Parallax"]
---

## 概要

...
```

## 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:4321） |
| `npm run build` | 本番ビルド（検索インデックス生成 + Astro ビルド） |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run import:csv` | CSV から Sites ページを生成 |

## デプロイ

### Vercel

```bash
# ビルドコマンド
npm run build

# 出力ディレクトリ
dist/
```

### Netlify / Cloudflare Pages

同様に、ビルドコマンド `npm run build`、出力ディレクトリ `dist/` を設定。

## 技術スタック

- **Astro**: 静的サイト生成
- **MDX**: Markdown + JSX
- **Fuse.js**: 曖昧検索
- **TypeScript**: 型安全性

## サンプルコンテンツ

このプロジェクトには以下のサンプルコンテンツが含まれています:

### Modules
- ハンバーガーメニュー（ZettAI式）
- スクロールリビール
- パララックススクロール

### Tips
- スクロールリビールの設計指針
- アニメーションパフォーマンスの基本

### Sites
- Portfolio 2023（CSV から自動生成）

## カスタマイズ

### スタイルの変更

`src/styles/global.css` でカラーやスペーシングを調整:

```css
:root {
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --spacing-md: 1rem;
  /* ... */
}
```

### 検索設定

`src/components/Search.astro` で Fuse.js のオプションを変更:

```javascript
fuse = new Fuse(allItems, {
  keys: ['title', 'description', 'tags'],
  threshold: 0.3,  // 検索の厳密度（0-1）
});
```

## トラブルシューティング

### 検索が動作しない

検索インデックスが生成されていない可能性があります:

```bash
npm run build:index
```

### CSV インポートが失敗する

- CSV ファイルのエンコーディングが UTF-8 であることを確認
- ヘッダー行がPLAN.mdの仕様と一致していることを確認

## ライセンス

このプロジェクトは自由に使用・改変できます。

## 参考

詳細な仕様は `PLAN.md` を参照してください。

---

Made with Astro 🚀
