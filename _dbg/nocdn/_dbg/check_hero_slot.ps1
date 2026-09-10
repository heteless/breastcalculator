# Investigate the hero-ad-slot in bra-size-calculator and breast-volume
$files = @(
  'd:\DevProject\breastcalculator\bra-size-calculator\index.html',
  'd:\DevProject\breastcalculator\breast-volume\index.html'
)
foreach ($f in $files) {
  Write-Host ("==== {0} ====" -f (Split-Path (Split-Path $f -Parent) -Leaf))
  $c = Get-Content $f -Raw
  $matches = [regex]::Matches($c, '(?s)<div[^>]*class="hero-ad-slot"[^>]*>.*?</div>')
  foreach ($m in $matches) {
    Write-Host ("Hero ad slot at index {0}, length {1}" -f $m.Index, $m.Length)
    $snippet = $m.Value
    if ($snippet.Length -gt 600) { $snippet = $snippet.Substring(0, 600) + "..." }
    Write-Host $snippet
    Write-Host ""
  }
}
