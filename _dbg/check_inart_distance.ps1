# Diagnostic: check current in-article positions relative to h1
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

$inArtPattern = '(?is)\s*<!--\s*In-Article Ad[^>]*-->\s*<div[^>]*class="article-in-ad"[^>]*>.*?</div>'

$report = @()
foreach ($f in $allHtml) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  if ($c -notmatch '3789259624') { continue }
  $rel = $f.FullName.Substring($root.Length + 1)
  $inArtMatch = [regex]::Match($c, $inArtPattern)
  $h1Match = [regex]::Match($c, '<h1[^>]*>.*?</h1>')
  if ($inArtMatch.Success -and $h1Match.Success) {
    $distance = $inArtMatch.Index - $h1Match.Index
    $report += [PSCustomObject]@{
      File = $rel
      H1Pos = $h1Match.Index
      InArtPos = $inArtMatch.Index
      Distance = $distance
    }
  }
}
$report | Format-Table -AutoSize
Write-Host ("`nTotal ad pages: {0}" -f $report.Count)
Write-Host ("Average distance from h1: {0:N0}" -f (($report | Measure-Object -Property Distance -Average).Average))
Write-Host ("Max distance: {0}" -f (($report | Measure-Object -Property Distance -Maximum).Maximum))
Write-Host ("Min distance: {0}" -f (($report | Measure-Object -Property Distance -Minimum).Minimum))
