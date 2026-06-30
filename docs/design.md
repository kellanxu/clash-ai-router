# Design

## Mission

Help people who already use Clash Verge Rev / Mihomo keep AI services on stable, appropriate proxy routes without manually switching nodes after every timeout.

## Core idea

Keep rules stable and keep nodes dynamic.

The tool does not hardcode one magic node. It creates:

- an AI auto-test group for availability;
- a manual AI wrapper for fallback;
- a normal foreign auto-test group;
- first-priority rules for AI domains.

## Privacy boundary

Never commit or publish:

- subscription URLs;
- generated provider YAML;
- real node lists;
- traffic usage data;
- Clash runtime cache files.

The public repository should contain only reusable logic and examples.

## MVP scope

1. Provide a Clash Verge Rev profile script.
2. Provide a local helper that can install the script into the current profile script slot.
3. Back up before writing.
4. Provide `doctor` so humans and agents can check install prerequisites.
5. Provide `test --strict` so agents have a non-ambiguous success/failure signal.
6. Provide rollback and uninstall through a stable pre-install backup so repeated installs do not destroy the user's original script. Do not silently restore unrelated `.bak-*` files.
7. Leave subscription refresh to Clash Verge Rev, but do not report success until runtime verification passes.

## Strict success criteria

`python3 bin/clash-ai-router test --strict` must return exit code `0` only when all of these are true:

- the current profile script contains Clash AI Router;
- key AI domain rules exist in the installed script;
- Mihomo runtime groups can be read;
- `AI自动可用` exists;
- `AI代理` exists;
- `国外自动可用` exists;
- `普通国外` exists;
- `AI代理` points to `AI自动可用`;
- `AI自动可用` has at least one real proxy candidate;
- `AI自动可用` does not include costly high-multiplier candidates such as `5x`, `8x`, `10x`, or `12x`;
- at least one AI candidate appears to be in an allowed AI region.

Warnings are acceptable in `status`, but not in strict verification.

## Non-goals

- No guarantee that any AI service will always work.
- No attempt to bypass laws, network rules, or service terms.
- No collection of public node lists.
- No built-in subscription provider.
- No blind editing of Clash Verge Rev `profiles.yaml` when the script slot cannot be identified.
