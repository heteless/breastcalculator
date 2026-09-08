# Check the main page container widths and styles
$css = Get-Content 'd:\DevProject\breastcalculator\main.css' -Raw
$rules = Select-String -InputObject $css -Pattern '\.container\s*\{[^}]*\}|\.calc-shell[^}]*\}|\.hero[^}]*\}|\.classic-h1[^}]*\}|\.classic-brand[^}]*\}' -AllMatches
Write-Host "=== Container widths ==="
foreach ($m in $rules.Matches) {
  $v = $m.Value
  if ($v.Length -gt 250) { $v = $v.Substring(0, 250) + "..." }
  Write-Host ("  {0}" -f $v)
}

# Also check classic CSS file
$css2 = Get-Content 'd:\DevProject\breastcalculator\style.css' -Raw
Write-Host "`n=== Classic CSS file: container/hero widths ==="
$rules2 = Select-String -InputObject $css2 -Pattern '\.classic-h1[^}]*\}|\.calc-shell[^}]*\}|\.hero\s*\{[^}]*\}|\.container\s*\{[^}]*\}|--container[^;]*;|--max-w[^;]*;' -AllMatches
foreach ($m in $rules2.Matches) {
  $v = $m.Value
  if ($v.Length -gt 250) { $v = $v.Substring(0, 250) + "..." }
  Write-Host ("  {0}" -f $v)
}
