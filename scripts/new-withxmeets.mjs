/**
 * With×MEETS コンテンツファイル生成スクリプト
 *
 * 使い方:
 *   mise run new:withxmeets <YYYY-MM-DD>
 *
 * scripts/data/withxmeets.json から datetime が指定日付に一致する配信データを抽出し、
 * src/content/withxmeets/<YYYYMMDD>_<title>.md を生成する。
 */

import { Console } from "node:console";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { argv, exit, stdout, stderr } from "node:process";
import { fileURLToPath } from "node:url";

const console = new Console(stdout, stderr);

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// 引数チェック
const dateArg = argv[2];

if (!dateArg) {
  console.error("エラー: 日付を指定してください。");
  console.error("  使い方: mise run new:withxmeets <YYYY-MM-DD>");
  exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
  console.error(
    "エラー: 日付は YYYY-MM-DD 形式で指定してください。（例: 2023-12-07）",
  );
  exit(1);
}

// マスターデータ読み込み
const withMeetsData = JSON.parse(
  readFileSync(resolve(__dirname, "data/withxmeets.json"), "utf-8"),
);
const membersData = JSON.parse(
  readFileSync(resolve(__dirname, "data/members.json"), "utf-8"),
);

// メンバーID -> 名前 マッピング
const memberMap = Object.fromEntries(membersData.map((m) => [m.id, m.name]));

// 配信データ探索
const entries = withMeetsData.filter((e) => e.datetime.startsWith(dateArg));

if (entries.length === 0) {
  console.error(
    `エラー: ${dateArg} に対応するエントリが withxmeets.json に見つかりません。`,
  );
  exit(1);
}

// 出力ファイルパス生成
const fileDate = dateArg.replace(/-/g, ""); // YYYYMMDD

// 同日に複数エントリが存在する場合は datetime 昇順で処理
const sortedEntries = entries.sort((a, b) =>
  a.datetime.localeCompare(b.datetime),
);

const contentDir = resolve(ROOT, "src/content/withxmeets");

// テンプレート読み込み
const templatePath = resolve(__dirname, "templates/withxmeets.md");
const template = readFileSync(templatePath, "utf-8");

/**
 * タイトルをファイル名に使える形にする。
 * パス区切り・ファイル名に使えない文字を "_" に置換する。
 */
function sanitizeTitle(title) {
  return title
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
}

for (const entry of sortedEntries) {
  // ファイル名は YYYYMMDD_title.md（例: 20231207_梢先輩に「気品」を学ぼう！.md）
  const fileName = `${fileDate}_${sanitizeTitle(entry.title)}.md`;
  const outputPath = resolve(contentDir, fileName);

  if (!outputPath.startsWith(contentDir + "/")) {
    console.error(`エラー: 不正なファイルパスです: ${fileName}`);
    exit(1);
  }

  if (existsSync(outputPath)) {
    console.error(`エラー: ${outputPath} はすでに存在します。`);
    exit(1);
  }

  // メンバーリスト生成
  const memberNames = entry.member_ids.map((id) => {
    const name = memberMap[id];
    if (!name) {
      console.warn(`警告: メンバーID ${id} が members.json に見つかりません。`);
      return String(id);
    }
    return name;
  });

  // プレースホルダー置換
  const descriptionOneLine = entry.description.replace(/\n/g, " ").trim();
  const descriptionMultiline = entry.description.trim();
  const membersYaml = memberNames.map((name) => `\n  - "${name}"`).join("");
  const youtubeId = entry.youtube_id || "";

  const replacements = {
    "%TITLE%": entry.title,
    "%DESCRIPTION%": descriptionOneLine,
    "%DATE%": dateArg,
    "%MEMBERS%": membersYaml,
    "%YOUTUBE_ID%": youtubeId,
    "%DESCRIPTION_MULTILINE%": descriptionMultiline,
  };

  let output = template;
  for (const [placeholder, value] of Object.entries(replacements)) {
    output = output.replaceAll(placeholder, value);
  }

  if (!youtubeId) {
    output = output.replace(/^youtubeId: ""\n/m, "");
  }

  // ファイル出力
  writeFileSync(outputPath, output, "utf-8");
  console.log(`出力成功: src/content/withxmeets/${fileName} ${entry.title}`);
}
