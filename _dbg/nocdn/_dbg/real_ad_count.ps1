# Real ad count (ins.adsbygoogle) vs wrapper count
$root = 'd:\DevProject\breastcalculator'
$allFiles = @()
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) {
  $allFiles += (Join-Path $a.FullName 'index.html')
}
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $allFiles += (Join-Path $root (Join-Path $d 'index.html'))
}
$allFiles += (Join-Path $root 'index.html')

Write-Host "=== Real <ins class=adsbygoogle> count (actual ad count) ==="
$totalRealAds = 0
$summary = @()
foreach ($f in $allFiles) {
  $c = [System.IO.File]::ReadAllText($f)
  $realAds = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
  $totalRealAds += $realAds
  $name = Split-Path (Split-Path $f -Parent) -Leaf
  $summary += [PSCustomObject]@{Page=$name; RealAds=$realAds}
}
$summary | Format-Table -AutoSize

Write-Host ("`nTotal real <ins> blocks: {0}" -f $totalRealAds)

# Check pages with 4+ real ads
$fourPlus = $summary | Where-Object { $_.RealAds -ge 4 }
Write-Host ("`nPages with 4+ real ads: {0}" -f $fourPlus.Count)
foreach ($p in $fourPlus) { Write-Host ("  {0}: {1} ads" -f $p.Page, $p.RealAds) }
