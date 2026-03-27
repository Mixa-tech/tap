import { Skin, Cat, GPU, Achievement, Currency } from '../types';

// Скины с разными шансами выпадения
export const SKINS: Skin[] = [
  // Common (шанс 40%)
  { id: 'skin_1', name: 'Обычный', rarity: 'common', chance: 40, image: '', description: 'Обычный скин', bonus: 1 },
  { id: 'skin_2', name: 'Серый', rarity: 'common', chance: 40, image: '', description: 'Серый скин', bonus: 1 },
  { id: 'skin_3', name: 'Рыжий', rarity: 'common', chance: 40, image: '', description: 'Рыжий скин', bonus: 1.1 },
  
  // Rare (шанс 25%)
  { id: 'skin_4', name: 'Сиамский', rarity: 'rare', chance: 25, image: '', description: 'Сиамский скин', bonus: 1.2 },
  { id: 'skin_5', name: 'Персидский', rarity: 'rare', chance: 25, image: '', description: 'Персидский скин', bonus: 1.25 },
  { id: 'skin_6', name: 'Мейн-кун', rarity: 'rare', chance: 25, image: '', description: 'Мейн-кун скин', bonus: 1.3 },
  
  // Epic (шанс 15%)
  { id: 'skin_7', name: 'Бенгальский', rarity: 'epic', chance: 15, image: '', description: 'Бенгальский скин', bonus: 1.5 },
  { id: 'skin_8', name: 'Сфинкс', rarity: 'epic', chance: 15, image: '', description: 'Сфинкс скин', bonus: 1.6 },
  { id: 'skin_9', name: 'Шотландский', rarity: 'epic', chance: 15, image: '', description: 'Шотландский скин', bonus: 1.55 },
  
  // Legendary (шанс 8%)
  { id: 'skin_10', name: 'Золотой', rarity: 'legendary', chance: 8, image: '', description: 'Золотой скин', bonus: 2 },
  { id: 'skin_11', name: 'Алмазный', rarity: 'legendary', chance: 8, image: '', description: 'Алмазный скин', bonus: 2.2 },
  { id: 'skin_12', name: 'Космический', rarity: 'legendary', chance: 8, image: '', description: 'Космический скин', bonus: 2.5 },
  
  // Mythical (шанс 2%)
  { id: 'skin_13', name: 'Божественный', rarity: 'mythical', chance: 2, image: '', description: 'Божественный скин', bonus: 3 },
  { id: 'skin_14', name: 'TON', rarity: 'mythical', chance: 2, image: '', description: 'TON скин', bonus: 3.5 },
  { id: 'skin_15', name: 'Разработчик', rarity: 'mythical', chance: 1, image: '', description: 'Скин разработчика', bonus: 5 },
];

// Коты для инвентаря (пассивный доход)
export const CATS: Cat[] = [
  { id: 'cat_1', name: 'Дворовый', rarity: 'common', image: '', passiveIncome: 10, description: 'Простой кот для старта' },
  { id: 'cat_2', name: 'Учёный', rarity: 'rare', image: '', passiveIncome: 25, description: 'Умный кот с дипломом' },
  { id: 'cat_3', name: 'Бизнесмен', rarity: 'epic', image: '', passiveIncome: 50, description: 'Зарабатывает пока вы спите' },
  { id: 'cat_4', name: 'Магнат', rarity: 'legendary', image: '', passiveIncome: 100, description: 'Настоящий магнат' },
  { id: 'cat_5', name: 'Миллиардер', rarity: 'mythical', image: '', passiveIncome: 250, description: 'Зарабатывает миллионами' },
];

// Видеокарты для майнинга
export const GPUS: GPU[] = [
  { id: 'gpu_1', name: 'GTX 1060', hashRate: 25, powerConsumption: 120, price: 150, currency: 'crypto', image: '' },
  { id: 'gpu_2', name: 'RTX 3060', hashRate: 50, powerConsumption: 170, price: 350, currency: 'crypto', image: '' },
  { id: 'gpu_3', name: 'RTX 3080', hashRate: 100, powerConsumption: 320, price: 700, currency: 'crypto', image: '' },
  { id: 'gpu_4', name: 'RTX 4090', hashRate: 200, powerConsumption: 450, price: 1500, currency: 'crypto', image: '' },
  { id: 'gpu_5', name: 'ASIC Miner', hashRate: 500, powerConsumption: 1000, price: 5000, currency: 'crypto', image: '' },
];

// Валюты для биржи (только KIT - остальное создают админы)
export const CURRENCIES: Currency[] = [
  { id: 'kit', name: 'Kit Coin', symbol: 'KIT', price: 1, change24h: 0, icon: '' },
];

// Пользовательские криптовалюты (создаются админами)
export let CUSTOM_CURRENCIES: Currency[] = [];
export const ACHIEVEMENTS: Achievement[] = [
  // Клики
  { id: 'ach_1', name: 'Первый клик', description: 'Сделайте первый клик', icon: '👆', requirement: 1, reward: 10, unlocked: false, category: 'clicks' },
  { id: 'ach_2', name: 'Начинающий', description: '100 кликов', icon: '👆', requirement: 100, reward: 50, unlocked: false, category: 'clicks' },
  { id: 'ach_3', name: 'Любитель', description: '500 кликов', icon: '👆', requirement: 500, reward: 100, unlocked: false, category: 'clicks' },
  { id: 'ach_4', name: 'Фанат', description: '1,000 кликов', icon: '👆', requirement: 1000, reward: 250, unlocked: false, category: 'clicks' },
  { id: 'ach_5', name: 'Энтузиаст', description: '5,000 кликов', icon: '👆', requirement: 5000, reward: 500, unlocked: false, category: 'clicks' },
  { id: 'ach_6', name: 'Профи', description: '10,000 кликов', icon: '👆', requirement: 10000, reward: 1000, unlocked: false, category: 'clicks' },
  { id: 'ach_7', name: 'Мастер', description: '50,000 кликов', icon: '👆', requirement: 50000, reward: 2500, unlocked: false, category: 'clicks' },
  { id: 'ach_8', name: 'Легенда', description: '100,000 кликов', icon: '👆', requirement: 100000, reward: 5000, unlocked: false, category: 'clicks' },
  { id: 'ach_9', name: 'Бог кликов', description: '500,000 кликов', icon: '👆', requirement: 500000, reward: 10000, unlocked: false, category: 'clicks' },
  { id: 'ach_10', name: 'Абсолют', description: '1,000,000 кликов', icon: '👆', requirement: 1000000, reward: 25000, unlocked: false, category: 'clicks' },
  
  // Перерождения
  { id: 'ach_11', name: 'Первое перерождение', description: 'Сделайте первое перерождение', icon: '🔄', requirement: 1, reward: 100, unlocked: false, category: 'rebirths' },
  { id: 'ach_12', name: 'Опытный', description: '5 перерождений', icon: '🔄', requirement: 5, reward: 250, unlocked: false, category: 'rebirths' },
  { id: 'ach_13', name: 'Ветеран', description: '10 перерождений', icon: '🔄', requirement: 10, reward: 500, unlocked: false, category: 'rebirths' },
  { id: 'ach_14', name: 'Мудрец', description: '25 перерождений', icon: '🔄', requirement: 25, reward: 1000, unlocked: false, category: 'rebirths' },
  { id: 'ach_15', name: 'Бессмертный', description: '50 перерождений', icon: '🔄', requirement: 50, reward: 2500, unlocked: false, category: 'rebirths' },
  { id: 'ach_16', name: 'Вечный', description: '100 перерождений', icon: '🔄', requirement: 100, reward: 10000, unlocked: false, category: 'rebirths' },
  
  // Заработок
  { id: 'ach_17', name: 'Первые деньги', description: 'Заработайте 100 KIT', icon: '💰', requirement: 100, reward: 50, unlocked: false, category: 'earnings' },
  { id: 'ach_18', name: 'Накопитель', description: 'Заработайте 1,000 KIT', icon: '💰', requirement: 1000, reward: 200, unlocked: false, category: 'earnings' },
  { id: 'ach_19', name: 'Богач', description: 'Заработайте 10,000 KIT', icon: '💰', requirement: 10000, reward: 500, unlocked: false, category: 'earnings' },
  { id: 'ach_20', name: 'Миллионер', description: 'Заработайте 100,000 KIT', icon: '💰', requirement: 100000, reward: 2000, unlocked: false, category: 'earnings' },
  { id: 'ach_21', name: 'Мультимиллионер', description: 'Заработайте 1,000,000 KIT', icon: '💰', requirement: 1000000, reward: 10000, unlocked: false, category: 'earnings' },
  
  // Кейсы
  { id: 'ach_22', name: 'Первый кейс', description: 'Откройте первый кейс', icon: '📦', requirement: 1, reward: 50, unlocked: false, category: 'cases' },
  { id: 'ach_23', name: 'Коллекционер', description: 'Откройте 10 кейсов', icon: '📦', requirement: 10, reward: 200, unlocked: false, category: 'cases' },
  { id: 'ach_24', name: 'Азартный', description: 'Откройте 50 кейсов', icon: '📦', requirement: 50, reward: 500, unlocked: false, category: 'cases' },
  { id: 'ach_25', name: 'Гемблер', description: 'Откройте 100 кейсов', icon: '📦', requirement: 100, reward: 1000, unlocked: false, category: 'cases' },
  { id: 'ach_26', name: 'Легендарный', description: 'Выбейте легендарный скин', icon: '📦', requirement: 1, reward: 1000, unlocked: false, category: 'cases' },
  { id: 'ach_27', name: 'Мифический', description: 'Выбейте мифический скин', icon: '📦', requirement: 1, reward: 5000, unlocked: false, category: 'cases' },
  
  // Коты
  { id: 'ach_28', name: 'Первый кот', description: 'Купите первого кота', icon: '🐱', requirement: 1, reward: 100, unlocked: false, category: 'cats' },
  { id: 'ach_29', name: 'Любитель котов', description: '5 котов', icon: '🐱', requirement: 5, reward: 300, unlocked: false, category: 'cats' },
  { id: 'ach_30', name: 'Котоман', description: '10 котов', icon: '🐱', requirement: 10, reward: 750, unlocked: false, category: 'cats' },
  { id: 'ach_31', name: 'Кошатник', description: '25 котов', icon: '🐱', requirement: 25, reward: 1500, unlocked: false, category: 'cats' },
  { id: 'ach_32', name: 'Легендарный кот', description: 'Получите легендарного кота', icon: '🐱', requirement: 1, reward: 2000, unlocked: false, category: 'cats' },
  { id: 'ach_33', name: 'Мифический кот', description: 'Получите мифического кота', icon: '🐱', requirement: 1, reward: 5000, unlocked: false, category: 'cats' },
  
  // Майнинг
  { id: 'ach_34', name: 'Первый майнер', description: 'Купите первую видеокарту', icon: '⛏️', requirement: 1, reward: 100, unlocked: false, category: 'mining' },
  { id: 'ach_35', name: 'Начинающий майнер', description: '5 видеокарт', icon: '⛏️', requirement: 5, reward: 300, unlocked: false, category: 'mining' },
  { id: 'ach_36', name: 'Майнер', description: '10 видеокарт', icon: '⛏️', requirement: 10, reward: 750, unlocked: false, category: 'mining' },
  { id: 'ach_37', name: 'Фермер', description: '25 видеокарт', icon: '⛏️', requirement: 25, reward: 1500, unlocked: false, category: 'mining' },
  { id: 'ach_38', name: 'Магнат майнинга', description: '50 видеокарт', icon: '⛏️', requirement: 50, reward: 3000, unlocked: false, category: 'mining' },
  { id: 'ach_39', name: 'Криптобарон', description: 'Заработайте 1 криптокоин', icon: '⛏️', requirement: 1, reward: 500, unlocked: false, category: 'mining' },
  { id: 'ach_40', name: 'Криптомиллионер', description: 'Заработайте 100 криптокоинов', icon: '⛏️', requirement: 100, reward: 5000, unlocked: false, category: 'mining' },
  
  // Специальные
  { id: 'ach_41', name: 'Ранняя пташка', description: 'Начните играть в первые дни', icon: '🌅', requirement: 1, reward: 1000, unlocked: false, category: 'earnings' },
  { id: 'ach_42', name: 'Премиум', description: 'Получите премиум статус', icon: '⭐', requirement: 1, reward: 2000, unlocked: false, category: 'earnings' },
  { id: 'ach_43', name: 'Разработчик', description: 'Получите роль разработчика', icon: '👨‍💻', requirement: 1, reward: 10000, unlocked: false, category: 'earnings' },
  { id: 'ach_44', name: 'Первый разработчик', description: 'Станьте первым разработчиком', icon: '👑', requirement: 1, reward: 50000, unlocked: false, category: 'earnings' },
  { id: 'ach_45', name: 'Создатель кейса', description: 'Создайте свой кейс', icon: '📦', requirement: 1, reward: 1000, unlocked: false, category: 'cases' },
  { id: 'ach_46', name: 'Создатель валюты', description: 'Создайте свою валюту', icon: '💰', requirement: 1, reward: 2000, unlocked: false, category: 'earnings' },
  { id: 'ach_47', name: 'Меценат', description: 'Подарите другим на 10,000 KIT', icon: '🎁', requirement: 10000, reward: 5000, unlocked: false, category: 'earnings' },
  { id: 'ach_48', name: 'Трейдер', description: 'Совершите 100 сделок на бирже', icon: '📈', requirement: 100, reward: 2000, unlocked: false, category: 'earnings' },
  { id: 'ach_49', name: 'Инвестор', description: 'Заработайте на бирже 10,000 KIT', icon: '📈', requirement: 10000, reward: 5000, unlocked: false, category: 'earnings' },
  { id: 'ach_50', name: 'Полная коллекция', description: 'Соберите все скины', icon: '🏆', requirement: 1, reward: 100000, unlocked: false, category: 'cases' },
];
