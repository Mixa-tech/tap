# 🚀 Инструкция по деплою на Vercel

## ✅ Проект готов к релизу!

**Версия:** 1.0.0 Beta  
**Сборка:** Успешна ✅  
**Размер:** 249 KB JS (69 KB gzip)

---

## 📋 Чеклист перед деплоем

- [x] Сборка работает (`npm run build`)
- [x] vercel.json настроен
- [x] README.md обновлён
- [x] .vercelignore создан
- [x] package.json оптимизирован
- [ ] Изменён ID разработчика (если нужно)
- [ ] Подготовлен Telegram бот

---

## 🔧 Быстрый деплой (3 способа)

### Способ 1: Vercel CLI (Рекомендуется) ⭐

```bash
# 1. Установи Vercel CLI (если нет)
npm install -g vercel

# 2. Войди в аккаунт
vercel login

# 3. Перейди в папку проекта
cd d:\telegram\cat

# 4. Задеплой
vercel

# 5. Следуй инструкциям:
#    - Set up and deploy? Y
#    - Which scope? (выбери аккаунт)
#    - Link to existing project? N
#    - Project name? cat-tapper-ton
#    - Directory? ./ (по умолчанию)
#    - Override settings? N

# 6. Готово! Получишь URL:
#    https://cat-tapper-ton.vercel.app
```

**Прод-деплой:**
```bash
vercel --prod
```

---

### Способ 2: GitHub + Vercel (Автоматический CI/CD) 🔄

```bash
# 1. Создай репозиторий на GitHub
git init
git add .
git commit -m "🎉 Cat Tapper v1.0.0 Beta - Ready for release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cat-tapper.git
git push -u origin main
```

**Далее:**
1. Зайди на https://vercel.com
2. Нажми **"Add New Project"**
3. Выбери **"Import Git Repository"**
4. Найди свой репозиторий `cat-tapper`
5. Нажми **"Import"**
6. Оставь настройки по умолчанию
7. Нажми **"Deploy"**

**Преимущества:**
- ✅ Автоматический деплой при push в main
- ✅ Preview для каждого PR
- ✅ История деплоев
- ✅ Откат к предыдущим версиям

---

### Способ 3: Vercel Dashboard (Через браузер) 🌐

1. Зайди на https://vercel.com/new
2. Нажми **"Add New Project"**
3. Выбери **"Deploy from Git"** или **"Deploy from Folder"**
4. Если из папки:
   - Перетащи папку `cat` в браузер
   - Или выбери через файловый диалог
5. Нажми **"Deploy"**

---

## ⚙️ Настройка после деплоя

### 1. Измени ID разработчика

В файле `src/store/gameStore.ts` (строка ~165):

```typescript
role: telegramUser.id === 123456789 ? 'first_developer' : 'user',
```

Замени `123456789` на свой Telegram ID.

**Как узнать ID:**
- Напиши @userinfobot в Telegram
- Или @RawDataBot

**После изменения:**
```bash
git add .
git commit -m "Update developer ID"
git push
# Vercel автоматически пересоберёт
```

### 2. Настрой Telegram бота

**Создание бота:**
```
1. Отправь @BotFather команду /newbot
2. Введи название бота
3. Введи username бота
4. Получи токен (сохрани!)
```

**Настройка Web App:**
```
1. Отправь @BotFather команду /newapp
2. Выбери своего бота
3. Введи название для кнопки (например, "🎮 Играть")
4. Вставь URL от Vercel: https://your-project.vercel.app
5. Введи короткое описание
```

**Готово!** Бот готов к использованию.

---

## 📊 Мониторинг после деплоя

### Логи Vercel
```bash
# Просмотр логов
vercel logs

# Логи в реальном времени
vercel logs --follow
```

### Vercel Dashboard
1. Зайди на https://vercel.com
2. Выбери проект
3. Вкладка **"Deployments"** - история деплоев
4. Вкладка **"Analytics"** - статистика (если включена)
5. Вкладка **"Settings"** - настройки

---

## 🔧 Решение проблем

### Ошибка: Build failed

**Проверь локально:**
```bash
npm run build
```

**Исправь ошибки и задеплой снова:**
```bash
vercel --prod
```

### Ошибка: 404 после деплоя

**Проверь vercel.json:**
- Убедись что `outputDirectory: "dist"`
- Проверь routes для SPA

### Приложение не открывается в Telegram

**Проверь:**
1. URL правильный (https://)
2. Vercel деплой успешен
3. Telegram WebApp инициализирован

**В консоли браузера (F12):**
- Проверь ошибки
- Убедись что Telegram.WebApp загружен

---

## 🎯 Оптимизация для продакшена

### 1. Включи Analytics (опционально)

В `vercel.json`:
```json
{
  "analytics": {
    "enabled": true
  }
}
```

### 2. Настрой домен (опционально)

```bash
# Привяжи свой домен
vercel domains add cat-tapper.com
```

### 3. Включи Edge Caching

Vercel автоматически кэширует статику на edge.

### 4. Оптимизируй картинки

Используй CDN для изображений:
- Vercel Blob Storage
- Cloudinary
- Imgix

---

## 📈 Метрики проекта

| Показатель | Значение |
|------------|----------|
| **Размер JS** | 249 KB (69 KB gzip) |
| **Размер CSS** | 8.7 KB (2.4 KB gzip) |
| **Время сборки** | ~10 секунд |
| **Время деплоя** | ~30 секунд |
| **Компонентов** | 10 |
| **Вкладок** | 10 |

---

## 🎉 После успешного деплоя

### Проверь всё ли работает:

1. ✅ Открой URL в браузере
2. ✅ Проверь все 10 вкладок
3. ✅ Протестируй кликер
4. ✅ Открой кейс
5. ✅ Проверь админ-панель
6. ✅ Загрузи картинку
7. ✅ Создай криптовалюту

### Поделись с миром:

```
🎉 Cat Tapper v1.0.0 Beta уже доступен!

🐱 Тапай кота
📦 Открывай кейсы
💰 Торгуй на бирже
🏪 Продавай скины

Play now: https://your-project.vercel.app

#TelegramWebApp #TON #Crypto #Game
```

---

## 📞 Поддержка

- **First Developer:** Mixazx 👑
- **Версия:** 1.0.0 Beta
- **Документация:** README.md
- **Vercel Docs:** https://vercel.com/docs

---

## 🎯 Следующие шаги

1. ✅ Задеплой на Vercel
2. ✅ Настрой Telegram бота
3. ✅ Протестируй все функции
4. ✅ Расскажи друзьям!

---

**🚀 Успешного деплоя! 🚀**

```bash
vercel
```

---

**First Developer:** Mixazx 👑  
**Дата:** Март 2026  
**Лицензия:** MIT
