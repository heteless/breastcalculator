# Move in-article ad from "before first H2" to "above calculator form" for 9 calculator pages
# This makes ads visible above the fold (where user attention is)

$root = 'd:\DevProject\breastcalculator'

# Calculator pages (those with actual calculator forms)
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

# Patterns to identify the calculator form wrapper (insert ad BEFORE this)
$calcFormPatterns = @(
  '(?s)<div[^>]*class="bra-calculator[^"]*"',  # bra-size-calculator, breast-volume
  '(?s)<div[^>]*class="tool-calculator[^"]*"',  # tools/* calculators
  '(?s)<section[^>]*class="hero"[^>]*>'  # generic hero section
)

# New in-article ad template (above the fold, optimized for tool sites)
$inArticleAdBlock = @'

        <!-- In-Article Ad (above the fold, above calculator form) -->
        <div class="article-in-ad" style="margin:24px auto;width:100%;max-width:min(100%, 720px);text-align:center;padding:16px 0;clear:both;min-height:200px;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);">
          <ins class="adsbygoogle"
               style="display:block; text-align:center;"
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="ca-pub-7388117485013143"
               data-ad-slot="3789259624"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
'@

# Regex to find existing in-article ad block
$existingAdPattern = '(?s)\s*<!--\s*In-Article Ad[^>]*-->\s*<div[^>]*class="article-in-ad"[^>]*>.*?</div>'

$report = @()
foreach ($d in $calcDirs) {
  $f = Join-Path $root (Join-Path $d 'index.html')
  if (-not (Test-Path $f)) {
    $report += [PSCustomObject]@{Page=$d; Status='SKIP (no file)'}
    continue
  }

  $c = [System.IO.File]::ReadAllText($f)

  # Find the calculator form position (first match)
  $calcFormPos = -1
  foreach ($pat in $calcFormPatterns) {
    $m = [regex]::Match($c, $pat)
    if ($m.Success -and ($calcFormPos -lt 0 -or $m.Index -lt $calcFormPos)) {
      $calcFormPos = $m.Index
    }
  }

  if ($calcFormPos -lt 0) {
    $report += [PSCustomObject]@{Page=$d; Status='SKIP (no calculator form found)'}
    continue
  }

  # Find existing in-article ad position
  $existingMatch = [regex]::Match($c, $existingAdPattern)
  $existingPos = if ($existingMatch.Success) { $existingMatch.Index } else { -1 }

  if ($existingPos -lt 0) {
    $report += [PSCustomObject]@{Page=$d; Status='SKIP (no existing in-article)'}
    continue
  }

  # If in-article is already ABOVE the calculator form, no change needed
  if ($existingPos -lt $calcFormPos) {
    $report += [PSCustomObject]@{Page=$d; Status='SKIP (already above calculator)'}
    continue
  }

  # Remove the existing in-article (the entire block)
  $cWithoutAd = $c.Substring(0, $existingMatch.Index) + $c.Substring($existingMatch.Index + $existingMatch.Length)

  # Re-find the calc form position in the modified content
  $newCalcFormPos = -1
  foreach ($pat in $calcFormPatterns) {
    $m = [regex]::Match($cWithoutAd, $pat)
    if ($m.Success -and ($newCalcFormPos -lt 0 -or $m.Index -lt $newCalcFormPos)) {
      $newCalcFormPos = $m.Index
    }
  }

  if ($newCalcFormPos -lt 0) {
    $report += [PSCustomObject]@{Page=$d; Status='SKIP (calc form vanished after removal)'}
    continue
  }

  # Insert the new in-article ad BEFORE the calculator form
  $cNew = $cWithoutAd.Substring(0, $newCalcFormPos) + $inArticleAdBlock + $cWithoutAd.Substring($newCalcFormPos)
  [System.IO.File]::WriteAllText($f, $cNew, [System.Text.UTF8Encoding]::new($false))

  $report += [PSCustomObject]@{Page=$d; Status='OK'; 'OldPos'=$existingPos; 'NewPos'=$newCalcFormPos}
}

$report | Format-Table -AutoSize
Write-Host ""
Write-Host ("Moved in-article ads to above-the-fold position.")
