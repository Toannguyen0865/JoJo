import React, { useEffect } from 'react'
import { X } from 'lucide-react'

// Helper to draw radar chart
const RadarChart = ({ stats, t }) => {
  if (!stats) return null;
  
  const axes = [
    { label: 'power', key: 'Destructive Power' },
    { label: 'speed', key: 'Speed' },
    { label: 'range', key: 'Range' },
    { label: 'stamina', key: 'Persistence' },
    { label: 'precision', key: 'Precision' },
    { label: 'potential', key: 'Development Potential' }
  ];

  const statToScore = (val) => {
    switch (val) {
      case 'A': return 5;
      case 'B': return 4;
      case 'C': return 3;
      case 'D': return 2;
      case 'E': return 1;
      case 'Infinite': return 6;
      case 'None': return 0;
      default: return 0; // '?' or unknown
    }
  };

  const maxScore = 6;
  const size = 200;
  const center = size / 2;
  const radius = size * 0.4;
  
  const getPoint = (score, angleIdx) => {
    const angle = (Math.PI * 2 * angleIdx) / axes.length - Math.PI / 2;
    const r = (score / maxScore) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = axes.map((axis, i) => getPoint(statToScore(stats[axis.key]), i));
  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ') + ' Z';

  return (
    <div className="radar-chart-container position-relative mx-auto my-4" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background grid */}
        {[1,2,3,4,5].map(level => {
          const r = (level / maxScore) * radius;
          const bgPoints = axes.map((_, i) => getPoint(level, i));
          const bgPath = bgPoints.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ') + ' Z';
          return (
            <path key={level} d={bgPath} fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.5" />
          );
        })}
        
        {/* Axes lines */}
        {axes.map((_, i) => {
          const p = getPoint(maxScore, i);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="var(--border)" strokeWidth="1" opacity="0.5" />;
        })}

        {/* Data polygon */}
        <path d={pathData} fill="var(--gold)" fillOpacity="0.4" stroke="var(--gold)" strokeWidth="2" style={{ transition: 'all 0.5s ease-out' }} />
        
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--gold)" />
        ))}
      </svg>
      
      {/* Labels */}
      {axes.map((axis, i) => {
        const p = getPoint(maxScore + 1.2, i);
        const statVal = stats[axis.key] || '?';
        return (
          <div key={i} 
            className="position-absolute text-center fw-bold"
            style={{
              left: p.x, top: p.y,
              transform: 'translate(-50%, -50%)',
              fontSize: '0.75rem',
              width: '100px',
              lineHeight: 1.2
            }}>
            <div style={{ color: 'var(--text-muted)' }}>{t(axis.label)}</div>
            <div style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>{statVal}</div>
          </div>
        );
      })}
    </div>
  );
};

export default function StandModal({ standName, standDetails, onClose, t, lang }) {
  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!standDetails) return null;

  const abilitiesText = standDetails.abilities && typeof standDetails.abilities === 'object' 
    ? (standDetails.abilities[lang] || standDetails.abilities.en)
    : standDetails.abilities;

  return (
    <div className="modal-backdrop stand-modal-backdrop fade-in" onClick={onClose} style={{ zIndex: 1100, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
      <div className="modal-content p-0 rounded-4 overflow-hidden shadow-lg position-relative mx-3" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        
        <div className="modal-header flex-shrink-0 d-flex justify-content-between align-items-center p-3 border-bottom" style={{ backgroundColor: 'var(--surface2)', borderColor: 'var(--border) !important' }}>
          <h4 className="mb-0 fw-bold" style={{ color: 'var(--gold)' }}>{standName}</h4>
          <button className="btn p-1 d-flex align-items-center justify-content-center" onClick={onClose} aria-label="Close" style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none' }}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body p-0 custom-scrollbar" style={{ color: 'var(--jojo-text)', flexGrow: 1, overflowY: 'auto' }}>
          <div className="row w-100 g-0 m-0">
            {/* Left Column (Image & Stats) */}
            <div className="col-md-5 p-4 sticky-desktop border-end border-dark-subtle" style={{ backgroundColor: 'var(--surface)' }}>
              {standDetails.image && (
                <div className="text-center mb-4">
                  <img 
                    src={standDetails.image} 
                    alt={standName} 
                    className="img-fluid rounded shadow-sm"
                    loading="lazy"
                    style={{ maxHeight: '180px', objectFit: 'contain', border: '1px solid var(--border)' }}
                  />
                </div>
              )}

              {standDetails.stats ? (
                <RadarChart stats={standDetails.stats} t={t} />
              ) : (
                <div className="text-center text-muted my-4">{t('nostats')}</div>
              )}
            </div>
            
            {/* Right Column (Cry & Abilities) */}
            <div className="col-md-7 p-4">
              {standDetails.cry && (
                <div className="mb-4 text-center">
                  <h6 className="fw-bold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{t('battlecry')}</h6>
                  <div className="fs-5 fw-bold" style={{ color: 'var(--gold-light)' }}>"{standDetails.cry}"</div>
                </div>
              )}

              {abilitiesText && (
                <div>
                  <h6 className="fw-bold text-uppercase border-bottom pb-2 mb-3">{t('abilities')}</h6>
                  <div className="stand-abilities-text" style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {abilitiesText}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
