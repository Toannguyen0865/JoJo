import { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CharacterGrid from './components/CharacterGrid'
import Pagination from './components/Pagination'
import BackToTop from './components/BackToTop'
import { useLang } from './LangContext'
import { AlertCircle, Copyright } from 'lucide-react'

const CharacterModal = lazy(() => import('./components/CharacterModal'))

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
  const [filters,            setFilters]            = useState({})
  const gridRef = useRef(null)

  // ── Fetch ──────────────────────────────────────────
  const fetchCharacters = useCallback(async () => {
    setStatus('loading')
    try {
      const dbModule = await import('./data/database.json');
      const db = dbModule.default || dbModule;
      
      const list = db.characters.map(c => ({
        id: c.id,
        name: c.name[lang] || c.name.en,
        url: c.url,
        image: c.image,
        parts: c.parts,
        order: c.order,
        partImages: c.partImages,
        details: c.details
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
    let filtered = allCharacters.filter(c => {
      const matchesPart = c.parts && c.parts.includes(selectedPart);
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || (c.details?.info?.en?.Alias?.toLowerCase() || '').includes(q);
      
      let matchesType = true;
      if (filters.type && filters.type.length > 0) {
         // Determine character type
         const isStandUser = !!(c.details?.info?.en?.Stand);
         
         const hamonUsers = ['Jonathan_Joestar', 'Will_Anthonio_Zeppeli', 'Joseph_Joestar', 'Caesar_Anthonio_Zeppeli', 'Lisa_Lisa', 'Loggins', 'Messina', 'Straizo', 'Tonpetty', 'Dire', 'Mario_Zeppeli'];
         const pillarMen = ['Kars', 'Esidisi', 'Wamuu', 'Santana'];
         const vampires = ['Dio_Brando', 'DIO', 'Straizo', 'Vanilla_Ice', 'Nukesaku', 'Wired_Beck', 'Jack_the_Ripper', 'Wang_Chan', 'Bruford', 'Tarkus'];

         const species = (c.details?.info?.en?.Species || '').toLowerCase();
         const isVampire = species.includes('vampire') || vampires.includes(c.id);
         const isPillarMan = species.includes('pillar man') || species.includes('pillar men') || pillarMen.includes(c.id);
         const isHamon = species.includes('hamon') || species.includes('ripple') || (c.details?.info?.en?.Affiliation || '').toLowerCase().includes('hamon') || hamonUsers.includes(c.id);
         
         matchesType = filters.type.some(t => {
            if (t === 'Stand User') return isStandUser;
            if (t === 'Vampire') return isVampire;
            if (t === 'Pillar Man') return isPillarMan;
            if (t === 'Hamon User') return isHamon;
            return false;
         });
      }

      let matchesStatus = true;
      if (filters.status && filters.status.length > 0) {
         const statusTxt = (c.details?.info?.en?.Status || '').toLowerCase();
         matchesStatus = filters.status.some(st => {
            if (st === 'Deceased') return statusTxt.includes('deceased') || statusTxt.includes('dead');
            if (st === 'Alive') return statusTxt.includes('alive');
            return false;
         });
      }

      return matchesPart && matchesQuery && matchesType && matchesStatus;
    });

    filtered = filtered.map(c => {
      if (c.partImages && c.partImages[selectedPart]) {
        return { ...c, image: c.partImages[selectedPart] };
      }
      return c;
    });

    // Sort characters by their intended order in the selected part
    filtered.sort((a, b) => {
      const orderA = (a.order && a.order[selectedPart] !== undefined) ? a.order[selectedPart] : 9999;
      const orderB = (b.order && b.order[selectedPart] !== undefined) ? b.order[selectedPart] : 9999;
      return orderA - orderB;
    });

    setFilteredCharacters(filtered)
    setCurrentPage(1)
  }, [allCharacters, selectedPart, searchQuery, filters])

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
        onSelectPart={setSelectedPart}
      />

      <SearchBar 
        onSearch={handleSearch} 
        onSelectChar={setSelectedChar}
        allCharacters={allCharacters}
        count={filteredCharacters.length}
        currentPage={safePage}
        totalPages={totalPages}
        filters={filters}
        setFilters={setFilters}
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

      {/* Content Area */}
      <div className="container-fluid px-3 px-md-4 pb-3">
        <div className="row">
          {/* Main Grid */}
          <div className="col-12">
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
            {status === 'ok' && filteredCharacters.length > 0 && (
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Suspense fallback={null}>
        <CharacterModal
          char={selectedChar}
          allCharacters={allCharacters}
          onSelectChar={setSelectedChar}
          onClose={() => setSelectedChar(null)}
        />
      </Suspense>

      {/* Footer */}
      <footer className="app-footer">
        {t('footerText').split('\n\n').map((block, index) => (
          <p 
            key={index} 
            className={index === 0 ? "footer-copyright" : "footer-disclaimer"}
          >
            {index === 0 && (
              <Copyright 
                size={18} 
                strokeWidth={2.5} 
                style={{ verticalAlign: 'text-bottom', marginRight: '6px', paddingBottom: '1px' }} 
              />
            )}
            {block.replace(/©\s*/, '')}
          </p>
        ))}
      </footer>

      {/* Back to Top */}
      <BackToTop />
    </>
  )
}
