import React, { useState, useRef, useEffect } from 'react'
import { useLang } from '../LangContext'
import { Search, Filter, X } from 'lucide-react'

export default function SearchBar({ onSearch, onSelectChar, allCharacters, count, currentPage, totalPages, filters, setFilters }) {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const wrapperRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
    
    if (val.trim().length > 0) {
      const q = val.trim().toLowerCase();
      const filtered = allCharacters
        .filter(c => c.name.toLowerCase().includes(q) || (c.details?.info?.en?.Alias?.toLowerCase() || '').includes(q))
        .slice(0, 8); // top 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (char) => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
    if (onSelectChar) onSelectChar(char);
  };

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const activeFiltersCount = (filters?.type?.length || 0) + (filters?.status?.length || 0);

  return (
    <section className="container-fluid px-3 px-md-4 py-3" style={{ position: 'relative', zIndex: 100 }}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '600px' }}>
          
          {/* Filter Dropdown */}
          <div className="position-relative order-2" ref={filterRef}>
            <button 
              className="btn d-flex align-items-center justify-content-center"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: showFilters || activeFiltersCount > 0 ? 'var(--gold)' : 'rgba(var(--surface-rgb), var(--glass-alpha))',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: showFilters || activeFiltersCount > 0 ? 'var(--bs-body-bg)' : 'var(--gold)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setShowFilters(!showFilters)}
              title="Filters"
            >
              <Filter size={20} />
              {activeFiltersCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {showFilters && (
              <div 
                className="filter-dropdown position-absolute mt-2 p-4 rounded-4 shadow-lg"
                style={{
                  top: '100%',
                  right: 0,
                  width: '280px',
                  background: 'rgba(var(--surface-rgb), var(--glass-alpha))',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)',
                  zIndex: 1010
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                  <h6 className="mb-0 fw-bold" style={{ color: 'var(--gold)' }}>{t('filtersTitle')}</h6>
                  {activeFiltersCount > 0 && (
                    <button className="btn btn-sm btn-link p-0 text-decoration-none" style={{ color: 'var(--text-muted)' }} onClick={() => setFilters({})}>{t('clearAll')}</button>
                  )}
                </div>
                
                {/* Types */}
                <div className="mb-3">
                  <h6 className="fw-semibold mb-2" style={{ fontSize: '0.9rem', color: 'var(--jojo-text)' }}>{t('filterType')}</h6>
                  {['Stand User', 'Hamon User', 'Vampire', 'Pillar Man'].map(type => (
                    <div className="form-check custom-checkbox mb-2" key={type}>
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`filter-${type}`}
                        checked={(filters?.type || []).includes(type)}
                        onChange={() => handleCheckboxChange('type', type)}
                        style={{ cursor: 'pointer', borderColor: 'var(--gold)' }}
                      />
                      <label className="form-check-label ms-2" htmlFor={`filter-${type}`} style={{ cursor: 'pointer', fontSize: '0.9rem', userSelect: 'none' }}>
                        {t(`type${type.replace(' ', '')}`)}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div>
                  <h6 className="fw-semibold mb-2" style={{ fontSize: '0.9rem', color: 'var(--jojo-text)' }}>{t('filterStatus')}</h6>
                  {['Alive', 'Deceased'].map(status => (
                    <div className="form-check custom-checkbox mb-2" key={status}>
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`filter-${status}`}
                        checked={(filters?.status || []).includes(status)}
                        onChange={() => handleCheckboxChange('status', status)}
                        style={{ cursor: 'pointer', borderColor: 'var(--gold)' }}
                      />
                      <label className="form-check-label ms-2" htmlFor={`filter-${status}`} style={{ cursor: 'pointer', fontSize: '0.9rem', userSelect: 'none' }}>
                        {t(`status${status}`)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="search-wrapper flex-grow-1 position-relative order-1" ref={wrapperRef}>
            <input
              type="text"
              className="form-control search-input"
              placeholder={t('searchPlaceholder')}
              autoComplete="off"
              value={query}
              onChange={handleInputChange}
              onFocus={() => { if(query.length > 0) setShowSuggestions(true); }}
              style={{
                padding: '12px 20px 12px 50px',
                borderRadius: '30px',
                border: '2px solid transparent',
                background: 'var(--surface2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                color: 'var(--bs-body-color)'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'}
            />
            <div className="search-icon" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', display: 'flex', alignItems: 'center' }}>
              <Search size={20} strokeWidth={2.5} />
            </div>
            
            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="autocomplete-dropdown shadow-lg rounded-3 overflow-hidden position-absolute w-100 mt-2" style={{ zIndex: 1000, background: 'rgba(var(--surface-rgb), var(--glass-alpha))', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--border)' }}>
                {suggestions.map(char => (
                  <div 
                    key={char.id} 
                    className="d-flex align-items-center p-2 autocomplete-item"
                    style={{ cursor: 'pointer', transition: 'background 0.2s', color: 'var(--text-color)' }}
                    onClick={() => handleSelect(char)}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className="avatar me-3" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--bs-secondary)'}}>
                      {char.image ? (
                        <img src={char.image.startsWith('/') ? char.image : `/api/proxy-image?url=${encodeURIComponent(char.image)}`} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'}/>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100 text-white">⭐</div>
                      )}
                    </div>
                    <div>
                      <div className="fw-bold">{char.name}</div>
                      {char.part && <small className="text-muted">Part {char.part}</small>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {count > 0 && (
          <div className="count-text">
            <span>{count}</span> {t('characters')}
            {totalPages > 1 && (
              <> · {t('page')} <span>{currentPage}</span>/<span>{totalPages}</span></>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
