# Search for calculator form anywhere in bra-size-calculator and breast-volume
$files = @('bra-size-calculator','breast-volume')
foreach ($d in $files) {
  $f = Join-Path 'd:\DevProject\breastcalculator' (Join-Path $d 'index.html')
  $c = [System.IO.File]::ReadAllText($f)
  Write-Host "==== $d ===="
  # Find input fields
  $inputs = [regex]::Matches($c, '<input[^>]*>')
  Write-Host ("  Total <input> tags: {0}" -f $inputs.Count)
  foreach ($m in $inputs | Select-Object -First 3) {
    Write-Host ("    at {0}: {1}" -f $m.Index, $m.Value.Substring(0, [Math]::Min(200, $m.Value.Length)))
  }
  # Find any bra-calculator or similar
  $allCalcs = [regex]::Matches($c, 'class="[^"]*calc[^"]*"')
  Write-Host ("  Total class=calc*: {0}" -f $allCalcs.Count)
  foreach ($m in $allCalcs | Select-Object -First 3) {
    Write-Host ("    at {0}: {1}" -f $m.Index, $m.Value.Substring(0, [Math]::Min(200, $m.Value.Length)))
  }
  # Find any form tag
  $forms = [regex]::Matches($c, '<form[^>]*>')
  Write-Host ("  Total <form> tags: {0}" -f $forms.Count)
  foreach ($m in $forms | Select-Object -First 3) {
    Write-Host ("    at {0}: {1}" -f $m.Index, $m.Value.Substring(0, [Math]::Min(200, $m.Value.Length)))
  }
}
