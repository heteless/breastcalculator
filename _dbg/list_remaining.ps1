# List the 8 remaining pages without ads
$root = 'd:\DevProject\breastcalculator'
$allHtml = Get-ChildItem -Path $root -Recurse -Filter 'index.html' -ErrorAction SilentlyContinue
$allHtml = $allHtml | Where-Object {
  $_.FullName -notmatch '\\dist\\' -and
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\.next-dev-server\\' -and
  $_.FullName -notmatch '\.wrangler' -and
  $_.FullName -notmatch '\.well-known' -and
  $_.FullName -notmatch '\.backup' -and
  $_.FullName -notmatch '\\_dbg\\'
}

$noAd = @()
foreach ($f in $allHtml) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $insCount = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
  if ($insCount -eq 0) {
    $relPath = $f.FullName.Substring($root.Length + 1)
    $noAd += [PSCustomObject]@{Path=$relPath; SizeKB=[Math]::Round($f.Length/1024,1)}
  }
}
Write-Host "Remaining pages without ads:"
$noAd | Format-Table -AutoSize
