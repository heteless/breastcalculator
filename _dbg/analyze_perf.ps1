# Analyze the current ad-related performance setup
$f = 'd:\DevProject\breastcalculator\index.html'
$c = [System.IO.File]::ReadAllText($f)

# Find ad-related elements in head
Write-Host "=== Ad-related tags in <head> ==="
$headMatch = [regex]::Match($c, '(?s)<head[^>]*>(.*?)</head>')
if ($headMatch.Success) {
  $head = $headMatch.Groups[1].Value
  $adScripts = Select-String -InputObject $head -Pattern '<link[^>]*adsense|<link[^>]*googlesyndication|<link[^>]*doubleclick|<script[^>]*googlesyndication|<script[^>]*adsbygoogle' -AllMatches
  foreach ($m in $adScripts.Matches) {
    Write-Host ("  {0}" -f $m.Value)
  }
  if ($adScripts.Matches.Count -eq 0) {
    Write-Host "  (none - no preconnect/dns-prefetch hints)"
  }
}

# Check if preconnect is used anywhere
Write-Host "`n=== preconnect / dns-prefetch hints in document ==="
$preconnects = [regex]::Matches($c, '<link[^>]*rel="(preconnect|dns-prefetch)"[^>]*>')
foreach ($m in $preconnects) {
  Write-Host ("  {0}" -f $m.Value.Substring(0, [Math]::Min(200, $m.Value.Length)))
}
if ($preconnects.Count -eq 0) {
  Write-Host "  (no preconnect hints anywhere)"
}

# Check current ad container min-heights
Write-Host "`n=== Current ad container min-heights ==="
$containers = [regex]::Matches($c, '<div[^>]*article-(in|bottom)-ad[^>]*style="[^"]*"[^>]*>')
foreach ($m in $containers) {
  Write-Host ("  {0}" -f $m.Value.Substring(0, [Math]::Min(200, $m.Value.Length)))
}
$heroContainer = [regex]::Match($c, '<div[^>]*hero-ad-slot[^>]*>')
if ($heroContainer.Success) {
  Write-Host ("  HERO: {0}" -f $heroContainer.Value.Substring(0, [Math]::Min(200, $heroContainer.Value.Length)))
}
