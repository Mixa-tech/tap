# 🚀 Инструкция по запуску и деплою

## 📋 Быстрый старт

### 1. Запуск локально

```bash
# Перейдите в папку проекта
cd cat

# Установите зависимости (если ещё не установлены)
npm install

# Запустите режим разработки
npm run dev
```

Откройте браузер по адресу `http://localhost:3000`

### 2. Сборка для продакшена

```bash
# Сборка проекта
npm run build

# Предпросмотр сборки
npm run preview
```

Собранные файлы будут в папке `dist/`

---

## 🌐 Деплой на Vercel

### Способ 1: Через Vercel CLI (рекомендуется)

```bash
# 1. Установите Vercel CLI глобально
npm install -g vercel

# 2. Войдите в аккаунт Vercel
vercel login

# 3. Перейдите в папку проекта
cd cat

# 4. Задеплойте проект
vercel

# 5. Следуйте инструкциям в терминале:
#    - Set up and deploy? Y
#    - Which scope? (выберите ваш аккаунт)
#    - Link to existing project? N
#    - Project name? cat-tapper-ton
#    - Directory? ./ (по умолчанию)
#    - Override settings? N

# 6. После деплоя получите URL вида:
#    https://cat-tapper-ton.vercel.app
```

### Способ 2: Через GitHub + Vercel

1. **Создайте репозиторий на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cat-tapper-ton.git
   git push -u origin main
   ```

2. **Подключите репозиторий в Vercel:**
   - Зайдите на https://vercel.com
   - Нажмите "Add New Project"
   - Импортируйте GitHub репозиторий
   - Vercel автоматически определит настройки
   - Нажмите "Deploy"

3. **Готово!** Получите URL для доступа к приложению

---

## 🤗 Интеграция с Telegram Bot

### 1. Создайте бота в @BotFather

```
/newbot
```

Следуйте инструкциям, получите токен бота и username

### 2. Настройте Web App

1. Отправьте @BotFather команду:
   ```
   /newapp
   ```

2. Выберите вашего бота

3. Введите название для кнопки меню

4. Введите URL вашего приложения (полученный на Vercel):
   ```
   https://cat-tapper-ton.vercel.app
   ```

5. Введите короткое название для кнопки

### 3. Запуск Web App

Теперь пользователи могут открывать приложение:
- Через кнопку меню в боте
- По прямой ссылке: `t.me/YOUR_BOT_NAME/app`

### 4. (Опционально) Добавьте кнопку для запуска

Отправьте это сообщение в боте:
```
/play - 🎮 Играть в Cat Tapper
```

---

## ⚙️ Настройка для продакшена

### 1. Обновите ID первого разработчика

В файле `src/store/gameStore.ts` найдите строку:

```typescript
role: telegramUser.id === 123456789 ? 'first_developer' : 'user',
```

Замените `123456789` на ваш Telegram ID

**Как узнать свой Telegram ID:**
- Напишите боту @userinfobot
- Или используйте @RawDataBot

### 2. Настройте CORS (если нужен backend)

Для текущей версии с localStorage CORS не требуется

### 3. Включите HTTPS

Vercel автоматически предоставляет HTTPS

---

## 📊 Мониторинг и аналитика

### Логи Vercel

```bash
# Просмотр логов деплоя
vercel logs

# Логи в реальном времени
vercel logs --follow
```

### Telegram Web App Analytics

Добавьте метрику в `src/main.tsx`:

```typescript
// После инициализации Telegram
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.MainButton.setParams({
    text: 'CLOSE',
    isVisible: true,
  });
}
```

---

## 🔧 Troubleshooting

### Ошибка при деплое

**Проблема:** `Build failed`
**Решение:**
```bash
# Проверьте сборку локально
npm run build

# Исправьте ошибки TypeScript
# Задеплойте снова
vercel --prod
```

### Приложение не открывается в Telegram

**Проблема:** Белый экран
**Решение:**
1. Проверьте консоль браузера (F12)
2. Убедитесь что URL правильный
3. Проверьте CORS политики

### Прогресс не сохраняется

**Проблема:** Данные теряются после перезагрузки
**Решение:**
- Проверьте что localStorage доступен
- Очистите кэш Telegram: Настройки → Данные и память → Использование памяти → Очистить кэш

---

## 📱 Тестирование на разных устройствах

### Desktop
- Откройте браузер
- Перейдите по URL приложения
- Используйте Telegram Desktop

### Mobile
- Откройте Telegram
- Запустите бота
- Нажмите кнопку Web App

### Планшеты
- Адаптивный дизайн автоматически подстраивается

---

## 🎯 Что дальше?

### 1. Добавьте backend для синхронизации

Создайте API для сохранения прогресса:
- Node.js + Express
- MongoDB / PostgreSQL
- JWT авторизация

### 2. Добавьте реальные платежи

- Telegram Stars
- TON Connect для криптовалюты

### 3. Улучшите игру

- Новые скины и кейсы
- PvP режим
- Турниры и лидерборды
- Реферальная система

---

## 📞 Поддержка

- **First Developer:** Mixazx
- **Версия:** 1.0.0
- **Лицензия:** MIT

---

**Удачи в запуске! 🚀**
