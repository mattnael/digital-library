// Format tanggal ke WIB; database menyimpan UTC dan UI menampilkan waktu
// Indonesia Barat seperti pada desain dashboard.
export function formatDateTime(value) {
  if (!value) {
    return '-';
  }
  return new Date(value).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatDate(value) {
  if (!value) {
    return '-';
  }
  return new Date(value).toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Metadata kartu katalog: "2026 · 248 halaman · PDF" atau "18:42 menit · YouTube".
export function formatMeta(content) {
  const parts = [];
  if (content.publishYear) {
    parts.push(content.publishYear);
  }
  if (content.contentType === 'Video YouTube') {
    if (content.durationMinutes) {
      parts.push(`${content.durationMinutes} menit`);
    }
    parts.push('YouTube');
  } else if (content.file) {
    if (content.totalPages) {
      parts.push(`${content.totalPages} halaman`);
    }
    parts.push(content.file.format.replace('.', '').toUpperCase());
  }
  return parts.join(' · ');
}

export function routeForContent(content) {
  if (!content) {
    return '/katalog';
  }
  if (content.contentType === 'Research Paper') {
    return `/paper/${content.id}`;
  }
  if (content.contentType === 'Video YouTube') {
    return `/video/${content.id}`;
  }
  return `/buku/${content.id}`;
}

export function formatFileSize(bytes) {
  if (!bytes) {
    return '-';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1).replace('.', ',')} ${units[index]}`;
}

export function apiErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}
