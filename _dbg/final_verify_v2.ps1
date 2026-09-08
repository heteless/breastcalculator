# Final verification: count ads across all pages
$root = 'd:\DevProject\breastcalculator'

$allHtml = Get-ChildItem -Path $root -Recurse -Filter '*.html' -ErrorAction SilentlyContinue
$allHtml = $allHtml | Where-Object {
  $_.FullName -notmatch '\\dist\\' -and
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\.next-dev-server\\' -and
  $_.FullName -notmatch '\.wrangler' -and
  $_.FullName -notmatch '\.well-known' -and
  $_.FullName -notmatch '\.backup' -and
  $_.FullName -notmatch '\\_dbg\\' -and
  $_.FullName -notmatch 'test-output' -and
  $_.Name -eq 'index.html'
}

$hasAd = 0
$noAd = 0
$totalIns = 0
$slotIn = 0
$slotBot = 0
$fourPlus = @()

foreach ($f in $allHtml) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
  $totalIns += $insCount
  if ($c -match '3789259624') { $slotIn++ }
  if ($c -match '4196453734') { $slotBot++ }
  if ($insCount -gt 0) {
    $hasAd++
    if ($insCount -ge 4) {
      $fourPlus += [PSCustomObject]@{Path=$f.FullName.Substring($root.Length+1); InsCount=$insCount}
    }
  } else {
    $noAd++
  }
}

Write-Host "========================================"
Write-Host "  AD DEPLOYMENT SUMMARY"
Write-Host "========================================"
Write-Host ("Total index.html scanned: {0}" -f $allHtml.Count)
Write-Host ("  With ads: {0}" -f $hasAd)
Write-Host ("  Without ads: {0}" -f $noAd)
Write-Host ""
Write-Host ("Total <ins class=adsbygoogle> blocks: {0}" -f $totalIns)
Write-Host ("Files with in-article slot (3789259624): {0}" -f $slotIn)
Write-Host ("Files with bottom slot (4196453734): {0}" -f $slotBot)
Write-Host ""
if ($fourPlus.Count -gt 0) {
  Write-Host "=== Pages with 4+ ads (AdSense violation) ==="
  foreach ($p in $fourPlus) { Write-Host ("  {0}: {1} ads" -f $p.Path, $p.InsCount) }
} else {
  Write-Host "=== No pages exceed 3 ads (AdSense compliant) ==="
}
