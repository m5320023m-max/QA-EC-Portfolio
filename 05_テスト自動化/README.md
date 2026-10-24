# Selenium ECサイト E2Eテスト
## テスト対象
簡易ECサイトを対象に、商品一覧から商品詳細、カート画面までの主要なE2EフローをSeleniumで自動テストする。
商品A・Bのどちらも共通のテストコードで検証でき、以下の内容を確認する。
- 商品一覧と詳細画面の商品情報の一致
- 商品数量の増加
- カート内の商品名・数量・単価・合計金額の整合性
- カート画面への正常な遷移

主要E2Eでは7ケースを自動実行する。
数量の最小値を確認するTC-004は、主要E2Eとは目的が異なる境界値テストのため、現在の実行対象から除外している。
なお、注文確定処理は今回の自動化対象に含めていない。

## ファイル構成と役割
| ファイル | 役割 |
|---|---|
| `main.js` | Seleniumテストの実行順序とデータの受け渡し |
| `testFunctions.js` | 各テストケースの操作・検証 |
| `utils.js` | テストケースの検索などの共通処理 |
| `locators.js` | Seleniumで使用するLocatorの管理 |
| `testCases.json` | テストケースID・確認内容・期待値の定義 |
| `site/index.html` | 商品一覧画面 |
| `site/index.js` | 商品一覧の動的生成 |
| `site/productlist.js` | 商品A・Bのデータ管理 |
| `site/product.html` | 商品詳細画面 |
| `site/script.js` | 商品詳細画面の数量操作など |
| `site/cart.html` | カート画面 |

テストの実行順序は `main.js` で管理し、各テストの操作・検証処理を `testFunctions.js` に分離している。
テストケースの設定は `testCases.json` で管理し、IDを使って取得することで、JSON内の並び順に依存しない構造にしている。

## 保守性改善の取り組み
7か月目では、テスト対象やテストケースの追加・変更による影響を抑えるため、Seleniumコードの構造を見直した。

### 主な改善内容
- **商品データの一元管理**
- **Locatorの整理**
- **共通処理の整理**
- **テストケースIDの管理改善**
- **テストケース間の依存関係の見直し**

### 改善後の確認結果
- 商品A・Bで共通のSeleniumテストを実行できることを確認
- `testCases.json` の並び順を変更しても正常に動作
- ローカル環境で主要E2Eの7ケースがすべてPASS
- GitHub Actionsでも主要E2Eの7ケースがすべてPASS

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
