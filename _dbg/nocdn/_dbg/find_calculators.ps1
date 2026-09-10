# Find calculator pages
$calcDirs = @('bra-size-calculator', 'bra-size-guide', 'breast-volume', 'tools', 'best-comfort-bras', 'best-wireless-bras', 'bra-buying-guide', 'how-to-measure-bra-size', 'sports-bra-guide', 'wellness', 'specials', 'guide')
$root = 'd:\DevProject\breastcalculator'
$files = @()
foreach ($d in $calcDirs) {
  $p = Join-Path $root $d
  if (Test-Path $p) {
    $idx = Join-Path $p 'index.html'
    if (Test-Path $idx) { $files += $idx }
  }
}
foreach ($f in $files) {
  $c = Get-Content $f -Raw
  $hasAdsense = $c -match 'adsbygoogle'
  $insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
  $mainEnd = $c.LastIndexOf('</main>')
  Write-Host ("{0} -- adsbygoogle:{1} ins:{2} </main>at:{3}" -f (Split-Path (Split-Path $f -Parent) -Leaf), $hasAdsense, $insCount, $mainEnd)
}
