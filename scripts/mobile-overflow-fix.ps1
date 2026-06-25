# Mobile horizontal-overflow fix:
# 1) Wrap bare <table>...</table> with <div class="table-wrap"> (idempotent)
# 2) Ensure body { overflow-x: hidden } in style.css safety net
# 3) Find any element style="width:Npx" with N>viewport and add max-width:100%
$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
$report = New-Object System.Collections.Generic.List[object]
$totalEdits = 0

# Files to fix (table-wrap missing)
$targets = Get-ChildItem -Path article,wellness,specials,bra-size-guide -Recurse -Filter index.html -ErrorAction SilentlyContinue | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $hasTable = $c -match '<table'
    $hasWrap = $c -match 'class="[^"]*table-(wrap|responsive)[^"]*"'
    if ($hasTable -and -not $hasWrap) { $_.FullName }
}

Write-Host "=== Found $($targets.Count) files needing table-wrap ===" -ForegroundColor Cyan
foreach ($f in $targets) {
    $rel = $f.Replace($root + "\", "")
    $c = Get-Content $f -Raw
    $before = $c
    # Wrap each <table>...</table> with a table-wrap div (lazy match)
    $c = [regex]::Replace($c, '<table(?![^>]*class="[^"]*table-wrap)', '<div class="table-wrap"><table', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $c = [regex]::Replace($c, '</table>', '</table></div>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($c -ne $before) {
        Set-Content -Path $f -Value $c -NoNewline -Encoding UTF8
        $totalEdits++
        Write-Host "  WRAPPED: $rel" -ForegroundColor Green
    } else {
        Write-Host "  no-change: $rel" -ForegroundColor Yellow
    }
}

# Ensure style.css has body { overflow-x: hidden } safety net
$cssPath = Join-Path $root "style.css"
$css = Get-Content $cssPath -Raw
$cssEdit = 0
if ($css -notmatch '(?ms)body\s*\{[^}]*overflow-x\s*:\s*hidden') {
    # Add a safety-net block at end of file
    $css += "`n/* Mobile horizontal-overflow safety net */`nhtml,body{overflow-x:hidden;max-width:100vw}`n"
    Set-Content -Path $cssPath -Value $css -NoNewline -Encoding UTF8
    $cssEdit++
    Write-Host "  ADDED: body overflow-x:hidden safety net" -ForegroundColor Green
}

# Find inline style="width:Npx" hard-coded widths on body-level elements
$inlineWidth = Get-ChildItem -Path . -Recurse -Filter index.html -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch "node_modules|\\.git|dist\\" } | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $matches2 = [regex]::Matches($c, 'style="[^"]*width\s*:\s*(1[0-9]{3,}|[2-9][0-9]{2,})px[^;"]*;?[^"]*"')
    if ($matches2.Count -gt 0) {
        $rel = $_.FullName.Replace($root + "\", "")
        [pscustomobject]@{ File = $rel; Count = $matches2.Count; First = $matches2[0].Value.Substring(0, [Math]::Min(140, $matches2[0].Value.Length)) }
    }
}
Write-Host "`n=== Possible hard-coded wide inline styles ===" -ForegroundColor Cyan
if ($inlineWidth) { $inlineWidth | Format-Table -AutoSize } else { Write-Host "  none" -ForegroundColor Green }

Write-Host "`nTotal files wrapped: $totalEdits" -ForegroundColor Yellow
Write-Host "CSS rules added: $cssEdit" -ForegroundColor Yellow
