import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { SKINS } from '../data/gameData';
import { Rarity, Skin } from '../types';

const AdminScreen: React.FC = () => {
  const { user, createCase, createCurrency, giveRole, giveMoney, updateCurrencyPrice, addToast } = useGameStore();
  const [activeTab, setActiveTab] = useState<'create-case' | 'create-currency' | 'give-role' | 'give-money' | 'images' | 'crypto'>('create-case');

  // Создание кейса
  const [caseName, setCaseName] = useState('');
  const [casePrice, setCasePrice] = useState('');
  const [caseCurrency, setCaseCurrency] = useState('kit');
  const [selectedSkins, setSelectedSkins] = useState<string[]>([]);
  const [caseRarity, setCaseRarity] = useState<Rarity | 'all'>('all');
  const [skinImages, setSkinImages] = useState<Record<string, string>>({});
  const [uploadingSkinId, setUploadingSkinId] = useState<string | null>(null);

  // Создание криптовалюты
  const [currencyName, setCurrencyName] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [currencyPrice, setCurrencyPrice] = useState('');
  const [currencyChange, setCurrencyChange] = useState('');

  // Выдача роли/денег
  const [targetUserId, setTargetUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [moneyAmount, setMoneyAmount] = useState('');
  const [moneyCurrency, setMoneyCurrency] = useState('kit');

  // Управление криптовалютой
  const [selectedCrypto, setSelectedCrypto] = useState('ton');
  const [cryptoPrice, setCryptoPrice] = useState('');
  const [cryptoChange, setCryptoChange] = useState('');

  if (!user || (user.role !== 'developer' && user.role !== 'first_developer')) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2>Доступ запрещён</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Только разработчик может использовать эту панель
          </p>
        </div>
      </div>
    );
  }

  const handleCreateCase = () => {
    if (!caseName || !casePrice) {
      addToast('Введите название и цену', 'error');
      return;
    }

    let caseSkins: Skin[] = [];
    
    if (caseRarity === 'all') {
      // Все скины из выбранных
      caseSkins = selectedSkins
        .map(skinId => {
          const skin = SKINS.find(s => s.id === skinId);
          if (skin && skinImages[skinId]) {
            return { ...skin, image: skinImages[skinId] };
          }
          return skin;
        })
        .filter((s): s is Skin => s !== undefined);
    } else {
      // Скины определённой редкости
      caseSkins = SKINS.filter(s => s.rarity === caseRarity).map(skin => {
        if (skinImages[skin.id]) {
          return { ...skin, image: skinImages[skin.id] };
        }
        return skin;
      });
    }

    if (caseSkins.length === 0) {
      addToast('Выберите хотя бы один скин', 'error');
      return;
    }

    createCase({
      name: caseName,
      price: parseInt(casePrice),
      currency: caseCurrency,
      skins: caseSkins,
      image: '',
    });

    // Сброс формы
    setCaseName('');
    setCasePrice('');
    setSelectedSkins([]);
    setCaseRarity('all');
    setSkinImages({});
    addToast('Кейс создан!', 'success');
  };

  const handleSkinImageUpload = (skinId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Выберите файл изображения', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast('Размер файла не должен превышать 2MB', 'error');
      return;
    }

    setUploadingSkinId(skinId);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSkinImages(prev => ({ ...prev, [skinId]: result }));
      addToast('Изображение загружено', 'success');
      setUploadingSkinId(null);
    };
    reader.onerror = () => {
      addToast('Ошибка загрузки', 'error');
      setUploadingSkinId(null);
    };
    reader.readAsDataURL(file);
  };

  const getSkinImage = (skinId: string): string | null => {
    if (typeof window === 'undefined') return null;
    // Сначала проверяем загруженные в сессии
    if (skinImages[skinId]) return skinImages[skinId];
    // Потом проверяем localStorage
    return localStorage.getItem(`skin_image_${skinId}`);
  };

  const handleCreateCurrency = () => {
    if (!currencyName || !currencySymbol || !currencyPrice) {
      addToast('Заполните все поля', 'error');
      return;
    }

    createCurrency({
      name: currencyName,
      symbol: currencySymbol,
      price: parseFloat(currencyPrice),
      change24h: parseFloat(currencyChange) || 0,
      icon: '',
    });

    // Сброс формы
    setCurrencyName('');
    setCurrencySymbol('');
    setCurrencyPrice('');
    setCurrencyChange('');
  };

  const handleGiveRole = () => {
    if (!targetUserId) {
      addToast('Введите ID пользователя', 'error');
      return;
    }

    giveRole(targetUserId, selectedRole as any);
    setTargetUserId('');
  };

  const handleGiveMoney = () => {
    if (!targetUserId || !moneyAmount) {
      addToast('Заполните все поля', 'error');
      return;
    }

    giveMoney(targetUserId, parseInt(moneyAmount), moneyCurrency as any);
    setTargetUserId('');
    setMoneyAmount('');
  };

  const handleUpdateCrypto = () => {
    if (!cryptoPrice) {
      addToast('Введите цену', 'error');
      return;
    }

    updateCurrencyPrice(selectedCrypto, parseFloat(cryptoPrice), parseFloat(cryptoChange) || 0);
    setCryptoPrice('');
    setCryptoChange('');
  };

  const toggleSkin = (skinId: string) => {
    setSelectedSkins(prev => 
      prev.includes(skinId) 
        ? prev.filter(id => id !== skinId)
        : [...prev, skinId]
    );
  };

  return (
    <div className="page-container">
      <h2 className="section-title">🛠️ Панель разработчика</h2>

      {/* Информация о разработчике */}
      <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--ton-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '40px' }}>👨‍💻</div>
          <div>
            <div style={{ fontWeight: 700 }}>
              {user.role === 'first_developer' ? '👑 First Developer' : 'Developer'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('create-case')}
          style={{
            flex: '0 0 auto',
            padding: '12px 16px',
            background: activeTab === 'create-case' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'create-case' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          📦 Кейс
        </button>
        <button
          onClick={() => setActiveTab('create-currency')}
          style={{
            flex: '0 0 auto',
            padding: '12px 16px',
            background: activeTab === 'create-currency' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'create-currency' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          💰 Создать
        </button>
        <button
          onClick={() => setActiveTab('give-role')}
          style={{
            flex: '0 0 auto',
            padding: '12px 16px',
            background: activeTab === 'give-role' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'give-role' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          👥 Роль
        </button>
        <button
          onClick={() => setActiveTab('give-money')}
          style={{
            flex: '0 0 auto',
            padding: '12px 16px',
            background: activeTab === 'give-money' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'give-money' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          💵 Деньги
        </button>
        <button
          onClick={() => setActiveTab('images')}
          style={{
            flex: '0 0 auto',
            padding: '12px 16px',
            background: activeTab === 'images' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'images' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          🖼️ Картинки
        </button>
        <button
          onClick={() => setActiveTab('crypto')}
          style={{
            flex: '0 0 auto',
            padding: '12px 16px',
            background: activeTab === 'crypto' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'crypto' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          📊 Управление
        </button>
      </div>

      {/* Создание кейса */}
      {activeTab === 'create-case' && (
        <div className="card">
          <h3 className="section-title">Создать кейс</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Название кейса
            </label>
            <input
              type="text"
              value={caseName}
              onChange={e => setCaseName(e.target.value)}
              placeholder="Мифический кейс"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Цена
            </label>
            <input
              type="number"
              value={casePrice}
              onChange={e => setCasePrice(e.target.value)}
              placeholder="1000"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Валюта
            </label>
            <select
              value={caseCurrency}
              onChange={e => setCaseCurrency(e.target.value)}
              className="input-field"
            >
              <option value="kit">KIT 🪙</option>
              <option value="crypto">Crypto 💎</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Редкость скинов в кейсе
            </label>
            <select
              value={caseRarity}
              onChange={e => setCaseRarity(e.target.value as Rarity | 'all')}
              className="input-field"
            >
              <option value="all">Все редкости</option>
              <option value="common">Common (Обычный)</option>
              <option value="rare">Rare (Редкий)</option>
              <option value="epic">Epic (Эпический)</option>
              <option value="legendary">Legendary (Легендарный)</option>
              <option value="mythical">Mythical (Мифический)</option>
            </select>
          </div>

          {caseRarity === 'all' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Выбрать скины вручную ({selectedSkins.length})
              </label>
              <div className="grid grid-3" style={{ gap: '8px' }}>
                {SKINS.map(skin => {
                  const skinImage = getSkinImage(skin.id);
                  
                  return (
                    <div
                      key={skin.id}
                      style={{
                        padding: '12px',
                        background: selectedSkins.includes(skin.id) ? 'var(--ton-blue)' : 'var(--bg-secondary)',
                        border: `2px solid ${selectedSkins.includes(skin.id) ? 'var(--ton-blue)' : getRarityColor(skin.rarity)}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Кнопка выбора скина */}
                      <button
                        onClick={() => toggleSkin(skin.id)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'var(--bg-card)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${getRarityColor(skin.rarity)}`,
                          overflow: 'hidden',
                        }}>
                          {skinImage ? (
                            <img
                              src={skinImage}
                              alt={skin.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '16px' }}>🎨</span>
                          )}
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center' }}>{skin.name}</span>
                        <span 
                          className="badge"
                          style={{
                            fontSize: '8px',
                            background: `${getRarityColor(skin.rarity)}30`,
                            color: getRarityColor(skin.rarity),
                            padding: '2px 6px',
                          }}
                        >
                          {skin.rarity}
                        </span>
                      </button>
                      
                      {/* Кнопка загрузки изображения */}
                      <div style={{ width: '100%', marginTop: '8px' }}>
                        <input
                          type="file"
                          id={`upload-${skin.id}`}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSkinImageUpload(skin.id, file);
                          }}
                        />
                        <label
                          htmlFor={`upload-${skin.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            padding: '6px',
                            background: skinImage ? 'var(--success)20' : 'var(--bg-card)',
                            border: `1px solid ${skinImage ? 'var(--success)' : 'var(--border-color)'}`,
                            borderRadius: '6px',
                            fontSize: '9px',
                            color: skinImage ? 'var(--success)' : 'var(--text-muted)',
                            cursor: uploadingSkinId === skin.id ? 'not-allowed' : 'pointer',
                            width: '100%',
                          }}
                        >
                          {uploadingSkinId === skin.id ? (
                            <>
                              <span className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></span>
                              <span>Загрузка...</span>
                            </>
                          ) : skinImage ? (
                            <>
                              <span>✓</span>
                              <span>Изменено</span>
                            </>
                          ) : (
                            <>
                              <span>📷</span>
                              <span>Загрузить</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {caseRarity !== 'all' && (
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                В кейс будут добавлены все скины редкости <strong style={{ color: getRarityColor(caseRarity) }}>{caseRarity}</strong>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Количество: {SKINS.filter(s => s.rarity === caseRarity).length} шт.
              </div>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleCreateCase}
            style={{ width: '100%' }}
          >
            Создать кейс
          </button>
        </div>
      )}

      {/* Создание криптовалюты */}
      {activeTab === 'create-currency' && (
        <div className="card">
          <h3 className="section-title">💰 Создать криптовалюту</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Название валюты
            </label>
            <input
              type="text"
              value={currencyName}
              onChange={e => setCurrencyName(e.target.value)}
              placeholder="Bitcoin"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Символ/Тикер
            </label>
            <input
              type="text"
              value={currencySymbol}
              onChange={e => setCurrencySymbol(e.target.value)}
              placeholder="BTC"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Цена в KIT ($)
            </label>
            <input
              type="number"
              value={currencyPrice}
              onChange={e => setCurrencyPrice(e.target.value)}
              placeholder="65000"
              className="input-field"
              step="0.000001"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Изменение за 24ч (%)
            </label>
            <input
              type="number"
              value={currencyChange}
              onChange={e => setCurrencyChange(e.target.value)}
              placeholder="2.5"
              className="input-field"
              step="0.1"
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleCreateCurrency}
            style={{ width: '100%' }}
          >
            Создать валюту
          </button>
        </div>
      )}

      {/* Выдача роли */}
      {activeTab === 'give-role' && (
        <div className="card">
          <h3 className="section-title">Выдать роль</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              ID пользователя
            </label>
            <input
              type="text"
              value={targetUserId}
              onChange={e => setTargetUserId(e.target.value)}
              placeholder="123456789"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Роль
            </label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="input-field"
            >
              <option value="user">Пользователь</option>
              <option value="premium">Premium</option>
              <option value="developer">Developer</option>
              {user.role === 'first_developer' && (
                <option value="first_developer">First Developer</option>
              )}
            </select>
          </div>

          <button
            className="btn-primary"
            onClick={handleGiveRole}
            style={{ width: '100%' }}
          >
            Выдать роль
          </button>
        </div>
      )}

      {/* Выдача денег */}
      {activeTab === 'give-money' && (
        <div className="card">
          <h3 className="section-title">Выдать деньги</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              ID пользователя
            </label>
            <input
              type="text"
              value={targetUserId}
              onChange={e => setTargetUserId(e.target.value)}
              placeholder="123456789"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Сумма
            </label>
            <input
              type="number"
              value={moneyAmount}
              onChange={e => setMoneyAmount(e.target.value)}
              placeholder="1000"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Валюта
            </label>
            <select
              value={moneyCurrency}
              onChange={e => setMoneyCurrency(e.target.value)}
              className="input-field"
            >
              <option value="kit">KIT 🪙</option>
              <option value="crypto">Crypto 💎</option>
            </select>
          </div>

          <button
            className="btn-primary"
            onClick={handleGiveMoney}
            style={{ width: '100%' }}
          >
            Выдать деньги
          </button>
        </div>
      )}

      {/* Управление криптовалютой */}
      {activeTab === 'crypto' && (
        <div className="card">
          <h3 className="section-title">💰 Управление криптовалютой</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Выберите валюту
            </label>
            <select
              value={selectedCrypto}
              onChange={e => setSelectedCrypto(e.target.value)}
              className="input-field"
            >
              <option value="crypto">Crypto</option>
              <option value="ton">TON</option>
              <option value="btc">Bitcoin</option>
              <option value="eth">Ethereum</option>
              <option value="not">Notcoin</option>
              <option value="dogs">DOGS</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Новая цена ($)
            </label>
            <input
              type="number"
              value={cryptoPrice}
              onChange={e => setCryptoPrice(e.target.value)}
              placeholder="5.50"
              className="input-field"
              step="0.000001"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Изменение за 24ч (%)
            </label>
            <input
              type="number"
              value={cryptoChange}
              onChange={e => setCryptoChange(e.target.value)}
              placeholder="2.5"
              className="input-field"
              step="0.1"
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleUpdateCrypto}
            style={{ width: '100%' }}
          >
            Обновить цену
          </button>
        </div>
      )}
    </div>
  );
};

function getRarityColor(rarity: Rarity): string {
  const colors: Record<Rarity, string> = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
    mythical: '#ec4899',
  };
  return colors[rarity];
}

export default AdminScreen;
