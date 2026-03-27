import React, { useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const ImageUploaderScreen: React.FC = () => {
  const { addToast } = useGameStore();
  const [activeTab, setActiveTab] = useState<'cat' | 'case' | 'skin'>('cat');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      addToast('Выберите файл изображения', 'error');
      return;
    }

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Размер файла не должен превышать 5MB', 'error');
      return;
    }

    // Чтение файла
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      addToast('Изображение загружено', 'success');
    };
    reader.onerror = () => {
      addToast('Ошибка загрузки файла', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlLoad = () => {
    if (!imageUrl) {
      addToast('Введите URL изображения', 'error');
      return;
    }

    // Проверка URL
    const img = new Image();
    img.onload = () => {
      setSelectedImage(imageUrl);
      addToast('Изображение загружено', 'success');
    };
    img.onerror = () => {
      addToast('Не удалось загрузить изображение по URL', 'error');
    };
    img.src = imageUrl;
  };

  const handleSave = () => {
    if (!selectedImage) {
      addToast('Сначала загрузите изображение', 'error');
      return;
    }

    // Сохранение в localStorage
    const storageKey = `custom_image_${activeTab}`;
    localStorage.setItem(storageKey, selectedImage);
    
    addToast('Изображение сохранено', 'success');
    
    // Перезагрузка страницы для применения
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleReset = () => {
    const storageKey = `custom_image_${activeTab}`;
    localStorage.removeItem(storageKey);
    setSelectedImage(null);
    setImageUrl('');
    addToast('Изображение сброшено', 'success');
  };

  // Загрузка сохранённого изображения
  React.useEffect(() => {
    const storageKey = `custom_image_${activeTab}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setSelectedImage(saved);
    }
  }, [activeTab]);

  return (
    <div className="page-container">
      <h2 className="section-title">🖼️ Загрузка картинок</h2>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => {
            setActiveTab('cat');
            setSelectedImage(null);
            setImageUrl('');
          }}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'cat' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'cat' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🐱 Кот
        </button>
        <button
          onClick={() => {
            setActiveTab('case');
            setSelectedImage(null);
            setImageUrl('');
          }}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'case' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'case' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          📦 Кейс
        </button>
        <button
          onClick={() => {
            setActiveTab('skin');
            setSelectedImage(null);
            setImageUrl('');
          }}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'skin' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '12px',
            color: activeTab === 'skin' ? 'white' : 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🎨 Скины
        </button>
      </div>

      {/* Информация */}
      <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--ton-blue)' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          <strong>💡 Как использовать:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Загрузите изображение для {activeTab === 'cat' ? 'кота' : activeTab === 'case' ? 'кейса' : 'скина'}</li>
            <li>Изображение сохранится в памяти устройства</li>
            <li>Файл будет называться: <code style={{ background: '#222', padding: '2px 6px', borderRadius: '4px' }}>custom_{activeTab}.png</code></li>
            <li>Максимальный размер: 5MB</li>
            <li>Поддерживаемые форматы: PNG, JPG, GIF, WEBP</li>
          </ul>
        </div>
      </div>

      {/* Загрузка */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Загрузить изображение</h3>

        {/* Выбор способа загрузки */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setUploadType('file')}
            style={{
              flex: 1,
              padding: '10px',
              background: uploadType === 'file' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
              border: 'none',
              borderRadius: '8px',
              color: uploadType === 'file' ? 'white' : 'var(--text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📁 Файл
          </button>
          <button
            onClick={() => setUploadType('url')}
            style={{
              flex: 1,
              padding: '10px',
              background: uploadType === 'url' ? 'var(--ton-blue)' : 'var(--bg-secondary)',
              border: 'none',
              borderRadius: '8px',
              color: uploadType === 'url' ? 'white' : 'var(--text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🔗 URL
          </button>
        </div>

        {/* Загрузка файла */}
        {uploadType === 'file' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', marginBottom: '12px' }}
            >
              📷 Выбрать файл
            </button>
          </div>
        )}

        {/* Загрузка по URL */}
        {uploadType === 'url' && (
          <div style={{ marginBottom: '12px' }}>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              className="input-field"
              style={{ marginBottom: '12px' }}
            />
            <button
              className="btn-primary"
              onClick={handleUrlLoad}
              style={{ width: '100%' }}
            >
              Загрузить по URL
            </button>
          </div>
        )}
      </div>

      {/* Предпросмотр */}
      {selectedImage && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 className="section-title">Предпросмотр</h3>
          <div style={{
            width: '100%',
            height: '200px',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}

      {/* Кнопки действий */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={!selectedImage}
          style={{ flex: 1 }}
        >
          💾 Сохранить
        </button>
        <button
          className="btn-secondary"
          onClick={handleReset}
          style={{ flex: 1 }}
        >
          🗑️ Сбросить
        </button>
      </div>

      {/* Список сохранённых изображений */}
      <div style={{ marginTop: '24px' }}>
        <h3 className="section-title">Сохранённые изображения</h3>
        <div className="grid" style={{ gap: '12px' }}>
          {['cat', 'case', 'skin'].map(type => {
            const saved = localStorage.getItem(`custom_image_${type}`);
            return (
              <div key={type} className="card" style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    {saved ? (
                      <img
                        src={saved}
                        alt={type}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '24px', opacity: 0.3 }}>
                        {type === 'cat' ? '🐱' : type === 'case' ? '📦' : '🎨'}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {type === 'cat' ? 'Кот' : type === 'case' ? 'Кейс' : 'Скин'}
                    </div>
                    <div style={{ fontSize: '12px', color: saved ? 'var(--success)' : 'var(--text-muted)' }}>
                      {saved ? '✓ Загружено' : '✗ Не загружено'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageUploaderScreen;
