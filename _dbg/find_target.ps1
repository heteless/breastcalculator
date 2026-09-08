# Find the "Open Full Calculator" link and "Private by design" section in homepage
$f = 'd:\DevProject\breastcalculator\index.html'
$lines = Get-Content $f
$report = @()
for ($i=0; $i -lt $lines.Length; $i++) {
  $line = $lines[$i]
  if ($line -match 'Open Full Calculator|Private by design|privacy-promise|hero-ad-slot|Open Full') {
    $report += [PSCustomObject]@{Line=($i+1); Content=$line.Trim().Substring(0, [Math]::Min(180, $line.Trim().Length))}
  }
}
$report | Format-Table -AutoSize -Wrap
