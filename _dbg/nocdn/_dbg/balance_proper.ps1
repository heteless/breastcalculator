# Proper balance check using File.ReadAllText (UTF-8)
$root = 'd:\DevProject\breastcalculator'
$targets = @()
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) {
  $targets += (Join-Path $a.FullName 'index.html')
}
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $targets += (Join-Path $root (Join-Path $d 'index.html'))
}
$targets += (Join-Path $root 'index.html')

$report = @()
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)
  $cs = [regex]::Replace($c, '(?s)<script\b[^>]*>.*?</script>', '')
  $cs = [regex]::Replace($cs, '(?s)<style\b[^>]*>.*?</style>', '')
  $cs = [regex]::Replace($cs, '(?s)<!--.*?-->', '')
  $pO = ([regex]::Matches($cs, '<p\b')).Count
  $pC = ([regex]::Matches($cs, '</p>')).Count
  $dO = ([regex]::Matches($cs, '<div\b')).Count
  $dC = ([regex]::Matches($cs, '</div>')).Count
  $name = Split-Path (Split-Path $f -Parent) -Leaf
  $status = if ($pO -eq $pC -and $dO -eq $dC) { 'OK' } else { 'IMBALANCE' }
  $report += [PSCustomObject]@{
    File = $name
    'P_Open' = $pO
    'P_Close' = $pC
    'Div_Open' = $dO
    'Div_Close' = $dC
    'Status' = $status
  }
}
$report | Format-Table -AutoSize

$errCount = ($report | Where-Object { $_.Status -eq 'IMBALANCE' }).Count
Write-Host ""
Write-Host ("Total files: {0}  Balanced: {1}  Imbalanced: {2}" -f $report.Count, ($report.Count - $errCount), $errCount)
