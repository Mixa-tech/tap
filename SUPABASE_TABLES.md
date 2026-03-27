# 🗄️ Настройка таблиц Supabase

## ✅ Ключи сохранены

Твои ключи уже в файле `.env`:
- ✅ Project URL: `https://mtqipnquewskgqvgcjvq.supabase.co`
- ✅ Anon Key: сохранён

---

## 📋 Шаг 1: Создай таблицы

### 1. Открой SQL Editor

Перейди по ссылке:
**https://supabase.com/dashboard/project/mtqipnquewskgqvgcjvq/sql/new**

### 2. Выполни SQL запрос

Скопируй и вставь этот код:

```sql
-- Таблица пользователей
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user',
  level INTEGER DEFAULT 1,
  rebirths INTEGER DEFAULT 0,
  experience INTEGER DEFAULT 0,
  kit INTEGER DEFAULT 1000,
  crypto NUMERIC DEFAULT 0,
  custom_currencies JSONB DEFAULT '[]',
  total_clicks INTEGER DEFAULT 0,
  total_kit_earned INTEGER DEFAULT 0,
  total_cases_opened INTEGER DEFAULT 0,
  skins JSONB DEFAULT '[]',
  cats JSONB DEFAULT '[]',
  cases JSONB DEFAULT '[]',
  gpus JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  equipped_skin TEXT,
  last_login BIGINT,
  last_passive_income BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица криптовалют (создаются админами)
CREATE TABLE currencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  price NUMERIC NOT NULL,
  change_24h NUMERIC DEFAULT 0,
  icon TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица кейсов (создаются админами)
CREATE TABLE cases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL,
  skins JSONB NOT NULL,
  image TEXT,
  creator_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для скорости
CREATE INDEX idx_users_telegram ON users(telegram_id);
CREATE INDEX idx_currencies_symbol ON currencies(symbol);
CREATE INDEX idx_cases_creator ON cases(creator_id);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_currencies_updated_at BEFORE UPDATE ON currencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Нажми "Run"

Должно появиться: **"Success. No rows returned"**

---

## ✅ Шаг 2: Проверь что таблицы созданы

1. Перейди в **Table Editor** (слева в меню)
2. Должны быть 3 таблицы:
   - ✅ `users`
   - ✅ `currencies`
   - ✅ `cases`

---

## 🎯 Шаг 3: Настрой доступ (RLS)

### Отключи RLS для начала (для тестирования)

Выполни в SQL Editor:

```sql
-- Отключаем RLS для тестирования
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE currencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE cases DISABLE ROW LEVEL SECURITY;
```

**⚠️ Важно:** Для продакшена нужно настроить RS правила!

---

## 📝 Шаг 4: Проверь подключение

### 1. Открой консоль браузера

На сайте игры (http://localhost:3000):
- Нажми **F12**
- Открой вкладку **Console**

### 2. Введи команду:

```javascript
console.log('Supabase:', window.supabase)
```

Если нет ошибок - всё работает!

---

## 🎉 Готово!

Теперь у тебя есть:
- ✅ База данных для пользователей
- ✅ Таблица для криптовалют (админы создают)
- ✅ Таблица для кейсов (админы создают)
- ✅ Индексы для скорости
- ✅ Триггеры для updated_at

---

## 📞 Если что-то не работает

### Ошибка "relation already exists":
Таблицы уже созданы. Удали и создай заново:
```sql
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS currencies;
DROP TABLE IF EXISTS users;
```

### Ошибка "permission denied":
У тебя недостаточно прав. Проверь что ты owner проекта.

### Таблицы не отображаются:
Обнови страницу (F5) в Table Editor.

---

**First Developer:** Mixazx 👑  
**Проект:** mtqipnquewskgqvgcjvq  
**Статус:** База готова ✅
