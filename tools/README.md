# Issue Tree Workspace

## Working viewer prototype

The [Markdown viewer](viewer/README.md) is ready to try locally: `cd tools/viewer && npm ci && npm run dev`. It includes the rebrand sample, a Coggle-inspired map with inline answers, an outline, and a [design moodboard](viewer/design/moodboard.html). Implementation is tracked in Beads epic `issuetrees-4mv`; the original discovery task remains the portfolio link.

Tools and skills for visualising and editing issue trees: combine Coggle's visual intuitiveness, a spreadsheet's structured information, and the freedom to write detailed descriptions and answers.

This is the starting brief for the tooling work within `life-itself/issuetrees`, the repository behind issuetrees.com. **Issue Tree Workspace** is a working name. The first deliverable could be a skill, a connected set of views over existing files, or an application; that choice is still open.

## Why this matters now

Life Itself increasingly uses issue trees to shape projects and record decisions. As the trees grow, Markdown bullet lists become overwhelming to read and edit. The thinking is there, but it is hard to get an overview of where things stand, move between levels of detail, and see what needs answering next.

Rufus has wanted this kind of tool for a long time and may have written about it on his blog. That earlier write-up has not yet been identified. Current Life Itself use provides concrete cases for turning the idea into a small, useful experiment.

## The experience we want

- **An intuitive visual overview:** see the tree, navigate branches, and edit or restructure it with the ease Rufus values in Coggle.
- **Structured information:** attach and edit spreadsheet-like fields on questions or nodes. Choose the fields from actual needs rather than designing a large schema upfront.
- **Room for detailed thinking:** write descriptions, answers, hypotheses, evidence, and source references without squeezing everything into diagram labels.
- **Clear orientation:** see what is open, what has been answered, where a hypothesis remains tentative, what has been decided, and what needs attention next.

The main gap is the visual surface that connects these experiences. They do not have to live in one application: an intuitive map that links to structured tables and longer write-ups may be enough. Moving from the overview into detail and back should feel coherent.

## Starting constraints

For the initial Life Itself experiment, project Markdown remains durable context and Beads remains the action tracker. Preserve questions when they are answered, along with their answers and source links. Keep open questions, answers, hypotheses, and decisions distinguishable. Any editing approach needs a clear way to persist changes without creating conflicting copies or another task queue.

An issue tree structures inquiry and reasoning; links to executable tasks can support it, but do not replace that purpose. The visual workspace should help us understand what needs answering next as well as where the project stands.

No framework, storage schema, sync mechanism, or app architecture has been chosen. This brief seeds discovery rather than authorising a full build.

## First shaping session

Start with one real Life Itself tree and walk through the experience Rufus wants: getting an overview, finding an unanswered question, opening its detail, recording an answer, and returning to the overview. Identify where the current workflow makes those steps difficult. Use that walkthrough to choose one small experiment and a concrete way to judge whether it helps.

Useful questions for that session:

- What must be visible in the overview, and what belongs in a detail view?
- Which editing actions matter most: adding questions, moving branches, editing answers, or changing structured fields?
- Which fields genuinely benefit from a table or spreadsheet view?
- Can linked views and AI skills provide the first useful version, or is a dedicated editor necessary?
- How will edits reach the durable source, and how will links survive restructuring?
- Which concepts or components can be shared with Reason Commons?

The discovery outcome should compare a lightweight improvement to the Markdown workflow with a dedicated application, and recommend a bounded next experiment. Recover earlier thinking where useful, without making an exhaustive historical search a prerequisite.

## Context and source material

- Methodology in this repo: [SCQA](../SCQA.md), [issue and hypothesis trees](../Trees.md), and [the Pyramid technique](../Pyramid.md).
- **Life Itself rebrand:** `~/src/life-itself/planning/projects/2608-seeds-of-renaissance-rebrand.md`, including its migrated Coggle tree and source link. A useful first case of visual structure, questions, and recorded answers.
- **Life Itself planning infrastructure:** `~/src/life-itself/planning/projects/2605-project-management-infrastructure.md`, including the agreed distinction between durable project context and tracked actions.
- **Reason Commons:** [life-itself/reasoncommons](https://github.com/life-itself/reasoncommons), locally `~/src/life-itself/reasoncommons`. Closely related work on structured reasoning, claims, evidence, and issue trees. Explore reuse and boundaries; this workspace starts from the practical Life Itself reading and editing need.
- **Portfolio origin:** `~/src/rufuspollock/planning/projects/2026-issue-tree-workspace.md`, under the SCQA Trees of Thought initiative.

## Tracking and resuming

The initial discovery task remains **`lip-tqk.20`**, “Plan a visual editing structure for project issue trees”, in Life Itself planning. Read it by running `bd show lip-tqk.20` from `~/src/life-itself/planning`. **`pl-59ss`** in Rufus's planning repo is the portfolio pointer. Keep actionable state in the existing tracker while shaping here; this README is the working brief.

To resume with an agent, open this repository and ask:

> Read tools/README.md and the linked discovery bead. Help me shape the smallest useful issue-tree workspace, starting with the Life Itself rebrand tree. Walk through the desired reading and editing experience with me before choosing an implementation.
