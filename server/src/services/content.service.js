import { extractYouTubeId } from '../schemas.js';

export function formatBytes(bytes) {
  if (!bytes) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function toContent(row) {
  return {
    id: row.id,
    title: row.title,
    contentType: row.content_type,
    author: row.author,
    isbn: row.isbn,
    language: row.language,
    publisher: row.publisher,
    edition: row.edition,
    publishYear: row.publish_year,
    totalPages: row.total_pages,
    durationMinutes: row.duration_minutes,
    description: row.description,
    youtubeUrl: row.youtube_url,
    youtubeId: row.youtube_url ? extractYouTubeId(row.youtube_url) : null,
    file: row.file_path
      ? { name: row.file_name, size: row.file_size, format: row.file_format }
      : null,
    course: row.course_id ? { id: row.course_id, kode: row.course_kode, nama: row.course_nama } : null,
    genre: row.genre_id ? { id: row.genre_id, nama: row.genre_nama } : null,
    isActive: row.is_active,
    viewCount: row.view_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
