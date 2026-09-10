# Find the calculator form structure
$root = 'd:\DevProject\breastcalculator'
$calcDirs = @('bra-size-calculator','breast-volume','tools/breast-volume-calculator')
foreach ($d in $calcDirs) {
  $f = Join-Path $root (Join-Path $d 'index.html')
  if (Test-Path $f) {
    $c = [System.IO.File]::ReadAllText($f)
    Write-Host "==== $d ===="
    # Find forms
    $forms = [regex]::Matches($c, '<form[^>]*>')
    foreach ($m in $forms) {
      Write-Host ("  Form at {0}: {1}" -f $m.Index, $m.Value.Substring(0, [Math]::Min(180, $m.Value.Length)))
    }
    # Find calculator-related classes
    $calcs = [regex]::Matches($c, 'class="[^"]*calc[^"]*"|class="[^"]*calc-shell[^"]*"|class="[^"]*calculator[^"]*"')
    foreach ($m in $calcs | Select-Object -First 5) {
      Write-Host ("  Calc class at {0}: {1}" -f $m.Index, $m.Value.Substring(0, [Math]::Min(180, $m.Value.Length)))
    }
    # Find input field
    $inputMatch = [regex]::Match($c, '<input[^>]*type="number"|<input[^>]*placeholder="e\.g\.')
    if ($inputMatch.Success) {
      Write-Host ("  Input at {0}: {1}" -f $inputMatch.Index, $inputMatch.Value.Substring(0, [Math]::Min(180, $inputMatch.Value.Length)))
    }
  }
}
