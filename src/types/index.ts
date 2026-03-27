// Роли пользователей
export type UserRole = 'user' | 'premium' | 'developer' | 'first_developer';

// Редкость предметов
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';

// Типы валют
export interface Currency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: string;
}

// Скины
export interface Skin {
  id: string;
  name: string;
  rarity: Rarity;
  chance: number; // Шанс выпадения в процентах
  image: string;
  bonus?: number; // Бонус к клику или пассивному доходу
  description: string;
}

// Кейсы
export interface Case {
  id: string;
  name: string;
  price: number;
  currency: string; // KIT или другая валюта
  skins: Skin[];
  image: string;
  creatorId?: string; // ID создателя (developer)
}

// Коты
export interface Cat {
  id: string;
  name: string;
  rarity: Rarity;
  image: string;
  passiveIncome: number; // KIT в час
  bonusClick?: number; // Бонус к клику
  description: string;
}

// Видеокарты для майнинга
export interface GPU {
  id: string;
  name: string;
  hashRate: number; // MH/s
  powerConsumption: number; // W
  price: number;
  currency: string;
  image: string;
}

// Майнинг ферма
export interface MiningFarm {
  id: string;
  name: string;
  gpus: { gpuId: string; count: number }[];
  totalHashRate: number;
  totalPower: number;
  cryptoEarned: number;
}

// Ачивки
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  reward: number; // KIT награда
  unlocked: boolean;
  category: 'clicks' | 'rebirths' | 'earnings' | 'cases' | 'cats' | 'mining';
}

// Пользователь
export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  
  // Прогресс
  level: number;
  rebirths: number;
  experience: number;
  
  // Валюты
  kit: number;
  crypto: number;
  customCurrencies?: { currencyId: string; amount: number }[]; // Пользовательские валюты
  
  // Статистика
  totalClicks: number;
  totalKitEarned: number;
  totalCasesOpened: number;
  
  // Инвентарь
  skins: { skinId: string; count: number }[];
  cats: { catId: string; count: number; level: number }[];
  cases: { caseId: string; count: number }[];
  gpus: { gpuId: string; count: number }[];
  
  // Активное
  equippedSkin?: string;
  miningFarm?: MiningFarm;
  
  // Ачивки
  achievements: string[]; // ID разблокированных ачивок
  
  // Время последнего входа
  lastLogin: number;
  lastPassiveIncome: number;
}

// Настройки игры
export interface GameSettings {
  rebirthCost: number;
  baseClickValue: number;
  rebirthMultiplier: number;
  maxRebirths: number;
}

// Данные для авторизации Telegram
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramWebAppInitData {
  user?: TelegramUser;
  hash: string;
  auth_date: number;
}
