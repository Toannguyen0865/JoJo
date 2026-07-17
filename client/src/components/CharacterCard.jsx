
export default function CharacterCard({ char, index, onSelect }) {
  const imageUrl = char.image
    ? (char.image.startsWith('/') ? char.image : `/api/proxy-image?url=${encodeURIComponent(char.image)}`)
    : null

  return (
    <div className="col">
      <div
        className="char-card h-100 d-flex flex-column"
        style={{ animationDelay: `${Math.min(index * 20, 400)}ms` }}
        onClick={() => onSelect(char)}
      >
        <div className="card-img-wrap">
          {imageUrl ? (
            <img
              src={imageUrl}
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
        <div className="card-body d-flex flex-column flex-grow-1">
          <div className="card-char-title">{char.name}</div>
          {char.parts && char.parts.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mt-auto pt-2">
              {char.parts.map(p => (
                <span key={p} className="badge-part-small">Part {p}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
