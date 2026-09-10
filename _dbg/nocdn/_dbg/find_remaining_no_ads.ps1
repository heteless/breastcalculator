# Also check non-index HTML files that might be pages
$root = 'd:\DevProject\breastcalculator'
$allHtml = Get-ChildItem -Path $root -Recurse -Filter '*.html' -ErrorAction SilentlyContinue
$allHtml = $allHtml | Where-Object {
  $_.FullName -notmatch '\\dist\\' -and
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\.next-dev-server\\' -and
  $_.FullName -notmatch '\.wrangler' -and
  $_.FullName -notmatch '\.well-known' -and
  $_.FullName -notmatch '\.backup' -and
  $_.Name -ne 'index.html'
}

$noAd = @()
foreach ($f in $allHtml) {
  $c = Get-Content $f -Raw
  $insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
  if ($insCount -eq 0) {
    $relPath = $f.FullName.Substring($root.Length + 1)
    $sizeKB = [Math]::Round($f.Length / 1024, 1)
    $noAd += [PSCustomObject]@{
      Path = $relPath
      SizeKB = $sizeKB
      HasLoader = ($c -match 'adsbygoogle.js')
    }
  }
}

Write-Host ("Non-index HTML files without ads: {0}" -f $noAd.Count)
$noAd | Format-Table -AutoSize

# Also check if there are any pages that have adsbygoogle loader but NO <ins> tags
Write-Host "`n=== Pages with loader but NO <ins> tags ==="
$allIndex = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -ErrorAction SilentlyContinue
$allIndex = $allIndex | Where-Object {
  $_.FullName -notmatch '\\dist\\' -and
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\.next-dev-server\\' -and
  $_.FullName -notmatch '\.wrangler' -and
  $_.FullName -notmatch '\.well-known' -and
  $_.FullName -notmatch '\.backup'
}
$loaderNoIns = @()
foreach ($f in $allIndex) {
  $c = Get-Content $f -Raw
  $hasLoader = $c -match 'adsbygoogle.js'
  $insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
  if ($hasLoader -and $insCount -eq 0) {
    $relPath = $f.FullName.Substring($root.Length + 1)
    $loaderNoIns += $relPath
  }
}
if ($loaderNoIns.Count -gt 0) {
  foreach ($p in $loaderNoIns) { Write-Host ("  {0}" -f $p) }
} else {
  Write-Host "  (none)"
}
