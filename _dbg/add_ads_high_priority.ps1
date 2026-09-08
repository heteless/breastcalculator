# Add in-article ad (after 2nd body paragraph) and bottom ad (before </main>) to high-priority pages
# High-priority: bra-size-guide size variants, compare, h-cup, wellness, tools, specials, guide

$root = 'd:\DevProject\breastcalculator'

# High-priority file list
$targets = @()

# 1. bra-size-guide size variants (64 files: 28-44 x {a,aa,b,c,d,dd,ddd,g})
foreach ($band in @(28, 30, 32, 34, 36, 38, 40, 42, 44)) {
  foreach ($cup in @('a','aa','b','c','d','dd','ddd','g')) {
    $targets += (Join-Path $root "bra-size-guide\$band$cup\index.html")
  }
}

# 2. bra-size-guide compare pages (11)
$compareDirs = @('32d-vs-34c','34b-vs-36c','34dd-vs-36d','36b-vs-34c','38c-vs-40b','b-cup-vs-c-cup','breast-size-chart','c-cup-vs-d-cup','d-cup-vs-dd-cup','dd-cup-vs-ddd-cup','wireless-vs-wired-bra')
foreach ($d in $compareDirs) {
  $targets += (Join-Path $root "bra-size-guide\compare\$d\index.html")
}

# 3. bra-size-guide h-cup (1)
$targets += (Join-Path $root 'bra-size-guide\h-cup\index.html')

# 4. wellness pages (15)
$wellnessDirs = @('bra-care-after-surgery','bra-discomfort-after-surgery','bra-tightness-after-surgery','breast-self-exam','compression-vs-support-bras','front-vs-back-closure-bras','mastectomy-bra-guide','pocketed-bras-guide','post-surgery-bra-mistakes','post-surgery-bra-recovery-timeline','prosthetic-bras-guide','sensitive-skin-bra-materials','sleeping-after-breast-surgery','sports-bras-after-surgery','swelling-after-surgery-bras')
foreach ($d in $wellnessDirs) {
  $targets += (Join-Path $root "wellness\$d\index.html")
}

# 5. tools sub-calculators (7, exclude tools/index.html)
$toolsDirs = @('breast-expansion-calculator','breast-ptosis-calculator','breast-shape-calculator','breast-volume-calculator','breast-weight-calculator','length-converter','weight-converter')
foreach ($d in $toolsDirs) {
  $targets += (Join-Path $root "tools\$d\index.html")
}

# 6. specials (6)
$specialsDirs = @('accessory-breast-guide','buying-guide','expansion-evidence','ptosis-prevention-evidence','sports-bra-science','why-d-cup-support')
foreach ($d in $specialsDirs) {
  $targets += (Join-Path $root "specials\$d\index.html")
}

# 7. guide (2)
$guideDirs = @('comfortable-wireless-bras','no-underwire-bras')
foreach ($d in $guideDirs) {
  $targets += (Join-Path $root "guide\$d\index.html")
}

Write-Host ("Total target files: {0}" -f $targets.Count)

# Ad templates
$inArticleAd = @'

        <!-- In-Article Ad -->
        <div class="article-in-ad" style="margin:40px auto;width:100%;max-width:100%;text-align:center;padding:18px 0;clear:both;min-height:260px;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);">
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

$bottomAd = @'

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

$preconnect = "`n    <link rel=`"preconnect`" href=`"https://pagead2.googlesyndication.com`" crossorigin>`n    <link rel=`"preconnect`" href=`"https://googleads.g.doubleclick.net`" crossorigin>`n    <link rel=`"preconnect`" href=`"https://www.googletagmanager.com`" crossorigin>"

$pattern = '(?is)<p\b[^>]*>.*?</p>'

$okCount = 0; $skipCount = 0; $errCount = 0
$report = @()
foreach ($f in $targets) {
  if (-not (Test-Path $f)) {
    $report += [PSCustomObject]@{File=(Split-Path (Split-Path $f -Parent) -Leaf); Status='SKIP (no file)'}
    $errCount++
    continue
  }

  $c = [System.IO.File]::ReadAllText($f)

  # Skip if already has both ads
  if ($c -match '3789259624' -and $c -match '4196453734') {
    $report += [PSCustomObject]@{File=(Split-Path (Split-Path $f -Parent) -Leaf); Status='SKIP (already has both ads)'}
    $skipCount++
    continue
  }

  $modified = $false

  # Insert in-article ad after 2nd body paragraph
  if ($c -notmatch '3789259624') {
    $matches = [regex]::Matches($c, $pattern)
    $bodyMatches = @()
    foreach ($m in $matches) {
      $openTag = $m.Groups[0].Value.Substring(0, $m.Groups[0].Value.IndexOf('>') + 1)
      if ($openTag -match 'class="byline"|class="subtitle"') { continue }
      $bodyMatches += $m
    }

    if ($bodyMatches.Count -ge 2) {
      $target = $bodyMatches[1]
      $insertAt = $target.Index + $target.Length
      $c = $c.Substring(0, $insertAt) + $inArticleAd + $c.Substring($insertAt)
      $modified = $true
    }
  }

  # Insert bottom ad before </main>
  if ($c -notmatch '4196453734') {
    $mainEndTag = '</main>'
    $idx = $c.LastIndexOf($mainEndTag)
    if ($idx -gt 0) {
      $c = $c.Substring(0, $idx) + $bottomAd + $c.Substring($idx)
      $modified = $true
    }
  }

  # Add preconnect if not present
  if ($c -notmatch 'preconnect[^>]*pagead2\.googlesyndication\.com') {
    $marker = '<link rel="stylesheet" href="/main.css"/>'
    $idx = $c.IndexOf($marker)
    if ($idx -gt 0) {
      $insertAt = $idx + $marker.Length
      $c = $c.Substring(0, $insertAt) + $preconnect + $c.Substring($insertAt)
      $modified = $true
    }
  }

  if ($modified) {
    [System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
    $okCount++
    $report += [PSCustomObject]@{File=(Split-Path (Split-Path $f -Parent) -Leaf); Status='OK'}
  } else {
    $report += [PSCustomObject]@{File=(Split-Path (Split-Path $f -Parent) -Leaf); Status='SKIP (no changes needed)'}
  }
}

$report | Format-Table -AutoSize
Write-Host ""
Write-Host ("OK: {0}  Skipped: {1}  Errors: {2}" -f $okCount, $skipCount, $errCount)
