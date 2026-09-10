$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$fixed = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    if ($c -notmatch 'Middle Ad') { continue }
    $comments = ([regex]::Matches($c, '(?m)^[ \t]*<!--\s*Middle Ad[^>]*-->[ \t]*\r?\n')).Count
    $divs = ([regex]::Matches($c, '<div class="article-middle-ad"')).Count
    if ($comments -le $divs) { continue }

    # remove comment lines that are NOT directly followed by the middle-ad div
    $rx = '(?m)^[ \t]*<!--\s*Middle Ad[^>]*-->[ \t]*\r?\n(?![ \t]*<div class="article-middle-ad")'
    $new = [regex]::Replace($c, $rx, '')
    $newComments = ([regex]::Matches($new, '(?m)^[ \t]*<!--\s*Middle Ad[^>]*-->[ \t]*\r?\n')).Count
    if (([regex]::Matches($new, '<ins class="adsbygoogle"')).Count -ne ([regex]::Matches($c, '<ins class="adsbygoogle"')).Count) {
        Write-Host "SKIP (ins changed) $($f.FullName)"
        continue
    }
    [System.IO.File]::WriteAllText($f.FullName, $new, [System.Text.UTF8Encoding]::new($false))
    $fixed += ("{0} : comments {1} -> {2}, divs {3}" -f $f.FullName.Replace($root + '\', ''), $comments, $newComments, $divs)
}

Write-Host "Pages with orphan Middle-Ad comments fixed: $($fixed.Count)"
$fixed | ForEach-Object { Write-Host "   $_" }
