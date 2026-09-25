# Beads setup and sync

This repository uses Beads 1.3.0 with an embedded Dolt database, the `issuetrees` issue prefix, and the GitHub `origin` as its Dolt remote. The committed `.beads/` metadata and hooks configure each clone; the embedded database and other machine-local state stay ignored. The optional `.beads/issues.jsonl` export is for viewers and interchange. Dolt is the cross-machine sync mechanism.

## Normal workflow

At the start of a session:

```sh
git pull
bd dolt pull
bd status
```

Use `bd ready`, `bd create`, `bd update <id> --claim`, and `bd close <id> --reason "..."` to manage issues. The repo-local hooks pull after merge and branch checkout, and push Dolt data during `git push`. Run `bd dolt push` manually if the hook reports a failure or if Beads changed without a Git commit to push.

## Fresh clone

```sh
git clone git@github.com:life-itself/issuetrees.git
cd issuetrees
bd context
bd dolt remote list
bd dolt pull
bd status
```

If Beads reports that the database is not initialized, verify that `.beads/config.yaml` and `.beads/metadata.json` are present, then run `bd bootstrap` followed by `bd dolt pull`. Do not run `bd init` over an existing clone.

## If sync fails

Inspect `bd context`, `bd dolt remote list`, `bd dolt status`, and `git status --short --branch` before changing state. Retry `git pull`, `bd dolt pull`, then `bd dolt push`. If both clones changed Beads concurrently, resolve the Dolt conflict without deleting `.beads/` or reinitializing. See the beads-sync-playbook in `~/src/rufuspollock/agent-skills` for recovery guidance.
