import { useState } from 'react';

/**
 * ExpandableSpecText component for long product descriptions and specification strings.
 * - Shows limited text initially with CSS line-clamping (no awkward word cutting).
 * - Short text displays normally without any toggle button.
 * - Genuinely long text displays a prominent "Read More" button.
 * - Expanding reveals the full text and switches button to "Read Less".
 * - Clicking "Read Less" collapses the text back.
 * - Calling e.stopPropagation() ensures parent row selection isn't triggered.
 */
export default function ExpandableSpecText({
  text,
  maxChars = 80,
  clampLines = 2,
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Genuine long text check
  const isLong = trimmed.length > maxChars;

  if (!isLong) {
    return (
      <div className={`spec-text-simple ${className}`}>
        {trimmed}
      </div>
    );
  }

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`spec-text-expandable-wrap ${isExpanded ? 'expanded' : 'collapsed'} ${className}`}>
      <div
        className={`spec-text-content ${isExpanded ? 'is-expanded' : 'is-clamped'}`}
        style={!isExpanded ? { WebkitLineClamp: clampLines } : undefined}
      >
        {trimmed}
      </div>
      <button
        type="button"
        className="spec-read-toggle-btn"
        onClick={handleToggle}
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
}
