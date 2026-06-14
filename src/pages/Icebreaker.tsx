import { useState } from 'react';
import { Heart, Shuffle, Bookmark, BookmarkCheck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import { topics, getTopicsByCategory } from '@/data/topics';
import { categoryLabels, type CategoryKey, type Topic } from '@/types';

const categories: { key: CategoryKey; emoji: string }[] = [
  { key: 'companion', emoji: '🚶' },
  { key: 'hostel', emoji: '🏠' },
  { key: 'dining', emoji: '🍜' },
];

export default function Icebreaker() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('companion');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const { favoriteTopics, toggleFavoriteTopic } = useAppStore();

  const categoryTopics = getTopicsByCategory(activeCategory);

  const drawTopic = () => {
    if (categoryTopics.length === 0) return;
    
    setIsFlipping(true);
    
    let newTopic: Topic;
    let attempts = 0;
    do {
      newTopic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];
      attempts++;
    } while (newTopic.id === currentTopic?.id && categoryTopics.length > 1 && attempts < 10);

    setTimeout(() => {
      setCurrentTopic(newTopic);
      setIsFlipping(false);
    }, 400);
  };

  const favoriteTopicsList = topics.filter(t => favoriteTopics.includes(t.id));

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    deep: 'bg-rose-100 text-rose-700',
  };

  const difficultyLabels = {
    easy: '轻松',
    medium: '进阶',
    deep: '深入',
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="破冰话题卡"
        subtitle="让聊天更有趣"
        emoji="💬"
        rightAction={
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95"
          >
            {showFavorites ? (
              <BookmarkCheck className="w-5 h-5 text-amber-600" />
            ) : (
              <Bookmark className="w-5 h-5 text-amber-700/60" />
            )}
          </button>
        }
      />

      <div className="container max-w-lg mx-auto px-4 py-6">
        {showFavorites ? (
          <div className="space-y-3 animate-fade-in">
            <h3 className="hand-title text-lg mb-4">
              我的收藏 ({favoriteTopicsList.length})
            </h3>
            {favoriteTopicsList.length === 0 ? (
              <div className="card-paper p-8 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-amber-700/70">还没有收藏的话题</p>
                <p className="text-sm text-amber-700/50 mt-1">
                  遇到喜欢的话题，点击爱心收藏吧
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteTopicsList.map((topic) => (
                  <div
                    key={topic.id}
                    className="card-paper p-4 flex items-start gap-3"
                  >
                    <span className="text-2xl">
                      {categoryLabels[topic.category].slice(0, 2)}
                    </span>
                    <div className="flex-1">
                      <p className="text-amber-900">{topic.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[topic.difficulty]}`}
                        >
                          {difficultyLabels[topic.difficulty]}
                        </span>
                        <span className="text-xs text-amber-700/60">
                          {categoryLabels[topic.category]}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavoriteTopic(topic.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50"
                    >
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-6 animate-fade-in">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setCurrentTopic(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor:
                      activeCategory === cat.key
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(254, 243, 199, 0.5)',
                  }}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <p className="text-sm mt-1">{categoryLabels[cat.key]}</p>
                </button>
              ))}
            </div>

            <div className="perspective-1000 animate-slide-up">
              <div
                className="relative w-full aspect-[4/3] transition-transform duration-500 preserve-3d cursor-pointer"
                style={{
                  transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div className="absolute inset-0 backface-hidden">
                  <div
                    className="w-full h-full card-paper flex flex-col items-center justify-center p-8 text-center"
                    onClick={drawTopic}
                  >
                    {currentTopic ? (
                      <>
                        <div
                          className={`text-xs px-3 py-1 rounded-full mb-4 ${difficultyColors[currentTopic.difficulty]}`}
                        >
                          {difficultyLabels[currentTopic.difficulty]}
                        </div>
                        <p className="hand-title text-2xl leading-relaxed text-balance">
                          {currentTopic.content}
                        </p>
                        <div className="mt-auto pt-6 flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteTopic(currentTopic.id);
                            }}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-rose-50 hover:bg-rose-100 transition-all duration-200 active:scale-95"
                          >
                            <Heart
                              className={`w-6 h-6 transition-colors ${
                                favoriteTopics.includes(currentTopic.id)
                                  ? 'text-rose-500 fill-rose-500'
                                  : 'text-rose-400'
                              }`}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              drawTopic();
                            }}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-50 hover:bg-amber-100 transition-all duration-200 active:scale-95"
                          >
                            <Shuffle className="w-6 h-6 text-amber-600" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-6xl mb-4 animate-bounce-soft">
                          🎴
                        </div>
                        <p className="hand-title text-xl text-amber-800">
                          点击抽取话题
                        </p>
                        <p className="text-sm text-amber-700/60 mt-2">
                          共 {categoryTopics.length} 个话题等你来聊
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="w-full h-full card-paper bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <div className="text-6xl">✨</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <button onClick={drawTopic} className="btn-primary w-full max-w-xs mx-auto">
                <span className="flex items-center justify-center gap-2">
                  <Shuffle className="w-5 h-5" />
                  换一个话题
                </span>
              </button>
            </div>

            <p className="text-center text-sm text-amber-700/60 mt-6">
              💡 小提示：点击卡片也可以换题哦
            </p>
          </>
        )}
      </div>
    </div>
  );
}
