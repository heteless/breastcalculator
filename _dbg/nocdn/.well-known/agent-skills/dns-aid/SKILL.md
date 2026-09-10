---
$id: https://breastcalculator.com/.well-known/agent-skills/dns-aid/SKILL.md
$type: agent-skill
name: dns-aid
version: 1.0.0
author: Breast Calculator
license: MIT
upstream: https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md
---

# DNS for AI Discovery (DNS-AID) — breastcalculator.com

This site publishes DNS for AI Discovery (DNS-AID) records under the
`_agents` namespace of `breastcalculator.com`, allowing autonomous agents
to discover our service endpoints through a single DNS lookup.

## Published records

The exact records are documented in the zone file at
[`zone.txt`](./zone.txt) in this directory. At minimum we publish:

| Owner name                            | Type | Target                | Purpose                          |
| ------------------------------------- | ---- | --------------------- | -------------------------------- |
| `_index._agents.breastcalculator.com` | SVCB | `breastcalculator.com`| Primary AI agent index endpoint  |
| `_a2a. _agents.breastcalculator.com`  | SVCB | `breastcalculator.com`| Agent-to-agent (A2A) endpoint    |
| `_https._agents.breastcalculator.com` | HTTPS| `breastcalculator.com`| HTTPS-specific discovery variant |

All records use **ServiceMode** (`SvcPriority = 1`) with `alpn` and
`port=443` parameters and DNSSEC signing on the parent zone.

## How an agent should consume this

1. Construct the discovery name, e.g. `_index._agents.breastcalculator.com`
2. Query DoH (Cloudflare: `https://cloudflare-dns.com/dns-query`,
   Google: `https://dns.google/resolve`) for the SVCB/HTTPS record
3. The `target` field tells the agent which hostname to connect to
4. The `alpn` and `port` params tell it which protocol/port to use
5. Fetch the `/.well-known/api-catalog` (linked from the homepage
   `Link` header) for the full endpoint inventory

## DNSSEC

The parent zone `breastcalculator.com` is DNSSEC-signed via Cloudflare.
Validating resolvers will return `AD` (Authenticated Data) for all
records under this domain, including the `_agents` subdomain.

## Why this matters

DNS is the most universal, low-latency, agent-friendly discovery
mechanism. By publishing DNS-AID records, we let agents find our
service with **one DNS query** — no HTML parsing, no link-header
discovery, no Sitemap fetching required.

## Spec references

- [draft-mozleywilliams-dnsop-dnsaid](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
- [RFC 9460 — SVCB and HTTPS RRtypes](https://www.rfc-editor.org/rfc/rfc9460)
- [RFC 9461 — Service Binding and Parameter Specification via the DNS (DNS SVCB & HTTPS)](https://www.rfc-editor.org/rfc/rfc9461)

## Validation

```
POST https://isitagentready.com/api/scan
Content-Type: application/json

{"url": "https://breastcalculator.com/"}
```

Should return `checks.discoverability.dnsAid.status == "pass"`.
