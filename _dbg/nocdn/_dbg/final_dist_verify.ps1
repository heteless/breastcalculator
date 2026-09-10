# Final comprehensive verification of all ad placements
$root = 'd:\DevProject\breastcalculator'

$articleRoot = Join-Path $root 'article'
$articleFiles = @()
foreach ($a in (Get-ChildItem -Path $articleRoot -Directory)) {
  $articleFiles += (Join-Path $a.FullName 'index.html')
}

$calcDirs = @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')
$calcFiles = @()
foreach ($d in $calcDirs) {
  $calcFiles += (Join-Path $root (Join-Path $d 'index.html'))
}

$allFiles = $articleFiles + $calcFiles + @((Join-Path $root 'index.html'))

Write-Host "=========================================="
Write-Host "  AD DISTRIBUTION SUMMARY"
Write-Host "=========================================="
$summary = @()
foreach ($f in $allFiles) {
  $c = [System.IO.File]::ReadAllText($f)
  $inArticle = ([regex]::Matches($c, 'class="article-in-ad"')).Count
  $middle = ([regex]::Matches($c, 'class="article-middle-ad"')).Count
  $bottom = ([regex]::Matches($c, 'class="article-bottom-ad"')).Count
  $hero = ([regex]::Matches($c, 'class="hero-ad-slot"')).Count
  $slotIn = ($c -match '3789259624')
  $slotBot = ([regex]::Matches($c, '4196453734')).Count
  $total = $inArticle + $middle + $bottom + $hero
  $name = Split-Path (Split-Path $f -Parent) -Leaf
  $summary += [PSCustomObject]@{
    Page = $name
    'InArticle' = $inArticle
    'Middle' = $middle
    'Bottom' = $bottom
    'Hero' = $hero
    'Total' = $total
    'SlotIn(3789)' = $slotIn
    'SlotBot(4196)' = $slotBot
  }
}
$summary | Format-Table -AutoSize

# Totals
$totIn = ($summary | Measure-Object -Property InArticle -Sum).Sum
$totMid = ($summary | Measure-Object -Property Middle -Sum).Sum
$totBot = ($summary | Measure-Object -Property Bottom -Sum).Sum
$totHero = ($summary | Measure-Object -Property Hero -Sum).Sum
$totAll = ($summary | Measure-Object -Property Total -Sum).Sum

Write-Host ""
Write-Host "=== TOTALS ==="
Write-Host ("  In-Article ads: {0}" -f $totIn)
Write-Host ("  Middle ads: {0}" -f $totMid)
Write-Host ("  Bottom ads: {0}" -f $totBot)
Write-Host ("  Hero ads: {0}" -f $totHero)
Write-Host ("  TOTAL <ins> blocks: {0}" -f $totAll)

# Check pages with 3+ ads
Write-Host ""
Write-Host "=== Pages with 3+ ads (AdSense max per page) ==="
$threePlus = $summary | Where-Object { $_.Total -ge 3 }
Write-Host ("  Count: {0}" -f $threePlus.Count)
foreach ($p in $threePlus) { Write-Host ("    {0}: {1} ads" -f $p.Page, $p.Total) }

# Check pages with 4+ ads (would violate AdSense policy)
$fourPlus = $summary | Where-Object { $_.Total -ge 4 }
if ($fourPlus.Count -gt 0) {
  Write-Host ""
  Write-Host "=== WARNING: Pages with 4+ ads (AdSense violation) ==="
  foreach ($p in $fourPlus) { Write-Host ("    {0}: {1} ads" -f $p.Page, $p.Total) }
} else {
  Write-Host ""
  Write-Host "=== No pages exceed 3 ads (AdSense compliant) ==="
}
