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
4. Check whether the expected groups and rules exist.
5. Leave subscription refresh to Clash Verge Rev.

## Non-goals

- No guarantee that any AI service will always work.
- No attempt to bypass laws, network rules, or service terms.
- No collection of public node lists.
- No built-in subscription provider.
