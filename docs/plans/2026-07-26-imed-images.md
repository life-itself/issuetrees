# IMED Images Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Present the two existing IMED diagrams clearly on the SCQA list page.

**Architecture:** Extend the existing Markdown page with one IMED section. Use only standard Markdown headings, linked images, and the existing PNG assets so the site needs no styling or configuration changes.

**Tech Stack:** Markdown, PNG assets

---

### Task 1: Add the IMED diagrams

**Files:**
- Modify: `list.md`
- Verify: `assets/imed_issue_tree.png`
- Verify: `assets/imed_hyp_tree.png`

**Step 1: Confirm the assets exist**

Run: `test -f assets/imed_issue_tree.png && test -f assets/imed_hyp_tree.png`
Expected: exit status 0.

**Step 2: Add the section**

Append this standard Markdown after the IMED project list item:

```markdown
## IMED

The IMED project explores how to resolve the dilemma between access to medicines and incentives for innovation.

### Issue tree

[![IMED issue tree](assets/imed_issue_tree.png)](assets/imed_issue_tree.png)

### Hypothesis tree

[![IMED hypothesis tree](assets/imed_hyp_tree.png)](assets/imed_hyp_tree.png)
```

**Step 3: Verify the edit**

Run: `git diff --check && rg -n 'imed_(issue|hyp)_tree\.png' list.md`
Expected: no whitespace errors and two image references, one for each asset.

**Step 4: Review the final diff**

Run: `git diff -- list.md`
Expected: only the approved IMED section is added.
