$articles = Get-ChildItem -Path 'd:\DevProject\breastcalculator\article' -Directory
$summary = @()
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    $mainEnd = $c.LastIndexOf('</main>')
    $footerStart = $c.IndexOf('<footer', $mainEnd)
    $between = $c.Substring($mainEnd, $footerStart - $mainEnd)
    $hasRelated = $between -match 'related|more-articles|you-may-also|recommended'
    $hasCTABanner = $between -match 'cta-banner|article-cta'
    $summary += [PSCustomObject]@{
      Article = $a.Name
      'has related/cta in between' = ($hasRelated -or $hasCTABanner)
      'snippet (200 chars)' = $between.Substring(0, [Math]::Min(200, $between.Length))
    }
  }
}
$summary | Format-Table -AutoSize -Wrap
