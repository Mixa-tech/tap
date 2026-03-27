import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getRarityColor, getRarityName } from '../store/gameStore';
import { Skin } from '../types';

const CryptoCasesScreen: React.FC = () => {
  const { user, buyCase, openCase, addToast } = useGameStore();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [wonSkin, setWonSkin] = useState<Skin | null>(null);

  // Используем только пользовательские кейсы за крипту
  const allCases = (useGameStore.getState().cases || []).filter(c => c.currency === 'crypto');

  const handleBuyCase = (caseId: string) => {
    if (buyCase(caseId)) {
      setSelectedCase(caseId);
    }
  };

  const handleOpenCase = () => {
    if (!selectedCase || !user) return;

    const userCase = user.cases.find(c => c.caseId === selectedCase);
    if (!userCase || userCase.count <= 0) {
      addToast('У вас нет этого кейса', 'error');
      return;
    }

    setIsOpening(true);
    
    setTimeout(() => {
      const result = openCase(selectedCase);
      setWonSkin(result.skin);
      setIsOpening(false);

      const newCases = user.cases.map(c => 
        c.caseId === selectedCase ? { ...c, count: c.count - 1 } : c
      ).filter(c => c.count > 0);

      useGameStore.getState().user = { ...user, cases: newCases };
    }, 2000);
  };

  const handleCloseResult = () => {
    setWonSkin(null);
    setSelectedCase(null);
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="section-title" style={{ color: '#0088cc' }}>🔐 Кейсы за Crypto</h2>

      {allCases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔐</div>
          <h3>Нет доступных кейсов</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Администраторы ещё не создали кейсы за криптовалюту
          </p>
        </div>
      ) : (
        <div className="grid" style={{ gap: '16px' }}>
          {allCases.map(gameCase => {
            const userCase = user.cases.find(c => c.caseId === gameCase.id);
            const canBuy = user.crypto >= gameCase.price;
            const hasCase = userCase && userCase.count > 0;

            return (
              <div 
                key={gameCase.id}
                className="card cs2-case-card"
                style={{
                  border: selectedCase === gameCase.id ? '2px solid #0088cc' : '1px solid var(--border-color)',
                  background: 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)',
                  overflow: 'hidden',
                }}
              >
                <div 
                  className="cs2-case-rarity-bar"
                  style={{
                    height: '4px',
                    background: `linear-gradient(90deg, ${getRarityColor(gameCase.skins[0].rarity)}, ${getRarityColor(gameCase.skins[gameCase.skins.length - 1].rarity)})`,
                    marginBottom: '16px',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    className="cs2-case-image"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #333',
                      boxShadow: '0 0 20px rgba(0, 136, 204, 0.2)',
                    }}
                  >
                    <span style={{ fontSize: '40px', filter: 'brightness(0.5)' }}>📦</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>
                      {gameCase.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {gameCase.skins.length} скинов
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 600,
                        color: '#0088cc',
                        background: 'rgba(0, 136, 204, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                      }}>
                        💎 {gameCase.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {hasCase && (
                      <button
                        className="btn-primary"
                        onClick={() => setSelectedCase(gameCase.id)}
                        disabled={isOpening}
                        style={{ padding: '10px 20px' }}
                      >
                        Открыть
                      </button>
                    )}
                    {!hasCase && (
                      <button
                        className={`btn-${canBuy ? 'primary' : 'secondary'}`}
                        onClick={() => handleBuyCase(gameCase.id)}
                        disabled={!canBuy}
                        style={{ padding: '10px 20px' }}
                      >
                        Купить
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #222' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Возможные награды:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {gameCase.skins.map(skin => (
                      <div
                        key={skin.id}
                        style={{
                          minWidth: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          background: '#0a0a0a',
                          border: `2px solid ${getRarityColor(skin.rarity)}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            height: '3px',
                            width: '100%',
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            background: getRarityColor(skin.rarity),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {user.cases.filter(c => allCases.find(cc => cc.id === c.caseId)).length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 className="section-title">🎒 Ваши кейсы</h3>
          <div className="grid grid-3" style={{ gap: '12px' }}>
            {user.cases.filter(c => allCases.find(cc => cc.id === c.caseId)).map(item => {
              const gameCase = allCases.find(c => c.id === item.caseId);
              if (!gameCase) return null;

              return (
                <div key={item.caseId} className="card" style={{ textAlign: 'center', background: '#111' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #333',
                  }}>
                    <span style={{ fontSize: '30px', filter: 'brightness(0.5)' }}>📦</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '12px', marginTop: '8px', color: '#fff' }}>
                    {gameCase.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#0088cc', marginTop: '4px' }}>
                    x{item.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedCase && !wonSkin && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div className="modal-title">Открытие кейса</div>
              <button className="modal-close" onClick={() => setSelectedCase(null)}>✕</button>
            </div>
            
            <div style={{ padding: '20px 0' }}>
              {isOpening ? (
                <div>
                  <div className="loading">
                    <div className="spinner"></div>
                  </div>
                  <p style={{ marginTop: '24px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Открываем кейс...
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '80px', marginBottom: '20px' }}>📦</div>
                  <button className="btn-primary" onClick={handleOpenCase} style={{ padding: '16px 40px', fontSize: '16px' }}>
                    Открыть кейс
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {wonSkin && (
        <div className="modal-overlay" onClick={handleCloseResult}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: getRarityColor(wonSkin.rarity) }}>Награда!</div>
              <button className="modal-close" onClick={handleCloseResult}>✕</button>
            </div>
            
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div 
                className="cs2-skin-drop"
                style={{ 
                  padding: '30px',
                  background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)',
                  borderRadius: '16px',
                  border: `3px solid ${getRarityColor(wonSkin.rarity)}`,
                  display: 'inline-block',
                  marginBottom: '20px',
                  boxShadow: `0 0 40px ${getRarityColor(wonSkin.rarity)}40`,
                }}
              >
                <div style={{ fontSize: '60px', marginBottom: '10px' }}>🎒</div>
              </div>
              
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: getRarityColor(wonSkin.rarity), textTransform: 'uppercase' }}>
                {wonSkin.name}
              </h3>
              <div className="badge" style={{ marginTop: '12px', background: `${getRarityColor(wonSkin.rarity)}20`, color: getRarityColor(wonSkin.rarity), padding: '6px 16px' }}>
                {getRarityName(wonSkin.rarity)}
              </div>
              <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                {wonSkin.description}
              </p>
              {wonSkin.bonus && (
                <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--success)' }}>
                  Бонус к клику: x{wonSkin.bonus}
                </p>
              )}
              
              <button className="btn-primary" onClick={handleCloseResult} style={{ marginTop: '24px', padding: '14px 40px' }}>
                Забрать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoCasesScreen;
