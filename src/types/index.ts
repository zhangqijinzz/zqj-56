export interface Topic {
  id: string;
  content: string;
  category: 'companion' | 'hostel' | 'dining';
  difficulty: 'easy' | 'medium' | 'deep';
}

export interface Attraction {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  createdAt: number;
}

export interface TravelTask {
  id: string;
  title: string;
  category: 'photo' | 'observe' | 'taste' | 'record';
  icon: string;
  completed: boolean;
  completedAt?: number;
  isCustom: boolean;
}

export interface StickerPlacement {
  id: string;
  type: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  location: string;
  photos: string[];
  stickers: StickerPlacement[];
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  favoriteTopics: string[];
  attractions: Attraction[];
  currentRoute: string[] | null;
  currentRouteDate: string | null;
  tasksByDate: Record<string, TravelTask[]>;
  activeDate: string;
  journals: JournalEntry[];
  
  toggleFavoriteTopic: (topicId: string) => void;
  addAttraction: (attraction: Omit<Attraction, 'id' | 'createdAt'>) => void;
  updateAttraction: (id: string, data: Partial<Attraction>) => void;
  deleteAttraction: (id: string) => void;
  generateRoute: (count: number) => string[] | null;
  clearRoute: () => void;
  getTasksByDate: (date: string) => TravelTask[];
  addTask: (task: Omit<TravelTask, 'id' | 'completed' | 'isCustom'>, date?: string) => void;
  toggleTask: (taskId: string, date?: string) => void;
  deleteTask: (taskId: string, date?: string) => void;
  setActiveDate: (date: string) => void;
  resetDailyTasks: (date?: string) => void;
  addJournal: (journal: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateJournal: (id: string, data: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  getJournalById: (id: string) => JournalEntry | undefined;
}

export type CategoryKey = 'companion' | 'hostel' | 'dining';
export type TaskCategoryKey = 'photo' | 'observe' | 'taste' | 'record';

export const categoryLabels: Record<CategoryKey, string> = {
  companion: '旅伴同行',
  hostel: '民宿夜聊',
  dining: '拼桌时光',
};

export const taskCategoryLabels: Record<TaskCategoryKey, string> = {
  photo: '拍照打卡',
  observe: '用心观察',
  taste: '品尝美食',
  record: '记录心情',
};

export const taskCategoryIcons: Record<TaskCategoryKey, string> = {
  photo: '📷',
  observe: '👀',
  taste: '🍜',
  record: '✍️',
};

export const stickerTypes = [
  '🌟', '🌈', '☀️', '🌙', '⛰️', '🌊', '🌸', '🍃',
  '🎒', '🚂', '✈️', '🚲', '🗺️', '🧭', '📸', '📝',
  '☕', '🍜', '🍰', '🍺', '🌮', '🍣', '🥘', '🍉',
  '😊', '🥰', '😆', '🤔', '😴', '🤩', '😎', '🥳',
  '❤️', '💫', '✨', '🔥', '💯', '🎉', '🎊', '🏆',
];
