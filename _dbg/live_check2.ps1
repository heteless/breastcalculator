$root = 'd:\DevProject\breastcalculator'
$samples = @(
  'tools/breast-shape-calculator/',
  'specials/',
  'wellness/post-surgery-bra-mistakes/',
  'bra-size-guide/34d/'
)
function Measure-Ad([string]$c) {
    if ([string]::IsNullOrEmpty($c)) { return 'n/a' }
    $i = $c.IndexOf('article-in-ad')
    if ($i -lt 0) { return 'no-ad' }
    $h1 = [regex]::Match($c, '(?is)</h1>')
    if (-not $h1.Success) { return 'no-h1' }
    return ($i - $h1.Index)
}
foreach ($s in $samples) {
    $live = ''
    try {
        $r = Invoke-WebRequest -Uri ('https://breastcalculator.com/' + $s) -UseBasicParsing -TimeoutSec 25
        $live = $r.Content
    } catch { $live = '' }
    $p = Join-Path $root (($s -replace '/', '\') + 'index.html')
    $local = [System.IO.File]::ReadAllText($p)
    Write-Host ("{0,-40} LIVE={1,-10} LOCAL={2}" -f $s.TrimEnd('/'), (Measure-Ad $live), (Measure-Ad $local))
}
