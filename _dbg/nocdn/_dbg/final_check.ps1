# Final comprehensive verification
$root = 'd:\DevProject\breastcalculator'

# Build full target list
$inArticleTargets = @()
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) {
  $inArticleTargets += (Join-Path $a.FullName 'index.html')
}

$bottomTargets = @()
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $bottomTargets += (Join-Path $root (Join-Path $d 'index.html'))
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
  if ($cnt -ge 25) { $bottomTargets += $f }
}

$heroFile = Join-Path $root 'index.html'

# Check
$inOK = 0
foreach ($f in $inArticleTargets) { if ((Get-Content $f -Raw) -match '3789259624') { $inOK++ } }
$botOK = 0
foreach ($f in $bottomTargets) { if ((Get-Content $f -Raw) -match '4196453734') { $botOK++ } }
$heroOK = ((Get-Content $heroFile -Raw) -match '4196453734')

# Per-page ins count summary
Write-Host "=== Per-page ad unit counts ==="
$allFiles = @()
foreach ($f in $inArticleTargets) { $allFiles += [PSCustomObject]@{File=(Split-Path (Split-Path $f -Parent) -Leaf); InArticle=$true; BottomAd=(Get-Content $f -Raw) -match '4196453734'} }
foreach ($f in $bottomTargets) {
  $name = (Split-Path (Split-Path $f -Parent) -Leaf)
  $existing = $allFiles | Where-Object { $_.File -eq $name }
  if ($existing) { $existing.BottomAd = $true } else { $allFiles += [PSCustomObject]@{File=$name; InArticle=$false; BottomAd=$true} }
}
$homeContent = Get-Content $heroFile -Raw
$allFiles += [PSCustomObject]@{File='index.html (home)'; InArticle=$false; BottomAd=($homeContent -match '4196453734')}

$allFiles | Format-Table -AutoSize

# Tag balance check
Write-Host "=== HTML tag balance for all targets ==="
$allCheck = $inArticleTargets + $bottomTargets + @($heroFile)
$errCount = 0
foreach ($f in $allCheck) {
  $c = Get-Content $f -Raw
  $pO = ([regex]::Matches($c, '<p\b')).Count
  $pC = ([regex]::Matches($c, '</p>')).Count
  $dO = ([regex]::Matches($c, '<div\b')).Count
  $dC = ([regex]::Matches($c, '</div>')).Count
  if ($pO -ne $pC -or $dO -ne $dC) {
    $name = Split-Path (Split-Path $f -Parent) -Leaf
    Write-Host ("[BALANCE ERROR] {0}  <p>:{1}/{2}  <div>:{3}/{4}" -f $name, $pO, $pC, $dO, $dC)
    $errCount++
  }
}
if ($errCount -eq 0) {
  Write-Host "All targets have balanced <p> and <div> tags."
}

Write-Host ""
Write-Host "=== Final Summary ==="
Write-Host ("In-article ads  (slot 3789259624): {0}/{1} pages" -f $inOK, $inArticleTargets.Count)
Write-Host ("Bottom/Hero ads (slot 4196453734): {0}/{1} pages" -f $botOK, $bottomTargets.Count)
Write-Host ("Homepage hero ad inserted: {0}" -f $heroOK)
Write-Host ("HTML balance errors: {0}" -f $errCount)
Write-Host ("Total <ins class=adsbygoogle> blocks: {0}" -f (($inOK + $botOK + $(if($heroOK){1}else{0}))))
