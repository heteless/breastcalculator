$articles = Get-ChildItem -Path 'd:\DevProject\breastcalculator\article' -Directory
$count = 0
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    $insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
    if ($insCount -gt 0) { $count++ }
    Write-Host ("{0} -- ins count: {1}" -f $a.Name, $insCount)
  }
}
Write-Host ("Total files with ins: {0}" -f $count)
