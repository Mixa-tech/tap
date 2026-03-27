import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const ProfileScreen: React.FC = () => {
  const { user, canRebirth, doRebirth } = useGameStore();
  const [showRebirthConfirm, setShowRebirthConfirm] = useState(false);

  if (!user) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const rebirthCost = 10000 * Math.pow(2, user.rebirths);
  const canDoRebirth = canRebirth();

  const handleRebirth = () => {
    if (canDoRebirth) {
      doRebirth();
      setShowRebirthConfirm(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { name: string; class: string }> = {
      user: { name: 'Пользователь', class: 'badge-user' },
      premium: { name: 'Premium', class: 'badge-premium' },
      developer: { name: 'Developer', class: 'badge-developer' },
      first_developer: { name: '👑 Mixazx', class: 'badge-first-dev' },
    };
    return badges[role] || badges.user;
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <div className="page-container">
      <h2 className="section-title">👤 Профиль</h2>

      {/* Информация о пользователе */}
      <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%',
          background: 'var(--ton-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          margin: '0 auto 16px',
        }}>
          {user.firstName?.charAt(0).toUpperCase() || '👤'}
        </div>
        
        <h3 style={{ fontWeight: 700, fontSize: '18px' }}>
          {user.firstName} {user.lastName}
        </h3>
        {user.username && (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            @{user.username}
          </p>
        )}
        
        <div style={{ marginTop: '12px' }}>
          <span className={`badge ${roleBadge.class}`}>
            {roleBadge.name}
          </span>
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          ID: {user.telegramId}
        </div>
      </div>

      {/* Статистика */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title" style={{ marginBottom: '16px' }}>📊 Статистика</h3>
        <div className="grid grid-2" style={{ gap: '12px' }}>
          <div className="stat-card">
            <div className="stat-value">{user.level}</div>
            <div className="stat-label">Уровень</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user.rebirths}</div>
            <div className="stat-label">Перерождения</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user.totalClicks.toLocaleString()}</div>
            <div className="stat-label">Всего кликов</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user.totalKitEarned.toLocaleString()}</div>
            <div className="stat-label">Всего KIT</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user.totalCasesOpened}</div>
            <div className="stat-label">Открыто кейсов</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user.cats.reduce((sum, c) => sum + c.count, 0)}</div>
            <div className="stat-label">Котов</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user.gpus.reduce((sum, g) => sum + g.count, 0)}</div>
            <div className="stat-label">Видеокарт</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user.achievements.length}</div>
            <div className="stat-label">Ачивок</div>
          </div>
        </div>
      </div>

      {/* Перерождение */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">🔄 Перерождение</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Переродитесь чтобы получить постоянный бонус +10% к доходу за каждое перерождение
        </p>
        
        <div style={{ 
          padding: '16px', 
          background: 'var(--bg-secondary)', 
          borderRadius: '12px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Текущее перерождение:</span>
            <span style={{ fontWeight: 700 }}>{user.rebirths}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Бонус к доходу:</span>
            <span style={{ fontWeight: 700, color: 'var(--success)' }}>+{(user.rebirths * 10)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Стоимость:</span>
            <span style={{ fontWeight: 700, color: '#f59e0b' }}>
              🪙 {rebirthCost.toLocaleString()} KIT
            </span>
          </div>
        </div>

        {user.rebirths >= 100 ? (
          <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>👑</div>
            <div style={{ fontWeight: 700 }}>Максимальный уровень!</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Вы достигли максимума перерождений
            </div>
          </div>
        ) : (
          <button
            className={`btn-${canDoRebirth ? 'primary' : 'secondary'}`}
            onClick={() => setShowRebirthConfirm(true)}
            disabled={!canDoRebirth}
            style={{ width: '100%' }}
          >
            Переродиться
          </button>
        )}

        {!canDoRebirth && user.rebirths < 100 && (
          <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--error)', textAlign: 'center' }}>
            Недостаточно KIT для перерождения
          </p>
        )}
      </div>

      {/* Настройки */}
      <div className="card">
        <h3 className="section-title">⚙️ Настройки</h3>
        <div className="grid" style={{ gap: '12px' }}>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start' }}>
            🔊 Звук: Вкл
          </button>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start' }}>
            📳 Вибрация: Вкл
          </button>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start' }}>
            🌐 Язык: Русский
          </button>
          <button 
            className="btn-secondary" 
            style={{ justifyContent: 'flex-start', borderColor: 'var(--error)', color: 'var(--error)' }}
            onClick={() => {
              if (confirm('Вы уверены? Прогресс будет сброшен!')) {
                localStorage.removeItem('cat-tapper-storage');
                window.location.reload();
              }
            }}
          >
            🗑️ Сбросить прогресс
          </button>
        </div>
      </div>

      {/* Информация о разработчике */}
      <div style={{ marginTop: '24px', textAlign: 'center', padding: '20px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Cat Tapper v1.0.0
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          First Developer: <span style={{ color: 'var(--ton-blue)' }}>Mixazx</span>
        </p>
      </div>

      {/* Модальное окно подтверждения перерождения */}
      {showRebirthConfirm && (
        <div className="modal-overlay" onClick={() => setShowRebirthConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Перерождение</div>
              <button className="modal-close" onClick={() => setShowRebirthConfirm(false)}>✕</button>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔄</div>
              <p style={{ marginBottom: '16px' }}>
                Вы уверены что хотите переродиться?
              </p>
              <div style={{ 
                padding: '12px', 
                background: 'var(--bg-secondary)', 
                borderRadius: '12px',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Вы потеряете:
                </div>
                <div style={{ fontSize: '13px' }}>• {user.kit.toLocaleString()} KIT</div>
                <div style={{ fontSize: '13px' }}>• Текущий уровень</div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--success)', 
                  fontWeight: 700,
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                }}>
                  Вы получите:
                </div>
                <div style={{ fontSize: '13px' }}>• +10% к доходу навсегда</div>
                <div style={{ fontSize: '13px' }}>• {user.rebirths + 1} перерождение</div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setShowRebirthConfirm(false)}
                  style={{ flex: 1 }}
                >
                  Отмена
                </button>
                <button
                  className="btn-primary"
                  onClick={handleRebirth}
                  style={{ flex: 1 }}
                >
                  Переродиться
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
