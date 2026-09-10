# Add In-Article ad (slot 3789259624) to calculator/guide pages and homepage
# Use different container widths for visual variety

$root = 'd:\DevProject\breastcalculator'

# Calculator/guide pages with target container width
$pages = @(
  @{Path='bra-size-calculator'; Width='540px'; Type='calc'; Note='narrow - matches embedded calculator card'},
  @{Path='bra-size-guide'; Width='640px'; Type='guide'; Note='medium - article-like content'},
  @{Path='breast-volume'; Width='540px'; Type='calc'; Note='narrow - matches embedded calculator card'},
  @{Path='best-comfort-bras'; Width='640px'; Type='guide'; Note='medium - article-like content'},
  @{Path='best-wireless-bras'; Width='640px'; Type='guide'; Note='medium - article-like content'},
  @{Path='bra-buying-guide'; Width='640px'; Type='guide'; Note='medium - article-like content'},
  @{Path='how-to-measure-bra-size'; Width='640px'; Type='guide'; Note='medium - article-like content'},
  @{Path='sports-bra-guide'; Width='640px'; Type='guide'; Note='medium - article-like content'},
  @{Path='wellness'; Width='640px'; Type='guide'; Note='medium - article-like content'},
  @{Path='specials'; Width='640px'; Type='guide'; Note='medium - article-like content'}
)

# In-Article ad template (different widths)
function Make-InArticle-Ad($width) {
  $maxW = "min(100%, $width)"
  return @"

    <!-- In-Article Ad ($width wide) -->
    <div class="article-in-ad" style="margin:40px auto;width:100%;max-width:100%;text-align:center;padding:18px 0;clear:both;min-height:260px;max-width:$maxW;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);">
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
"@
}

$report = @()
foreach ($p in $pages) {
  $f = Join-Path $root (Join-Path $p.Path 'index.html')
  if (-not (Test-Path $f)) {
    $report += [PSCustomObject]@{Page=$p.Path; Status='SKIP (no file)'}
    continue
  }

  $c = [System.IO.File]::ReadAllText($f)

  # Skip if already has in-article
  if ($c -match 'article-in-ad' -and $c -match '3789259624') {
    $report += [PSCustomObject]@{Page=$p.Path; Status='SKIP (already has in-article)'}
    continue
  }

  # Find the FIRST <h2> to insert before it
  $h2Pattern = '(?is)<h2\b[^>]*>.*?</h2>'
  $h2Match = [regex]::Match($c, $h2Pattern)
  if (-not $h2Match.Success) {
    $report += [PSCustomObject]@{Page=$p.Path; Status='SKIP (no H2 found)'}
    continue
  }

  $insertAt = $h2Match.Index
  $adBlock = Make-InArticle-Ad $p.Width
  $newContent = $c.Substring(0, $insertAt) + $adBlock + $c.Substring($insertAt)
  [System.IO.File]::WriteAllText($f, $newContent, [System.Text.UTF8Encoding]::new($false))

  $report += [PSCustomObject]@{Page=$p.Path; Status='OK'; Width=$p.Width; Position='Before 1st H2'}
}

$report | Format-Table -AutoSize -Wrap
Write-Host "`nAdded in-article ads to calculator/guide pages."
