#!/usr/bin/env bash
# ============================================================================
# Add DNS-AID records to breastcalculator.com via Cloudflare API
# ============================================================================
# Prerequisites:
#   1. CLOUDFLARE_API_TOKEN env var with `Zone:DNS:Edit` permission
#   2. CLOUDFLARE_ZONE_ID env var (find in Cloudflare dashboard right sidebar)
#
# Usage:
#   export CLOUDFLARE_API_TOKEN=...
#   export CLOUDFLARE_ZONE_ID=...
#   ./cloudflare-api-curl.sh
# ============================================================================
set -euo pipefail

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN first}"
: "${CLOUDFLARE_ZONE_ID:?Set CLOUDFLARE_ZONE_ID first}"

API="https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records"
AUTH=(-H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}")
JSON=(-H "Content-Type: application/json")

# Helper: post a SVCB record
post_svcb() {
  local name="$1" alpn="$2" extra="${3:-}"
  local data=$(cat <<EOF
{
  "type": "SVCB",
  "name": "${name}",
  "ttl": 3600,
  "data": {
    "priority": 1,
    "target": "breastcalculator.com",
    "value": "alpn=\"${alpn}\" port=443 mandatory=alpn,port ${extra}"
  }
}
EOF
)
  echo "POST ${name} SVCB alpn=\"${alpn}\""
  curl -sS "${AUTH[@]}" "${JSON[@]}" -X POST "${API}" --data "${data}" | jq '.success, .errors'
  echo
}

# 1. Primary agent index
post_svcb "_index._agents.breastcalculator.com" "index"

# 2. Agent-to-agent
post_svcb "_a2a._agents.breastcalculator.com" "a2a"

# 3. MCP (Model Context Protocol) endpoint
post_svcb "_mcp._agents.breastcalculator.com" "mcp" 'key65001="https://breastcalculator.com/.well-known/llms.txt"'

# 4. LLM-friendly discovery
post_svcb "_llm._agents.breastcalculator.com" "llm" 'key65001="https://breastcalculator.com/.well-known/llms.txt"'

# 5. Search
post_svcb "_search._agents.breastcalculator.com" "search" 'key65001="https://breastcalculator.com/sitemap.xml"'

# 6. HTTPS variant
echo "POST _https._agents.breastcalculator.com HTTPS"
curl -sS "${AUTH[@]}" "${JSON[@]}" -X POST "${API}" --data '{
  "type": "HTTPS",
  "name": "_https._agents.breastcalculator.com",
  "ttl": 3600,
  "data": {
    "priority": 1,
    "target": "breastcalculator.com",
    "value": "alpn=\"h2,h3\" port=443 mandatory=alpn,port"
  }
}' | jq '.success, .errors'

echo
echo "All DNS-AID records posted. Now enable DNSSEC in:"
echo "  Dashboard -> breastcalculator.com -> DNS -> Settings -> DNSSEC"
