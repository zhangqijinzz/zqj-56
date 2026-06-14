import { useState } from 'react';
import { Plus, Trash2, Check, RotateCcw, Calendar } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import { taskCategoryLabels, taskCategoryIcons, type TaskCategoryKey } from '@/types';

const categories: { key: TaskCategoryKey; color: string }[] = [
  { key: 'photo', color: 'from-sky-400 to-blue-500' },
  { key: 'observe', color: 'from-emerald-400 to-teal-500' },
  { key: 'taste', color: 'from-rose-400 to-pink-500' },
  { key: 'record', color: 'from-violet-400 to-purple-500' },
];

export default function TravelTasks() {
  const { activeDate, getTasksByDate, addTask, toggleTask, deleteTask, setActiveDate, resetDailyTasks } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategoryKey>('photo');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateInput, setDateInput] = useState(activeDate);

  const tasks = getTasksByDate(activeDate);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getTasksByCategory = (category: TaskCategoryKey) =>
    tasks.filter((t) => t.category === category);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    addTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      icon: taskCategoryIcons[newTaskCategory],
    });
    
    setNewTaskTitle('');
    setShowAddForm(false);
  };

  const handleDateChange = () => {
    if (dateInput) {
      setActiveDate(dateInput);
    }
    setShowCalendar(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return '今天';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return '明天';
    
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="旅行任务单"
        subtitle="让旅途更有仪式感"
        emoji="✅"
        rightAction={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 hover:bg-amber-100 transition-all duration-200 active:scale-95"
            >
              <Calendar className="w-5 h-5 text-amber-700" />
            </button>
            <button
              onClick={() => {
                if (confirm('确定要重置今日任务吗？')) {
                  resetDailyTasks();
                }
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 hover:bg-amber-100 transition-all duration-200 active:scale-95"
            >
              <RotateCcw className="w-5 h-5 text-amber-700" />
            </button>
          </div>
        }
      />

      <div className="container max-w-lg mx-auto px-4 py-6">
        {showCalendar && (
          <div className="card-paper p-4 mb-6 animate-slide-up">
            <h4 className="hand-title text-lg mb-3">选择日期</h4>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="input-field flex-1"
              />
              <button onClick={handleDateChange} className="btn-primary">
                确定
              </button>
            </div>
            <p className="text-sm text-amber-700/70 mt-2">
              当前：{formatDate(activeDate)} · 每天的任务独立保存
            </p>
          </div>
        )}

        <div className="card-paper p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="hand-title text-lg">
                {formatDate(activeDate)}的任务
              </h3>
              <p className="text-sm text-amber-700/70">
                已完成 {completedCount} / {totalCount}
              </p>
            </div>
            <div className="text-right">
              <span className="hand-title text-3xl text-amber-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          
          <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {progress === 100 && (
            <div className="mt-4 text-center animate-bounce-soft">
              <span className="text-3xl">🎉</span>
              <p className="hand-title text-lg text-emerald-600 mt-1">
                太棒了！全部完成！
              </p>
            </div>
          )}
        </div>

        <div className="mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="hand-title text-lg">任务列表</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all duration-200 active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {showAddForm && (
            <div className="card-paper p-4 mb-4 animate-slide-up">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="输入你的任务..."
                className="input-field mb-3"
                autoFocus
              />
              <div className="flex gap-2 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setNewTaskCategory(cat.key)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm transition-all duration-200 ${
                      newTaskCategory === cat.key
                        ? `bg-gradient-to-r ${cat.color} text-white`
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <span className="text-lg">{taskCategoryIcons[cat.key]}</span>
                    <span className="block text-xs mt-0.5">
                      {taskCategoryLabels[cat.key]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 btn-ghost"
                >
                  取消
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="flex-1 btn-primary"
                >
                  添加
                </button>
              </div>
            </div>
          )}

          {totalCount === 0 ? (
            <div className="card-paper p-8 text-center">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-amber-700/70">还没有任务</p>
              <p className="text-sm text-amber-700/50 mt-1">
                点击 + 添加你的第一个任务
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map((cat, catIndex) => {
                const categoryTasks = getTasksByCategory(cat.key);
                if (categoryTasks.length === 0) return null;
                
                return (
                  <div
                    key={cat.key}
                    className="animate-slide-up"
                    style={{ animationDelay: `${(catIndex + 1) * 100}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{taskCategoryIcons[cat.key]}</span>
                      <h4 className="text-sm font-medium text-amber-800">
                        {taskCategoryLabels[cat.key]}
                      </h4>
                      <span className="text-xs text-amber-700/50">
                        ({categoryTasks.filter(t => t.completed).length}/{categoryTasks.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {categoryTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                            task.completed
                              ? 'bg-emerald-50/70'
                              : 'bg-white/70 hover:bg-white'
                          } group`}
                        >
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              task.completed
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-amber-300 hover:border-amber-500'
                            }`}
                          >
                            {task.completed && (
                              <Check className="w-4 h-4 text-white animate-bounce" />
                            )}
                          </button>
                          <span
                            className={`flex-1 transition-all duration-300 ${
                              task.completed
                                ? 'text-amber-600/50 line-through'
                                : 'text-amber-900'
                            }`}
                          >
                            {task.title}
                          </span>
                          {task.isCustom && (
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-100 transition-all duration-200"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {progress > 0 && progress < 100 && (
          <div className="text-center text-amber-700/60 animate-fade-in">
            <p className="text-2xl mb-1">💪</p>
            <p className="text-sm">
              继续加油，还有 {totalCount - completedCount} 个任务等着你！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
