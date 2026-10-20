-- Skema awal Perpustakaan Digital.
-- Dijalankan otomatis oleh image postgres hanya saat volume data dibuat
-- pertama kali; seed data aplikasi ditangani server/src/seed.js.

CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name             VARCHAR(120) NOT NULL,
  email                 VARCHAR(180) NOT NULL UNIQUE,
  password_hash         VARCHAR(100) NOT NULL,
  role                  VARCHAR(10)  NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  is_active             BOOLEAN      NOT NULL DEFAULT TRUE,
  failed_login_attempts INT          NOT NULL DEFAULT 0,
  locked_until          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE courses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode       VARCHAR(20)  NOT NULL UNIQUE,
  nama       VARCHAR(120) NOT NULL,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE genres (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama         VARCHAR(80) NOT NULL,
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('E-book', 'Research Paper', 'Video YouTube')),
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nama, content_type)
);

CREATE TABLE contents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(200) NOT NULL,
  content_type     VARCHAR(20)  NOT NULL CHECK (content_type IN ('E-book', 'Research Paper', 'Video YouTube')),
  author           VARCHAR(160) NOT NULL,
  isbn             VARCHAR(20),
  language         VARCHAR(30),
  publisher        VARCHAR(120),
  edition          VARCHAR(60),
  publish_year     INT,
  total_pages      INT,
  duration_minutes INT,
  description      TEXT,
  youtube_url      VARCHAR(255),
  file_path        VARCHAR(255),
  file_name        VARCHAR(255),
  file_size        BIGINT,
  file_format      VARCHAR(10),
  course_id        UUID REFERENCES courses(id),
  genre_id         UUID REFERENCES genres(id),
  -- Soft delete: katalog hanya menampilkan is_active = true dan riwayat
  -- data tetap utuh untuk audit.
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  view_count       INT          NOT NULL DEFAULT 0,
  created_by       UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_contents_type ON contents(content_type);
CREATE INDEX idx_contents_course ON contents(course_id);
CREATE INDEX idx_contents_genre ON contents(genre_id);
CREATE INDEX idx_contents_active ON contents(is_active);

-- Jejak audit untuk dashboard admin: siapa melakukan apa, pada konten apa,
-- dari IP berapa. Tidak boleh di-update atau di-delete dari aplikasi.
CREATE TABLE activity_logs (
  id            BIGSERIAL PRIMARY KEY,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name     VARCHAR(120),
  user_role     VARCHAR(10),
  action        VARCHAR(10) NOT NULL CHECK (action IN ('VIEW', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REGISTER')),
  content_id    UUID,
  content_title VARCHAR(200),
  detail        VARCHAR(255),
  ip_address    VARCHAR(64),
  user_agent    VARCHAR(255),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- Filter katalog sebagai satu fungsi: NULL berarti filter tidak aktif.
-- Memanggilnya lewat SELECT * FROM list_contents($1, ..., $7) menjaga teks
-- SQL dari sisi aplikasi tetap pendek dan ber-parameter penuh.
CREATE OR REPLACE FUNCTION list_contents(
  p_include_inactive boolean,
  p_search text,
  p_type text,
  p_course_id uuid,
  p_genre_id uuid,
  p_limit int,
  p_offset int
)
RETURNS TABLE (
  id uuid,
  title varchar,
  content_type varchar,
  author varchar,
  isbn varchar,
  language varchar,
  publisher varchar,
  edition varchar,
  publish_year int,
  total_pages int,
  duration_minutes int,
  description text,
  youtube_url varchar,
  file_path varchar,
  file_name varchar,
  file_size bigint,
  file_format varchar,
  course_id uuid,
  genre_id uuid,
  is_active boolean,
  view_count int,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz,
  course_nama varchar,
  course_kode varchar,
  genre_nama varchar,
  total_count bigint
)
LANGUAGE sql
AS $$
  SELECT c.id, c.title, c.content_type, c.author, c.isbn, c.language,
         c.publisher, c.edition, c.publish_year, c.total_pages,
         c.duration_minutes, c.description, c.youtube_url, c.file_path,
         c.file_name, c.file_size, c.file_format, c.course_id, c.genre_id,
         c.is_active, c.view_count, c.created_by, c.created_at, c.updated_at,
         co.nama, co.kode, g.nama,
         (COUNT(*) OVER ())::bigint
  FROM contents c
  LEFT JOIN courses co ON co.id = c.course_id
  LEFT JOIN genres g ON g.id = c.genre_id
  WHERE (p_include_inactive OR c.is_active)
    AND (p_search IS NULL OR c.title ILIKE p_search OR c.author ILIKE p_search)
    AND (p_type IS NULL OR c.content_type = p_type)
    AND (p_course_id IS NULL OR c.course_id = p_course_id)
    AND (p_genre_id IS NULL OR c.genre_id = p_genre_id)
  ORDER BY c.created_at DESC
  LIMIT p_limit OFFSET p_offset
$$;

-- Sama seperti list_contents: filter log lewat parameter fungsi, NULL
-- berarti filter tidak aktif. p_to inklusif sampai akhir hari.
CREATE OR REPLACE FUNCTION list_activity_logs(
  p_from date,
  p_to date,
  p_action text,
  p_user_id uuid,
  p_limit int,
  p_offset int
)
RETURNS TABLE (
  id bigint,
  user_id uuid,
  user_name varchar,
  user_role varchar,
  action varchar,
  content_id uuid,
  content_title varchar,
  detail varchar,
  ip_address varchar,
  user_agent varchar,
  created_at timestamptz,
  total_count bigint
)
LANGUAGE sql
AS $$
  SELECT al.id, al.user_id, al.user_name, al.user_role, al.action,
         al.content_id, al.content_title, al.detail, al.ip_address,
         al.user_agent, al.created_at,
         (COUNT(*) OVER ())::bigint
  FROM activity_logs al
  WHERE (p_action IS NULL OR al.action = p_action)
    AND (p_user_id IS NULL OR al.user_id = p_user_id)
    AND (p_from IS NULL OR al.created_at >= p_from)
    AND (p_to IS NULL OR al.created_at < (p_to + INTERVAL '1 day'))
  ORDER BY al.created_at DESC
  LIMIT p_limit OFFSET p_offset
$$;
