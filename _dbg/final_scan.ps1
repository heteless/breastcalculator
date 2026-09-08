# Final scan: ALL HTML files that are real pages (exclude test/debug)
$root = 'd:\DevProject\breastcalculator'

# Find all HTML files
$allHtml = Get-ChildItem -Path $root -Recurse -Filter '*.html' -ErrorAction SilentlyContinue
$allHtml = $allHtml | Where-Object {
  $_.FullName -notmatch '\\dist\\' -and
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\.next-dev-server\\' -and
  $_.FullName -notmatch '\.wrangler' -and
  $_.FullName -notmatch '\.well-known' -and
  $_.FullName -notmatch '\.backup' -and
  $_.FullName -notmatch '\\_dbg\\' -and
  $_.FullName -notmatch 'test-output'
}

# Use safe file reading
$noAd = @()
$hasAd = @()
foreach ($f in $allHtml) {
  if (-not (Test-Path $f.FullName)) { continue }
  $content = [System.IO.File]::ReadAllText($f.FullName)
  $insCount = ([regex]::Matches($content, '<ins\s+class="adsbygoogle"')).Count
  $relPath = $f.FullName.Substring($root.Length + 1)

  if ($insCount -gt 0) {
    $hasAd += [PSCustomObject]@{Path=$relPath; InsCount=$insCount}
  } else {
    $sizeKB = [Math]::Round($f.Length / 1024, 1)
    $noAd += [PSCustomObject]@{Path=$relPath; SizeKB=$sizeKB}
  }
}

Write-Host ("Total HTML files scanned: {0}" -f $allHtml.Count)
Write-Host ("  WITH ads: {0}" -f $hasAd.Count)
Write-Host ("  WITHOUT ads: {0}" -f $noAd.Count)

Write-Host "`n=== Pages WITHOUT ads (potential candidates) ==="
$noAd | Format-Table -AutoSize

# Group by top-level directory
Write-Host "`n=== Grouped by top-level directory ==="
$grouped = $noAd | Group-Object { ($_.Path -split '\\')[0] }
foreach ($g in $grouped) {
  Write-Host ("`n[{0}] - {1} file(s)" -f $g.Name, $g.Count)
  foreach ($p in $g.Group) {
    Write-Host ("  {0}  ({1} KB)" -f $p.Path, $p.SizeKB)
  }
}
