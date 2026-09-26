import { fromMarkdown } from "mdast-util-from-markdown";
const plain = (node) => node.value ?? (node.children || []).map(plain).join("");

/** Parse a Markdown list or a project's Issue tree section. No browser required. */
export function parseTree(markdown) {
  const source = String(markdown).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const ast = fromMarkdown(source),
    slice = (n) => source.slice(n.position.start.offset, n.position.end.offset);
  let blocks = ast.children;
  const section = blocks.findIndex(
    (n) => n.type === "heading" && /^issue tree$/i.test(plain(n).trim()),
  );
  if (section >= 0) {
    const depth = blocks[section].depth;
    blocks = blocks.slice(section + 1);
    const end = blocks.findIndex(
      (n) => n.type === "heading" && n.depth <= depth,
    );
    if (end >= 0) blocks = blocks.slice(0, end);
  }
  const lists = blocks.filter((n) => n.type === "list");
  if (!lists.length)
    throw new Error(
      "No tree found. Add a Markdown bullet list, optionally under “## Issue tree”.",
    );
  const before = blocks.slice(0, blocks.indexOf(lists[0]));
  const rootQuestion = before.findLast(
    (n) =>
      n.type === "paragraph" &&
      n.children.length === 1 &&
      n.children[0].type === "strong",
  );
  const heading = ast.children.find(
    (n) => n.type === "heading" && n.depth === 1,
  );
  let count = 0;
  function item(n) {
    if (++count > 1000)
      throw new Error(
        "This prototype supports up to 1,000 questions. Open a smaller tree.",
      );
    const content = n.children.filter((c) => c.type !== "list");
    const first = content[0];
    const marker = first?.children?.find(
      (c) => c.type === "strong" && plain(c).trimStart().startsWith("✅"),
    );
    let question = content.map(slice).join("\n\n"),
      answer = "";
    if (marker) {
      question = source
        .slice(first.position.start.offset, marker.position.start.offset)
        .trim();
      const marked = slice(marker);
      answer =
        marked.slice(2, -2).replace(/^\s*✅\s*/, "") +
        source.slice(marker.position.end.offset, first.position.end.offset);
      answer += "\n\n" + content.slice(1).map(slice).join("\n\n");
      answer = answer.trim();
    }
    return {
      id: `n${count}`,
      question,
      answer,
      children: n.children
        .filter((c) => c.type === "list")
        .flatMap((l) => l.children.map(item)),
    };
  }
  return {
    id: "root",
    definitions: ast.children
      .filter((n) => n.type === "definition")
      .map(slice)
      .join("\n"),
    title: rootQuestion
      ? plain(rootQuestion)
      : heading
        ? plain(heading)
        : "Untitled inquiry",
    children: lists.flatMap((l) => l.children.map(item)),
  };
}
