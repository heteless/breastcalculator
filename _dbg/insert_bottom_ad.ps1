# Insert bottom ad (slot 4196453734) at the end of main content
# Targets: calculator/guide pages + 12 long articles (body <p> count >= 25)

$root = 'd:\DevProject\breastcalculator'

# Pages that should always receive the bottom ad (calculator/guide-style pages)
$alwaysInclude = @(
  'bra-size-calculator',
  'bra-size-guide',
  'breast-volume',
  'best-comfort-bras',
  'best-wireless-bras',
  'bra-buying-guide',
  'how-to-measure-bra-size',
  'sports-bra-guide',
  'wellness',
  'specials'
)

# Ad block to insert
$adBlock = @'

    <!-- Bottom Ad (auto / full-width responsive) -->
    <div class="article-bottom-ad" style="margin:40px auto 24px;max-width:980px;padding:16px 20px;text-align:center;clear:both;background:var(--bg-card);border-radius:var(--radius);">
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

# Build target list
$targets = @()
foreach ($d in $alwaysInclude) {
  $idx = Join-Path $root (Join-Path $d 'index.html')
  if (Test-Path $idx) { $targets += $idx }
}

# Add long articles (body <p> >= 25, excluding byline/subtitle)
$articleRoot = Join-Path $root 'article'
$articles = Get-ChildItem -Path $articleRoot -Directory
$pattern = '(?is)<p\b[^>]*>.*?</p>'
foreach ($a in $articles) {
  $f = Join-Path $a.FullName 'index.html'
  if (-not (Test-Path $f)) { continue }
  $c = [System.IO.File]::ReadAllText($f)
  $matches = [regex]::Matches($c, $pattern)
  $bodyCount = 0
  foreach ($m in $matches) {
    $openTag = $m.Groups[0].Value.Substring(0, $m.Groups[0].Value.IndexOf('>') + 1)
    if ($openTag -match 'class="byline"|class="subtitle"') { continue }
    $bodyCount++
  }
  if ($bodyCount -ge 25) {
    $targets += $f
  }
}

Write-Host ("Targeting {0} page(s) for bottom ad insertion." -f $targets.Count)
Write-Host ""

$report = @()
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)

  # Skip if already has this slot
  if ($c -match '4196453734') {
    $report += [PSCustomObject]@{File = (Split-Path (Split-Path $f -Parent) -Leaf); Status = 'SKIP (already has bottom ad)'}
    continue
  }

  # Find </main> tag
  $mainEndTag = '</main>'
  $idx = $c.LastIndexOf($mainEndTag)
  if ($idx -lt 0) {
    $report += [PSCustomObject]@{File = (Split-Path (Split-Path $f -Parent) -Leaf); Status = 'SKIP (no </main>)'}
    continue
  }

  # Insert ad block right before </main>
  $newContent = $c.Substring(0, $idx) + $adBlock + $c.Substring($idx)
  [System.IO.File]::WriteAllText($f, $newContent, [System.Text.UTF8Encoding]::new($false))

  $report += [PSCustomObject]@{File = (Split-Path (Split-Path $f -Parent) -Leaf); Status = 'OK'; 'Insert at' = $idx}
}

$report | Format-Table -AutoSize -Wrap
Write-Host ("`nDone. Processed {0} file(s)." -f $report.Count)
