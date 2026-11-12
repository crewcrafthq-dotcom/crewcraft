# Vendored skill — provenance

This directory is a **copy of a third-party skill**, not our own work.

| | |
|---|---|
| Source | https://github.com/leopard627/fire-your-seo-agency |
| Version | 1.3.0 |
| Commit | `4b996ea38859abd4d60bb6725412990c6a0d32f4` |
| Author | leopard627 |
| Licence | MIT — see `LICENSE` in this directory |
| Vendored | 2026-11-12 |

## Why it's vendored rather than installed as a plugin

Upstream ships this as a Claude Code plugin. Plugins install into `~/.claude/plugins`
on a persistent machine, and the cloud sessions this repo is usually worked on run in a
throwaway container with the plugin marketplace disabled
(`SKIP_PLUGIN_MARKETPLACE=true`), so a plugin install would not survive.

Copying the skill into `.claude/skills/` instead means it loads in **every** session —
local and cloud — and is version-controlled alongside the code it talks about.

## What was copied, and what was left out

Copied: `SKILL.md`, `references/` (Korean originals plus the `en/` mirrors), `LICENSE`.

Left out, because they serve the upstream repo's own development rather than using the
skill: `tools/` (its CI linter), `tests/`, `.github/`, `assets/` (a 1.1 MB preview
image), `CHANGELOG.md`, `CONTRIBUTING.md`, `README*.md`.

`SKILL.md` reads `references/*.md` and references nothing in the omitted directories, so
the copy is self-contained. The files are byte-for-byte upstream; nothing was edited.

## What it was checked for before being committed

It carries **no hooks, no slash commands and no subagents**, so nothing in it executes on
its own — it is instructions and reference documentation that Claude reads.

- Every `curl` in it is a read-only site audit (`robots.txt`, `sitemap.xml`, `llms.txt`,
  checking whether body text is server-rendered) against `example.com` placeholders.
- No references to credentials, `.env`, tokens, package installs, `eval` or `subprocess`.
- External links resolve only to official documentation (Google, Bing, OpenAI,
  Perplexity, Apple, Common Crawl, Anthropic) — no commercial or affiliate links.
- No prompt-injection-shaped text. The skill's own principle 5 tells the agent that
  fetched web content is data and must never be followed as instructions.

Re-check the above if this is ever updated to a newer upstream version.

## Fit for this project, honestly

Phase 4 is **NEO (Naver)** — the Korean search engine — which is irrelevant to a US
contractor audience. The skill self-gates it ("required if the site targets the Korean
market"), so it should simply be skipped here.

`SKILL.md` and the canonical `references/*.md` are **in Korean**; `references/en/` is an
English mirror the upstream author maintains for human readers.

Much of the remaining advice is already implemented in this repo: `llms.txt`,
`llms-full.txt`, `ai.txt`, JSON-LD on every page type, the AI-crawler allowlist in
`src/app/robots.ts`, a generated `sitemap.xml`, and the Field Guide. Expect it to
confirm and extend that rather than find a great deal that is missing.

## Updating

Re-copy from upstream and update the version and commit above:

```bash
git clone --depth 1 https://github.com/leopard627/fire-your-seo-agency /tmp/fysa
cp /tmp/fysa/SKILL.md .claude/skills/fire-your-seo-agency/SKILL.md
cp /tmp/fysa/references/*.md .claude/skills/fire-your-seo-agency/references/
cp /tmp/fysa/references/en/*.md .claude/skills/fire-your-seo-agency/references/en/
cp /tmp/fysa/LICENSE .claude/skills/fire-your-seo-agency/LICENSE
```
