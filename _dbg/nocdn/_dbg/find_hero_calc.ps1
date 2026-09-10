# Find hero/calculator sections in all calculator pages
$root = 'd:\DevProject\breastcalculator'
$calcDirs = @(
  'bra-size-calculator','breast-volume',
  'tools/breast-expansion-calculator','tools/breast-ptosis-calculator',
  'tools/breast-shape-calculator','tools/breast-volume-calculator',
  'tools/breast-weight-calculator','tools/length-converter','tools/weight-converter'
)
foreach ($d in $calcDirs) {
  $f = Join-Path $root (Join-Path $d 'index.html')
  if (Test-Path $f) {
    $c = [System.IO.File]::ReadAllText($f)
    Write-Host "==== $d ===="
    # Find hero/calc markers
    $patterns = @(
      '<section class="hero"|<section class="tool-hero"|<section class="home-hero"|<div class="hero[^-]|<div class="calc-container"|class="bra-calculator[^-]|class="tool-calculator|class="calc-shell',
      '<h1[^>]*>',
      'class="hero-ad-slot"',
      'class="article-in-ad"',
      'class="article-middle-ad"',
      'class="article-bottom-ad"',
      'id="bc-debug"|id="size-result"|id="calc-result"',
      '</main>'
    )
    foreach ($p in $patterns) {
      $m = [regex]::Match($c, $p)
      if ($m.Success) {
        Write-Host ("  [{0}] at {1}" -f $p, $m.Index)
      }
    }
  }
}
