                {/* Year Label (Top) */}
                <div 
                  className="fw-bold text-center position-absolute" 
                  style={{ 
                    bottom: '100%',
                    marginBottom: '10px',
                    fontSize: '0.85rem', 
                    color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                    transition: 'color 0.3s',
                    textShadow: isActive ? '0 0 8px rgba(224, 169, 109, 0.4)' : 'none',
                    opacity: isActive ? 1 : 0.7
                  }}
                >
                  {p.year}
                </div>
                import React from 'react'
import { useLang } from '../LangContext'

export default function Timeline({ selectedPart, onSelectPart }) {
  const { t } = useLang();
  const parts = [
    { num: 1, year: '1880', label: 'Phantom Blood' },
    { num: 2, year: '1938', label: 'Battle Tendency' },
    { num: 3, year: '1989', label: 'Stardust Crusaders' },
    { num: 4, year: '1999', label: 'Diamond is Unbreakable' },
    { num: 5, year: '2001', label: 'Golden Wind' },
    { num: 6, year: '2011', label: 'Stone Ocean' }
  ];

  const progressPercent = ((selectedPart - 1) / (parts.length - 1)) * 100;

  return (
    <div className="w-100 my-4 timeline-wrapper">
      <style>{`
        .timeline-wrapper {
          padding-top: 40px;
          padding-bottom: 40px;
          overflow-x: auto;
        }
        .timeline-container {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          min-width: 700px;
          height: 40px;
        }
        .timeline-line-bg {
          position: absolute;
          background: var(--border);
          z-index: 1;
          border-radius: 3px;
          height: 6px;
          width: 100%;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
        .timeline-line-progress {
          position: absolute;
          background: var(--gold);
          z-index: 2;
          border-radius: 3px;
          box-shadow: 0 0 10px var(--gold);
          transition: all 0.4s ease;
          height: 6px;
          width: ${progressPercent}%;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
        .timeline-items {
          position: relative;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          height: 100%;
          flex-direction: row;
        }
        .timeline-point {
          cursor: pointer;
          width: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* Responsive U-Shape Grid for Mobile */
        @media (max-width: 767px) {
          .timeline-wrapper {
            overflow-x: hidden;
            padding-top: 40px; /* Fix cutoff year */
            padding-bottom: 20px;
          }
          .timeline-container {
            min-width: 100%;
            height: auto;
          }
          .timeline-line-bg.desktop-line, .timeline-line-progress.desktop-line {
            display: none !important;
          }
          .timeline-items {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: 40px 40px;
            row-gap: 40px;
            height: 120px;
          }
          .timeline-point {
            width: 100%;
          }
          .timeline-point[data-part="1"] { grid-area: 1 / 1; }
          .timeline-point[data-part="2"] { grid-area: 1 / 2; }
          .timeline-point[data-part="3"] { grid-area: 1 / 3; }
          .timeline-point[data-part="4"] { grid-area: 2 / 3; }
          .timeline-point[data-part="5"] { grid-area: 2 / 2; }
          .timeline-point[data-part="6"] { grid-area: 2 / 1; }
        }
      `}</style>
      
      <div className="timeline-container px-3">
        {/* Desktop Lines */}
        <div className="timeline-line-bg desktop-line" />
        <div className="timeline-line-progress desktop-line" />

        <div className="timeline-items">
          {parts.map(p => {
            const isActive = selectedPart === p.num;
            const isPassed = selectedPart >= p.num;
            return (
              <div 
                key={p.num}
                className="timeline-point"
                data-part={p.num}
                onClick={() => onSelectPart(p.num)}
              >

                {/* Timeline Pill */}
                <div 
                  className="d-flex align-items-center justify-content-center fw-bold shadow"
                  style={{
                    padding: '0 20px',
                    height: isActive ? '40px' : '32px',
                    background: isActive ? 'var(--gold)' : 'var(--surface2)',
                    color: isActive ? 'var(--bg)' : (isPassed ? 'var(--gold)' : 'var(--text-muted)'),
                    border: `3px solid ${isActive || isPassed ? 'var(--gold)' : 'var(--border)'}`,
                    boxShadow: isActive ? '0 0 15px rgba(224, 169, 109, 0.6)' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    whiteSpace: 'nowrap',
                    borderRadius: '30px',
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {t(`tab${p.num}`)}
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
