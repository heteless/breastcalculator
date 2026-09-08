$f = 'd:\DevProject\breastcalculator\article\why-80-percent-wrong-bra-size\index.html'
$lines = Get-Content $f
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match 'adsbygoogle|ca-pub-7388117485013143|3789259624') {
    $ctx = if ($i -gt 0) { $lines[$i-1] } else { '' }
    $ctx2 = if ($i -lt $lines.Length-1) { $lines[$i+1] } else { '' }
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim())
  }
}
