import CharacterCard from './CharacterCard'

export default function CharacterGrid({ characters, onSelect }) {
  if (characters.length === 0) return null

  return (
    <div className="container-fluid px-3 px-md-4 pb-4" style={{ position: 'relative', zIndex: 10 }}>
      <div className="row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 row-cols-xl-7 g-2 g-md-3">
        {characters.map((char, i) => (
          <CharacterCard
            key={`${char.name}-${i}`}
            char={char}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
