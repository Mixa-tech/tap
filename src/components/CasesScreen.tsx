import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getRarityColor, getRarityName } from '../store/gameStore';
import { Skin } from '../types';

const CasesScreen: React.FC = () => {
  const { user, cases, buyCase, openCase, addToast } = useGameStore();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [wonSkin, setWonSkin] = useState<Skin | null>(null);

  // Используем только пользовательские кейсы из store
  const allCases = cases || [];

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
    
    // Анимация открытия
    setTimeout(() => {
      const result = openCase(selectedCase);
      setWonSkin(result.skin);
      setIsOpening(false);

      // Убираем кейс из инвентаря
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
      <h2 className="section-title">📦 Кейсы</h2>

      {/* Список кейсов */}
      <div className="grid" style={{ gap: '12px' }}>
        {allCases.map(gameCase => {
          const userCase = user.cases.find(c => c.caseId === gameCase.id);
          const canBuy = gameCase.currency === 'kit' ? user.kit >= gameCase.price : user.crypto >= gameCase.price;
          const hasCase = userCase && userCase.count > 0;

          return (
            <div 
              key={gameCase.id}
              className="card"
              style={{
                border: selectedCase === gameCase.id ? '2px solid var(--ton-blue)' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '48px' }}>{gameCase.image}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>{gameCase.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {gameCase.skins.length} скинов
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: 600,
                      color: gameCase.currency === 'kit' ? '#f59e0b' : '#0088cc'
                    }}>
                      {gameCase.currency === 'kit' ? '🪙' : '💎'} {gameCase.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {hasCase && (
                    <button
                      className="btn-primary"
                      onClick={() => setSelectedCase(gameCase.id)}
                      disabled={isOpening}
                    >
                      Открыть
                    </button>
                  )}
                  {!hasCase && (
                    <button
                      className={`btn-${canBuy ? 'primary' : 'secondary'}`}
                      onClick={() => handleBuyCase(gameCase.id)}
                      disabled={!canBuy}
                    >
                      Купить
                    </button>
                  )}
                </div>
              </div>

              {/* Скины в кейсе */}
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Возможные награды:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {gameCase.skins.slice(0, 6).map(skin => (
                    <div
                      key={skin.id}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'var(--bg-secondary)',
                        border: `2px solid ${getRarityColor(skin.rarity)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}
                      title={`${skin.name} (${getRarityName(skin.rarity)}) - ${skin.chance}%`}
                    >
                      {skin.image}
                    </div>
                  ))}
                  {gameCase.skins.length > 6 && (
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'var(--bg-secondary)',
                        border: '2px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      +{gameCase.skins.length - 6}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Инвентарь кейсов */}
      {user.cases.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 className="section-title">🎒 Ваши кейсы</h3>
          <div className="grid grid-3" style={{ gap: '12px' }}>
            {user.cases.map(item => {
              const gameCase = allCases.find(c => c.id === item.caseId);
              if (!gameCase) return null;

              return (
                <div key={item.caseId} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px' }}>{gameCase.image}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
                    {gameCase.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    x{item.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Модальное окно открытия кейса */}
      {selectedCase && !wonSkin && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Открытие кейса</div>
              <button className="modal-close" onClick={() => setSelectedCase(null)}>✕</button>
            </div>
            
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div 
                className={isOpening ? 'coin-spin' : ''}
                style={{ 
                  fontSize: '80px',
                  marginBottom: '20px',
                }}
              >
                {allCases.find(c => c.id === selectedCase)?.image || '📦'}
              </div>
              
              {isOpening ? (
                <div>
                  <div className="loading">
                    <div className="spinner"></div>
                  </div>
                  <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
                    Открываем кейс...
                  </p>
                </div>
              ) : (
                <button className="btn-primary" onClick={handleOpenCase}>
                  Открыть кейс
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Результат открытия */}
      {wonSkin && (
        <div className="modal-overlay" onClick={handleCloseResult}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Награда!</div>
              <button className="modal-close" onClick={handleCloseResult}>✕</button>
            </div>
            
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div 
                className={`float-animation rarity-${wonSkin.rarity}`}
                style={{ 
                  fontSize: '100px',
                  marginBottom: '20px',
                  padding: '20px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '20px',
                  border: `3px solid ${getRarityColor(wonSkin.rarity)}`,
                  display: 'inline-block',
                }}
              >
                {wonSkin.image}
              </div>
              
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 700,
                color: getRarityColor(wonSkin.rarity),
              }}>
                {wonSkin.name}
              </h3>
              <div 
                className="badge"
                style={{ 
                  marginTop: '8px',
                  background: `${getRarityColor(wonSkin.rarity)}20`,
                  color: getRarityColor(wonSkin.rarity),
                }}
              >
                {getRarityName(wonSkin.rarity)}
              </div>
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
                {wonSkin.description}
              </p>
              {wonSkin.bonus && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--success)' }}>
                  Бонус к клику: x{wonSkin.bonus}
                </p>
              )}
              
              <button 
                className="btn-primary" 
                onClick={handleCloseResult}
                style={{ marginTop: '20px' }}
              >
                Забрать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesScreen;
