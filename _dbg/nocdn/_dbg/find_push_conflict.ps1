# Find which page matched the push prevention pattern
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
foreach ($f in $allHtml) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  if ($c -match '3789259624|4196453734') {
    if ($c -match 'preventDefault.*push|push\s*=\s*function\(\)\{\s*\}') {
      $relPath = $f.FullName.Substring($root.Length+1)
      Write-Host "Matched: $relPath"
      # Find the line
      $lines = Get-Content $f.FullName
      for ($i=0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match 'preventDefault.*push|push\s*=\s*function\(\)\{\s*\}') {
          Write-Host ("  L{0}: {1}" -f ($i+1), $lines[$i].Trim().Substring(0, [Math]::Min(180, $lines[$i].Trim().Length)))
        }
      }
    }
  }
}
