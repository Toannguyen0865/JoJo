import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { useLang } from '../LangContext'
import { BookOpen, Volume2, ChevronLeft, ChevronRight, X, Copy, Check } from 'lucide-react'
const StandModal = lazy(() => import('./StandModal'))
import RelationshipGraph from './RelationshipGraph'

export default function CharacterModal({ char, allCharacters, onSelectChar, onClose }) {
  const { t, lang } = useLang();
  const isOpen = Boolean(char)
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [playingIndex, setPlayingIndex] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showStandModal, setShowStandModal] = useState(false)
  const audioRef = useRef(null)

  const handleCopyInfo = async () => {
    if (!char || !details) return;
    
    let text = `${char.name.en}\n`;
    text += `=====================\n`;
    
    const displayKeys = ['Japanese Name', 'Romanized Name', 'Alias', 'Namesake*', 'Stand', 'Age', 'Birthday', 'Birthplace', 'Zodiac Sign', 'Gender', 'Height', 'Weight', 'Blood Type', 'Nationality', 'Occupation', 'Affiliation', 'Color', 'Food', 'Hobbies', 'Dislikes', 'Status'];
    displayKeys.forEach(k => {
      const dbKey = k === 'Namesake*' ? 'Namesake' : k;
      if (details[dbKey]) {
        const label = t(dbKey.toLowerCase().replace(' ', '')) || dbKey;
        text += `${label}: ${details[dbKey]}\n`;
      }
    });
    
    text += `\n(JoJo's Bizarre Encyclopedia)`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Cleanup audio when modal closes
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingIndex(null);
    }
  }, [isOpen])

  // Fetch details
  useEffect(() => {
    if (!isOpen || !char?.url) {
      setDetails(null)
      return
    }

    let isMounted = true
    setLoading(true)
    setDetails(null)

    const fetchData = async () => {
      try {
        const dbModule = await import('../data/database.json');
        const db = dbModule.default || dbModule;
        const characterData = db.characters.find(c => c.url === char.url);
        if (characterData && isMounted) {
          const detailsData = {
            images: characterData.details.images,
            audio: characterData.details.audio,
            standDetails: characterData.stand_details,
            ...characterData.details.info[lang]
          };
        // Simulate a tiny bit of loading time for smooth transition
        setTimeout(() => {
          if (isMounted) {
            setDetails(detailsData)
            setLoading(false)
          }
        }, 50)
      } else {
        if (isMounted) setLoading(false)
      }
      } catch (e) {
        console.error(e)
        if (isMounted) setLoading(false)
      }
    };
    
    fetchData();

    return () => { isMounted = false }
  }, [char, isOpen, lang])

  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Reset state when opening a new character
  useEffect(() => {
    setCurrentImageIndex(0);
    setShowStandModal(false);
  }, [char, isOpen])

  const playAudio = (index) => {
    if (!details?.audio || details.audio.length === 0) return;
    
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Toggle off if clicking the same currently playing button
    if (playingIndex === index) {
      setPlayingIndex(null);
      audioRef.current = null;
      return;
    }

    const audioUrl = details.audio[index];
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingIndex(index);
    
    audio.play().catch(console.error);
    audio.onended = () => {
      if (audioRef.current === audio) {
        setPlayingIndex(null);
        audioRef.current = null;
      }
    };
  }

  if (!isOpen) return null;

  const imagesList = details?.images?.length > 0 ? details.images : (char?.image ? [char.image] : []);
  const currentImage = imagesList[currentImageIndex];
  const currentImageUrl = currentImage 
    ? (currentImage.startsWith('/') ? currentImage : `/api/proxy-image?url=${encodeURIComponent(currentImage)}`) 
    : null;

  const keysToShow = [
    'Japanese Name', 'Romanized Name', 'Alias', 'Namesake', 'Stand', 'Age', 
    'Birthday', 'Birthplace', 'Zodiac Sign', 'Gender', 'Height', 'Weight', 
    'Blood Type', 'Nationality', 'Occupation', 'Color', 'Food', 'Hobbies', 
    'Dislikes', 'Status'
  ];
  const displayKeys = keysToShow.filter(k => {
    if (lang === 'ja' && k === 'Japanese Name') return false;
    return true;
  });

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  }

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  }

  const handleImageError = () => {
    if (!details?.images) return;
    setDetails(prev => {
      if (!prev || !prev.images) return prev;
      const newImages = prev.images.filter((_, idx) => idx !== currentImageIndex);
      return { ...prev, images: newImages };
    });
    if (currentImageIndex >= imagesList.length - 1) {
      setCurrentImageIndex(Math.max(0, imagesList.length - 2));
    }
  };

  return (
    <div
      className={`char-modal-overlay${isOpen ? ' active' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="char-modal-box d-flex flex-column flex-md-row">
        {currentImageUrl && (
          <div className="modal-img-col position-relative d-flex align-items-center justify-content-center">
            <img
              key={currentImageUrl}
              className="modal-char-img fade-in"
              src={currentImageUrl}
              alt={char.name}
              loading="lazy"
              onError={handleImageError}
            />
            {imagesList.length > 1 && (
              <>
                <button className="carousel-btn prev" onClick={prevImage}>
                  <ChevronLeft size={24} />
                </button>
                <button className="carousel-btn next" onClick={nextImage}>
                  <ChevronRight size={24} />
                </button>
                <div className="carousel-dots">
                  {imagesList.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`carousel-dot ${idx === currentImageIndex ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <div className="p-4 d-flex flex-column flex-grow-1" style={{ minHeight: 0, minWidth: 0 }}>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-3">
            <div className="modal-char-name text-md-start text-center">{char.name}</div>
            {details?.audio?.length > 0 && (
              <div className="audio-grid">
                {details.audio.map((_, idx) => (
                  <button 
                    key={idx}
                    className="btn p-1 d-flex align-items-center justify-content-center gap-1 px-1 w-100" 
                    onClick={() => playAudio(idx)} 
                    title={`${t('playAudio')} ${idx + 1}`}
                    style={{ 
                      color: playingIndex === idx ? 'var(--gold-light)' : 'var(--gold)',
                      animation: playingIndex === idx ? 'pulse 1s infinite' : 'none',
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  >
                    <Volume2 size={14} />
                    {details.audio.length > 1 && <span>{idx + 1}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="modal-details-scroll mb-3" style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '8px' }}>
            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-gold" style={{ width: 24, height: 24, borderWidth: 2, margin: '0 auto' }}></div>
              </div>
            ) : details && Object.keys(details).length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {displayKeys.map(k => {
                  if (!details[k]) return null;
                  
                  if (k === 'Stand') {
                     return (
                       <div key={k} className="d-flex justify-content-between align-items-center" style={{ fontSize: '13px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                         <span style={{ color: 'var(--text-muted)' }}>{t(k.toLowerCase().replace(' ', '')) || k}</span>
                         <span 
                           className="fw-bold" 
                           style={{ color: 'var(--gold)', textAlign: 'right', maxWidth: '60%', cursor: 'pointer', textDecoration: 'underline' }}
                           onClick={() => setShowStandModal(true)}
                         >
                           {details[k]}
                         </span>
                       </div>
                     );
                  }

                  return (
                    <div key={k} className="d-flex justify-content-between align-items-center" style={{ fontSize: '13px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{t(k.toLowerCase().replace(' ', '')) || k}</span>
                      <span style={{ color: 'var(--jojo-text)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{details[k]}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="d-flex gap-2 mt-auto" style={{ flexShrink: 0 }}>
            {char.url && (
              <button
                className="btn btn-gold-rect flex-grow-1 py-2 text-center d-flex align-items-center justify-content-center gap-2"
                onClick={handleCopyInfo}
              >
                {copied ? <><Check size={18} /> {t('copied')}</> : <><Copy size={18} /> {t('copyInfo')}</>}
              </button>
            )}
            <button className="btn btn-ghost px-3" onClick={onClose}>
              {t('close')}
            </button>
          </div>
        </div>
      </div>

      {showStandModal && details?.standDetails && (
        <Suspense fallback={null}>
          <StandModal 
            standName={details.Stand} 
            standDetails={details.standDetails} 
            onClose={() => setShowStandModal(false)} 
            charName={char.name}
            t={t}
            lang={lang}
          />
        </Suspense>
      )}
    </div>
  )
}
