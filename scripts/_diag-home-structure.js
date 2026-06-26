// Look at full homepage structure and the .section / .hub-cards CSS rules.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');

console.log('=== .section CSS rules ===');
const sectionMatches = [...css.matchAll(/\.section(?:\s|[{,.>])/g)];
console.log('.section occurrences:', sectionMatches.length);

// Get the .section rule and related
const sectionRules = [...css.matchAll(/(^|\n)(section\.section[^{]*|\.section[^{]*)\{[^}]+\}/g)];
sectionRules.slice(0, 10).forEach(m => console.log(m[0].trim()));

console.log('\n=== section.section>... rules ===');
const nestedSection = [...css.matchAll(/section\.section>[^{}]+\{[^}]+\}/g)];
nestedSection.forEach(m => console.log(m[0].trim()));

console.log('\n=== .hub-cards CSS rules ===');
const hubRules = [...css.matchAll(/\.hub-cards[^{}]*\{[^}]+\}/g)];
hubRules.forEach(m => console.log(m[0].trim()));
if (hubRules.length === 0) console.log('NO .hub-cards CSS rules found! (using inline styles)');

console.log('\n=== .hub-card CSS rules ===');
const hubCardRules = [...css.matchAll(/\.hub-card[^{}]*\{[^}]+\}/g)];
hubCardRules.forEach(m => console.log(m[0].trim()));
if (hubCardRules.length === 0) console.log('NO .hub-card CSS rules found! (using inline styles)');

console.log('\n=== Full homepage structure outline ===');
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// Extract section structure
const sectionTags = [...home.matchAll(/<section[^>]*>/g)];
console.log('Total <section> tags:', sectionTags.length);
const sectionTexts = sectionTags.map(m => m[0].substring(0, 150));
sectionTexts.forEach((s, i) => console.log((i+1) + '. ' + s));

console.log('\n=== Hero section CSS ===');
const heroRules = [...css.matchAll(/\.hero(?:\s|[{,.])[^{]*\{[^}]+\}/g)];
heroRules.slice(0, 8).forEach(m => console.log(m[0].trim()));
