# Universal "above the fold" optimization for all ad pages
# For each ad page: if in-article ad is NOT already in a high-visibility position,
# MOVE it to right after the h1 (or hero description, if hero exists)

$root = 'd:\DevProject\breastcalculator'

# Get all ad pages (skip _dbg and dist artifacts)
$allHtml = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -ErrorAction SilentlyContinue
$allHtml = $allHtml | Where-Object {
  $_.FullName -notmatch '\\dist\\' -and
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\.next-dev-server\\' -and
  $_.FullName -notmatch '\.wrangler' -and
  $_.FullName -notmatch '\.well-known' -and
  $_.FullName -notmatch '\.backup' -and
  $_.FullName -notmatch '\\_dbg\\'
}

# Standard in-article ad block (the one I just added to bra-size-calculator and breast-volume)
$inArticleAdBlock = @'

        <!-- In-Article Ad (above the fold) -->
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

# Regex patterns
# Existing in-article block (any variation)
$inArtPattern = '(?s)\s*<!--\s*In-Article Ad[^>]*-->\s*<div[^>]*class="article-in-ad"[^>]*>.*?</div>'

# Empty hero-ad-slot placeholder
$heroSlotPattern = '(?s)<div class="hero-ad-slot"[^>]*>\s*<span[^>]*>\s*ADVERTISEMENT\s*</span>\s*</div>'

# Find the "above the fold" position: right after h1, after subtitle/byline if present
# Strategy: find <h1 ...>...</h1> closing, then optional subtitle paragraph
$aboveFoldPattern = '(?s)(<h1[^>]*>.*?</h1>)(\s*<p[^>]*class="[^"]*(?:subtitle|byline)[^"]*"[^>]*>.*?</p>)?'

$report = @()
$movedCount = 0
$skippedCount = 0
$errCount = 0

foreach ($f in $allHtml) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $rel = $f.FullName.Substring($root.Length + 1)

  # Skip pages without ads
  if ($c -notmatch '3789259624') {
    $skippedCount++
    continue
  }

  # Check if there's an empty hero-ad-slot placeholder - if yes, fill it
  $heroMatch = [regex]::Match($c, $heroSlotPattern)
  $inArtMatch = [regex]::Match($c, $inArtPattern)

  if ($heroMatch.Success -and $inArtMatch.Success) {
    # Fill the empty hero-ad-slot with the in-article ad
    # (this is what I did for bra-size-calculator and breast-volume)
    $adBlock = $inArticleAdBlock.TrimStart("`n").TrimStart()
    $cNew = $c.Substring(0, $heroMatch.Index) + $adBlock + $c.Substring($heroMatch.Index + $heroMatch.Length)

    # Remove the old in-article (now there are 2)
    $inArtMatch2 = [regex]::Match($cNew, $inArtPattern)
    if ($inArtMatch2.Success) {
      $cNew = $cNew.Substring(0, $inArtMatch2.Index) + $cNew.Substring($inArtMatch2.Index + $inArtMatch2.Length)
    }

    [System.IO.File]::WriteAllText($f.FullName, $cNew, [System.Text.UTF8Encoding]::new($false))
    $movedCount++
    $report += [PSCustomObject]@{File=$rel; Action='Filled hero-ad-slot'}
    continue
  }

  if (-not $inArtMatch.Success) {
    $skippedCount++
    continue
  }

  # Find h1 position
  $h1Match = [regex]::Match($c, '<h1[^>]*>.*?</h1>')
  if (-not $h1Match.Success) {
    $skippedCount++
    continue
  }

  # Find if there's a subtitle paragraph right after h1
  $h1End = $h1Match.Index + $h1Match.Length
  $subtitleMatch = [regex]::Match($c.Substring($h1End), '^\s*<p[^>]*class="[^"]*(?:subtitle|byline)[^"]*"[^>]*>.*?</p>', 'Singleline')

  # Compute the "above the fold" insertion point
  $insertPos = if ($subtitleMatch.Success) {
    $h1End + $subtitleMatch.Index + $subtitleMatch.Length
  } else {
    $h1End
  }

  # Check if the in-article is already above this point
  if ($inArtMatch.Index -lt $insertPos) {
    # Already in good position, but check distance
    $distance = $insertPos - $inArtMatch.Index
    if ($distance -lt 500) {
      $skippedCount++
      continue
    }
  }

  # Remove the in-article from its current position
  $cWithoutAd = $c.Substring(0, $inArtMatch.Index) + $c.Substring($inArtMatch.Index + $inArtMatch.Length)

  # Re-find insertion position (positions may have shifted)
  $h1Match2 = [regex]::Match($cWithoutAd, '<h1[^>]*>.*?</h1>')
  if (-not $h1Match2.Success) {
    $skippedCount++
    continue
  }

  $h1End2 = $h1Match2.Index + $h1Match2.Length
  $subtitleMatch2 = [regex]::Match($cWithoutAd.Substring($h1End2), '^\s*<p[^>]*class="[^"]*(?:subtitle|byline)[^"]*"[^>]*>.*?</p>', 'Singleline')

  $insertPos2 = if ($subtitleMatch2.Success) {
    $h1End2 + $subtitleMatch2.Index + $subtitleMatch2.Length
  } else {
    $h1End2
  }

  # Insert the in-article at the new position
  $cNew = $cWithoutAd.Substring(0, $insertPos2) + $inArticleAdBlock + $cWithoutAd.Substring($insertPos2)
  [System.IO.File]::WriteAllText($f.FullName, $cNew, [System.Text.UTF8Encoding]::new($false))
  $movedCount++
  $report += [PSCustomObject]@{File=$rel; Action='Moved to above-the-fold'; OldPos=$inArtMatch.Index; NewPos=$insertPos2}
}

$report | Format-Table -AutoSize -Wrap
Write-Host ""
Write-Host ("Moved: {0}  Skipped (no change needed): {1}  Errors: {2}" -f $movedCount, $skippedCount, $errCount)
