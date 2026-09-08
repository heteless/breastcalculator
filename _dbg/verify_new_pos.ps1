# Verify the homepage ad is in the new location
$f = 'd:\DevProject\breastcalculator\index.html'
$c = [System.IO.File]::ReadAllText($f)
$lines = Get-Content $f

# Check that the old hero-ad-slot is gone
$hasOldHero = $c -match 'class="hero-ad-slot"'
Write-Host ("Old hero-ad-slot removed: {0}" -f $(-not $hasOldHero))

# Check the new ad is in the right place
$privacyNoteLine = -1
$openFullLine = -1
$newAdLine = -1
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match 'calc-privacy-note' -and $privacyNoteLine -lt 0) { $privacyNoteLine = $i }
  if ($lines[$i] -match 'Open Full Calculator' -and $openFullLine -lt 0) { $openFullLine = $i }
  if ($lines[$i] -match 'article-bottom-ad"' -and $newAdLine -lt 0) { $newAdLine = $i }
}
Write-Host ("Privacy note line: {0}" -f ($privacyNoteLine + 1))
Write-Host ("New ad line: {0}" -f ($newAdLine + 1))
Write-Host ("Open Full Calculator line: {0}" -f ($openFullLine + 1))
Write-Host ("Ad between privacy and Open Full: {0}" -f ($privacyNoteLine -lt $newAdLine -and $newAdLine -lt $openFullLine))

# Show context around the new ad
Write-Host "`n=== New ad context (lines {0} to {1}) ===" -f ($privacyNoteLine + 1), ($openFullLine + 2)
for ($i=$privacyNoteLine; $i -le $openFullLine + 1; $i++) {
  Write-Host ("L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(180, $lines[$i].Trim().Length)))
}

# Count total ins blocks
$insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
Write-Host ("`nTotal <ins class=adsbygoogle> on homepage: {0}" -f $insCount)

# Verify slot still there
$hasSlot = $c -match '4196453734'
Write-Host ("Slot 4196453734 still present: {0}" -f $hasSlot)
