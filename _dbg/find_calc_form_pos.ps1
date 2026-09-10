# Identify calculator pages and their form structure
$root = 'd:\DevProject\breastcalculator'
$calcDirs = @(
  'bra-size-calculator',
  'breast-volume',
  'tools/breast-expansion-calculator',
  'tools/breast-ptosis-calculator',
  'tools/breast-shape-calculator',
  'tools/breast-volume-calculator',
  'tools/breast-weight-calculator',
  'tools/length-converter',
  'tools/weight-converter'
)
$report = @()
foreach ($d in $calcDirs) {
  $f = Join-Path $root (Join-Path $d 'index.html')
  if (Test-Path $f) {
    $c = [System.IO.File]::ReadAllText($f)
    # Find calculator form position
    $formMatch = [regex]::Match($c, 'class="bra-calculator[^"]*"|<form[^>]*class="calc-form"|<form[^>]*id="size-form"')
    $inArtMatch = [regex]::Match($c, 'class="article-in-ad"')
    $inArtPos = if ($inArtMatch.Success) { $inArtMatch.Index } else { -1 }
    $formPos = if ($formMatch.Success) { $formMatch.Index } else { -1 }
    $rel = $d
    $inArtAboveForm = ($inArtPos -lt $formPos -and $inArtPos -gt 0)
    $report += [PSCustomObject]@{
      Page = $rel
      'FormPos' = $formPos
      'InArtPos' = $inArtPos
      'InArtAboveForm' = $inArtAboveForm
    }
  }
}
$report | Format-Table -AutoSize
