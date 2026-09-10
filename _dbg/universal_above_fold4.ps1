# Universal above-the-fold optimization (final version with both comment formats)
$root = 'd:\DevProject\breastcalculator'

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

# Match BOTH comment formats
$inArtPattern = '(?is)\s*<!--\s*(?:AdSense\s+)?In-Article Ad\s*-->\s*<div[^>]*class="article-in-ad"[^>]*>.*?</div>'
$h1Pattern = '(?is)<h1\b[^>]*>.*?</h1>'
$subtitlePattern = '(?is)^\s*<p[^>]*class="[^"]*(?:subtitle|byline)[^"]*"[^>]*>.*?</p>'
$heroSlotPattern = '(?is)<div class="hero-ad-slot"[^>]*>\s*<span[^>]*>\s*ADVERTISEMENT\s*</span>\s*</div>'

$report = @()
$movedCount = 0
$skippedCount = 0
$errCount = 0

foreach ($f in $allHtml) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $rel = $f.FullName.Substring($root.Length + 1)

  if ($c -notmatch '3789259624') {
    $skippedCount++
    continue
  }

  $heroMatch = [regex]::Match($c, $heroSlotPattern)
  $inArtMatch = [regex]::Match($c, $inArtPattern)

  if ($heroMatch.Success -and $inArtMatch.Success) {
    $adBlock = $inArticleAdBlock.TrimStart("`n").TrimStart()
    $cNew = $c.Substring(0, $heroMatch.Index) + $adBlock + $c.Substring($heroMatch.Index + $heroMatch.Length)
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

  $h1Match = [regex]::Match($c, $h1Pattern)
  if (-not $h1Match.Success) {
    $skippedCount++
    continue
  }

  $h1End = $h1Match.Index + $h1Match.Length
  $afterH1 = $c.Substring($h1End)
  $subtitleMatch = [regex]::Match($afterH1, $subtitlePattern)
  $insertPos = if ($subtitleMatch.Success) {
    $h1End + $subtitleMatch.Index + $subtitleMatch.Length
  } else {
    $h1End
  }

  if ([Math]::Abs($inArtMatch.Index - $insertPos) -lt 800) {
    $skippedCount++
    continue
  }

  $cWithoutAd = $c.Substring(0, $inArtMatch.Index) + $c.Substring($inArtMatch.Index + $inArtMatch.Length)
  $h1Match2 = [regex]::Match($cWithoutAd, $h1Pattern)
  if (-not $h1Match2.Success) {
    $errCount++
    continue
  }
  $h1End2 = $h1Match2.Index + $h1Match2.Length
  $afterH12 = $cWithoutAd.Substring($h1End2)
  $subtitleMatch2 = [regex]::Match($afterH12, $subtitlePattern)
  $insertPos2 = if ($subtitleMatch2.Success) {
    $h1End2 + $subtitleMatch2.Index + $subtitleMatch2.Length
  } else {
    $h1End2
  }
  $cNew = $cWithoutAd.Substring(0, $insertPos2) + $inArticleAdBlock + $cWithoutAd.Substring($insertPos2)
  [System.IO.File]::WriteAllText($f.FullName, $cNew, [System.Text.UTF8Encoding]::new($false))
  $movedCount++
  $report += [PSCustomObject]@{File=$rel; Action='Moved to above-the-fold'; OldPos=$inArtMatch.Index; NewPos=$insertPos2}
}

$report | Format-Table -AutoSize -Wrap
Write-Host ""
Write-Host ("Moved: {0}  Skipped: {1}  Errors: {2}" -f $movedCount, $skippedCount, $errCount)
