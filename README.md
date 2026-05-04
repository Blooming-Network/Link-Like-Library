# link-like-library

Astro v6 ベースの静的サイトプロジェクト。

## 前提条件

[mise](https://mise.jdx.dev/) がインストールされていること。
Homebrewでのインストールであれば、以下のコマンドでインストールが可能

```bash
brew install mise
```

mise が Node.js と pnpm のバージョンを管理するため、個別にインストールする必要はない。

## 環境構築

```sh
git clone <repository-url>
cd link-like-library
mise trust
mise install
```

ディレクトリに入ったとき、以下のようなエラーメッセージが表示される可能性がある
`mise trust`を実行することで、miseの設定ファイルファイルの記載を信頼し、設定ファイルに沿って環境構築を行うことができるようになる

```bash
mise ERROR error parsing config file: ~/tmp/link-like-library/mise.toml
mise ERROR Config files in ~/tmp/link-like-library/mise.toml are not trusted.
Trust them with `mise trust`. See https://mise.en.dev/cli/trust.html for more information.
mise ERROR Run with --verbose or MISE_VERBOSE=1 for more information
```

`mise install` により以下が自動的にセットアップされる:

- Node.js 22.12.0
- pnpm 10.33.2
- npm パッケージのインストール（postinstall hook）

`mise run dev`で開発用サーバーが立ち上がるので、`http://localhost:4321`へアクセスできることを確認してください

## エディタ設定

### VSCode

`.vscode/settings.json` と `.vscode/extensions.json` がリポジトリに含まれている。プロジェクトを開くと推奨拡張機能のインストールが提案される。

推奨拡張機能:

- [Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

保存時に Prettier による自動フォーマットと ESLint の自動修正が実行される。

### Zed

`.zed/settings.json` がリポジトリに含まれているため、追加の設定は不要。

Zed の拡張機能から **Astro** をインストールすること。

保存時に Prettier による自動フォーマットと ESLint の自動修正が実行される。

## 開発コマンド

| 用途                 | mise                    | pnpm                           |
| :------------------- | :---------------------- | :----------------------------- |
| 開発サーバー起動     | `mise run dev`          | `pnpm astro dev`               |
| ビルド               | `mise run build`        | `pnpm astro build`             |
| ビルドプレビュー     | `mise run preview`      | `pnpm astro preview`           |
| 型チェック           | `mise run typecheck`    | `pnpm astro check`             |
| リント               | `mise run lint`         | `pnpm exec eslint .`           |
| リント（自動修正）   | `mise run lint:fix`     | `pnpm exec eslint . --fix`     |
| フォーマット         | `mise run format`       | `pnpm exec prettier --write .` |
| フォーマットチェック | `mise run format:check` | `pnpm exec prettier --check .` |

## プロジェクト構成

```
link-like-library/
├── public/            # 静的アセット
├── src/
│   ├── assets/        # 画像などのアセット
│   ├── components/    # Astroコンポーネント
│   ├── layouts/       # レイアウトコンポーネント
│   ├── pages/         # ページ（ファイルベースルーティング）
│   └── styles/        # グローバルCSS
├── .vscode/           # VSCode設定
├── .zed/              # Zed設定
├── astro.config.mjs   # Astro設定
├── eslint.config.mjs  # ESLint設定
├── mise.toml          # mise設定（ツールバージョン & タスク）
├── .prettierrc        # Prettier設定
├── tsconfig.json      # TypeScript設定
└── package.json       # パッケージ定義
```
