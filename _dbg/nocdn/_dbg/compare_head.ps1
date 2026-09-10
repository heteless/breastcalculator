# Compare git HEAD homepage with current
$gitContent = git show HEAD:index.html 2>$null
$gitContent | Out-File -Encoding utf8 -FilePath 'd:\DevProject\breastcalculator\_dbg\head_index.html'

$git = Get-Content 'd:\DevProject\breastcalculator\_dbg\head_index.html' -Raw
$cur = Get-Content 'd:\DevProject\breastcalculator\index.html' -Raw

Write-Host "=== Git HEAD (original) ==="
Write-Host ("  <p> open: {0}" -f ([regex]::Matches($git, '<p\b')).Count)
Write-Host ("  </p> close: {0}" -f ([regex]::Matches($git, '</p>')).Count)
Write-Host ("  <div> open: {0}" -f ([regex]::Matches($git, '<div\b')).Count)
Write-Host ("  </div> close: {0}" -f ([regex]::Matches($git, '</div>')).Count)

Write-Host "`n=== Current (after my edit) ==="
Write-Host ("  <p> open: {0}" -f ([regex]::Matches($cur, '<p\b')).Count)
Write-Host ("  </p> close: {0}" -f ([regex]::Matches($cur, '</p>')).Count)
Write-Host ("  <div> open: {0}" -f ([regex]::Matches($cur, '<div\b')).Count)
Write-Host ("  </div> close: {0}" -f ([regex]::Matches($cur, '</div>')).Count)

Write-Host "`n=== Diff line count ==="
Write-Host ("  Git: {0} chars" -f $git.Length)
Write-Host ("  Current: {0} chars" -f $cur.Length)
