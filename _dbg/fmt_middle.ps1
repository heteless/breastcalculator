$root = 'd:\DevProject\breastcalculator'
$files = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -File |
    Where-Object { $_.FullName -notmatch '\\(_dbg|node_modules|\.git|assets|images|dist|dist-dryrun|\.backup|\.next-dev-server|reports|screenshots)\\' }

$n = 0
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    if ($c -notmatch 'article-middle-ad') { continue }

    $rx = '(?ms)^(?<ind>[ \t]*)<!--\s*Middle Ad[^>]*-->[ \t]*\r?\n[ \t]*<div class="article-middle-ad".*?^[ \t]*</div>[ \t]*\r?\n'
    $m = [regex]::Match($c, $rx)
    if (-not $m.Success) { Write-Host "NO MATCH: $($f.FullName)"; continue }
    $ind = $m.Groups['ind'].Value

    $body = @(
        '<!-- Middle Ad (medium 540px) -->',
        '<div class="article-middle-ad" style="margin:36px auto;max-width:min(100%, 600px);padding:16px 20px;text-align:center;clear:both;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);min-height:120px;">',
        '  <ins class="adsbygoogle"',
        '       style="display:block"',
        '       data-ad-client="ca-pub-7388117485013143"',
        '       data-ad-slot="4196453734"',
        '       data-ad-format="auto"',
        '       data-full-width-responsive="true"></ins>',
        '  <script>',
        '       (adsbygoogle = window.adsbygoogle || []).push({});',
        '  </script>',
        '</div>'
    ) | ForEach-Object { $ind + $_ }
    $block = ($body -join "`n") + "`n"

    $new = $c.Substring(0, $m.Index) + $block + $c.Substring($m.Index + $m.Length)
    if (([regex]::Matches($new, '<ins class="adsbygoogle"')).Count -ne ([regex]::Matches($c, '<ins class="adsbygoogle"')).Count) {
        Write-Host "SKIP (ins) $($f.FullName)"; continue
    }
    [System.IO.File]::WriteAllText($f.FullName, $new, [System.Text.UTF8Encoding]::new($false))
    $n++
}
Write-Host "Middle-ad blocks re-indented: $n"
