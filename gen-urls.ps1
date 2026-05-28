$baseDir = "D:\DevProject\breastcalculator"
$sitemapContent = Get-Content (Join-Path $baseDir "sitemap.xml") -Raw -Encoding UTF8
$pattern = '<loc>(https://breastcalculator\.com[^<]*)</loc>'
$matches = [regex]::Matches($sitemapContent, $pattern)
$urls = $matches | ForEach-Object { $_.Groups[1].Value }

$content = $urls -join "`n"
$outputPath = Join-Path $baseDir "urllist.txt"
[System.IO.File]::WriteAllText($outputPath, $content, [System.Text.UTF8Encoding]::new($false))

Write-Output "Generated urllist.txt with $($urls.Count) URLs:"
$urls | ForEach-Object { Write-Output $_ }