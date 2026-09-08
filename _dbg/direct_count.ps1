# Direct byte-level check of homepage
$f = 'd:\DevProject\breastcalculator\index.html'
$bytes = [System.IO.File]::ReadAllBytes($f)
Write-Host ("File size: {0} bytes" -f $bytes.Length)

# Count <p\b and </p>
$text = [System.IO.File]::ReadAllText($f)
$pOpen = ([regex]::Matches($text, '<p\b')).Count
$pClose = ([regex]::Matches($text, '</p>')).Count
$divOpen = ([regex]::Matches($text, '<div\b')).Count
$divClose = ([regex]::Matches($text, '</div>')).Count
Write-Host ("<p\b: {0}  </p>: {1}" -f $pOpen, $pClose)
Write-Host ("<div\b: {0}  </div>: {1}" -f $divOpen, $divClose)

# Get git HEAD bytes
$headFile = 'd:\DevProject\breastcalculator\_dbg\head_index.html'
if (Test-Path $headFile) {
  $headBytes = [System.IO.File]::ReadAllBytes($headFile)
  Write-Host ("HEAD file size: {0} bytes" -f $headBytes.Length)
  $headText = [System.IO.File]::ReadAllText($headFile)
  $pOpenH = ([regex]::Matches($headText, '<p\b')).Count
  $pCloseH = ([regex]::Matches($headText, '</p>')).Count
  $divOpenH = ([regex]::Matches($headText, '<div\b')).Count
  $divCloseH = ([regex]::Matches($headText, '</div>')).Count
  Write-Host ("HEAD <p\b: {0}  </p>: {1}" -f $pOpenH, $pCloseH)
  Write-Host ("HEAD <div\b: {0}  </div>: {1}" -f $divOpenH, $divCloseH)
}

# Show the </p> tag lines (close only)
Write-Host "`n=== All </p> tag lines in current file ==="
$lines = Get-Content $f
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '</p>') {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(120, $lines[$i].Trim().Length)))
  }
}
