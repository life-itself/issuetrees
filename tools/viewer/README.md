# Issue Tree Viewer

A local, read-only viewer for Markdown issue trees. Open a file or paste a list; explore a map with curved branches, answers underneath questions, and independent controls for branches and long answers. A readable outline is available and is the default on small screens.

## Run

Requires Node 20.19+ or 22.12+ (tested on Node 25).

```sh
cd tools/viewer
npm ci
npm run dev
```

Open the printed localhost URL. The bundled Seeds of Renaissance example loads immediately. The design moodboard is at `/design/moodboard.html`.

```sh
npm test
npm run build
npx vite preview --host 127.0.0.1
```

`dist/` is a static site containing the viewer and moodboard. Serve it over HTTP; opening the source HTML directly through `file://` is not supported. No application backend or remote font service is required. Imported Markdown stays in the browser.

## Markdown

```md
# Our inquiry

- What are we trying to achieve?
  - Who is it for? **✅ People reading project issue trees.**
  - What remains uncertain?
```

For project documents, the viewer uses the `## Issue tree` section, ending at the next heading of equal or higher level. A standalone bold paragraph before the list becomes the root question. Otherwise the first H1 supplies the title. Without an Issue tree section, top-level lists become branches. Ordered lists work too.

Only a bold span beginning with `✅` marks an answer. Questions, answers, trailing caveats, links, and nested lists are preserved. Other icons and tentative prose stay as written; the viewer does not infer that they represent decisions or priority. HTML/images are deliberately excluded from rendering. Standard inline and reference-style links are supported.

## Controls

- Drag empty map space or scroll to pan; Ctrl/Cmd + wheel zooms at the pointer.
- Use zoom buttons or Fit to adjust scale. Fit on a large expanded tree is an overview, not a reading scale.
- Select a question-count button to open a branch, or Fold branch to close it.
- Read answer expands a preview without changing text width.
- Overview folds to the main branches. Expand all reveals every question.
- Focus the map and use arrow keys to pan, plus/minus to zoom. Controls also work with Tab and Enter.

## Node API

```js
import { readFile } from 'node:fs/promises';
import { parseTree } from './src/parser.js';

const tree = parseTree(await readFile('project.md', 'utf8'));
console.log(tree.title, tree.children);
```

The root has `id`, `title`, `definitions`, and `children`. Each child has `id`, `question`, `answer`, and `children`; text fields contain Markdown. When rendering a fragment independently, append `\n\n` plus root `definitions` to preserve reference links. IDs are deterministic within a document parse, not permanent cross-edit identifiers.

## Sample and limits

`examples/rebrand.md` is a snapshot copied on 2026-09-26 from `life-itself/planning/projects/2608-seeds-of-renaissance-rebrand.md`; its issue tree records the 2026-09-25 migration and decisions. Update the original project, not this demonstration copy. Sample relative links resolve to the planning repository on GitHub. Relative links in imported documents are retained as labelled unavailable links because the browser cannot infer the source directory.

This prototype does not edit, save, sync, export Obsidian Canvas, or classify unmarked answers. It caps input at 1 MB in the browser and 1,000 questions in the parser. Large trees need branch folding, zoom, or Outline. File selection is implemented with the browser File API; automated end-to-end selection was blocked by the review browser's extension permission, while paste and the bundled sample were verified.

## Resume

Work is tracked in Beads epic `issuetrees-4mv` in issuetrees.com, linked from Life Itself planning discovery `lip-tqk.20`. Design and plan: `../../docs/plans/2026-09-26-issue-tree-viewer*.md`. Visual direction: `../../DESIGN.md` and `design/moodboard.html`.
