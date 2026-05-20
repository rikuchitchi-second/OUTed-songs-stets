# 週間ランキング

Google スプレッドシートを「データベース」として、GitHub Pages でランキングサイトを公開するための静的サイトです。

---

## 📋 スプレッドシートの作り方

### 全体構成
**1つのスプレッドシートファイル**に **3枚のシート**を作ります。

```
スプレッドシート名: ボカロランキングデータ（任意）
├── シート1: ranking    （メインランキング）
├── シート2: untracked  （未統計化曲）
└── シート3: requests   （依頼枠）
```

---

### シート1: ranking（メインランキング）

**1行目にこの通りの列名を入力してください（英語・小文字）**

| 列名 | 内容 | 例 |
|------|------|----|
| `year` | 年（4桁） | 2025 |
| `month` | 月（数字） | 8 |
| `week` | 週番号（数字） | 1 |
| `rank` | 順位 | 1 |
| `previousRank` | 前週の順位（初登場は空白） | 3 |
| `title` | 曲名 | バゥムクゥヘン・エンドロゥル |
| `artist` | アーティスト名 | 雨良 |
| `videoId` | YouTube動画ID | dQw4w9WgXcQ |
| `views` | 累計再生数 | 7263664 |
| `viewsIncrease` | 週間増加数 | 1799615 |
| `isNew` | 初登場なら TRUE、それ以外は FALSE | TRUE |

**記入例（2行目以降）:**
```
year,month,week,rank,previousRank,title,artist,videoId,views,viewsIncrease,isNew
2025,8,1,1,2,バゥムクゥヘン・エンドロゥル,雨良,dQw4w9WgXcQ,7263664,1799615,FALSE
2025,8,1,2,,スポットレイト feat. 歌愛ユキ,稲葉曇,XXXXXXXXXXX,759487,759487,TRUE
```

> **videoId の調べ方**  
> `https://www.youtube.com/watch?v=dQw4w9WgXcQ` の `dQw4w9WgXcQ` の部分

---

### シート2: untracked（未統計化曲）

**1行目に以下の列名を入力**

| 列名 | 内容 | 例 |
|------|------|----|
| `year` | 年 | 2025 |
| `month` | 月 | 8 |
| `week` | 週 | 1 |
| `title` | 曲名 | 〇〇 feat. 初音ミク |
| `artist` | アーティスト名 | △△ |
| `videoId` | YouTube動画ID（任意） | XXXXXXXXXXX |
| `note` | 備考（任意）例: メンバー限定 | メンバー限定公開 |

---

### シート3: requests（依頼枠）

**1行目に以下の列名を入力**

| 列名 | 内容 | 例 |
|------|------|----|
| `year` | 年 | 2025 |
| `month` | 月 | 8 |
| `week` | 週 | 1 |
| `title` | 曲名 | ◯◯ |
| `artist` | アーティスト名 | △△ |
| `videoId` | YouTube動画ID（任意） | XXXXXXXXXXX |
| `requester` | 依頼者名（任意） | ニックネーム |
| `note` | 備考（任意） | |

---

## 🔗 スプレッドシートをサイトに接続する

### ステップ1: ウェブに公開する

**各シートを個別に公開する必要があります。**

1. スプレッドシートを開く
2. メニュー「ファイル」→「共有」→「ウェブに公開」
3. 「リンク」タブを選択
4. 「シート」を **「ranking」シート** に変更
5. 形式を **「カンマ区切りの値（.csv）」** に変更
6. 「公開」ボタンをクリック
7. 表示された URL をコピー（例: `https://docs.google.com/spreadsheets/d/XXXXX/pub?gid=0&output=csv`）

**同じ手順を untracked シート、requests シートでも繰り返します。**

> 各シートの `gid=` の数字が異なることを確認してください。

---

### ステップ2: js/app.js の CONFIG を書き換える

`js/app.js` の先頭にある `CONFIG.SHEET_URLS` を編集します：

```javascript
const CONFIG = {
  SHEET_URLS: {
    ranking:   'ここにrankingシートのURL',
    untracked: 'ここにuntrackedシートのURL',
    requests:  'ここにrequestsシートのURL',
  },
  // ...
};
```

---

## 🚀 GitHub Pages への公開手順

1. [GitHub](https://github.com) で新しいリポジトリを作成（Public）
2. 以下のファイルをすべてアップロード:
   - `index.html`
   - `css/style.css`
   - `js/app.js`
3. リポジトリの「Settings」→「Pages」→ Branch を `main` に設定して「Save」
4. 数分後、`https://ユーザー名.github.io/リポジトリ名/` で公開

---

## ⚠️ CORS について

Google スプレッドシートの「ウェブに公開」CSV は、`fetch()` でそのまま取得できます（CORS対応済み）。  
ただし「ウェブに公開」していない通常の共有URLでは取得できません。必ず「ウェブに公開」のURLを使用してください。

---

## 🗂 ファイル構成

```
vocaloid-ranking/
├── index.html     # メインページ
├── css/style.css  # デザイン
├── js/app.js      # ロジック（CONFIG を編集）
└── README.md      # このファイル
```

---

## 🛠 表示のカスタマイズ

| 変更したい内容 | 変更する場所 |
|--------------|------------|
| 100万/50万/30万の閾値 | `js/app.js` の `CONFIG.THRESHOLDS` |
| サイトタイトル | `index.html` の `<h1>` |
| カラーテーマ | `css/style.css` の `:root` 変数 |
