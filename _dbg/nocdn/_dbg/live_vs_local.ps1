$root = 'd:\DevProject\breastcalculator'
$samples = @(
  'wellness/post-surgery-bra-mistakes/',
  'tools/breast-shape-calculator/',
  'specials/sports-bra-science/',
  'bra-size-guide/34d/'
)
function Dist([string]$c) {
    $mIA = [regex]::Match($c, '<!--\s*(?:AdSense\s+)?In-Article Ad\s*-->')
    $h1 = [regex]::Match($c, '(?is)<h1[^>]*>.*?</h1>')
    if (-not $mIA.Success) { return 'no-in-article' }
    if (-not $h1.Success) { return 'no-h1' }
    return ($mIA.Index - ($h1.Index + $h1.Length))
}
foreach ($s in $samples) {
    $live = ''
    try {
        $r = Invoke-WebRequest -Uri ("https://breastcalculator.com/" + $s) -UseBasicParsing -TimeoutSec 25
        $live = $r.Content
    } catch { $live = '' }
    $local = [System.IO.File]::ReadAllText((Join-Path $root ($s -replace '/', '\') + 'index.html'))
    $plain = $s.TrimEnd('/')
    Write-Host ("{0,-38} LIVE={1,-16} LOCAL={2}" -f $plain, (Dist $live), (Dist $local))
}
