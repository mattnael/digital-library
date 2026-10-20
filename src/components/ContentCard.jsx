import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, FileText, BookOpen } from 'lucide-react';
import { formatMeta, routeForContent } from '../utils/format';

const CARD_STYLES = {
  'E-book': { bg: 'bg-[#d4bc96]', badge: 'bg-white/90 text-[#133227]' },
  'Research Paper': { bg: 'bg-[#e5ecef]', badge: 'bg-[#133227] text-white' },
  'Video YouTube': { bg: 'bg-[#133227]', badge: 'bg-emerald-400 text-stone-900' },
};

export default function ContentCard({ content }) {
  const navigate = useNavigate();
  const style = CARD_STYLES[content.contentType] ?? CARD_STYLES['E-book'];
  const category = [content.course?.nama, content.genre?.nama].filter(Boolean).join(' · ');

  return (
    <div
      onClick={() => navigate(routeForContent(content))}
      className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:shadow-md transition flex flex-col justify-between p-4 cursor-pointer group"
    >
      {/* Thumbnail Banner Berdasarkan Jenis */}
      <div className={`h-44 ${style.bg} rounded-xl mb-4 p-4 flex flex-col justify-between relative text-stone-900 overflow-hidden shadow-inner`}>
        <div className="flex justify-between items-start">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${style.badge}`}>
            {content.contentType}
          </span>
          {content.contentType === 'Video YouTube' && (
            <div className="w-8 h-8 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white">
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </div>
          )}
          {content.contentType === 'Research Paper' && (
            <FileText className="w-5 h-5 text-stone-600" />
          )}
          {content.contentType === 'E-book' && (
            <BookOpen className="w-5 h-5 text-stone-700" />
          )}
        </div>
        <h4 className="font-serif text-base font-bold line-clamp-2 leading-snug">
          {content.title}
        </h4>
      </div>

      {/* Detail Konten */}
      <div className="space-y-1.5 text-xs">
        <p className="font-semibold text-stone-900 line-clamp-1">{content.title}</p>
        <p className="text-stone-500 line-clamp-1">{content.author}</p>
        <p className="text-stone-400 truncate">{category || '-'}</p>
        <p className="text-[11px] text-stone-400 pt-1">{formatMeta(content) || '-'}</p>
      </div>

      {/* Footer Card */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs font-semibold text-[#133227]">
        <span>Lihat detail</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
      </div>
    </div>
  );
}
