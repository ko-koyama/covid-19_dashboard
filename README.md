# COVID-19 Dashboard

神奈川県のCOVID-19感染者データを可視化するダッシュボードアプリケーションです。  
Vite + Reactで構築され、Claude Codeの練習プロジェクトとして作成されています。

## 機能

- 神奈川県のCOVID-19感染者データの可視化
    - インタラクティブな日付スライダー
    - KPI（主要指標）カードの表示
    - 感染者数の推移
    - 年代別の感染者数

## 技術スタック

- React 19.1.1
- Vite 7.1.2
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

神奈川県が公開するCOVID-19オープンデータを使用しています。
