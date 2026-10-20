import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { categoryApi } from '../api/endpoints';
import { apiErrorMessage } from '../utils/format';
import { Plus, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';

const TYPES = ['E-book', 'Research Paper', 'Video YouTube'];

export default function AdminCategoryPage() {
  const [courses, setCourses] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState(null); // { type: 'ok' | 'err', text }

  // Form mata kuliah: dipakai untuk tambah dan edit (editCourse null = tambah).
  const [courseForm, setCourseForm] = useState({ kode: '', nama: '' });
  const [editCourse, setEditCourse] = useState(null);
  const [savingCourse, setSavingCourse] = useState(false);

  // Form genre: dipakai untuk tambah dan edit (editGenre null = tambah).
  const [genreForm, setGenreForm] = useState({ nama: '', contentType: 'E-book' });
  const [editGenre, setEditGenre] = useState(null);
  const [savingGenre, setSavingGenre] = useState(false);

  const load = useCallback(() => {
    categoryApi
      .list()
      .then((data) => {
        setCourses(data.courses);
        setGenres(data.genres);
        setLoadError('');
        setLoading(false);
      })
      .catch(() => {
        setLoadError('Gagal memuat kategori. Coba lagi beberapa saat.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  const startEditCourse = (course) => {
    setEditCourse(course);
    setCourseForm({ kode: course.kode, nama: course.nama });
  };

  const resetCourseForm = () => {
    setEditCourse(null);
    setCourseForm({ kode: '', nama: '' });
  };

  const submitCourse = async () => {
    if (!courseForm.kode.trim() || !courseForm.nama.trim()) {
      showNotice('err', 'Kode dan nama mata kuliah wajib diisi.');
      return;
    }
    setSavingCourse(true);
    setLoading(true);
    try {
      if (editCourse) {
        await categoryApi.updateCourse(editCourse.id, courseForm.kode.trim(), courseForm.nama.trim());
        showNotice('ok', `Mata kuliah ${courseForm.kode} diperbarui.`);
      } else {
        await categoryApi.createCourse(courseForm.kode.trim(), courseForm.nama.trim());
        showNotice('ok', `Mata kuliah ${courseForm.kode} ditambahkan.`);
      }
      resetCourseForm();
      load();
    } catch (error) {
      showNotice('err', apiErrorMessage(error, 'Gagal menyimpan mata kuliah.'));
    } finally {
      setSavingCourse(false);
    }
  };

  const startEditGenre = (genre) => {
    setEditGenre(genre);
    setGenreForm({ nama: genre.nama, contentType: genre.contentType });
  };

  const resetGenreForm = () => {
    setEditGenre(null);
    setGenreForm({ nama: '', contentType: 'E-book' });
  };

  const submitGenre = async () => {
    if (!genreForm.nama.trim()) {
      showNotice('err', 'Nama genre wajib diisi.');
      return;
    }
    setSavingGenre(true);
    setLoading(true);
    try {
      if (editGenre) {
        await categoryApi.updateGenre(editGenre.id, genreForm.nama.trim(), genreForm.contentType);
        showNotice('ok', `Genre ${genreForm.nama} diperbarui.`);
      } else {
        await categoryApi.createGenre(genreForm.nama.trim(), genreForm.contentType);
        showNotice('ok', `Genre ${genreForm.nama} ditambahkan.`);
      }
      resetGenreForm();
      load();
    } catch (error) {
      showNotice('err', apiErrorMessage(error, 'Gagal menyimpan genre.'));
    } finally {
      setSavingGenre(false);
    }
  };

  const inputClass =
    'w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]';

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            Category
          </span>
          <h1 className="text-3xl font-serif text-stone-900 font-normal">
            Content Category
          </h1>
        </div>

        {notice && (
          <div className={`rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 ${
            notice.type === 'ok'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {notice.type === 'ok'
              ? <CheckCircle2 className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />}
            {notice.text}
          </div>
        )}

        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs font-semibold text-red-700">
            {loadError}
          </div>
        )}

        {/* Top Tables Grid: Mata Kuliah & Genre */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Tabel Mata Kuliah */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-stone-900">Mata kuliah</h3>
              <button
                onClick={resetCourseForm}
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah mata kuliah
              </button>
            </div>

            <div className="overflow-x-auto pt-2">
              {loading ? (
                <p className="text-xs text-stone-500 py-6 text-center">Memuat...</p>
              ) : courses.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">Belum ada mata kuliah.</p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#e5ede9] text-[#133227] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 rounded-l-xl">Kode</th>
                      <th className="py-3 px-4">Nama Mata Kuliah</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-stone-50 transition">
                        <td className="py-3.5 px-4 font-mono text-stone-500">{course.kode}</td>
                        <td className="py-3.5 px-4 font-semibold text-stone-900">{course.nama}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => startEditCourse(course)}
                            className="text-[#133227] hover:underline font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Tabel Genre */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-stone-900">Genre</h3>
              <button
                onClick={resetGenreForm}
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah genre
              </button>
            </div>

            <div className="overflow-x-auto pt-2">
              {loading ? (
                <p className="text-xs text-stone-500 py-6 text-center">Memuat...</p>
              ) : genres.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">Belum ada genre.</p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#e5ede9] text-[#133227] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 rounded-l-xl">Nama Genre</th>
                      <th className="py-3 px-4">Jenis Konten</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {genres.map((genre) => (
                      <tr key={genre.id} className="hover:bg-stone-50 transition">
                        <td className="py-3.5 px-4 font-semibold text-stone-900">{genre.nama}</td>
                        <td className="py-3.5 px-4 text-stone-600">{genre.contentType}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => startEditGenre(genre)}
                            className="text-[#133227] hover:underline font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Forms Grid: Edit/Tambah Mata Kuliah & Edit/Tambah Genre */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form Mata Kuliah */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editCourse ? 'Edit mata kuliah' : 'Tambah mata kuliah'}
              </h3>
              {editCourse && (
                <div>
                  <span className="bg-[#e5ede9] text-[#133227] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                    Dipilih: {editCourse.kode}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Kode mata kuliah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseForm.kode}
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, kode: e.target.value }))}
                  placeholder="IMK01"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Nama mata kuliah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseForm.nama}
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, nama: e.target.value }))}
                  placeholder="Interaksi Manusia & Komputer"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={submitCourse}
                disabled={savingCourse}
                className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-wait"
              >
                {savingCourse ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                onClick={resetCourseForm}
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Batal
              </button>
            </div>
          </div>

          {/* Form Genre */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              {editGenre ? 'Edit genre' : 'Tambah genre'}
            </h3>
            {editGenre && (
              <div>
                <span className="bg-[#e5ede9] text-[#133227] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                  Dipilih: {editGenre.nama}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Nama genre <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={genreForm.nama}
                  onChange={(e) => setGenreForm((prev) => ({ ...prev, nama: e.target.value }))}
                  placeholder="Teknologi"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Jenis konten <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={genreForm.contentType}
                    onChange={(e) => setGenreForm((prev) => ({ ...prev, contentType: e.target.value }))}
                    className={inputClass + ' appearance-none cursor-pointer'}
                  >
                    {TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={submitGenre}
                disabled={savingGenre}
                className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-wait"
              >
                {savingGenre ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                onClick={resetGenreForm}
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Batal
              </button>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
