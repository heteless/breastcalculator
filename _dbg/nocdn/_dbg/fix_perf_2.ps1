# Fix 2: Add preconnect hints to <head> of all 41 target pages
$root = 'd:\DevProject\breastcalculator'

$targets = @()
foreach ($a in (Get-ChildItem -Path (Join-Path $root 'article') -Directory)) {
  $targets += (Join-Path $a.FullName 'index.html')
}
foreach ($d in @('bra-size-calculator','bra-size-guide','breast-volume','best-comfort-bras','best-wireless-bras','bra-buying-guide','how-to-measure-bra-size','sports-bra-guide','wellness','specials')) {
  $targets += (Join-Path $root (Join-Path $d 'index.html'))
}
$targets += (Join-Path $root 'index.html')

$line1 = '    <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>'
$line2 = '    <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossorigin>'
$line3 = '    <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>'
$preconnectBlock = "`n" + $line1 + "`n" + $line2 + "`n" + $line3

$okCount = 0
$skipCount = 0
$failCount = 0
$failNames = @()
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f)

  if ($c -match 'preconnect[^>]*pagead2\.googlesyndication\.com') {
    $skipCount++
    continue
  }

  $marker = '<link rel="stylesheet" href="/main.css"/>'
  $idx = $c.IndexOf($marker)
  if ($idx -lt 0) {
    $marker2 = '<link rel="stylesheet" href="/main.css" />'
    $idx = $c.IndexOf($marker2)
  }
  if ($idx -lt 0) {
    $failCount++
    $failNames += (Split-Path (Split-Path $f -Parent) -Leaf)
    continue
  }

  $insertAt = $idx + $marker.Length
  $newContent = $c.Substring(0, $insertAt) + $preconnectBlock + $c.Substring($insertAt)
  [System.IO.File]::WriteAllText($f, $newContent, [System.Text.UTF8Encoding]::new($false))
  $okCount++
}

Write-Host ("[2] Preconnect added: {0} updated, {1} skipped (already), {2} failed" -f $okCount, $skipCount, $failCount)
if ($failCount -gt 0) {
  foreach ($n in $failNames) { Write-Host ("  FAILED: {0}" -f $n) }
}
