$articles = Get-ChildItem -Path 'd:\DevProject\breastcalculator\article' -Directory
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    # Use word boundary to avoid matching <polyline>
    $matches = [regex]::Matches($c, '(?s)<p\b[^>]*>.*?</p>')
    $bodyParagraphs = @()
    foreach ($m in $matches) {
      $openTag = $m.Groups[0].Value.Substring(0, [Math]::Min(80, $m.Groups[0].Value.IndexOf('>')+1))
      if ($openTag -match 'class="byline"|class="subtitle"') { continue }
      $bodyParagraphs += [PSCustomObject]@{Index=$m.Index; Tag=$openTag; Length=$m.Length}
    }
    Write-Host ("{0} -- body <p> count: {1}" -f $a.Name, $bodyParagraphs.Count)
    if ($bodyParagraphs.Count -gt 0) {
      Write-Host ("  1st idx {0}: {1}" -f $bodyParagraphs[0].Index, $bodyParagraphs[0].Tag)
      if ($bodyParagraphs.Count -gt 1) {
        Write-Host ("  2nd idx {0}: {1}" -f $bodyParagraphs[1].Index, $bodyParagraphs[1].Tag)
      }
    }
  }
}
