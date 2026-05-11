---
title: "活動記録サンプル"
description: "活動記録ページのMarkdownレンダリング確認用サンプル記事です。"
date: 2026-05-04
---

## 見出し

### 第3レベル見出し

#### 第4レベル見出し

## 段落とインライン要素

これは通常の段落です。Markdownでは空行で段落を区切ります。

**太字のテキスト**、_斜体のテキスト_、~~取り消し線~~、そして`インラインコード`を組み合わせることができます。[リンクの例](https://astro.build)もインライン要素です。

## リスト

### 順序なしリスト

- 項目 A
- 項目 B
  - ネストされた項目 B-1
  - ネストされた項目 B-2
- 項目 C

### 順序付きリスト

1. 最初の手順
2. 次の手順
3. 最後の手順

## 引用

> これは引用ブロックです。
> 複数行にわたる引用も可能です。
>
> 段落を分けることもできます。

## コードブロック

```typescript
interface Activity {
  title: string;
  description: string;
  date: Date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
```

```css
.article-body {
  color: var(--c-text-primary);
}
```

## テーブル

| 技術         | 用途           | バージョン |
| ------------ | -------------- | ---------- |
| Astro        | フレームワーク | 6.x        |
| Tailwind CSS | スタイリング   | 4.x        |
| DaisyUI      | コンポーネント | 5.x        |

## 水平線

---

## タスクリスト

- [x] Markdownファイルの配置
- [x] Webページとしてレンダリング
- [ ] さらにコンテンツを追加

## 画像

![Astroロゴ](/favicon.svg)
