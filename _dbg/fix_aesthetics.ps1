# Fix 4 key visual issues:
# 1. In-Article: change max-width:680px to 100% (inherit article body width)
# 4. Bottom Ad: change background:var(--bg-card) to background:var(--sand-light)
# 5. Bottom Ad: change max-width:980px to max-width:min(100%, 960px)
# 6. Bottom Ad: add 1px border using var(--border) for clear visual containment

$root = 'd:\DevProject\breastcalculator'

# --- Fix 1: In-Article ads (18 files) ---
$articleRoot = Join-Path $root 'article'
$inArticleTargets = @()
foreach ($a in (Get-ChildItem -Path $articleRoot -Directory)) {
  $inArticleTargets += (Join-Path $a.FullName 'index.html')
}

$inArticleOld = 'style="margin:32px auto;max-width:680px;text-align:center;padding:16px 0;clear:both;"'
$inArticleNew = 'style="margin:40px auto;width:100%;max-width:100%;text-align:center;padding:18px 0;clear:both;"'

$inCount = 0
foreach ($f in $inArticleTargets) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c.Contains($inArticleOld)) {
    $c = $c.Replace($inArticleOld, $inArticleNew)
    [System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
    $inCount++
  }
}
Write-Host ("Fixed {0} in-article ad(s) (Issue 1: width alignment)" -f $inCount)

# --- Fix 4/5/6: Bottom ads (22 files) ---
$bottomDirs = @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')
$bottomTargets = @()
foreach ($d in $bottomDirs) {
  $bottomTargets += (Join-Path $root (Join-Path $d 'index.html'))
}
$pattern = '(?is)<p\b[^>]*>.*?</p>'
foreach ($a in (Get-ChildItem -Path $articleRoot -Directory)) {
  $f = Join-Path $a.FullName 'index.html'
  $c = [System.IO.File]::ReadAllText($f)
  $ms = [regex]::Matches($c, $pattern)
  $cnt = 0
  foreach ($m in $ms) {
    $t = $m.Groups[0].Value.Substring(0, $m.Groups[0].Value.IndexOf('>') + 1)
    if ($t -notmatch 'class="byline"|class="subtitle"') { $cnt++ }
  }
  if ($cnt -ge 25) { $bottomTargets += $f }
}

$bottomOld = 'style="margin:40px auto 24px;max-width:980px;padding:16px 20px;text-align:center;clear:both;background:var(--bg-card);border-radius:var(--radius);"'
$bottomNew = 'style="margin:40px auto 24px;max-width:min(100%, 960px);padding:18px 22px;text-align:center;clear:both;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);"'

$botCount = 0
foreach ($f in $bottomTargets) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c.Contains($bottomOld)) {
    $c = $c.Replace($bottomOld, $bottomNew)
    [System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
    $botCount++
  }
}
Write-Host ("Fixed {0} bottom ad(s) (Issue 4/5/6: bg, width, position/border)" -f $botCount)

# Also fix the hero ad on homepage if it has the same issues
$heroFile = Join-Path $root 'index.html'
$heroOld = 'style="display:block;width:100%;max-width:970px;"'
$heroNew = 'style="display:block;width:100%;max-width:min(100%, 970px);margin:0 auto;"'
$hc = [System.IO.File]::ReadAllText($heroFile)
if ($hc.Contains($heroOld)) {
  $hc = $hc.Replace($heroOld, $heroNew)
  [System.IO.File]::WriteAllText($heroFile, $hc, [System.Text.UTF8Encoding]::new($false))
  Write-Host "Fixed homepage hero ad (max-width alignment with 970px hero limit)"
}

Write-Host ""
Write-Host "=== Verification: sample after-fix context ==="
$f = Join-Path $root 'article\why-80-percent-wrong-bra-size\index.html'
$lines = Get-Content $f
$ia = -1; $ba = -1
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match 'article-in-ad' -and $ia -lt 0) { $ia = $i }
  if ($lines[$i] -match 'article-bottom-ad' -and $ba -lt 0) { $ba = $i }
}
Write-Host "In-article ad (after fix):"
for ($i=$ia; $i -lt [Math]::Min($lines.Length, $ia+5); $i++) {
  Write-Host ("  L{0}: {1}" -f ($i+1), $lines[$i].Trim())
}
Write-Host "Bottom ad (after fix):"
for ($i=$ba; $i -lt [Math]::Min($lines.Length, $ba+5); $i++) {
  Write-Host ("  L{0}: {1}" -f ($i+1), $lines[$i].Trim())
}
