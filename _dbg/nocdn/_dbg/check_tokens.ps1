# Check existing CSS design tokens and the hero-ad-slot styling
$css = Get-Content 'd:\DevProject\breastcalculator\main.css' -Raw
$css2 = Get-Content 'd:\DevProject\breastcalculator\style.css' -Raw

# Find CSS variables defined
Write-Host "=== Design tokens (CSS variables) ==="
$varMatches = [regex]::Matches($css, '--[a-z-]+:\s*[^;]+;')
foreach ($m in $varMatches | Select-Object -First 30) {
  Write-Host ("  {0}" -f $m.Value)
}

# Find the .hero-ad-slot rule and surrounding context
Write-Host "`n=== .hero-ad-slot rules ==="
$haMatch = [regex]::Matches($css, '\.hero-ad-slot\s*\{[^}]*\}')
foreach ($m in $haMatch) {
  Write-Host ("  {0}" -f $m.Value)
}

# Check if there are any existing ad-related CSS rules
Write-Host "`n=== Existing ad-related CSS rules ==="
$adMatches = [regex]::Matches($css, '\.article-(in|bottom)-ad[^}]*\}|\.ad-(slot|container|wrapper)[^}]*\}|\.advertisement[^}]*\}')
foreach ($m in $adMatches) {
  Write-Host ("  {0}" -f $m.Value)
}

# Check the actual hero-ad-slot context
Write-Host "`n=== hero-ad-slot in style.css ==="
$haMatch2 = [regex]::Matches($css2, '\.hero-ad-slot[^}]*\}')
foreach ($m in $haMatch2) {
  Write-Host ("  {0}" -f $m.Value)
}
