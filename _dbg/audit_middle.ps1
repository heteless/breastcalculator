$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$rows = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    if ($c -notmatch 'article-middle-ad') { continue }
    $rel = $f.FullName.Replace($root + '\', '')
    $mid = $c.IndexOf('article-middle-ad')
    $h2s = [regex]::Matches($c, '(?is)<h2\b')
    $before = ($h2s | Where-Object { $_.Index -lt $mid }).Count
    $rows += [pscustomobject]@{
        Page      = $rel
        DocPct    = [math]::Round(100 * $mid / $c.Length, 1)
        H2Before  = $before
        H2Total   = $h2s.Count
    }
}
Write-Host "Pages with a middle ad: $($rows.Count)"
Write-Host ""
Write-Host "=== position of middle ad ==="
$rows | Sort-Object DocPct | ForEach-Object { Write-Host ("   pct={0,-6} h2before={1,2}/{2,-3} {3}" -f $_.DocPct, $_.H2Before, $_.H2Total, $_.Page) }
Write-Host ""
$avg = ($rows | Measure-Object DocPct -Average).Average
Write-Host ("Average document position: {0:N1}%" -f $avg)
Write-Host ("Placed after >=3 h2 (mid-content): {0}" -f ($rows | Where-Object { $_.H2Before -ge 3 }).Count)
