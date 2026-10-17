import type { CollectionEntry } from "astro:content";

type MemberName = CollectionEntry<"members">["data"]["name"];

/** メンバー名とメンバーカラーCSS変数（src/styles/tokens.css）の対応 */
const memberColorVars: Record<MemberName, string> = {
  日野下花帆: "var(--c-member-kaho)",
  村野さやか: "var(--c-member-sayaka)",
  乙宗梢: "var(--c-member-kozue)",
  夕霧綴理: "var(--c-member-tsuzuri)",
  大沢瑠璃乃: "var(--c-member-rurino)",
  藤島慈: "var(--c-member-megumi)",
  百生吟子: "var(--c-member-ginko)",
  徒町小鈴: "var(--c-member-kosuzu)",
  安養寺姫芽: "var(--c-member-hime)",
  セラス柳田リリエンフェルト: "var(--c-member-ceras)",
  桂城泉: "var(--c-member-izumi)",
};

/**
 * メンバーカラーのCSS変数参照を返す
 * @param name メンバー名
 * @returns `var(--c-member-*)` 形式の文字列
 */
export function getMemberColor(name: MemberName): string {
  return memberColorVars[name];
}
