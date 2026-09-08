# Research potential aesthetic issues with ad placements
# 1. Check article body max-width vs ad max-width
# 2. Check the CSS for article body styling
# 3. Check spacing/margins of inserted ads

# Find article body max-width
$f = 'd:\DevProject\breastcalculator\article\why-80-percent-wrong-bra-size\index.html'
$c = Get-Content $f -Raw
$lines = Get-Content $f

# Look for <article> tag attributes
Write-Host "=== Article body containers ==="
$containers = Select-String -InputObject $c -Pattern '<article[^>]*>|<main[^>]*>|<section[^>]*class="(article|content|body)'
foreach ($m in $containers.Matches) {
  $val = $m.Value
  if ($val.Length -gt 200) { $val = $val.Substring(0, 200) + "..." }
  Write-Host ("  {0}" -f $val)
}

# Check the main.css for article-related styles
Write-Host "`n=== Article-related CSS rules ==="
$css = Get-Content 'd:\DevProject\breastcalculator\main.css' -Raw
$cssRules = Select-String -InputObject $css -Pattern '\.article[^{]*\{[^}]*max-width[^}]*\}|\.article[^{]*\{[^}]*width[^}]*\}' -AllMatches
foreach ($m in $cssRules.Matches) {
  $val = $m.Value
  if ($val.Length -gt 300) { $val = $val.Substring(0, 300) + "..." }
  Write-Host ("  {0}" -f $val)
}
