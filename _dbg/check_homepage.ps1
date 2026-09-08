# Find the reserved ad slot in homepage (index.html)
$f = 'd:\DevProject\breastcalculator\index.html'
$c = Get-Content $f -Raw
$lines = Get-Content $f

# Find any ad-related markers / placeholders
$markers = @('ad-slot','adsbygoogle','data-ad','class="ad-','ad-container','ad-placeholder','ad-reserved','ad-banner','<!-- ad','<!-- Ad','<ins ')
$report = @()
for ($i=0; $i -lt $lines.Length; $i++) {
  $line = $lines[$i]
  foreach ($m in $markers) {
    if ($line -match [regex]::Escape($m)) {
      $report += [PSCustomObject]@{Line=($i+1); Marker=$m; Content=$line.Trim().Substring(0, [Math]::Min(180, $line.Trim().Length))}
      break
    }
  }
}
Write-Host "=== Ad-related markers in homepage ==="
$report | Format-Table -AutoSize -Wrap

Write-Host "`n=== Looking for ad slot containers ==="
$containers = [regex]::Matches($c, '<div[^>]*class="[^"]*ad[^"]*"[^>]*>')
foreach ($m in $containers) {
  Write-Host ("Found at {0}: {1}" -f $m.Index, $m.Groups[0].Value.Substring(0, [Math]::Min(200, $m.Groups[0].Value.Length)))
}
