# Debug the regex matching
$root = 'd:\DevProject\breastcalculator'
$f = Join-Path $root 'article\why-80-percent-wrong-bra-size\index.html'
$c = [System.IO.File]::ReadAllText($f)
Write-Host "File size: $($c.Length)"

# Try different patterns
$patterns = @(
  'class="article-in-ad"',
  'data-ad-slot="3789259624"',
  '<ins\s+class="adsbygoogle"',
  'In-Article Ad'
)
foreach ($p in $patterns) {
  $m = [regex]::Match($c, $p)
  Write-Host ("Pattern '$p': found $($m.Success) at $($m.Index)")
}

# Check if my comment-based regex works
$commentPattern = '(?is)<!--\s*In-Article Ad[^>]*-->\s*<div[^>]*class="article-in-ad"'
$m = [regex]::Match($c, $commentPattern)
Write-Host ("Comment-based pattern: found $($m.Success) at $($m.Index)")

# Show the surrounding content
$idx = $c.IndexOf('article-in-ad')
if ($idx -gt 0) {
  Write-Host ""
  Write-Host "Context around 'article-in-ad':"
  Write-Host $c.Substring([Math]::Max(0, $idx - 50), [Math]::Min(200, $c.Length - $idx + 50))
}
