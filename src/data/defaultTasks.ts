import type { TravelTask, TaskCategoryKey } from '@/types';

const createDefaultTask = (
  title: string,
  category: TaskCategoryKey,
  icon: string
): Omit<TravelTask, 'id' | 'completed' | 'isCustom'> => ({
  title,
  category,
  icon,
});

export const defaultTasks: Omit<TravelTask, 'id' | 'completed' | 'isCustom'>[] = [
  createDefaultTask('拍一张天空的照片', 'photo', '📷'),
  createDefaultTask('和一个陌生人微笑', 'photo', '📷'),
  createDefaultTask('拍一张当地特色建筑', 'photo', '📷'),
  createDefaultTask('捕捉路人有趣的瞬间', 'photo', '📷'),
  createDefaultTask('拍一张只有脚和风景的照片', 'photo', '📷'),
  createDefaultTask('拍一张早餐的照片', 'photo', '📷'),
  createDefaultTask('找一个有趣的路牌合影', 'photo', '📷'),
  createDefaultTask('拍一张光影交错的照片', 'photo', '📷'),
  
  createDefaultTask('观察当地人的生活节奏', 'observe', '👀'),
  createDefaultTask('看看当地人怎么打招呼', 'observe', '👀'),
  createDefaultTask('找一个高处看城市全景', 'observe', '👀'),
  createDefaultTask('观察一种特别的植物或动物', 'observe', '👀'),
  createDefaultTask('看一次日出或日落', 'observe', '👀'),
  createDefaultTask('听街上的声音，记录三种', 'observe', '👀'),
  createDefaultTask('观察当地的交通工具', 'observe', '👀'),
  createDefaultTask('看当地人怎样买菜', 'observe', '👀'),
  
  createDefaultTask('尝试一道当地特色菜', 'taste', '🍜'),
  createDefaultTask('喝一杯当地的饮品', 'taste', '🍜'),
  createDefaultTask('吃一种从没吃过的水果', 'taste', '🍜'),
  createDefaultTask('在路边摊吃点什么', 'taste', '🍜'),
  createDefaultTask('尝尝当地的早餐', 'taste', '🍜'),
  createDefaultTask('去当地人推荐的馆子', 'taste', '🍜'),
  createDefaultTask('试试用当地语言点餐', 'taste', '🍜'),
  createDefaultTask('买一份街头小吃边走边吃', 'taste', '🍜'),
  
  createDefaultTask('写三句今天的感悟', 'record', '✍️'),
  createDefaultTask('记录一个遇到的陌生人', 'record', '✍️'),
  createDefaultTask('画一张今天看到的东西', 'record', '✍️'),
  createDefaultTask('录一段环境声音', 'record', '✍️'),
  createDefaultTask('用三个词形容今天', 'record', '✍️'),
  createDefaultTask('写一张明信片给自己', 'record', '✍️'),
  createDefaultTask('记录一段有趣的对话', 'record', '✍️'),
  createDefaultTask('写下今天最感恩的三件事', 'record', '✍️'),
];

export const getTasksByCategory = (category: TaskCategoryKey) =>
  defaultTasks.filter(t => t.category === category);
