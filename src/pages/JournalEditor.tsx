import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Image, Sticker, Trash2, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import { stickerTypes, type StickerPlacement } from '@/types';

export default function JournalEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  
  const { getJournalById, addJournal, updateJournal } = useAppStore();
  const existingJournal = isEdit ? getJournalById(id!) : undefined;

  const [title, setTitle] = useState(existingJournal?.title || '');
  const [content, setContent] = useState(existingJournal?.content || '');
  const [date, setDate] = useState(existingJournal?.date || new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState(existingJournal?.location || '');
  const [photos, setPhotos] = useState<string[]>(existingJournal?.photos || []);
  const [stickers, setStickers] = useState<StickerPlacement[]>(existingJournal?.stickers || []);
  
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{
    isDragging: boolean;
    stickerId: string | null;
    offsetX: number;
    offsetY: number;
  }>({
    isDragging: false,
    stickerId: null,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    if (isEdit && !existingJournal) {
      navigate('/journal');
    }
  }, [isEdit, existingJournal, navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 9 - photos.length;
    if (remainingSlots <= 0) {
      e.target.value = '';
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotos((prev) => {
          if (prev.length >= 9) return prev;
          return [...prev, result];
        });
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addSticker = (type: string) => {
    const newSticker: StickerPlacement = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      x: 50 + Math.random() * 30,
      y: 50 + Math.random() * 30,
      scale: 1,
      rotation: 0,
    };
    setStickers((prev) => [...prev, newSticker]);
    setShowStickerPanel(false);
    setSelectedSticker(null);
  };

  const handleStickerMouseDown = (e: React.MouseEvent | React.TouchEvent, stickerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sticker = stickers.find((s) => s.id === stickerId);
    if (!sticker || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    dragRef.current = {
      isDragging: true,
      stickerId,
      offsetX: x - sticker.x,
      offsetY: y - sticker.y,
    };
    
    setActiveStickerId(stickerId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragRef.current.isDragging || !dragRef.current.stickerId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 100 - dragRef.current.offsetX;
    const y = ((clientY - rect.top) / rect.height) * 100 - dragRef.current.offsetY;

    setStickers((prev) =>
      prev.map((s) =>
        s.id === dragRef.current!.stickerId
          ? { ...s, x: Math.max(0, Math.min(90, x)), y: Math.max(0, Math.min(90, y)) }
          : s
      )
    );
  };

  const handleCanvasMouseUp = () => {
    dragRef.current.isDragging = false;
    dragRef.current.stickerId = null;
  };

  const deleteSticker = (stickerId: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== stickerId));
    setActiveStickerId(null);
  };

  const handleSave = () => {
    const journalData = {
      title: title.trim(),
      content: content.trim(),
      date,
      location: location.trim(),
      photos,
      stickers,
    };

    if (isEdit && id) {
      updateJournal(id, journalData);
    } else {
      addJournal(journalData);
    }
    
    navigate('/journal');
  };

  return (
    <div 
      className="min-h-screen"
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      onTouchMove={handleCanvasMouseMove}
      onTouchEnd={handleCanvasMouseUp}
    >
      <PageHeader
        title={isEdit ? '编辑日记' : '新建日记'}
        subtitle={isEdit ? '修改你的旅行记忆' : '记录今天的故事'}
        emoji="✍️"
        rightAction={
          <button
            onClick={handleSave}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        }
      />

      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="space-y-4 mb-6 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">地点</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="今天在哪里？"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给这一天起个名字..."
              className="input-field"
            />
          </div>
        </div>

        <div 
          ref={canvasRef}
          className="card-paper p-6 mb-6 animate-slide-up relative min-h-[400px]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 27px,
                rgba(251, 191, 36, 0.2) 27px,
                rgba(251, 191, 36, 0.2) 28px
              )
            `,
            backgroundPosition: '0 10px',
          }}
          onClick={() => setActiveStickerId(null)}
        >
          <div className="space-y-4 relative">
            <div className="flex gap-2 flex-wrap">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {photos.length < 9 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-amber-300 flex flex-col items-center justify-center text-amber-500 hover:border-amber-500 hover:text-amber-600 transition-colors"
                >
                  <Image className="w-6 h-6" />
                  <span className="text-xs mt-1">添加</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="今天发生了什么有趣的事？遇到了什么人？看到了什么风景？

写下来吧，这些都会成为珍贵的回忆..."
              className="w-full min-h-[250px] bg-transparent border-none outline-none resize-none text-amber-900 leading-[28px] placeholder:text-amber-400"
              style={{ lineHeight: '28px' }}
            />
          </div>

          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              className={`absolute cursor-grab active:cursor-grabbing select-none transition-transform ${
                activeStickerId === sticker.id ? 'z-20 scale-110' : 'z-10'
              }`}
              style={{
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                transform: `scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
              }}
              onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
              onTouchStart={(e) => handleStickerMouseDown(e, sticker.id)}
              onClick={(e) => {
                e.stopPropagation();
                setActiveStickerId(sticker.id);
              }}
            >
              <span className="text-3xl drop-shadow-sm">{sticker.type}</span>
              {activeStickerId === sticker.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSticker(sticker.id);
                  }}
                  className="absolute -top-3 -right-3 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs shadow-md"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 btn-ghost flex items-center justify-center gap-2"
          >
            <Image className="w-5 h-5" />
            添加照片
          </button>
          <button
            onClick={() => setShowStickerPanel(!showStickerPanel)}
            className={`flex-1 flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-xl transition-all duration-300 active:scale-95 ${
              showStickerPanel
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
            }`}
          >
            <Sticker className="w-5 h-5" />
            添加贴纸
          </button>
        </div>

        {showStickerPanel && (
          <div className="mt-4 card-paper p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h4 className="hand-title text-lg">选择贴纸</h4>
              <button
                onClick={() => setShowStickerPanel(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-100"
              >
                <X className="w-4 h-4 text-amber-700" />
              </button>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {stickerTypes.map((sticker, index) => (
                <button
                  key={index}
                  onClick={() => addSticker(sticker)}
                  className="sticker-btn"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-amber-700/60 animate-fade-in">
          <p className="text-sm">
            💡 长按并拖动贴纸可以调整位置
          </p>
        </div>
      </div>
    </div>
  );
}
