$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$rows = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $i = $c.IndexOf('data-ad-slot="3789259624"')
    if ($i -lt 0) { continue }
    $rel = $f.FullName.Replace($root + '\', '')
    $h1 = [regex]::Match($c, '(?is)<h1[^>]*>.*?</h1>')
    $hIdx = if ($h1.Success) { $h1.Index + $h1.Length } else { -1 }
    # also locate calculator form / first input for tool pages
    $form = [regex]::Match($c, '(?is)<form[^>]*>')
    $fIdx = if ($form.Success) { $form.Index } else { -1 }
    $rows += [pscustomobject]@{
        Page      = $rel
        FromH1    = if ($hIdx -ge 0) { $i - $hIdx } else { -999 }
        BeforeForm = if ($fIdx -ge 0) { ($i -lt $fIdx) } else { $null }
        DocPct    = [math]::Round(100 * $i / $c.Length, 1)
    }
}
$bad = $rows | Where-Object { $_.FromH1 -gt 1200 -or $_.FromH1 -lt 0 }
Write-Host "Pages with in-article: $($rows.Count)"
Write-Host "Out of first screen ( >1200 chars after h1 or no h1 ): $($bad.Count)"
$bad | Sort-Object FromH1 -Descending | ForEach-Object { Write-Host ("   {0,6}  {1}" -f $_.FromH1, $_.Page) }
Write-Host ""
Write-Host "--- top 12 farthest ---"
$rows | Sort-Object FromH1 -Descending | Select-Object -First 12 | ForEach-Object { Write-Host ("   {0,6}  {1}" -f $_.FromH1, $_.Page) }
$s = $rows | Measure-Object FromH1 -Average
Write-Host ""
Write-Host ("Average chars after h1 = {0:N0}" -f $s.Average)
$bf = $rows | Where-Object { $_.BeforeForm -eq $true }
Write-Host "In-article placed BEFORE the calculator form: $($bf.Count) pages"
