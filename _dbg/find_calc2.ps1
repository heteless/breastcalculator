# Find the actual structure of bra-size-calculator and breast-volume
$files = @('bra-size-calculator','breast-volume')
foreach ($d in $files) {
  $f = Join-Path 'd:\DevProject\breastcalculator' (Join-Path $d 'index.html')
  $c = [System.IO.File]::ReadAllText($f)
  Write-Host "==== $d ===="
  # Find any div with "calculator" in class
  $m = [regex]::Match($c, '<div[^>]*class="[^"]*calculator[^"]*"')
  if ($m.Success) {
    Write-Host ("  Calculator class at {0}: {1}" -f $m.Index, $m.Value.Substring(0, [Math]::Min(200, $m.Value.Length)))
  }
  # Find any section with calculator
  $m2 = [regex]::Match($c, '<section[^>]*class="[^"]*calc[^"]*"')
  if ($m2.Success) {
    Write-Host ("  Calc section at {0}: {1}" -f $m2.Index, $m2.Value.Substring(0, [Math]::Min(200, $m2.Value.Length)))
  }
  # Find any "hero" tag
  $m3 = [regex]::Match($c, '<section[^>]*class="[^"]*hero[^"]*"')
  if ($m3.Success) {
    Write-Host ("  Hero at {0}: {1}" -f $m3.Index, $m3.Value.Substring(0, [Math]::Min(200, $m3.Value.Length)))
  }
  # Find <main>
  $m4 = [regex]::Match($c, '<main[^>]*>')
  if ($m4.Success) {
    Write-Host ("  Main at {0}: {1}" -f $m4.Index, $m4.Value)
  }
  # Find <h1>
  $m5 = [regex]::Match($c, '<h1[^>]*>')
  if ($m5.Success) {
    Write-Host ("  H1 at {0}: {1}" -f $m5.Index, $m5.Value)
  }
  # Find <p> (description)
  $m6 = [regex]::Match($c, '<p[^>]*>Use our free')
  if ($m6.Success) {
    Write-Host ("  Use our free at {0}: {1}" -f $m6.Index, $m6.Value)
  }
}
