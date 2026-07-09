import React from 'react'
import { useLang } from '../LangContext'
import LanguageDropdown from './LanguageDropdown'
import { Moon, Sun } from 'lucide-react'

export default function Header({ isLightMode, toggleTheme }) {
  const { t } = useLang();

  return (
    <header className="site-header">
      <div className="header-video-overlay"></div>
      
      <div className="header-content d-flex flex-column align-items-center py-4 mb-4">
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
        <div className="header-badge mb-3">{t('badge')}</div>
        <h1 className="site-title mb-2" dangerouslySetInnerHTML={{ __html: t('title') }}></h1>
        <p className="site-subtitle mb-0">{t('subtitle')}</p>
      </div>
    </header>
  )
}
