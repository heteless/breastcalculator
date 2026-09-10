# Move in-article ad to fill the empty hero-ad-slot placeholder for bra-size-calculator and breast-volume
# These 2 pages have an empty hero-ad-slot placeholder at the very top - perfect for above-the-fold ad

$root = 'd:\DevProject\breastcalculator'
$targets = @('bra-size-calculator', 'breast-volume')

$inArticleAdBlock = @'

        <!-- In-Article Ad (filling hero-ad-slot for above-the-fold visibility) -->
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

# Regex to find the existing empty hero-ad-slot placeholder
$heroSlotPattern = '(?s)<div class="hero-ad-slot"[^>]*>\s*<span[^>]*>\s*ADVERTISEMENT\s*</span>\s*</div>'

# Regex to find the existing in-article block (with our wrapper)
$existingInArtPattern = '(?s)\s*<!--\s*In-Article Ad[^>]*-->\s*<div[^>]*class="article-in-ad"[^>]*>.*?</div>'

$report = @()
foreach ($d in $targets) {
  $f = Join-Path $root (Join-Path $d 'index.html')
  if (-not (Test-Path $f)) {
    $report += [PSCustomObject]@{Page=$d; Status='SKIP (no file)'}
    continue
  }

  $c = [System.IO.File]::ReadAllText($f)

  # Find the empty hero-ad-slot
  $heroMatch = [regex]::Match($c, $heroSlotPattern)
  if (-not $heroMatch.Success) {
    $report += [PSCustomObject]@{Page=$d; Status='SKIP (no empty hero-ad-slot)'}
    continue
  }

  # Find the existing in-article block
  $inArtMatch = [regex]::Match($c, $existingInArtPattern)
  if (-not $inArtMatch.Success) {
    $report += [PSCustomObject]@{Page=$d; Status='SKIP (no existing in-article to move)'}
    continue
  }

  # Replace the empty hero-ad-slot with our in-article ad
  $cNew = $c.Substring(0, $heroMatch.Index) + $inArticleAdBlock.TrimStart("`n").TrimStart() + $c.Substring($heroMatch.Index + $heroMatch.Length)

  # Remove the old in-article (its position has shifted after replacement)
  $inArtMatch2 = [regex]::Match($cNew, $existingInArtPattern)
  if ($inArtMatch2.Success) {
    $cNew = $cNew.Substring(0, $inArtMatch2.Index) + $cNew.Substring($inArtMatch2.Index + $inArtMatch2.Length)
  }

  [System.IO.File]::WriteAllText($f, $cNew, [System.Text.UTF8Encoding]::new($false))
  $report += [PSCustomObject]@{Page=$d; Status='OK'; 'HeroOldPos'=$heroMatch.Index; 'InArtOldPos'=$inArtMatch.Index}
}

$report | Format-Table -AutoSize
Write-Host ""
Write-Host "Filled empty hero-ad-slot with in-article ad for 2 calculator-info pages."
