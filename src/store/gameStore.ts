import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Skin, Case, Achievement, UserRole, Currency } from '../types';
import { ACHIEVEMENTS, SKINS, CATS, GPUS, CURRENCIES } from '../data/gameData';

interface GameState {
  // Пользователь
  user: User | null;
  isAuthenticated: boolean;
  
  // Игровые данные
  cases: Case[];
  achievements: Achievement[];
  
  // UI состояние
  activeTab: string;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  
  // Уведомления
  toasts: { id: string; message: string; type: 'success' | 'error' | 'warning' }[];
  
  // Действия пользователя
  initUser: (telegramUser: any) => void;
  login: (telegramId: string, userData?: Partial<User>) => void;
  
  // Кликер
  addClick: () => void;
  
  // Перерождения
  canRebirth: () => boolean;
  doRebirth: () => void;
  
  // Кейсы
  openCase: (caseId: string) => { skin: Skin; rarity: string };
  buyCase: (caseId: string) => boolean;
  
  // Биржа
  buyCurrency: (currencyId: string, amount: number) => boolean;
  sellCurrency: (currencyId: string, amount: number) => boolean;
  
  // Коты
  buyCat: (catId: string) => boolean;
  getPassiveIncome: () => number;
  claimPassiveIncome: () => number;
  
  // Майнинг
  buyGPU: (gpuId: string) => boolean;
  getMiningIncome: () => number;
  claimMiningIncome: () => number;
  
  // Админка (developer)
  createCase: (caseData: Omit<Case, 'id'>) => void;
  createCurrency: (currencyData: Omit<Currency, 'id'>) => Currency;
  giveRole: (userId: string, role: UserRole) => void;
  giveMoney: (userId: string, amount: number, currency: 'kit' | 'crypto' | string) => void;
  updateCurrencyPrice: (currencyId: string, price: number, change24h: number) => void;
  
  // Премиум функции
  isPremium: () => boolean;
  getPremiumBonus: () => { exp: number; money: number; discount: number };
  
  // UI действия
  setActiveTab: (tab: string) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Проверка ачивок
  checkAchievements: () => void;
  
  // Сохранение/загрузка
  saveProgress: () => void;
  loadProgress: () => void;
}

// Получить множитель клика на основе скина
const getClickMultiplier = (user: User | null, skins: Skin[]): number => {
  if (!user || !user.equippedSkin) return 1;
  const skin = skins.find(s => s.id === user.equippedSkin);
  return skin?.bonus || 1;
};

// Получить множитель от перерождений
const getRebirthMultiplier = (rebirths: number): number => {
  return 1 + (rebirths * 0.1); // +10% за каждое перерождение
};

// Шанс выпадения скина на основе редкости
const getSkinByChance = (skins: Skin[]): Skin => {
  const totalChance = skins.reduce((sum, skin) => sum + skin.chance, 0);
  let random = Math.random() * totalChance;
  
  for (const skin of skins) {
    random -= skin.chance;
    if (random <= 0) {
      return skin;
    }
  }
  
  return skins[0];
};

// Получить цвет редкости
export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
    mythical: '#ec4899',
  };
  return colors[rarity] || colors.common;
};

// Получить название редкости
export const getRarityName = (rarity: string): string => {
  const names: Record<string, string> = {
    common: 'Обычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный',
    mythical: 'Мифический',
  };
  return names[rarity] || names.common;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      user: null,
      isAuthenticated: false,
      cases: [],
      achievements: JSON.parse(JSON.stringify(ACHIEVEMENTS)),
      activeTab: 'tapper',
      isModalOpen: false,
      modalContent: null,
      toasts: [],

      // Инициализация пользователя
      initUser: (telegramUser) => {
        const { user } = get();
        
        if (user && user.telegramId === String(telegramUser.id)) {
          // Пользователь уже существует, обновляем данные
          set({
            user: {
              ...user,
              username: telegramUser.username,
              firstName: telegramUser.first_name,
              lastName: telegramUser.last_name,
              lastLogin: Date.now(),
            },
            isAuthenticated: true,
          });
        } else {
          // Новый пользователь
          const newUser: User = {
            id: `user_${telegramUser.id}`,
            telegramId: String(telegramUser.id),
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            role: telegramUser.id === 5355978604 ? 'first_developer' : 'user', // Mixazx
            level: 1,
            rebirths: 0,
            experience: 0,
            kit: 1000, // Стартовый баланс
            crypto: 0,
            customCurrencies: [],
            totalClicks: 0,
            totalKitEarned: 0,
            totalCasesOpened: 0,
            skins: [],
            cats: [],
            cases: [],
            gpus: [],
            achievements: [],
            lastLogin: Date.now(),
            lastPassiveIncome: Date.now(),
          };
          
          set({ user: newUser, isAuthenticated: true });
        }
      },

      login: (telegramId) => {
        const { user } = get();
        if (user && user.telegramId === telegramId) {
          set({ isAuthenticated: true });
        }
      },

      // Кликер
      addClick: () => {
        const { user } = get();
        if (!user) return;

        const clickMultiplier = getClickMultiplier(user, SKINS);
        const rebirthMultiplier = getRebirthMultiplier(user.rebirths);
        const premiumBonus = get().getPremiumBonus();
        const baseClickValue = 1;
        
        const earned = Math.floor(baseClickValue * clickMultiplier * rebirthMultiplier * (1 + premiumBonus.money));

        set({
          user: {
            ...user,
            kit: user.kit + earned,
            totalClicks: user.totalClicks + 1,
            totalKitEarned: user.totalKitEarned + earned,
            experience: user.experience + Math.floor(1 * (1 + premiumBonus.exp)),
          },
        });

        // Проверка ачивок
        get().checkAchievements();
      },

      // Перерождение
      canRebirth: () => {
        const { user } = get();
        if (!user) return false;
        
        const rebirthCost = 10000 * Math.pow(2, user.rebirths);
        return user.kit >= rebirthCost && user.rebirths < 100;
      },

      doRebirth: () => {
        const { user } = get();
        if (!user || !get().canRebirth()) return false;

        const rebirthCost = 10000 * Math.pow(2, user.rebirths);
        
        set({
          user: {
            ...user,
            kit: user.kit - rebirthCost,
            rebirths: user.rebirths + 1,
            level: 1,
            experience: 0,
          },
        });

        get().addToast('Перерождение успешно! +10% к доходу', 'success');
        get().checkAchievements();
      },

      // Открытие кейса
      openCase: (caseId: string) => {
        const { user, cases } = get();
        if (!user) return { skin: SKINS[0], rarity: 'common' };

        const gameCase = cases.find((c: Case) => c.id === caseId);
        if (!gameCase) return { skin: SKINS[0], rarity: 'common' };
        
        const availableSkins = (gameCase as Case).skins || SKINS;
        
        const wonSkin = getSkinByChance(availableSkins);

        // Добавляем скин в инвентарь
        const existingSkin = user.skins.find(s => s.skinId === wonSkin.id);
        const newSkins = existingSkin
          ? user.skins.map(s => s.skinId === wonSkin.id ? { ...s, count: s.count + 1 } : s)
          : [...user.skins, { skinId: wonSkin.id, count: 1 }];

        set({
          user: {
            ...user,
            skins: newSkins,
            totalCasesOpened: user.totalCasesOpened + 1,
          },
        });

        get().addToast(`Выпал: ${wonSkin.name} (${getRarityName(wonSkin.rarity)})`, 'success');
        get().checkAchievements();

        return { skin: wonSkin, rarity: wonSkin.rarity };
      },

      // Покупка кейса
      buyCase: (caseId: string) => {
        const { user, cases } = get();
        if (!user) return false;

        const gameCase = cases.find(c => c.id === caseId);
        if (!gameCase) return false;

        const balance = gameCase.currency === 'kit' ? user.kit : user.crypto;
        
        if (balance >= gameCase.price) {
          set({
            user: {
              ...user,
              kit: gameCase.currency === 'kit' ? user.kit - gameCase.price : user.kit,
              crypto: gameCase.currency === 'crypto' ? user.crypto - gameCase.price : user.crypto,
              cases: [...user.cases, { caseId, count: 1 }],
            },
          });
          
          get().addToast(`Кейс "${gameCase.name}" куплен!`, 'success');
          return true;
        }

        get().addToast('Недостаточно средств', 'error');
        return false;
      },

      // Биржа - покупка
      buyCurrency: (currencyId: string, amount: number) => {
        const { user } = get();
        if (!user) return false;

        const currency = CURRENCIES.find(c => c.id === currencyId);
        if (!currency) return false;

        const cost = currency.price * amount;

        if (user.kit >= cost) {
          set({
            user: {
              ...user,
              kit: user.kit - cost,
              crypto: user.crypto + amount,
            },
          });
          
          get().addToast(`Куплено ${amount} ${currency.symbol}`, 'success');
          return true;
        }

        get().addToast('Недостаточно KIT', 'error');
        return false;
      },

      // Биржа - продажа
      sellCurrency: (currencyId: string, amount: number) => {
        const { user } = get();
        if (!user) return false;

        const currency = CURRENCIES.find(c => c.id === currencyId);
        if (!currency) return false;

        if (user.crypto >= amount) {
          const earnings = currency.price * amount;
          
          set({
            user: {
              ...user,
              kit: user.kit + earnings,
              crypto: user.crypto - amount,
            },
          });
          
          get().addToast(`Продано ${amount} ${currency.symbol}`, 'success');
          return true;
        }

        get().addToast('Недостаточно валюты', 'error');
        return false;
      },

      // Покупка кота
      buyCat: (catId: string) => {
        const { user } = get();
        if (!user) return false;

        const cat = CATS.find(c => c.id === catId);
        if (!cat) return false;

        // Цена кота зависит от редкости
        const prices: Record<string, number> = {
          common: 500,
          rare: 2000,
          epic: 10000,
          legendary: 50000,
          mythical: 200000,
        };

        const price = prices[cat.rarity];

        if (user.kit >= price) {
          const existingCat = user.cats.find(c => c.catId === catId);
          const newCats = existingCat
            ? user.cats.map(c => c.catId === catId ? { ...c, count: c.count + 1 } : c)
            : [...user.cats, { catId, count: 1, level: 1 }];

          set({
            user: {
              ...user,
              kit: user.kit - price,
              cats: newCats,
            },
          });

          get().addToast(`Кот "${cat.name}" куплен!`, 'success');
          get().checkAchievements();
          return true;
        }

        get().addToast('Недостаточно средств', 'error');
        return false;
      },

      // Пассивный доход от котов
      getPassiveIncome: () => {
        const { user } = get();
        if (!user) return 0;

        let income = 0;
        for (const catItem of user.cats) {
          const cat = CATS.find(c => c.id === catItem.catId);
          if (cat) {
            income += cat.passiveIncome * catItem.count;
          }
        }

        return income;
      },

      // Забрать пассивный доход
      claimPassiveIncome: () => {
        const { user } = get();
        if (!user) return 0;

        const now = Date.now();
        const hoursPassed = (now - user.lastPassiveIncome) / (1000 * 60 * 60);
        const hourlyIncome = get().getPassiveIncome();
        const earned = Math.floor(hourlyIncome * hoursPassed);

        if (earned > 0) {
          set({
            user: {
              ...user,
              kit: user.kit + earned,
              lastPassiveIncome: now,
            },
          });
          
          get().addToast(`Получено ${earned} KIT пассивного дохода`, 'success');
        }

        return earned;
      },

      // Покупка GPU
      buyGPU: (gpuId: string) => {
        const { user } = get();
        if (!user) return false;

        const gpu = GPUS.find(g => g.id === gpuId);
        if (!gpu) return false;

        if (user.crypto >= gpu.price) {
          const existingGPU = user.gpus.find(g => g.gpuId === gpuId);
          const newGPUs = existingGPU
            ? user.gpus.map(g => g.gpuId === gpuId ? { ...g, count: g.count + 1 } : g)
            : [...user.gpus, { gpuId, count: 1 }];

          set({
            user: {
              ...user,
              crypto: user.crypto - gpu.price,
              gpus: newGPUs,
            },
          });

          get().addToast(`Видеокарта "${gpu.name}" куплена!`, 'success');
          get().checkAchievements();
          return true;
        }

        get().addToast('Недостаточно криптокоинов', 'error');
        return false;
      },

      // Доход от майнинга
      getMiningIncome: () => {
        const { user } = get();
        if (!user) return 0;

        let totalHashRate = 0;
        for (const gpuItem of user.gpus) {
          const gpu = GPUS.find(g => g.id === gpuItem.gpuId);
          if (gpu) {
            totalHashRate += gpu.hashRate * gpuItem.count;
          }
        }

        // 1 MH/s = 0.000001 crypto в час
        return totalHashRate * 0.000001;
      },

      // Забрать доход от майнинга
      claimMiningIncome: () => {
        const { user } = get();
        if (!user) return 0;

        const now = Date.now();
        const hoursPassed = (now - user.lastPassiveIncome) / (1000 * 60 * 60);
        const hourlyIncome = get().getMiningIncome();
        const earned = hourlyIncome * hoursPassed;

        if (earned > 0) {
          set({
            user: {
              ...user,
              crypto: user.crypto + earned,
              lastPassiveIncome: now,
            },
          });
        }

        return earned;
      },

      // Админка - создание кейса
      createCase: (caseData) => {
        const { user, cases } = get();
        if (!user || user.role !== 'developer' && user.role !== 'first_developer') {
          get().addToast('Только разработчик может создавать кейсы', 'error');
          return;
        }

        const newCase: Case = {
          ...caseData,
          id: `case_custom_${Date.now()}`,
          creatorId: user.id,
        };

        set({ cases: [...cases, newCase] });
        get().addToast('Кейс создан!', 'success');
      },

      // Проверка премиума
      isPremium: () => {
        const { user } = get();
        return user?.role === 'premium' || user?.role === 'developer' || user?.role === 'first_developer';
      },

      // Премиум бонусы
      getPremiumBonus: () => {
        const { user } = get();
        if (!user) return { exp: 0, money: 0, discount: 0 };
        
        if (user.role === 'premium') {
          return { exp: 0.2, money: 0.2, discount: 0.1 }; // +20% XP, +20% денег, -10% цены
        }
        if (user.role === 'developer' || user.role === 'first_developer') {
          return { exp: 0.5, money: 0.5, discount: 0.2 }; // +50% XP, +50% денег, -20% цены
        }
        return { exp: 0, money: 0, discount: 0 };
      },

      // Админка - создание криптовалюты
      createCurrency: (currencyData) => {
        const { user } = get();
        if (!user || user.role !== 'developer' && user.role !== 'first_developer') {
          get().addToast('Только разработчик может создавать валюты', 'error');
          return {} as Currency;
        }

        const newCurrency: Currency = {
          ...currencyData,
          id: `custom_${Date.now()}`,
        };

        // В реальной версии здесь было бы сохранение в БД
        get().addToast(`Валюта ${newCurrency.name} создана!`, 'success');
        return newCurrency;
      },

      // Админка - выдача роли
      giveRole: (userId: string, role: UserRole) => {
        const { user } = get();
        if (!user || user.role !== 'developer' && user.role !== 'first_developer') {
          get().addToast('Только разработчик может выдавать роли', 'error');
          return;
        }

        get().addToast(`Роль ${role} выдана пользователю ${userId}`, 'success');
      },

      // Админка - выдача денег
      giveMoney: (userId: string, amount: number, currency: string) => {
        const { user } = get();
        if (!user || user.role !== 'developer' && user.role !== 'first_developer') {
          get().addToast('Только разработчик может выдавать деньги', 'error');
          return;
        }

        get().addToast(`Выдано ${amount} ${currency} пользователю ${userId}`, 'success');
      },

      // Админка - изменение цены криптовалюты
      updateCurrencyPrice: (currencyId: string, price: number, change24h: number) => {
        const { user } = get();
        if (!user || user.role !== 'developer' && user.role !== 'first_developer') {
          get().addToast('Только разработчик может изменять цены', 'error');
          return;
        }

        get().addToast(`Цена ${currencyId} обновлена: $${price} (${change24h}%)`, 'success');
      },

      // UI действия
      setActiveTab: (tab: string) => {
        set({ activeTab: tab });
      },

      openModal: (content) => {
        set({ isModalOpen: true, modalContent: content });
      },

      closeModal: () => {
        set({ isModalOpen: false, modalContent: null });
      },

      addToast: (message, type) => {
        const id = `toast_${Date.now()}`;
        set({ toasts: [...get().toasts, { id, message, type }] });
        
        setTimeout(() => {
          get().removeToast(id);
        }, 3000);
      },

      removeToast: (id: string) => {
        set({ toasts: get().toasts.filter(t => t.id !== id) });
      },

      // Проверка ачивок
      checkAchievements: () => {
        const { user, achievements } = get();
        if (!user) return;

        const newAchievements = [...achievements];
        let hasNewUnlocks = false;

        for (const achievement of newAchievements) {
          if (user.achievements.includes(achievement.id)) continue;

          let progress = 0;
          
          switch (achievement.category) {
            case 'clicks':
              progress = user.totalClicks;
              break;
            case 'rebirths':
              progress = user.rebirths;
              break;
            case 'earnings':
              progress = user.totalKitEarned;
              break;
            case 'cases':
              progress = user.totalCasesOpened;
              break;
            case 'cats':
              progress = user.cats.reduce((sum, c) => sum + c.count, 0);
              break;
            case 'mining':
              progress = user.gpus.reduce((sum, g) => sum + g.count, 0);
              break;
          }

          if (progress >= achievement.requirement) {
            user.achievements.push(achievement.id);
            user.kit += achievement.reward;
            hasNewUnlocks = true;
            get().addToast(`🏆 Ачивка: ${achievement.name}! +${achievement.reward} KIT`, 'success');
          }
        }

        if (hasNewUnlocks) {
          set({ user, achievements: newAchievements });
        }
      },

      // Сохранение прогресса
      saveProgress: () => {
        // В реальной версии здесь будет отправка на сервер
        console.log('Progress saved');
      },

      // Загрузка прогресса
      loadProgress: () => {
        // В реальной версии здесь будет загрузка с сервера
        console.log('Progress loaded');
      },
    }),

    {
      name: 'cat-tapper-storage',
      partialize: (state) => ({ 
        user: state.user,
        cases: state.cases,
        achievements: state.achievements,
      }),
    }
  )
);
