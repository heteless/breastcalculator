# Final verification: confirm every targeted page has all expected ad units
$root = 'd:\DevProject\breastcalculator'

# Pages expected to have in-article ad (slot 3789259624)
$inArticlePages = @()
$articleRoot = Join-Path $root 'article'
foreach ($a in (Get-ChildItem -Path $articleRoot -Directory)) {
  $inArticlePages += (Join-Path $a.FullName 'index.html')
}

# Pages expected to have bottom ad (slot 4196453734)
$bottomPages = @()
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $bottomPages += (Join-Path $root (Join-Path $d 'index.html'))
}
# Long articles
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
  if ($cnt -ge 25) { $bottomPages += $f }
}

$report = @()
function Check-File($f, $expectedInsSlots, $label) {
  $c = Get-Content $f -Raw
  $obj = [ordered]@{File=$label}
  foreach ($slot in $expectedInsSlots) {
    $obj["slot $slot"] = $c -match "data-ad-slot=`"$slot`"|data-ad-slot='$slot'"
  }
  $obj['adsbygoogle.js loader'] = $c -match 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
  $obj['has push({})'] = $c -match '\(adsbygoogle = window.adsbygoogle \|\| \[\]\).push\(\{\}\)'
  return [PSCustomObject]$obj
}

# In-article check (18 articles)
Write-Host "=== In-Article Ads (slot 3789259624) ==="
foreach ($f in $inArticlePages) {
  $name = (Split-Path (Split-Path $f -Parent) -Leaf)
  $r = Check-File $f @('3789259624') $name
  $report += $r
}
$report | Format-Table -AutoSize

$report = @()
Write-Host "`n=== Bottom Ads (slot 4196453734) ==="
foreach ($f in $bottomPages) {
  $name = (Split-Path (Split-Path $f -Parent) -Leaf)
  $r = Check-File $f @('4196453734') $name
  $report += $r
}
$report | Format-Table -AutoSize

# Summary
Write-Host "`n=== Missing ad check ==="
$root2 = $root
$totalIn = 0; $okIn = 0
foreach ($f in $inArticlePages) {
  $totalIn++
  $c = Get-Content $f -Raw
  if ($c -match '3789259624') { $okIn++ }
}
$totalBot = 0; $okBot = 0
foreach ($f in $bottomPages) {
  $totalBot++
  $c = Get-Content $f -Raw
  if ($c -match '4196453734') { $okBot++ }
}
Write-Host ("In-article: {0}/{1} pages OK" -f $okIn, $totalIn)
Write-Host ("Bottom:     {0}/{1} pages OK" -f $okBot, $totalBot)
