import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { SKINS } from '../data/gameData';
import { getRarityColor, getRarityName } from '../store/gameStore';
import { Skin } from '../types';

interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  skin: Skin;
  price: number;
  currency: 'kit' | 'crypto';
  timestamp: number;
}

// Демо листинги для примера
const DEMO_LISTINGS: Listing[] = [
  { id: '1', sellerId: 'user1', sellerName: 'Player1', skin: SKINS[0], price: 500, currency: 'kit', timestamp: Date.now() },
  { id: '2', sellerId: 'user2', sellerName: 'Trader2', skin: SKINS[5], price: 2000, currency: 'kit', timestamp: Date.now() },
  { id: '3', sellerId: 'user3', sellerName: 'Merchant3', skin: SKINS[10], price: 50, currency: 'crypto', timestamp: Date.now() },
];

const MarketplaceScreen: React.FC = () => {
  const { user, addToast } = useGameStore();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedSkin, setSelectedSkin] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState<'kit' | 'crypto'>('kit');
  const [listings, setListings] = useState<Listing[]>(DEMO_LISTINGS);

  const handleCreateListing = () => {
    if (!selectedSkin || !price) {
      addToast('Выберите скин и укажите цену', 'error');
      return;
    }

    const skin = SKINS.find(s => s.id === selectedSkin);
    if (!skin) return;

    // Проверка наличия скина
    const userSkin = user?.skins.find(s => s.skinId === selectedSkin);
    if (!userSkin || userSkin.count <= 0) {
      addToast('У вас нет этого скина', 'error');
      return;
    }

    const newListing: Listing = {
      id: `listing_${Date.now()}`,
      sellerId: user?.telegramId || 'unknown',
      sellerName: user?.firstName || 'Unknown',
      skin,
      price: parseInt(price),
      currency,
      timestamp: Date.now(),
    };

    setListings([newListing, ...listings]);
    
    // Убираем скин из инвентаря (временно)
    const newSkins = user?.skins.map(s => 
      s.skinId === selectedSkin ? { ...s, count: s.count - 1 } : s
    ).filter(s => s.count > 0) || [];
    
    useGameStore.getState().user = { ...user!, skins: newSkins };
    
    addToast('Лот создан!', 'success');
    setSelectedSkin('');
    setPrice('');
  };

  const handleBuyListing = (listing: Listing) => {
    if (!user) return;

    const balance = listing.currency === 'kit' ? user.kit : user.crypto;
    if (balance < listing.price) {
      addToast('Недостаточно средств', 'error');
      return;
    }

    // Покупка
    const newBalance = balance - listing.price;
    const newSkins = [...user.skins, { skinId: listing.skin.id, count: 1 }];

    useGameStore.getState().user = {
      ...user,
      kit: listing.currency === 'kit' ? newBalance : user.kit,
      crypto: listing.currency === 'crypto' ? newBalance : user.crypto,
      skins: newSkins,
    };

    // Удаляем лот
    setListings(listings.filter(l => l.id !== listing.id));
    addToast(`Куплено: ${listing.skin.name}`, 'success');
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
      <h2 className="section-title">🏪 Маркетплейс</h2>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('buy')}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'buy' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'buy' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🛒 Купить
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'sell' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'sell' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          💰 Продать
        </button>
      </div>

      {/* Покупка */}
      {activeTab === 'buy' && (
        <>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Доступно лотов: <span style={{ color: 'var(--ton-blue)', fontWeight: 700 }}>{listings.length}</span>
            </div>
          </div>

          <div className="grid" style={{ gap: '12px' }}>
            {listings.map(listing => (
              <div key={listing.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: 'var(--bg-secondary)',
                    border: `3px solid ${getRarityColor(listing.skin.rarity)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <div style={{
                      fontSize: '32px',
                      filter: `drop-shadow(0 0 10px ${getRarityColor(listing.skin.rarity)})`,
                    }}>
                      🎨
                    </div>
                    <div
                      style={{
                        height: '4px',
                        width: '100%',
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        background: getRarityColor(listing.skin.rarity),
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{listing.skin.name}</div>
                    <div 
                      className="badge"
                      style={{
                        marginTop: '4px',
                        background: `${getRarityColor(listing.skin.rarity)}30`,
                        color: getRarityColor(listing.skin.rarity),
                        fontSize: '10px',
                        padding: '3px 8px',
                      }}
                    >
                      {getRarityName(listing.skin.rarity)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Продавец: {listing.sellerName}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: '16px',
                      color: listing.currency === 'kit' ? '#f59e0b' : '#0088cc',
                    }}>
                      {listing.currency === 'kit' ? '🪙' : '💎'} {listing.price.toLocaleString()}
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => handleBuyListing(listing)}
                      style={{ marginTop: '8px', padding: '8px 16px', fontSize: '12px' }}
                    >
                      Купить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {listings.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🏪</div>
              <p>Пока нет активных лотов</p>
            </div>
          )}
        </>
      )}

      {/* Продажа */}
      {activeTab === 'sell' && (
        <div className="card">
          <h3 className="section-title">Создать лот</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Выберите скин
            </label>
            <select
              value={selectedSkin}
              onChange={e => setSelectedSkin(e.target.value)}
              className="input-field"
            >
              <option value="">-- Выберите скин --</option>
              {user.skins.map(item => {
                const skin = SKINS.find(s => s.id === item.skinId);
                if (!skin) return null;
                return (
                  <option key={skin.id} value={skin.id}>
                    {skin.name} (x{item.count}) - {getRarityName(skin.rarity)}
                  </option>
                );
              })}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Цена
            </label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="1000"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Валюта
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrency('kit')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: currency === 'kit' ? '#f59e0b' : 'var(--bg-secondary)',
                  border: 'none',
                  borderRadius: '12px',
                  color: currency === 'kit' ? 'white' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🪙 KIT
              </button>
              <button
                onClick={() => setCurrency('crypto')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: currency === 'crypto' ? '#0088cc' : 'var(--bg-secondary)',
                  border: 'none',
                  borderRadius: '12px',
                  color: currency === 'crypto' ? 'white' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                💎 Crypto
              </button>
            </div>
          </div>

          {selectedSkin && (
            <div style={{ 
              padding: '12px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Комиссия маркетплейса: <span style={{ color: 'var(--warning)' }}>5%</span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Вы получите: <span style={{ color: 'var(--success)' }}>{price ? (parseInt(price) * 0.95).toFixed(0) : '0'} {currency === 'kit' ? 'KIT' : 'Crypto'}</span>
              </div>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleCreateListing}
            disabled={!selectedSkin || !price}
            style={{ width: '100%' }}
          >
            Создать лот
          </button>
        </div>
      )}

      {/* Мои лоты */}
      {activeTab === 'sell' && listings.filter(l => l.sellerId === user.telegramId).length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 className="section-title">Мои лоты</h3>
          <div className="grid" style={{ gap: '12px' }}>
            {listings.filter(l => l.sellerId === user.telegramId).map(listing => (
              <div key={listing.id} className="card" style={{ opacity: 0.7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '32px' }}>🎨</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{listing.skin.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Цена: {listing.price.toLocaleString()} {listing.currency === 'kit' ? 'KIT' : 'Crypto'}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--warning)' }}>
                    На продаже
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceScreen;
