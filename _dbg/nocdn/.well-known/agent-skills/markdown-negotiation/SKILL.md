---
$id: https://breastcalculator.com/.well-known/agent-skills/markdown-negotiation/SKILL.md
$type: agent-skill
name: markdown-negotiation
version: 1.0.0
author: Breast Calculator
license: MIT
upstream: https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md
---

# Markdown for Agents — breastcalculator.com

This site supports `Accept: text/markdown` content negotiation via the
[Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
feature.

## Behavior

| Request `Accept` header           | Response `Content-Type`           | Notes                              |
| --------------------------------- | --------------------------------- | ---------------------------------- |
| `text/html` (default for browsers)| `text/html; charset=utf-8`        | Full HTML page                     |
| `text/markdown` (agent)           | `text/markdown; charset=utf-8`    | Converted Markdown, body only      |
| `*/*`                             | `text/html; charset=utf-8`        | Default = HTML (browser-friendly)  |

When the response is Markdown, Cloudflare also adds:
- `vary: accept`
- `x-markdown-tokens: <N>` (token count of the markdown)
- `x-original-tokens: <M>` (token count of the original HTML)
- `content-signal: ai-train=yes, search=yes, ai-input=yes`

The Markdown response has this structure:

1. **YAML frontmatter** (if `<meta name="title|description">` or `<meta property="og:image">` exist)
2. **Body Markdown** (navigation, headers, footers, scripts, styles stripped)
3. **JSON-LD** (preserved as a fenced ```` ```json ```` block at the end)

## How it was enabled

```bash
curl -X PATCH \
  'https://api.cloudflare.com/client/v4/zones/838476fec0b4ac200be3cc8273ded57c/settings/content_converter' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --data-raw '{"value":"on"}'
```

After enabling, requests with `Accept: text/markdown` will return a
clean Markdown rendering of the same page — no server-side code changes
were needed on the static site itself.

## Try it

```bash
# As HTML (default)
curl -i https://breastcalculator.com/ | head

# As Markdown
curl -i -H 'Accept: text/markdown' https://breastcalculator.com/ | head
# Expect: content-type: text/markdown; charset=utf-8
# Expect: x-markdown-tokens: <number>
# Expect: vary: accept
```

## Why this matters

HTML is heavy for agents: navigation, scripts, styles, repeated
boilerplate waste tokens. Markdown is ~10-30x smaller and preserves
semantic structure. By supporting `Accept: text/markdown` we let
agents fetch our content with **one round trip** at minimal cost.

## Spec references

- [Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
- [llmstxt.org](https://llmstxt.org/)
- [Content Signals](https://contentsignals.org/)
