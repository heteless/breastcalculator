# Add MIDDLE ad to calculator/guide pages
# Position: right BEFORE the second H2 (places ad in the middle of content)
# Container: medium width 540px (matches calculator card width)

$root = 'd:\DevProject\breastcalculator'
$dirs = @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')
$targets = @()
foreach ($d in $dirs) {
  $targets += (Join-Path $root (Join-Path $d 'index.html'))
}

# Middle ad template (slot 4196453734, medium 540px to match embedded calculator)
$middleAdBlock = @'

    <!-- Middle Ad (medium 540px) -->
    <div class="article-middle-ad" style="margin:36px auto;max-width:min(100%, 540px);padding:16px 20px;text-align:center;clear:both;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);min-height:120px;">
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
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)

  # Skip if already has middle ad
  if ($c -match 'article-middle-ad') {
    $report += [PSCustomObject]@{File=(Split-Path (Split-Path $f -Parent) -Leaf); Status='SKIP (already has middle ad)'}
    continue
  }

  # Find the second H2 tag
  $h2Pattern = '(?is)<h2\b[^>]*>.*?</h2>'
  $h2Matches = [regex]::Matches($c, $h2Pattern)
  if ($h2Matches.Count -lt 2) {
    $report += [PSCustomObject]@{File=(Split-Path (Split-Path $f -Parent) -Leaf); Status="SKIP (only $($h2Matches.Count) H2)"}
    continue
  }

  # Insert the middle ad right before the second H2
  $targetH2 = $h2Matches[1]
  $insertAt = $targetH2.Index

  $newContent = $c.Substring(0, $insertAt) + $middleAdBlock + $c.Substring($insertAt)
  [System.IO.File]::WriteAllText($f, $newContent, [System.Text.UTF8Encoding]::new($false))

  $report += [PSCustomObject]@{File=(Split-Path (Split-Path $f -Parent) -Leaf); Status='OK'; H2Count=$h2Matches.Count}
}

$report | Format-Table -AutoSize
Write-Host ("`nAdded middle ad to calculator/guide pages.")
