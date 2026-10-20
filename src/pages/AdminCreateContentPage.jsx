import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { contentApi, categoryApi } from '../api/endpoints';
import { apiErrorMessage } from '../utils/format';
import { AlertCircle, ChevronDown, Upload } from 'lucide-react';

const TYPES = ['E-book', 'Research Paper', 'Video YouTube'];
const EMPTY_FORM = {
  title: '',
  author: '',
  isbn: '',
  language: 'Indonesia',
  publisher: '',
  edition: '',
  publishYear: '',
  totalPages: '',
  durationMinutes: '',
  description: '',
  youtubeUrl: '',
  courseId: '',
  genreId: '',
};

export default function AdminCreateContentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [contentType, setContentType] = useState('E-book');
  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState({ courses: [], genres: [] });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(Boolean(editId));
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Untuk mode edit, berkas lama tetap dipakai bila admin tidak mengunggah baru.
  const [formHasExistingFile, setFormHasExistingFile] = useState(false);

  useEffect(() => {
    categoryApi
      .list()
      .then(setCategories)
      .catch(() => setLoadError('Gagal memuat daftar mata kuliah dan genre.'));
  }, []);

  // Mode edit: isi form dari data yang ada; pengunggahan berkas bersifat opsional
  // selama konten sudah punya berkas sebelumnya. Reset saat editId berubah
  // dilakukan saat render, bukan di effect.
  const [prevEditId, setPrevEditId] = useState(editId);
  if (prevEditId !== editId) {
    setPrevEditId(editId);
    setLoading(Boolean(editId));
    setLoadError('');
    setForm(EMPTY_FORM);
    setFormHasExistingFile(false);
  }

  useEffect(() => {
    if (!editId) {
      return;
    }
    contentApi
      .detail(editId)
      .then(({ content }) => {
        setContentType(content.contentType);
        setFormHasExistingFile(Boolean(content.file));
        setForm({
          title: content.title,
          author: content.author,
          isbn: content.isbn || '',
          language: content.language || '',
          publisher: content.publisher || '',
          edition: content.edition || '',
          publishYear: content.publishYear ?? '',
          totalPages: content.totalPages ?? '',
          durationMinutes: content.durationMinutes ?? '',
          description: content.description || '',
          youtubeUrl: content.youtubeUrl || '',
          courseId: content.course?.id || '',
          genreId: content.genre?.id || '',
        });
      })
      .catch(() => setLoadError('Konten tidak ditemukan atau gagal dimuat.'))
      .finally(() => setLoading(false));
  }, [editId]);

  const genresForType = useMemo(
    () => categories.genres.filter((genre) => genre.contentType === contentType),
    [categories.genres, contentType],
  );

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const switchType = (type) => {
    setContentType(type);
    setForm((prev) => ({ ...prev, genreId: '' }));
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.title.trim() || !form.author.trim()) {
      setErrorMessage('Judul dan penulis wajib diisi.');
      return;
    }
    const isDocument = contentType !== 'Video YouTube';
    if (isDocument && !file && !(editId && formHasExistingFile)) {
      setErrorMessage('Berkas PDF/EPUB wajib diunggah untuk jenis konten ini.');
      return;
    }
    if (contentType === 'Video YouTube' && !form.youtubeUrl.trim()) {
      setErrorMessage('URL YouTube wajib diisi untuk video.');
      return;
    }

    const data = new FormData();
    data.append('title', form.title);
    data.append('contentType', contentType);
    data.append('author', form.author);
    data.append('isbn', form.isbn);
    data.append('language', form.language);
    data.append('publisher', form.publisher);
    data.append('edition', form.edition);
    data.append('publishYear', form.publishYear);
    data.append('totalPages', form.totalPages);
    data.append('durationMinutes', form.durationMinutes);
    data.append('description', form.description);
    data.append('youtubeUrl', form.youtubeUrl);
    if (form.courseId) {
      data.append('courseId', form.courseId);
    }
    if (form.genreId) {
      data.append('genreId', form.genreId);
    }
    if (file) {
      data.append('file', file);
    }

    setSubmitting(true);
    try {
      if (editId) {
        await contentApi.update(editId, data);
        setSuccessMessage('Konten berhasil diperbarui.');
      } else {
        await contentApi.create(data);
        setSuccessMessage('Konten berhasil ditambahkan.');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/admin/content'), 800);
    } catch (error) {
      setErrorMessage(apiErrorMessage(error, 'Gagal menyimpan konten. Coba lagi.'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]';

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header Title */}
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            {editId ? 'EDIT KONTEN' : 'TAMBAH KONTEN'}
          </span>
          <h1 className="text-3xl font-serif text-stone-900 font-normal">
            {editId ? 'Perbarui sumber belajar' : 'Tambahkan sumber belajar'}
          </h1>
        </div>

        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm flex gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <p className="font-semibold text-xs">{loadError}</p>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-6">

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-semibold text-emerald-800">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm flex gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <p className="font-semibold text-xs">{errorMessage}</p>
            </div>
          )}

          {/* Jenis Konten Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 block">
              Jenis konten <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              {TYPES.map((type) => (
                <label
                  key={type}
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
                    onChange={() => switchType(type)}
                    disabled={submitting}
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
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="Judul buku, paper, atau video"
                disabled={loading || submitting}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-stone-700 block">
                Mata kuliah
              </label>
              <div className="relative">
                <select
                  value={form.courseId}
                  onChange={(e) => setField('courseId', e.target.value)}
                  disabled={loading || submitting}
                  className={inputClass + ' appearance-none cursor-pointer'}
                >
                  <option value="">Pilih mata kuliah</option>
                  {categories.courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.kode} - {course.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-stone-700 block">
                Genre
              </label>
              <div className="relative">
                <select
                  value={form.genreId}
                  onChange={(e) => setField('genreId', e.target.value)}
                  disabled={loading || submitting}
                  className={inputClass + ' appearance-none cursor-pointer'}
                >
                  <option value="">Pilih genre</option>
                  {genresForType.map((genre) => (
                    <option key={genre.id} value={genre.id}>{genre.nama}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Penulis / Channel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setField('author', e.target.value)}
                placeholder="Nama penulis atau channel"
                disabled={loading || submitting}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Bahasa</label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setField('language', e.target.value)}
                placeholder="Indonesia"
                disabled={loading || submitting}
                className={inputClass}
              />
            </div>
          </div>

          {contentType !== 'Video YouTube' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">ISBN</label>
                <input
                  type="text"
                  value={form.isbn}
                  onChange={(e) => setField('isbn', e.target.value)}
                  placeholder="978-..."
                  disabled={loading || submitting}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Penerbit / Jurnal</label>
                <input
                  type="text"
                  value={form.publisher}
                  onChange={(e) => setField('publisher', e.target.value)}
                  placeholder="Nama penerbit"
                  disabled={loading || submitting}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Edisi</label>
                <input
                  type="text"
                  value={form.edition}
                  onChange={(e) => setField('edition', e.target.value)}
                  placeholder="Edisi revisi / Edisi ke-2"
                  disabled={loading || submitting}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Tahun terbit</label>
                <input
                  type="number"
                  value={form.publishYear}
                  onChange={(e) => setField('publishYear', e.target.value)}
                  placeholder="2026"
                  min="1400"
                  max="2100"
                  disabled={loading || submitting}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  {contentType === 'E-book' ? 'Jumlah halaman' : 'Jumlah halaman (opsional)'}
                </label>
                <input
                  type="number"
                  value={form.totalPages}
                  onChange={(e) => setField('totalPages', e.target.value)}
                  placeholder="248"
                  min="1"
                  disabled={loading || submitting}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-stone-700 block">
                  Berkas {contentType === 'E-book' ? 'E-Book' : 'Paper'} (PDF/EPUB, maks 25 MB)
                  {!editId && <span className="text-rose-500"> *</span>}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.epub,application/pdf,application/epub+zip"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  disabled={loading || submitting}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || submitting}
                  className="w-full bg-stone-50 border border-dashed border-stone-300 hover:border-[#133227] rounded-xl py-4 px-3.5 text-xs text-stone-500 transition cursor-pointer flex items-center justify-center gap-2 text-left"
                >
                  <Upload className="w-4 h-4 shrink-0 text-stone-400" />
                  {file ? file.name : 'Pilih atau jatuhkan berkas di sini (klik untuk memilih)'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-stone-700 block">
                  URL YouTube <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={form.youtubeUrl}
                  onChange={(e) => setField('youtubeUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={loading || submitting}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Durasi (menit)</label>
                <input
                  type="number"
                  value={form.durationMinutes}
                  onChange={(e) => setField('durationMinutes', e.target.value)}
                  placeholder="18"
                  min="1"
                  disabled={loading || submitting}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 block">Deskripsi</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Ringkasan konten untuk katalog"
              disabled={loading || submitting}
              className={inputClass}
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
            <span className="text-xs text-stone-400">* Wajib diisi.</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/content')}
                disabled={submitting}
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || submitting}
                className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-wait"
              >
                {submitting ? 'Menyimpan...' : editId ? 'Simpan perubahan' : 'Simpan konten'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
