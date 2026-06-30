# AGENTS.md

This repository is designed to be installed by a local coding agent for a user who already has Clash Verge Rev / Mihomo working on macOS.

## Goal

Install `scripts/clash-ai-router.profile.js` into the user's current Clash Verge Rev profile script slot, refresh the profile, and verify that AI traffic groups are active.

Do not report success unless strict verification passes.

## Privacy and safety rules

Do not ask for, print, upload, commit, or summarize:

- subscription URLs;
- generated provider YAML;
- real node lists;
- traffic usage data;
- Clash runtime cache files;
- private local configuration files.

Do not help the user bypass workplace, school, national network controls, or service terms. This project is only for routing convenience for users who already have a lawful working proxy setup.

## Preconditions

Expected environment:

- macOS;
- Clash Verge Rev installed;
- an existing working Clash subscription/config;
- Python 3.9 or newer;
- `curl` available;
- repository cloned locally.

The helper reads the Clash Verge Rev config directory from:

```bash
~/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev
```

The user can override it with:

```bash
CLASH_VERGE_HOME=/path/to/clash/verge/home
```

The helper reads Mihomo runtime from:

```bash
/tmp/verge/verge-mihomo.sock
```

The user can override it with:

```bash
MIHOMO_SOCKET=/path/to/mihomo.sock
```

## Required workflow

Run:

```bash
python3 bin/clash-ai-router doctor
```

If `doctor` fails, stop and explain the exact failed check. Do not continue blindly.

Then run:

```bash
python3 bin/clash-ai-router install --dry-run
python3 bin/clash-ai-router install
```

After install, refresh the current Clash Verge Rev subscription/config.

Then run:

```bash
python3 bin/clash-ai-router select-auto
python3 bin/clash-ai-router test --strict
```

`select-auto` may fail if the runtime is not available yet. In that case, tell the user to open Clash Verge Rev, start the core, refresh the current profile, and retry.

## Success criteria

Report success only if this command exits with code `0`:

```bash
python3 bin/clash-ai-router test --strict
```

Strict verification checks that:

- current profile script contains Clash AI Router;
- key AI rules exist in the installed script;
- Mihomo runtime groups can be read;
- runtime group `AI自动可用` exists;
- runtime group `AI代理` exists;
- runtime group `国外自动可用` exists;
- runtime group `普通国外` exists;
- `AI代理` points to `AI自动可用`;
- `AI自动可用` has at least one real proxy candidate;
- `AI自动可用` does not include costly `12x`-style candidates;
- at least one candidate appears to be in an allowed AI region.

Do not use `status` as final verification. `status` is informational and can return success even when runtime verification is unavailable.

## Failure handling

### No profile script slot

If the helper cannot find the current profile script slot, do not edit `profiles.yaml` by guessing.

Tell the user to create or open the Profile Script / Script extension in Clash Verge Rev, then either:

1. paste the contents of `scripts/clash-ai-router.profile.js` manually; or
2. run install with an explicit target:

```bash
python3 bin/clash-ai-router install --target /path/to/script.js
```

Then refresh Clash Verge Rev and run:

```bash
python3 bin/clash-ai-router test --strict
```

### Runtime cannot be read

Do not report success.

Tell the user to:

1. open Clash Verge Rev;
2. start or restart the core;
3. refresh the current subscription/config;
4. rerun:

```bash
python3 bin/clash-ai-router test --strict
```

If the socket path is custom, use:

```bash
MIHOMO_SOCKET=/path/to/mihomo.sock python3 bin/clash-ai-router test --strict
```

### No recommended AI node candidate

Do not report success.

Tell the user that node recognition depends on node names. Suggest one of:

- manually select a known-good node in `AI代理`;
- rename nodes or provider display names to include region/purpose, such as `日本 ChatGPT` or `美国 Residential`;
- edit the patterns in `scripts/clash-ai-router.profile.js`.

## Rollback

To restore the latest backup:

```bash
python3 bin/clash-ai-router rollback
```

To preview rollback:

```bash
python3 bin/clash-ai-router rollback --dry-run
```

To uninstall by restoring the latest backup:

```bash
python3 bin/clash-ai-router uninstall
```

The helper intentionally refuses to delete the current script if no backup exists.
