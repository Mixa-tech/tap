import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { SKINS } from '../data/gameData';

const TapperScreen: React.FC = () => {
  const { user, addClick } = useGameStore();
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number; value: number }[]>([]);

  // Получить текущий скин
  const currentSkin = user?.equippedSkin 
    ? SKINS.find(s => s.id === user.equippedSkin)
    : SKINS[0];

  // Расчёт множителей
  const clickMultiplier = currentSkin?.bonus || 1;
  const rebirthMultiplier = 1 + (user?.rebirths || 0) * 0.1;
  const clickValue = Math.floor(1 * clickMultiplier * rebirthMultiplier);

  // Обработка клика
  const handleTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Добавляем клик в хранилище
    addClick();

    // Добавляем анимацию цифры
    const id = Date.now();
    setClicks(prev => [...prev, { id, x, y, value: clickValue }]);

    // Удаляем анимацию через 1 секунду
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== id));
    }, 1000);

    // Вибрация (если поддерживается)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Заглушка для картинки кота
  const catPlaceholder = (
    <div style={{
      width: '200px',
      height: '200px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '4px solid var(--ton-blue)',
      boxShadow: '0 0 40px rgba(0, 136, 204, 0.3)',
      overflow: 'hidden',
    }}>
      {(() => {
        const customImage = localStorage.getItem('custom_image_cat');
        if (customImage) {
          return (
            <img
              src={customImage}
              alt="Cat"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          );
        }
        return (
          <span style={{ fontSize: '80px', opacity: 0.5 }}>🐱</span>
        );
      })()}
    </div>
  );

  // Автоматический сбор пассивного дохода
  useEffect(() => {
    const interval = setInterval(() => {
      // Здесь можно добавить автоматический сбор
    }, 60000); // Каждую минуту

    return () => clearInterval(interval);
  }, []);

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
      {/* Заголовок с балансом */}
      <div className="header">
        <div>
          <h1 className="gradient-text glow-text">🐱 Cat Tapper</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            Уровень {user.level} • Перерождений: {user.rebirths}
          </p>
        </div>
        <div className={`badge badge-${user.role === 'first_developer' ? 'first-dev' : user.role}`}>
          {user.role === 'first_developer' ? '👑 Mixazx' : user.role}
        </div>
      </div>

      {/* Баланс */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="balance-display">
          <div className="balance-item">
            <span className="balance-icon" style={{ background: '#f59e0b' }}>🪙</span>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>KIT</div>
              <div style={{ fontWeight: 700 }}>{user.kit.toLocaleString()}</div>
            </div>
          </div>
          <div className="balance-item">
            <span className="balance-icon" style={{ background: '#0088cc' }}>💎</span>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Crypto</div>
              <div style={{ fontWeight: 700 }}>{user.crypto.toFixed(6)}</div>
            </div>
          </div>
        </div>
        
        {/* Пассивный доход */}
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Пассивный доход: <span style={{ color: 'var(--success)' }}>+{useGameStore.getState().getPassiveIncome()} KIT/час</span>
          </div>
        </div>
      </div>

      {/* Кот для тапанья */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          cursor: 'pointer',
          userSelect: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={handleTap}
        onTouchStart={handleTap}
      >
        {catPlaceholder}

        {/* Анимация цифр при клике */}
        {clicks.map(click => (
          <div
            key={click.id}
            style={{
              position: 'absolute',
              left: click.x,
              top: click.y,
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--ton-blue)',
              pointerEvents: 'none',
              animation: 'slide-up 1s ease-out forwards',
              textShadow: '0 0 10px var(--ton-blue)',
            }}
          >
            +{click.value}
          </div>
        ))}

        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
          Тапай кота и зарабатывай KIT!
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Сила клика: {clickValue} KIT
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-2" style={{ marginTop: '20px' }}>
        <div className="card stat-card">
          <div className="stat-value">{user.totalClicks.toLocaleString()}</div>
          <div className="stat-label">Всего кликов</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{user.totalKitEarned.toLocaleString()}</div>
          <div className="stat-label">Всего заработано</div>
        </div>
      </div>

      {/* Прогресс до следующего уровня */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Опыт</span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {user.experience} / {user.level * 100}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(100, (user.experience / (user.level * 100)) * 100)}%` }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-50px);
          }
        }
      `}</style>
    </div>
  );
};

export default TapperScreen;
