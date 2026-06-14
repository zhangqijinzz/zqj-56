import { MapPin } from 'lucide-react';
import NavCard from '@/components/NavCard';

const navItems = [
  {
    emoji: '💬',
    title: '破冰话题卡',
    description: '旅伴、民宿、拼桌...再也不怕空气突然安静',
    path: '/icebreaker',
    gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
    delay: 100,
  },
  {
    emoji: '🎲',
    title: '路线抽签',
    description: '选择困难？让命运决定今天去哪里',
    path: '/route',
    gradient: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    delay: 200,
  },
  {
    emoji: '✅',
    title: '旅行任务单',
    description: '拍照、观察、品尝、记录，让旅途更有仪式感',
    path: '/tasks',
    gradient: 'bg-gradient-to-br from-rose-400 to-pink-500',
    delay: 300,
  },
  {
    emoji: '📔',
    title: '本地纪念册',
    description: '用文字、贴纸和照片拼出你的旅行日记',
    path: '/journal',
    gradient: 'bg-gradient-to-br from-violet-400 to-purple-500',
    delay: 400,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>完全离线可用</span>
          </div>
          <h1 className="hand-title text-5xl mb-3">
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
              无网旅行
            </span>
          </h1>
          <h2 className="hand-title text-3xl text-ink/80">破冰包</h2>
          <p className="mt-4 text-amber-800/70 max-w-xs mx-auto leading-relaxed">
            背包客的旅行伴侣<br />
            陪你走过每一段旅途
          </p>
        </div>

        <div className="space-y-4">
          {navItems.map((item) => (
            <NavCard key={item.path} {...item} />
          ))}
        </div>

        <div className="mt-10 text-center animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="inline-flex items-center gap-2 text-amber-600/60 text-sm">
            <span>🧳</span>
            <span>愿你一路顺风，旅途愉快</span>
            <span>🌿</span>
          </div>
        </div>
      </div>
    </div>
  );
}
