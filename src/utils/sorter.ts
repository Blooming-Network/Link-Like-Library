import type { CollectionEntry } from "astro:content";

/**
 * メンバー情報のソート処理
 * 並び順を統一するため別関数に定義して利用する。
 * @param members メンバー情報
 * @returns 並び替え済メンバー情報
 */
export function sortMembers(members: CollectionEntry<"members">[]) {
  return members.sort((a, b) => {
    return a.data.order - b.data.order;
  });
}
