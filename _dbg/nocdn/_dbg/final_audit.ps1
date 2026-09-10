# Final comprehensive verification across all 6 phases
$root = 'd:\DevProject\breastcalculator'

$targets = @()
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) {
  $targets += (Join-Path $a.FullName 'index.html')
}
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $targets += (Join-Path $root (Join-Path $d 'index.html'))
}
$targets += (Join-Path $root 'index.html')

Write-Host "========================================"
Write-Host "  PHASE 1: In-Article Ad Placement"
Write-Host "========================================"
$inFiles = @()
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) { $inFiles += (Join-Path $a.FullName 'index.html') }
$inOK = 0
foreach ($f in $inFiles) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c -match '3789259624' -and $c -match 'article-in-ad' -and $c -match 'min-height:260px' -and $c -match 'width:100%') { $inOK++ }
}
Write-Host ("  In-article (slot 3789259624 + container + min-height:260 + width:100%): {0}/{1}" -f $inOK, $inFiles.Count)

Write-Host ""
Write-Host "========================================"
Write-Host "  PHASE 2: Bottom Ad Placement"
Write-Host "========================================"
$botFiles = @()
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $botFiles += (Join-Path $root (Join-Path $d 'index.html'))
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
  if ($cnt -ge 25) { $botFiles += $f }
}
$botOK = 0
foreach ($f in $botFiles) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c -match '4196453734' -and $c -match 'article-bottom-ad' -and $c -match 'min-height:120px' -and $c -match 'var\(--sand-light\)' -and $c -match 'min\(100%, 960px\)') { $botOK++ }
}
Write-Host ("  Bottom ad (slot 4196453734 + container + min-height:120 + sand-light bg + width min(100%, 960px)): {0}/{1}" -f $botOK, $botFiles.Count)

Write-Host ""
Write-Host "========================================"
Write-Host "  PHASE 3: Hero Ad Placement"
Write-Host "========================================"
$heroFile = Join-Path $root 'index.html'
$hc = [System.IO.File]::ReadAllText($heroFile)
$heroOK = $hc -match '4196453734' -and $hc -match 'hero-ad-slot' -and $hc -match 'min-height:100px' -and $hc -match 'min\(100%, 970px\)'
Write-Host ("  Hero ad on homepage: {0}" -f $(if($heroOK){"OK"}else{"FAIL"}))

Write-Host ""
Write-Host "========================================"
Write-Host "  PHASE 4: Preconnect Hints"
Write-Host "========================================"
$pcOK = 0
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c -match 'preconnect[^>]*pagead2\.googlesyndication\.com' -and $c -match 'preconnect[^>]*googleads\.g\.doubleclick\.net' -and $c -match 'preconnect[^>]*www\.googletagmanager\.com') { $pcOK++ }
}
Write-Host ("  All 3 preconnect hints in <head>: {0}/{1}" -f $pcOK, $targets.Count)

Write-Host ""
Write-Host "========================================"
Write-Host "  PHASE 5: AdSense Loader & Push Scripts"
Write-Host "========================================"
$loaderOK = 0
$pushOK = 0
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c -match 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js') { $loaderOK++ }
  if ($c -match '\(adsbygoogle = window.adsbygoogle \|\| \[\]\).push\(\{\}\)') { $pushOK++ }
}
Write-Host ("  adsbygoogle.js loader: {0}/{1}" -f $loaderOK, $targets.Count)
Write-Host ("  push({{}}) scripts: {0}/{1}" -f $pushOK, $targets.Count)

Write-Host ""
Write-Host "========================================"
Write-Host "  PHASE 6: HTML Tag Balance"
Write-Host "========================================"
$errCount = 0
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)
  $cs = [regex]::Replace($c, '(?s)<script\b[^>]*>.*?</script>', '')
  $cs = [regex]::Replace($cs, '(?s)<style\b[^>]*>.*?</style>', '')
  $cs = [regex]::Replace($cs, '(?s)<!--.*?-->', '')
  $pO = ([regex]::Matches($cs, '<p\b')).Count
  $pC = ([regex]::Matches($cs, '</p>')).Count
  $dO = ([regex]::Matches($cs, '<div\b')).Count
  $dC = ([regex]::Matches($cs, '</div>')).Count
  if ($pO -ne $pC -or $dO -ne $dC) {
    $name = Split-Path (Split-Path $f -Parent) -Leaf
    if (-not ($name -eq 'breastcalculator' -and $pO -eq $pC -and ($dO - $dC) -eq 1)) {
      $errCount++
      Write-Host ("  [ERR] {0}  <p>:{1}/{2}  <div>:{3}/{4}" -f $name, $pO, $pC, $dO, $dC)
    }
  }
}
Write-Host ("  Tag balance errors (excluding pre-existing homepage): {0}" -f $errCount)

Write-Host ""
Write-Host "========================================"
Write-Host "  TOTAL AD UNITS"
Write-Host "========================================"
$totalIns = 0
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)
  $totalIns += ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
}
Write-Host ("  Total <ins class=adsbygoogle> blocks: {0}" -f $totalIns)
Write-Host ("  Total target pages: {0}" -f $targets.Count)
