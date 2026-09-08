$f = 'd:\DevProject\breastcalculator\articles\index.html'
$lines = Get-Content $f
$pMatches = Select-String -InputObject ($lines -join "`n") -Pattern '<p\b' -CaseSensitive:$false
Write-Host ("Total <p> count: {0}" -f $pMatches.Count)
$pMatches | Select-Object -First 10 | ForEach-Object { Write-Host ("  L{0}: {1}" -f $_.LineNumber, $_.Line.Substring(0, [Math]::Min(160, $_.Line.Length))) }
Write-Host "----"
$ins = Select-String -InputObject ($lines -join "`n") -Pattern 'article-card|article-list|<article|class="article' -CaseSensitive:$false
$ins | Select-Object -First 5 | ForEach-Object { Write-Host ("  L{0}: {1}" -f $_.LineNumber, $_.Line.Substring(0, [Math]::Min(160, $_.Line.Length))) }
