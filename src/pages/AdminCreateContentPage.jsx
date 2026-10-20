import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

export default function AdminCreateContentPage() {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState('E-book');

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header Title */}
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            TAMBAH KONTEN
          </span>
          <h1 className="text-3xl font-serif text-stone-900 font-normal">
            Tambahkan sumber belajar
          </h1>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-6">
          
          {/* Jenis Konten Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 block">
              Jenis konten <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {['E-book', 'Research Paper', 'Video YouTube'].map((type) => (
                <label 
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                    contentType === type
                      ? 'bg-[#e5ede9] border-[#133227] text-[#133227]'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="contentType" 
                    checked={contentType === type} 
                    onChange={() => setContentType(type)}
                    className="text-[#133227] focus:ring-[#133227]" 
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-stone-700 block">
                Judul konten <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Lorem Ipsum dolor sit amet"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-stone-700 block">
                Mata kuliah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Lorem Ipsum dolor sit amet"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-stone-700 block">
                Genre <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Lorem Ipsum"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 block">
              Penulis <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Lorem Ipsum dolor sit amet"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                ISBN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Lorem Ipsum dolor sit amet"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                File E-Book <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Upload or Drop your file here *"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 block">
              Deskripsi
            </label>
            <textarea
              rows="4"
              placeholder="Lorem Ipsum dolor sit amet"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
            <span className="text-xs text-stone-400">* Wajib diisi.</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/admin/content')}
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Batal
              </button>
              <button 
                onClick={() => navigate('/admin/content')}
                className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                Simpan konten
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}