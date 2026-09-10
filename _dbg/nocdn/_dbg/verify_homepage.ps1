# Final verification including homepage
$root = 'd:\DevProject\breastcalculator'
$f = Join-Path $root 'index.html'
$c = Get-Content $f -Raw
$hasLoader = $c -match 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
$hasSlot = $c -match '4196453734'
$hasPush = $c -match '\(adsbygoogle = window.adsbygoogle \|\| \[\]\).push\(\{\}\)'
$hasPlaceholder = $c -match 'ADVERTISEMENT</span>'
$insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
$mainEnd = $c.LastIndexOf('</main>')
Write-Host ("Homepage index.html:") -NoNewline
Write-Host ""
Write-Host ("  adsbygoogle.js loader in head: {0}" -f $hasLoader)
Write-Host ("  Bottom ad slot 4196453734: {0}" -f $hasSlot)
Write-Host ("  push({{}}) script: {0}" -f $hasPush)
Write-Host ("  Old 'ADVERTISEMENT' placeholder still present: {0}" -f $hasPlaceholder)
Write-Host ("  <ins class=adsbygoogle> count: {0}" -f $insCount)

# Find the position of the hero ad
$heroIdx = $c.IndexOf('hero-ad-slot')
$insIdx = $c.IndexOf('<ins class="adsbygoogle"', $heroIdx)
$mainIdx = $c.LastIndexOf('</main>')
Write-Host ("  hero-ad-slot position: {0}" -f $heroIdx)
Write-Host ("  <ins> after hero-ad-slot: {0}" -f $insIdx)
Write-Host ("  </main> position: {0}" -f $mainIdx)

# Show snippet around the hero ad
$lines = Get-Content $f
$adLine = -1
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match 'hero-ad-slot') { $adLine = $i; break }
}
if ($adLine -gt 0) {
  $start = [Math]::Max(0, $adLine - 1)
  $end = [Math]::Min($lines.Length - 1, $adLine + 12)
  Write-Host "`n=== Hero Ad Snippet ==="
  for ($i=$start; $i -le $end; $i++) {
    Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim())
  }
}
