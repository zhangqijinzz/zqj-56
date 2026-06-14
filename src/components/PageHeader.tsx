import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  emoji,
  showBack = true,
  rightAction,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-amber-100/50">
      <div className="container max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 hover:bg-amber-100 transition-all duration-200 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-amber-700" />
              </button>
            )}
            <div>
              <h1 className="hand-title text-2xl leading-tight flex items-center gap-2">
                {emoji && <span className="text-2xl">{emoji}</span>}
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-amber-700/70 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {rightAction}
        </div>
      </div>
    </div>
  );
}
