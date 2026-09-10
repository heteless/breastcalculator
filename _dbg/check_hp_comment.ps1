# Check what comment was used in the high-priority pages
$f = 'd:\DevProject\breastcalculator\bra-size-guide\28a\index.html'
$c = [System.IO.File]::ReadAllText($f)
$idx = $c.IndexOf('article-in-ad')
if ($idx -gt 0) {
  Write-Host ("article-in-ad at index $idx")
  Write-Host "Context:"
  Write-Host $c.Substring([Math]::Max(0, $idx - 100), 200)
}
