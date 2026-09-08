$articles = Get-ChildItem -Path 'd:\DevProject\breastcalculator\article' -Directory
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $pMatches = Select-String -Path $f -Pattern '<p\b' -CaseSensitive:$false
    $pCount = ($pMatches | Measure-Object).Count
    Write-Host "$($a.Name) -- <p> count = $pCount"
    $pMatches | Select-Object -First 3 | ForEach-Object { Write-Host ("  L{0}: {1}" -f $_.LineNumber, $_.Line.Substring(0, [Math]::Min(140, $_.Line.Length))) }
  }
}
