import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";

export interface TocItem {
  link: string;
  descricao: string;
}

export async function extractTocFromMDX(content: string): Promise<TocItem[]> {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(content);

  const toc: TocItem[] = [];

  visit(tree, "heading", (node: any) => {
    let text = "";
    let link = "";

    for (const child of node.children) {
      if (child.type === "text") {
        text += child.value;
      }

      if (child.type === "mdxJsxTextElement" && child.name === "HeaderLink") {
        const hrefAttr = child.attributes.find((a: any) => a.name === "href");
        if (hrefAttr?.value) {
          link = hrefAttr.value;
        }
      }
    }

    if (link && text) {
      toc.push({ link, descricao: text.trim() });
    }
  });

  return toc;
}
