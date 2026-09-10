$root = 'd:\DevProject\breastcalculator\dist'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File

$adPages = 0; $ins = 0; $over3 = @(); $noPre = @(); $noSlot = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $n = ([regex]::Matches($c, '<ins class="adsbygoogle"')).Count
    if ($n -eq 0) { continue }
    $adPages++
    $ins += $n
    $rel = $f.FullName.Replace($root + '\', '')
    if ($n -gt 3) { $over3 += "$rel ($n)" }
    if ($c -notmatch 'pagead2\.googlesyndication\.com') { $noPre += $rel }
    $s = ([regex]::Matches($c, 'data-ad-slot="')).Count
    if ($s -ne $n) { $noSlot += "$rel (ins=$n slot=$s)" }
}
Write-Host "dist ad pages : $adPages"
Write-Host "dist <ins>    : $ins"
Write-Host "over 3 ads    : $($over3.Count)"
Write-Host "missing preconnect : $($noPre.Count)"
Write-Host "slot mismatch : $($noSlot.Count)"
Write-Host ""
Write-Host "--- new pages sample ---"
foreach ($p in @('articles', 'bra-size-guide\compare', 'specials')) {
    $c = [System.IO.File]::ReadAllText((Join-Path $root ($p + '\index.html')))
    $ia = $c.IndexOf('article-in-ad')
    $h1 = [regex]::Match($c, '(?is)</h1>')
    $bo = $c.IndexOf('article-bottom-ad')
    Write-Host ("{0,-24} in-article@{1,-7} bottom@{2}" -f $p, ($ia - $h1.Index), $bo)
}
Write-Host ""
Write-Host "--- specials relative to main ---"
$c = [System.IO.File]::ReadAllText((Join-Path $root 'specials\index.html'))
$m = $c.IndexOf('<main')
Write-Host ("in-article after <main>: {0} chars" -f ($c.IndexOf('article-in-ad') - $m))
