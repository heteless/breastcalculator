$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$matched = 0; $noMatch = @(); $buckets = @{ '<200' = 0; '<500' = 0; '<1000' = 0; '>=1000' = 0 }
$rows = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    if ($c -notmatch 'data-ad-slot="3789259624"') { continue }
    $rel = $f.FullName.Replace($root + '\', '')
    $mIA = [regex]::Match($c, '<!--\s*(?:AdSense\s+)?In-Article Ad\s*-->')
    $h1 = [regex]::Match($c, '(?is)<h1[^>]*>.*?</h1>')
    if (-not $mIA.Success) { $noMatch += $rel; continue }
    $matched++
    if (-not $h1.Success) { $noMatch += "$rel (no h1)"; continue }
    $d = $mIA.Index - ($h1.Index + $h1.Length)
    if ($d -lt 200) { $buckets['<200']++ } elseif ($d -lt 500) { $buckets['<500']++ } elseif ($d -lt 1000) { $buckets['<1000']++ } else { $buckets['>=1000']++ }
    $rows += [pscustomobject]@{ Page = $rel; Dist = $d }
}
Write-Host "Pages with in-article slot : $($matched + $noMatch.Count)"
Write-Host "Comment marker matched     : $matched"
Write-Host "Unmatched                  : $($noMatch.Count)"
$noMatch | ForEach-Object { Write-Host "   $_" }
Write-Host ""
Write-Host "Distance h1 -> in-article:"
$buckets.GetEnumerator() | Sort-Object Name | ForEach-Object { Write-Host ("   {0,-8} {1}" -f $_.Key, $_.Value) }
Write-Host ""
Write-Host "--- farthest 10 ---"
$rows | Sort-Object Dist -Descending | Select-Object -First 10 | ForEach-Object { Write-Host ("   {0,-8} {1}" -f $_.Dist, $_.Page) }
$stat = ($rows | Measure-Object Dist -Average -Maximum -Minimum)
Write-Host ""
Write-Host ("Average={0:N0}  Max={1}  Min={2}" -f $stat.Average, $stat.Maximum, $stat.Minimum)
