# Scan ALL index.html files in project, identify those WITHOUT ads
# Exclude dist/ and node_modules/ and .next-dev-server/ (build/dev artifacts)

$root = 'd:\DevProject\breastcalculator'

# Get all index.html files
$all = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -ErrorAction SilentlyContinue
$all = $all | Where-Object {
  $_.FullName -notmatch '\\dist\\' -and
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\.next-dev-server\\' -and
  $_.FullName -notmatch '\.wrangler' -and
  $_.FullName -notmatch '\.well-known'
}

Write-Host ("Total index.html files scanned: {0}" -f $all.Count)
Write-Host ""

$hasAd = @()
$noAd = @()

foreach ($f in $all) {
  $c = Get-Content $f -Raw
  $insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
  $slot1 = $c -match '3789259624'
  $slot2 = $c -match '4196453734'
  $slotAny = $slot1 -or $slot2

  $relPath = $f.FullName.Substring($root.Length + 1)

  $obj = [PSCustomObject]@{
    Path = $relPath
    'InsCount' = $insCount
    'SlotInArt(3789)' = $slot1
    'SlotBot(4196)' = $slot2
  }

  if ($insCount -gt 0 -and $slotAny) {
    $hasAd += $obj
  } else {
    $noAd += $obj
  }
}

Write-Host "=== PAGES WITH ADS ({0}) ===" -f $hasAd.Count
$hasAd | Format-Table -AutoSize

Write-Host ""
Write-Host "=== PAGES WITHOUT ADS ({0}) ===" -f $noAd.Count
$noAd | Format-Table -AutoSize

# Group no-ad by directory
Write-Host "`n=== Pages without ads grouped by directory ==="
$grouped = $noAd | Group-Object { ($_.Path -split '\\')[0] }
foreach ($g in $grouped) {
  Write-Host ("`n[{0}] - {1} page(s)" -f $g.Name, $g.Count)
  foreach ($p in $g.Group) {
    Write-Host ("  - {0}" -f $p.Path)
  }
}
