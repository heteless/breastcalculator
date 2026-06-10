/**
 * Unit tests for Bra Size Calculator core module.
 * Run with: node scripts/test-calculator.js
 * Exits with code 0 on success, 1 on failure.
 */
'use strict';

var path = require('path');
var BC = require(path.join(__dirname, '..', 'assets', 'bra-calculator.js'));

// --- Minimal test harness ----------------------------------------------

var stats = { passed: 0, failed: 0, suites: 0 };
var currentSuite = '';
var failures = [];

function suite(name, fn) {
  currentSuite = name;
  stats.suites++;
  console.log('\n  ' + name);
  try {
    fn();
  } catch (e) {
    stats.failed++;
    failures.push({ suite: name, test: '<suite threw>', error: e });
    console.log('    \u2717 suite threw: ' + e.message);
  }
}

function test(name, fn) {
  try {
    fn();
    stats.passed++;
    console.log('    \u2713 ' + name);
  } catch (e) {
    stats.failed++;
    failures.push({ suite: currentSuite, test: name, error: e });
    console.log('    \u2717 ' + name + ' \u2014 ' + e.message);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}
function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error((msg || 'assertEqual') + ': expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
  }
}
function assertClose(actual, expected, eps, msg) {
  if (Math.abs(actual - expected) > (eps || 0.01)) {
    throw new Error((msg || 'assertClose') + ': expected ' + expected + ' \u00b1 ' + (eps || 0.01) + ', got ' + actual);
  }
}
function assertThrows(fn, msg) {
  var threw = false;
  try { fn(); } catch (e) { threw = true; }
  if (!threw) throw new Error(msg || 'expected function to throw');
}

// --- Tests --------------------------------------------------------------

suite('convertToInches', function() {
  test('inch is identity', function() {
    assertEqual(BC.convertToInches(32, 'inch'), 32);
  });
  test('cm converts correctly', function() {
    assertClose(BC.convertToInches(81, 'cm'), 31.89, 0.01);
  });
  test('mm converts correctly', function() {
    assertClose(BC.convertToInches(813, 'mm'), 32.01, 0.05);
  });
  test('zero returns zero', function() {
    assertEqual(BC.convertToInches(0, 'inch'), 0);
  });
  test('null returns NaN', function() {
    assert(isNaN(BC.convertToInches(null, 'inch')));
  });
  test('invalid unit returns NaN', function() {
    assert(isNaN(BC.convertToInches(32, 'furlong')));
  });
});

suite('roundBand', function() {
  test('rounds up to even', function() {
    assertEqual(BC.roundBand(31), 32);
    assertEqual(BC.roundBand(33), 34);
  });
  test('keeps even', function() {
    assertEqual(BC.roundBand(32), 32);
    assertEqual(BC.roundBand(34), 34);
  });
  test('clamps to minimum 28', function() {
    assertEqual(BC.roundBand(20), 28);
    assertEqual(BC.roundBand(25), 28);
  });
  test('clamps to maximum 50', function() {
    assertEqual(BC.roundBand(55), 50);
    assertEqual(BC.roundBand(60), 50);
  });
  test('exact boundaries', function() {
    assertEqual(BC.roundBand(28), 28);
    assertEqual(BC.roundBand(50), 50);
  });
});

suite('getCupLetter / getCupIndex', function() {
  test('maps valid indices', function() {
    assertEqual(BC.getCupLetter(0), 'AA');
    assertEqual(BC.getCupLetter(1), 'A');
    assertEqual(BC.getCupLetter(5), 'DD');
    assertEqual(BC.getCupLetter(11), 'K');
  });
  test('clamps to first on negative', function() {
    assertEqual(BC.getCupLetter(-1), 'AA');
    assertEqual(BC.getCupLetter(-100), 'AA');
  });
  test('clamps to last on overflow', function() {
    assertEqual(BC.getCupLetter(99), 'K');
  });
  test('getCupIndex round-trips', function() {
    for (var i = 0; i < BC.CUP_SIZES.length; i++) {
      assertEqual(BC.getCupIndex(BC.CUP_SIZES[i]), i);
    }
  });
  test('getCupIndex unknown returns 0', function() {
    assertEqual(BC.getCupIndex('XYZ'), 0);
  });
});

suite('calculateBraSize', function() {
  test('typical 32 band, B cup', function() {
    var r = BC.calculateBraSize(32, 34);
    assertEqual(r.bandSize, 32);
    assertEqual(r.cupLetter, 'B');
    assertEqual(r.us, '32B');
    assertEqual(r.uk, '32B');
  });
  test('typical 34C', function() {
    var r = BC.calculateBraSize(34, 37);
    assertEqual(r.bandSize, 34);
    assertEqual(r.cupLetter, 'C');
    assertEqual(r.us, '34C');
  });
  test('UK DDD maps to E', function() {
    var r = BC.calculateBraSize(36, 42);
    // 42 - 36 = 6 => index 6 => DDD => UK E
    assertEqual(r.cupLetter, 'DDD');
    assertEqual(r.uk, '36E');
  });
  test('EU band rounds to 5cm', function() {
    var r = BC.calculateBraSize(34, 36);
    // 34 * 2.54 = 86.36, /5 = 17.27, round = 17, *5 = 85
    assertEqual(r.eu, '85B');
  });
  test('FR band is EU + 15', function() {
    var r = BC.calculateBraSize(34, 36);
    assertEqual(r.fr, '100B');
  });
  test('AU band is US - 22', function() {
    var r = BC.calculateBraSize(34, 36);
    assertEqual(r.au, '12B');
  });
  test('India uses same band as US', function() {
    var r = BC.calculateBraSize(34, 36);
    assertEqual(r.india, '34B');
  });
  test('band rounds up when odd', function() {
    var r = BC.calculateBraSize(33, 35);
    assertEqual(r.bandSize, 34);
  });
  test('negative diff clamps to AA', function() {
    var r = BC.calculateBraSize(40, 38);
    assertEqual(r.cupLetter, 'AA');
  });
  test('huge diff clamps to K', function() {
    var r = BC.calculateBraSize(28, 50);
    assertEqual(r.cupLetter, 'K');
  });
  test('result includes cupDiff as string', function() {
    var r = BC.calculateBraSize(34, 36);
    assertEqual(r.cupDiff, '2.0');
  });
});

suite('getSisterSizes', function() {
  test('returns 5 sister sizes for 34C', function() {
    var sisters = BC.getSisterSizes(34, 'C');
    assertEqual(sisters.length, 5);
    assertEqual(sisters[2].label, '34C');
    assertEqual(sisters[2].primary, true);
  });
  test('sister sizes go up band, down cup', function() {
    var sisters = BC.getSisterSizes(34, 'C');
    assertEqual(sisters[3].label, '36B');
    assertEqual(sisters[1].label, '32D');
  });
  test('clamps at band minimum 28', function() {
    var sisters = BC.getSisterSizes(30, 'A');
    // 30 - 4 = 26 (clamped)
    var bands = sisters.map(function(s) { return s.band; });
    assert(bands.every(function(b) { return b >= 28; }));
  });
  test('clamps at band maximum 50', function() {
    var sisters = BC.getSisterSizes(48, 'DDD');
    var bands = sisters.map(function(s) { return s.band; });
    assert(bands.every(function(b) { return b <= 50; }));
  });
  test('clamps at cup minimum AA', function() {
    var sisters = BC.getSisterSizes(34, 'A');
    var cups = sisters.map(function(s) { return s.cup; });
    assert(cups.every(function(c) { return BC.CUP_SIZES.indexOf(c) >= 0; }));
  });
  test('clamps at cup maximum K', function() {
    var sisters = BC.getSisterSizes(34, 'J');
    var cups = sisters.map(function(s) { return s.cup; });
    assert(cups.every(function(c) { return BC.CUP_SIZES.indexOf(c) >= 0; }));
  });
});

suite('applyBrandAdjustment', function() {
  test('standard brand returns unchanged band', function() {
    var r = BC.calculateBraSize(34, 36);
    var adj = BC.applyBrandAdjustment(r, 'standard');
    assertEqual(adj.bandSize, 34);
    assertEqual(adj.cupLetter, 'B');
  });
  test('victorias-secret runs small in band', function() {
    var r = BC.calculateBraSize(34, 36);
    var adj = BC.applyBrandAdjustment(r, 'victorias-secret');
    // bandOffset = -1, so 34 - 1 = 33, rounds up to 34. Then cupOffset -1
    assertEqual(adj.bandSize, 34);
    assertEqual(adj.cupLetter, 'A');
  });
  test('thirdlove runs slightly larger in cup', function() {
    var r = BC.calculateBraSize(34, 36);
    var adj = BC.applyBrandAdjustment(r, 'thirdlove');
    assertEqual(adj.cupLetter, 'C');
  });
  test('unknown brand falls back to standard', function() {
    var r = BC.calculateBraSize(34, 36);
    var adj = BC.applyBrandAdjustment(r, 'nonexistent-brand');
    assertEqual(adj.brand.name, 'Standard (most brands)');
  });
  test('result includes brand info', function() {
    var r = BC.calculateBraSize(34, 36);
    var adj = BC.applyBrandAdjustment(r, 'wacoal');
    assert(adj.brand && adj.brand.name);
    assert(adj.brand.note && adj.brand.note.length > 0);
  });
  test('clamps band after adjustment', function() {
    var r = BC.calculateBraSize(28, 30);
    var adj = BC.applyBrandAdjustment(r, 'spanx'); // -1 offset
    assert(adj.bandSize >= 28);
  });
});

suite('getBraRecommendation', function() {
  test('returns string for AA', function() {
    var t = BC.getBraRecommendation('AA', 34);
    assert(typeof t === 'string' && t.length > 0);
    assert(t.indexOf('34AA') >= 0);
  });
  test('returns string for B', function() {
    var t = BC.getBraRecommendation('B', 34);
    assert(t.indexOf('34B') >= 0);
  });
  test('returns string for DDD', function() {
    var t = BC.getBraRecommendation('DDD', 36);
    assert(t.indexOf('36DDD') >= 0);
  });
});

suite('estimateBreastVolume', function() {
  test('returns volume, category, note, diff', function() {
    var r = BC.estimateBreastVolume(34, 36);
    assert(typeof r.volume === 'number' && r.volume > 0);
    assert(typeof r.category === 'string');
    assert(typeof r.note === 'string' && r.note.length > 0);
    assertEqual(r.diff, '2.0');
  });
  test('small volume category', function() {
    var r = BC.estimateBreastVolume(34, 34.5);
    assertEqual(r.category, 'Small');
  });
  test('average volume category', function() {
    var r = BC.estimateBreastVolume(34, 36.5);
    assertEqual(r.category, 'Average');
  });
  test('full volume category', function() {
    var r = BC.estimateBreastVolume(34, 39);
    assertEqual(r.category, 'Full');
  });
  test('large volume category', function() {
    var r = BC.estimateBreastVolume(34, 42);
    assertEqual(r.category, 'Large');
  });
  test('very large volume category', function() {
    var r = BC.estimateBreastVolume(34, 45);
    assertEqual(r.category, 'Very Large');
  });
  test('band size affects volume', function() {
    var a = BC.estimateBreastVolume(30, 33);
    var b = BC.estimateBreastVolume(38, 41);
    assert(a.volume < b.volume);
  });
});

suite('validateMeasurement', function() {
  test('empty is invalid', function() {
    var v = BC.validateMeasurement('', 'underbust', 'inch');
    assertEqual(v.valid, false);
    assertEqual(v.code, 'empty');
  });
  test('non-numeric is invalid', function() {
    var v = BC.validateMeasurement('abc', 'underbust', 'inch');
    assertEqual(v.valid, false);
    assertEqual(v.code, 'nan');
  });
  test('zero is invalid', function() {
    var v = BC.validateMeasurement(0, 'underbust', 'inch');
    assertEqual(v.valid, false);
  });
  test('negative is invalid', function() {
    var v = BC.validateMeasurement(-5, 'underbust', 'inch');
    assertEqual(v.valid, false);
  });
  test('below range is invalid', function() {
    var v = BC.validateMeasurement(15, 'underbust', 'inch');
    assertEqual(v.valid, false);
    assertEqual(v.code, 'too-small');
    assert(typeof v.suggestion === 'string');
  });
  test('above range is invalid', function() {
    var v = BC.validateMeasurement(80, 'bust', 'inch');
    assertEqual(v.valid, false);
    assertEqual(v.code, 'too-large');
  });
  test('valid inch underbust', function() {
    var v = BC.validateMeasurement(32, 'underbust', 'inch');
    assertEqual(v.valid, true);
  });
  test('valid cm bust', function() {
    var v = BC.validateMeasurement(90, 'bust', 'cm');
    assertEqual(v.valid, true);
  });
  test('valid mm underbust', function() {
    var v = BC.validateMeasurement(813, 'underbust', 'mm');
    assertEqual(v.valid, true);
  });
  test('unknown unit is invalid', function() {
    var v = BC.validateMeasurement(32, 'underbust', 'parsec');
    assertEqual(v.valid, false);
  });
});

suite('validatePair', function() {
  test('bust smaller than underbust is invalid', function() {
    var v = BC.validatePair(34, 32);
    assertEqual(v.valid, false);
    assertEqual(v.code, 'bust-smaller');
  });
  test('normal pair is valid', function() {
    var v = BC.validatePair(32, 34);
    assertEqual(v.valid, true);
  });
  test('huge difference is invalid', function() {
    var v = BC.validatePair(28, 45);
    assertEqual(v.valid, false);
    assertEqual(v.code, 'diff-too-large');
    assert(typeof v.suggestion === 'string');
  });
  test('equal values are valid', function() {
    var v = BC.validatePair(34, 34);
    assertEqual(v.valid, true);
  });
  test('boundary at diff 12', function() {
    var v = BC.validatePair(28, 40);
    assertEqual(v.valid, true); // exactly 12
  });
  test('just over diff 12 invalid', function() {
    var v = BC.validatePair(28, 40.5);
    assertEqual(v.valid, false);
  });
});

suite('formatNumber', function() {
  test('formats to 1 decimal by default', function() {
    assertEqual(BC.formatNumber(32.456), '32.5');
  });
  test('formats to specified decimals', function() {
    assertEqual(BC.formatNumber(32.456, 2), '32.46');
  });
  test('null returns dash', function() {
    assertEqual(BC.formatNumber(null), '\u2014');
  });
  test('NaN returns dash', function() {
    assertEqual(BC.formatNumber(NaN), '\u2014');
  });
  test('zero formats correctly', function() {
    assertEqual(BC.formatNumber(0), '0.0');
  });
});

suite('BRAND_DATABASE', function() {
  test('contains standard brand', function() {
    assert(BC.BRAND_DATABASE.standard);
    assert(BC.BRAND_DATABASE.standard.name);
  });
  test('all entries have name, bandOffset, cupOffset, note', function() {
    var keys = Object.keys(BC.BRAND_DATABASE);
    for (var i = 0; i < keys.length; i++) {
      var b = BC.BRAND_DATABASE[keys[i]];
      assert(typeof b.name === 'string' && b.name.length > 0, 'name missing for ' + keys[i]);
      assert(typeof b.bandOffset === 'number', 'bandOffset missing for ' + keys[i]);
      assert(typeof b.cupOffset === 'number', 'cupOffset missing for ' + keys[i]);
      assert(typeof b.note === 'string' && b.note.length > 0, 'note missing for ' + keys[i]);
    }
  });
  test('has at least 10 brands', function() {
    assert(Object.keys(BC.BRAND_DATABASE).length >= 10);
  });
});

suite('Integration / end-to-end', function() {
  test('full pipeline: input -> validate -> convert -> calculate -> sister sizes', function() {
    var rawUb = 81; // cm
    var rawBust = 86; // cm
    var vUb = BC.validateMeasurement(rawUb, 'underbust', 'cm');
    var vB = BC.validateMeasurement(rawBust, 'bust', 'cm');
    assert(vUb.valid && vB.valid);
    var ubIn = BC.convertToInches(rawUb, 'cm');
    var bIn = BC.convertToInches(rawBust, 'cm');
    var pair = BC.validatePair(ubIn, bIn);
    assert(pair.valid);
    var size = BC.calculateBraSize(ubIn, bIn);
    assert(size.bandSize >= 28 && size.bandSize <= 50);
    assert(size.cupLetter);
    var sisters = BC.getSisterSizes(size.bandSize, size.cupLetter);
    assert(sisters.length >= 3);
    assert(sisters.some(function(s) { return s.primary; }));
  });

  test('end-to-end with brand adjustment', function() {
    var size = BC.calculateBraSize(34, 37);
    var adj = BC.applyBrandAdjustment(size, 'wacoal');
    assert(adj.us && adj.us.length > 1);
    assert(adj.brand);
  });

  test('end-to-end with volume estimate', function() {
    var size = BC.calculateBraSize(34, 37);
    var vol = BC.estimateBreastVolume(34, 37);
    assert(vol.volume > 0);
    assert(vol.category);
  });
});

suite('Edge cases & robustness', function() {
  test('calculateBraSize handles string inputs gracefully', function() {
    var r = BC.calculateBraSize('32', '34');
    assertEqual(r.bandSize, 32);
  });
  test('calculateBraSize returns null cup for NaN inputs', function() {
    var r = BC.calculateBraSize(NaN, NaN);
    assertEqual(r.bandSize, 28); // falls to min
  });
  test('sister sizes for edge band 28', function() {
    var s = BC.getSisterSizes(28, 'A');
    assert(s.length >= 1);
    assert(s.every(function(x) { return x.band >= 28; }));
  });
  test('sister sizes for edge band 50', function() {
    var s = BC.getSisterSizes(50, 'K');
    assert(s.length >= 1);
    assert(s.every(function(x) { return x.band <= 50; }));
  });
  test('brand adjustment does not produce invalid cup', function() {
    var r = BC.calculateBraSize(28, 30);
    var adj = BC.applyBrandAdjustment(r, 'victorias-secret');
    assert(BC.CUP_SIZES.indexOf(adj.cupLetter) >= 0);
  });
  test('roundBand with NaN returns minimum', function() {
    assertEqual(BC.roundBand(NaN), 28);
  });
  test('roundBand with null returns minimum', function() {
    assertEqual(BC.roundBand(null), 28);
  });
});

// --- Performance benchmark ----------------------------------------------

suite('Performance (<300ms target)', function() {
  test('1000 calculations complete under 300ms', function() {
    var start = process.hrtime.bigint();
    for (var i = 0; i < 1000; i++) {
      BC.calculateBraSize(28 + (i % 22), 28 + (i % 22) + 4);
      BC.getSisterSizes(34, 'C');
    }
    var elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    if (elapsed >= 300) {
      throw new Error('1000 calculations took ' + elapsed.toFixed(1) + 'ms (>= 300ms)');
    }
    console.log('      (' + elapsed.toFixed(1) + 'ms for 1000 iterations)');
  });

  test('single calculation under 1ms', function() {
    var start = process.hrtime.bigint();
    BC.calculateBraSize(34, 36);
    var elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    if (elapsed >= 1) {
      throw new Error('single calc took ' + elapsed.toFixed(3) + 'ms');
    }
  });
});

// --- Summary ------------------------------------------------------------

console.log('\n  --------------------------------------------------');
console.log('  Suites:  ' + stats.suites);
console.log('  Passed:  ' + stats.passed);
console.log('  Failed:  ' + stats.failed);
console.log('  Coverage estimate: ' + (stats.passed + stats.failed > 0
  ? Math.round(stats.passed / (stats.passed + stats.failed) * 100) : 0) + '% of test cases passing');
console.log('  --------------------------------------------------\n');

if (stats.failed > 0) {
  console.log('FAILURES:');
  failures.forEach(function(f) {
    console.log('  - [' + f.suite + '] ' + f.test + ': ' + f.error.message);
  });
  process.exit(1);
}

process.exit(0);
