$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$pages = 0; $adPages = 0
$over3 = @(); $noPre = @(); $badSlot = @(); $badBalance = @()
$distList = @()
$totalIns = 0

foreach ($f in $files) {
    $pages++
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $rel = $f.FullName.Replace($root + '\', '')
    $ins = ([regex]::Matches($c, '<ins class="adsbygoogle"')).Count
    $slotIA = ([regex]::Matches($c, 'data-ad-slot="3789259624"')).Count
    $slotBO = ([regex]::Matches($c, 'data-ad-slot="4196453734"')).Count
    $pushes = ([regex]::Matches($c, 'adsbygoogle\s*=\s*window\.adsbygoogle')).Count
    if ($ins -eq 0) { continue }
    $adPages++
    $totalIns += $ins

    if ($ins -gt 3) { $over3 += "$rel ($ins)" }
    if ($slotIA + $slotBO -ne $ins) { $badSlot += "$rel (ins=$ins ia=$slotIA bo=$slotBO)" }
    if ($pushes -lt $ins) { $badSlot += "$rel (push=$pushes ins=$ins)" }
    if ($c -notmatch 'pagead2\.googlesyndication\.com' -or $c -notmatch 'rel="preconnect"') { $noPre += $rel }

    # balance check on markup only
    $m = [regex]::Replace($c, '(?s)<script.*?</script>', '')
    $m = [regex]::Replace($m, '(?s)<style.*?</style>', '')
    $m = [regex]::Replace($m, '(?s)<!--.*?-->', '')
    $do = ([regex]::Matches($m, '<div\b')).Count
    $dc = ([regex]::Matches($m, '</div>')).Count
    if ($do -ne $dc) { $badBalance += "$rel (div $do/$dc)" }

    # distance h1 -> first in-article marker
    $mIA = [regex]::Match($c, '<!--\s*(?:AdSense\s+)?In-Article Ad\s*-->')
    if ($mIA.Success) {
        $h1 = [regex]::Match($c, '(?is)<h1[^>]*>.*?</h1>')
        if ($h1.Success) {
            $d = $mIA.Index - ($h1.Index + $h1.Length)
            if ($d -gt 1500) { $distList += "$rel ($d)" }
        }
    }
    if (($slotIA + $slotBO) -eq 0) { $badSlot += "$rel (no slot)" }
}

Write-Host "TOTAL pages scanned : $pages"
Write-Host "AD pages            : $adPages"
Write-Host "Total <ins> units   : $totalIns"
Write-Host ""
Write-Host "--- pages with >3 ads (policy risk) : $($over3.Count)"
$over3 | ForEach-Object { Write-Host "    $_" }
Write-Host "--- pages missing preconnect        : $($noPre.Count)"
$noPre | ForEach-Object { Write-Host "    $_" }
Write-Host "--- slot/push mismatch              : $($badSlot.Count)"
$badSlot | ForEach-Object { Write-Host "    $_" }
Write-Host "--- div imbalance                   : $($badBalance.Count)"
$badBalance | ForEach-Object { Write-Host "    $_" }
Write-Host "--- in-article >1500 chars after h1 : $($distList.Count)"
$distList | ForEach-Object { Write-Host "    $_" }
