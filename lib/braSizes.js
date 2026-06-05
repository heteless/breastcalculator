const ALL_BRA_SIZES = [
  '32A', '32B', '32C', '32D', '32DD',
  '34A', '34B', '34C', '34D', '34DD',
  '36A', '36B', '36C', '36D', '36DD',
  '38B', '38C', '38D', '38DD',
  '40C', '40D',
];

function parseSize(size) {
  const match = size.match(/^(\d{2})([A-Z]+)$/);
  if (!match) return null;
  return { band: parseInt(match[1], 10), cup: match[2] };
}

function formatSize(band, cup) {
  return `${band}${cup}`;
}

function getSisterSizes(size) {
  const parsed = parseSize(size);
  if (!parsed) return [];
  const { band, cup } = parsed;
  const cupOrder = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'F', 'G', 'H'];
  const cupIdx = cupOrder.indexOf(cup);
  if (cupIdx === -1) return [];
  const sisters = [];
  if (cupIdx > 0 && band + 2 <= 54) {
    sisters.push({ size: formatSize(band + 2, cupOrder[cupIdx - 1]), direction: 'up-band' });
  }
  if (cupIdx < cupOrder.length - 1 && band - 2 >= 28) {
    sisters.push({ size: formatSize(band - 2, cupOrder[cupIdx + 1]), direction: 'down-band' });
  }
  return sisters;
}

function getAdjacentSizes(size) {
  const parsed = parseSize(size);
  if (!parsed) return [];
  const { band, cup } = parsed;
  const cupOrder = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'F', 'G', 'H'];
  const cupIdx = cupOrder.indexOf(cup);
  if (cupIdx === -1) return [];
  const adjacent = [];
  if (cupIdx > 0) adjacent.push({ size: formatSize(band, cupOrder[cupIdx - 1]), direction: 'smaller-cup' });
  if (cupIdx < cupOrder.length - 1) adjacent.push({ size: formatSize(band, cupOrder[cupIdx + 1]), direction: 'larger-cup' });
  return adjacent;
}

function getMeasurementRange(size) {
  const parsed = parseSize(size);
  if (!parsed) return { bust: '', underbust: '' };
  const { band, cup } = parsed;
  const cupInches = { A: 1, B: 2, C: 3, D: 4, DD: 5, DDD: 6 };
  const diff = cupInches[cup] || 0;
  return {
    underbust: `${band}" (${Math.round(band * 2.54)} cm)`,
    bust: `${Math.round(band + diff)}" (${Math.round((band + diff) * 2.54)} cm)`,
  };
}

const SIZE_DESCRIPTIONS = {
  '32A': { category: 'petite', volume: 'Small volume. Band fits a slim ribcage with a subtle bust curve.', analogy: 'Think of two small tangerines — delicate, proportional, and naturally subtle.', visualSimilar: 'This size is often seen on petite frames with a lean build and narrow shoulders.' },
  '32B': { category: 'petite', volume: 'Compact volume with proportional projection on a slim frame.', analogy: 'Think of two plums — small but distinctly present, sitting close to the chest wall.', visualSimilar: 'Common on slim, athletic builds. The bust appears compact and well-proportioned to the frame.' },
  '32C': { category: 'petite', volume: 'Noticeable volume on a slim ribcage. Looks fuller than a 34B due to the smaller band.', analogy: 'Think of two small oranges — rounded with noticeable projection from the chest.', visualSimilar: 'Creates a defined silhouette on a slim frame. Often appears more projected than expected.' },
  '32D': { category: 'petite', volume: 'Generous volume on a small band — often wrongly sized as 34B.', analogy: 'Think of two grapefruits — significantly projected relative to the small ribcage.', visualSimilar: 'Creates a dramatic hourglass effect on a slim frame. Support is essential to prevent strain.' },
  '32DD': { category: 'petite', volume: 'Significant projection on a small frame. Support is essential.', analogy: 'Think of two large grapefruits — very full, requiring structured support from the band and straps.', visualSimilar: 'Stands out noticeably on a slim frame. Proper band fit is crucial to distribute weight.' },
  '34A': { category: 'average', volume: 'Subtle volume on an average band. Comfortable in wireless styles.', analogy: 'Think of two small apples — gentle curves that suit soft cup and wireless bras.', visualSimilar: 'The bust blends smoothly with the torso on an average frame. Appears natural and balanced.' },
  '34B': { category: 'average', volume: 'One of the most common sizes. Proportional silhouette.', analogy: 'Think of two medium apples — a balanced, classic proportion that suits most clothing.', visualSimilar: 'A harmonious look where the bust complements the frame without dominating or disappearing.' },
  '34C': { category: 'average', volume: 'Balanced proportion. Works well with most bra styles.', analogy: 'Think of two large apples — a full, rounded shape that fills out tops nicely.', visualSimilar: 'Often considered the "balanced" size — neither small nor large on the frame.' },
  '34D': { category: 'average', volume: 'Full bust on an average frame. Full-coverage styles work best.', analogy: 'Think of two small grapefruits — substantial volume that needs reliable daily support.', visualSimilar: 'Clearly a full bust on an average frame. Attracts attention — support and lift are priorities.' },
  '34DD': { category: 'average', volume: 'Generous volume. Wide straps and structured cups recommended.', analogy: 'Think of two medium grapefruits — impressive volume requiring engineered support.', visualSimilar: 'A noticeably full bust on an average frame. Wide straps and full-coverage cups prevent discomfort.' },
  '36A': { category: 'average', volume: 'Subtle projection on a medium band. T-shirt bras fit well.', analogy: 'Think of two small apples on a slightly broader frame — subtle but shapely.', visualSimilar: 'The broader band distributes the subtle projection evenly across the chest.' },
  '36B': { category: 'average', volume: 'Comfortable proportion. Versatile across bra styles.', analogy: 'Think of two medium apples on a medium frame — easy, natural, and versatile.', visualSimilar: 'Appears well-proportioned on the frame, suiting a wide range of clothing and bra styles.' },
  '36C': { category: 'average', volume: 'Full-looking bust on a medium frame. Balconette styles flatter.', analogy: 'Think of two large apples — a full, rounded shape that feels substantial.', visualSimilar: 'Creates a full silhouette with noticeable cleavage in V-neck and balconette styles.' },
  '36D': { category: 'average', volume: 'Significant volume. Side panels and wider bands add comfort.', analogy: 'Think of two small grapefruits — a generous bust that benefits from side support and wider bands.', visualSimilar: 'A clearly defined full bust on a medium frame. Structured support enhances comfort and shape.' },
  '36DD': { category: 'average', volume: 'Substantial bust. Encapsulation sports bras are ideal.', analogy: 'Think of two grapefruits — a very full bust requiring encapsulation rather than compression support.', visualSimilar: 'A very full bust that dominates the upper body. Professional fitting ensures comfort and proper weight distribution.' },
  '38B': { category: 'full-figure', volume: 'Moderate projection on a fuller band. Comfort is key.', analogy: 'Think of two medium apples on a broader chest — soft, comfortable, and naturally proportioned.', visualSimilar: 'The bust appears balanced on the larger frame, with subtle, comfortable projection.' },
  '38C': { category: 'full-figure', volume: 'Noticeable bust on a larger frame. Wide wires improve fit.', analogy: 'Think of two large apples — a full but well-proportioned look on a broader frame.', visualSimilar: 'The bust feels present but not overwhelming. Wide-set wires and full bands ensure a comfortable fit.' },
  '38D': { category: 'full-figure', volume: 'Full bust with generous projection. Prioritize supportive design.', analogy: 'Think of two small grapefruits — a full, substantial bust that needs supportive engineering.', visualSimilar: 'Clearly a full bust on a broader frame. Support, side panels, and padded straps make daily wear comfortable.' },
  '38DD': { category: 'full-figure', volume: 'Significant volume. Look for reinforced cups and padded straps.', analogy: 'Think of two grapefruits — a very full bust requiring thoughtfully designed support.', visualSimilar: 'A very prominent bust on a full-figured frame. Engineering-grade support in band, straps, and cups is necessary.' },
  '40C': { category: 'full-figure', volume: 'Full bust on a larger band. Back-smoothing bras recommended.', analogy: 'Think of two large apples — a full, rounded shape on a broader frame with back-smoothing needs.', visualSimilar: 'The bust appears full and proportional. Look for bras that smooth the back and sides for a clean silhouette.' },
  '40D': { category: 'full-figure', volume: 'Generous projection on a full figure. Maximum-support styles.', analogy: 'Think of two small grapefruits — generous projection benefiting from maximum-support designs.', visualSimilar: 'A generously full bust on a full-figured frame. Prioritize wide, padded straps and reinforced bands for all-day comfort.' },
};

function getBraRecommendations(size, ptosis) {
  const parsed = parseSize(size);
  if (!parsed) return [];
  const { band, cup } = parsed;
  const cupOrder = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'F', 'G', 'H'];
  const cupIdx = cupOrder.indexOf(cup);
  const recs = [];

  if (cupIdx <= cupOrder.indexOf('C') && cupIdx >= cupOrder.indexOf('A')) {
    recs.push({ type: 'T-Shirt Bra', reason: 'Seamless, invisible under fitted tops.' });
    recs.push({ type: 'Plunge Bra', reason: 'Creates natural cleavage for lower necklines.' });
    recs.push({ type: 'Wireless Bra', reason: 'Comfortable all-day wear with sufficient support.' });
  } else if (cupIdx <= cupOrder.indexOf('DD') && cupIdx >= cupOrder.indexOf('C')) {
    recs.push({ type: 'Balconette Bra', reason: 'Lifts and shapes with a rounded silhouette.' });
    recs.push({ type: 'Full-Coverage Bra', reason: 'Encapsulates breast tissue, reducing spillage.' });
    recs.push({ type: 'Side-Support Bra', reason: 'Panels redirect tissue forward for a streamlined look.' });
  } else {
    recs.push({ type: 'Full-Coverage Bra', reason: 'Maximum encapsulation and lift.' });
    recs.push({ type: 'Sports Bra (High-Impact)', reason: 'Essential for exercise — minimizes bounce.' });
    recs.push({ type: 'Minimizer Bra', reason: 'Reduces projection by up to 1 inch for layering.' });
    recs.push({ type: 'Front-Close Bra', reason: 'Easier to put on; wide back for comfort.' });
  }

  return recs;
}

module.exports = {
  ALL_BRA_SIZES,
  parseSize,
  formatSize,
  getSisterSizes,
  getAdjacentSizes,
  getMeasurementRange,
  SIZE_DESCRIPTIONS,
  getBraRecommendations,
};