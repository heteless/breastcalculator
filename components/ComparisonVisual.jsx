export default function ComparisonVisual({ cup1, cup2 }) {
  const cupSizes = { B: 15, C: 22, D: 30, DD: 38, DDD: 45 };
  const size1 = cupSizes[cup1] || 20;
  const size2 = cupSizes[cup2] || 30;
  const maxSize = Math.max(size1, size2);

  // Adaptive viewBox so the largest cup is never clipped at the bottom.
  // Reserve 10px below the ellipse for the label, 10px on top for the top of the cup.
  const vbx = 100;
  const vby = Math.max(120, 10 + maxSize * 2 + 25); // top padding + max ellipse height + bottom label band
  const ellipseCy = 10 + maxSize; // center of the largest ellipse (top of label band ~ 15)
  const cup1Cy = ellipseCy + (maxSize - size1) / 2;
  const cup2Cy = ellipseCy + (maxSize - size2) / 2;
  const labelY = ellipseCy + maxSize + 10;

  return (
    <div className="comparison-visual" aria-label={`Visual comparison of ${cup1} cup vs ${cup2} cup`}>
      <div className="comparison-row">
        <div className="comparison-item">
          <svg viewBox={`0 0 ${vbx} ${vby}`} className="cup-svg" role="img" aria-label={`${cup1} cup illustration`}>
            <defs>
              <linearGradient id={`grad-${cup1}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f4e3d7" />
                <stop offset="100%" stopColor="#dcb4a5" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy={cup1Cy} rx={size1 * 1.5} ry={size1} fill={`url(#grad-${cup1})`} opacity="0.85" />
            <text x="50" y={labelY} textAnchor="middle" fill="#333" fontSize="10" fontWeight="600">{cup1} Cup</text>
          </svg>
          <span className="cup-label">{cup1} Cup</span>
        </div>

        <div className="comparison-vs">vs</div>

        <div className="comparison-item">
          <svg viewBox={`0 0 ${vbx} ${vby}`} className="cup-svg" role="img" aria-label={`${cup2} cup illustration`}>
            <defs>
              <linearGradient id={`grad-${cup2}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dcb4a5" />
                <stop offset="100%" stopColor="#c49585" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy={cup2Cy} rx={size2 * 1.5} ry={size2} fill={`url(#grad-${cup2})`} opacity="0.85" />
            <text x="50" y={labelY} textAnchor="middle" fill="#333" fontSize="10" fontWeight="600">{cup2} Cup</text>
          </svg>
          <span className="cup-label">{cup2} Cup</span>
        </div>
      </div>

      <div className="comparison-scale">
        <div className="scale-bar">
          <div
            className="scale-fill scale-1"
            style={{ width: `${(size1 / maxSize) * 50}%` }}
          />
          <div
            className="scale-fill scale-2"
            style={{ width: `${(size2 / maxSize) * 50}%` }}
          />
        </div>
        <div className="scale-labels">
          <span>{cup1}</span>
          <span>{cup2}</span>
        </div>
      </div>
    </div>
  );
}
