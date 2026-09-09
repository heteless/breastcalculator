# AdSense diagnostic script
$root = 'd:\DevProject\breastcalculator'

# Get all 143 ad pages
$adPages = @()
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
  if ($c -match '3789259624|4196453734') { $adPages += $f.FullName }
}

Write-Host "==== DIAGNOSTIC REPORT ===="
Write-Host ("Ad pages to check: {0}" -f $adPages.Count)
Write-Host ""

# --- DIAGNOSTIC 1: <head> setup ---
Write-Host "=== Diagnostic 1: <head> setup ==="
$loaderOK = 0; $preconnectOK = 0; $asyncOK = 0
$loaderMissing = @()
$preconnectMissing = @()
foreach ($f in $adPages) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c -match 'pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js') {
    $loaderOK++
  } else { $loaderMissing += $f.Substring($root.Length+1) }
  if ($c -match 'preconnect[^>]*pagead2\.googlesyndication\.com') { $preconnectOK++ }
  else { $preconnectMissing += $f.Substring($root.Length+1) }
  if ($c -match '<script async src="[^"]*adsbygoogle\.js') { $asyncOK++ }
}
Write-Host ("  adsbygoogle.js loader: {0}/{1}" -f $loaderOK, $adPages.Count)
Write-Host ("  preconnect hints: {0}/{1}" -f $preconnectOK, $adPages.Count)
Write-Host ("  async attribute: {0}/{1}" -f $asyncOK, $adPages.Count)

# --- DIAGNOSTIC 2: JS conflicts / AdBlock detection ---
Write-Host ""
Write-Host "=== Diagnostic 2: JS conflicts / potential blockers ==="
$conflictPatterns = @(
  @{Name='window.adsbygoogle blocked'; Pattern='window\.adsbygoogle\s*=\s*null|delete\s+window\.adsbygoogle'},
  @{Name='adsbygoogle push prevented'; Pattern='preventDefault.*push|push\s*=\s*function\(\)\{\s*\}'},
  @{Name='iframe blocker'; Pattern='document\.write.*adsbygoogle|ifram[^<]*pagead'},
  @{Name='ad blocker CSS'; Pattern='\.adsbygoogle\s*\{\s*display\s*:\s*none'},
  @{Name='ad blocker attribute'; Pattern='data-adblock|data-adsbygoogle-noinit'},
  @{Name='ad refresh disable'; Pattern='data-ad-refresh'}
)
foreach ($p in $conflictPatterns) {
  $count = 0
  foreach ($f in $adPages) {
    $c = [System.IO.File]::ReadAllText($f)
    if ($c -match $p.Pattern) { $count++ }
  }
  Write-Host ("  {0}: {1} page(s) matched" -f $p.Name, $count)
}

# Check for known ad blocker scripts
$blockerScripts = @('blockadblock', 'fuckadblock', 'adb-detect', 'anti-adblock', 'adblock-detect')
$blockerFound = @()
foreach ($f in $adPages) {
  $c = [System.IO.File]::ReadAllText($f)
  foreach ($b in $blockerScripts) {
    if ($c -match $b) { $blockerFound += "{0} (in {1})" -f $b, $f.Substring($root.Length+1) }
  }
}
if ($blockerFound.Count -eq 0) {
  Write-Host "  No ad blocker detection scripts found"
} else {
  Write-Host "  Ad blocker scripts found:"
  foreach ($b in $blockerFound) { Write-Host ("    - {0}" -f $b) }
}

# --- DIAGNOSTIC 3: Ad placement context ---
Write-Host ""
Write-Host "=== Diagnostic 3: Ad placement context ==="
$insInIframe = 0
$insHidden = 0
$insInArticle = 0
$insInMain = 0
$insOrphaned = 0
foreach ($f in $adPages) {
  $c = [System.IO.File]::ReadAllText($f)
  # Check if <ins> is inside <iframe> (BAD)
  if ($c -match '<iframe[^>]*>[\s\S]*?<ins\s+class="adsbygoogle"') { $insInIframe++ }
  # Check if <ins> has hidden style
  if ($c -match '<ins\s+class="adsbygoogle"[^>]*style="[^"]*display\s*:\s*none') { $insHidden++ }
  # Count placements inside <main>
  $mainMatch = [regex]::Match($c, '(?s)<main[^>]*>.*?</main>')
  if ($mainMatch.Success) {
    $mainContent = $mainMatch.Groups[0].Value
    $insInMain += ([regex]::Matches($mainContent, '<ins\s+class="adsbygoogle"')).Count
  }
  # Count placements outside main (could be problematic)
  $outsideMain = [regex]::Replace($c, '(?s)<main[^>]*>.*?</main>', '')
  $insOrphaned += ([regex]::Matches($outsideMain, '<ins\s+class="adsbygoogle"')).Count
}
Write-Host ("  <ins> inside <main>: {0}" -f $insInMain)
Write-Host ("  <ins> outside <main> (orphaned): {0}" -f $insOrphaned)
Write-Host ("  <ins> inside iframe: {0}" -f $insInIframe)
Write-Host ("  <ins> with display:none: {0}" -f $insHidden)

# --- DIAGNOSTIC 4: Slot/AdSense config check ---
Write-Host ""
Write-Host "=== Diagnostic 4: AdSense config ==="
$correctClient = 0
$correctSlotIn = 0
$correctSlotBot = 0
foreach ($f in $adPages) {
  $c = [System.IO.File]::ReadAllText($f)
  if ($c -match 'data-ad-client="ca-pub-7388117485013143"') { $correctClient++ }
  if ($c -match 'data-ad-slot="3789259624"') { $correctSlotIn++ }
  if ($c -match 'data-ad-slot="4196453734"') { $correctSlotBot++ }
}
Write-Host ("  ca-pub-7388117485013143 client: {0}/{1}" -f $correctClient, $adPages.Count)
Write-Host ("  Slot 3789259624 (in-article): {0} occurrences" -f $correctSlotIn)
Write-Host ("  Slot 4196453734 (bottom/auto): {0} occurrences" -f $correctSlotBot)

# --- DIAGNOSTIC 5: push script and Ins block count ---
Write-Host ""
Write-Host "=== Diagnostic 5: Push scripts ==="
$pushOK = 0
$insCount = 0
foreach ($f in $adPages) {
  $c = [System.IO.File]::ReadAllText($f)
  $ins = ([regex]::Matches($c, '<ins\s+class="adsbygoogle"')).Count
  $push = ([regex]::Matches($c, '\(adsbygoogle = window\.adsbygoogle \|\| \[\]\)\.push\(\{\}\)')).Count
  $insCount += $ins
  if ($push -ge $ins) { $pushOK++ }
}
Write-Host ("  Total <ins> blocks: {0}" -f $insCount)
Write-Host ("  Pages with push() >= ins count: {0}/{1}" -f $pushOK, $adPages.Count)
