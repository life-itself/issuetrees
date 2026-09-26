import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseTree } from "../src/parser.js";
import { layoutTree } from "../src/layout.js";
test("real project extracts only its issue tree and preserves nested answers", () => {
  const tree = parseTree(
    readFileSync(new URL("../examples/rebrand.md", import.meta.url), "utf8"),
  );
  assert.match(tree.title, /What is the Seeds/);
  assert.equal(tree.children.length, 6);
  const channel = tree.children[1];
  assert.equal(channel.children.length, 6);
  assert.match(channel.children[1].answer, /single feed/);
  assert.match(tree.children[0].children[1].answer, /\[Seeds.*\]\(https:/);
});
test("preserves multiline content and caveats after a bold answer", () => {
  const t = parseTree(
    "# Example\n\n- Question? **✅ Yes with [source](https://example.com).** Later caveat.\n\n  Further detail.\n  - Child?\n\n## Sources\nNothing",
  );
  assert.equal(t.children[0].question, "Question?");
  assert.match(t.children[0].answer, /Later caveat/);
  assert.match(t.children[0].answer, /Further detail/);
  assert.equal(t.children[0].children[0].question, "Child?");
});
test("does not infer answer from unmarked prose or unrelated emoji", () => {
  const t = parseTree(
    "- 🔥 What next? Probably something.\n- Is this **important**?",
  );
  assert.equal(t.children[0].answer, "");
  assert.match(t.children[1].question, /\*\*important\*\*/);
});
test("ordered lists and section boundaries", () => {
  const t = parseTree(
    "# Project\n## Issue tree\n**Root?**\n1. First?\n   1. Nested?\n## Sources\n- Not a node",
  );
  assert.equal(t.title, "Root?");
  assert.equal(t.children.length, 1);
  assert.equal(t.children[0].children.length, 1);
});
test("empty and non-tree text report a useful error", () => {
  assert.throws(() => parseTree(""), /bullet|list/i);
  assert.throws(() => parseTree("# Hello\nNo tree"), /bullet|list/i);
});
test("layout keeps unequal-height sibling subtrees apart", () => {
  const root = {
    id: "root",
    children: [
      { id: "a", children: [{ id: "c", children: [] }] },
      { id: "b", children: [] },
    ],
  };
  const sizes = new Map([
    ["root", 80],
    ["a", 300],
    ["b", 100],
    ["c", 50],
  ]);
  const result = layoutTree(root, sizes);
  const a = result.nodes.find((n) => n.id === "a"),
    b = result.nodes.find((n) => n.id === "b");
  assert.ok(b.y >= a.y + 300 + 24);
  assert.equal(result.edges.length, 3);
});

test("carries reference link definitions for independently rendered fragments", () => {
  const t = parseTree(
    '- Is this true? **✅ See [evidence][ref].**\n\n[ref]: https://example.com "Source"',
  );
  assert.match(t.definitions, /\[ref\]: https:\/\/example.com/);
});
