
# ECサイト テスト自動化（Selenium / API / GitHub Actions）
## 1. 概要・目的
簡易ECサイトを題材に、SeleniumによるE2EテストとNode.jsによるAPIテストを実装し、GitHub Actionsで自動実行する。
テスト自動化による実行負荷の軽減と確認漏れの防止に加え、HTTP通信、フロントエンドとバックエンドの役割、変更時の影響範囲を理解することを目的とする。

主な取り組みは以下のとおり。
- SeleniumによるECサイトのE2Eテスト
- テストコードの共通化・保守性改善
- Node.jsによるAPIサーバーの実装
- APIの正常系・異常系テスト
- 画面表示とAPI通信の関係の理解
- GitHub Actionsによるテストの自動実行
- ログ・スクリーンショットによるエビデンス管理

## 2. テスト対象
商品一覧画面から商品詳細画面、カート画面までの主要な操作をテスト対象とする。

### E2Eテストで確認する内容
- 商品一覧に商品A・Bが表示されること
- 商品一覧と商品詳細の商品情報が一致すること
- 商品詳細画面への遷移が正常に行われること
- 商品数量の増加と保存が正しく行われること
- カート画面に商品名・数量・単価が引き継がれること
- カートの合計金額が正しいこと
- URLパラメータやlocalStorageを使用した処理が期待どおり動作すること

主要E2Eでは**7ケース**を自動実行する。

**TC-004**は、数量の最小値を確認する境界値テストとして設計記録に残しているが、主要E2Eの実行対象からは除外している。
なお、注文確定処理は今回の自動化対象に含めていない。

## 3. システム構成
### フロントエンド
HTMLとJavaScriptを使用した簡易ECサイト。
- 商品一覧画面
- 商品詳細画面
- 数量変更
- カート画面
- localStorageによるカート情報の保持

### バックエンド
Node.js標準のHTTPモジュールを使用したAPIサーバー。
商品情報の取得と、商品ID・数量を指定した金額計算を行う。

### 通信構成
```text
ブラウザ（Chrome）
    │
    ├── ECサイト（ポート5500）
    │     ├── HTML
    │     └── JavaScript
    │
    └── APIサーバー（ポート3000）
          ├── 商品一覧の取得
          ├── 商品詳細の取得
          └── 金額計算
```

商品一覧・商品詳細の情報はAPIから取得する。
一方、現在の数量変更やカート内の合計金額計算は、ブラウザ側のJavaScriptとlocalStorageで処理している。

## 4. APIの実装
| Method | エンドポイント | 処理 |
|---|---|---|
| GET | `/api/products` | 商品一覧を取得 |
| GET | `/api/products/:id` | 指定した商品の情報を取得 |
| POST | `/api/calculate` | 商品IDと数量から合計金額を計算 |

### 正常レスポンスの例
`POST /api/calculate`

リクエストBody：
```json
{
  "productId": "A",
  "quantity": 3
}
```

レスポンスBody：
```json
{
  "productId": "A",
  "quantity": 3,
  "unitPrice": 1000,
  "total": 3000
}
```

Status Code：`200 OK`

### 異常レスポンスの例
存在しない商品Cを指定した場合：
- Status Code：`404 Not Found`
- Response Body：`Not Found`

※ 現在、`POST /api/calculate`は画面操作から呼び出していない。APIテストから直接実行している。

## 5. ファイル構成と役割
プロジェクトは`Selenium-EC-site/`を基準とする。
| ファイル | 役割 |
|---|---|
| `site/index.html` | 商品一覧画面 |
| `site/index.js` | APIから商品一覧を取得して表示 |
| `site/product.html` | 商品詳細画面 |
| `site/script.js` | 商品詳細の取得・数量操作・localStorage管理 |
| `site/cart.html` | カート画面 |
| `server/apiServer.js` | APIサーバーの実装 |
| `server/productlist.js` | 商品A・Bのマスタデータ |
| `tests/api/apiTest.js` | APIの正常系・異常系テスト |
| `tests/e2e/main.js` | Seleniumテストの実行順序とデータの受け渡し |
| `tests/e2e/testFunctions.js` | 各テストケースの操作・検証 |
| `tests/e2e/utils.js` | テストケース検索などの共通処理 |
| `tests/e2e/results.js` | ログ・スクリーンショットの保存処理 |
| `tests/e2e/locators.js` | SeleniumのLocator管理 |
| `tests/e2e/testCases.json` | テストケースID・確認内容・期待値の定義 |
| `config.js` | E2Eテストのアクセス先URLを管理 |
| `package.json` | npmの依存関係・実行コマンドを管理 |
| `selenium-results/` | テスト実行ログ・スクリーンショットの保存先 |

GitHub Actionsのワークフローは、リポジトリ直下の`.github/workflows/selenium.yml`に配置している。

## 6. 保守性改善の取り組み
テスト対象やテストケースの追加・変更による影響を抑えるため、Seleniumコードの構造を見直した。

### 主な改善内容
- **商品データの一元管理**：商品A・Bのデータを共通管理する
- **Locatorの整理**：画面要素の指定方法を管理する
- **共通処理の整理**：繰り返し使用する処理を関数化する
- **テストケースIDの管理改善**：JSON内の並び順に依存せず、IDからテストケースを取得する
- **テストケース間の依存関係の見直し**：不要な依存を減らし、データの受け渡しを明確にする

### 改善後の確認結果
- 商品A・Bで共通のSeleniumテストを実行できることを確認
- `testCases.json`の並び順を変更しても正常に動作することを確認
- ローカル環境で主要E2Eテスト7件がPASS
- GitHub Actionsでも主要E2Eテスト7件がPASS

フロントエンド・バックエンド・テストコードをそれぞれ`site/`、`server/`、`tests/`に整理した。
## 7. APIテストの実装
Node.jsの`fetch`と`assert`を利用し、APIテストを5件作成した。

### 正常系：3件
| テスト | 確認内容 |
|---|---|
| GET 商品A | 200、商品名・価格が一致 |
| GET 商品B | 200、商品名・価格が一致 |
| POST 商品A・数量3 | 200、合計金額3000円が一致 |

### 異常系：2件
| テスト | 確認内容 |
|---|---|
| GET 存在しない商品C | 404、Not Foundが返る |
| POST 存在しない商品C | 404、Not Foundが返る |

異常系のテストでは、エラーレスポンスが仕様どおり返ればテスト結果をPASSと判定する。
APIがエラーを返すことと、テストがFAILになることは別である。

## 8. 画面操作とAPI通信の関係
### 商品一覧の表示

```text
① ブラウザで商品一覧画面を開く
          ↓
② index.html / index.jsを読み込む
          ↓
③ GET /api/productsを送信
          ↓
④ APIサーバーが商品情報を取得
          ↓
⑤ JSON形式でレスポンスを返す
          ↓
⑥ JavaScriptが商品名・価格を画面に表示
```

### 商品詳細の表示

```text
① 商品Bの詳細画面へ移動
          ↓
② URLパラメータから商品ID「B」を取得
          ↓
③ GET /api/products/Bを送信
          ↓
④ APIサーバーが商品Bの情報を返す
          ↓
⑤ 商品名・価格を表示
          ↓
⑥ 取得した情報をlocalStorageに保存
```

### 数量変更とカート表示
数量変更はブラウザ側のJavaScriptで行う。
変更した数量はlocalStorageに保存され、カート画面で利用される。

```text
① 数量変更ボタンをクリック
          ↓
② JavaScriptが数量を変更
          ↓
③ localStorageに保存
          ↓
④ カート画面へ遷移
          ↓
⑤ localStorageから情報を取得
          ↓
⑥ JavaScriptが合計金額を計算・表示
```

この処理では、数量変更のたびにAPI通信が発生するわけではない。

**UI操作とHTTP通信は必ずしも1対1ではなく、どの処理をフロントエンド・バックエンドのどちらが担当するかは設計によって異なる。**
## 9. ローカル実行方法
以下のコマンドは`Selenium-EC-site/`フォルダで実行する。

### ① 依存関係をインストール
```bash
npm install
```

### ② APIサーバーを起動
```bash
node server/apiServer.js
```

APIサーバーはポート3000で起動する。

### ③ ECサイトを起動
別のターミナルで、`site`フォルダをポート5500のドキュメントルートとして起動する。

Pythonが利用できる場合：

```bash
python -m http.server 5500 --directory site
```

または、VS CodeのLive Serverを利用する。

商品一覧画面のURL：

`http://127.0.0.1:5500/index.html`

### ④ APIテストを実行
別のターミナルで実行する。

```bash
node tests/api/apiTest.js
```

期待結果：5件すべてPASS

### ⑤ Selenium E2Eテストを実行
APIサーバーとECサイトを起動した状態で実行する。

```bash
npm test
```

`npm test`は、`tests/e2e/main.js`を実行する。

期待結果：7件すべてPASS

## 10. GitHub ActionsによるCI実行
GitHubの`main`ブランチへPushすると、GitHub Actionsのワークフローが自動実行される。
手動実行にも対応している。

### 自動実行の流れ
1. Ubuntu環境でリポジトリを取得
2. Node.js 24を準備
3. 日本語フォント（`fonts-noto-cjk`）をインストール
4. `npm ci`で依存関係をインストール
5. ECサイトを起動
6. APIサーバーを起動
7. HTTP通信によって両サーバーの起動完了を確認
8. APIテスト5件を実行
9. Selenium E2Eテスト7件を実行
10. テストエビデンスをArtifactに保存

### CI実行結果
| テスト | 実行件数 | 結果 |
|---|---:|---|
| APIテスト | 5件 | PASS |
| Selenium E2Eテスト | 7件 | PASS |
| **合計** | **12件** | **全件PASS** |

ローカル環境だけでなく、GitHub ActionsのUbuntu環境でもテストを実行できることを確認した。

## 11. エビデンス確認方法
Seleniumテストのログとスクリーンショットは、`selenium-results/`フォルダに保存する。
GitHub Actionsでは`Upload test evidence`を実行し、ワークフローの実行結果画面にある`Artifacts`から`selenium-test-evidence`をダウンロードできる。

