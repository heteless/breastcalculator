# Debug why all pages are being skipped
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

$inArtPattern = '(?is)\s*<!--\s*AdSense In-Article Ad\s*-->\s*<div[^>]*class="article-in-ad"[^>]*>.*?</div>'

$stats = @{TotalChecked=0; HasInArt=0; NoInArt=0; InArtBeforeH1=0}
$sampleNoInArt = @()
foreach ($f in $allHtml) {
  $stats.TotalChecked++
  $c = [System.IO.File]::ReadAllText($f.FullName)
  if ($c -notmatch '3789259624') {
    $stats.NoInArt++
    if ($sampleNoInArt.Count -lt 5) { $sampleNoInArt += $f.FullName.Substring($root.Length+1) }
    continue
  }
  $stats.HasInArt++
  $inArtMatch = [regex]::Match($c, $inArtPattern)
  $h1Match = [regex]::Match($c, '<h1[^>]*>.*?</h1>')
  if ($inArtMatch.Success -and $h1Match.Success -and $inArtMatch.Index -lt $h1Match.Index) {
    $stats.InArtBeforeH1++
  }
}
$stats.GetEnumerator() | ForEach-Object { Write-Host ("$($_.Key): $($_.Value)") }
Write-Host "`nSample pages without in-article ad:"
foreach ($s in $sampleNoInArt) { Write-Host "  $s" }

# Now check first 5 ad pages to see their actual structure
Write-Host "`nFirst 5 ad pages structure:"
$shown = 0
foreach ($f in $allHtml) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  if ($c -notmatch '3789259624') { continue }
  $rel = $f.FullName.Substring($root.Length+1)
  $inArtMatch = [regex]::Match($c, $inArtPattern)
  $h1Match = [regex]::Match($c, '<h1[^>]*>.*?</h1>')
  Write-Host "$rel"
  Write-Host "  H1 pos: $($h1Match.Index), InArt pos: $($inArtMatch.Index), H1 found: $($h1Match.Success), InArt found: $($inArtMatch.Success)"
  $shown++
  if ($shown -ge 5) { break }
}
