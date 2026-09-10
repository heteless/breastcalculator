$root = 'd:\DevProject\breastcalculator'
$list = @(
  'index.html',
  'tools/breast-expansion-calculator/index.html',
  'tools/breast-ptosis-calculator/index.html',
  'tools/breast-shape-calculator/index.html',
  'tools/breast-volume-calculator/index.html',
  'tools/breast-weight-calculator/index.html',
  'tools/length-converter/index.html',
  'tools/weight-converter/index.html'
)
function Count-Div([string]$c) {
    $m = [regex]::Replace($c, '(?s)<script.*?</script>', '')
    $m = [regex]::Replace($m, '(?s)<style.*?</style>', '')
    $m = [regex]::Replace($m, '(?s)<!--.*?-->', '')
    return "$(([regex]::Matches($m,'<div\b')).Count)/$(([regex]::Matches($m,'</div>')).Count)"
}
foreach ($p in $list) {
    $head = git -C $root show "HEAD:$p" 2>$null | Out-String
    $work = [System.IO.File]::ReadAllText((Join-Path $root ($p -replace '/', '\')))
    Write-Host ("{0,-52} HEAD={1,-8} WORK={2}" -f $p, (Count-Div $head), (Count-Div $work))
}
