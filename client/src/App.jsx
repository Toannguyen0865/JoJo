import { useState, useEffect, useCallback, useRef } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CharacterGrid from './components/CharacterGrid'
import Pagination from './components/Pagination'
import CharacterModal from './components/CharacterModal'
import BackToTop from './components/BackToTop'
import { useLang } from './LangContext'
import { AlertCircle } from 'lucide-react'
import db from './data/database.json'

const PAGE_SIZE = 24

export default function App() {
  const { t, lang } = useLang();
  
  // Theme state
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('jojo-theme') === 'light'
  })
  const [selectedPart, setSelectedPart] = useState(() => {
    return parseInt(localStorage.getItem('jojo-part')) || 3
  })

  useEffect(() => {
    document.body.classList.toggle('light-mode', isLightMode)
    localStorage.setItem('jojo-theme', isLightMode ? 'light' : 'dark')
  }, [isLightMode])

  useEffect(() => {
    document.body.classList.forEach(cls => {
      if (cls.startsWith('theme-part-')) {
        document.body.classList.remove(cls);
      }
    });
    document.body.classList.add(`theme-part-${selectedPart}`);
    localStorage.setItem('jojo-part', selectedPart);
  }, [selectedPart]);

  const [allCharacters,      setAllCharacters]      = useState([])
  const [filteredCharacters, setFilteredCharacters] = useState([])
  const [currentPage,        setCurrentPage]        = useState(1)
  const [status,             setStatus]             = useState('loading') // 'loading' | 'error' | 'ok'
  const [selectedChar,       setSelectedChar]       = useState(null)
  const [searchQuery,        setSearchQuery]        = useState('')
  const gridRef = useRef(null)

  // ── Fetch ──────────────────────────────────────────
  const fetchCharacters = useCallback(() => {
    setStatus('loading')
    try {
      const list = db.characters.map(c => ({
        id: c.id,
        name: c.name[lang] || c.name.en,
        url: c.url,
        image: c.image,
        parts: c.parts,
        order: c.order
      }));
      setAllCharacters(list)
      setCurrentPage(1)
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }, [lang])

  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  // ── Search & Filter ─────────────────────────────────────────
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase()
    const filtered = allCharacters.filter(c => {
      const matchesPart = c.parts && c.parts.includes(selectedPart);
      const matchesQuery = !q || c.name.toLowerCase().includes(q);
      return matchesPart && matchesQuery;
    });

    // Sort characters by their intended order in the selected part
    filtered.sort((a, b) => {
      const orderA = (a.order && a.order[selectedPart] !== undefined) ? a.order[selectedPart] : 9999;
      const orderB = (b.order && b.order[selectedPart] !== undefined) ? b.order[selectedPart] : 9999;
      return orderA - orderB;
    });

    setFilteredCharacters(filtered)
    setCurrentPage(1)
  }, [allCharacters, selectedPart, searchQuery])

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  // ── Pagination ─────────────────────────────────────
  const totalPages  = Math.ceil(filteredCharacters.length / PAGE_SIZE)
  const safePage    = Math.min(currentPage, totalPages || 1)
  const pageItems   = filteredCharacters.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Render ─────────────────────────────────────────
  return (
    <>
      <Header 
        isLightMode={isLightMode} 
        toggleTheme={() => setIsLightMode(!isLightMode)} 
        selectedPart={selectedPart}
        onPartChange={() => setSelectedPart(prev => prev >= 6 ? 1 : prev + 1)}
      />

      <SearchBar
        onSearch={handleSearch}
        count={filteredCharacters.length}
        currentPage={safePage}
        totalPages={totalPages}
      />

      {/* Divider */}
      <div
        className="d-flex align-items-center gap-3 px-3 px-md-4 pb-3"
        style={{ position: 'relative', zIndex: 10 }}
      >
        <div className="divider-line" />
        <span className="divider-star">✦</span>
        <div className="divider-line" />
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div className="text-center py-5">
          <div className="spinner-gold mb-3 mx-auto"></div>
          <p className="loading-text">{t('loading')}</p>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="text-center py-5 px-3">
          <div className="error-icon mb-3" style={{ color: 'var(--gold)' }}>
            <AlertCircle size={48} />
          </div>
          <p className="error-text mb-3">{t('error')}</p>
          <button className="btn btn-gold-rect px-4" onClick={() => { setStatus('loading'); fetchCharacters(); }}>
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {status === 'ok' && filteredCharacters.length === 0 && (
        <div className="text-center py-5 px-3">
          <p className="empty-text mb-0">{t('noCharFound')}</p>
        </div>
      )}

      {/* Grid */}
      {status === 'ok' && filteredCharacters.length > 0 && (
        <div ref={gridRef}>
          <CharacterGrid characters={pageItems} onSelect={setSelectedChar} />
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal */}
      <CharacterModal
        char={selectedChar}
        onClose={() => setSelectedChar(null)}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p className="mb-0">{t('footerText')}</p>
      </footer>

      {/* Back to Top */}
      <BackToTop />
    </>
  )
}
