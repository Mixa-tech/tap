import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import TapperScreen from './components/TapperScreen';
import CasesScreen from './components/CasesScreen';
import CryptoCasesScreen from './components/CryptoCasesScreen';
import CryptoScreen from './components/CryptoScreen';
import ExchangeScreen from './components/ExchangeScreen';
import MarketplaceScreen from './components/MarketplaceScreen';
import InventoryScreen from './components/InventoryScreen';
import AchievementsScreen from './components/AchievementsScreen';
import ProfileScreen from './components/ProfileScreen';
import AdminScreen from './components/AdminScreen';
import ImageUploaderScreen from './components/ImageUploaderScreen';

const App: React.FC = () => {
  const { initUser, user, activeTab, setActiveTab, claimPassiveIncome, claimMiningIncome, addToast } = useGameStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Инициализация Telegram Web App
  useEffect(() => {
    const initTelegram = async () => {
      // Проверяем наличие Telegram WebApp
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        // Получаем данные пользователя
        const tgUser = tg.initDataUnsafe?.user;
        
        if (tgUser) {
          initUser(tgUser);
          
          // Настраиваем цвета под тему Telegram
          if (tg.colorScheme === 'dark') {
            document.documentElement.style.setProperty('--bg-primary', '#0f0f0f');
            document.documentElement.style.setProperty('--bg-secondary', '#1a1a2e');
          }
        } else {
          // Для тестирования в браузере создаём тестового пользователя
          initUser({
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'ru',
          });
        }

        // Закрытие приложения
        tg.onEvent('mainButtonClicked', () => {
          tg.close();
        });
      } else {
        // Для тестирования в браузере
        initUser({
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
          language_code: 'ru',
        });
      }

      setIsLoaded(true);
    };

    initTelegram();
  }, []);

  // Сбор пассивного дохода при загрузке
  useEffect(() => {
    if (isLoaded && user) {
      const passiveIncome = claimPassiveIncome();
      const miningIncome = claimMiningIncome();
      
      if (passiveIncome > 0 || miningIncome > 0) {
        addToast(
          `Получено ${passiveIncome + miningIncome.toFixed(6)} монет пока вас не было`,
          'success'
        );
      }
    }
  }, [isLoaded]);

  if (!isLoaded || !user) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'tapper':
        return <TapperScreen />;
      case 'cases':
        return <CasesScreen />;
      case 'crypto-cases':
        return <CryptoCasesScreen />;
      case 'crypto':
        return <CryptoScreen />;
      case 'exchange':
        return <ExchangeScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        return <AdminScreen />;
      case 'images':
        return <ImageUploaderScreen />;
      default:
        return <TapperScreen />;
    }
  };

  // Показываем вкладку админки только для разработчиков
  const showAdminTab = user.role === 'developer' || user.role === 'first_developer';

  return (
    <>
      {/* Кнопка открытия/закрытия sidebar */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: isSidebarOpen ? '260px' : '16px',
          zIndex: 1000,
          background: 'var(--ton-blue)',
          border: 'none',
          borderRadius: '12px',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0, 136, 204, 0.4)',
        }}
      >
        <span style={{ fontSize: '20px' }}>
          {isSidebarOpen ? '◀' : '▶'}
        </span>
      </button>

      {/* Боковая навигационная панель */}
      <nav
        className="sidebar"
        style={{
          position: 'fixed',
          left: isSidebarOpen ? '0' : '-280px',
          top: '0',
          bottom: '0',
          width: '280px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          zIndex: 999,
          transition: 'left 0.3s ease',
          overflowY: 'auto',
          padding: '80px 12px 12px',
        }}
      >
        {/* Логотип */}
        <div style={{
          textAlign: 'center',
          padding: '20px 0',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🐱</div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, background: 'var(--ton-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Cat Tapper
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Beta v1.0
          </p>
        </div>

        {/* Кнопки навигации */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            className={`sidebar-button ${activeTab === 'tapper' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('tapper');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">🐱</span>
            <span className="sidebar-label">Кликер</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'cases' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('cases');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">📦</span>
            <span className="sidebar-label">KIT Кейсы</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'crypto-cases' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('crypto-cases');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">🔐</span>
            <span className="sidebar-label">Crypto Кейсы</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'crypto' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('crypto');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">💰</span>
            <span className="sidebar-label">Валюты</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'exchange' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('exchange');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">💱</span>
            <span className="sidebar-label">Биржа</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('marketplace');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">🏪</span>
            <span className="sidebar-label">Маркет</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('inventory');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">🎒</span>
            <span className="sidebar-label">Инвентарь</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('profile');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">👤</span>
            <span className="sidebar-label">Профиль</span>
          </button>
          {showAdminTab && (
            <>
              <button
                className={`sidebar-button ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('admin');
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
              >
                <span className="sidebar-icon">🛠️</span>
                <span className="sidebar-label">Админ</span>
              </button>
              <button
                className={`sidebar-button ${activeTab === 'images' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('images');
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
              >
                <span className="sidebar-icon">🖼️</span>
                <span className="sidebar-label">Картинки</span>
              </button>
            </>
          )}
        </div>

        {/* Информация о пользователе */}
        {user && (
          <div style={{
            marginTop: 'auto',
            padding: '20px 12px',
            borderTop: '1px solid var(--border-color)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'var(--bg-card)',
              borderRadius: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--ton-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color: 'white',
              }}>
                {user.firstName?.charAt(0).toUpperCase() || '👤'}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.firstName || 'User'}
                </div>
                <div className={`badge badge-${user.role === 'first_developer' ? 'first-dev' : user.role}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                  {user.role === 'first_developer' ? '👑 Mixazx' : user.role}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Основной контент */}
      <main
        className="main-content"
        style={{
          marginLeft: isSidebarOpen ? '280px' : '0',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          minHeight: '100vh',
        }}
      >
        {renderScreen()}
      </main>

      {/* Уведомления (Toasts) */}
      <ToastContainer />
    </>
  );
};

// Компонент уведомлений
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGameStore();

  return (
    <div className="toast-container">
      {toasts.map((toast: { id: string; message: string; type: 'success' | 'error' | 'warning' }) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <span>
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'warning' && '⚠️'}
          </span>
          <span style={{ flex: 1 }}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default App;
