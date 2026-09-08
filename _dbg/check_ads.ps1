$articles = Get-ChildItem -Path 'd:\DevProject\breastcalculator\article' -Directory
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    $has = $c -match 'adsbygoogle'
    Write-Host ("{0} -- has adsbygoogle: {1}" -f $a.Name, $has)
  }
}
# Also check articles/index.html
$idx = 'd:\DevProject\breastcalculator\articles\index.html'
if (Test-Path $idx) {
  $c = Get-Content $idx -Raw
  Write-Host ("articles/index.html has adsbygoogle: {0}" -f ($c -match 'adsbygoogle'))
}
