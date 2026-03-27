# 🗄️ Настройка Supabase для синхронизации данных

## 📋 Что даст Supabase

- ✅ **Синхронизация прогресса** между устройствами
- ✅ **Общие данные** - все видят созданные админами валюты и кейсы
- ✅ **Real-time** - изменения видны сразу всем
- ✅ **Бесплатно** - 500MB базы данных

---

## 🚀 Настройка Supabase

### 1. Создай проект

1. Зайди на https://supabase.com
2. Нажми **"Start your project"**
3. Залогинься через GitHub
4. Нажми **"New Project"**
5. Заполни:
   - **Name:** cat-tapper
   - **Database Password:** (запомни!)
   - **Region:**选择 ближайший (Frankfurt для Европы)
6. Нажми **"Create new project"**

**Жди 2-3 минуты** пока создастся проект.

---

### 2. Создай таблицы

В панели Supabase перейди в **SQL Editor** и выполни:

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

-- Таблица скинов (кастомные изображения)
CREATE TABLE skins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  chance NUMERIC,
  image TEXT,
  bonus NUMERIC DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица листингов на маркетплейсе
CREATE TABLE marketplace_listings (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL,
  seller_name TEXT,
  skin_id TEXT NOT NULL,
  skin_data JSONB,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для скорости
CREATE INDEX idx_users_telegram ON users(telegram_id);
CREATE INDEX idx_currencies_symbol ON currencies(symbol);
CREATE INDEX idx_cases_creator ON cases(creator_id);
CREATE INDEX idx_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_listings_status ON marketplace_listings(status);

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

---

### 3. Получи credentials

В панели Supabase:

1. Перейди в **Settings** → **API**
2. Скопируй:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbG...` (длинная строка)

---

## 💻 Интеграция в проект

### 1. Установи Supabase клиент

```bash
cd cat
npm install @supabase/supabase-js
```

### 2. Создай файл конфигурации

Создай `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы
export type User = {
  id: string;
  telegram_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  kit: number;
  crypto: number;
  // ... остальные поля
};

export type Currency = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change_24h: number;
  icon?: string;
  created_by?: string;
};

export type Case = {
  id: string;
  name: string;
  price: number;
  currency: string;
  skins: any[];
  image?: string;
  creator_id?: string;
};
```

### 3. Обнови gameStore.ts

Добавь импорт и функции для работы с Supabase:

```typescript
import { supabase } from '../lib/supabase';

// В initUser добавь загрузку с сервера
const loadUserFromServer = async (telegramId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();
  
  if (data && !error) {
    return data;
  }
  return null;
};

// Сохранение пользователя
const saveUserToServer = async (user: User) => {
  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      telegram_id: user.telegramId,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      kit: user.kit,
      crypto: user.crypto,
      // ... остальные поля
      updated_at: new Date().toISOString(),
    });
  
  if (error) console.error('Error saving user:', error);
};

// Загрузка криптовалют
const loadCurrencies = async () => {
  const { data, error } = await supabase
    .from('currencies')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (data && !error) {
    return data;
  }
  return [];
};

// Загрузка кейсов
const loadCases = async () => {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (data && !error) {
    return data;
  }
  return [];
};

// Создание криптовалюты (admin)
const createCurrencyServer = async (currency: any) => {
  const { error } = await supabase
    .from('currencies')
    .insert({
      id: currency.id,
      name: currency.name,
      symbol: currency.symbol,
      price: currency.price,
      change_24h: currency.change24h,
      icon: currency.icon,
      created_by: currency.creatorId,
    });
  
  return !error;
};

// Создание кейса (admin)
const createCaseServer = async (caseData: any) => {
  const { error } = await supabase
    .from('cases')
    .insert({
      id: caseData.id,
      name: caseData.name,
      price: caseData.price,
      currency: caseData.currency,
      skins: caseData.skins,
      image: caseData.image,
      creator_id: caseData.creatorId,
    });
  
  return !error;
};
```

---

### 4. Обнови AdminScreen.tsx

Замени создание валют и кейсов на серверные функции:

```typescript
// Вместо localStorage
const handleCreateCurrency = async () => {
  const success = await createCurrencyServer({
    id: `custom_${Date.now()}`,
    name: currencyName,
    symbol: currencySymbol,
    price: parseFloat(currencyPrice),
    change24h: parseFloat(currencyChange) || 0,
    icon: '',
    creatorId: user.id,
  });
  
  if (success) {
    addToast('Валюта создана и синхронизирована!', 'success');
    // Загрузить обновлённый список
    const currencies = await loadCurrencies();
    // Обновить состояние
  }
};
```

---

### 5. Создай .env.local

```bash
# В корне проекта
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

**Добавь .env.local в .gitignore:**
```
.env.local
```

---

## 🎯 Что изменится

### До (LocalStorage):
- ❌ Данные только на одном устройстве
- ❌ Админ создаёт - другие не видят
- ❌ При очистке кэша всё теряется

### После (Supabase):
- ✅ Прогресс синхронизируется
- ✅ Все видят созданные админами валюты и кейсы
- ✅ Данные сохраняются навсегда
- ✅ Можно играть с разных устройств

---

## 📊 Бесплатные лимиты Supabase

| Ресурс | Лимит |
|--------|-------|
| **База данных** | 500 MB |
| **Пользователи** | Безлимитно |
| **API запросы** | 50,000/мес |
| **Хранилище** | 1 GB |
| **Real-time** | 50 подключений |

**Для игры хватит на долго!**

---

## 🔧 Альтернативы

### Если не хочешь Supabase:

#### 1. **Firebase (бесплатно)**
```bash
npm install firebase
```

#### 2. **Appwrite (бесплатно)**
```bash
npm install appwrite
```

#### 3. **PocketBase (бесплатно, self-hosted)**
```bash
npm install pocketbase
```

---

## 📞 Помощь

Если нужна помощь с настройкой:
1. Создай проект на Supabase
2. Выполни SQL запросы
3. Скопируй credentials
4. Установи пакет
5. Создай файл supabase.ts

**Готово!**

---

**First Developer:** Mixazx 👑  
**Дата:** Март 2026
