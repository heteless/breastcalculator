// simplify-footer.js — replaces the complex footer in index.html with a minimal one
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const start = html.indexOf('<footer class="bg-[');
const end = html.indexOf('</footer>', start) + 9; // +9 for '</footer>'

if (start === -1) throw new Error('Footer start not found');

const newFooter = `<footer style="background:#fdf8f5;border-top:1px solid #e8ddd0;text-align:center;padding:48px 20px 32px;color:#5d4a3a;font-size:0.9rem;line-height:1.7">
        <div style="max-width:960px;margin:0 auto">
          <div style="font-size:1.2rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:6px;color:#4a3a2e">BREAST CALCULATOR</div>
          <p style="margin:0 auto 16px;max-width:400px;color:#6b5544">Free science-based bra fitting tools and breast health education.</p>
          <p style="margin:0 0 4px"><a href="mailto:contact@breastcalculator.com" style="color:#6b5544;text-decoration:underline">contact@breastcalculator.com</a></p>
          <p style="margin:0 0 16px;font-size:0.82rem;color:#8b7355">We typically respond within 1–2 business days.</p>
          <nav style="display:flex;justify-content:center;gap:24px;font-size:0.82rem;margin-bottom:20px;flex-wrap:wrap">
            <a href="/about/" style="color:#6b5544;text-decoration:underline">About</a>
            <a href="/contact/" style="color:#6b5544;text-decoration:underline">Contact</a>
            <a href="/privacy/" style="color:#6b5544;text-decoration:underline">Privacy Policy</a>
            <a href="/terms/" style="color:#6b5544;text-decoration:underline">Terms of Use</a>
          </nav>
          <p style="margin:0;font-size:0.78rem;color:#8b7355">&copy; 2026 Breast Calculator. This website is for informational purposes only and does not provide medical advice.</p>
        </div>
      </footer>`;

html = html.slice(0, start) + newFooter + html.slice(end);
fs.writeFileSync(file, html, 'utf8');
console.log('Footer simplified in index.html');
