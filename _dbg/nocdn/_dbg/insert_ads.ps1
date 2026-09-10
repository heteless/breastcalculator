# Insert AdSense in-article ad after the 2nd body paragraph of each article
# Ad code: ca-pub-7388117485013143, slot 3789259624 (in-article fluid)
# Loader script is already in <head>, so we only insert the <ins> + push snippet

$articleRoot = 'd:\DevProject\breastcalculator\article'
$articles = Get-ChildItem -Path $articleRoot -Directory

# The ad block to insert. Indented to match the surrounding article content.
$adBlock = @'

        <!-- AdSense In-Article Ad -->
        <div class="article-in-ad" style="margin:32px auto;max-width:680px;text-align:center;padding:16px 0;clear:both;">
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

# Regex: match <p>...</p> at body level (non-greedy, with word boundary)
$pattern = '(?is)<p\b[^>]*>.*?</p>'

$report = @()
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (-not (Test-Path $f)) { continue }

  $c = [System.IO.File]::ReadAllText($f)
  $matches = [regex]::Matches($c, $pattern)

  # Filter out byline/subtitle paragraphs
  $bodyMatches = @()
  foreach ($m in $matches) {
    $openTag = $m.Groups[0].Value.Substring(0, $m.Groups[0].Value.IndexOf('>') + 1)
    if ($openTag -match 'class="byline"|class="subtitle"') { continue }
    $bodyMatches += $m
  }

  if ($bodyMatches.Count -lt 2) {
    $report += [PSCustomObject]@{Article=$a.Name; Status='SKIP (not enough body paragraphs)'; Pos2='-'}
    continue
  }

  $target = $bodyMatches[1]  # 2nd body paragraph
  $insertAt = $target.Index + $target.Length  # right after </p>

  # Insert the ad block
  $newContent = $c.Substring(0, $insertAt) + $adBlock + $c.Substring($insertAt)

  [System.IO.File]::WriteAllText($f, $newContent, [System.Text.UTF8Encoding]::new($false))

  $report += [PSCustomObject]@{Article=$a.Name; Status='OK'; Pos2=$target.Index}
}

$report | Format-Table -AutoSize -Wrap
Write-Host ("`nProcessed {0} article(s)." -f $report.Count)
