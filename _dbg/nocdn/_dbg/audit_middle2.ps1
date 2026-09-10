$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$rows = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $mid = $c.IndexOf('article-middle-ad')
    if ($mid -lt 0) { continue }
    $rel = $f.FullName.Replace($root + '\', '')
    $ia = $c.IndexOf('article-in-ad')
    $bo = $c.IndexOf('article-bottom-ad')
    $span = $bo - $ia
    $frac = if ($span -gt 0) { [math]::Round(100 * ($mid - $ia) / $span, 1) } else { -1 }
    $h2s = [regex]::Matches($c, '(?is)<h2\b')
    $before = ($h2s | Where-Object { $_.Index -lt $mid }).Count
    $rows += [pscustomobject]@{ Page = $rel; Frac = $frac; H2Before = $before; H2Total = $h2s.Count }
}
Write-Host "Pages with a middle ad: $($rows.Count)"
Write-Host ""
$b = @{ '0-20%' = 0; '20-35%' = 0; '35-50%' = 0; '50-70%' = 0; '>70%' = 0 }
foreach ($r in $rows) {
    if ($r.Frac -lt 20) { $b['0-20%']++ }
    elseif ($r.Frac -lt 35) { $b['20-35%']++ }
    elseif ($r.Frac -lt 50) { $b['35-50%']++ }
    elseif ($r.Frac -lt 70) { $b['50-70%']++ }
    else { $b['>70%']++ }
}
Write-Host "Position within content span (in-article -> bottom-ad):"
$b.GetEnumerator() | Sort-Object Name | ForEach-Object { Write-Host ("   {0,-8} {1}" -f $_.Key, $_.Value) }
$avg = ($rows | Measure-Object Frac -Average).Average
Write-Host ""
Write-Host ("Average = {0:N1}%   (>50% counts as buried: {1} pages)" -f $avg, ($rows | Where-Object { $_.Frac -ge 50 }).Count)
Write-Host ""
Write-Host "--- still buried (>50%) ---"
$rows | Where-Object { $_.Frac -ge 50 } | Sort-Object Frac -Descending | Select-Object -First 15 | ForEach-Object { Write-Host ("   {0,6}%  h2={1}/{2}  {3}" -f $_.Frac, $_.H2Before, $_.H2Total, $_.Page) }
