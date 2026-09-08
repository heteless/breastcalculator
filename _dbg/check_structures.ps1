$articles = Get-ChildItem -Path 'd:\DevProject\breastcalculator\article' -Directory
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    $hasArticle = $c -match '<article\s+class="article"'
    $hasMain = $c -match '<main\s+id="main-content"'
    $hasHero = $c -match '<section\s+class="hero"'
    Write-Host ("{0} -- article:{1} main:{2} hero:{3}" -f $a.Name, $hasArticle, $hasMain, $hasHero)
  }
}
