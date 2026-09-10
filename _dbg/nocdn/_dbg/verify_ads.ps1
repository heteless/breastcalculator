# Verify ad insertion: count ins ads per article and show the surrounding context
$articleRoot = 'd:\DevProject\breastcalculator\article'
$articles = Get-ChildItem -Path $articleRoot -Directory

$summary = @()
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    $insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
    $adSlotOk = $c -match '3789259624'
    $adClientOk = $c -match 'ca-pub-7388117485013143'
    $adLayoutOk = $c -match 'in-article'
    $summary += [PSCustomObject]@{
      Article = $a.Name
      'Ins Count' = $insCount
      'Slot 3789259624' = $adSlotOk
      'Client' = $adClientOk
      'in-article layout' = $adLayoutOk
    }
  }
}
$summary | Format-Table -AutoSize

Write-Host "`n--- Sample context (why-80-percent-wrong-bra-size) ---"
$f = 'd:\DevProject\breastcalculator\article\why-80-percent-wrong-bra-size\index.html'
$lines = Get-Content $f
$adLine = -1
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match 'article-in-ad') { $adLine = $i; break }
}
if ($adLine -gt 0) {
  $start = [Math]::Max(0, $adLine - 5)
  $end = [Math]::Min($lines.Length - 1, $adLine + 15)
  for ($i=$start; $i -le $end; $i++) {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim())
  }
}
