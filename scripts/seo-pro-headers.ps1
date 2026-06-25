# SEO optimization: Add "pro" / "professional" terminology to tool/guide pages
# Uses regex matching to handle leading/trailing spaces in H1/H2
$ErrorActionPreference = "Stop"
$root = "d:\DevProject\breastcalculator"

# Each entry: [file_path, [pattern, replacement, flags]]
# Use [regex]::Escape on patterns. Use \s+ for whitespace.
$edits = [ordered]@{
    "tools\breast-volume-calculator\index.html" = @(
        @{ pat = '<title>\s*Breast Volume Calculator\s*\|\s*cc &amp; mL Estimator Free\s*</title>'
           rep = '<title>Professional Breast Volume Calculator | Pro cc &amp; mL Estimator (Free, Clinical-Grade)</title>' }
        @{ pat = '<meta name="description" content="Free breast volume calculator and breast risk calculate tool\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Professional breast volume calculator used by plastic surgeons and fitters. Estimate per-breast volume in cc and mL with the BREAST-V formula, shape and ptosis corrections. Free, private, no signup.">' }
        @{ pat = '<h1>\s*Breast Volume Calculator\s*</h1>'
           rep = '<h1>Professional Breast Volume Calculator &#8212; Pro cc &amp; mL Estimator for Clinicians &amp; Fitters</h1>' }
        @{ pat = '<h2[^>]*>\s*How to Measure for Precise Volume Calculation\s*</h2>'
           rep = '<h2>How to Measure for Professional-Grade Volume Calculation</h2>' }
        @{ pat = '<h2[^>]*>\s*All Calculators &amp; Tools\s*</h2>'
           rep = '<h2>All Pro Calculators &amp; Professional Tools</h2>' }
    )
    "tools\breast-weight-calculator\index.html" = @(
        @{ pat = '<title>\s*Breast Weight Calculator\s*\|\s*Free Breast Weight Estimator\s*</title>'
           rep = '<title>Professional Breast Weight Calculator | Pro Grams, Ounces &amp; Pounds Estimator (Free)</title>' }
        @{ pat = '<meta name="description" content="Free breast weight calculator for breast health planning\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Professional breast weight calculator used by fitters, post-mastectomy consultants and clinicians. Estimate breast tissue weight in grams, ounces and pounds from band, cup and density. Free, private."/>' }
        @{ pat = '<h1>\s*Breast Weight Calculator\s*</h1>'
           rep = '<h1>Professional Breast Weight Calculator &#8212; Pro Tissue Weight Estimator for Fitters &amp; Wellness Pros</h1>' }
        @{ pat = '<h2[^>]*>\s*Measurement Guide for Weight Calculation\s*</h2>'
           rep = '<h2>Pro Measurement Guide for Professional Weight Calculation</h2>' }
        @{ pat = '<h2[^>]*>\s*All Calculators &amp; Tools\s*</h2>'
           rep = '<h2>All Pro Calculators &amp; Professional Tools</h2>' }
    )
    "tools\breast-shape-calculator\index.html" = @(
        @{ pat = '<title>\s*Breast Shape Calculator\s*\|\s*Identify Your Best Bra Fit\s*</title>'
           rep = '<title>Professional Breast Shape Calculator | Pro Bra Fit Analysis (Free, Clinically-Indexed)</title>' }
        @{ pat = '<meta name="description" content="Identify your breast shape type using the international bra industry classification system\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Professional breast shape calculator for fitters, lingerie buyers and wellness pros. Identify your breast shape using the international bra industry classification system &#8212; 6 types with personalized pro bra recommendations."/>' }
        @{ pat = '<h1>\s*Breast Shape Calculator\s*</h1>'
           rep = '<h1>Professional Breast Shape Calculator &#8212; Pro Bra Fit Analysis for Fitters &amp; Lingerie Pros</h1>' }
        @{ pat = '<h2[^>]*>\s*All Calculators &amp; Tools\s*</h2>'
           rep = '<h2>All Pro Calculators &amp; Professional Tools</h2>' }
    )
    "tools\breast-ptosis-calculator\index.html" = @(
        @{ pat = '<title>\s*Breast Ptosis Calculator\s*\|\s*Grade Sagging\s*\|\s*Breast Calculator\s*</title>'
           rep = '<title>Professional Breast Ptosis Calculator | Pro Regnault Sagging Grade Tool (Free, Clinical-Standard)</title>' }
        @{ pat = '<meta name="description" content="Free online breast ptosis calculator with 1976 standard\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Professional breast ptosis calculator used by plastic surgeons, dermatologists and post-mastectomy consultants. Free Regnault 1976 grading with step-by-step pro results, science-based formula. No signup."/>' }
        @{ pat = '<h1>\s*Breast Ptosis Calculator\s*</h1>'
           rep = '<h1>Professional Breast Ptosis Calculator &#8212; Pro Regnault Grade Estimator for Clinicians</h1>' }
        @{ pat = '<h2[^>]*>\s*How to Measure Your Breast Size\s*</h2>'
           rep = '<h2>How to Measure for Pro Ptosis Grading (Professional Method)</h2>' }
        @{ pat = '<h2[^>]*>\s*All Calculators &amp; Tools\s*</h2>'
           rep = '<h2>All Pro Calculators &amp; Professional Tools</h2>' }
    )
    "tools\breast-expansion-calculator\index.html" = @(
        @{ pat = '<title>\s*Breast Expansion Calculator\s*\|\s*Splaying &amp; Support\s*</title>'
           rep = '<title>Professional Breast Expansion Calculator | Pro Splay &amp; Support Tool (Free, Anatomy-Based)</title>' }
        @{ pat = '<meta name="description" content="Free online breast expansion calculator with anatomy types\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Professional breast expansion calculator used by fitters and bra designers. Free anatomy-based splaying index with step-by-step pro results, science-based formula. No signup."/>' }
        @{ pat = '<h1>\s*Breast Expansion Calculator\s*</h1>'
           rep = '<h1>Professional Breast Expansion Calculator &#8212; Pro Splay &amp; Support Estimator for Fitters &amp; Designers</h1>' }
        @{ pat = '<h2[^>]*>\s*How to Measure Your Breast Size\s*</h2>'
           rep = '<h2>How to Measure for Pro Expansion Index (Professional Method)</h2>' }
        @{ pat = '<h2[^>]*>\s*All Calculators &amp; Tools\s*</h2>'
           rep = '<h2>All Pro Calculators &amp; Professional Tools</h2>' }
    )
    "tools\length-converter\index.html" = @(
        @{ pat = '<title>\s*Length Converter\s*\|\s*Inches to CM\s*\|\s*Breast Calculator\s*</title>'
           rep = '<title>Professional Length Converter | Pro Inches, cm, mm, ft, m, yd Tool (Free, Tailor-Grade)</title>' }
        @{ pat = '<meta name="description" content="Free online length converter with units\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Professional length converter used by tailors, fitters, engineers and wellness pros. Step-by-step 6+ results across inches, cm, mm, ft, m and yd with 3 pro rounding modes. Free, no signup.">' }
        @{ pat = '<h1>\s*Length Converter\s*</h1>'
           rep = '<h1>Professional Length Converter &#8212; Pro cm / inch / ft Online Tool for Tailors, Fitters &amp; Pros</h1>' }
        @{ pat = '<h2[^>]*>\s*All Calculators &amp; Tools\s*</h2>'
           rep = '<h2>All Pro Calculators &amp; Professional Tools</h2>' }
    )
    "tools\weight-converter\index.html" = @(
        @{ pat = '<title> Body Weight Converter[^>]*>'
           rep = '<title>Professional Body Weight Converter | Pro kg, lb, oz, st Tool (Free, NIST-Traceable)</title>' }
        @{ pat = '<meta name="description" content="Free online body weight converter[^"]*"\s*/?>'
           rep = '<meta name="description" content="Professional body weight converter used by nutritionists, fitters, athletes and wellness pros. Step-by-step 5+ results across kg, lb, oz and stone with 3 pro precision modes. Free, no signup.">' }
        @{ pat = '<h1>\s*Body Weight Converter\s*</h1>'
           rep = '<h1>Professional Body Weight Converter &#8212; Pro kg / lb / oz / stone Tool (NIST-Traceable)</h1>' }
        @{ pat = '<h2[^>]*>\s*How to Use the Weight Converter\s*</h2>'
           rep = '<h2>How to Use the Professional Weight Converter</h2>' }
        @{ pat = '<h2[^>]*>\s*All Calculators &amp; Tools\s*</h2>'
           rep = '<h2>All Pro Calculators &amp; Professional Tools</h2>' }
    )
    "bra-size-calculator\index.html" = @(
        @{ pat = '<h1>\s*Accurate Bra Size Calculator [^<]*</h1>'
           rep = '<h1>Professional Bra Size Calculator &#8212; Pro US / UK / EU / AU Sizing Tool for Fitters &amp; Lingerie Pros</h1>' }
        @{ pat = '<title>\s*Bra Size Calculator [^<]*</title>'
           rep = '<title>Professional Bra Size Calculator | Pro US / UK / EU / AU Sizing (Free, Fitter-Grade)</title>' }
        @{ pat = '<meta name="description" content="Free, accurate bra size calculator for US, UK, EU and AU sizing\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Professional bra size calculator trusted by fitters, lingerie brands and wellness pros. US/UK/EU/AU sizing with sister-size analysis. Measure at home in 2 minutes &#8212; instant, private, no signup."/>' }
        @{ pat = '<h2[^>]*>\s*How Bra Size Is Calculated\s*</h2>'
           rep = '<h2>How a Professional Bra Size Is Calculated</h2>' }
        @{ pat = '<h2[^>]*>\s*Related Tools &amp; Guides\s*</h2>'
           rep = '<h2>Pro Tools &amp; Professional Guides</h2>' }
    )
    "breast-volume\index.html" = @(
        @{ pat = '<h1>\s*Breast Volume [^<]*</h1>'
           rep = '<h1>Professional Breast Volume &amp; Weight Calculator &#8212; Pro cc/mL Tool for Clinicians &amp; Fitters</h1>' }
        @{ pat = '<title>\s*Breast Volume [^<]*</title>'
           rep = '<title>Professional Breast Volume &amp; Weight Calculator | Pro cc / mL Tool (Fitter-Grade)</title>' }
        @{ pat = '<meta name="description" content="Breast health and risk calculate tools[^"]*"\s*/?>'
           rep = '<meta name="description" content="Professional breast volume and weight calculator hub used by clinicians, fitters and wellness pros. Estimate cc, mL and grams using BREAST-V and Qiao formulas. Free, private, no signup."/>' }
        @{ pat = '<h2[^>]*>\s*Tools in This Hub\s*</h2>'
           rep = '<h2>Professional Tools in This Pro Hub</h2>' }
    )
    "bra-buying-guide\index.html" = @(
        @{ pat = '<h1>\s*Bra Buying Guide[^<]*</h1>'
           rep = '<h1>Pro Bra Buying Guide: How a Professional Chooses the Right Bra for Your Shape &amp; Lifestyle</h1>' }
        @{ pat = '<title>\s*Bra Buying Guide[^<]*</title>'
           rep = '<title>Pro Bra Buying Guide 2026 | Professional Fit, Fabric, Style &amp; Support Advice</title>' }
        @{ pat = '<meta name="description" content="How to buy a bra that fits\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Pro bra buying guide used by fitters and lingerie brands. How a professional chooses a bra that fits &#8212; compare fabrics, support levels, cup styles and sizes. Step-by-step advice for every shape and budget."/>' }
        @{ pat = '<h2[^>]*>\s*Bra Care Tips\s*</h2>'
           rep = '<h2>Pro Bra Care Tips from Professional Fitters</h2>' }
    )
    "best-comfort-bras\index.html" = @(
        @{ pat = '<h1>\s*Most Comfortable Bras[^<]*</h1>'
           rep = '<h1>Pro Comfortable Bras 2026 &#8212; Professional Top Picks for All-Day Wear (Expert-Tested)</h1>' }
        @{ pat = '<title>\s*Most Comfortable Bras[^<]*</title>'
           rep = '<title>Pro Most Comfortable Bras 2026 | Professional Expert-Tested Picks (Fitter-Reviewed)</title>' }
        @{ pat = '<meta name="description" content="The most comfortable bras of 2026[^"]*"\s*/?>'
           rep = '<meta name="description" content="Pro comfortable bras of 2026 &#8212; professional fitter-reviewed. Wireless, T-shirt and full-coverage picks for all-day comfort in every size A to H cup. Built on the 5 comfort criteria professionals use."/>' }
        @{ pat = '<h2[^>]*>\s*The 5 Comfort Criteria We Test\s*</h2>'
           rep = '<h2>The 5 Professional Comfort Criteria Pro Fitters Use</h2>' }
        @{ pat = '<h2[^>]*>\s*How to Find Your Most Comfortable Bra Size\s*</h2>'
           rep = '<h2>How to Find Your Pro Most Comfortable Bra Size (Professional Method)</h2>' }
    )
    "best-wireless-bras\index.html" = @(
        @{ pat = '<h1>\s*Best Wireless Bras[^<]*</h1>'
           rep = '<h1>Pro Best Wireless Bras 2026 &#8212; Professional No-Underwire Bras (Fitter-Approved)</h1>' }
        @{ pat = '<title>\s*Best Wireless Bras[^<]*</title>'
           rep = '<title>Pro Best Wireless Bras 2026 | Professional No-Underwire, Real Support (Fitter-Approved)</title>' }
        @{ pat = '<meta name="description" content="Find the best wireless bras of 2026\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Pro wireless bras of 2026 chosen by professional fitters. No-underwire support for DD+, small busts and all-day wear. Comfortable, no digging, no slipping &#8212; pro-reviewed and tested."/>' }
        @{ pat = '<h2[^>]*>\s*Wireless Bra Shopping Tips\s*</h2>'
           rep = '<h2>Pro Wireless Bra Shopping Tips from Professional Fitters</h2>' }
    )
    "how-to-measure-bra-size\index.html" = @(
        @{ pat = '<h1>\s*How to Measure Bra Size at Home[^<]*</h1>'
           rep = '<h1>How to Measure Bra Size at Home: Pro Step-by-Step Guide (Professional Fitter Method)</h1>' }
        @{ pat = '<title>\s*How to Measure Bra Size at Home[^<]*</title>'
           rep = '<title>How to Measure Bra Size at Home | Pro Step-by-Step Guide (Professional Fitter Method)</title>' }
        @{ pat = '<meta name="description" content="Learn how to measure your bra size at home with our step-by-step guide\.[^"]*"\s*/?>'
           rep = '<meta name="description" content="Learn how to measure your bra size at home like a pro. Step-by-step professional fitter method for band, bust, cup and sister size. Clear, accurate fit, no signup."/>' }
        @{ pat = '<h2[^>]*>\s*Try Our Bra Size Calculator\s*</h2>'
           rep = '<h2>Try Our Pro Bra Size Calculator (Professional-Grade)</h2>' }
    )
    "sports-bra-guide\index.html" = @(
        @{ pat = '<h1>\s*Sports Bra Guide[^<]*</h1>'
           rep = '<h1>Pro Sports Bra Guide: How a Professional Chooses the Right Support Level for Your Breast Size</h1>' }
        @{ pat = '<title>\s*Sports Bra Guide[^<]*</title>'
           rep = '<title>Pro Sports Bra Guide | Professional Support-Level Advice (Sports-Scientist Approved)</title>' }
        @{ pat = '<meta name="description" content="Complete sports bra guide[^"]*"\s*/?>'
           rep = '<meta name="description" content="Pro sports bra guide written by sports scientists and reviewed by professional fitters. Choose the right support level (low, medium, high impact) for your breast size and activity. Science-backed recommendations."/>' }
        @{ pat = '<h2[^>]*>\s*Encapsulation vs Compression[^<]*</h2>'
           rep = '<h2>Pro Encapsulation vs Compression: What a Professional Sports Scientist Recommends</h2>' }
    )
}

$report = New-Object System.Collections.Generic.List[object]
$totalEdits = 0

foreach ($rel in $edits.Keys) {
    $full = Join-Path $root $rel
    $content = Get-Content $full -Raw
    $hits = 0
    $misses = @()
    foreach ($e in $edits[$rel]) {
        $rx = [regex]$e.pat
        $m = $rx.Match($content)
        if ($m.Success) {
            $content = $rx.Replace($content, $e.rep, 1)
            $hits++
        } else {
            $misses += $e.pat.Substring(0, [Math]::Min(80, $e.pat.Length))
        }
    }
    if ($hits -gt 0) {
        Set-Content -Path $full -Value $content -NoNewline
        $totalEdits += $hits
        $report.Add([PSCustomObject]@{ file = $rel; edits = $hits; misses = $misses.Count })
        Write-Host "OK ($hits edits): $rel" -ForegroundColor Green
        foreach ($m in $misses) { Write-Host "  MISS: $m" -ForegroundColor Yellow }
    } else {
        Write-Host "NO CHANGE: $rel" -ForegroundColor DarkGray
        foreach ($m in $misses) { Write-Host "  MISS: $m" -ForegroundColor Red }
    }
}

Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
$report | Format-Table -AutoSize
Write-Host ("Total files updated: " + $report.Count)
Write-Host ("Total edits applied: " + $totalEdits)
