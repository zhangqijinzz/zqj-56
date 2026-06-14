import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store/useAppStore';

export default function Journal() {
  const navigate = useNavigate();
  const { journals, deleteJournal } = useAppStore();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="本地纪念册"
        subtitle="记录旅途的美好时光"
        emoji="📔"
        rightAction={
          <button
            onClick={() => navigate('/journal/new')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all duration-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <div className="container max-w-lg mx-auto px-4 py-6">
        {journals.length === 0 ? (
          <div className="card-paper p-10 text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce-soft">📔</div>
            <h3 className="hand-title text-2xl mb-2">开始记录吧</h3>
            <p className="text-amber-700/70 mb-6">
              还没有日记<br />
              点击右上角 + 创建你的第一篇旅行日记
            </p>
            <button
              onClick={() => navigate('/journal/new')}
              className="btn-primary"
            >
              创建日记
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {journals.map((journal, index) => (
              <div
                key={journal.id}
                className="card-paper card-paper-hover overflow-hidden animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/journal/${journal.id}`)}
              >
                {journal.photos.length > 0 && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={journal.photos[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="hand-title text-xl truncate">
                        {journal.title || '无标题日记'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-amber-700/70 mt-1">
                        <span>{formatDate(journal.date)}</span>
                        {journal.location && (
                          <>
                            <span>·</span>
                            <span className="truncate">{journal.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/journal/${journal.id}`);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('确定要删除这篇日记吗？')) {
                            deleteJournal(journal.id);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-amber-800/80 text-sm line-clamp-2 leading-relaxed">
                    {journal.content || '还没有内容...'}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {journal.photos.length > 0 && (
                      <span className="text-xs text-amber-700/60 flex items-center gap-1">
                        📷 {journal.photos.length}张照片
                      </span>
                    )}
                    {journal.stickers.length > 0 && (
                      <span className="text-xs text-amber-700/60 flex items-center gap-1">
                        {journal.stickers.slice(0, 3).map(s => s.type).join(' ')}
                        {journal.stickers.length > 3 && ` +${journal.stickers.length - 3}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {journals.length > 0 && (
          <div className="text-center mt-8 text-amber-700/60 animate-fade-in">
            <p className="text-sm">
              共 {journals.length} 篇旅行日记
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
