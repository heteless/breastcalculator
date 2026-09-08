# Add MIDDLE ad to long articles (>=35 body paragraphs)
# Position: after the body paragraph at 50% mark
# Container: medium width 600px (different from top in-article and bottom 960px)

$articleRoot = 'd:\DevProject\breastcalculator\article'
$articles = Get-ChildItem -Path $articleRoot -Directory

$pattern = '(?is)<p\b[^>]*>.*?</p>'

# Middle ad template (slot 4196453734, medium container 600px)
$middleAdBlock = @'

        <!-- Middle Ad (medium width 600px) -->
        <div class="article-middle-ad" style="margin:36px auto;max-width:min(100%, 600px);padding:16px 20px;text-align:center;clear:both;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);min-height:120px;">
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

  # Skip if already has middle ad
  if ($c -match 'article-middle-ad') {
    $report += [PSCustomObject]@{Article=$a.Name; Status='SKIP (already has middle ad)'; BodyCount='-'}
    continue
  }

  $matches = [regex]::Matches($c, $pattern)
  $bodyMatches = @()
  foreach ($m in $matches) {
    $openTag = $m.Groups[0].Value.Substring(0, $m.Groups[0].Value.IndexOf('>') + 1)
    if ($openTag -match 'class="byline"|class="subtitle"') { continue }
    $bodyMatches += $m
  }

  if ($bodyMatches.Count -lt 35) {
    $report += [PSCustomObject]@{Article=$a.Name; Status="SKIP (body<35: $($bodyMatches.Count))"; BodyCount=$bodyMatches.Count}
    continue
  }

  # Insert after the body paragraph at 50% mark
  $targetIdx = [Math]::Floor($bodyMatches.Count / 2)
  $target = $bodyMatches[$targetIdx]
  $insertAt = $target.Index + $target.Length

  $newContent = $c.Substring(0, $insertAt) + $middleAdBlock + $c.Substring($insertAt)
  [System.IO.File]::WriteAllText($f, $newContent, [System.Text.UTF8Encoding]::new($false))

  $report += [PSCustomObject]@{Article=$a.Name; Status='OK'; BodyCount=$bodyMatches.Count; 'InsertAt'=$targetIdx}
}

$report | Format-Table -AutoSize
Write-Host ("`nAdded middle ad to long articles.")
