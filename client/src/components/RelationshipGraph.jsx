import React from 'react'
import { useLang } from '../LangContext'

const relMap = {
  vi: {
    "Father": "Cha",
    "Mother": "Mẹ",
    "Son": "Con trai",
    "Daughter": "Con gái",
    "Brother": "Anh/em trai",
    "Sister": "Chị/em gái",
    "Older Brother": "Anh trai",
    "Younger Brother": "Em trai",
    "Older Sister": "Chị gái",
    "Younger Sister": "Em gái",
    "Grandfather": "Ông nội/ngoại",
    "Grandmother": "Bà nội/ngoại",
    "Great-Grandfather": "Ông cố",
    "Great-Grandmother": "Bà cố",
    "Great-Great-Grandfather": "Ông sơ",
    "Uncle": "Chú/Bác",
    "Aunt": "Cô/Dì",
    "Cousin": "Anh chị em họ",
    "Nephew": "Cháu trai",
    "Niece": "Cháu gái",
    "Wife": "Vợ",
    "Husband": "Chồng",
    "Ancestor": "Tổ tiên",
    "Descendant": "Hậu duệ",
    "Adoptive Father": "Cha nuôi",
    "Adoptive Mother": "Mẹ nuôi",
    "Adoptive Son": "Con nuôi",
    "Adoptive Daughter": "Con gái nuôi",
    "Adoptive Brother": "Anh em nuôi",
    "Stepfather": "Cha dượng",
    "Stepmother": "Mẹ kế",
    "Twin Brother": "Anh em sinh đôi",
    "Twin Sister": "Chị em sinh đôi",
    "Clone": "Bản sao",
    "Alternate Universe Counterpart": "Bản thể vũ trụ song song",
    "Pet": "Thú cưng",
    "Master": "Chủ nhân",
    "Stand": "Stand",
    "Affiliation": "Trực thuộc",
    "Relative": "Họ hàng"
  },
  ja: {
    "Father": "父",
    "Mother": "母",
    "Son": "息子",
    "Daughter": "娘",
    "Brother": "兄弟",
    "Sister": "姉妹",
    "Older Brother": "兄",
    "Younger Brother": "弟",
    "Older Sister": "姉",
    "Younger Sister": "妹",
    "Grandfather": "祖父",
    "Grandmother": "祖母",
    "Great-Grandfather": "曾祖父",
    "Great-Grandmother": "曾祖母",
    "Great-Great-Grandfather": "高祖父",
    "Uncle": "叔父",
    "Aunt": "叔母",
    "Cousin": "いとこ",
    "Nephew": "甥",
    "Niece": "姪",
    "Wife": "妻",
    "Husband": "夫",
    "Ancestor": "先祖",
    "Descendant": "子孫",
    "Adoptive Father": "養父",
    "Adoptive Mother": "養母",
    "Adoptive Son": "養子",
    "Adoptive Daughter": "養女",
    "Adoptive Brother": "義兄弟",
    "Stepfather": "継父",
    "Stepmother": "継母",
    "Twin Brother": "双子の兄弟",
    "Twin Sister": "双子の姉妹",
    "Clone": "クローン",
    "Alternate Universe Counterpart": "平行世界の同一人物",
    "Pet": "ペット",
    "Master": "主人",
    "Stand": "スタンド",
    "Affiliation": "所属",
    "Relative": "親戚"
  }
};

export default function RelationshipGraph({ char, allCharacters, onSelectChar }) {
  const { lang, t } = useLang();
  
  if (!char || !char.details || !char.details.info) return null;
  const langKey = lang === 'vi' ? 'en' : lang;
  const info = char.details.info[langKey] || char.details.info.en || char.details.info.ja || {};
  
  const relationships = [];

  // Parse Relatives (e.g. "DIO (Father)\nJonathan Joestar (Great-Great-Grandfather)")
  const rawRelatives = info.Relatives || info.Relationships || info.Family;
  if (rawRelatives) {
    const lines = rawRelatives.split('\n');
    lines.forEach(line => {
      // Typically formatted as "Name (Relation)"
      const match = line.match(/^(.*?)\((.*?)\)$/);
      if (match) {
        relationships.push({ type: match[2].trim(), name: match[1].trim() });
      } else {
        relationships.push({ type: 'Relative', name: line.trim() });
      }
    });
  }

  // Parse Affiliation
  if (info.Affiliation) {
    const lines = info.Affiliation.split(/[,&/]/);
    lines.forEach(line => {
      if (line.trim()) {
        relationships.push({ type: 'Affiliation', name: line.trim() });
      }
    });
  }

  if (relationships.length === 0) {
    return <div className="text-muted fst-italic">{t('noCharFound')}</div>;
  }

  const handleCharClick = (name) => {
    // Try to find the character by name
    const q = name.toLowerCase().trim();
    const found = allCharacters.find(c => 
      c.name.toLowerCase() === q || 
      (c.details?.info?.en?.Alias || '').toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
    );
    if (found && onSelectChar) {
      onSelectChar(found);
    }
  };
  
  const translateType = (type) => {
    if (lang === 'en') return type;
    const map = relMap[lang];
    if (!map) return type;
    return map[type] || type;
  };

  return (
    <div className="relationship-graph mt-3 px-2 py-3 rounded" style={{ background: 'var(--surface)' }}>
      <h6 className="fw-bold mb-4" style={{ color: 'var(--gold)', borderBottom: '1px solid var(--gold)', paddingBottom: '8px' }}>
        ✦ {lang === 'vi' ? 'Mối Quan Hệ' : lang === 'ja' ? '関係' : 'Relationships'}
      </h6>
      <div className="d-flex flex-column gap-3">
        {relationships.map((rel, idx) => {
          // Check if this name exists in our database to make it clickable
          const isClickable = allCharacters && allCharacters.some(c => c.name.toLowerCase().includes(rel.name.toLowerCase().trim()));
          
          return (
            <div key={idx} className="d-flex align-items-center">
              <div 
                className="relation-type text-end fw-bold me-3" 
                style={{ width: '120px', lineHeight: '1.2', color: 'var(--gold)', textShadow: '0 1px 2px rgba(0,0,0,0.5)', fontSize: '0.9rem', fontFamily: 'inherit' }}
              >
                {translateType(rel.type)}
              </div>
              
              <div className="me-3 fs-5" style={{ color: 'var(--bs-border-color)' }}>
                <i className="bi bi-link"></i>
              </div>
              
              <div 
                className={`relation-name px-3 py-2 fw-bold ${isClickable ? 'shadow-sm' : ''}`}
                style={{ 
                  cursor: isClickable ? 'pointer' : 'default', 
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                  userSelect: 'none',
                  background: isClickable ? 'var(--surface2)' : 'transparent',
                  border: isClickable ? '2px solid var(--gold)' : '2px solid transparent',
                  borderRadius: '8px',
                  color: isClickable ? 'var(--bs-body-color)' : 'var(--jojo-text)',
                  fontFamily: 'inherit',
                  transform: 'scale(1)'
                }}
                onClick={() => isClickable && handleCharClick(rel.name)}
                onMouseEnter={e => { 
                  if(isClickable) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(224, 169, 109, 0.5)';
                    e.currentTarget.style.background = 'var(--gold)';
                    e.currentTarget.style.color = 'var(--bs-body-bg)';
                  }
                }}
                onMouseLeave={e => { 
                  if(isClickable) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = 'var(--surface2)';
                    e.currentTarget.style.color = 'var(--bs-body-color)';
                  }
                }}
              >
                {rel.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
