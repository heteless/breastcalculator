$articles = Get-ChildItem -Path 'd:\DevProject\breastcalculator\article' -Directory
$summary = @()
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    $hasArticle = $c -match '<article\b'
    $hasMain = $c -match '<main\b'
    $hasFooter = $c -match '<footer\b'
    $endOfMain = $c.LastIndexOf('</main>')
    $endOfArticle = $c.LastIndexOf('</article>')
    $endOfFooter = $c.LastIndexOf('</footer>')
    $summary += [PSCustomObject]@{
      Article = $a.Name
      '<article>' = $hasArticle
      '<main>' = $hasMain
      '<footer>' = $hasFooter
      '</main> at' = $endOfMain
      '</article> at' = $endOfArticle
      '</footer> at' = $endOfFooter
    }
  }
}
$summary | Format-Table -AutoSize
