import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CURRENCIES } from '../data/gameData';

const ExchangeScreen: React.FC = () => {
  const { user, buyCurrency, sellCurrency } = useGameStore();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ton');
  const [amount, setAmount] = useState<string>('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');

  const currency = CURRENCIES.find(c => c.id === selectedCurrency);
  const numericAmount = parseFloat(amount) || 0;
  const total = numericAmount * (currency?.price || 0);

  const handleTransaction = () => {
    if (!amount || numericAmount <= 0 || !currency) return;

    if (action === 'buy') {
      buyCurrency(selectedCurrency, numericAmount);
    } else {
      sellCurrency(selectedCurrency, numericAmount);
    }
    
    setAmount('');
  };

  if (!user || !currency) {
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
      <h2 className="section-title">💱 Биржа</h2>

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

      {/* Выбор валюты */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
          Выберите валюту
        </div>
        <div className="grid" style={{ gap: '8px' }}>
          {CURRENCIES.filter(c => c.id !== 'kit').map(curr => (
            <button
              key={curr.id}
              onClick={() => setSelectedCurrency(curr.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: selectedCurrency === curr.id ? 'var(--ton-blue)' : 'var(--bg-secondary)',
                border: selectedCurrency === curr.id ? '2px solid var(--ton-blue-light)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                color: selectedCurrency === curr.id ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: curr.id === 'crypto' ? 'linear-gradient(135deg, #0088cc, #00d4ff)' : 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
              }}>
                {curr.symbol.charAt(0)}
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{curr.symbol}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>${curr.price.toLocaleString()}</div>
              </div>
              <div style={{ 
                fontSize: '12px',
                color: curr.change24h >= 0 ? 'var(--success)' : 'var(--error)',
              }}>
                {curr.change24h >= 0 ? '+' : ''}{curr.change24h}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Торговля */}
      <div className="card">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setAction('buy')}
            style={{
              flex: 1,
              padding: '12px',
              background: action === 'buy' ? 'var(--success)' : 'var(--bg-secondary)',
              border: 'none',
              borderRadius: '12px',
              color: action === 'buy' ? 'white' : 'var(--text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Купить
          </button>
          <button
            onClick={() => setAction('sell')}
            style={{
              flex: 1,
              padding: '12px',
              background: action === 'sell' ? 'var(--error)' : 'var(--bg-secondary)',
              border: 'none',
              borderRadius: '12px',
              color: action === 'sell' ? 'white' : 'var(--text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Продать
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Количество {currency.symbol}
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="input-field"
            step="0.000001"
            min="0"
          />
        </div>

        <div style={{ 
          padding: '12px', 
          background: 'var(--bg-secondary)', 
          borderRadius: '12px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Итого:</span>
            <span style={{ fontWeight: 700 }}>
              {action === 'buy' ? '-' : '+'} {total.toLocaleString()} KIT
            </span>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleTransaction}
          disabled={!amount || numericAmount <= 0}
          style={{ width: '100%' }}
        >
          {action === 'buy' ? 'Купить' : 'Продать'} {currency.symbol}
        </button>

        {action === 'buy' && total > user.kit && (
          <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--error)', textAlign: 'center' }}>
            Недостаточно KIT
          </p>
        )}

        {action === 'sell' && numericAmount > user.crypto && (
          <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--error)', textAlign: 'center' }}>
            Недостаточно {currency.symbol}
          </p>
        )}
      </div>

      {/* Рынок */}
      <div style={{ marginTop: '24px' }}>
        <h3 className="section-title">📊 Рынок</h3>
        <div className="grid" style={{ gap: '8px' }}>
          {CURRENCIES.filter(c => c.id !== 'kit').map(curr => (
            <div key={curr.id} className="card" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: curr.id === 'crypto' ? 'linear-gradient(135deg, #0088cc, #00d4ff)' : 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: curr.id === 'crypto' ? 'white' : 'var(--ton-blue)',
                }}>
                  {curr.symbol.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{curr.symbol}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{curr.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    ${curr.price.toLocaleString()}
                  </div>
                  <div style={{ 
                    fontSize: '11px',
                    color: curr.change24h >= 0 ? 'var(--success)' : 'var(--error)',
                  }}>
                    {curr.change24h >= 0 ? '+' : ''}{curr.change24h}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExchangeScreen;
