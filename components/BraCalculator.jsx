'use client';
import { useState } from 'react';
import Link from 'next/link';

const CUP_ORDER = ['AA', 'A', 'B', 'C', 'D', 'DD/E', 'DDD/F', 'G', 'H', 'I', 'J', 'K'];
const CUP_DIFFS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

function getSisterSizes(band, cup) {
  const idx = CUP_ORDER.indexOf(cup);
  if (idx === -1) return [];
  const sisters = [];
  if (idx > 0 && band + 2 <= 54) {
    sisters.push({ size: `${band + 2}${CUP_ORDER[idx - 1]}`, label: 'Up one band' });
  }
  if (idx < CUP_ORDER.length - 1 && band - 2 >= 28) {
    sisters.push({ size: `${band - 2}${CUP_ORDER[idx + 1]}`, label: 'Down one band' });
  }
  return sisters;
}

function convertToInches(value, unit) {
  return unit === 'cm' ? value / 2.54 : value;
}

export default function BraCalculator({ embedded = false }) {
  const [underbust, setUnderbust] = useState('');
  const [bust, setBust] = useState('');
  const [unit, setUnit] = useState('inches');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculate = (e) => {
    e.preventDefault();
    setError('');
    const ub = parseFloat(underbust);
    const bt = parseFloat(bust);
    if (!ub || !bt || ub <= 0 || bt <= 0) {
      setError('Please enter valid measurements.');
      return;
    }
    const ubInches = convertToInches(ub, unit);
    const btInches = convertToInches(bt, unit);
    let band = Math.round(ubInches);
    if (ubInches - band >= 0.5) band++;
    if (band % 2 !== 0) band = Math.max(28, band - 1);
    if (band > 54) band = 54;
    const diff = btInches - band;

    let cupIdx = 0;
    for (let i = CUP_DIFFS.length - 1; i >= 0; i--) {
      if (diff >= CUP_DIFFS[i]) { cupIdx = i; break; }
    }

    const cup = CUP_ORDER[cupIdx] || 'AA';
    const sisters = getSisterSizes(band, cup);

    setResult({ band, cup, diff, sisters });
  };

  const reset = () => {
    setUnderbust('');
    setBust('');
    setResult(null);
    setError('');
  };

  return (
    <div className={`bra-calculator ${embedded ? 'embedded' : ''}`}>
      {!embedded && (
        <div className="calc-header">
          <h1>Bra Size Calculator</h1>
          <p className="calc-subtitle">
            Measure your band and bust at home to find your accurate bra size across US, UK, EU, FR, and AU sizing systems.
          </p>
        </div>
      )}

      <form onSubmit={calculate} className="calc-form">
        <div className="calc-fields">
          <div className="calc-field">
            <label htmlFor="underbust">Underbust (Band Size)</label>
            <div className="input-with-tip">
              <input
                id="underbust"
                type="number"
                step="0.1"
                min="20"
                max="60"
                placeholder={unit === 'inches' ? 'e.g. 32' : 'e.g. 81'}
                value={underbust}
                onChange={(e) => setUnderbust(e.target.value)}
                required
              />
              <button type="button" className="measure-tip" title="How to measure underbust">
                ?
              </button>
            </div>
            <p className="field-hint">Measure snugly around your ribcage, directly under your breasts.</p>
          </div>

          <div className="calc-field">
            <label htmlFor="bust">Bust (Fullest Part)</label>
            <div className="input-with-tip">
              <input
                id="bust"
                type="number"
                step="0.1"
                min="20"
                max="70"
                placeholder={unit === 'inches' ? 'e.g. 36' : 'e.g. 91'}
                value={bust}
                onChange={(e) => setBust(e.target.value)}
                required
              />
              <button type="button" className="measure-tip" title="How to measure bust">
                ?
              </button>
            </div>
            <p className="field-hint">Measure around the fullest part of your bust, keeping the tape parallel to the floor.</p>
          </div>

          <div className="calc-field">
            <label htmlFor="unit">Unit</label>
            <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="inches">Inches</option>
              <option value="cm">Centimeters</option>
            </select>
          </div>
        </div>

        {error && <p className="calc-error">{error}</p>}

        <div className="calc-actions">
          <button type="submit" className="btn-primary">
            {result ? 'Re-calculate' : 'Calculate My Bra Size'}
          </button>
          {result && (
            <button type="button" onClick={reset} className="btn-secondary">
              Reset
            </button>
          )}
        </div>
      </form>

      {result && (
        <div className="calc-result">
          <div className="result-badge">
            <span className="result-size">{result.band}{result.cup}</span>
            <span className="result-label">Your Bra Size</span>
          </div>

          <div className="result-detail">
            <p>Bust minus Underbust: <strong>{result.diff.toFixed(1)} inches</strong> ({result.cup})</p>
          </div>

          {result.sisters.length > 0 && (
            <div className="sister-sizes">
              <h3>Sister Sizes</h3>
              <div className="sister-grid">
                {result.sisters.map((s, i) => (
                  <div key={i} className="sister-item">
                    <span className="sister-size">{s.size}</span>
                    <span className="sister-label">{s.label}</span>
                  </div>
                ))}
              </div>
              <p className="sister-hint">
                Sister sizes have the same cup volume but different band sizes. If the band feels too tight, try the larger band sister size.
              </p>
            </div>
          )}

          <div className="result-links">
            <Link href={`/bra-size-guide/${result.band}${result.cup.toLowerCase()}/`} className="btn-link">
              View {result.band}{result.cup} Size Guide &rarr;
            </Link>
            <Link href="/how-to-measure-bra-size/" className="btn-link-secondary">
              Learn How to Measure &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}