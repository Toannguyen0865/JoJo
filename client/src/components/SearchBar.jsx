import React from 'react'
import { useLang } from '../LangContext'
import { Search } from 'lucide-react'

export default function SearchBar({ onSearch, count, currentPage, totalPages }) {
  const { t } = useLang();

  return (
    <section className="container-fluid px-3 px-md-4 py-3" style={{ position: 'relative', zIndex: 10 }}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="search-wrapper flex-grow-1" style={{ maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control search-input"
            placeholder={t('searchPlaceholder')}
            autoComplete="off"
            onChange={e => onSearch(e.target.value)}
          />
          <div className="search-icon">
            <Search size={18} strokeWidth={2.5} />
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
