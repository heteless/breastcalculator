# Inspect calculator page structure to find good middle ad position
$f = 'd:\DevProject\breastcalculator\bra-size-calculator\index.html'
$lines = Get-Content $f
Write-Host ("Total lines: {0}" -f $lines.Length)
# Find H2 and structural sections
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '<h2|<section[^>]*class="|article-bottom-ad|id="size-result|</main>') {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(180, $lines[$i].Trim().Length)))
  }
}
