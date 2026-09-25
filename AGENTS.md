# Agent instructions

## Beads

Beads issues sync through the repository's Dolt remote. `git push` also runs `bd dolt push` through the repo-local pre-push hook. After `git pull`, run `bd dolt pull`; if the hook push fails or no Git commit is being pushed, run `bd dolt push` manually.

