# Issue tree viewer design

Approved in conversation on 2026-09-26, with autonomous implementation and visual critique requested.

Build a local browser viewer from Markdown. Coggle supplies the spatial reference: curved coloured branches, generous separation, readable questions, pan/zoom and collapse. Answers sit beneath questions; long answers expand inline. Markdown stays authoritative; no editing, accounts, sync or task tracking.

The rebrand sample is a dated copy, with provenance, not a second editable source. Parse the Issue tree section, preserve its root question, nesting and answer links. Recognise bold checkmark answers without interpreting arbitrary emoji or prose as status. Use a Markdown AST rather than indentation regexes. Unsafe HTML and unsafe URL protocols must not execute. Local relative links need an explicit source base or a clear unavailable state.

Architecture: small Vite browser app, reusable ES module parser usable from Node, DOM nodes with SVG connectors, measured tree layout, browser-only file/paste input. Initial overview opens the root and main questions; expanding a branch preserves its screen position. Controls include fit, zoom, overview, expand all, file and paste. A keyboard-friendly outline serves small screens and offers a non-spatial reading option.

Moodboard: tools/viewer/design/moodboard.html. Warm paper, dark green ink, restrained branch colours, serif root, sans-serif question text. Colour identifies branches, never answer status alone. Show answers with an explicit label and distinct typography.

Verification: Node parser tests on real sample and edge cases; layout non-overlap tests; browser smoke tests for load, expansion, collapse, input errors, safe rendering and mobile overflow. Visual review of desktop and mobile and a fresh critique before delivery.
