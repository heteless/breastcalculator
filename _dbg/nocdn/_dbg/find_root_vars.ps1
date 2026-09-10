# Find the :root CSS variables (design tokens)
$css = Get-Content 'd:\DevProject\breastcalculator\main.css' -Raw
$rootMatch = [regex]::Match($css, ':root\s*\{[^}]*\}')
if ($rootMatch.Success) {
  Write-Host "=== :root variables in main.css ==="
  $vars = [regex]::Matches($rootMatch.Value, '--[a-z-]+:\s*[^;]+;')
  foreach ($v in $vars) {
    Write-Host ("  {0}" -f $v.Value.Trim())
  }
}

$css2 = Get-Content 'd:\DevProject\breastcalculator\style.css' -Raw
$rootMatch2 = [regex]::Match($css2, ':root\s*\{[^}]*\}')
if ($rootMatch2.Success) {
  Write-Host "`n=== :root variables in style.css ==="
  $vars2 = [regex]::Matches($rootMatch2.Value, '--[a-z-]+:\s*[^;]+;')
  foreach ($v in $vars2) {
    Write-Host ("  {0}" -f $v.Value.Trim())
  }
}
