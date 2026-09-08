# Final verification after aesthetic fixes
$root = 'd:\DevProject\breastcalculator'

$articleRoot = Join-Path $root 'article'
$targets = @()
foreach ($a in (Get-ChildItem -Path $articleRoot -Directory)) {
  $targets += (Join-Path $a.FullName 'index.html')
}
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $targets += (Join-Path $root (Join-Path $d 'index.html'))
}
$targets += (Join-Path $root 'index.html')

# Check 1: In-article ads have width:100% (not max-width:680px)
Write-Host "=== Issue 1: In-article width check (should have width:100% NOT max-width:680px) ==="
$inFiles = @()
foreach ($a in (Get-ChildItem -Path $articleRoot -Directory)) { $inFiles += (Join-Path $a.FullName 'index.html') }
$inOK = 0; $inBad = 0
foreach ($f in $inFiles) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c -match 'class="article-in-ad"[^>]*style="[^"]*width:100%' -and $c -notmatch 'article-in-ad"[^>]*style="[^"]*max-width:680px') {
    $inOK++
  } else {
    $inBad++
    $name = (Split-Path (Split-Path $f -Parent) -Leaf)
    Write-Host ("  [BAD] {0}" -f $name)
  }
}
Write-Host ("  OK: {0}/{1}" -f $inOK, $inFiles.Count)

# Check 2: Bottom ads have sand-light background
Write-Host "`n=== Issue 4: Bottom ad background (should be var(--sand-light) NOT var(--bg-card)) ==="
$botFiles = @()
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $botFiles += (Join-Path $root (Join-Path $d 'index.html'))
}
$pattern = '(?is)<p\b[^>]*>.*?</p>'
foreach ($a in (Get-ChildItem -Path $articleRoot -Directory)) {
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

$botOK = 0; $botBad = 0
foreach ($f in $botFiles) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c -match 'class="article-bottom-ad"[^>]*style="[^"]*var\(--sand-light\)' -and $c -notmatch 'article-bottom-ad"[^>]*style="[^"]*var\(--bg-card\)') {
    $botOK++
  } else {
    $botBad++
    $name = (Split-Path (Split-Path $f -Parent) -Leaf)
    Write-Host ("  [BAD] {0}" -f $name)
  }
}
Write-Host ("  OK: {0}/{1}" -f $botOK, $botFiles.Count)

# Check 3: Bottom ad max-width
Write-Host "`n=== Issue 5: Bottom ad width (should be min(100%, 960px) NOT 980px) ==="
$wOK = 0; $wBad = 0
foreach ($f in $botFiles) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c -match 'article-bottom-ad"[^>]*style="[^"]*max-width:min\(100%, 960px\)' -and $c -notmatch 'article-bottom-ad"[^>]*style="[^"]*max-width:980px') {
    $wOK++
  } else {
    $wBad++
  }
}
Write-Host ("  OK: {0}/{1}" -f $wOK, $botFiles.Count)

# Check 4: AdSense slot codes still present (no breakage)
Write-Host "`n=== Sanity: ad slots still present ==="
$allFiles = $inFiles + $botFiles + @(Join-Path $root 'index.html')
$slotIn = 0
foreach ($f in $inFiles) { if ((Get-Content $f -Raw) -match '3789259624') { $slotIn++ } }
$slotBot = 0
foreach ($f in $botFiles) { if ((Get-Content $f -Raw) -match '4196453734') { $slotBot++ } }
$slotHero = ((Get-Content (Join-Path $root 'index.html') -Raw) -match '4196453734')
Write-Host ("  In-article slot 3789259624: {0}/{1}" -f $slotIn, $inFiles.Count)
Write-Host ("  Bottom/Hero slot 4196453734: {0}/{1} + homepage:{2}" -f $slotBot, $botFiles.Count, $slotHero)
