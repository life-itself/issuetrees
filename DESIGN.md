---
name: Issue tree viewer
description: Friendly spatial reading of Markdown questions and answers.
colors:
  paper: "#f8f7f3"
  ink: "#263d35"
  muted: "#627169"
  line: "#d9ddd5"
  surface: "#ffffff"
  teal: "#397a70"
  ochre: "#ac792f"
  terracotta: "#b36551"
  blue: "#597f9b"
  plum: "#88708d"
  olive: "#778348"
  answer-background: "#eef2ec"
  answer-text: "#46594e"
  answer-label: "#376c58"
  selection: "#d7e6cf"
  button-hover: "#e9ece5"
  primary-hover: "#3b554a"
typography:
  root:
    fontFamily: "Georgia, serif"
    fontSize: "29px"
    fontWeight: 400
    lineHeight: 1.27
    letterSpacing: "-0.6px"
  question:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "15px"
    fontWeight: 550
    lineHeight: 1.5
  answer:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
  answer-label:
    fontSize: "11px"
    fontWeight: 650
  button:
    fontSize: "13px"
    fontWeight: 550
rounded:
  answer: "6px"
  button: "8px"
  control-group: "10px"
spacing:
  answer-gap: "12px"
  tree-horizontal-gap: "110px"
  tree-vertical-gap: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button}"
    padding: "10px 14px"
  map-node:
    backgroundColor: "{colors.paper}"
    width: "280px"
    padding: "10px 0 12px"
  map-answer:
    backgroundColor: "{colors.answer-background}"
    textColor: "{colors.answer-text}"
    rounded: "{rounded.answer}"
    padding: "9px 11px"
  outline-answer:
    backgroundColor: "{colors.answer-background}"
    textColor: "{colors.answer-text}"
    rounded: "{rounded.answer}"
    padding: "10px 12px"
---

# Design System: Issue tree viewer

## Overview

The viewer translates Markdown reasoning into a friendly spatial map. Coggle is the user's explicit reference: approachable curved branches, with answers directly beneath questions. Warm paper, serif roots and quiet controls make room for sustained reading. The [moodboard](tools/viewer/design/moodboard.html) records the initial direction; the tokens above describe the implemented viewer.

## Colors

Paper and dark green ink carry the reading surface. Six muted colours distinguish branch families and carry no status meaning. Answers have a pale green background, darker body ink and a labelled green heading. Selection and control hover states use restrained tonal changes.

## Typography

Georgia marks the central inquiry and the outline title; system sans handles questions, answers and controls. There are no remote font dependencies. The outline root uses 26px/1.3 normal-weight Georgia. Questions wrap anywhere when necessary so a long URL cannot break the map width.

## Layout

The map is a left-to-right variable-height tree. Nodes have a fixed width; the layout measures rendered heights and separates columns and subtrees using the gap tokens. Questions remain on the paper surface with a thin branch-coloured baseline. Answers expand vertically without changing their reading measure.

The header is 82px tall on desktop, with identity left and input actions right. Under 760px it wraps and has a 74px minimum height. Narrow screens under 650px initially open the outline; both views remain selectable. The outline uses nesting lines, up to 800px width and answer measure up to 65ch. Controls remain outside the pannable map.

## Elevation & Depth

The map stays flat. Tinted answers and outlined control groups convey grouping. Only the Markdown import panel receives a soft downward shadow; its exact value lives in the sidecar.

## Shapes

Curved connectors use 1.8px strokes at 0.65 opacity. Nodes have a 1px branch-coloured bottom rule. Answers and controls have modest rounded corners. The map includes a subtle dotted 22px grid to help communicate a pannable surface.

## Components

Primary input actions use dark ink fill with white text; secondary buttons are quiet until hover. Focus uses a 2px teal outline with 4px offset. Disabled controls reduce opacity to 0.4. Control backgrounds transition for 150ms only when reduced motion is not requested.

Answers sit below questions with an explicit Answer label. Preview content is measured against the actual three-line clamp, so only genuinely overflowing answers receive a Read answer control. Branch collapse and answer expansion are independent. The same tinted answer treatment carries into the mobile outline.

The import panel uses a labelled multiline field, clear action controls and a visible error notice. Scrollbars, selection and caret colours share the palette.

## Do's and Don'ts

- Do preserve readable text size and allow the viewer to pan, zoom or use the outline.
- Do preserve source links and distinguish question text from answers visually.
- Do use colour for family grouping, not inferred progress or certainty.
- Don't enclose every question in a card; the branches and baselines provide structure.
- Don't give answers variable widths or use external assets that compromise local viewing.
