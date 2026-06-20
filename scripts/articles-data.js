// articles-data.js — content data for wellness hub + 12 articles
// Each article: dir, title, description, ogTitle, h1, intro, body, faq, related

const HUB = {
  slug: '',
  title: 'Breast Health & Wellness Hub | Bra, Comfort & Recovery Guides',
  description: 'Free breast health & wellness hub: bra fit, comfort, sports, life-stage changes, and post-surgery recovery. Evidence-based guides.',
  ogTitle: 'Breast Health &amp; Wellness Hub &mdash; Bra, Comfort &amp; Recovery Guides',
  h1: 'Breast Health &amp; Wellness Hub: Bra Fit, Comfort, Life Stages &amp; Recovery',
  intro: 'A complete, evidence-based library for breast health at every stage of life &mdash; from finding a bra that fits, staying comfortable at work and during exercise, navigating pregnancy, menopause, and body changes, all the way through post-surgery recovery. The right bra and the right information at the right time directly affect your comfort, posture, breast skin health, and recovery outcome. This hub brings together 14 deep-dive wellness articles and links to our wider breast health library, organized by topic so you can find the exact guidance you need in under a minute.',
  body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">What this hub covers</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Breast health is not one topic&mdash;it is a continuum that runs from the everyday (a bra that pinches, a strap that digs, a sports bra that fails at the gym) through life transitions (pregnancy, nursing, weight change, menopause) all the way to clinical events (augmentation, reduction, lumpectomy, mastectomy, reconstruction). Each stage of that continuum has its own bra, its own fit checklist, and its own comfort priorities. Generic advice&mdash;"wear a soft bra" or "get fitted at a store"&mdash;misses the stage-by-stage differences that determine whether you feel supported or miserable.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">This hub brings everything together. The <strong>first four sections</strong> below present 14 long-form articles grouped by topic&mdash;post-surgery recovery timelines, mastectomy and prosthetic support, comfort and skin care, and lifestyle situations (sleep, closure, sports). The <strong>fifth section</strong> links to our wider breast health library&mdash;bra fit basics, everyday comfort guides, sports bra science, breast volume and ptosis tools, and our full article archive&mdash;so you can move from this hub into any related topic without losing your place.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Post-Surgery &amp; Reconstruction</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A timeline is the single most important planning tool for post-surgical bra wear. It tells you when to expect peak swelling, when incisions are robust enough for an underband seam, when to add a light sports bra layer, and when your surgeon is likely to clear you for underwire (usually no earlier than 8&ndash;12 weeks for augmentation, and never for some flap procedures).</p>
<div class="articles-grid">
<article class="article-card"><div class="article-tag">Recovery Timeline</div><h3><a href="/wellness/post-surgery-bra-recovery-timeline/">Post-Surgery Bra Recovery Timeline: Week-by-Week Guide</a></h3><p>Your master reference for the full 0-to-6-week arc &mdash; what bra to wear on day 1 versus week 6, when to step down from a surgical bra, and how to recognize when you are ready.</p><div class="article-meta">Reviewed by our editorial team &middot; 7 min read</div></article>
<article class="article-card"><div class="article-tag">Bra Comparison</div><h3><a href="/wellness/compression-vs-support-bras/">Compression Bra vs Support Bra: How to Choose</a></h3><p>Side-by-side comparison, when to use each type, and how to step down safely without losing swelling control or implant support.</p><div class="article-meta">Reviewed by our editorial team &middot; 5 min read</div></article>
<article class="article-card"><div class="article-tag">Common Mistakes</div><h3><a href="/wellness/post-surgery-bra-mistakes/">10 Post-Surgery Bra Mistakes That Slow Healing</a></h3><p>The pitfalls we see most often&mdash;wrong size, wrong closure, wrong material&mdash;and the targeted fixes that keep recovery on track.</p><div class="article-meta">Reviewed by our editorial team &middot; 6 min read</div></article>
</div>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mastectomy &amp; Prosthetic Support</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A mastectomy bra is a wire-free pocketed bra designed to hold a breast form (prosthesis) symmetrically. Mastectomy bras are not just "comfort bras"&mdash;the pocketed cups prevent the prosthesis from shifting, the wider underband distributes form weight, and the soft lining protects sensitive post-surgical skin. The articles below cover what to expect at your first fitting, pocketed bra mechanics, and choosing between ready-to-wear and custom prostheses.</p>
<div class="articles-grid">
<article class="article-card"><div class="article-tag">Mastectomy</div><h3><a href="/wellness/mastectomy-bra-guide/">Mastectomy Bra Guide: Fitting, Styles &amp; First-Time Tips</a></h3><p>Beginner-friendly starting point&mdash;what to expect at your first specialist fitting, how pocketed bras differ from regular bras, and the questions to ask.</p><div class="article-meta">Reviewed by our editorial team &middot; 6 min read</div></article>
<article class="article-card"><div class="article-tag">Specialty</div><h3><a href="/wellness/pocketed-bras-guide/">Pocketed Bras Guide: How They Work &amp; Who Needs One</a></h3><p>Everything about mastectomy bra pockets&mdash;when to use them, how to insert a prosthesis, and which styles hold their shape best.</p><div class="article-meta">Reviewed by our editorial team &middot; 4 min read</div></article>
<article class="article-card"><div class="article-tag">Recovery</div><h3><a href="/wellness/prosthetic-bras-guide/">Prosthetic Bras Guide: Comfort After Mastectomy</a></h3><p>A comprehensive guide to prosthetic bras, post-mastectomy bras, and breast forms &mdash; choosing the right option for your recovery and daily comfort.</p><div class="article-meta">Reviewed by our editorial team &middot; 6 min read</div></article>
</div>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Comfort, Swelling &amp; Skin Care</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Discomfort after surgery has many possible causes&mdash;a band that is one size too tight, a cup seam that crosses an incision, a closure that pulls at a healing nipple graft, fabric that traps moisture against fragile skin. The articles in this section help you diagnose the cause and apply a targeted fix instead of buying a completely new bra. The same troubleshooting framework also helps anyone with sensitive skin, hormonal swelling, or chronic fit discomfort that has nothing to do with surgery.</p>
<div class="articles-grid">
<article class="article-card"><div class="article-tag">Comfort</div><h3><a href="/wellness/bra-discomfort-after-surgery/">Bra Discomfort After Surgery: Causes &amp; Fixes</a></h3><p>Full troubleshooting guide &mdash; diagnose the cause of pain, tightness, or pinching and apply a targeted fix.</p><div class="article-meta">Reviewed by our editorial team &middot; 5 min read</div></article>
<article class="article-card"><div class="article-tag">Recovery</div><h3><a href="/wellness/swelling-after-surgery-bras/">Swelling After Surgery: How Your Bra Helps (or Hurts)</a></h3><p>Managing post-operative edema with the right fit&mdash;and recognizing when a "supportive" bra is actually making swelling worse.</p><div class="article-meta">Reviewed by our editorial team &middot; 4 min read</div></article>
<article class="article-card"><div class="article-tag">Comfort</div><h3><a href="/wellness/bra-tightness-after-surgery/">Bra Tightness After Surgery: Why &amp; How to Loosen Safely</a></h3><p>Tight bands, digging straps, and breathing room &mdash; how to gain comfort without losing the support your recovery needs.</p><div class="article-meta">Reviewed by our editorial team &middot; 4 min read</div></article>
<article class="article-card"><div class="article-tag">Materials</div><h3><a href="/wellness/sensitive-skin-bra-materials/">Sensitive Skin? Best Bra Materials After Surgery</a></h3><p>Fabric guide for healing skin&mdash;which fibers breathe, which trap moisture, and which to avoid during the first 12 weeks.</p><div class="article-meta">Reviewed by our editorial team &middot; 5 min read</div></article>
<article class="article-card"><div class="article-tag">Care</div><h3><a href="/wellness/bra-care-after-surgery/">Bra Care After Surgery: Washing, Rotating &amp; Replacing</a></h3><p>Hygiene, longevity, and rotation&mdash;how to keep post-surgical bras clean and effective through the high-wash recovery period.</p><div class="article-meta">Reviewed by our editorial team &middot; 4 min read</div></article>
</div>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Sleep, Closure &amp; Active Recovery</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Special bra types and recovery habits round out the cluster&mdash;what to wear in bed, how front vs back closures affect range of motion, and the sports-bra considerations that change once the body is healing. These articles are relevant to anyone returning to exercise, sleep, and daily movement after a procedure&mdash;or to anyone with chronic fit issues at night, in the gym, or during range-of-motion work.</p>
<div class="articles-grid">
<article class="article-card"><div class="article-tag">Sleep</div><h3><a href="/wellness/sleeping-after-breast-surgery/">Sleeping After Breast Surgery: Bras, Positions &amp; Night Comfort</a></h3><p>The 24/7 wear period explained&mdash;night bras, sleep positions, and how to keep incisions safe while you rest.</p><div class="article-meta">Reviewed by our editorial team &middot; 4 min read</div></article>
<article class="article-card"><div class="article-tag">Closure</div><h3><a href="/wellness/front-vs-back-closure-bras/">Front-Closure vs Back-Closure Bras After Surgery</a></h3><p>Which closure works for which week of recovery, and why front-closure is almost always the right choice for weeks 0&ndash;3.</p><div class="article-meta">Reviewed by our editorial team &middot; 4 min read</div></article>
<article class="article-card"><div class="article-tag">Sports</div><h3><a href="/wellness/sports-bras-after-surgery/">Sports Bras After Surgery: When and How to Return to Exercise</a></h3><p>How to choose and use a sports bra post-surgery&mdash;compression level, impact rating, and the warning signs that mean you are doing too much too soon.</p><div class="article-meta">Reviewed by our editorial team &middot; 5 min read</div></article>
</div>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Beyond Surgery: More Breast Health Resources</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">This hub is part of a larger breast health library. The cards below link to our most-visited resources for bra fit, comfort, sports, breast volume, body changes, and the full article archive. Use them to move from surgical recovery into everyday breast health, or to come back to this hub from any other page on the site.</p>
<div class="articles-grid">
<article class="article-card"><div class="article-tag">Screening</div><h3><a href="/wellness/breast-self-exam/">How to Do a Breast Self-Exam: Step-by-Step Guide</a></h3><p>Evidence-based BSE guide &mdash; the current medical consensus, a 4-step technique, what to look for, and when to see a doctor.</p><div class="article-meta">Reviewed by our editorial team &middot; 11 min read</div></article>
<article class="article-card"><div class="article-tag">Tools</div><h3><a href="/bra-size-calculator/">Bra Size Calculator: Free, Accurate, Instant</a></h3><p>Our most-used tool&mdash;calculates your band and cup from two measurements and explains the result in plain language.</p><div class="article-meta">Calculator &middot; Free &amp; instant</div></article>
<article class="article-card"><div class="article-tag">Tools</div><h3><a href="/tools/breast-volume-calculator/">Breast Volume Calculator: Estimate in CC</a></h3><p>Estimate breast volume in cubic centimeters for symmetry, planning, or curiosity&mdash;useful for augmentation, reduction, and reconstruction.</p><div class="article-meta">Calculator &middot; Reviewed by editorial team</div></article>
<article class="article-card"><div class="article-tag">Tools</div><h3><a href="/tools/breast-ptosis-calculator/">Breast Ptosis Calculator: Understand Sagging</a></h3><p>Measure ptosis grade and learn what causes breast sagging, from aging and pregnancy to weight change and posture.</p><div class="article-meta">Calculator &middot; Educational</div></article>
<article class="article-card"><div class="article-tag">Guides</div><h3><a href="/best-comfort-bras/">Most Comfortable Bras: A Curated Guide</a></h3><p>Our best-of guide for bras you can wear all day&mdash;soft-cup, wireless, and full-coverage options reviewed for comfort, support, and quality.</p><div class="article-meta">Buying guide &middot; 14 picks</div></article>
<article class="article-card"><div class="article-tag">Guides</div><h3><a href="/best-wireless-bras/">Best Wireless Bras: Comfort Without Wires</a></h3><p>Wire-free bras that still provide structure&mdash;covering soft-cup, bralette, molded, and post-surgical styles.</p><div class="article-meta">Buying guide &middot; 12 picks</div></article>
<article class="article-card"><div class="article-tag">Guides</div><h3><a href="/sports-bra-guide/">Sports Bra Science: Fit, Support &amp; Impact</a></h3><p>How sports bras work, how to pick the right impact level for your activity, and why most women wear the wrong size for exercise.</p><div class="article-meta">Science guide &middot; 9 min read</div></article>
<article class="article-card"><div class="article-tag">Guides</div><h3><a href="/how-to-measure-bra-size/">How to Measure Bra Size at Home</a></h3><p>Step-by-step home measurement guide&mdash;band, bust, and how to interpret the result, with a sister-size chart for tricky fits.</p><div class="article-meta">How-to &middot; 7 min read</div></article>
<article class="article-card"><div class="article-tag">Guides</div><h3><a href="/bra-buying-guide/">D+ Cup Buying Guide: Support That Works</a></h3><p>A practical buying guide for D+ cups&mdash;band-first fitting, support architecture, and the styles that work for larger busts.</p><div class="article-meta">Buying guide &middot; 10 min read</div></article>
<article class="article-card"><div class="article-tag">Archive</div><h3><a href="/articles/">All Articles &amp; Editorial Library</a></h3><p>The full archive&mdash;bra fitting, breast health, sports, and wellness articles, with reviews, byline, and reading time.</p><div class="article-meta">Editorial archive &middot; 30+ articles</div></article>
</div>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How to use this hub</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">If you are <strong>pre-surgery</strong>, start with the <a href="/wellness/post-surgery-bra-recovery-timeline/" class="text-[#6b5344] hover:underline">recovery timeline</a> and <a href="/wellness/compression-vs-support-bras/" class="text-[#6b5344] hover:underline">compression vs support</a> articles&mdash;they will tell you what to buy in advance. If you are <strong>already post-op</strong> and have a specific problem, jump to the relevant comfort article. If you are <strong>planning for mastectomy</strong> specifically, the <a href="/wellness/mastectomy-bra-guide/" class="text-[#6b5344] hover:underline">mastectomy guide</a> is your anchor. If you are looking for <strong>everyday comfort, fit, sports, or breast volume information</strong>, use the "Beyond Surgery" cards above. Each article ends with a "Related Articles" section so you can move laterally to other stages or concerns.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Safety and E-E-A-T notice</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Every article in this cluster is written for general educational purposes. It is not a substitute for the specific protocol provided by your surgical team, primary care provider, or specialist. Recovery timelines, bra recommendations, and post-operative care vary by procedure type, incision location, implant placement (for augmentation), and individual healing response. Always follow your clinician's instructions first, and use these articles as a clarifying reference&mdash;not as a replacement for medical guidance.</p>
<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Medical disclaimer"><p><strong>Medical Disclaimer:</strong> This hub and all linked articles are for general educational purposes only and do not constitute medical advice. Recovery timelines, bra recommendations, and post-surgical care vary by individual procedure, healing response, and surgeon guidance. Always follow the specific instructions provided by your surgical team and consult a qualified healthcare provider before changing bras, compression levels, or post-operative routines.</p></aside>`,
  faq: [
    { q: 'When can I stop wearing a post-surgery bra 24/7?', a: 'Most surgeons clear patients for daytime-only wear between weeks 2 and 4, and full-time removal after week 4-6. The exact timing depends on your procedure (augmentation timeline differs from reduction or mastectomy) and your individual healing response. Always defer to your surgeon\'s written protocol.' },
    { q: 'Do I really need a special post-surgery bra, or can I use a regular sports bra?', a: 'A dedicated post-surgery bra is engineered for the specific needs of a healing chest&mdash;seamless cups, no underwire, front closure, soft adjustable straps, and a wide elastic underband. A regular sports bra can be a reasonable substitute after the first 2-3 weeks for some procedures, but only if it meets the same criteria. Ask your surgical team before substituting.' },
    { q: 'How many post-surgery bras do I need?', a: 'Most surgical teams recommend at least two: one to wear, one in the wash. During the first 2-3 weeks, you may want three, since drainage, ointments, and swelling changes can soil bras quickly. After week 4, a rotation of two is usually sufficient.' },
    { q: 'When can I wear an underwire bra after breast surgery?', a: 'For augmentation, most surgeons clear underwire between weeks 8 and 12, and only after the implant has fully settled. For reduction or lift, underwire is often allowed earlier (week 6-8) once incisions are mature. For mastectomy with reconstruction, underwire is sometimes restricted permanently if the incision crosses the underwire line. Always wait for written clearance from your surgeon.' },
    { q: 'Can I sleep without a bra after breast surgery?', a: 'Not during the first 4-6 weeks. Sleeping without a bra allows the breast tissue to shift laterally and can place tension on fresh incisions. A soft, wire-free sleep bra or surgical bra should be worn 24/7 during the initial recovery period unless your surgeon specifically clears nighttime removal.' }
  ],
  related: [
    { slug: 'post-surgery-bra-recovery-timeline', title: 'Post-Surgery Bra Recovery Timeline', blurb: 'Week-by-week guide from day 1 to week 6 and beyond.' },
    { slug: 'mastectomy-bra-guide', title: 'Mastectomy Bra Guide', blurb: 'Fitting, pocketed bras, and your first post-mastectomy visit.' },
    { slug: 'compression-vs-support-bras', title: 'Compression vs Support Bras', blurb: 'When to use each type and how to step down safely.' }
  ],
  schemaType: 'CollectionPage'
};

const ARTICLES = [
  {
    dir: 'post-surgery-bra-recovery-timeline',
    title: 'Post-Surgery Bra Recovery Timeline (Week-by-Week Guide)',
    description: 'Free week-by-week post-surgery bra recovery timeline. Learn which bra to wear at each stage, when to switch, and how to avoid common post-op mistakes.',
    ogTitle: 'Post-Surgery Bra Recovery Timeline &mdash; Week-by-Week',
    h1: 'Post-Surgery Bra Recovery Timeline: A Week-by-Week Guide',
    intro: 'A clear, week-by-week timeline of what bra to wear after breast surgery&mdash;from day 1 through week 6 and beyond&mdash;with stage-appropriate compression, support, and comfort recommendations.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Why a timeline matters</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">The single most common mistake after breast surgery is wearing the wrong bra at the wrong time&mdash;either too tight, too loose, with the wrong closure, or with underwire before the body is ready. A timeline helps you avoid those errors and gives you a script to follow when your surgical team says only "wear a soft bra."</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Recovery progresses through predictable phases. Each phase has a different bra brief: control swelling and protect incisions early, transition to gentle support during the remodeling phase, and rebuild full support once tissues are mature. Skipping phases&mdash;or staying in one phase too long&mdash;both create problems.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Week 0 (Day of surgery): sterile post-op bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">You will leave the operating room in a sterile, front-closure post-operative bra&mdash;usually a hospital-issued surgical bra or a brand-specific recovery bra. The job of this bra is simple: hold dressings in place, apply light, even compression, and keep the chest immobilized. The band should sit level all the way around and you should be able to slide one flat finger under the band.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Do not remove it. Your surgeon or nurse will change dressings at the first post-op visit (usually day 1-3), and they may re-fit you into a different size based on initial swelling.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Week 1: surgical bra, 24/7</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">You will wear a soft, wire-free, front-closure bra 24 hours a day, including during sleep. The primary goals are swelling control and incision protection. Most surgical teams want you in a bra from this category for at least the first 7-14 days. Front closure matters because lifting your arms above shoulder height is restricted during this phase.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Recommended features: wide elastic underband, seamless molded cups, adjustable wide straps, no underwire, breathable fabric. A pocketed bra is fine (and necessary for mastectomy patients with a soft temporary prosthesis).</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Weeks 2-3: medical-grade compression bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">By the end of week 1, most surgeons clear patients to switch to a step-down compression bra&mdash;still wire-free, still 24/7, but with a softer, more wearable construction. Peak swelling typically occurs between days 3 and 5, then begins to subside. The compression bra's job in this phase is to support the healing pocket (for augmentation), protect incisions, and gently guide implant position.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">For augmentation, the surgeon may specify a "band strap" (an elastic band worn at the top of the breasts) to encourage implants to drop into the final pocket position. This is a separate accessory and is usually worn for 1-2 hours per day initially.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Weeks 4-6: soft support bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Most patients transition out of compression between weeks 4 and 6. The new phase uses a soft-cup support bra&mdash;still wire-free, but with less compression and more breathability. Many patients can transition out of 24/7 wear to daytime-only wear during this window.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">This is also when a regular high-quality sports bra becomes an acceptable option, provided it has no underwire, no compression panels that cross incision lines, and adjustable straps. Avoid pullover styles until you have full range of motion without pain.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Weeks 6-12: clearance for underwire (often)</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">For most augmentations, surgeons clear underwire bras between weeks 8 and 12. For reductions and lifts, clearance often comes at week 6-8. For mastectomy with reconstruction, underwire may be restricted permanently depending on incision placement. Always wait for written or verbal clearance from your surgical team before wearing underwire.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">At this stage, the bra's job is to provide normal support, allow the breast tissue to settle into its final position, and protect scars from direct friction during the maturation phase.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Beyond week 12: long-term support</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">After week 12, you can return to a normal bra wardrobe&mdash;provided the fit is correct. A well-fitted bra reduces long-term ptosis, prevents incision reopening, and supports the weight of the breast tissue. Many patients use this period to get a professional bra fitting for the first time post-surgery, since breast size and shape often change.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">A quick rule of thumb: at every stage, you should be able to slide two fingers under the band, one finger under each strap, and the underwire (if cleared) should sit flat against the ribcage&mdash;never on breast tissue.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026. This article is reviewed periodically and updated as guidelines evolve.</p></aside>`,
    faq: [
      { q: 'When can I stop wearing a surgical bra 24/7?', a: 'Most surgeons clear patients for daytime-only wear between weeks 2 and 4, and full-time removal after week 4-6. The exact timing depends on your procedure and healing response.' },
      { q: 'When can I wear underwire after augmentation?', a: 'Most surgeons clear underwire between weeks 8 and 12 for augmentation, and only after the implant has settled. Wearing underwire earlier can interfere with pocket formation and implant positioning.' },
      { q: 'Can I shower without my surgical bra?', a: 'Most surgical teams allow brief removal of the surgical bra for showering after drains are out and incisions are sealed (usually day 3-7). Reapply the bra immediately after patting the area dry.' },
      { q: 'How tight should a post-surgery bra be?', a: 'Tight enough to apply light, even pressure&mdash;you should be able to slide one flat finger under the band and breathe deeply without restriction. The straps should hold the bra in place without digging into your shoulders.' },
      { q: 'Do I need different bras for sleeping?', a: 'For the first 4-6 weeks, yes. A soft, wire-free sleep bra with no compression is usually more comfortable in bed than a structured surgical bra. After clearance, you can sleep braless if your surgeon approves.' }
    ],
    related: [
      { slug: 'compression-vs-support-bras', title: 'Compression vs Support Bras', blurb: 'Understand the difference and when to switch.' },
      { slug: 'mastectomy-bra-guide', title: 'Mastectomy Bra Guide', blurb: 'Fitting, pocketed bras, and first post-mastectomy tips.' },
      { slug: 'front-vs-back-closure-bras', title: 'Front vs Back Closure Bras', blurb: 'Which closure to use at each recovery stage.' }
    ]
  },
  {
    dir: 'mastectomy-bra-guide',
    title: 'Mastectomy Bra Guide (Fitting, Styles & Best Tips)',
    description: 'Free mastectomy bra guide. Learn about pocketed bras, prosthesis fitting, post-mastectomy bra styles, common mistakes, and your first specialist fitting.',
    ogTitle: 'Mastectomy Bra Guide &mdash; Fitting, Pocketed Bras &amp; First Steps',
    h1: 'Mastectomy Bra Guide: Pocketed Bras, Fitting & First Post-Surgery Steps',
    intro: 'A beginner-friendly mastectomy bra guide&mdash;covering what a pocketed bra is, what to expect at your first specialist fitting, the most common styles, and the most common mistakes that affect comfort and prosthesis security.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">What is a mastectomy bra?</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A mastectomy bra is a soft, wire-free bra with built-in pockets in each cup. The pockets hold a breast form (prosthesis) securely against the chest wall so it sits in the same position as a natural breast. Mastectomy bras are not just regular bras with extra fabric&mdash;they are engineered with a wider underband to support prosthesis weight, a higher coverage line to hide prosthesis edges, and soft linings to protect post-surgical skin.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">You do not need a mastectomy bra immediately after surgery. During the first 4-6 weeks, you will wear a post-surgical bra, often with a soft temporary prosthesis (called a "softie" or "comfie"). Once incisions are fully healed and your surgeon clears you, you can be fitted for a true mastectomy bra and a permanent breast form.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Pocketed bras explained</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A pocketed bra has a fabric sleeve sewn into each cup, usually with a small opening at the top or side. The prosthesis slides into the pocket and stays put during movement. Most pocketed bras use a soft cotton-blend lining against the skin and a smooth outer fabric. The pocket is usually removable (or can be left empty on the unaffected side, or fitted with a partial shaper).</p>
<p class="text-[#5b4636] leading-relaxed mb-4">There are two main pocket types: bilateral (both sides pocketed) and unilateral (one side pocketed, one side molded). Bilateral is more versatile because the unaffected side can be left empty for asymmetry, fitted with a partial shaper, or fitted with a full form for women who have had a double mastectomy.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Your first specialist fitting</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">The first post-mastectomy bra fitting usually happens 6-8 weeks after surgery, once incisions are healed and swelling is reduced. It is done by a certified mastectomy fitter&mdash;a specialist trained to measure the chest wall, match you to the right prosthesis shape and size, and select a bra that holds the form correctly.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">What to bring: your surgical report if you have it, a list of any post-surgical restrictions, and a tight-fitting top so you can see how the bra looks under clothing. Many fitters recommend bringing a friend or partner for emotional support and a second opinion.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">The fitting usually takes 45-60 minutes. The fitter will measure the chest wall, assess skin sensitivity and scar position, discuss lifestyle (work, exercise, social), and let you try several bra-and-form combinations. You should walk out with at least two bras and one form&mdash;most insurance plans cover multiple bras per year.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mastectomy bra styles</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Mastectomy bras come in several style families: everyday soft-cup (the most common), front-closure (helpful if range of motion is limited), leisure/sleep bras (very soft, light support), sports bras (high-impact support with pockets), and specialty bras (lace, strapless, swimsuit styles). Most patients build a small wardrobe of two everyday bras, one leisure bra, and one sports bra.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Swimwear is a separate category&mdash;mastectomy swimsuits have built-in pockets and often a higher neckline and arm coverage for sun protection of scars. Many women find a well-fitted mastectomy swimsuit more comfortable than trying to fit a prosthesis into a regular swimsuit.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Common fitting mistakes</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">The most common mistake is wearing a bra that is too large in the band. A loose band lets the prosthesis sag, which creates back pain, shoulder strain, and an unnatural silhouette. A second common mistake is choosing a cup that is too small&mdash;the prosthesis needs full cup coverage without being compressed.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">A third mistake is wearing a bra with the prosthesis in the wrong pocket. Most breast forms are shaped to sit at a specific angle, and rotating or flipping the form changes the silhouette. The fitter should mark the correct orientation (top, bottom) for you, especially for asymmetric or teardrop-shaped forms.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Finally, many patients try to economize by reusing an old non-pocketed bra. Without the pocket, the form shifts during movement, escapes out the top, and can pop out at inopportune moments. A pocketed bra is not optional&mdash;it is the only way to securely hold a prosthesis in daily life.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'When can I be fitted for a mastectomy bra after surgery?', a: 'Most surgical teams recommend waiting 6-8 weeks after surgery, once incisions are fully healed and post-surgical swelling has resolved. Some patients may be fitted earlier with a soft temporary form.' },
      { q: 'Does insurance cover mastectomy bras?', a: 'In the US, Medicare and most private insurance plans cover mastectomy bras and breast forms under the Women\'s Health and Cancer Rights Act (WHCRA). Coverage usually includes 2-4 bras per year and a new form every 1-2 years. Check with your insurer for specific limits.' },
      { q: 'How long does a breast form last?', a: 'Most silicone breast forms last 2-5 years with daily wear. Foam or fiberfill forms last 6-12 months. Many insurance plans cover a replacement form every 1-2 years. Replace your form if it develops leaks, tears, or changes shape.' },
      { q: 'Can I wear a regular bra with a breast form?', a: 'Generally no. A regular bra does not have a pocket to hold the form securely, so the form can shift, sag, or pop out. Some forms are designed to adhere directly to the skin (adhesive forms), but most patients prefer the security of a pocketed bra.' },
      { q: 'What is a softie or comfie?', a: 'A softie is a lightweight, soft prosthesis made of fiberfill or foam. It is used in the first 4-8 weeks after surgery while incisions heal, before switching to a permanent silicone form. Softies are usually provided by the hospital or surgical team.' }
    ],
    related: [
      { slug: 'pocketed-bras-guide', title: 'Pocketed Bras Guide', blurb: 'How pockets work and who needs one.' },
      { slug: 'post-surgery-bra-recovery-timeline', title: 'Recovery Timeline', blurb: 'Week-by-week guide to post-surgery bra wear.' },
      { slug: 'bra-discomfort-after-surgery', title: 'Bra Discomfort After Surgery', blurb: 'Troubleshoot pain, tightness, and skin issues.' }
    ]
  },
  {
    dir: 'bra-discomfort-after-surgery',
    title: 'Bra Discomfort After Surgery (Causes & How to Fix)',
    description: 'Free guide to bra discomfort after surgery. Learn the most common causes of post-surgery bra pain and a step-by-step troubleshooting plan to fix it.',
    ogTitle: 'Bra Discomfort After Surgery &mdash; Causes &amp; Step-by-Step Fixes',
    h1: 'Bra Discomfort After Surgery: Causes, Fixes & Troubleshooting',
    intro: 'Step-by-step guide to diagnosing and fixing bra discomfort after breast surgery&mdash;covering sizing problems, material issues, band tightness, strap dig-in, and incision-line friction.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Why discomfort happens</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Bra discomfort after surgery almost always has a specific, fixable cause. The most common categories are: the wrong band size, the wrong cup size, fabric that irritates healing skin, a closure that pulls at an incision, or a seam that crosses a fresh scar. The fix is rarely "buy a new bra"&mdash;it is usually "fix the fit or the fabric of the bra you already have."</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Pain after surgery is also a moving target. What was comfortable in week 1 may dig in by week 3 because swelling has shifted. A bra that fits in week 4 may feel loose in week 8 as swelling resolves. Discomfort is often a signal to re-measure, not a sign that something is wrong.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Cause 1: band too tight</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A post-surgical band should be snug&mdash;not restrictive. The fit test: you should be able to slide one flat finger under the band at the back. If you cannot, the band is too tight. A too-tight band restricts breathing, traps lymph fluid, and can cause rib pain that radiates to the back.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Fix: go up one band size and one cup size down to maintain volume (sister sizing). If your surgical team has specified a compression level, look for a bra with adjustable hook-and-eye on the band so you can step down as swelling reduces.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Cause 2: straps digging in</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Strap dig-in is usually a sign that the band is too loose&mdash;the straps are doing the work the band should be doing. The fix is almost always a tighter band, not a looser strap. Strap cushions can help in the short term, but they are a workaround, not a solution.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">If the straps are still digging in after you tighten the band, you may have a frame issue&mdash;your shoulders are narrow or your frame is petite, and the straps are not adjustable short enough. Look for a bra with multiple loop sliders on the straps so you can shorten them properly.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Cause 3: fabric irritation</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Post-surgical skin is hypersensitive for the first 8-12 weeks. Lace, textured elastic, tags, and synthetic fabrics can all cause itching, redness, or even contact dermatitis. The safest fabrics are seamless microfiber, modal, bamboo, and medical-grade cotton blends.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">If a specific bra irritates, do not just wear it "tough"&mdash;the irritation can delay incision healing and increase the risk of infection. Switch to a soft-cup seamless bra and revisit the irritating style in 8-12 weeks.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Cause 4: seam on incision</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A bra seam that crosses an incision line creates friction every time you move. Even a soft seam can disrupt a fresh incision. The fix is either a seamless bra or a bra whose seam lines do not align with your incision placement.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">If you have a T-shaped or anchor incision (common in reduction), the horizontal scar often sits exactly where a band seam would be. A bra with a wide, soft, seamless underband&mdash;or a band with the seam placed on the side&mdash;solves this.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Cause 5: closure pulling</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A back-closure that pulls across the upper back is uncomfortable on healthy skin and painful on incision lines. Front-closure bras are the default recommendation for the first 4-6 weeks for this reason. If you must use a back-closure (e.g., your surgical team prefers it), use a bra with a long hook-and-eye so you can fasten it in front, slide it around, and avoid stretching the arms back.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Step-by-step troubleshooting</h2>
<ol class="list-decimal pl-6 text-[#5b4636] mb-6 space-y-2">
<li>Re-measure band and bust. Swelling changes daily in the first 2 weeks and weekly through week 6.</li>
<li>Check band fit. One flat finger under the band at the back. If less, the band is too tight.</li>
<li>Check strap fit. Straps should hold the bra in place without pressing into the shoulders.</li>
<li>Check the cup. The breast (or prosthesis) should sit fully in the cup with no spillage or gaping.</li>
<li>Check seams. No seam should cross an incision or a sensitive area.</li>
<li>Check fabric. If the fabric irritates after 20 minutes of wear, the bra is wrong for you.</li>
<li>If 3 or more checks fail, the bra is the wrong size or style&mdash;replace it.</li>
</ol>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'How do I know if my surgical bra is too tight?', a: 'You should be able to slide one flat finger under the band at the back. If you cannot, the band is too tight. Other signs: rib pain, restricted breathing, indentation in the skin that lasts more than a few minutes after removing the bra.' },
      { q: 'What if my bra feels fine in the morning but tight by evening?', a: 'This is normal during the first 2-3 weeks&mdash;swelling increases during the day as you move and remain upright. A bra with adjustable band hooks (3 columns) lets you step up in the morning and step down in the evening.' },
      { q: 'Can a bra cause infection after surgery?', a: 'A dirty or improperly fitted bra can irritate incisions, increasing infection risk. Wash bras in fragrance-free detergent, air-dry, and rotate daily. A bra that digs into an incision can reopen the wound&mdash;replace it immediately.' },
      { q: 'Is it normal for one side to hurt more than the other?', a: 'Yes, especially if your procedure was unilateral (one side) or if one side had more tissue removed. Asymmetry is normal during recovery. If pain is severe or worsening, contact your surgical team.' }
    ],
    related: [
      { slug: 'post-surgery-bra-recovery-timeline', title: 'Recovery Timeline', blurb: 'Week-by-week recovery and bra changes.' },
      { slug: 'sensitive-skin-bra-materials', title: 'Sensitive Skin Materials', blurb: 'Best fabrics for post-surgical skin.' },
      { slug: 'bra-tightness-after-surgery', title: 'Bra Tightness After Surgery', blurb: 'Why bands feel tight and how to fix it.' }
    ]
  },
  {
    dir: 'compression-vs-support-bras',
    title: 'Compression Bra vs Support Bra: How to Choose',
    description: 'Free comparison of compression bra vs support bra. Learn the difference, when to use each, a side-by-side comparison table, pros/cons, and step-down guidance.',
    ogTitle: 'Compression Bra vs Support Bra &mdash; How to Choose',
    h1: 'Compression Bra vs Support Bra: When to Use Each (with Comparison Table)',
    intro: 'A clear, side-by-side comparison of compression bras and support bras&mdash;how they differ, when surgeons prescribe each, pros and cons, and how to step down between them safely.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Compression vs support at a glance</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A <strong>compression bra</strong> applies even, distributed pressure across the entire chest wall. Its job is to reduce swelling, stabilize implants or tissue, and protect incisions. A <strong>support bra</strong> lifts the breast tissue away from the chest wall and holds it in position during movement. Its job is to reduce bounce, prevent tissue strain, and provide comfort during activity.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">The two are not interchangeable. Compression bras are prescribed for the early recovery phase (weeks 1-4) when swelling and incision protection are the priority. Support bras are introduced during the remodeling phase (weeks 4-6 onward) when swelling has resolved and the priority shifts to tissue support and comfort.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Comparison table</h2>
<table class="w-full text-left text-sm my-4 border-collapse">
<thead>
<tr class="bg-[#f5ebde]"><th class="p-2 border border-[#e6d5c3]">Feature</th><th class="p-2 border border-[#e6d5c3]">Compression Bra</th><th class="p-2 border border-[#e6d5c3]">Support Bra</th></tr>
</thead>
<tbody class="text-[#5b4636]">
<tr><td class="p-2 border border-[#e6d5c3]">Primary purpose</td><td class="p-2 border border-[#e6d5c3]">Reduce swelling, protect incisions</td><td class="p-2 border border-[#e6d5c3]">Lift, hold, prevent bounce</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Pressure distribution</td><td class="p-2 border border-[#e6d5c3]">Even, circumferential</td><td class="p-2 border border-[#e6d5c3]">Bottom-up, lifted</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Typical fit window</td><td class="p-2 border border-[#e6d5c3]">Weeks 1-4</td><td class="p-2 border border-[#e6d5c3]">Weeks 4-6 onward</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Underwire</td><td class="p-2 border border-[#e6d5c3]">No</td><td class="p-2 border border-[#e6d5c3]">Sometimes (after clearance)</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Closure</td><td class="p-2 border border-[#e6d5c3]">Front, adjustable</td><td class="p-2 border border-[#e6d5c3]">Front or back</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Cup construction</td><td class="p-2 border border-[#e6d5c3]">Seamless, molded</td><td class="p-2 border border-[#e6d5c3]">Molded, shaped, or seamed</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Strap width</td><td class="p-2 border border-[#e6d5c3]">Wide, padded</td><td class="p-2 border border-[#e6d5c3]">Wide to standard</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Common materials</td><td class="p-2 border border-[#e6d5c3]">Medical-grade microfiber, powernet</td><td class="p-2 border border-[#e6d5c3]">Cotton, modal, microfiber, lace</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Best for</td><td class="p-2 border border-[#e6d5c3]">Post-op weeks 0-4</td><td class="p-2 border border-[#e6d5c3]">Daily wear, light activity</td></tr>
</tbody>
</table>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">When to use a compression bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Use a compression bra in the immediate post-operative period (typically weeks 0-4). Compression is critical for controlling post-surgical swelling, holding dressings in place, and stabilizing implants or tissue during early healing. Most surgical teams prescribe a specific brand and size for the first 2-4 weeks.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Do not use a compression bra indefinitely. Long-term compression can restrict lymphatic flow, weaken chest wall muscles, and cause skin indentation. Step down to a support bra as soon as your surgeon clears you.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">When to use a support bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Use a support bra after the initial recovery phase (typically weeks 4-6 and beyond) and for long-term daily wear. A good support bra lifts the breast tissue, distributes weight across the underband, and reduces bounce during movement. Support bras are the right choice for daily life, work, light exercise, and beyond.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">A support bra is not a substitute for compression in the early phase. If you skip compression and go straight to a support bra, you may experience prolonged swelling, poor implant settling (for augmentation), or incision complications.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Pros and cons</h2>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Compression bra: pros</h3>
<ul class="list-disc pl-6 text-[#5b4636] mb-4 space-y-1">
<li>Reduces swelling effectively</li>
<li>Stabilizes implants, tissue, and incisions</li>
<li>Often required by surgeons for healing</li>
<li>Provides psychological security (knowing everything is held firmly)</li>
</ul>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Compression bra: cons</h3>
<ul class="list-disc pl-6 text-[#5b4636] mb-4 space-y-1">
<li>Can be uncomfortable for 24/7 wear</li>
<li>Restrictive during deep breathing</li>
<li>Hard to step down from once you are used to it</li>
<li>Fewer style options</li>
</ul>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Support bra: pros</h3>
<ul class="list-disc pl-6 text-[#5b4636] mb-4 space-y-1">
<li>Comfortable for daily wear</li>
<li>Wide style variety (lace, bralette, T-shirt, sports)</li>
<li>Improves posture and reduces back pain long-term</li>
<li>Can be used for years</li>
</ul>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Support bra: cons</h3>
<ul class="list-disc pl-6 text-[#5b4636] mb-4 space-y-1">
<li>Does not control early post-op swelling</li>
<li>Will not stabilize implants during pocket formation</li>
<li>Improper fit can cause tissue strain</li>
</ul>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How to step down from compression to support</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">The step-down is usually straightforward. Wear the support bra for an hour the first day, two hours the second day, half a day the third day, and full time by the end of the first week. If you experience increased swelling, return to compression and contact your surgical team. If you experience no swelling, you are ready to step down permanently.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'Can a compression bra be used as a sports bra?', a: 'No. A compression bra is engineered for low-intensity, low-mobility wear. A sports bra is engineered for high-intensity activity. Using a compression bra for running or HIIT can damage the bra and provide insufficient bounce control.' },
      { q: 'Can a sports bra be used as a compression bra?', a: 'In some cases, yes. A high-impact, wire-free sports bra with a wide underband can substitute for a compression bra after the first 2-3 weeks, when swelling has resolved. Always ask your surgical team before substituting.' },
      { q: 'How tight should a compression bra be?', a: 'Tight enough to apply even pressure that you can feel but not so tight that you cannot breathe deeply. The fit test: one flat finger under the band. Less than that is too tight; more than that is too loose.' },
      { q: 'When can I switch from a compression bra to a regular bra?', a: 'Most surgeons clear the switch between weeks 4 and 6. The exact timing depends on your procedure, healing response, and any complications. Wait for written or verbal clearance from your surgical team.' }
    ],
    related: [
      { slug: 'post-surgery-bra-recovery-timeline', title: 'Recovery Timeline', blurb: 'Week-by-week bra type recommendations.' },
      { slug: 'bra-discomfort-after-surgery', title: 'Bra Discomfort After Surgery', blurb: 'Troubleshoot pain and tightness.' },
      { slug: 'mastectomy-bra-guide', title: 'Mastectomy Bra Guide', blurb: 'Pocketed bras and post-mastectomy fitting.' }
    ]
  },
  {
    dir: 'swelling-after-surgery-bras',
    title: 'Swelling After Surgery: How Your Bra Helps (or Hurts)',
    description: 'Free guide to managing swelling after breast surgery. Learn how the right bra reduces post-op edema and warning signs to watch for.',
    ogTitle: 'Swelling After Surgery &mdash; How Your Bra Helps or Hurts',
    h1: 'Swelling After Surgery: How Your Bra Helps (or Hurts) Recovery',
    intro: 'Post-surgical swelling (edema) is normal&mdash;but the wrong bra can prolong it. Learn what causes swelling, how compression controls it, when to step up vs step down, and the warning signs that need a surgeon call.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Why swelling happens</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Swelling after breast surgery is part of the normal inflammatory response. The body sends fluid and immune cells to the surgical site to begin healing, and that fluid pools in the tissues until the lymphatic system can drain it. Peak swelling typically occurs between days 3 and 5, gradually subsides through week 2, and is mostly resolved by week 6-8.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">The right bra helps the lymphatic system do its job by applying gentle, even pressure that encourages fluid to move toward the lymph nodes. The wrong bra&mdash;too tight, too loose, or with a constricting band&mdash;can block drainage and prolong swelling.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How compression helps</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">External compression reduces the space available for fluid to pool. It also creates a pressure gradient that nudges fluid from the surgical site toward the lymph nodes in the armpit and chest. Properly fitted compression can reduce peak swelling by 20-30% and shorten the swelling phase by several days.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Compression is most important during the first 2 weeks, when swelling peaks. After week 2, the role of compression shifts from active swelling reduction to tissue support during the remodeling phase.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How a too-tight bra hurts</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A bra that is too tight can compress the lymphatic vessels themselves, blocking the very drainage you are trying to encourage. Symptoms of over-compression: persistent indentation in the skin, rib pain, increased swelling above or below the band, and numbness or tingling in the arms.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">If you notice these signs, step down to the next-looser hook on the band, or switch to a larger band size. Most post-surgical bras have 3 columns of hook-and-eye so you can adjust as swelling changes throughout the day.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">When to step up compression</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Step up compression (tighter band, more coverage) if swelling is increasing after day 5, if one side is significantly more swollen than the other, or if the surgical area feels "full" or tight. Step up under the guidance of your surgical team&mdash;if you have access to a post-op nurse line, call them first.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">When to step down</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Step down compression (looser band, lighter fabric) when swelling has visibly resolved, when the bra feels looser than when you first put it on, and when your surgeon clears the transition. Stepping down too early can prolong swelling; stepping down too late can cause skin indentation and discomfort.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Warning signs to call your surgeon</h2>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li>Sudden increase in swelling after day 7</li>
<li>One side significantly more swollen than the other</li>
<li>Redness, warmth, or fever (signs of infection)</li>
<li>Swelling that does not respond to compression adjustment</li>
<li>Drainage from incisions</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4">These are not bra problems&mdash;they are medical issues that need evaluation. Call your surgical team if you notice any of them.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'How long does swelling last after breast surgery?', a: 'Peak swelling occurs between days 3 and 5, gradually subsides through week 2, and is mostly resolved by week 6-8. Some subtle swelling can persist for 3-6 months, especially in the lower pole of the breast.' },
      { q: 'Can a tight bra cause more swelling?', a: 'Yes. A bra that is too tight can block lymphatic drainage and prolong swelling. Step down to a looser hook or larger band size if you notice persistent indentation or worsening swelling.' },
      { q: 'Should I wear my compression bra at night for swelling?', a: 'Yes, during the first 2-4 weeks. Nighttime wear maintains consistent compression during the peak swelling phase. After week 4, you can transition to a soft sleep bra if your surgeon approves.' },
      { q: 'Does drinking water help with post-surgery swelling?', a: 'Hydration supports lymphatic function, which is responsible for draining surgical fluid. Adequate water intake (typically 8-10 glasses per day, unless restricted by your surgeon) supports the healing process. Some surgeons also recommend reducing sodium intake to reduce fluid retention.' }
    ],
    related: [
      { slug: 'compression-vs-support-bras', title: 'Compression vs Support Bras', blurb: 'When to step down from compression.' },
      { slug: 'bra-tightness-after-surgery', title: 'Bra Tightness After Surgery', blurb: 'Why bands feel tight and how to fix it.' },
      { slug: 'post-surgery-bra-recovery-timeline', title: 'Recovery Timeline', blurb: 'Week-by-week recovery and bra changes.' }
    ]
  },
  {
    dir: 'sleeping-after-breast-surgery',
    title: 'Sleeping After Breast Surgery: Bras & Best Positions',
    description: 'Free guide to sleeping after breast surgery. Learn the best sleeping positions, why a 24/7 bra matters, and how to get comfortable in bed during recovery.',
    ogTitle: 'Sleeping After Breast Surgery &mdash; Bras, Positions &amp; Night Comfort',
    h1: 'Sleeping After Breast Surgery: Bras, Positions & Night Comfort',
    intro: 'Sleep is when the body does most of its healing&mdash;but post-surgical sleep can be uncomfortable. Learn the best sleeping positions, why a soft sleep bra matters, and how to set up your bed for recovery.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Why 24/7 bra wear matters at night</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Sleeping without a bra after breast surgery allows the breast tissue to shift laterally and can place tension on fresh incisions. It also allows fluid to pool in the dependent breast (the one you are lying on), which prolongs swelling. A soft, wire-free sleep bra maintains light compression and tissue position through the night, supporting the healing process during its most active hours.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Most surgical teams require 24/7 bra wear for the first 4-6 weeks&mdash;including sleep. The sleep bra does not have to be the same as the day bra. A soft, breathable sleep bra with light compression is often more comfortable in bed than a structured surgical bra.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Best sleeping positions</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">For the first 4-6 weeks, the safest position is on your back, slightly elevated. Elevation (an extra pillow or a wedge) uses gravity to reduce swelling. Back-sleeping also keeps both breasts at equal pressure, which is important for augmentation symmetry.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Side-sleeping is usually allowed after week 2-3 if it is comfortable, but it can place uneven pressure on the breasts. Stomach-sleeping is restricted for at least 6-8 weeks and often longer for augmentation (the weight of the body on the implants can interfere with healing).</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Sleep bra features to look for</h2>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li>Soft, seamless cups (no lace, no underwire)</li>
<li>Wide, soft underband that does not dig in</li>
<li>Front closure (so you do not have to twist)</li>
<li>Breathable fabric (modal, cotton, bamboo)</li>
<li>Light compression&mdash;snug but not restrictive</li>
<li>Tag-free or printed labels (no scratchy tags)</li>
</ul>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How to set up your bed for recovery</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A few small changes make a big difference: a wedge pillow or stacked pillows for elevation, a body pillow to prevent rolling onto your side, a small travel pillow to support the neck, and a bedside caddy for water, medication, and a phone. Sleep in a cool room (65-68F)&mdash;post-surgical hot flashes and night sweats are common, and a cool room improves sleep quality.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Common night discomforts and fixes</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Discomfort waking you at night? The most common cause is the sleep bra shifting&mdash;either tightening as you move or riding up the back. A bra with a wide, non-slip underband and a long hook-and-eye closure is less likely to shift. If you wake with the bra twisted, switch to a pullover-style sleep bra with no closures.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Another common issue: incision itching at night. This is a sign of healing, but it is uncomfortable. A cool compress (not ice) over the bra can reduce itching. Do not scratch&mdash;it can reopen incisions.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'When can I sleep on my side after breast surgery?', a: 'Most surgeons clear side-sleeping after week 2-3, provided it is comfortable. Use a body pillow to prevent rolling onto your stomach. Some patients prefer back-sleeping for 6-8 weeks to avoid uneven pressure.' },
      { q: 'When can I sleep without a bra after breast surgery?', a: 'Most surgeons require 24/7 bra wear, including sleep, for the first 4-6 weeks. After that, sleep-bra wear is often optional. Always wait for your surgeon\'s clearance before sleeping braless.' },
      { q: 'Can I sleep in a regular bra after surgery?', a: 'A regular wire-free bralette or T-shirt bra can work as a sleep bra after the first 2-3 weeks, once incisions are sealed and swelling has subsided. Look for soft, seamless, tag-free construction.' },
      { q: 'Why do I wake up more swollen in the morning?', a: 'Lying flat allows fluid to redistribute overnight. Sleeping slightly elevated (with a wedge pillow) reduces morning swelling. A properly fitted sleep bra with light compression also helps.' }
    ],
    related: [
      { slug: 'post-surgery-bra-recovery-timeline', title: 'Recovery Timeline', blurb: 'Week-by-week recovery and bra wear.' },
      { slug: 'bra-care-after-surgery', title: 'Bra Care After Surgery', blurb: 'Washing, rotating, and replacing.' },
      { slug: 'front-vs-back-closure-bras', title: 'Front vs Back Closure Bras', blurb: 'Which closure is easiest for sleep.' }
    ]
  },
  {
    dir: 'bra-tightness-after-surgery',
    title: 'Bra Tightness After Surgery: Causes & How to Loosen',
    description: 'Free guide to bra tightness after surgery. Learn why post-surgical bands feel tight, how to safely loosen them, and when tightness is a warning sign.',
    ogTitle: 'Bra Tightness After Surgery &mdash; Why &amp; How to Loosen Safely',
    h1: 'Bra Tightness After Surgery: Causes, Safe Fixes & Warning Signs',
    intro: 'A post-surgical bra should feel snug, not restrictive. Learn the difference, the most common causes of tightness, how to safely loosen your bra without losing support, and the warning signs that need a call to your surgical team.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Snug vs too tight: how to tell</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A post-surgical bra should feel snug&mdash;like a firm, supportive hug&mdash;not tight. The fit test: you should be able to slide one flat finger under the band at the back, breathe deeply without restriction, and move your arms freely. If the bra leaves deep indentations in the skin that last more than a few minutes, restricts breathing, or causes rib pain, it is too tight.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Tightness can also change throughout the day. A bra that fits well in the morning may feel tight by evening as swelling increases. A bra with adjustable hook-and-eye (3 columns) lets you tighten in the morning and loosen in the evening without changing bras.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Why tightness happens</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">The most common cause is normal post-surgical swelling. The bra fit at the time of surgery is calculated for the post-surgery body&mdash;but swelling peaks 3-5 days later, so the bra can feel tight during the peak. Other causes: weight gain from reduced activity, fluid retention from medication, and the natural tightening of elastic as it stretches with wear.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">A second common cause is the wrong size. Many patients are fitted in the hospital or surgical center while lying down, which gives a different measurement than standing. Re-measure yourself at home in a standing position 3-5 days after surgery to confirm the size.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How to safely loosen your bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Step 1: move to the next-looser hook on the band. Most post-surgical bras have 3 columns of hook-and-eye, allowing 1-2 inches of adjustability without changing the bra size.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Step 2: if loosening the hook is not enough, switch to a sister size&mdash;go up one band size and down one cup size to maintain cup volume. For example, a 36C becomes a 38B.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Step 3: if sister sizing is not enough, switch to a softer fabric. A powernet compression bra can feel tighter than a microfiber bra in the same size.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Step 4: if the band is still too tight after 1-2 weeks, the bra is the wrong size. Replace it.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">When tightness is a warning sign</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Call your surgical team if tightness is accompanied by: severe pain, redness or warmth, fever, sudden increase in swelling, numbness or tingling in the arms, or shortness of breath. These can be signs of infection, hematoma, or other complications that need medical evaluation.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Persistent indentation that lasts more than 15-20 minutes after removing the bra is also a sign the band is too tight. Step down to a looser hook or larger size immediately.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'How do I loosen my post-surgery bra without losing support?', a: 'First try the next-looser hook on the band (most post-surgical bras have 3 columns). If that is not enough, sister-size up (one band size larger, one cup size smaller). If that is not enough, switch to a softer fabric in the same size.' },
      { q: 'How tight is too tight for a surgical bra?', a: 'If you cannot slide one flat finger under the band at the back, the bra is too tight. Other signs: rib pain, restricted breathing, skin indentations that last more than 15-20 minutes after removing the bra.' },
      { q: 'Is it normal for a surgical bra to feel tight in the morning?', a: 'Yes, especially in the first 2 weeks. Fluid redistributes during the night as you lie flat. Sleeping slightly elevated and wearing the bra with the loosest hook overnight can help.' },
      { q: 'Can a too-tight surgical bra cause damage?', a: 'Yes. A bra that is too tight can restrict lymphatic drainage (prolonging swelling), compress incisions (delaying healing), and in rare cases cause tissue damage. Step down or replace the bra if it feels too tight.' }
    ],
    related: [
      { slug: 'swelling-after-surgery-bras', title: 'Swelling After Surgery', blurb: 'How swelling affects bra fit.' },
      { slug: 'bra-discomfort-after-surgery', title: 'Bra Discomfort After Surgery', blurb: 'Troubleshoot pain and tightness.' },
      { slug: 'compression-vs-support-bras', title: 'Compression vs Support Bras', blurb: 'When to step down from compression.' }
    ]
  },
  {
    dir: 'front-vs-back-closure-bras',
    title: 'Front-Closure vs Back-Closure Bras After Surgery',
    description: 'Free comparison of front-closure vs back-closure bras after surgery. Learn which closure is best at each recovery stage, pros/cons of each, and how to choose.',
    ogTitle: 'Front vs Back Closure Bras &mdash; Which to Choose After Surgery',
    h1: 'Front-Closure vs Back-Closure Bras After Surgery: How to Choose',
    intro: 'Front-closure and back-closure bras each have advantages and disadvantages after surgery. Learn which closure to choose at each recovery stage, the pros and cons of each, and how to make the right choice for your procedure.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Why closure matters after surgery</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">The closure of a post-surgical bra affects how easily you can put it on and take it off, how much you have to move your arms and shoulders, and how the closure sits against healing incisions. The wrong closure can place tension on incisions, require movements that are restricted during recovery, or pull on a sensitive chest wall.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Most surgical teams recommend a front-closure bra for the first 4-6 weeks, then transition to a back-closure as range of motion returns. The exact timing depends on your procedure and any movement restrictions.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Front-closure bras: pros and cons</h2>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Pros</h3>
<ul class="list-disc pl-6 text-[#5b4636] mb-4 space-y-1">
<li>Easy to put on and remove with limited arm mobility</li>
<li>No twisting or reaching behind the back</li>
<li>Closure sits in front, away from incision lines</li>
<li>Often has adjustable hook positions for swelling changes</li>
</ul>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Cons</h3>
<ul class="list-disc pl-6 text-[#5b4636] mb-4 space-y-1">
<li>Closure can press against breastbone or upper chest incisions</li>
<li>Fewer style options than back-closure</li>
<li>Closure hardware can fail (pop open) under stress</li>
<li>Less variety in cup shape and projection</li>
</ul>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Back-closure bras: pros and cons</h2>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Pros</h3>
<ul class="list-disc pl-6 text-[#5b4636] mb-4 space-y-1">
<li>Wider style variety (lace, T-shirt, bralette, plunge)</li>
<li>More secure closure (less likely to pop open)</li>
<li>Closure sits at the back, away from front incisions</li>
<li>Better for long-term daily wear</li>
</ul>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Cons</h3>
<ul class="list-disc pl-6 text-[#5b4636] mb-4 space-y-1">
<li>Requires arm mobility to fasten</li>
<li>Can pull on upper back incisions (for procedures with back involvement)</li>
<li>Harder to put on alone in the first 2-3 weeks</li>
<li>Less adjustable during the day</li>
</ul>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Which closure at which stage</h2>
<table class="w-full text-left text-sm my-4 border-collapse">
<thead>
<tr class="bg-[#f5ebde]"><th class="p-2 border border-[#e6d5c3]">Stage</th><th class="p-2 border border-[#e6d5c3]">Recommended closure</th><th class="p-2 border border-[#e6d5c3]">Why</th></tr>
</thead>
<tbody class="text-[#5b4636]">
<tr><td class="p-2 border border-[#e6d5c3]">Week 0-1</td><td class="p-2 border border-[#e6d5c3]">Front-closure</td><td class="p-2 border border-[#e6d5c3]">Limited arm mobility, dressing changes</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Week 2-4</td><td class="p-2 border border-[#e6d5c3]">Front-closure</td><td class="p-2 border border-[#e6d5c3]">Range of motion still limited</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Week 4-6</td><td class="p-2 border border-[#e6d5c3]">Either</td><td class="p-2 border border-[#e6d5c3]">Transition phase; try both</td></tr>
<tr><td class="p-2 border border-[#e6d5c3]">Week 6+</td><td class="p-2 border border-[#e6d5c3]">Back-closure</td><td class="p-2 border border-[#e6d5c3]">Full range of motion restored</td></tr>
</tbody>
</table>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How to put on a back-closure bra when you have limited mobility</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">If you must use a back-closure in the early phase, fasten the bra in front, then slide it around to the back. This avoids the twisting and reaching that can strain healing incisions. A bra with a long hook-and-eye (3-4 columns) is much easier to fasten in front than a short 2-column band.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Some patients use a "bra helper" tool&mdash;a long plastic hook that grabs the closure and pulls it into place. These are inexpensive, available at most drugstores, and save a lot of frustration in the first 2-3 weeks.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'When can I switch from a front-closure to a back-closure bra?', a: 'Most patients can transition to a back-closure between weeks 4 and 6, once full range of motion is restored. Some patients prefer to stay in front-closure bras long-term, which is fine if the bra fits well.' },
      { q: 'Are front-closure bras less supportive than back-closure?', a: 'Not necessarily. A well-designed front-closure bra can be just as supportive as a back-closure, especially in the early post-operative phase. The closure location does not determine support&mdash;the band, cup construction, and strap design do.' },
      { q: 'What is a bra helper?', a: 'A bra helper is a small plastic tool that lets you reach and fasten a back-closure bra without twisting your arms. It is especially useful in the first 2-3 weeks after surgery. Available at most drugstores for a few dollars.' },
      { q: 'Can a front-closure bra press on a sternum incision?', a: 'If your incision crosses the breastbone (e.g., for certain reconstructive procedures), a front-closure bra can place pressure on the incision. Look for a front-closure with a low-profile closure (no raised hardware) or consider a back-closure fastened in front.' }
    ],
    related: [
      { slug: 'post-surgery-bra-recovery-timeline', title: 'Recovery Timeline', blurb: 'Week-by-week bra type recommendations.' },
      { slug: 'bra-discomfort-after-surgery', title: 'Bra Discomfort After Surgery', blurb: 'Troubleshoot pain and tightness.' },
      { slug: 'sleeping-after-breast-surgery', title: 'Sleeping After Surgery', blurb: 'Best closure for sleep.' }
    ]
  },
  {
    dir: 'pocketed-bras-guide',
    title: 'Pocketed Bras Guide: How They Work & Who Needs One',
    description: 'Free guide to pocketed bras. Learn how the pockets work, who needs one, and how to choose the right pocketed bra for post-mastectomy wear.',
    ogTitle: 'Pocketed Bras Guide &mdash; How They Work &amp; Who Needs One',
    h1: 'Pocketed Bras Guide: How They Work, Who Needs One & How to Choose',
    intro: 'A clear, practical guide to pocketed bras&mdash;how the pockets work, who needs one (and who does not), and how to choose the right style for mastectomy, lumpectomy, or breast form wear.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">What is a pocketed bra?</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A pocketed bra is a bra with a fabric sleeve sewn into each cup, designed to hold a breast form (prosthesis) securely against the chest wall. The pocket keeps the form from shifting, sliding, or escaping out the top of the cup during movement. Most pocketed bras use a soft cotton or microfiber lining against the skin, with the pocket opening at the top, side, or both.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Pocketed bras are sometimes called "mastectomy bras" because the most common use is post-mastectomy breast form wear. But anyone who wears a breast form&mdash;whether for post-mastectomy, post-lumpectomy, or asymmetry&mdash;can use a pocketed bra.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Who needs a pocketed bra</h2>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>Post-mastectomy patients</strong> &mdash; the most common use; a pocketed bra holds a full breast form on the affected side.</li>
<li><strong>Post-lumpectomy or partial mastectomy patients</strong> &mdash; a partial form or shaper can be held in the pocket for symmetry.</li>
<li><strong>Patients with congenital asymmetry</strong> &mdash; a partial form on the smaller side creates visual symmetry.</li>
<li><strong>Anyone with a breast form for any reason</strong> &mdash; the pocket keeps the form secure.</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4">You do not need a pocketed bra if you have not had surgery and do not wear a form. A regular bra is fine for natural breast tissue alone.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Types of pockets</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Pocketed bras come in two main pocket configurations: bilateral (both sides pocketed) and unilateral (one side pocketed, the other side molded or seamless). Bilateral is the more common configuration because it gives you flexibility&mdash;you can wear a form on either side, both sides, or neither.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">The pocket opening can be at the top (most common), at the side, or at both. A top opening is the easiest to use. A side opening can be useful for larger forms that need to be slid in from below. Some bras have a small slit at the top with a hook-and-loop closure, which keeps the form from accidentally sliding out.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Pocketed bra styles</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Pocketed bras come in every style: everyday soft-cup, T-shirt, lace, plunge, bralette, full-coverage, sports, sleep, and swimsuit. The pocket adds minimal bulk in most styles and is often invisible under clothing. Specialty styles (lace, plunge) are sometimes only available with bilateral pockets.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Sports pocketed bras are engineered for high-impact activity and have stronger pockets, wider underbands, and higher-cut sides to keep the form in place during running, jumping, or HIIT. These are essential for any patient who wants to return to active life with a form.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How to fit a pocketed bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Fitting is similar to a regular bra with two extra considerations: the form must sit fully inside the pocket (no part of the form should spill out), and the form must align with the unaffected breast for symmetry. A fitter will check both cup coverage and form alignment in a mirror.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Bring the form you plan to wear when you go for a fitting. Different forms have different shapes, projections, and weights, and the bra needs to be matched to the specific form. Trying on a bra without a form gives a misleading sense of fit.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Common pocketed bra mistakes</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">The most common mistake is choosing a bra that is too large in the band. A loose band lets the form sag, which breaks the visual symmetry and strains the shoulders. The second most common mistake is wearing a bra with the form in the wrong pocket orientation&mdash;most forms are shaped asymmetrically and need to be placed top-up, top-down, or at an angle to match the natural breast.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">A third common mistake is wearing a pocketed bra without a form in the pocket. The empty pocket can bunch up and create an uneven silhouette. Either leave the form in or use a bra without pockets on the affected side.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'Do I need a pocketed bra if I have not had a mastectomy?', a: 'Not necessarily. Pocketed bras are designed to hold a breast form. If you have not had surgery and do not wear a form, a regular bra is fine.' },
      { q: 'Can I wear a regular bra with a breast form?', a: 'It is not recommended. A regular bra does not have a pocket to hold the form securely, so the form can shift, sag, or pop out. Adhesive forms can be worn with a regular bra, but most patients prefer the security of a pocketed bra.' },
      { q: 'How do I know if my form is in the right pocket?', a: 'A certified fitter will mark the correct orientation for your specific form. Most forms are shaped asymmetrically (teardrop, asymmetric triangle) and need to be placed top-up or top-down. The fitter should also check the alignment with your natural breast in a mirror.' },
      { q: 'Can I use a pocketed bra as a sleep bra?', a: 'Yes. Many pocketed bras are soft enough to sleep in, especially leisure or sleep-specific styles. If you wear a form at night, a pocketed sleep bra keeps it secure.' }
    ],
    related: [
      { slug: 'mastectomy-bra-guide', title: 'Mastectomy Bra Guide', blurb: 'Fitting, styles, and first post-mastectomy tips.' },
      { slug: 'post-surgery-bra-recovery-timeline', title: 'Recovery Timeline', blurb: 'Week-by-week post-surgery bra wear.' },
      { slug: 'compression-vs-support-bras', title: 'Compression vs Support Bras', blurb: 'When to use each type.' }
    ]
  },
  {
    dir: 'bra-care-after-surgery',
    title: 'Bra Care After Surgery: Washing, Rotating & Replacing',
    description: 'Free guide to bra care after surgery. Learn how to wash, rotate, and replace post-surgical bras to extend their lifespan and maintain support.',
    ogTitle: 'Bra Care After Surgery &mdash; Washing, Rotating &amp; Replacing',
    h1: 'Bra Care After Surgery: Washing, Rotating & Replacing',
    intro: 'A practical guide to caring for post-surgical bras&mdash;how to wash them to prevent infection, when to rotate, and how to know when a bra needs to be replaced.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Why bra care matters after surgery</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A post-surgical bra sits against healing skin and incisions for 24 hours a day. A dirty bra introduces bacteria to a vulnerable area. A stretched-out bra loses the compression or support your surgeon prescribed. A bra with a broken closure or torn seam can fail at a critical moment.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Caring for your bras properly extends their lifespan, prevents infection, and ensures consistent support throughout your recovery. It is one of the simplest things you can do to support your healing.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How to wash a post-surgical bra</h2>
<ol class="list-decimal pl-6 text-[#5b4636] mb-6 space-y-2">
<li>Use fragrance-free, dye-free detergent. Scented detergents can irritate healing skin and incisions.</li>
<li>Hand-wash or use a lingerie bag on the gentle/delicate cycle. Machine agitation can damage elastic, hooks, and pocketed linings.</li>
<li>Use cold or lukewarm water. Hot water breaks down elastic faster.</li>
<li>Rinse thoroughly. Detergent residue can irritate sensitive skin.</li>
<li>Roll in a towel to remove excess water. Do not wring.</li>
<li>Air-dry flat or hang to dry. Do not put bras in the dryer&mdash;heat destroys elastic.</li>
</ol>
<p class="text-[#5b4636] leading-relaxed mb-4">Wash frequency: every 1-3 days during the first 2-3 weeks, then every 3-7 days as drainage and ointments decrease. Many patients wash daily during the first week.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How to rotate bras</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Rotating between 2-3 bras extends the life of each bra. Elastic needs 24 hours to recover between wears&mdash;if you wear the same bra two days in a row, the elastic breaks down faster. Rotating also means you always have a clean bra ready while another is in the wash.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">During the first 2-3 weeks, plan for 3 bras: one to wear, one to wash, one to dry. After week 4, a rotation of 2 is usually sufficient.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">When to replace a bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Replace a post-surgical bra if any of the following occur: the band feels loose even on the tightest hook, the straps have stretched so they no longer hold the bra in place, the cups have lost their shape, the closure no longer fastens securely, the fabric has thinned or torn, or the underband seam has unraveled.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Most post-surgical bras last 2-4 months of daily wear. After that, the elastic has usually degraded enough that compression and support are no longer reliable. Replace before the bra fails, not after.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Storage tips</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Store clean bras flat in a drawer or hung by the center band. Do not fold cups inside each other&mdash;this creases the cup and can crack molded cups over time. Keep bras away from direct sunlight and heat, which break down elastic and fade fabric.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">If you have a pocketed bra, store it with a soft form in the pocket to help the pocket retain its shape. Avoid storing heavy items on top of bras&mdash;compression permanently deforms molded cups.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'How often should I wash my post-surgical bra?', a: 'Every 1-3 days during the first 2-3 weeks, then every 3-7 days. Daily washing is fine during the first week if drainage or ointments are present.' },
      { q: 'Can I put my post-surgical bra in the dryer?', a: 'No. Heat from the dryer breaks down elastic and damages pocketed linings. Always air-dry post-surgical bras flat or hanging.' },
      { q: 'How long does a post-surgical bra last?', a: 'Most post-surgical bras last 2-4 months of daily wear before the elastic degrades enough to compromise support. Replace before the bra fails.' },
      { q: 'Can I use fabric softener on a post-surgical bra?', a: 'Avoid fabric softener. The coating it leaves on fabric can irritate healing skin and reduce the moisture-wicking properties of performance fabrics. Use a fragrance-free, dye-free detergent instead.' }
    ],
    related: [
      { slug: 'post-surgery-bra-recovery-timeline', title: 'Recovery Timeline', blurb: 'Week-by-week post-surgery bra wear.' },
      { slug: 'sensitive-skin-bra-materials', title: 'Sensitive Skin Materials', blurb: 'Best fabrics for post-surgical skin.' },
      { slug: 'sleeping-after-breast-surgery', title: 'Sleeping After Surgery', blurb: 'Best sleep bra practices.' }
    ]
  },
  {
    dir: 'sensitive-skin-bra-materials',
    title: 'Sensitive Skin? Best Bra Materials After Surgery',
    description: 'Free guide to bra materials for sensitive post-surgical skin. Learn which fabrics to choose, which to avoid, and how to minimize irritation during recovery.',
    ogTitle: 'Sensitive Skin? Best Bra Materials After Surgery',
    h1: 'Sensitive Skin After Surgery: Best Bra Materials & Fabrics to Avoid',
    intro: 'A fabric guide for post-surgical skin&mdash;which materials are safest for healing incisions, which to avoid, and how to minimize itching, irritation, and contact dermatitis.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Why post-surgical skin is sensitive</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">After breast surgery, the skin in the surgical area is hypersensitive for 8-12 weeks. Incisions are still maturing, the lymphatic system is overactive, and the nerves are regenerating. Fabrics that felt fine before surgery can cause itching, redness, contact dermatitis, or even reopening of incisions during recovery.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">The right fabric reduces friction, wicks moisture away from the skin, and avoids chemical irritants. The wrong fabric can delay healing, increase infection risk, and make recovery much more uncomfortable.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Best fabrics for sensitive post-surgical skin</h2>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">1. Medical-grade microfiber</h3>
<p class="text-[#5b4636] leading-relaxed mb-4">Ultra-fine synthetic fibers, often used in post-surgical bras. Smooth against the skin, wicks moisture, easy to wash, and holds compression well. Look for medical-grade or OEKO-TEX certified microfiber to avoid chemical treatments.</p>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">2. Modal</h3>
<p class="text-[#5b4636] leading-relaxed mb-4">A semi-synthetic fiber made from beech tree pulp. Exceptionally soft, breathable, and moisture-wicking. Modal is often the most comfortable choice for sleep bras and lounge bras during recovery.</p>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">3. Bamboo</h3>
<p class="text-[#5b4636] leading-relaxed mb-4">Naturally antibacterial and very soft. Bamboo fabric is breathable and moisture-wicking, making it a good choice for hot sleepers or those who experience post-surgical night sweats.</p>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">4. Cotton (100% or high-percentage blend)</h3>
<p class="text-[#5b4636] leading-relaxed mb-4">The classic choice for sensitive skin. Soft, breathable, hypoallergenic. Pure cotton loses compression faster than synthetics, so look for a high-cotton blend with a small percentage of spandex or elastane.</p>
<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">5. Silicone (for breast forms, not bra fabric)</h3>
<p class="text-[#5b4636] leading-relaxed mb-4">Silicone breast forms are the most realistic and longest-lasting option. The form touches the skin inside the bra pocket, so a soft pocket lining (cotton, modal) is what actually touches the skin.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Fabrics and features to avoid</h2>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>Lace and textured elastic</strong> &mdash; friction against incisions and sensitive skin.</li>
<li><strong>Nylon or polyester with rough weaves</strong> &mdash; can trap heat and moisture.</li>
<li><strong>Tags and printed labels</strong> &mdash; cut them out or look for tag-free construction.</li>
<li><strong>Underwire</strong> &mdash; restricted during the first 6-12 weeks, and even after clearance, can dig into healing scars.</li>
<li><strong>Bright dyes and patterns</strong> &mdash; some dyes (especially cheap synthetic dyes) can cause contact dermatitis.</li>
<li><strong>Scented detergents and fabric softeners</strong> &mdash; chemical residue irritates healing skin.</li>
</ul>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How to test a fabric before committing</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Wear the new bra for 20-30 minutes against clean, dry skin (over a thin T-shirt if you are very sensitive). If there is no itching, redness, or irritation after 30 minutes, the fabric is likely safe for longer wear. If you notice any reaction, return the bra and try a different material.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Another test: wash the new bra 2-3 times before wearing it. This removes residual dyes and chemical treatments from the manufacturing process. If the bra survives multiple washes without pilling, fading, or losing shape, the fabric quality is good.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'What is the softest bra material for post-surgical skin?', a: 'Modal is often cited as the softest, with bamboo a close second. Both are breathable, moisture-wicking, and well tolerated by sensitive skin. Medical-grade microfiber is the next-softest option.' },
      { q: 'Can I wear lace bras after surgery?', a: 'Lace is generally not recommended during the first 8-12 weeks. After incisions are mature and any skin sensitivity has resolved, lace can be reintroduced. Choose lace with a soft cotton or modal backing, not rough synthetic lace.' },
      { q: 'Is cotton the best fabric for post-surgical bras?', a: 'Cotton is a good choice for sensitive skin but does not hold compression as well as synthetic fabrics. A high-cotton blend (90% cotton / 10% spandex) is often the best compromise for sensitive skin plus recovery support.' },
      { q: 'What is OEKO-TEX certified fabric?', a: 'OEKO-TEX is an international standard that certifies fabrics are free from harmful levels of chemicals. OEKO-TEX certified bras are a good choice for post-surgical patients who want to minimize chemical exposure.' }
    ],
    related: [
      { slug: 'bra-discomfort-after-surgery', title: 'Bra Discomfort After Surgery', blurb: 'Troubleshoot pain, tightness, and skin issues.' },
      { slug: 'bra-care-after-surgery', title: 'Bra Care After Surgery', blurb: 'Washing, rotating, and replacing.' },
      { slug: 'sleeping-after-breast-surgery', title: 'Sleeping After Surgery', blurb: 'Best fabrics for sleep.' }
    ]
  },
  {
    dir: 'post-surgery-bra-mistakes',
    title: '10 Post-Surgery Bra Mistakes That Slow Healing',
    description: 'Free guide to 10 post-surgery bra mistakes that slow healing. Learn what to avoid, why these mistakes are common, and how to fix them for a smoother recovery.',
    ogTitle: '10 Post-Surgery Bra Mistakes That Slow Healing',
    h1: '10 Post-Surgery Bra Mistakes That Slow Healing (and How to Fix Them)',
    intro: 'A list of the 10 most common post-surgery bra mistakes&mdash;from the wrong size to skipping bras at night&mdash;and how to fix each one for a smoother, faster recovery.',
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">Why mistakes happen</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Most post-surgery bra mistakes are not about buying the wrong bra&mdash;they are about wearing the right bra the wrong way. Patients receive good bras from their surgical team but do not know how to fit them, when to step down from compression, or when to replace them. The result is preventable discomfort, prolonged swelling, and slower healing.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Here are the 10 most common mistakes&mdash;and how to fix each one.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 1: wearing the bra too tight</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Tightening the band as much as possible, thinking "tighter = more support = better healing."</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> Over-compression restricts lymphatic drainage, prolonging swelling. It can also restrict breathing and put pressure on incisions.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> You should be able to slide one flat finger under the band at the back. If you cannot, the band is too tight. Loosen the hook or size up.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 2: wearing the bra too loose</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Choosing a bra that is too big "to be safe," or letting the band stretch out without replacing it.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> A loose band cannot provide compression or support. The straps end up doing the work, causing shoulder and back pain.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> The band should be snug but not tight. Replace bras when the band loses elasticity, usually every 2-4 months of daily wear.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 3: sleeping without a bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Removing the bra at night because it is uncomfortable.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> Sleeping without support allows the breast tissue to shift laterally and places tension on fresh incisions. Fluid can also pool in the dependent breast, prolonging swelling.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> Wear a soft, wire-free sleep bra 24/7 for the first 4-6 weeks. Choose a softer fabric for sleep than for daytime wear.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 4: wearing underwire too early</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Putting on a regular underwire bra at week 2 or 3 because it feels "normal."</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> Underwire can interfere with implant settling (for augmentation), place pressure on maturing incisions, and dig into tender tissue.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> Wait for written or verbal clearance from your surgical team. For augmentation, this is usually week 8-12. For mastectomy with reconstruction, it may be permanent.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 5: using a regular bra instead of a post-surgical bra</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Wearing a regular T-shirt bra or bralette during the first 2-4 weeks because it is "what I have."</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> Regular bras do not have the seamless cups, soft linings, front closures, or wide underbands that healing requires. Seams can dig into incisions, and closures can be hard to reach.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> Use a dedicated post-surgical bra for at least the first 2-4 weeks. Ask your surgical team for a recommended style or buy one online before surgery.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 6: not rotating bras</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Wearing the same bra for days in a row without washing.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> Elastic needs 24 hours to recover. Wearing the same bra two days in a row breaks down the elastic faster. A dirty bra also introduces bacteria to a vulnerable area.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> Have at least 2-3 bras in rotation. Wash each bra every 1-3 days during the first 2-3 weeks.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 7: wearing the wrong cup size</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Wearing a cup that is too small (causing spillage) or too large (causing gaping).</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> A too-small cup compresses the breast tissue, which can interfere with healing and cause discomfort. A too-large cup allows the breast to shift, which can disrupt implant position and prolong swelling.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> Re-measure yourself 3-5 days after surgery and at week 2-3. Get a professional fitting at week 6-8 to confirm your post-surgical size.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 8: ignoring fabric irritation</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Wearing a bra that itches, scratches, or causes redness because "I have to wear something."</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> Itching is a sign of skin irritation. Scratching can reopen incisions. Chronic irritation can lead to contact dermatitis, which delays healing.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> Switch to a softer fabric (modal, bamboo, soft cotton) and a seamless construction. Cut out tags and labels.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 9: skipping the post-op fitting</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Continuing to wear the bra you were fitted with in the hospital, even after your body has changed.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> Hospital fittings are often done lying down, which gives a different measurement than standing. By week 4-6, your body has changed enough that the original fit is no longer correct.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> Get a professional fitting at week 6-8 (or earlier if your surgeon recommends). For mastectomy patients, see a certified mastectomy fitter.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Mistake 10: wearing bras past their lifespan</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The mistake:</strong> Continuing to wear a bra with stretched elastic, broken closures, or thinning fabric.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Why it hurts:</strong> A worn-out bra does not provide the compression or support your surgeon prescribed. Continued wear can prolong healing and increase complication risk.</p>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>The fix:</strong> Replace bras every 2-4 months of daily wear. If the band feels loose on the tightest hook, the cup has lost shape, or the closure no longer fastens securely, replace the bra.</p>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Reviewed by"><p><strong>Reviewed by:</strong> Editorial team, Breast Calculator. Last reviewed: 2026.</p></aside>`,
    faq: [
      { q: 'What is the most common post-surgery bra mistake?', a: 'Wearing the bra too tight is the most common mistake. Many patients over-compress in the belief that tighter is better, but over-compression can restrict lymphatic drainage and prolong swelling.' },
      { q: 'Can I wear a regular sports bra instead of a post-surgical bra?', a: 'In some cases, yes&mdash;a high-quality, wire-free sports bra with a wide underband can substitute after the first 2-3 weeks. Always ask your surgical team before substituting.' },
      { q: 'How do I know when a bra is past its lifespan?', a: 'Replace the bra if the band feels loose on the tightest hook, the straps have stretched, the cup has lost its shape, the closure no longer fastens securely, or the fabric has thinned or torn.' },
      { q: 'Is it really bad to sleep without a bra after surgery?', a: 'Yes, during the first 4-6 weeks. Sleeping without a bra allows the breast tissue to shift and places tension on fresh incisions. A soft sleep bra maintains light compression and tissue position through the night.' }
    ],
    related: [
      { slug: 'post-surgery-bra-recovery-timeline', title: 'Recovery Timeline', blurb: 'Week-by-week post-surgery bra wear.' },
      { slug: 'bra-discomfort-after-surgery', title: 'Bra Discomfort After Surgery', blurb: 'Troubleshoot pain, tightness, and skin issues.' },
      { slug: 'bra-care-after-surgery', title: 'Bra Care After Surgery', blurb: 'Washing, rotating, and replacing.' }
    ]
  },
  {
    dir: 'breast-self-exam',
    title: 'How to Do a Breast Self-Exam (Step-by-Step Guide)',
    description: 'Free, evidence-based guide to the breast self-exam. Step-by-step instructions, what to look for, the current medical consensus, and when to see a doctor.',
    ogTitle: 'Breast Self-Exam &mdash; Step-by-Step Evidence-Based Guide',
    h1: 'How to Do a Breast Self-Exam: A Step-by-Step Evidence-Based Guide',
    intro: 'A complete, evidence-based guide to the breast self-exam (BSE)&mdash;what it is, what the current guidelines actually say, who it is and is not for, and a step-by-step method you can use at home in about ten minutes. Includes what to look for, when to call a doctor, the limits of BSE, and how it fits alongside mammograms, clinical breast exams, and other screening tools.',
    author: { name: 'Cyclonix', credentials: 'MPH, MHA' },
    publishedDate: '2026-06-20',
    updatedDate: '2026-06-20',
    readingTime: 11,
    body: `<h2 class="text-2xl font-bold text-[#4a3628] mt-8 mb-3">What is a breast self-exam?</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A breast self-exam (BSE) is a visual and tactile check of your own breast tissue, performed on a regular basis&mdash;most commonly once a month. The goal is not to diagnose anything. The goal is <strong>breast awareness</strong>: learning what is normal for your body so that you can notice meaningful changes and bring them to a clinician's attention early.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">The technique has been recommended, in some form, since the 1930s. The evidence supporting it has evolved&mdash;and the modern medical consensus is more nuanced than the old "do it every month in the shower" advice. We will cover the consensus in the next section. First, it helps to understand the difference between a <strong>self-exam</strong> and <strong>breast self-awareness</strong>:</p>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>Breast self-exam (BSE):</strong> a structured, step-by-step palpation and visual inspection performed on a fixed schedule, following a specific technique.</li>
<li><strong>Breast self-awareness:</strong> a broader, less formal practice of simply being familiar with how your breasts normally look and feel across the menstrual cycle, so you notice changes and act on them.</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4">Most current guidelines&mdash;including the American Cancer Society (ACS)&mdash;emphasize self-awareness over a rigid monthly ritual. We will use the terms together because the technique is the same; the difference is mostly in how strictly you schedule it.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">The current medical consensus (balanced view)</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">The evidence on BSE is genuinely mixed, and the honest answer is that major guideline bodies have moved away from recommending it as a <em>required</em> practice. Here is what each major body actually says:</p>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>U.S. Preventive Services Task Force (USPSTF, 2024):</strong> gives breast self-exam a <strong>"D" grade</strong> for women aged 40 and older, meaning the panel recommends <em>against</em> teaching BSE because the evidence does not show a mortality benefit and BSE can lead to false positives and unnecessary biopsies. Source: <a href="https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">USPSTF Breast Cancer Screening recommendation</a>.</li>
<li><strong>American Cancer Society (ACS, 2024 update):</strong> states that BSE is an <em>optional</em> tool, and that breast self-awareness&mdash;simply knowing what is normal for you&mdash;is more important than a strict monthly ritual. Source: <a href="https://www.cancer.org/cancer/types/breast-cancer/screening-tests-and-early-detection/american-cancer-society-recommendations-for-the-early-detection-of-breast-cancer.html" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">ACS Early Detection Recommendations</a>.</li>
<li><strong>American College of Obstetricians and Gynecologists (ACOG, 2017, reaffirmed):</strong> recommends <em>breast self-awareness</em> rather than structured BSE, and advises clinicians to discuss breast changes with patients as part of routine well-woman care. Source: <a href="https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2017/07/breast-cancer-risk-assessment-and-screening-in-average-risk-women" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">ACOG Practice Bulletin No. 179</a>.</li>
<li><strong>World Health Organization (WHO, 2024):</strong> emphasizes population-based screening (mammography) where available, and supports breast awareness as a complementary practice in low-resource settings. Source: <a href="https://www.who.int/news-room/fact-sheets/detail/breast-cancer" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">WHO Breast Cancer Fact Sheet</a>.</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Balanced takeaway:</strong> BSE has not been shown to reduce breast cancer mortality in randomized trials. The harms include false positives, unnecessary imaging, and benign biopsies. But knowing what is normal for your body has low cost and high potential benefit if it leads to earlier evaluation of a true change. This article teaches the technique because many readers want to know how to do it&mdash;not because it is a mandatory practice.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Who might benefit from regular BSE</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Even within the "optional" framing, some groups find structured self-exam useful&mdash;particularly people who:</p>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li>Are <strong>under 40</strong> and not yet eligible for routine mammography (the USPSTF currently grades biennial mammography starting at age 40, while ACS supports offering it from 45 with the option to start at 40).</li>
<li>Have a <strong>family history</strong> of breast cancer and are following an enhanced surveillance plan that their clinician has discussed with them.</li>
<li>Carry a <strong>known genetic risk</strong> (e.g., BRCA1/2, PALB2) where supplemental screening is layered on top of imaging.</li>
<li>Have <strong>dense breast tissue</strong>, where mammography is less sensitive and any palpable change should be reported promptly.</li>
<li>Have had <strong>prior benign breast disease</strong> (e.g., atypical hyperplasia, LCIS) and are in active surveillance.</li>
<li>Are <strong>pregnant or lactating</strong>, when imaging pathways differ and any new lump warrants prompt evaluation.</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4">If you fall into any of these groups, talk to your clinician about how BSE fits into your overall screening plan. For everyone else, the practical value of BSE is in <strong>breast self-awareness</strong>&mdash;a baseline familiarity that makes you a more informed participant in your own care.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">When to do it (timing in the menstrual cycle)</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">If you are pre-menopausal and still cycling, the best time to examine your breasts is <strong>3 to 5 days after your period starts</strong>&mdash;that is, in the early follicular phase, when estrogen and progesterone are at their lowest and breast tissue is least engorged and tender. Source: <a href="https://www.mayoclinic.org/tests-procedures/breast-exam/about/pac-20393237" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">Mayo Clinic breast self-exam guidance</a>.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">If you are post-menopausal, on continuous hormonal contraception, or have had a hysterectomy that removed your ovaries, pick any consistent day&mdash;the first of every month is a common choice&mdash;and perform the exam on the same day each month so you are comparing like with like.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">If you are pregnant or lactating, monthly exams are still useful but the breast tissue will feel different&mdash;lumpier and denser. Discuss what is normal for this stage with your obstetric provider or a lactation consultant.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Step-by-step: how to do a breast self-exam</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">The technique below is the standard method taught by the ACS, Mayo Clinic, and Susan G. Komen. Plan for about <strong>10 minutes</strong> total&mdash;roughly 5 minutes per side.</p>

<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Step 1 &mdash; Visual inspection (in front of a mirror)</h3>
<p class="text-[#5b4636] leading-relaxed mb-4">Stand in front of a mirror with your shoulders straight and your arms at your sides. Look at both breasts in three positions:</p>
<ol class="list-decimal pl-6 text-[#5b4636] mb-6 space-y-1">
<li>Arms relaxed at your sides.</li>
<li>Arms raised overhead, palms pressed together.</li>
<li>Hands pressed firmly into your hips (this contracts the chest muscles and can accentuate subtle changes).</li>
</ol>
<p class="text-[#5b4636] leading-relaxed mb-4">In each position, look for: changes in size or shape between the two breasts; dimpling, puckering, or bulging of the skin; changes in nipple position (inversion, pointing in a new direction); redness, rash, or scaling, especially around the nipple-areolar complex; visible lumps or ridges that do not move with normal posture.</p>

<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Step 2 &mdash; Palpation while standing</h3>
<p class="text-[#5b4636] leading-relaxed mb-4">Many people find it easier to perform the standing portion in the shower, where wet, soapy skin reduces friction. Use the <strong>flats of your three middle fingers</strong> held together&mdash;not the fingertips. Apply three levels of pressure in sequence:</p>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>Light pressure</strong> &mdash; just enough to move the skin without compressing the tissue underneath.</li>
<li><strong>Medium pressure</strong> &mdash; deeper into the tissue.</li>
<li><strong>Firm pressure</strong> &mdash; down to the chest wall (the ribs). It should not hurt, but it should feel substantial.</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4">Use a <strong>pattern</strong> so you cover the entire breast. Two common choices:</p>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>Vertical strip ("lawnmower") pattern:</strong> Move your fingers up and down in vertical strips, starting at the underarm and moving across to the sternum, then up to the collarbone, then back across. This is the pattern most studies have used and is generally considered the most thorough.</li>
<li><strong>Concentric circle pattern:</strong> Start at the outermost edge of the breast and work inward in small circles, ending at the nipple. This is the older classic pattern and is also acceptable.</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4">In each spot, use a small circular motion&mdash;about the size of a coin&mdash;and overlap the circles slightly so no area is missed. Cover the entire breast from the collarbone down to the bra line, and from the sternum out to the underarm.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Do not forget the <strong>tail of Spence</strong>&mdash;the wedge of breast tissue that extends up and out into the underarm. Many breast cancers occur in this region. Use the same three-pressure, small-circle technique.</p>

<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Step 3 &mdash; Palpation while lying down</h3>
<p class="text-[#5b4636] leading-relaxed mb-4">Lying down spreads the breast tissue more evenly across the chest wall, which makes deep lumps easier to feel. Place a small pillow or folded towel under the shoulder of the side you are examining, and place the same-side arm behind your head.</p>
<p class="text-[#5b4636] leading-relaxed mb-4">Using the same three-pressure, small-circle technique, work through the same pattern on the opposite breast first (your dominant hand examines the opposite breast; the same-side hand rests on your forehead or behind your head). Cover the full breast, the tail of Spence, and finish by gently pressing the nipple&mdash;a small amount of clear or milky discharge can be normal in some circumstances, but any new discharge&mdash;especially bloody, spontaneous, or one-sided&mdash;should be evaluated.</p>

<h3 class="text-xl font-semibold text-[#4a3628] mt-6 mb-2">Step 4 &mdash; Record what you felt</h3>
<p class="text-[#5b4636] leading-relaxed mb-4">The point of doing this regularly is to establish a <strong>personal baseline</strong>. A simple notebook entry or a note on your phone&mdash;date, what you felt, where&mdash;lets you track changes over time. If anything changes, you have a record to share with your clinician.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">What to look for: changes that warrant a clinician visit</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Most breast lumps are <strong>not</strong> cancer&mdash;fibroadenomas, cysts, and dense glandular tissue are common, especially before menopause. But the following changes should be evaluated, ideally within days to a few weeks:</p>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li>A <strong>new lump</strong> that feels hard, fixed (does not move when you push it), and has irregular edges.</li>
<li>A <strong>persistent lump</strong> that does not go away after your next menstrual cycle.</li>
<li>A lump that <strong>changes</strong> &mdash; grows, becomes harder, or develops a fixed character.</li>
<li><strong>Skin changes</strong> &mdash; dimpling, puckering, redness, thickening (sometimes called "peau d'orange," an orange-peel texture), or visible ridges.</li>
<li><strong>Nipple changes</strong> &mdash; a new inversion, a change in direction, scaling, crusting, or rash (especially if it affects only one nipple).</li>
<li><strong>Nipple discharge</strong> &mdash; especially if it is spontaneous (occurs without squeezing), bloody, clear, or only from one duct.</li>
<li><strong>Persistent pain</strong> in one area that does not vary with the menstrual cycle.</li>
<li>A <strong>change in overall shape or size</strong> of one breast compared to the other, especially if new.</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4">If you find any of the above, schedule a clinical breast exam. Your clinician may order a diagnostic mammogram, a breast ultrasound, or both&mdash;imaging decisions are made based on your age, the finding, and your individual risk profile. Source: <a href="https://www.cancer.gov/types/breast/hp/breast-screening-pdq" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">National Cancer Institute Breast Cancer Screening PDQ</a>.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">BSE limitations (what it cannot do)</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">BSE has real limits and these should shape your expectations:</p>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>It does not detect all cancers.</strong> Small, deep, or slowly growing tumors may not be palpable. Two large randomized trials&mdash;the Canadian NBSS and a long-running Shanghai trial&mdash;did not find a mortality benefit from structured BSE.</li>
<li><strong>It produces false positives.</strong> Most lumps found on BSE are not cancer, but the workup (imaging, sometimes biopsy) can be stressful, expensive, and time-consuming.</li>
<li><strong>It is not a substitute for imaging.</strong> Mammography can detect microcalcifications and small tumors years before they are palpable. BSE and mammography are complementary, not interchangeable.</li>
<li><strong>Skill improves with practice.</strong> Early in the learning curve, it is normal to feel anxious about every ridge and bump. The first 3-6 months of regular self-exam are mostly about establishing your personal baseline.</li>
</ul>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">How BSE fits with other screening</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">A modern breast cancer screening plan layers multiple tools. Below is the standard adult framework in the United States; other countries have similar but not identical schedules:</p>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>Mammography:</strong> the only imaging modality proven to reduce breast cancer mortality in large randomized trials. Current guidelines vary by body&mdash;USPSTF (2024): biennial starting at age 40; ACS: offer 40&ndash;44, annual 45&ndash;54, biennial or annual 55+; ACOG: offer starting at 40, recommend by 50.</li>
<li><strong>Clinical breast exam (CBE):</strong> a physical exam performed by a trained clinician. The USPSTF states there is insufficient evidence to recommend <em>for or against</em> CBE; ACS does not specifically require it but considers it part of routine well-woman care.</li>
<li><strong>Breast ultrasound:</strong> used as a supplemental tool, especially in dense breast tissue or to characterize a palpable finding.</li>
<li><strong>Breast MRI:</strong> recommended for high-risk individuals (lifetime risk &ge; 20%, BRCA carriers, etc.), typically alternating with mammography every 6 months.</li>
<li><strong>Self-awareness and optional BSE:</strong> the layer that lives between screening visits&mdash;your own knowledge of your body.</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4">For global breast cancer statistics&mdash;incidence, mortality, and survival&mdash;the <a href="https://www.who.int/news-room/fact-sheets/detail/breast-cancer" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">WHO Breast Cancer Fact Sheet</a> and the <a href="https://www.cancer.org/cancer/types/breast-cancer/about/key-statistics.html" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">ACS Breast Cancer Key Statistics</a> are reliable sources updated annually.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Modifiable risk factors to know</h2>
<p class="text-[#5b4636] leading-relaxed mb-4">Some breast cancer risk factors (age, genetics, family history, dense breast tissue) are not modifiable. Several are&mdash;and the evidence on these has been consistent across major reviews:</p>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>Alcohol:</strong> each daily drink is associated with a small but measurable increase in risk; risk rises with cumulative intake.</li>
<li><strong>Body weight after menopause:</strong> higher adiposity in post-menopausal women increases circulating estrogen and is associated with higher risk.</li>
<li><strong>Physical inactivity:</strong> regular moderate-to-vigorous activity is associated with reduced risk.</li>
<li><strong>Hormone replacement therapy (HRT):</strong> combined estrogen-progestin HRT, especially when used for more than 3&ndash;5 years, is associated with increased risk. The decision to use HRT for menopausal symptoms should weigh benefits against this risk with your clinician.</li>
<li><strong>Reproductive history:</strong> not having children, or having a first child after age 30, is associated with a small increase in risk; breastfeeding is associated with a small decrease.</li>
</ul>
<p class="text-[#5b4636] leading-relaxed mb-4">For a complete risk-factor list with citations, see the <a href="https://www.cancer.gov/types/breast/hp/breast-prevention-pdq" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">National Cancer Institute Breast Cancer Prevention PDQ</a>.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Actionable takeaways</h2>
<ul class="list-disc pl-6 text-[#5b4636] mb-6 space-y-1">
<li><strong>Learn what is normal for you.</strong> The most useful single habit is breast self-awareness&mdash;notice how your breasts look and feel across your cycle, and act on meaningful changes.</li>
<li><strong>Use a structured technique.</strong> If you choose to do BSE, follow a defined pattern (vertical strip or concentric circles) at three pressure levels with the flats of three fingers, covering the full breast, the tail of Spence, and the nipple.</li>
<li><strong>Time it right.</strong> Pre-menopausal: 3&ndash;5 days after your period starts. Post-menopausal: any consistent day each month.</li>
<li><strong>Keep a simple log.</strong> A note on your phone with the date and what you felt makes changes easier to track and easier to discuss with your clinician.</li>
<li><strong>Do not skip imaging.</strong> BSE does not replace mammography or other screening. Follow age- and risk-appropriate imaging guidelines with your clinician.</li>
<li><strong>See a clinician promptly</strong> for any new, persistent, or changing lump; skin dimpling or redness; nipple inversion or discharge; or persistent focal pain.</li>
<li><strong>Manage the modifiable</strong>: limit alcohol, stay active, maintain a healthy body weight after menopause, and discuss HRT use carefully with your clinician.</li>
</ul>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">Author bio</h2>
<p class="text-[#5b4636] leading-relaxed mb-4"><strong>Cyclonix, MPH, MHA</strong>, is a healthcare writer and Master of Healthcare Management graduate from a top-tier medical school. Their work focuses on translating clinical evidence into clear, actionable guidance for general readers, with particular attention to women's health, preventive screening, and shared decision-making between patients and clinicians.</p>

<h2 class="text-2xl font-bold text-[#4a3628] mt-10 mb-3">References</h2>
<ol class="list-decimal pl-6 text-[#5b4636] mb-6 space-y-2">
<li>U.S. Preventive Services Task Force. <em>Breast Cancer: Screening.</em> Recommendation Statement. JAMA. 2024. <a href="https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">uspreventiveservicestaskforce.org</a>.</li>
<li>American Cancer Society. <em>American Cancer Society Recommendations for the Early Detection of Breast Cancer.</em> 2024. <a href="https://www.cancer.org/cancer/types/breast-cancer/screening-tests-and-early-detection/american-cancer-society-recommendations-for-the-early-detection-of-breast-cancer.html" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">cancer.org</a>.</li>
<li>American College of Obstetricians and Gynecologists. <em>Practice Bulletin No. 179: Breast Cancer Risk Assessment and Screening in Average-Risk Women.</em> Obstetrics &amp; Gynecology. 2017 (reaffirmed). <a href="https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2017/07/breast-cancer-risk-assessment-and-screening-in-average-risk-women" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">acog.org</a>.</li>
<li>National Cancer Institute. <em>Breast Cancer Screening (PDQ)&mdash;Health Professional Version.</em> 2024. <a href="https://www.cancer.gov/types/breast/hp/breast-screening-pdq" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">cancer.gov</a>.</li>
<li>World Health Organization. <em>Breast Cancer Fact Sheet.</em> 2024. <a href="https://www.who.int/news-room/fact-sheets/detail/breast-cancer" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">who.int</a>.</li>
<li>Mayo Clinic. <em>Breast self-exam for breast awareness: How to do it, what to look for.</em> 2023. <a href="https://www.mayoclinic.org/tests-procedures/breast-exam/about/pac-20393237" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">mayoclinic.org</a>.</li>
<li>Susan G. Komen. <em>Breast Self-Awareness and Breast Self-Exam.</em> 2023. <a href="https://www.komen.org/breast-cancer/screening/breast-self-awareness/" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">komen.org</a>.</li>
<li>American Cancer Society. <em>Breast Cancer Key Statistics.</em> 2024. <a href="https://www.cancer.org/cancer/types/breast-cancer/about/key-statistics.html" class="text-[#6b5344] hover:underline" rel="noopener" target="_blank">cancer.org</a>.</li>
</ol>

<aside class="bg-[#fff5e6] border-l-4 border-[#d4a76a] p-4 my-6 rounded text-sm" role="note" aria-label="Medical disclaimer"><p><strong>Medical Disclaimer:</strong> This article is for general educational purposes only and does not constitute medical advice. Screening recommendations vary by individual risk, family history, and national guidelines. Always discuss personal screening plans and any breast changes with a qualified healthcare provider.</p></aside>`,
    faq: [
      { q: 'How often should I do a breast self-exam?', a: 'There is no universally "right" frequency. Major guidelines do not require monthly BSE. A practical approach is to do a structured exam once a month, a few days after your period ends if you are pre-menopausal, while focusing the rest of the month on breast self-awareness&mdash;noticing what is normal for your body and reporting meaningful changes.' },
      { q: 'Can a breast self-exam detect cancer?', a: 'BSE can detect some palpable cancers, but it does not detect all of them&mdash;small or deep tumors can be missed. It is also not a substitute for mammography, which can find microcalcifications and small masses years before they are palpable. Use BSE as one layer of a layered screening plan, not as a replacement for imaging.' },
      { q: 'I found a lump during a self-exam&mdash;what should I do?', a: 'Schedule a clinical breast exam with your primary care provider or gynecologist. Try not to panic: most breast lumps, especially in pre-menopausal women, are not cancer (they are often cysts, fibroadenomas, or dense glandular tissue). But a new, persistent, or changing lump should always be evaluated, usually with a clinical exam and imaging such as mammography and/or ultrasound.' },
      { q: 'At what age should I start breast self-exams?', a: 'Breast self-awareness can begin in the late teens and twenties. Structured monthly BSE is most often discussed starting in the 20s, but the priority at any age is to know what is normal for you and to act on changes. Formal screening mammography recommendations vary by guideline body and start between ages 40 and 50 for average-risk women.' },
      { q: 'Are breast self-exams recommended anymore?', a: 'Major U.S. guideline bodies&mdash;including the USPSTF and the American Cancer Society&mdash;do not require structured BSE. USPSTF gives BSE a "D" recommendation (against routine teaching) based on the absence of a demonstrated mortality benefit. ACS frames it as optional and emphasizes breast self-awareness. The honest summary: it is not required, but knowing your own body has low cost and reasonable value.' },
      { q: 'What is the difference between a breast self-exam and breast self-awareness?', a: 'A breast self-exam is a structured, step-by-step palpation and visual inspection performed on a regular schedule using a specific technique. Breast self-awareness is a broader, less formal practice of simply being familiar with how your breasts normally look and feel across your menstrual cycle, so you can notice changes. Most current guidelines emphasize self-awareness over a strict monthly ritual, but the underlying technique is the same.' }
    ],
    related: [
      { slug: 'mastectomy-bra-guide', title: 'Mastectomy Bra Guide', blurb: 'Pocketed bras, prosthesis fitting, and your first specialist visit.' },
      { slug: 'breast-self-exam', title: 'How to Do a Breast Self-Exam', blurb: 'You are reading this article.' },
      { slug: 'pocketed-bras-guide', title: 'Pocketed Bras Guide', blurb: 'How mastectomy bra pockets work and who needs one.' }
    ]
  }
];

module.exports = { HUB, ARTICLES };
