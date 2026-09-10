$articles = Get-ChildItem -Path 'd:\DevProject\breastcalculator\article' -Directory
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    # Find <p> tags that are NOT byline/subtitle
    $matches = [regex]::Matches($c, '<p[^>]*>(?s)(.*?)</p>')
    $bodyParagraphs = @()
    foreach ($m in $matches) {
      $tag = $m.Groups[0].Value.Substring(0, [Math]::Min(50, $m.Groups[0].Value.IndexOf('>')+1))
      if ($tag -match 'class="byline"|class="subtitle"') { continue }
      $bodyParagraphs += [PSCustomObject]@{Index=$m.Index; Tag=$tag}
    }
    Write-Host ("{0} -- body <p> count: {1}" -f $a.Name, $bodyParagraphs.Count)
    if ($bodyParagraphs.Count -gt 0) {
      Write-Host ("  1st: {0}" -f $bodyParagraphs[0].Tag)
      if ($bodyParagraphs.Count -gt 1) {
        Write-Host ("  2nd: {0}" -f $bodyParagraphs[1].Tag)
      }
    }
  }
}
