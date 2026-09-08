$f = 'd:\DevProject\breastcalculator\article\why-80-percent-wrong-bra-size\index.html'
$lines = Get-Content $f
$total = $lines.Length
Write-Host ("Total lines: {0}" -f $total)
# Find the closing </article> or </main> tags
for ($i=$total-1; $i -ge [Math]::Max(0, $total-200); $i--) {
  $line = $lines[$i].Trim()
  if ($line -match '</article>|</main>|<footer|class="related|class="more-articles|class="article-footer|class="article-cta|</body>') {
    Write-Host ("L{0}: {1}" -f ($i+1), $line.Substring(0, [Math]::Min(160, $line.Length)))
  }
}
Write-Host "`n--- Last 50 non-empty lines ---"
$nonEmpty = @()
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i].Trim() -ne '') { $nonEmpty += $i }
}
$last = $nonEmpty[-50..-1]
foreach ($i in $last) {
  Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(160, $lines[$i].Trim().Length)))
}
