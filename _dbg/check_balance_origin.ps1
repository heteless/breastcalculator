# Compare current homepage with backup to confirm balance issue is pre-existing
$current = 'd:\DevProject\breastcalculator\index.html'
# Check if there's a backup
$candidates = @(
  'd:\DevProject\breastcalculator\index.html.bak',
  'd:\DevProject\breastcalculator\.backup\index.html'
)
foreach ($bak in $candidates) {
  if (Test-Path $bak) {
    Write-Host ("Found backup: {0}" -f $bak)
    $cb = Get-Content $current -Raw
    $bb = Get-Content $bak -Raw
    $cpO = ([regex]::Matches($cb, '<p\b')).Count
    $cpC = ([regex]::Matches($cb, '</p>')).Count
    $bpO = ([regex]::Matches($bb, '<p\b')).Count
    $bpC = ([regex]::Matches($bb, '</p>')).Count
    $cdO = ([regex]::Matches($cb, '<div\b')).Count
    $cdC = ([regex]::Matches($cb, '</div>')).Count
    $bdO = ([regex]::Matches($bb, '<div\b')).Count
    $bdC = ([regex]::Matches($bb, '</div>')).Count
    Write-Host ("CURRENT: <p>:{0}/{1}  <div>:{2}/{3}" -f $cpO, $cpC, $cdO, $cdC)
    Write-Host ("BACKUP : <p>:{0}/{1}  <div>:{2}/{3}" -f $bpO, $bpC, $bdO, $bdC)
  }
}

# Search for <p> tags that may not be in a normal HTML context
Write-Host "`n=== Looking for <p patterns that might be in script/style ==="
$f = 'd:\DevProject\breastcalculator\index.html'
$c = Get-Content $f -Raw
# Find all <p\b and inspect context
$matches = [regex]::Matches($c, '<p\b')
$report = @()
foreach ($m in $matches) {
  $ctxStart = [Math]::Max(0, $m.Index - 30)
  $ctx = $c.Substring($ctxStart, [Math]::Min(60, $c.Length - $ctxStart))
  $report += $ctx
}
# Look for ones that look like they're in script or attribute
$suspicious = $report | Where-Object { $_ -match 'script|style|function|var ' }
Write-Host ("Total <p\b matches: {0}" -f $matches.Count)
Write-Host ("Suspicious (in script/style): {0}" -f ($suspicious | Measure-Object).Count)
$suspicious | Select-Object -First 5 | ForEach-Object { Write-Host ("  {0}" -f $_) }
