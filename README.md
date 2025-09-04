# COVID-19 Dashboard

COVID-19感染者データを可視化するダッシュボードアプリケーションです。  
Vite + Reactで構築され、Claude Codeの練習プロジェクトとして作成されています。

## 機能

- COVID-19感染者データの可視化
    - インタラクティブな日付スライダー
    - KPI（主要指標）カードの表示（新規感染者数、累積感染者数、累積死亡者数）
    - 新規感染者数の推移グラフ
    - 都道府県別感染者数のヒートマップ
    - 都道府県別ランキング

## 技術スタック

- React 19.1.1
- Vite 7.1.2
- D3.js (データ可視化・地図描画)
- Recharts (データ可視化)
- D3-DSV (CSVデータ処理)
- date-fns (日付処理)

## セットアップ

### 前提条件
- Node.js (推奨: 18以上)
- npm または yarn

### インストール
```bash
# リポジトリをクローン
git clone <repository-url>

# ディレクトリに移動
cd covid-19_dashboard

# 依存関係をインストール
npm install
```

### 開発サーバーの起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### リント
```bash
npm run lint
```

### プレビュー
```bash
npm run preview
```

## データソース

COVID-19に関する公開データを使用しています。

### 使用ファイル
- `newly_confirmed_cases_daily.csv` - 日次新規感染者数（全国・都道府県別）
- `confirmed_cases_cumulative_daily.csv` - 日次累積感染者数
- `deaths_cumulative_daily.csv` - 日次累積死亡者数
- `japan.geojson` - 日本地図データ

## ディレクトリ構造

```
src/
├── components/
│   ├── layout/
│   │   └── Dashboard.jsx        # メインダッシュボード
│   ├── ui/
│   │   ├── DateSlider.jsx      # 日付スライダー
│   │   └── KPICard.jsx         # KPIカード
│   └── charts/
│       ├── InfectionTrendChart.jsx    # 感染者推移チャート
│       ├── JapanMapFixed.jsx          # 日本地図ヒートマップ
│       └── PrefectureRanking.jsx      # 都道府県ランキング
├── hooks/
│   └── useCovidData.js         # データフック
├── utils/
│   └── dataParser.js           # データ処理ユーティリティ
└── styles.css                  # スタイルシート
```
