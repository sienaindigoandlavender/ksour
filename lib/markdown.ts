import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return result.toString();
}
