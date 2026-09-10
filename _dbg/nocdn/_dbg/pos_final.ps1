$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$rows = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $i = $c.IndexOf('class="article-in-ad"')
    if ($i -lt 0) { $i = $c.IndexOf('data-ad-slot="3789259624"') }
    if ($i -lt 0) { continue }
    $rel = $f.FullName.Replace($root + '\', '')
    $h1 = [regex]::Match($c, '(?is)<h1[^>]*>.*?</h1>')
    $hEnd = if ($h1.Success) { $h1.Index + $h1.Length } else { -9999 }
    # first real content block after h1 (h2 or first <p>)
    $h2 = [regex]::Match($c, '(?is)<h2[^>]*>')
    $rows += [pscustomobject]@{
        Page   = $rel
        AfterH1 = $i - $hEnd
        BeforeFirstH2 = if ($h2.Success) { $i -lt $h2.Index } else { $null }
    }
}
Write-Host "Pages with in-article container: $($rows.Count)"
$bad = $rows | Where-Object { $_.AfterH1 -gt 1000 -or $_.AfterH1 -lt 0 }
Write-Host "Beyond 1000 chars after h1: $($bad.Count)"
$bad | Sort-Object AfterH1 -Descending | ForEach-Object { Write-Host ("   {0,6}  {1}" -f $_.AfterH1, $_.Page) }
Write-Host ""
$b2 = @{ '<300' = 0; '300-600' = 0; '600-1000' = 0; '>1000' = 0; 'noh1' = 0 }
foreach ($r in $rows) {
    if ($r.AfterH1 -lt 0) { $b2['noh1']++ }
    elseif ($r.AfterH1 -lt 300) { $b2['<300']++ }
    elseif ($r.AfterH1 -lt 600) { $b2['300-600']++ }
    elseif ($r.AfterH1 -lt 1000) { $b2['600-1000']++ }
    else { $b2['>1000']++ }
}
$b2.GetEnumerator() | Sort-Object Name | ForEach-Object { Write-Host ("   {0,-9} {1}" -f $_.Key, $_.Value) }
$s = $rows | Measure-Object AfterH1 -Average
Write-Host ("Average = {0:N0} chars after </h1>" -f $s.Average)
$bf = ($rows | Where-Object { $_.BeforeFirstH2 -eq $true }).Count
Write-Host "Placed before the first <h2>: $bf pages"
