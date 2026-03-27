# 📁 Структура проекта Cat Tapper

```
cat/
├── 📄 package.json              # Зависимости и скрипты
├── 📄 tsconfig.json             # Настройки TypeScript
├── 📄 tsconfig.node.json        # Настройки TypeScript для Node
├── 📄 vite.config.ts            # Конфигурация Vite
├── 📄 vercel.json               # Конфигурация для Vercel
├── 📄 .gitignore                # Игнорируемые файлы
├── 📄 index.html                # HTML шаблон
├── 📄 README.md                 # Основная документация
├── 📄 DEPLOY.md                 # Инструкция по деплою
│
├── 📂 src/
│   ├── 📄 main.tsx              # Точка входа приложения
│   ├── 📄 App.tsx               # Главный компонент
│   ├── 📄 index.css             # Глобальные стили (TONcoin стиль)
│   │
│   ├── 📂 components/           # React компоненты
│   │   ├── 📄 TapperScreen.tsx       # Экран тапанья кота
│   │   ├── 📄 CasesScreen.tsx        # Экран кейсов
│   │   ├── 📄 ExchangeScreen.tsx     # Экран биржи
│   │   ├── 📄 InventoryScreen.tsx    # Экран инвентаря
│   │   ├── 📄 AchievementsScreen.tsx # Экран ачивок
│   │   ├── 📄 ProfileScreen.tsx      # Экран профиля
│   │   └── 📄 AdminScreen.tsx        # Админ панель
│   │
│   ├── 📂 store/                # Zustand хранилище
│   │   └── 📄 gameStore.ts      # Состояние игры и действия
│   │
│   ├── 📂 data/                 # Игровые данные
│   │   └── 📄 gameData.ts       # Скины, коты, GPU, ачивки, валюты
│   │
│   └── 📂 types/                # TypeScript типы
│       └── 📄 index.ts          # Все типы и интерфейсы
│
└── 📂 dist/                     # Собранный проект (после build)
    ├── 📄 index.html
    └── 📂 assets/
        ├── 📄 index-*.css
        └── 📄 index-*.js
```

---

## 🎯 Описание компонентов

### Компоненты (src/components/)

| Компонент | Описание | Функционал |
|-----------|----------|------------|
| **TapperScreen** | Главный экран | Тапанье кота, баланс, статистика, прогресс |
| **CasesScreen** | Кейсы | Покупка/открытие кейсов, инвентарь кейсов |
| **ExchangeScreen** | Биржа | Торговля валютами (TON, BTC, ETH, NOT, DOGS) |
| **InventoryScreen** | Инвентарь | Коты (пассивный доход), скины, видеокарты |
| **AchievementsScreen** | Ачивки | 50 достижений по категориям |
| **ProfileScreen** | Профиль | Статистика, перерождения, настройки |
| **AdminScreen** | Админка | Создание кейсов, выдача ролей/денег (developer+) |

### Хранилище (src/store/)

**gameStore.ts** - Zustand store с persist middleware:
- Состояние пользователя
- Игровая логика (клики, перерождения, кейсы)
- Пассивный доход (коты, майнинг)
- Админ функции (создание кейсов, выдача ролей)
- UI состояние (табы, модалки, уведомления)
- Проверка и разблокировка ачивок

### Данные (src/data/)

**gameData.ts** - Все игровые данные:
- **SKINS** - 15 скинов с 5 редкостями
- **CATS** - 5 котов для пассивного дохода
- **GPUS** - 5 видеокарт для майнинга
- **CURRENCIES** - 6 валют для биржи
- **ACHIEVEMENTS** - 50 ачивок
- **STARTER_CASES** - 4 стартовых кейса

### Типы (src/types/)

**index.ts** - TypeScript интерфейсы:
- `UserRole` - 4 роли (user, premium, developer, first_developer)
- `Rarity` - 5 редкостей (common, rare, epic, legendary, mythical)
- `User` - профиль пользователя
- `Skin`, `Case`, `Cat`, `GPU` - игровые предметы
- `Achievement` - достижения
- `Currency` - валюты

---

## 🎨 Стилевая система

### Цветовая палитра (TONcoin стиль)

```css
--ton-blue: #0088cc          /* Основной синий */
--ton-blue-dark: #006699     /* Тёмный синий */
--ton-blue-light: #33aadd    /* Светлый синий */
--ton-gradient: linear-gradient(135deg, #0088cc, #00d4ff)

--bg-primary: #0f0f0f        /* Основной фон */
--bg-secondary: #1a1a2e      /* Вторичный фон */
--bg-card: #16213e           /* Фон карточек */

--text-primary: #ffffff      /* Основной текст */
--text-secondary: #a0a0a0    /* Вторичный текст */
--text-muted: #666666        /* Приглушенный текст */

--rarity-common: #9ca3af     /* Обычный */
--rarity-rare: #3b82f6       /* Редкий */
--rarity-epic: #a855f7       /* Эпический */
--rarity-legendary: #f59e0b  /* Легендарный */
--rarity-mythical: #ec4899   /* Мифический */
```

### Анимации

- `float-animation` - плавное парение
- `click-animation` - эффект нажатия
- `coin-spin` - вращение монеты
- `mythical-pulse` - пульсация мифических предметов
- `slide-down` - появление уведомлений

---

## 🔧 Технологический стек

| Категория | Технология |
|-----------|------------|
| **Framework** | React 18.3 |
| **Language** | TypeScript 5.5 |
| **Bundler** | Vite 5.3 |
| **State** | Zustand 4.5 |
| **Router** | React Router 6.26 |
| **HTTP** | Axios 1.7 |
| **Animations** | Framer Motion 11.3 |
| **Styling** | CSS Variables |
| **Hosting** | Vercel |

---

## 🎮 Игровая механика

### Экономика

```
Клик по коту
    ↓
Получение KIT
    ↓
Покупка кейсов → Получение скинов → Бонус к клику
    ↓
Покупка котов → Пассивный доход KIT
    ↓
Покупка GPU → Майнинг crypto
    ↓
Биржа → Торговля валютами
    ↓
Перерождение → +10% к доходу (макс. 100)
    ↓
Ачивки → Награды KIT
```

### Система редкостей

| Редкость | Цвет | Шанс | Пример |
|----------|------|------|--------|
| Common | Серый | 40% | Обычный кот |
| Rare | Синий | 25% | Сиамский кот |
| Epic | Фиолетовый | 15% | Бенгальский кот |
| Legendary | Золотой | 8% | Золотой кот |
| Mythical | Розовый | 2% | TON кот |

### Роли пользователей

| Роль | Возможности |
|------|-------------|
| **user** | Базовый доступ ко всем функциям |
| **premium** | Расширенные возможности (будущее) |
| **developer** | Создание кейсов, выдача ролей/денег |
| **first_developer** | Полный доступ + выдача developer |

---

## 📊 Метрики проекта

- **Файлов:** 20+
- **Строк кода:** 3000+
- **Компонентов:** 7
- **Ачивок:** 50
- **Скинов:** 15
- **Валют:** 6
- **Котов:** 5
- **Видеокарт:** 5
- **Кейсов:** 4 + кастомные

---

## 🚀 Команды для разработки

```bash
npm run dev      # Запуск dev сервера (http://localhost:3000)
npm run build    # Сборка для продакшена
npm run preview  # Предпросмотр сборки
npm run lint     # Проверка кода
```

---

**First Developer:** Mixazx  
**Версия:** 1.0.0  
**Лицензия:** MIT
