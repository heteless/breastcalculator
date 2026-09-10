# Universal "above the fold" optimization for all ad pages (FIXED regex)
$root = 'd:\DevProject\breastcalculator'

# Get all ad pages
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

# New in-article ad block (above the fold style)
$inArticleAdBlock = @'

        <!-- AdSense In-Article Ad -->
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

# FIXED patterns: comments say "AdSense In-Article Ad"
$inArtPattern = '(?is)\s*<!--\s*AdSense In-Article Ad\s*-->\s*<div[^>]*class="article-in-ad"[^>]*>.*?</div>'
$heroSlotPattern = '(?s)<div class="hero-ad-slot"[^>]*>\s*<span[^>]*>\s*ADVERTISEMENT\s*</span>\s*</div>'

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

  # Find the end of the h1 block
  $h1End = $h1Match.Index + $h1Match.Length

  # Find if there's a subtitle paragraph right after h1
  $afterH1 = $c.Substring($h1End)
  $subtitleMatch = [regex]::Match($afterH1, '^\s*<p[^>]*class="[^"]*(?:subtitle|byline)[^"]*"[^>]*>.*?</p>')

  # Compute the "above the fold" insertion point
  $insertPos = if ($subtitleMatch.Success) {
    $h1End + $subtitleMatch.Index + $subtitleMatch.Length
  } else {
    $h1End
  }

  # Check if the in-article is already close to this position (within 800 chars)
  if ($inArtMatch.Index -lt $insertPos + 800 -and $inArtMatch.Index -ge $insertPos - 200) {
    $skippedCount++
    continue
  }

  # Remove the in-article from its current position
  $cWithoutAd = $c.Substring(0, $inArtMatch.Index) + $c.Substring($inArtMatch.Index + $inArtMatch.Length)

  # Re-find insertion position
  $h1Match2 = [regex]::Match($cWithoutAd, '<h1[^>]*>.*?</h1>')
  if (-not $h1Match2.Success) {
    $skippedCount++
    continue
  }

  $h1End2 = $h1Match2.Index + $h1Match2.Length
  $afterH12 = $cWithoutAd.Substring($h1End2)
  $subtitleMatch2 = [regex]::Match($afterH12, '^\s*<p[^>]*class="[^"]*(?:subtitle|byline)[^"]*"[^>]*>.*?</p>')

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
Write-Host ("Moved: {0}  Skipped: {1}  Errors: {2}" -f $movedCount, $skippedCount, $errCount)
