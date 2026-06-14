import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Dice5, RotateCcw, Clock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import type { Attraction } from '@/types';

export default function RouteDraw() {
  const {
    attractions,
    currentRoute,
    currentRouteDate,
    addAttraction,
    deleteAttraction,
    generateRoute,
    clearRoute,
  } = useAppStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [routeCount, setRouteCount] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [displayedRoute, setDisplayedRoute] = useState<string[] | null>(null);
  
  const drawIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (drawIntervalRef.current) {
        clearInterval(drawIntervalRef.current);
        drawIntervalRef.current = null;
      }
    };
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const isTodayRoute = currentRouteDate === today;

  const routeAttractions = currentRoute
    ? currentRoute.map((id) => attractions.find((a) => a.id === id)).filter(Boolean) as Attraction[]
    : [];

  const handleAddAttraction = () => {
    if (!newName.trim()) return;
    
    addAttraction({
      name: newName.trim(),
      description: newDescription.trim() || undefined,
      duration: newDuration ? parseInt(newDuration) : undefined,
    });
    
    setNewName('');
    setNewDuration('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const handleDrawRoute = () => {
    if (attractions.length === 0) return;
    
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current);
    }
    
    setIsDrawing(true);
    
    let count = 0;
    drawIntervalRef.current = window.setInterval(() => {
      const shuffled = [...attractions].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(routeCount, attractions.length));
      setDisplayedRoute(selected.map((a) => a.id));
      count++;
      
      if (count >= 15) {
        if (drawIntervalRef.current) {
          clearInterval(drawIntervalRef.current);
          drawIntervalRef.current = null;
        }
        const finalRoute = generateRoute(routeCount);
        setDisplayedRoute(finalRoute);
        setIsDrawing(false);
      }
    }, 80);
  };

  const totalDuration = routeAttractions.reduce((sum, a) => sum + (a.duration || 0), 0);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="路线抽签"
        subtitle="让命运决定今天去哪里"
        emoji="🎲"
      />

      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <div className="card-paper p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="hand-title text-lg">候选景点</h3>
                <p className="text-sm text-amber-700/70">
                  已添加 {attractions.length} 个地点
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-forest-500 hover:bg-forest-600 text-white transition-all duration-200 active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showAddForm && (
              <div className="space-y-3 mt-4 pt-4 border-t border-amber-100 animate-slide-up">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="景点名称"
                  className="input-field"
                  autoFocus
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="预计时长（分钟）"
                    className="input-field flex-1"
                  />
                </div>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="备注（可选）"
                  className="input-field min-h-[80px] resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 btn-ghost"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddAttraction}
                    disabled={!newName.trim()}
                    className="flex-1 btn-secondary"
                  >
                    添加
                  </button>
                </div>
              </div>
            )}

            {attractions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-amber-700/70">还没有添加景点</p>
                <p className="text-sm text-amber-700/50 mt-1">
                  点击 + 添加你想去的地方
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto mt-2">
                {attractions.map((attr, index) => (
                  <div
                    key={attr.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 hover:bg-amber-50 transition-colors group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-hand text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-amber-900 truncate">
                        {attr.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-amber-700/70">
                        {attr.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {attr.duration}分钟
                          </span>
                        )}
                        {attr.description && (
                          <span className="truncate">{attr.description}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAttraction(attr.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-100 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {attractions.length > 0 && (
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="card-paper p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="hand-title text-lg">抽签设置</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-amber-700/70">抽取</span>
                  <select
                    value={routeCount}
                    onChange={(e) => setRouteCount(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-200 text-amber-800 text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-amber-700/70">个</span>
                </div>
              </div>

              <button
                onClick={handleDrawRoute}
                disabled={isDrawing}
                className={`w-full btn-secondary flex items-center justify-center gap-2 ${
                  isDrawing ? 'animate-pulse' : ''
                }`}
              >
                <Dice5 className={`w-5 h-5 ${isDrawing ? 'animate-spin' : ''}`} />
                {isDrawing ? '抽签中...' : '开始抽签'}
              </button>
            </div>
          </div>
        )}

        {(currentRoute || displayedRoute) && (
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="card-paper p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full opacity-50" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="hand-title text-lg">
                      {isTodayRoute ? '今日路线' : '生成的路线'}
                    </h3>
                    {currentRouteDate && (
                      <p className="text-sm text-amber-700/70">
                        {currentRouteDate}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      clearRoute();
                      setDisplayedRoute(null);
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 hover:bg-amber-100 transition-all duration-200 active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5 text-amber-600" />
                  </button>
                </div>

                {totalDuration > 0 && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-amber-700">
                    <Clock className="w-4 h-4" />
                    <span>预计总时长：约 {totalDuration} 分钟</span>
                  </div>
                )}

                <div className="relative pl-8">
                  <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-400 to-teal-500" />
                  
                  {(displayedRoute || currentRoute || []).map((id, index) => {
                    const attr = attractions.find((a) => a.id === id);
                    if (!attr) return null;
                    
                    return (
                      <div
                        key={id}
                        className={`relative mb-4 last:mb-0 transition-all duration-300 ${
                          isDrawing ? 'animate-pulse' : ''
                        }`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {index + 1}
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm">
                          <p className="font-medium text-amber-900">
                            {attr.name}
                          </p>
                          {attr.duration && (
                            <div className="flex items-center gap-1 text-xs text-amber-700/70 mt-1">
                              <Clock className="w-3 h-3" />
                              {attr.duration}分钟
                            </div>
                          )}
                          {attr.description && (
                            <p className="text-xs text-amber-700/70 mt-1">
                              {attr.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {!currentRoute && !displayedRoute && attractions.length > 0 && (
          <div className="text-center mt-8 text-amber-700/60 animate-fade-in">
            <p className="text-4xl mb-2">✨</p>
            <p className="text-sm">点击上方按钮，让命运决定</p>
          </div>
        )}
      </div>
    </div>
  );
}
