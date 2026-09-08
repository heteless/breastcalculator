# Verify bottom ad insertion
$root = 'd:\DevProject\breastcalculator'
$dirs = @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')
$summary = @()
foreach ($d in $dirs) {
  $f = Join-Path $root (Join-Path $d 'index.html')
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    $hasBottom = $c -match '4196453734'
    $pOpen = ([regex]::Matches($c, '<p\b')).Count
    $pClose = ([regex]::Matches($c, '</p>')).Count
    $divOpen = ([regex]::Matches($c, '<div\b')).Count
    $divClose = ([regex]::Matches($c, '</div>')).Count
    $obj = [PSCustomObject]@{
      File = $d
      'HasBottomAd' = $hasBottom
      'P_Open' = $pOpen
      'P_Close' = $pClose
      'Div_Open' = $divOpen
      'Div_Close' = $divClose
    }
    $summary += $obj
  }
}
$articles = Get-ChildItem -Path (Join-Path $root 'article') -Directory
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    $hasBottom = $c -match '4196453734'
    $hasInArticle = $c -match '3789259624'
    $pOpen = ([regex]::Matches($c, '<p\b')).Count
    $pClose = ([regex]::Matches($c, '</p>')).Count
    $divOpen = ([regex]::Matches($c, '<div\b')).Count
    $divClose = ([regex]::Matches($c, '</div>')).Count
    $obj = [PSCustomObject]@{
      File = $a.Name
      'HasBottomAd' = $hasBottom
      'HasInArticle' = $hasInArticle
      'P_Open' = $pOpen
      'P_Close' = $pClose
      'Div_Open' = $divOpen
      'Div_Close' = $divClose
    }
    $summary += $obj
  }
}
$summary | Format-Table -AutoSize

# Show context around bottom ad for one article
Write-Host "`n--- Sample context (why-80-percent-wrong-bra-size) ---"
$f = Join-Path $root 'article\why-80-percent-wrong-bra-size\index.html'
$lines = Get-Content $f
$adLine = -1
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '4196453734') { $adLine = $i; break }
}
if ($adLine -gt 0) {
  $start = [Math]::Max(0, $adLine - 6)
  $end = [Math]::Min($lines.Length - 1, $adLine + 10)
  for ($i=$start; $i -le $end; $i++) {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim())
  }
}
