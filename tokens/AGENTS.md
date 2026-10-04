# Waki Themes

<!-- wakilabs:managed start v1 -->
## WakiLabs conventions (managed block, do not edit by hand)

**Waki Themes** (`waki-themes`), archetype `artifact`, family `foundation`.
The central theme catalog and visual tokens across Waki applications.

- Conventions version 1. Registry, policies and templates live in `~/workspaces/wakilabs`
  (`registry/projects.json`, `policies/*.yaml`, prose in `docs/standards/`).
- Canonical checkout: `~/workspaces/waki-foundation/tokens`. Until the Phase 2b move it lives at `~/workspaces/wakilabs/waki-themes`.
- Foundation pin: not pinned yet (recorded by `waki adopt`).

Three rules:
1. Start sessions for this project here, at this repo's root (this project is a member of the `waki-foundation` monorepo: once merged, start at `~/workspaces/waki-foundation`).
2. Never do this project's work from `~/workspaces/wakilabs` or a worktree of it.
3. Never work under `~/workspaces/_archive/`; if the session guard says "archived path", stop and ask.

Deviating: when work has to depart from a policy, record it instead of hiding it:
`waki note deviation "<what and why>" --rule <rule id>` (ideas: `waki note proposal "<text>"`).

`waki check` here enforces: registry row, flat tree, naming, docs, managed block, .wakilabs/.
Run it before reporting work as done. Regenerate this block with `waki adopt --apply`.
<!-- wakilabs:managed end -->
