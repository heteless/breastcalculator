# Add BOTTOM ad to short articles (body <25 paragraphs) that don't have it yet
# Container: same as other bottom ads (960px wide, sand-light bg, 1px border, min-height 120px)

$articleRoot = 'd:\DevProject\breastcalculator\article'
$articles = Get-ChildItem -Path $articleRoot -Directory

$pattern = '(?is)<p\b[^>]*>.*?</p>'

# Bottom ad template
$bottomAdBlock = @'

    <!-- Bottom Ad (auto / full-width responsive) -->
    <div class="article-bottom-ad" style="margin:40px auto 24px;max-width:min(100%, 960px);padding:18px 22px;text-align:center;clear:both;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);min-height:120px;">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-7388117485013143"
           data-ad-slot="4196453734"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
'@

$report = @()
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (-not (Test-Path $f)) { continue }

  $c = [System.IO.File]::ReadAllText($f)

  # Skip if already has bottom ad
  if ($c -match 'article-bottom-ad' -and $c -match '4196453734') {
    $report += [PSCustomObject]@{Article=$a.Name; Status='SKIP (already has bottom ad)'}
    continue
  }

  # Count body paragraphs
  $matches = [regex]::Matches($c, $pattern)
  $bodyCount = 0
  foreach ($m in $matches) {
    $openTag = $m.Groups[0].Value.Substring(0, $m.Groups[0].Value.IndexOf('>') + 1)
    if ($openTag -match 'class="byline"|class="subtitle"') { continue }
    $bodyCount++
  }

  if ($bodyCount -ge 25) {
    $report += [PSCustomObject]@{Article=$a.Name; Status="SKIP (body>=25: $bodyCount)"}
    continue
  }

  # Find </main> to insert before it
  $mainEndTag = '</main>'
  $idx = $c.LastIndexOf($mainEndTag)
  if ($idx -lt 0) {
    $report += [PSCustomObject]@{Article=$a.Name; Status='SKIP (no </main>)'}
    continue
  }

  $newContent = $c.Substring(0, $idx) + $bottomAdBlock + $c.Substring($idx)
  [System.IO.File]::WriteAllText($f, $newContent, [System.Text.UTF8Encoding]::new($false))

  $report += [PSCustomObject]@{Article=$a.Name; Status='OK'; BodyCount=$bodyCount}
}

$report | Format-Table -AutoSize
Write-Host ("`nAdded bottom ad to short articles.")
