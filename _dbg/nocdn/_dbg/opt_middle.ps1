param([switch]$DryRun)

$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$MID_HTML = @'
    <!-- Middle Ad (medium 540px) -->
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

$EVAL = { param($m) ' ' * $m.Value.Length }

function Mask([string]$c) {
    $m = [regex]::Replace($c, '(?s)<script\b.*?</script>', $EVAL)
    $m = [regex]::Replace($m, '(?s)<style\b.*?</style>', $EVAL)
    $m = [regex]::Replace($m, '(?s)<!--.*?-->', $EVAL)
    return $m
}

function Count-Words([string]$c) {
    $m = [regex]::Replace($c, '(?s)<script.*?</script>', '')
    $m = [regex]::Replace($m, '(?s)<style.*?</style>', '')
    $m = [regex]::Replace($m, '(?s)<nav.*?</nav>', '')
    $m = [regex]::Replace($m, '(?s)<footer.*?</footer>', '')
    $t = [regex]::Replace($m, '(?s)<[^>]+>', ' ')
    $t = [System.Net.WebUtility]::HtmlDecode($t)
    return ([regex]::Matches($t, "\b[A-Za-z][A-Za-z'-]+\b")).Count
}

function Remove-MidAd([string]$c, [string]$rel) {
    $d = $c.IndexOf('<div class="article-middle-ad"')
    if ($d -lt 0) { return $c }
    $depth = 0; $end = -1
    foreach ($mm in [regex]::Matches($c.Substring($d), '<div\b|</div>')) {
        if ($mm.Value -eq '<div') { $depth++ }
        else { $depth--; if ($depth -eq 0) { $end = $d + $mm.Index + $mm.Length; break } }
    }
    if ($end -lt 0) { throw "unclosed middle-ad div in $rel" }
    # swallow the preceding comment (same line) and trailing newline
    $ls = $c.LastIndexOf("`n", $d); if ($ls -lt 0) { $ls = 0 } else { $ls = $ls + 1 }
    $head = $c.Substring($ls, $d - $ls)
    if ($head -match '^\s*<!--\s*Middle Ad') { $start = $ls } else { $start = $d }
    $tail = $end
    if ($c.Substring($end, 2) -eq "`r`n") { $tail = $end + 2 } elseif ($c.Substring($end, 1) -eq "`n") { $tail = $end + 1 }
    return $c.Substring(0, $start) + $c.Substring($tail)
}

$moved = 0; $added = 0; $removed = 0; $skipped = 0; $failed = @(); $log = @()

foreach ($f in $files) {
    $c0 = [System.IO.File]::ReadAllText($f.FullName)
    $ins = ([regex]::Matches($c0, '<ins class="adsbygoogle"')).Count
    if ($ins -eq 0) { continue }
    $rel = $f.FullName.Replace($root + '\', '')

    $hasMid = $c0 -match 'article-middle-ad'
    $words = Count-Words $c0
    $eligibleNew = ((-not $hasMid) -and $ins -eq 2 -and $words -ge 800)
    if (-not $hasMid -and -not $eligibleNew) { $skipped++; continue }

    $h2Raw0 = ([regex]::Matches($c0, '(?is)<h2\b')).Count

    # tools/* : utility pages — revert to 2 ads (in-article above calculator + bottom)
    if ($hasMid -and ($rel -match '\\tools\\')) {
        try { $c = Remove-MidAd $c0 $rel } catch { $failed += "$rel : $_"; continue }
        if (([regex]::Matches($c, '<ins class="adsbygoogle"')).Count -ne ($ins - 1)) { $failed += "$rel : tools ins"; continue }
        $removed++
        $log += ("REMOVED {0,-30} (tools page, keep 2 ads)" -f $rel)
        if (-not $DryRun) { [System.IO.File]::WriteAllText($f.FullName, $c, [System.Text.UTF8Encoding]::new($false)) }
        continue
    }

    try { $c = Remove-MidAd $c0 $rel } catch { $failed += "$rel : $_"; continue }

    $mm = Mask $c
    $h2 = [regex]::Matches($mm, '(?is)<h2\b')
    $mode = 'h2'
    if ($h2.Count -ge 2) {
        $n = [math]::Max(2, [math]::Floor($h2.Count / 3))
        if ($n -gt $h2.Count) { $n = $h2.Count }
        # keep at least 20% of the content span away from the in-article ad
        $ia = $c.IndexOf('article-in-ad')
        $bo = $c.IndexOf('article-bottom-ad')
        if ($ia -ge 0 -and $bo -gt $ia) {
            $span = $bo - $ia
            while ($n -lt $h2.Count -and (($h2[$n - 1].Index - $ia) / $span) -lt 0.20) { $n++ }
        }
        $idx = $h2[$n - 1].Index
    }
    else {
        $mainI = $mm.IndexOf('<main')
        $sec = [regex]::Matches($mm.Substring($mainI), '(?i)<section\b')
        if ($sec.Count -lt 2) { $skipped++; $log += "SKIP (no anchor) $rel"; continue }
        $idx = $mainI + $sec[1].Index
        $mode = 'section2'
    }

    if ($mode -eq 'h2') {
        $secOpen = $mm.LastIndexOf('<section', $idx)
        $secClose = $mm.LastIndexOf('</section>', $idx)
        if ($secOpen -gt $secClose -and $secOpen -ge 0) { $target = $secOpen } else { $target = $idx }
    }
    else { $target = $idx }

    $ls = $mm.LastIndexOf("`n", $target)
    if ($ls -lt 0) { $ls = 0 } else { $ls = $ls + 1 }
    $indent = ([regex]::Match($mm.Substring($ls), '^[ \t]*')).Value

    $block = ($MID_HTML -replace "`r`n", "`n").TrimEnd("`n")
    $block = (($block -split "`n") | ForEach-Object { $indent + $_.TrimStart() }) -join "`n"
    $new = $c.Substring(0, $ls) + $block + "`n" + $c.Substring($ls)

    # safety checks
    $ok = $true; $why = ''
    $expected = if ($hasMid) { $ins } else { $ins + 1 }
    if (([regex]::Matches($new, '<ins class="adsbygoogle"')).Count -ne $expected) { $ok = $false; $why = 'ins count' }
    elseif (([regex]::Matches($new, '(?is)<h2\b')).Count -ne $h2Raw0) { $ok = $false; $why = 'h2 count' }
    elseif ($c0 -match 'article-in-ad' -and $new -notmatch 'article-in-ad') { $ok = $false; $why = 'lost in-article' }
    elseif ($c0 -match 'article-bottom-ad' -and $new -notmatch 'article-bottom-ad') { $ok = $false; $why = 'lost bottom' }
    if (-not $ok) { $failed += "$rel : $why"; continue }

    if ($hasMid) { $moved++ } else { $added++ }
    $log += ("{0,-6} {1,-30} mode={2,-9} h2={3,-3} words={4}" -f $(if ($hasMid) { 'MOVED' } else { 'ADDED' }), $rel, $mode, $h2.Count, $words)

    if (-not $DryRun) {
        [System.IO.File]::WriteAllText($f.FullName, $new, [System.Text.UTF8Encoding]::new($false))
    }
}

Write-Host "=== $(if ($DryRun) { 'DRY RUN' } else { 'APPLIED' }) ==="
Write-Host "Middle ad repositioned : $moved"
Write-Host "Middle ad newly added  : $added"
Write-Host "Middle ad removed      : $removed"
Write-Host "Skipped                : $skipped"
Write-Host "Failed (not written)   : $($failed.Count)"
$failed | ForEach-Object { Write-Host "   $_" }
Write-Host ""
$log | Sort-Object | ForEach-Object { Write-Host "  $_" }
