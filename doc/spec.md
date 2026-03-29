# GitHub Repository File Picker - 仕様書

## 概要

GitHubのパブリックリポジトリのファイルツリーをブラウズし、
選択したファイルのGitHub blob URLを`!reading_vimrc next`コマンド形式でクリップボードにコピーするAndroidアプリです。

## 技術スタック

| 項目             | 選択                                      |
| ---------------- | ----------------------------------------- |
| フレームワーク   | React Native (Expo)                       |
| 言語             | TypeScript                                |
| ルーティング     | Expo Router                               |
| HTTPクライアント | fetch (Expo標準)                          |
| クリップボード   | expo-clipboard                            |
| 状態管理         | React組み込み (`useState` / `useReducer`) |

## セットアップ

以下のコマンドでプロジェクトを初期化してください。

```bash
npx create-expo-app@latest github-file-picker --template blank-typescript
cd github-file-picker
npx expo install expo-clipboard
```

## 画面構成

アプリは2つの画面で構成されます。

### 1. リポジトリ入力画面 (`/`)

ユーザーがGitHubリポジトリのURLを入力する画面です。

**UIコンポーネント:**

- テキスト入力フィールド: GitHubリポジトリURL（例: `https://github.com/owner/repo`）
- 送信ボタン: ツリー取得を開始する

**バリデーション:**

入力値が`https://github.com/{owner}/{repo}`の形式に一致するかを検証してください。一致しない場合はエラーメッセージを表示し、画面遷移を行わないでください。

**処理フロー:**

1. URLをパースして`owner`と`repo`を抽出する
2. ツリー表示画面に`owner`と`repo`をパラメータとして渡して遷移する

### 2. ファイルツリー画面 (`/tree`)

ファイルツリーの表示とファイル選択を行う画面です。

**画面パラメータ:**

- `owner`: リポジトリオーナー名
- `repo`: リポジトリ名

**UIコンポーネント:**

- ファイルツリー: 後述の仕様に従う
- コピーボタン: 1つ以上のファイルが選択されている場合のみ活性化する。押下時にクリップボードへの書き込みを行い、完了後にトースト通知を表示する

## GitHub API 仕様

### デフォルトブランチの取得

```text
GET https://api.github.com/repos/{owner}/{repo}
```

レスポンスの`default_branch`フィールドを使用してください。

### ファイルツリーの取得

```text
GET https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1
```

レスポンス例:

```json
{
  "tree": [
    { "path": "src/main.ts", "type": "blob", "sha": "..." },
    { "path": "src/utils", "type": "tree", "sha": "..." }
  ],
  "truncated": false
}
```

`type`が`"blob"`のものがファイル、`"tree"`のものがディレクトリです。`truncated`フィールドは考慮不要です。

### エラーハンドリング

- APIリクエストが失敗した場合（ネットワークエラー、404など）は、画面にエラーメッセージを表示してください
- ローディング中はインジケータを表示してください

## ファイルツリーの仕様

### データ構造

APIから取得したフラットなパス一覧を、アプリ内でツリー構造に変換して管理してください。

```typescript
type NodeType = "file" | "directory";

interface TreeNode {
  name: string;        // ノード名（パスの末尾セグメント）
  path: string;        // リポジトリルートからの相対パス
  type: NodeType;
  children: TreeNode[]; // typeが"directory"の場合のみ使用
}
```

### 表示

ツリーはインデントによって階層を表現してください。各ノードには以下の要素を表示します。

- ディレクトリ: 折りたたみ/展開の切り替えアイコン、ディレクトリ名、チェックボックス
- ファイル: ファイル名、チェックボックス

初期状態では、すべてのディレクトリを折りたたんだ状態で表示してください。

### チェックボックスの動作

チェックボックスは3状態を持ちます。

| 状態     | 説明                                             |
| -------- | ------------------------------------------------ |
| 未選択   | 子孫にチェック済みファイルがない                 |
| 選択済み | 直接選択、または子孫のすべてのファイルが選択済み |
| 部分選択 | 子孫の一部のファイルが選択済み                   |

**選択ルール:**

- ディレクトリのチェックボックスをONにすると、配下のすべてのファイル（孫以下も含む）が選択状態になります
- ディレクトリのチェックボックスをOFFにすると、配下のすべてのファイルが未選択状態になります
- 子ファイルの選択状態が変化した場合、親ディレクトリのチェックボックス状態を自動的に再計算してください

**状態の管理:**

選択状態はファイルのパス（`string`）のSetとして管理することを推奨します。ディレクトリの部分選択状態は、このSetから派生して計算してください。

```typescript
const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
```

### 折りたたみの動作

- ディレクトリの名前部分（チェックボックス以外の領域）をタップすると、折りたたみ/展開を切り替えます
- 折りたたんでいる間も、配下のファイルの選択状態は保持されます

## コピー出力の仕様

### フォーマット

```text
!reading_vimrc next {url1} {url2} ...
```

各URLの形式は以下の通りです。

```text
https://github.com/{owner}/{repo}/blob/{branch}/{path}
```

複数のファイルはスペース区切りで1行に並べます。URLの並び順はファイルツリーの表示順（ツリーの深さ優先順）に従ってください。

### 出力例

```text
!reading_vimrc next https://github.com/hydeik/dotfiles/blob/main/dots/config/nvim/init.lua https://github.com/hydeik/dotfiles/blob/main/dots/config/nvim/options.lua
```

## ディレクトリ構成

```text
github-file-picker/
├── app/
│   ├── _layout.tsx       # ルートレイアウト
│   ├── index.tsx         # リポジトリ入力画面
│   └── tree.tsx          # ファイルツリー画面
├── components/
│   ├── TreeNode.tsx      # ツリーノードの再帰コンポーネント
│   └── FileTree.tsx      # ツリー全体のコンポーネント
├── hooks/
│   └── useGitHubTree.ts  # GitHub API取得ロジック
├── utils/
│   ├── buildTree.ts      # フラットパス → TreeNode変換
│   └── buildCommand.ts   # 選択パス → コマンド文字列変換
└── types/
    └── index.ts          # 共通型定義
```

## 非機能要件

- **対象OS**: Android（iOSは対象外）
- **プライベートリポジトリ**: 対応不要
- **ブランチ選択**: 対応不要（デフォルトブランチのみ）
- **ファイルフィルタリング**: 対応不要（すべてのファイルを表示）
- **truncatedレスポンスへの対応**: 対応不要
