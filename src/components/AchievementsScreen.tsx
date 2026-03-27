import React from 'react';
import { useGameStore } from '../store/gameStore';

const AchievementsScreen: React.FC = () => {
  const { user, achievements } = useGameStore();

  if (!user) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Группировка ачивок по категориям
  const categories = [
    { id: 'clicks', name: '👆 Клики', icon: '👆' },
    { id: 'rebirths', name: '🔄 Перерождения', icon: '🔄' },
    { id: 'earnings', name: '💰 Заработок', icon: '💰' },
    { id: 'cases', name: '📦 Кейсы', icon: '📦' },
    { id: 'cats', name: '🐱 Коты', icon: '🐱' },
    { id: 'mining', name: '⛏️ Майнинг', icon: '⛏️' },
  ];

  const unlockedCount = user.achievements.length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="page-container">
      <h2 className="section-title">🏆 Ачивки</h2>

      {/* Общий прогресс */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600 }}>Общий прогресс</span>
          <span style={{ color: 'var(--text-muted)' }}>
            {unlockedCount} / {totalCount}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
          {progress.toFixed(1)}% завершено
        </div>
      </div>

      {/* Ачивки по категориям */}
      {categories.map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category.id);
        
        return (
          <div key={category.id} style={{ marginBottom: '24px' }}>
            <h3 className="section-title">{category.icon} {category.name}</h3>
            <div className="grid" style={{ gap: '12px' }}>
              {categoryAchievements.map(achievement => {
                const isUnlocked = user.achievements.includes(achievement.id);
                
                // Прогресс для этой ачивки
                let progress = 0;
                switch (achievement.category) {
                  case 'clicks':
                    progress = Math.min(100, (user.totalClicks / achievement.requirement) * 100);
                    break;
                  case 'rebirths':
                    progress = Math.min(100, (user.rebirths / achievement.requirement) * 100);
                    break;
                  case 'earnings':
                    progress = Math.min(100, (user.totalKitEarned / achievement.requirement) * 100);
                    break;
                  case 'cases':
                    progress = Math.min(100, (user.totalCasesOpened / achievement.requirement) * 100);
                    break;
                  case 'cats':
                    const catsCount = user.cats.reduce((sum, c) => sum + c.count, 0);
                    progress = Math.min(100, (catsCount / achievement.requirement) * 100);
                    break;
                  case 'mining':
                    const gpusCount = user.gpus.reduce((sum, g) => sum + g.count, 0);
                    progress = Math.min(100, (gpusCount / achievement.requirement) * 100);
                    break;
                }

                return (
                  <div 
                    key={achievement.id}
                    className="card"
                    style={{
                      opacity: isUnlocked ? 1 : 0.7,
                      border: isUnlocked ? `2px solid var(--success)` : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ 
                        fontSize: '40px',
                        padding: '8px',
                        background: isUnlocked ? 'var(--success)20' : 'var(--bg-secondary)',
                        borderRadius: '12px',
                        filter: isUnlocked ? 'none' : 'grayscale(100%)',
                      }}>
                        {achievement.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 700,
                          color: isUnlocked ? 'var(--success)' : 'var(--text-muted)',
                        }}>
                          {achievement.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {achievement.description}
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: 'var(--ton-blue)',
                          marginTop: '8px',
                          fontWeight: 600,
                        }}>
                          Награда: {achievement.reward} KIT
                        </div>
                        
                        {!isUnlocked && (
                          <>
                            <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                              Прогресс: {Math.floor(progress)}%
                            </div>
                            <div className="progress-bar" style={{ height: '4px', marginTop: '4px' }}>
                              <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%`, height: '100%' }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {isUnlocked && (
                        <div style={{ fontSize: '24px' }}>✅</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AchievementsScreen;
