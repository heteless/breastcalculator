$f = 'd:\DevProject\breastcalculator\articles\index.html'
$lines = Get-Content $f
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '<p\b|article-card|class="article' -and $lines[$i] -notmatch 'gtag|googletagmanager') {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(160, $lines[$i].Trim().Length)))
  }
}
Write-Host "----"
Write-Host ("Total lines: {0}" -f $lines.Length)
