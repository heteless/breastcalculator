# Check the 114 high-priority pages (fixed)
$root = 'd:\DevProject\breastcalculator'
$highPriorityDirs = @('bra-size-guide', 'wellness', 'tools', 'specials', 'guide')

$inArtPattern = '(?is)\s*<!--\s*AdSense In-Article Ad\s*-->\s*<div[^>]*class="article-in-ad"[^>]*>.*?</div>'
$h1Pattern = '(?is)<h1\b[^>]*>.*?</h1>'

$report = @()
foreach ($d in $highPriorityDirs) {
  $dp = Join-Path $root $d
  if (-not (Test-Path $dp)) { continue }
  Get-ChildItem -Path $dp -Recurse -Filter 'index.html' | ForEach-Object {
    $f = $_.FullName
    $c = [System.IO.File]::ReadAllText($f)
    if ($c -notmatch '3789259624') { return }
    $rel = $f.Substring($root.Length+1)
    $inArtMatch = [regex]::Match($c, $inArtPattern)
    $h1Match = [regex]::Match($c, $h1Pattern)
    if ($inArtMatch.Success -and $h1Match.Success) {
      $distance = $inArtMatch.Index - $h1Match.Index
      $report += [PSCustomObject]@{
        File = $rel
        Distance = $distance
      }
    }
  }
}
$report | Format-Table -AutoSize
Write-Host ("`nTotal: {0}" -f $report.Count)
$maxDist = ($report | Measure-Object -Property Distance -Maximum).Maximum
$minDist = ($report | Measure-Object -Property Distance -Minimum).Minimum
$avgDist = ($report | Measure-Object -Property Distance -Average).Average
Write-Host ("Max distance: {0}" -f $maxDist)
Write-Host ("Min distance: {0}" -f $minDist)
Write-Host ("Avg distance: {0:N0}" -f $avgDist)
$lt500 = ($report | Where-Object { $_.Distance -lt 500 }).Count
$lt2000 = ($report | Where-Object { $_.Distance -lt 2000 }).Count
$gt5000 = ($report | Where-Object { $_.Distance -ge 5000 }).Count
Write-Host ("`nDistance distribution:")
Write-Host ("  < 500 chars: {0}" -f $lt500)
Write-Host ("  < 2000 chars: {0}" -f $lt2000)
Write-Host ("  >= 5000 chars (need move): {0}" -f $gt5000)
