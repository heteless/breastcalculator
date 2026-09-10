# Inspect structure of high-priority pages
$f = 'd:\DevProject\breastcalculator\bra-size-guide\28a\index.html'
$c = Get-Content $f -Raw
$lines = Get-Content $f

Write-Host ("==== bra-size-guide/28a (size variant) ====")
Write-Host ("Total lines: {0}" -f $lines.Length)
# Find main content markers
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '<main|<h1|<h2|</main>|<article|class="article') {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(140, $lines[$i].Trim().Length)))
  }
}
Write-Host "`n--- First 3 body <p> tags ---"
$pattern = '(?is)<p\b[^>]*>.*?</p>'
$matches = [regex]::Matches($c, $pattern)
$bodyIdx = 0
foreach ($m in $matches) {
  $openTag = $m.Groups[0].Value.Substring(0, $m.Groups[0].Value.IndexOf('>') + 1)
  if ($openTag -match 'class="byline"|class="subtitle"') { continue }
  $bodyIdx++
  if ($bodyIdx -gt 5) { break }
  Write-Host ("  p#{0} at {1}: {2}" -f $bodyIdx, $m.Index, $openTag)
}

# Check wellness page
$f = 'd:\DevProject\breastcalculator\wellness\breast-self-exam\index.html'
$c = Get-Content $f -Raw
$lines = Get-Content $f
Write-Host "`n==== wellness/breast-self-exam ===="
Write-Host ("Total lines: {0}" -f $lines.Length)
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '<main|<h1|<h2|</main>|<article|class="article') {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(140, $lines[$i].Trim().Length)))
  }
}

# Check tool page
$f = 'd:\DevProject\breastcalculator\tools\breast-volume-calculator\index.html'
$c = Get-Content $f -Raw
$lines = Get-Content $f
Write-Host "`n==== tools/breast-volume-calculator ===="
Write-Host ("Total lines: {0}" -f $lines.Length)
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '<main|<h1|<h2|</main>|<article|class="article') {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(140, $lines[$i].Trim().Length)))
  }
}
