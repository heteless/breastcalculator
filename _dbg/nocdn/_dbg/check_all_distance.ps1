# Check all 143 ad pages and their in-article distance from h1
$root = 'd:\DevProject\breastcalculator'
$allHtml = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -ErrorAction SilentlyContinue
$allHtml = $allHtml | Where-Object {
  $_.FullName -notmatch '\\dist\\' -and
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\.next-dev-server\\' -and
  $_.FullName -notmatch '\.wrangler' -and
  $_.FullName -notmatch '\.well-known' -and
  $_.FullName -notmatch '\.backup' -and
  $_.FullName -notmatch '\\_dbg\\'
}

$inArtPattern = '(?is)\s*<!--\s*(?:AdSense\s+)?In-Article Ad\s*-->\s*<div[^>]*class="article-in-ad"[^>]*>.*?</div>'
$h1Pattern = '(?is)<h1\b[^>]*>.*?</h1>'

$report = @()
foreach ($f in $allHtml) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  if ($c -notmatch '3789259624') { continue }
  $rel = $f.FullName.Substring($root.Length+1)
  $inArtMatch = [regex]::Match($c, $inArtPattern)
  $h1Match = [regex]::Match($c, $h1Pattern)
  if ($inArtMatch.Success -and $h1Match.Success) {
    $distance = $inArtMatch.Index - $h1Match.Index
    $report += [PSCustomObject]@{File=$rel; Distance=$distance}
  }
}

# Show stats
Write-Host ("Total ad pages with in-article: {0}" -f $report.Count)
$avg = ($report | Measure-Object -Property Distance -Average).Average
$max = ($report | Measure-Object -Property Distance -Maximum).Maximum
$min = ($report | Measure-Object -Property Distance -Minimum).Minimum
Write-Host ("Average distance: {0:N0}" -f $avg)
Write-Host ("Max distance: {0}" -f $max)
Write-Host ("Min distance: {0}" -f $min)

# Distribution
$lt200 = ($report | Where-Object { $_.Distance -lt 200 }).Count
$lt500 = ($report | Where-Object { $_.Distance -lt 500 }).Count
$lt1000 = ($report | Where-Object { $_.Distance -lt 1000 }).Count
$lt2000 = ($report | Where-Object { $_.Distance -lt 2000 }).Count
$gt2000 = ($report | Where-Object { $_.Distance -ge 2000 }).Count
Write-Host ("Distribution:")
Write-Host ("  < 200 chars: {0}" -f $lt200)
Write-Host ("  < 500 chars: {0}" -f $lt500)
Write-Host ("  < 1000 chars: {0}" -f $lt1000)
Write-Host ("  < 2000 chars: {0}" -f $lt2000)
Write-Host ("  >= 2000 chars: {0}" -f $gt2000)

# Show pages with >1000 char distance (could still be optimized)
Write-Host "`nPages with distance > 1000:"
$report | Where-Object { $_.Distance -gt 1000 } | Sort-Object Distance -Descending | Format-Table -AutoSize
