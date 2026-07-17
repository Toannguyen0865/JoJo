import React, { useEffect } from 'react'
import { X } from 'lucide-react'

// Helper to draw radar chart
const RadarChart = ({ stats }) => {
  if (!stats) return null;
  
  const axes = [
    { label: 'Power', key: 'Destructive Power' },
    { label: 'Speed', key: 'Speed' },
    { label: 'Range', key: 'Range' },
    { label: 'Stamina', key: 'Persistence' },
    { label: 'Precision', key: 'Precision' },
    { label: 'Potential', key: 'Development Potential' }
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
    <div className="radar-chart-container position-relative d-flex justify-content-center my-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background grid */}
        {[1,2,3,4,5].map(level => {
          const r = (level / maxScore) * radius;
          const bgPoints = axes.map((_, i) => getPoint(level, i));
          const bgPath = bgPoints.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ') + ' Z';
          return (
            <path key={level} d={bgPath} fill="none" stroke="var(--bs-border-color)" strokeWidth="1" opacity="0.5" />
          );
        })}
        
        {/* Axes lines */}
        {axes.map((_, i) => {
          const p = getPoint(maxScore, i);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="var(--bs-border-color)" strokeWidth="1" opacity="0.5" />;
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
              width: '80px',
              lineHeight: 1.2
            }}>
            <div style={{ color: 'var(--bs-body-color)' }}>{axis.label}</div>
            <div style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>{statVal}</div>
          </div>
        );
      })}
    </div>
  );
};

export default function StandModal({ standName, standDetails, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!standDetails) return null;

  return (
    <div className="modal-backdrop stand-modal-backdrop" onClick={onClose} style={{ zIndex: 1100, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content bg-body p-0 rounded-4 overflow-hidden shadow-lg position-relative mx-3" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom bg-body-tertiary">
          <h4 className="mb-0 fw-bold" style={{ color: 'var(--gold)' }}>{standName}</h4>
          <button className="btn btn-close-custom" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body p-4 overflow-auto">
          {standDetails.stats ? (
            <RadarChart stats={standDetails.stats} />
          ) : (
            <div className="text-center text-muted my-4">No stats available</div>
          )}

          {standDetails.cry && (
            <div className="mb-4 text-center">
              <h6 className="fw-bold text-uppercase text-muted mb-1">Battle Cry</h6>
              <div className="fs-5 fw-bold" style={{ color: 'var(--bs-primary)' }}>"{standDetails.cry}"</div>
            </div>
          )}

          {standDetails.abilities && (
            <div>
              <h6 className="fw-bold text-uppercase border-bottom pb-2 mb-3">Abilities</h6>
              <div className="stand-abilities-text" style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {standDetails.abilities}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}
