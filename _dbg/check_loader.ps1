# Check if high-priority pages have adsbygoogle loader in head
$root = 'd:\DevProject\breastcalculator'
$dirs = @('bra-size-guide', 'wellness', 'tools', 'specials', 'guide')
$checked = 0
$hasLoader = 0
$noLoader = @()
foreach ($d in $dirs) {
  $dp = Join-Path $root $d
  if (-not (Test-Path $dp)) { continue }
  Get-ChildItem -Path $dp -Recurse -Filter 'index.html' | ForEach-Object {
    $f = $_.FullName
    $c = [System.IO.File]::ReadAllText($f)
    $checked++
    if ($c -match 'adsbygoogle\.js') {
      $hasLoader++
    } else {
      $noLoader += $f.Substring($root.Length + 1)
    }
  }
}
Write-Host ("Checked: {0}  With loader: {1}  Without: {2}" -f $checked, $hasLoader, $noLoader.Count)
if ($noLoader.Count -gt 0) {
  Write-Host "Files WITHOUT adsbygoogle loader (need loader added):"
  foreach ($f in $noLoader) { Write-Host ("  {0}" -f $f) }
}
