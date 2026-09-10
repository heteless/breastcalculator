# Better balance check: strip <script>...</script> content first to avoid JS string false positives
$f = 'd:\DevProject\breastcalculator\index.html'
$c = Get-Content $f -Raw

# Strip script content
$cStripped = [regex]::Replace($c, '(?s)<script\b[^>]*>.*?</script>', '')
# Strip style content
$cStripped = [regex]::Replace($cStripped, '(?s)<style\b[^>]*>.*?</style>', '')
# Strip HTML comments
$cStripped = [regex]::Replace($cStripped, '(?s)<!--.*?-->', '')

$pO = ([regex]::Matches($cStripped, '<p\b')).Count
$pC = ([regex]::Matches($cStripped, '</p>')).Count
$dO = ([regex]::Matches($cStripped, '<div\b')).Count
$dC = ([regex]::Matches($cStripped, '</div>')).Count

Write-Host "=== Homepage balance (after stripping <script>/<style>/comments) ==="
Write-Host ("  <p> open: {0}  </p> close: {1}" -f $pO, $pC)
Write-Host ("  <div> open: {0}  </div> close: {1}" -f $dO, $dC)

# Also do for all targets
$root = 'd:\DevProject\breastcalculator'
$targets = @()
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) {
  $targets += (Join-Path $a.FullName 'index.html')
}
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $targets += (Join-Path $root (Join-Path $d 'index.html'))
}
$targets += (Join-Path $root 'index.html')

$errCount = 0
foreach ($f in $targets) {
  $c = Get-Content $f -Raw
  $cs = [regex]::Replace($c, '(?s)<script\b[^>]*>.*?</script>', '')
  $cs = [regex]::Replace($cs, '(?s)<style\b[^>]*>.*?</style>', '')
  $cs = [regex]::Replace($cs, '(?s)<!--.*?-->', '')
  $pO = ([regex]::Matches($cs, '<p\b')).Count
  $pC = ([regex]::Matches($cs, '</p>')).Count
  $dO = ([regex]::Matches($cs, '<div\b')).Count
  $dC = ([regex]::Matches($cs, '</div>')).Count
  if ($pO -ne $pC -or $dO -ne $dC) {
    $name = Split-Path (Split-Path $f -Parent) -Leaf
    Write-Host ("[ERR] {0}  <p>:{1}/{2}  <div>:{3}/{4}" -f $name, $pO, $pC, $dO, $dC)
    $errCount++
  }
}
if ($errCount -eq 0) {
  Write-Host "`nAll 41 target files have balanced <p> and <div> after stripping <script>/<style>/comments."
} else {
  Write-Host ("`n{0} file(s) have imbalance" -f $errCount)
}
