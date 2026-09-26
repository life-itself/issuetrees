/** Variable-height, left-to-right tree layout. Sizes are measured DOM heights. */
export function layoutTree(
  root,
  sizes,
  { width = 280, gapX = 110, gapY = 32 } = {},
) {
  const spans = new Map(),
    nodes = [],
    edges = [];
  function measure(n) {
    const children = n.children || [];
    const childrenHeight =
      children.reduce((s, c) => s + measure(c), 0) +
      Math.max(0, children.length - 1) * gapY;
    const h = Math.max(sizes.get(n.id) || 80, childrenHeight);
    spans.set(n.id, h);
    return h;
  }
  function place(n, depth, top, branch = 0) {
    const height = sizes.get(n.id) || 80;
    const p = {
      ...n,
      x: depth * (width + gapX),
      y: top + (spans.get(n.id) - height) / 2,
      width,
      height,
      branch,
    };
    nodes.push(p);
    let cursor =
      top +
      (spans.get(n.id) -
        (n.children || []).reduce((s, c) => s + spans.get(c.id), 0) -
        Math.max(0, (n.children || []).length - 1) * gapY) /
        2;
    (n.children || []).forEach((c, i) => {
      const child = place(c, depth + 1, cursor, depth === 0 ? i : branch);
      edges.push({ from: p, to: child });
      cursor += spans.get(c.id) + gapY;
    });
    return p;
  }
  measure(root);
  place(root, 0, 0);
  return {
    nodes,
    edges,
    width: Math.max(...nodes.map((n) => n.x + width)),
    height: spans.get(root.id),
  };
}
