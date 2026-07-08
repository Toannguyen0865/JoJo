import { ExternalLink } from 'lucide-react';

export default function CharacterCard({ char, index, onSelect }) {
  const proxied = char.image
    ? `/api/proxy-image?url=${encodeURIComponent(char.image)}`
    : null

  return (
    <div className="col">
      <div
        className="char-card h-100"
        style={{ animationDelay: `${Math.min(index * 20, 400)}ms` }}
        onClick={() => onSelect(char)}
      >
        <div className="card-img-wrap">
          {proxied ? (
            <img
              src={proxied}
              alt={char.name}
              loading="lazy"
              onError={e => {
                e.target.parentElement.innerHTML = '<div class="card-no-img">⭐</div>'
              }}
            />
          ) : (
            <div className="card-no-img">⭐</div>
          )}
        </div>
        <div className="card-body">
          <div className="card-char-title">{char.name}</div>
          {char.url && (
            <a
              className="card-wiki-link d-flex align-items-center gap-1"
              style={{ width: 'fit-content' }}
              href={char.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
            >
              <span style={{ position: 'relative', top: '1px' }}>Wiki</span> <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
