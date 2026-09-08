# Check the homepage for tag balance and find the issue
$f = 'd:\DevProject\breastcalculator\index.html'
$c = Get-Content $f -Raw
$lines = Get-Content $f

# Show all <p> tags
Write-Host "=== <p> tags ==="
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '<p\b|</p>') {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(150, $lines[$i].Trim().Length)))
  }
}

Write-Host "`n=== <div> tags (first 30 and last 30) ==="
$divLines = @()
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '<div\b|</div>') { $divLines += $i }
}
Write-Host ("Total div tag lines: {0}" -f $divLines.Count)
$top = $divLines[0..[Math]::Min(29, $divLines.Count-1)]
$bot = $divLines[[Math]::Max(0, $divLines.Count-30)..($divLines.Count-1)]
foreach ($i in $top) {
  Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(150, $lines[$i].Trim().Length)))
}
Write-Host "..."
foreach ($i in $bot) {
  Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(150, $lines[$i].Trim().Length)))
}
