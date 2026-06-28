// 限定コンテンツのティーザー用に、先頭からブロック要素の一定割合だけを残して HTML を切り詰める。
// タグ境界で切るため、途中でタグが壊れない。フラットな本文（p / h1-3 / img 等の並び）を想定。
export function truncateHtmlByBlocks(html: string, fraction: number): string {
  const blocks = html.match(
    /<([a-z0-9]+)(?:\s[^>]*)?>[\s\S]*?<\/\1>|<img\b[^>]*\/?>/gi,
  );
  if (!blocks || blocks.length === 0) return html;

  const count = Math.max(1, Math.ceil(blocks.length * fraction));
  return blocks.slice(0, count).join("");
}
