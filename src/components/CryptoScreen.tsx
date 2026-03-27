import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CURRENCIES } from '../data/gameData';

const CryptoScreen: React.FC = () => {
  const { user } = useGameStore();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ton');

  if (!user) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const currency = CURRENCIES.find(c => c.id === selectedCurrency) || CURRENCIES[0];

  return (
    <div className="page-container">
      <h2 className="section-title">💰 Криптовалюты</h2>

      {/* Балансы */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="balance-display">
          <div className="balance-item">
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>KIT</div>
              <div style={{ fontWeight: 700 }}>{user.kit.toLocaleString()}</div>
            </div>
          </div>
          <div className="balance-item">
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CRYPTO</div>
              <div style={{ fontWeight: 700 }}>{user.crypto.toFixed(6)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Все валюты */}
      <div className="grid" style={{ gap: '12px' }}>
        {CURRENCIES.filter(c => c.id !== 'kit').map(curr => (
          <div 
            key={curr.id}
            className="card"
            onClick={() => setSelectedCurrency(curr.id)}
            style={{
              cursor: 'pointer',
              border: selectedCurrency === curr.id ? '2px solid var(--ton-blue)' : '1px solid var(--border-color)',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: curr.id === 'crypto' ? 'linear-gradient(135deg, #0088cc, #00d4ff)' : 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                color: curr.id === 'crypto' ? 'white' : 'var(--ton-blue)',
              }}>
                {curr.symbol.charAt(0)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{curr.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{curr.symbol}</div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>
                  ${curr.price.toLocaleString()}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: curr.change24h >= 0 ? 'var(--success)' : 'var(--error)',
                }}>
                  {curr.change24h >= 0 ? '+' : ''}{curr.change24h}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Детальная информация */}
      {currency && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: currency.id === 'crypto' ? 'linear-gradient(135deg, #0088cc, #00d4ff)' : 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 700,
              color: currency.id === 'crypto' ? 'white' : 'var(--ton-blue)',
            }}>
              {currency.symbol.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '20px' }}>{currency.name}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{currency.symbol}</p>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: '12px' }}>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '20px' }}>
                ${currency.price.toLocaleString()}
              </div>
              <div className="stat-label">Текущая цена</div>
            </div>
            <div className="stat-card">
              <div 
                className="stat-value" 
                style={{ 
                  fontSize: '20px',
                  color: currency.change24h >= 0 ? 'var(--success)' : 'var(--error)',
                }}
              >
                {currency.change24h >= 0 ? '+' : ''}{currency.change24h}%
              </div>
              <div className="stat-label">24 часа</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '20px' }}>
                ${((currency.price * 0.9).toFixed(2))}
              </div>
              <div className="stat-label">Минимум 24ч</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '20px' }}>
                ${((currency.price * 1.1).toFixed(2))}
              </div>
              <div className="stat-label">Максимум 24ч</div>
            </div>
          </div>

          {/* График (фейковый для демонстрации) */}
          <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Динамика цены (24ч)
            </div>
            <div style={{ 
              height: '100px', 
              display: 'flex', 
              alignItems: 'flex-end', 
              gap: '4px',
              justifyContent: 'space-between',
            }}>
              {Array(24).fill(null).map((_, i) => {
                const height = 30 + Math.random() * 70;
                const isPositive = currency.change24h >= 0;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${height}%`,
                      background: isPositive ? 'var(--success)' : 'var(--error)',
                      borderRadius: '2px',
                      opacity: 0.7,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoScreen;
