# Cross-check tag balance in a few articles
$files = @(
  'd:\DevProject\breastcalculator\article\why-80-percent-wrong-bra-size\index.html',
  'd:\DevProject\breastcalculator\article\breast-volume-guide\index.html',
  'd:\DevProject\breastcalculator\article\bra-sister-sizes-explained\index.html',
  'd:\DevProject\breastcalculator\article\band-bra-fit-problems\index.html'
)
foreach ($f in $files) {
  $c = Get-Content $f -Raw
  $pOpen = ([regex]::Matches($c, '<p\b')).Count
  $pClose = ([regex]::Matches($c, '</p>')).Count
  $divOpen = ([regex]::Matches($c, '<div\b')).Count
  $divClose = ([regex]::Matches($c, '</div>')).Count
  $article_in_ad = ([regex]::Matches($c, 'article-in-ad')).Count
  $name = Split-Path (Split-Path $f -Parent) -Leaf
  Write-Host ("{0} -- <p>:{1}/</p>:{2}  <div>:{3}/</div>:{4}  ad-block:{5}" -f $name, $pOpen, $pClose, $divOpen, $divClose, $article_in_ad)
}
