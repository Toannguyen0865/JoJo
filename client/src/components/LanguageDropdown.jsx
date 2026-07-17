import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../LangContext';

export default function LanguageDropdown() {
  const { lang, setLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { code: 'ja', label: '日本語' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' }
  ];

  const selectedOption = options.find(o => o.code === lang);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-lang-dropdown" ref={dropdownRef}>
      <div 
        className={`dropdown-selected ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 5l6 6 6-6"/>
        </svg>
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options.map(opt => (
            <div 
              key={opt.code} 
              className={`dropdown-option ${lang === opt.code ? 'selected' : ''}`}
              onClick={() => {
                setLang(opt.code);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
