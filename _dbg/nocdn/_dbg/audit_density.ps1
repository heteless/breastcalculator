$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$rows = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $ins = ([regex]::Matches($c, '<ins class="adsbygoogle"')).Count
    if ($ins -eq 0) { continue }
    $rel = $f.FullName.Replace($root + '\', '')
    # strip scripts/styles to measure real content
    $m = [regex]::Replace($c, '(?s)<script.*?</script>', '')
    $m = [regex]::Replace($m, '(?s)<style.*?</style>', '')
    $m = [regex]::Replace($m, '(?s)<nav.*?</nav>', '')
    $m = [regex]::Replace($m, '(?s)<footer.*?</footer>', '')
    $m = [regex]::Replace($m, '(?s)<div class="drawer".*?</div>\s*</div>', '')
    $paras = ([regex]::Matches($m, '<p\b')).Count
    $h2s = ([regex]::Matches($m, '<h2\b')).Count
    $text = [regex]::Replace($m, '(?s)<[^>]+>', ' ')
    $text = [System.Net.WebUtility]::HtmlDecode($text)
    $words = ([regex]::Matches($text, '\b[A-Za-z][A-Za-z''-]+\b')).Count
    $rows += [pscustomobject]@{
        Page   = $rel
        Ads    = $ins
        HasMid = ($c -match 'article-middle-ad')
        Words  = $words
        Paras  = $paras
        H2     = $h2s
    }
}
Write-Host "Ad pages: $($rows.Count)"
Write-Host ""
foreach ($n in 1, 2, 3) {
    $g = $rows | Where-Object { $_.Ads -eq $n }
    Write-Host ("Ads={0}  pages={1}" -f $n, $g.Count)
}
Write-Host ""
Write-Host "=== 2-ad pages, sorted by word count (top 40) ==="
$rows | Where-Object { $_.Ads -eq 2 } | Sort-Object Words -Descending | Select-Object -First 40 |
    ForEach-Object { Write-Host ("   words={0,-6} paras={1,-4} h2={2,-3} {3}" -f $_.Words, $_.Paras, $_.H2, $_.Page) }
Write-Host ""
Write-Host "=== 2-ad pages word-count buckets ==="
$two = $rows | Where-Object { $_.Ads -eq 2 }
$b = @{ '<600' = 0; '600-1200' = 0; '1200-2000' = 0; '2000-3000' = 0; '>=3000' = 0 }
foreach ($r in $two) {
    if ($r.Words -lt 600) { $b['<600']++ }
    elseif ($r.Words -lt 1200) { $b['600-1200']++ }
    elseif ($r.Words -lt 2000) { $b['1200-2000']++ }
    elseif ($r.Words -lt 3000) { $b['2000-3000']++ }
    else { $b['>=3000']++ }
}
$b.GetEnumerator() | Sort-Object Name | ForEach-Object { Write-Host ("   {0,-11} {1}" -f $_.Key, $_.Value) }
