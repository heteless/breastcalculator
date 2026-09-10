---
$id: https://breastcalculator.com/.well-known/agent-skills/link-headers/SKILL.md
$type: agent-skill
name: link-headers
version: 1.0.0
author: Breast Calculator
license: MIT
---

# Link Response Headers for Agent Discovery

This site advertises its machine-readable resources to autonomous AI agents
and crawlers via the standard HTTP `Link` response header, as defined in
[RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) and recommended by
[RFC 9727 Section 3](https://www.rfc-editor.org/rfc/rfc9728#section-3).

## What is served on the homepage

A `GET https://breastcalculator.com/` request returns the following
`Link` header:

```
Link: </.well-known/api-catalog>; rel="api-catalog"; type="application/json",
      </.well-known/agent-skills/link-headers/SKILL.md>; rel="service-doc"; type="text/markdown",
      </.well-known/llms.txt>; rel="service-desc"; type="text/plain",
      </sitemap.xml>; rel="sitemap"; type="application/xml",
      </robots.txt>; rel="describedby"; type="text/plain"
```

## Relation types used

| `rel`         | Reference                          | Purpose                                                                |
| ------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `api-catalog` | IANA link relations (draft)        | Machine-readable catalog of every endpoint/resource on the site        |
| `service-doc` | RFC 9727 Section 3                 | Service-level documentation (humans + agents)                          |
| `service-desc`| RFC 9727 Section 3                 | Machine-readable service description (e.g. OpenAPI, llms.txt)          |
| `sitemap`     | sitemaps.org                       | XML sitemap of all public pages                                        |
| `describedby` | RFC 8288 Section 3.3               | Link to data that describes the resource                               |

## How an agent should consume this

1. Fetch `https://breastcalculator.com/`
2. Read the `Link` header from the response
3. Resolve each `rel` value to its target URL
4. For `rel="api-catalog"`, fetch `/.well-known/api-catalog` for the full
   endpoint inventory
5. For `rel="service-desc"`, fetch `/.well-known/llms.txt` for a concise
   LLM-friendly summary
6. For `rel="sitemap"`, fetch `/sitemap.xml` for the complete URL list

## Why this matters

A `Link` header is the **only** way for an agent to discover capabilities
without parsing HTML. It is the canonical, crawler-friendly, RFC-defined
mechanism for "agent-ready" sites.

## Validation

```
POST https://isitagentready.com/api/scan
Content-Type: application/json

{"url": "https://breastcalculator.com/"}
```

Should return `checks.discoverability.linkHeaders.status == "pass"`.
