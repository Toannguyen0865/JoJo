import React from 'react'
import { useLang } from '../LangContext'
import LanguageDropdown from './LanguageDropdown'
import { Moon, Sun } from 'lucide-react'

export default function Header({ isLightMode, toggleTheme, selectedPart, onSelectPart }) {
  const { t } = useLang();

  return (
    <header className="site-header d-flex flex-column align-items-center py-4 mb-4">
      <div className="w-100 d-flex justify-content-end align-items-center px-3 gap-2 mb-3">
          <button 
            className="btn theme-toggle-btn p-0"
            onClick={toggleTheme}
            title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--gold)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <LanguageDropdown />
        </div>
        <div className="part-tabs-container mb-3 d-flex flex-wrap justify-content-center gap-2">
          {[1, 2, 3, 4, 5, 6].map(p => (
            <div 
              key={p}
              className={`part-tab ${selectedPart === p ? 'active' : ''}`}
              onClick={() => onSelectPart(p)}
              title={t(`tab${p}`)}
            >
              {t(`tab${p}`)}
            </div>
          ))}
        </div>
        <div 
          className="part-subtitle-display mb-3"
          style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: 'var(--gold)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textAlign: 'center'
          }}
        >
          {t(`part${selectedPart}`)}
        </div>
        <h1 className="site-title mb-2" dangerouslySetInnerHTML={{ __html: t('title') }}></h1>
        <p className="site-subtitle mb-0">{t('subtitle')}</p>
    </header>
  )
}
