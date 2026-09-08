$f = 'd:\DevProject\breastcalculator\article\breast-volume-guide\index.html'
$lines = Get-Content $f
for ($i=460; $i -lt 540; $i++) {
  if ($i -ge $lines.Length) { break }
  $line = $lines[$i].Trim()
  if ($line -ne '') {
    Write-Host ("L{0}: {1}" -f ($i+1), $line.Substring(0, [Math]::Min(140, $line.Length)))
  }
}
