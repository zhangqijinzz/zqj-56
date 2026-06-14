import { useNavigate } from 'react-router-dom';

interface NavCardProps {
  emoji: string;
  title: string;
  description: string;
  path: string;
  gradient: string;
  delay?: number;
}

export default function NavCard({
  emoji,
  title,
  description,
  path,
  gradient,
  delay = 0,
}: NavCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group text-left w-full card-paper card-paper-hover p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="hand-title text-xl mb-1 group-hover:text-amber-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-amber-800/70 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
