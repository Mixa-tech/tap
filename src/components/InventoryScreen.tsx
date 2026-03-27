import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CATS, SKINS, GPUS } from '../data/gameData';
import { getRarityColor, getRarityName } from '../store/gameStore';

const InventoryScreen: React.FC = () => {
  const { user, buyCat, buyGPU, addToast } = useGameStore();
  const [activeTab, setActiveTab] = useState<'cats' | 'skins' | 'gpus'>('cats');

  if (!user) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const handleEquipSkin = (skinId: string) => {
    useGameStore.getState().user = {
      ...user,
      equippedSkin: skinId,
    };
    addToast('Скин экипирован!', 'success');
  };

  const handleBuyCat = (catId: string) => {
    buyCat(catId);
  };

  const handleBuyGPU = (gpuId: string) => {
    buyGPU(gpuId);
  };

  // Пассивный доход от котов
  const passiveIncome = useGameStore.getState().getPassiveIncome();
  
  // Доход от майнинга
  const miningIncome = useGameStore.getState().getMiningIncome();

  return (
    <div className="page-container">
      <h2 className="section-title">🎒 Инвентарь</h2>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('cats')}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'cats' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'cats' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🐱 Коты
        </button>
        <button
          onClick={() => setActiveTab('skins')}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'skins' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'skins' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🎨 Скины
        </button>
        <button
          onClick={() => setActiveTab('gpus')}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'gpus' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'gpus' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ⛏️ GPU
        </button>
      </div>

      {/* Коты */}
      {activeTab === 'cats' && (
        <>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Пассивный доход: <span style={{ color: 'var(--success)', fontWeight: 700 }}>{passiveIncome} KIT/час</span>
            </div>
          </div>

          {/* Магазин котов */}
          <h3 className="section-title">🏪 Магазин котов</h3>
          <div className="grid" style={{ gap: '12px', marginBottom: '24px' }}>
            {CATS.map(cat => {
              const prices: Record<string, number> = {
                common: 500,
                rare: 2000,
                epic: 10000,
                legendary: 50000,
                mythical: 200000,
              };
              const price = prices[cat.rarity];
              const canBuy = user.kit >= price;
              const owned = user.cats.find(c => c.catId === cat.id)?.count || 0;

              return (
                <div key={cat.id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      fontSize: '48px',
                      padding: '10px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      border: `2px solid ${getRarityColor(cat.rarity)}`,
                    }}>
                      {cat.image}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{cat.name}</div>
                      <div 
                        className="badge"
                        style={{ 
                          marginTop: '4px',
                          background: `${getRarityColor(cat.rarity)}20`,
                          color: getRarityColor(cat.rarity),
                        }}
                      >
                        {getRarityName(cat.rarity)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                        +{cat.passiveIncome} KIT/час
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>
                        🪙 {price.toLocaleString()}
                      </div>
                      <button
                        className={`btn-${canBuy ? 'primary' : 'secondary'}`}
                        onClick={() => handleBuyCat(cat.id)}
                        disabled={!canBuy}
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                      >
                        {owned > 0 ? `x${owned}` : 'Купить'}
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Инвентарь котов */}
          {user.cats.length > 0 && (
            <>
              <h3 className="section-title">🎒 Ваши коты</h3>
              <div className="grid grid-3" style={{ gap: '12px' }}>
                {user.cats.map(item => {
                  const cat = CATS.find(c => c.id === item.catId);
                  if (!cat) return null;

                  return (
                    <div key={item.catId} className="card" style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '40px',
                        padding: '10px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        border: `2px solid ${getRarityColor(cat.rarity)}`,
                      }}>
                        {cat.image}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '12px', marginTop: '8px' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        x{item.count}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--success)', marginTop: '4px' }}>
                        +{cat.passiveIncome * item.count} KIT/час
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Скины */}
      {activeTab === 'skins' && (
        <>
          <h3 className="section-title">🎨 Коллекция скинов</h3>
          {user.skins.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎨</div>
              <p>У вас пока нет скинов</p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>Открывайте кейсы чтобы получить скины!</p>
            </div>
          ) : (
            <div className="grid grid-3" style={{ gap: '12px' }}>
              {user.skins.map(item => {
                const skin = SKINS.find(s => s.id === item.skinId);
                if (!skin) return null;

                const isEquipped = user.equippedSkin === skin.id;

                return (
                  <div 
                    key={item.skinId} 
                    className="card" 
                    style={{ 
                      textAlign: 'center',
                      border: isEquipped ? '2px solid var(--ton-blue)' : undefined,
                    }}
                  >
                    <div style={{ 
                      fontSize: '40px',
                      padding: '10px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      border: `2px solid ${getRarityColor(skin.rarity)}`,
                    }}>
                      {skin.image}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '12px', marginTop: '8px' }}>
                      {skin.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      x{item.count}
                    </div>
                    {skin.bonus && (
                      <div style={{ fontSize: '10px', color: 'var(--success)', marginTop: '4px' }}>
                        x{skin.bonus} к клику
                      </div>
                    )}
                    {!isEquipped && (
                      <button
                        className="btn-secondary"
                        onClick={() => handleEquipSkin(skin.id)}
                        style={{ marginTop: '8px', padding: '6px 12px', fontSize: '11px', width: '100%' }}
                      >
                        Экипировать
                      </button>
                    )}
                    {isEquipped && (
                      <div style={{ 
                        marginTop: '8px', 
                        padding: '6px', 
                        background: 'var(--ton-blue)', 
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}>
                        Экипировано
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* GPU */}
      {activeTab === 'gpus' && (
        <>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Доход от майнинга: <span style={{ color: 'var(--success)', fontWeight: 700 }}>{miningIncome.toFixed(8)} crypto/час</span>
            </div>
          </div>

          {/* Магазин GPU */}
          <h3 className="section-title">🏪 Магазин видеокарт</h3>
          <div className="grid" style={{ gap: '12px', marginBottom: '24px' }}>
            {GPUS.map(gpu => {
              const canBuy = user.crypto >= gpu.price;
              const owned = user.gpus.find(g => g.gpuId === gpu.id)?.count || 0;

              return (
                <div key={gpu.id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      fontSize: '48px',
                      padding: '10px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                    }}>
                      {gpu.image}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{gpu.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        ⚡ {gpu.hashRate} MH/s | 🔌 {gpu.powerConsumption}W
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#0088cc', marginBottom: '8px' }}>
                        💎 {gpu.price.toLocaleString()}
                      </div>
                      <button
                        className={`btn-${canBuy ? 'primary' : 'secondary'}`}
                        onClick={() => handleBuyGPU(gpu.id)}
                        disabled={!canBuy}
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                      >
                        {owned > 0 ? `x${owned}` : 'Купить'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Инвентарь GPU */}
          {user.gpus.length > 0 && (
            <>
              <h3 className="section-title">🎒 Ваши видеокарты</h3>
              <div className="grid grid-3" style={{ gap: '12px' }}>
                {user.gpus.map(item => {
                  const gpu = GPUS.find(g => g.id === item.gpuId);
                  if (!gpu) return null;

                  return (
                    <div key={item.gpuId} className="card" style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '40px',
                        padding: '10px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                      }}>
                        {gpu.image}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '12px', marginTop: '8px' }}>
                        {gpu.name}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        x{item.count}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--success)', marginTop: '4px' }}>
                        {gpu.hashRate * item.count} MH/s
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InventoryScreen;
