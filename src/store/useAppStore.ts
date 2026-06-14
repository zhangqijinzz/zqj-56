import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Attraction, TravelTask, JournalEntry } from '@/types';
import { defaultTasks } from '@/data/defaultTasks';

const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

const getTodayString = () => new Date().toISOString().split('T')[0];

const initializeDailyTasks = (): TravelTask[] => {
  const shuffled = [...defaultTasks].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 8);
  return selected.map(task => ({
    ...task,
    id: generateId(),
    completed: false,
    isCustom: false,
  }));
};

const getTasksForDate = (
  tasksByDate: Record<string, TravelTask[]>,
  date: string
): TravelTask[] => {
  if (tasksByDate[date]) {
    return tasksByDate[date];
  }
  return initializeDailyTasks();
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favoriteTopics: [],
      attractions: [],
      currentRoute: null,
      currentRouteDate: null,
      tasksByDate: {
        [getTodayString()]: initializeDailyTasks(),
      },
      activeDate: getTodayString(),
      journals: [],

      toggleFavoriteTopic: (topicId: string) =>
        set((state) => ({
          favoriteTopics: state.favoriteTopics.includes(topicId)
            ? state.favoriteTopics.filter((id) => id !== topicId)
            : [...state.favoriteTopics, topicId],
        })),

      addAttraction: (attraction) =>
        set((state) => ({
          attractions: [
            ...state.attractions,
            {
              ...attraction,
              id: generateId(),
              createdAt: Date.now(),
            },
          ],
        })),

      updateAttraction: (id, data) =>
        set((state) => ({
          attractions: state.attractions.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        })),

      deleteAttraction: (id) =>
        set((state) => ({
          attractions: state.attractions.filter((a) => a.id !== id),
          currentRoute: state.currentRoute?.filter((rid) => rid !== id) || null,
        })),

      generateRoute: (count) => {
        const { attractions } = get();
        if (attractions.length === 0) return null;
        
        const shuffled = [...attractions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, attractions.length));
        const routeIds = selected.map((a) => a.id);
        
        set({
          currentRoute: routeIds,
          currentRouteDate: getTodayString(),
        });
        
        return routeIds;
      },

      clearRoute: () => set({ currentRoute: null, currentRouteDate: null }),

      getTasksByDate: (date: string) => {
        return getTasksForDate(get().tasksByDate, date);
      },

      addTask: (task, date) => {
        const targetDate = date || get().activeDate;
        set((state) => {
          const currentTasks = getTasksForDate(state.tasksByDate, targetDate);
          const newTask: TravelTask = {
            ...task,
            id: generateId(),
            completed: false,
            isCustom: true,
          };
          return {
            tasksByDate: {
              ...state.tasksByDate,
              [targetDate]: [...currentTasks, newTask],
            },
          };
        });
      },

      toggleTask: (taskId, date) => {
        const targetDate = date || get().activeDate;
        set((state) => {
          const currentTasks = getTasksForDate(state.tasksByDate, targetDate);
          return {
            tasksByDate: {
              ...state.tasksByDate,
              [targetDate]: currentTasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      completed: !t.completed,
                      completedAt: !t.completed ? Date.now() : undefined,
                    }
                  : t
              ),
            },
          };
        });
      },

      deleteTask: (taskId, date) => {
        const targetDate = date || get().activeDate;
        set((state) => {
          const currentTasks = getTasksForDate(state.tasksByDate, targetDate);
          return {
            tasksByDate: {
              ...state.tasksByDate,
              [targetDate]: currentTasks.filter((t) => t.id !== taskId),
            },
          };
        });
      },

      setActiveDate: (date) => {
        set((state) => {
          const newTasksByDate = { ...state.tasksByDate };
          if (!newTasksByDate[date]) {
            newTasksByDate[date] = initializeDailyTasks();
          }
          return {
            activeDate: date,
            tasksByDate: newTasksByDate,
          };
        });
      },

      resetDailyTasks: (date) => {
        const targetDate = date || get().activeDate;
        set((state) => ({
          tasksByDate: {
            ...state.tasksByDate,
            [targetDate]: initializeDailyTasks(),
          },
        }));
      },

      addJournal: (journal) => {
        const id = generateId();
        const now = Date.now();
        set((state) => ({
          journals: [
            {
              ...journal,
              id,
              createdAt: now,
              updatedAt: now,
            },
            ...state.journals,
          ],
        }));
        return id;
      },

      updateJournal: (id, data) =>
        set((state) => ({
          journals: state.journals.map((j) =>
            j.id === id ? { ...j, ...data, updatedAt: Date.now() } : j
          ),
        })),

      deleteJournal: (id) =>
        set((state) => ({
          journals: state.journals.filter((j) => j.id !== id),
        })),

      getJournalById: (id) => get().journals.find((j) => j.id === id),
    }),
    {
      name: 'travel-icebreaker-storage',
      partialize: (state) => {
        const persisted: Record<string, unknown> = {
          favoriteTopics: state.favoriteTopics,
          attractions: state.attractions,
          currentRoute: state.currentRoute,
          currentRouteDate: state.currentRouteDate,
          tasksByDate: state.tasksByDate,
          activeDate: state.activeDate,
          journals: state.journals,
        };
        
        // 保留旧字段用于向后兼容（迁移完成后会被删除）
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyState = state as any;
        if (anyState.tasks) {
          persisted.tasks = anyState.tasks;
        }
        
        return persisted;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          const today = getTodayString();
          
          // 数据迁移：从旧版本 tasks 数组迁移到 tasksByDate
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const oldState = state as any;
          if (oldState.tasks && Array.isArray(oldState.tasks) && !state.tasksByDate) {
            const oldTasks = oldState.tasks as TravelTask[];
            const activeDate = state.activeDate || today;
            
            // 分离自定义任务和系统任务
            const customTasks = oldTasks.filter(t => t.isCustom);
            const completedSystemTasks = oldTasks.filter(t => !t.isCustom && t.completed);
            const systemTaskIds = new Set(completedSystemTasks.map(t => t.title));
            
            // 生成新的系统任务，但保留旧的完成状态
            let newDailyTasks = initializeDailyTasks().map(task => {
              if (systemTaskIds.has(task.title)) {
                const oldTask = oldTasks.find(t => t.title === task.title && t.completed);
                if (oldTask) {
                  return {
                    ...task,
                    completed: true,
                    completedAt: oldTask.completedAt,
                  };
                }
              }
              return task;
            });
            
            // 追加自定义任务
            newDailyTasks = [...newDailyTasks, ...customTasks];
            
            state.tasksByDate = {
              [activeDate]: newDailyTasks,
            };
            
            // 清理旧字段
            delete oldState.tasks;
            
            console.log('[数据迁移] 已将旧版本任务数据迁移到新结构');
            console.log(`  - 迁移了 ${customTasks.length} 个自定义任务`);
            console.log(`  - 保留了 ${completedSystemTasks.length} 个已完成的系统任务状态`);
          }
          
          if (state.activeDate !== today) {
            state.activeDate = today;
          }
          if (!state.tasksByDate) {
            state.tasksByDate = {
              [today]: initializeDailyTasks(),
            };
          } else if (!state.tasksByDate[today]) {
            state.tasksByDate[today] = initializeDailyTasks();
          }
        }
      },
    }
  )
);
