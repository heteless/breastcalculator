$ErrorActionPreference = "Stop"

# Credentials must be supplied via environment variables.
# DO NOT hard-code tokens in this file. If a token was committed, rotate it
# at https://dash.cloudflare.com/profile/api-tokens immediately.
if (-not $env:CLOUDFLARE_API_TOKEN) {
  Write-Host "ERROR: Set $env:CLOUDFLARE_API_TOKEN first (Cloudflare API token with Zone:DNS:Edit)." -ForegroundColor Red
  exit 1
}
if (-not $env:CLOUDFLARE_ZONE_ID) {
  Write-Host "ERROR: Set $env:CLOUDFLARE_ZONE_ID first (zone ID from Cloudflare dashboard sidebar)." -ForegroundColor Red
  exit 1
}

$API = "https://api.cloudflare.com/client/v4/zones/$($env:CLOUDFLARE_ZONE_ID)/dns_records"
$headers = @{
  "Authorization" = "Bearer $env:CLOUDFLARE_API_TOKEN"
  "Content-Type"  = "application/json"
}

# Use a generic List<object> so += works
$results = New-Object System.Collections.Generic.List[object]

function Post-Record($rec) {
  $body = $rec | ConvertTo-Json -Depth 8
  try {
    $r = Invoke-RestMethod -Uri $API -Method Post -Headers $headers -Body $body
    $results.Add([PSCustomObject]@{
      name = $rec.name
      type = $rec.type
      ok   = $r.success
      id   = $r.result.id
      msg  = if ($r.success) { "OK" } else { ($r.errors | ConvertTo-Json -Compress) }
    })
  } catch {
    $results.Add([PSCustomObject]@{
      name = $rec.name
      type = $rec.type
      ok   = $false
      id   = "-"
      msg  = $_.Exception.Message
    })
  }
}

# 1. Primary agent index
Post-Record @{
  type = "SVCB"
  name = "_index._agents.breastcalculator.com"
  ttl  = 3600
  data = @{
    priority = 1
    target   = "breastcalculator.com"
    value    = 'alpn="index" port=443 mandatory=alpn,port'
  }
}

# 2. A2A endpoint
Post-Record @{
  type = "SVCB"
  name = "_a2a._agents.breastcalculator.com"
  ttl  = 3600
  data = @{
    priority = 1
    target   = "breastcalculator.com"
    value    = 'alpn="a2a" port=443 mandatory=alpn,port'
  }
}

# 3. MCP endpoint
Post-Record @{
  type = "SVCB"
  name = "_mcp._agents.breastcalculator.com"
  ttl  = 3600
  data = @{
    priority = 1
    target   = "breastcalculator.com"
    value    = 'alpn="mcp" port=443 mandatory=alpn,port key65001="https://breastcalculator.com/.well-known/llms.txt" key65002="1.0.0" key65003="calculator,article,wellness,bra-size"'
  }
}

# 4. LLM endpoint
Post-Record @{
  type = "SVCB"
  name = "_llm._agents.breastcalculator.com"
  ttl  = 3600
  data = @{
    priority = 1
    target   = "breastcalculator.com"
    value    = 'alpn="llm" port=443 mandatory=alpn,port key65001="https://breastcalculator.com/.well-known/llms.txt" key65002="1.0.0" key65003="qa,summarize,extract"'
  }
}

# 5. Search endpoint
Post-Record @{
  type = "SVCB"
  name = "_search._agents.breastcalculator.com"
  ttl  = 3600
  data = @{
    priority = 1
    target   = "breastcalculator.com"
    value    = 'alpn="search" port=443 mandatory=alpn,port key65001="https://breastcalculator.com/sitemap.xml" key65002="1.0.0" key65003="boolean,keyword"'
  }
}

# 6. HTTPS variant
Post-Record @{
  type = "HTTPS"
  name = "_https._agents.breastcalculator.com"
  ttl  = 3600
  data = @{
    priority = 1
    target   = "breastcalculator.com"
    value    = 'alpn="h2,h3" port=443 mandatory=alpn,port'
  }
}

# === Print results ===
$results | Format-Table -AutoSize

$ok    = @($results | Where-Object { $_.ok }).Count
$fail  = @($results | Where-Object { -not $_.ok }).Count

Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host ("Total   : " + $results.Count)
Write-Host ("Success : $ok")
Write-Host ("Failed  : $fail")

# Try enabling DNSSEC (best-effort)
Write-Host ""
Write-Host "=== Enabling DNSSEC ===" -ForegroundColor Cyan
try {
  $ds = Invoke-RestMethod `
    -Uri "https://api.cloudflare.com/client/v4/zones/$($env:CLOUDFLARE_ZONE_ID)/dnssec" `
    -Method Post -Headers $headers -Body "{}"
  Write-Host ("DNSSEC status: " + $ds.result.status)
  if ($ds.result.ds) { Write-Host ("DS record: " + $ds.result.ds) }
} catch {
  Write-Host ("DNSSEC: " + $_.Exception.Message)
  Write-Host "You can enable DNSSEC manually in: Dashboard -> breastcalculator.com -> DNS -> Settings -> DNSSEC"
}
