export default function AffiliateLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="nofollow noopener noreferrer" className="affiliate-link">
      {children}
    </a>
  );
}