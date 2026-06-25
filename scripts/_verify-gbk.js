// Verify GBK byte mappings by encoding known UTF-8 chars and decoding as GBK.
const { TextDecoder } = require('util');

const gbk = new TextDecoder('gbk');

const cases = [
  { name: 'em-dash —', utf8: '\u2014', bytes: [0xE2, 0x80, 0x94] },
  { name: 'en-dash –', utf8: '\u2013', bytes: [0xE2, 0x80, 0x93] },
  { name: 'down-tri ▾', utf8: '\u25BE', bytes: [0xE2, 0x96, 0xBE] },
  { name: 'right-arrow →', utf8: '\u2192', bytes: [0xE2, 0x86, 0x92] },
  { name: 'times ×', utf8: '\u00D7', bytes: [0xC3, 0x97] },
  { name: 'copyright ©', utf8: '\u00A9', bytes: [0xC2, 0xA9] },
  { name: 'middle-dot ·', utf8: '\u00B7', bytes: [0xC2, 0xB7] },
  { name: 'minus −', utf8: '\u2212', bytes: [0xE2, 0x88, 0x92] },
];

for (const c of cases) {
  const buf = Buffer.from(c.bytes);
  const decoded = gbk.decode(buf);
  console.log(`${c.name}: UTF-8 bytes [${c.bytes.map(b => b.toString(16)).join(' ')}] → GBK decode = ${JSON.stringify(decoded)} (chars: ${[...decoded].map(ch => 'U+' + ch.codePointAt(0).toString(16)).join(' ')})`);
}

// Also test: en-dash followed by ASCII letter
console.log('\n--- en-dash + letter combos ---');
const combos = [
  { name: '–D', bytes: [0xE2, 0x80, 0x93, 0x44] },
  { name: '–G', bytes: [0xE2, 0x80, 0x93, 0x47] },
  { name: '–B', bytes: [0xE2, 0x80, 0x93, 0x42] },
  { name: '–C', bytes: [0xE2, 0x80, 0x93, 0x43] },
];
for (const c of combos) {
  const buf = Buffer.from(c.bytes);
  const decoded = gbk.decode(buf);
  console.log(`${c.name}: bytes [${c.bytes.map(b => b.toString(16)).join(' ')}] → GBK = ${JSON.stringify(decoded)} (${[...decoded].map(ch => 'U+' + ch.codePointAt(0).toString(16)).join(' ')})`);
}

// Test em-dash + space (typical case)
console.log('\n--- em-dash + space/letter ---');
const spaceCombos = [
  { name: '— riding', bytes: [0xE2, 0x80, 0x94, 0x20, 0x72] },
  { name: '—riding', bytes: [0xE2, 0x80, 0x94, 0x72] },
  { name: '— 36', bytes: [0xE2, 0x80, 0x94, 0x20, 0x33] },
];
for (const c of spaceCombos) {
  const buf = Buffer.from(c.bytes);
  const decoded = gbk.decode(buf);
  console.log(`${c.name}: → GBK = ${JSON.stringify(decoded)} (${[...decoded].map(ch => 'U+' + ch.codePointAt(0).toString(16)).join(' ')})`);
}
