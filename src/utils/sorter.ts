/**
 * メンバー情報のソート処理
 * 並び順を統一するため別関数に定義して利用する。
 * @param members メンバー情報
 * @returns 並び替え済メンバー情報
 */
export function sortMembers (members: any[]) {
  return members.sort((a, b) => {
    // 学年で並び替える
    // const generationDiff = a.data.generation.localeCompare(
    //   b.data.generation,
    //   "ja",
    // );
    // if (generationDiff !== 0) return generationDiff;
    // return a.data.name.localeCompare(b.data.name, "ja");

    // 学年順でなく任意に順番を指定したい場合は、orderで指定する
    return a.data.order - b.data.order;
  });
}
