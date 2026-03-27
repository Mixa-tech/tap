# 🐱 Cat Tapper - Telegram Web App

**Версия:** 1.0.0 Beta  
**First Developer:** Mixazx 👑  
**Лицензия:** MIT  
**Статус:** READY FOR VERCEL ✅

Многофункциональная Telegram Web App игра в стиле TONcoin с механикой кликера, кейсами, биржей, маркетплейсом и системой администрирования.

---

## 🚀 Быстрый старт

### Установка

```bash
git clone https://github.com/YOUR_USERNAME/cat-tapper.git
cd cat-tapper
npm install
```

### Запуск

```bash
npm run dev
```

Открой: `http://localhost:3000`

### Сборка

```bash
npm run build
```

### Деплой на Vercel

```bash
vercel --prod
```

---

## 🎮 Возможности

### Основное
- 🐱 **Тапанье кота** - кликай и зарабатывай KIT
- 🔄 **Перерождения** - до 100 уровней с бонусом +10%
- 🏆 **50 ачивок** - достижения во всех категориях
- 🎨 **15 скинов** - 5 редкостей (Common → Mythical)

### Кейсы
- 📦 **KIT кейсы** - 4 стартовых кейса
- 🔐 **Crypto кейсы** - CS2 рулетка
- 🛠️ **Создание кейсов** - для разработчиков

### Экономика
- 💰 **Криптовалюты** - админы создают сами
- 💱 **Биржа** - покупка/продажа валют
- 🏪 **Маркетплейс** - купля/продажа скинов

### Инвентарь
- 🐱 **Коты** - пассивный доход KIT
- 🎨 **Скины** - бонусы к клику
- ⛏️ **Видеокарты** - майнинг криптовалюты

### Админ-панель
- 📦 Создание кейсов
- 💰 Создание валют
- 👥 Выдача ролей
- 💵 Выдача денег
- 🖼️ Загрузка картинок
- 📊 Управление ценами

### Premium
- ⭐ +20% опыта
- 💰 +20% денег
- 🏪 0% комиссия
- 💱 10% скидки

---

## 🎯 Навигация (10 вкладок)

| Вкладка | Описание |
|---------|----------|
| 🐱 Кликер | Главный экран с котом |
| 📦 KIT Кейсы | Кейсы за KIT |
| 🔐 Crypto Кейсы | CS2 рулетка за крипту |
| 💰 Валюты | Курсы криптовалют |
| 💱 Биржа | Торговля валютами |
| 🏪 Маркет | Купля/продажа скинов |
| 🎒 Инвентарь | Коты, скины, GPU |
| 👤 Профиль | Статистика, настройки |
| 🛠️ Админ | Для разработчиков |
| 🖼️ Картинки | Загрузка изображений |

---

## 🚀 Деплой на Vercel

### Способ 1: Vercel CLI

```bash
# Установи Vercel CLI
npm install -g vercel

# Войди в аккаунт
vercel login

# Задеплой
vercel
```

### Способ 2: GitHub + Vercel

1. **Создай репозиторий на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cat-tapper.git
   git push -u origin main
   ```

2. **Подключи в Vercel:**
   - Зайди на https://vercel.com
   - Нажми "Add New Project"
   - Импортируй GitHub репозиторий
   - Нажми "Deploy"

### Способ 3: Vercel Dashboard

1. Зайди на https://vercel.com/new
2. Нажми "Add New Project"
3. Загрузи файлы проекта
4. Нажми "Deploy"

---

## ⚙️ Настройка

### Измени ID первого разработчика

В файле `src/store/gameStore.ts` найди строку:

```typescript
role: telegramUser.id === 123456789 ? 'first_developer' : 'user',
```

Замени `123456789` на свой Telegram ID.

**Как узнать ID:**
- Напиши боту @userinfobot
- Или используй @RawDataBot

### Настройка Telegram бота

1. **Создай бота:**
   - Отправь @BotFather команду `/newbot`
   - Следуй инструкциям
   - Получи токен и username

2. **Настрой Web App:**
   - Отправь @BotFather команду `/newapp`
   - Выбери своего бота
   - Введи название для кнопки
   - Вставь URL от Vercel: `https://your-project.vercel.app`

3. **Готово!**
   - Бот готов к использованию
   - Web App доступен через кнопку меню

---

## 📁 Структура проекта

```
cat/
├── src/
│   ├── components/
│   │   ├── TapperScreen.tsx
│   │   ├── CasesScreen.tsx
│   │   ├── CryptoCasesScreen.tsx
│   │   ├── CryptoScreen.tsx
│   │   ├── ExchangeScreen.tsx
│   │   ├── MarketplaceScreen.tsx
│   │   ├── InventoryScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── AdminScreen.tsx
│   │   └── ImageUploaderScreen.tsx
│   ├── store/
│   │   └── gameStore.ts
│   ├── data/
│   │   └── gameData.ts
│   ├── types/
│   │   └── index.ts
│   └── index.css
├── public/
│   └── default_cat.svg
├── package.json
├── vercel.json
└── README.md
```

---

## 🛠️ Технологии

- **React:** 18.3
- **TypeScript:** 5.5
- **Vite:** 5.3
- **Zustand:** 4.5
- **Framer Motion:** 11.3

---

## 📊 Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev сервера |
| `npm run build` | Сборка для продакшена |
| `npm run preview` | Предпросмотр сборки |

---

## 🎨 Загрузка картинок

### Через приложение
1. Открой "Админ" → "Картинки"
2. Выбери тип (Кот / Кейс / Скины)
3. Загрузи файл или URL
4. Сохрани

### Через файловую систему
1. Положи файл в `public/`
2. Обнови `src/data/gameData.ts`

**Дефолтный файл:** `public/default_cat.svg`

---

## 👥 Роли

| Роль | Возможности |
|------|-------------|
| **user** | Базовый доступ |
| **premium** | +20% XP, +20% денег, 0% комиссия |
| **developer** | Создание кейсов/валют, выдача ролей |
| **first_developer** | Полный доступ (Mixazx) |

---

## ⚠️ Важно

- Прогресс в LocalStorage (не синхронизируется)
- Для синхронизации нужен backend
- Картинки хранятся в браузере
- Для продакшена используй CDN

---

## 📞 Поддержка

- **First Developer:** Mixazx 👑
- **Версия:** 1.0.0 Beta
- **Лицензия:** MIT
- **Telegram:** @your_bot

---

## 🔗 Ссылки

- [Telegram Web App API](https://core.telegram.org/bots/webapps)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

## 📝 Changelog

### v1.0.0 Beta (Март 2026)
- ✅ Боковая навигационная панель
- ✅ Кнопка скрытия/показа
- ✅ 10 вкладок навигации
- ✅ Создание криптовалют
- ✅ Маркетплейс скинов
- ✅ Премиум функции
- ✅ CS2 рулетка
- ✅ Загрузка картинок

---

**🎉 Готово к деплою! 🎉**

```bash
vercel
```

---

**First Developer:** Mixazx 👑  
**Дата:** Март 2026
