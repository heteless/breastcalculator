# Verify preconnect and min-height fixes
$root = 'd:\DevProject\breastcalculator'

$targets = @()
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) {
  $targets += (Join-Path $a.FullName 'index.html')
}
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $targets += (Join-Path $root (Join-Path $d 'index.html'))
}
$targets += (Join-Path $root 'index.html')

Write-Host "=== Preconnect verification ==="
$pcCount = 0
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)
  $hasPC1 = $c -match 'preconnect[^>]*pagead2\.googlesyndication\.com'
  $hasPC2 = $c -match 'preconnect[^>]*googleads\.g\.doubleclick\.net'
  $hasPC3 = $c -match 'preconnect[^>]*www\.googletagmanager\.com'
  if ($hasPC1 -and $hasPC2 -and $hasPC3) { $pcCount++ }
}
Write-Host ("  All 3 preconnects present: {0}/{1}" -f $pcCount, $targets.Count)

Write-Host "`n=== Min-height verification ==="
$inCount = 0
$inTotal = 0
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) {
  $f = Join-Path $a.FullName 'index.html'
  $c = [System.IO.File]::ReadAllText($f)
  $inTotal++
  if ($c -match 'article-in-ad"[^>]*style="[^"]*min-height:260px') { $inCount++ }
}
Write-Host ("  In-article min-height:260px: {0}/{1}" -f $inCount, $inTotal)

$botCount = 0
$botTotal = 0
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $f = Join-Path $root (Join-Path $d 'index.html')
  $c = [System.IO.File]::ReadAllText($f)
  $botTotal++
  if ($c -match 'article-bottom-ad"[^>]*style="[^"]*min-height:120px') { $botCount++ }
}
$pattern = '(?is)<p\b[^>]*>.*?</p>'
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) {
  $f = Join-Path $a.FullName 'index.html'
  $c = [System.IO.File]::ReadAllText($f)
  $ms = [regex]::Matches($c, $pattern)
  $cnt = 0
  foreach ($m in $ms) {
    $t = $m.Groups[0].Value.Substring(0, $m.Groups[0].Value.IndexOf('>') + 1)
    if ($t -notmatch 'class="byline"|class="subtitle"') { $cnt++ }
  }
  if ($cnt -ge 25) {
    $botTotal++
    if ($c -match 'article-bottom-ad"[^>]*style="[^"]*min-height:120px') { $botCount++ }
  }
}
Write-Host ("  Bottom ad min-height:120px: {0}/{1}" -f $botCount, $botTotal)

# Hero
$heroFile = Join-Path $root 'index.html'
$hc = [System.IO.File]::ReadAllText($heroFile)
$heroOK = $hc -match 'hero-ad-slot"[^>]*style="[^"]*min-height:100px'
Write-Host ("  Hero ad min-height:100px: {0}" -f $(if($heroOK){"OK"}else{"FAIL"}))

Write-Host "`n=== Sanity: ad slots still present ==="
$totalSlot = 0
$okSlot = 0
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)
  $insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
  $totalSlot += $insCount
  if ($c -match '3789259624|4196453734') { $okSlot++ }
}
Write-Host ("  Total <ins class=adsbygoogle> blocks: {0}" -f $totalSlot)
Write-Host ("  Files with at least 1 slot: {0}/{1}" -f $okSlot, $targets.Count)

# Sample after-fix context
Write-Host "`n=== Sample: why-80-percent-wrong-bra-size after all fixes ==="
$f = Join-Path $root 'article\why-80-percent-wrong-bra-size\index.html'
$lines = Get-Content $f
for ($i=0; $i -lt 12; $i++) {
  Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim())
}
