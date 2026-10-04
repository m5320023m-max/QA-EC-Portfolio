# Selenium ECサイト E2Eテスト
## テスト対象
簡易ECサイトを対象に、商品一覧・商品詳細・カート画面の表示や動作をSeleniumで確認する。

## 自動化理由
繰り返し実施する主要なE2E確認を自動化し、実行負荷の軽減と確認漏れの防止を目的とする。
また、GitHub Actionsを利用してPush時に自動実行できるようにする。

## ローカル実行方法
1. 依存関係をインストールする
```bash
npm install
```

2. `site` フォルダをローカルサーバーで起動する

3. Seleniumテストを実行する

```bash
npm test
```

## CI実行方法
GitHubへPushすると、GitHub Actionsが自動で起動する。

```bash
git push
```

GitHub Actions上で以下を自動実行する。
- Ubuntu環境を準備
- リポジトリを取得
- Node.jsを準備
- 依存関係をインストール
- ECサイトを起動
- npm test でSeleniumを実行

## エビデンス確認方法
テスト実行時のログとスクリーンショットは `selenium-results` フォルダに保存する。
GitHub Actions実行時は、実行結果画面の `Artifacts` から
`selenium-test-evidence` をダウンロードして確認できる。
PASS / FAILどちらの場合もエビデンスを保存する。
