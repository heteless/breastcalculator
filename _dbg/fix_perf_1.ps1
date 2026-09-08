# Fix 1: min-height reservation on ad containers
# In-article: 260px (typical loaded height of in-article fluid)
# Bottom ad: 120px (responsive 90-280px range)
# Hero ad: 100px (was 90px)

$root = 'd:\DevProject\breastcalculator'

# In-article ads: 18 articles
$articleRoot = Join-Path $root 'article'
$inArticleTargets = @()
foreach ($a in (Get-ChildItem -Path $articleRoot -Directory)) {
  $inArticleTargets += (Join-Path $a.FullName 'index.html')
}

$inOld = 'style="margin:40px auto;width:100%;max-width:100%;text-align:center;padding:18px 0;clear:both;"'
$inNew = 'style="margin:40px auto;width:100%;max-width:100%;text-align:center;padding:18px 0;clear:both;min-height:260px;"'

$inCount = 0
foreach ($f in $inArticleTargets) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c.Contains($inOld)) {
    $c = $c.Replace($inOld, $inNew)
    [System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
    $inCount++
  }
}
Write-Host ("[1] In-article min-height fix: {0}/18" -f $inCount)

# Bottom ads: 22 files (10 calculator/guide + 12 long articles)
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

$botOld = 'style="margin:40px auto 24px;max-width:min(100%, 960px);padding:18px 22px;text-align:center;clear:both;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);"'
$botNew = 'style="margin:40px auto 24px;max-width:min(100%, 960px);padding:18px 22px;text-align:center;clear:both;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);min-height:120px;"'

$botCount = 0
foreach ($f in $bottomTargets) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c.Contains($botOld)) {
    $c = $c.Replace($botOld, $botNew)
    [System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
    $botCount++
  }
}
Write-Host ("[1] Bottom ad min-height fix: {0}/{1}" -f $botCount, $bottomTargets.Count)

# Hero ad: homepage index.html (raise 90px to 100px)
$heroFile = Join-Path $root 'index.html'
$hc = [System.IO.File]::ReadAllText($heroFile)
$heroOld = 'class="hero-ad-slot" style="min-height:90px;margin:15px auto;text-align:center;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.02);border-radius:6px;"'
$heroNew = 'class="hero-ad-slot" style="min-height:100px;margin:15px auto;text-align:center;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.02);border-radius:6px;"'
$heroFixed = $false
if ($hc.Contains($heroOld)) {
  $hc = $hc.Replace($heroOld, $heroNew)
  [System.IO.File]::WriteAllText($heroFile, $hc, [System.Text.UTF8Encoding]::new($false))
  $heroFixed = $true
}
Write-Host ("[1] Hero ad min-height fix: {0}" -f $(if($heroFixed){"OK"}else{"SKIP"}))
