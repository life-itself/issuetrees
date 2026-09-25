# Issue Tree Viewer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a working local Markdown issue-tree viewer with a Coggle-inspired map and inline answers.

**Architecture:** Markdown AST to a small portable tree model. Browser DOM nodes and SVG paths share a measured layout; the same tree powers an outline. File content stays in the browser.

**Tech Stack:** JavaScript ES modules, Vite, mdast-util-from-markdown, marked, DOMPurify, Node test runner.

### Task 1: Design artifacts
Create `PRODUCT.md`, `DESIGN.md`, and `tools/viewer/design/moodboard.html`. Critique against the actual long rebrand answers, legibility, and navigation. Record the approved scope in the adjacent design document. Commit docs.

### Task 2: Parser
Create `tools/viewer/test/parser.test.js` and dated `examples/rebrand.md`. Test section boundaries, root text, nested bullets, answer extraction with formatted links, trailing caveats, multiline paragraphs, ordered lists, empty/malformed input. Run `npm test` in tools/viewer and observe failure before implementing `src/parser.js`. Return `{title, children}` and nodes `{id,question,answer,children}`. Preserve Markdown via AST source offsets; IDs are deterministic within a parse. Run tests and commit.

### Task 3: Viewer
Create `index.html`, `src/main.js`, `src/style.css`, `src/layout.js`. Test variable-height non-overlap before implementing layout. Build auto-layout with root left and branches right, measured HTML heights, SVG curves, collapsed-branch buttons and inline long-answer expansion. Add pan/zoom, fit, overview, expand all, file picker, paste panel, outline, safe rich text, honest parse errors and sample provenance. Verify interaction behavior and safe links in browser. Commit.

### Task 4: Review and delivery
Run parser/layout tests, `npm run build`, desktop/mobile browser checks, and the design detector. Capture and inspect screenshots. Ask a fresh reviewer for material issues, resolve them, and record any limitations. Update tools/README.md with startup and Node use, provide local URL and moodboard. Commit finished prototype; do not push or deploy externally without a specified destination.
