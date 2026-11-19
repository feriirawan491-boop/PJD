# Indotek Finance — Frontend

Frontend Next.js App Router + TypeScript strict + Tailwind CSS v4 untuk PRD Dashboard Web Reimburse & Perjalanan Dinas Indotek. Implementasi ini khusus UI/UX: tidak ada API, database, autentikasi, atau perubahan bot.

## Menjalankan

```sh
cd frontend
npm ci
npm run dev
```

Buka http://localhost:3000. `/` dan `/dashboard` membuka workspace demo; `/login` membuka login demo. Email harus valid dan password minimal delapan karakter untuk validasi UI saja. Jangan gunakan kredensial asli. Tombol **Buka demo tanpa akun** tersedia.

```sh
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
# Alternatif jika Chrome sudah tersedia:
PLAYWRIGHT_CHROME_CHANNEL=chrome npm run test:e2e
npm run format:check
```

Build static berada di `out/`; dapat disajikan oleh static hosting. `npm start` bukan server untuk output export; gunakan static server untuk `out/` atau `npm run dev` untuk development.

## Struktur

- `src/app`: halaman dan metadata Server Components, error/loading boundaries.
- `src/features/dashboard`: workspace dan section UI, tabel, dialog keputusan, login demo.
- `src/components/ui.tsx`: Button, Badge, EmptyState, dialog Radix aksesibel.
- `src/constants`: identitas perusahaan dan konfigurasi navigasi.
- `src/types`: kontrak data frontend.
- `src/lib/finance.ts`: formatting, filter, aturan simulasi, ekspor XLSX secara lazy.
- `tests`: unit, component, E2E desktop/mobile.
- `public/fonts`: font Plus Jakarta Sans dari Google Fonts beserta OFL.

## Interaksi

- Navigasi section via hash, sidebar drawer mobile, skip link, modal dengan pengelolaan fokus Radix.
- KPI/grafik dihitung dari dataset contoh, tabel searchable dengan debounce 250 ms, filter status/periode, sortir nominal, pagination dan empty state.
- Detail biaya, persetujuan/penolakan reimburse, verifikasi F-17 dengan konfirmasi; alasan wajib untuk penolakan.
- Aksi Finance dibatasi pada tahap simulasi yang sesuai. Status pembayaran PJD terpisah dari approval.
- Rekap XLSX dari data demo sesuai periode. Belum menggunakan `recap.py`.
- Tambah pengguna contoh, pencarian audit, notifikasi dan panduan, logout ke login demo.
- Data hanya dalam memori React, reset saat reload. Tidak menyimpan token/password di storage dan tidak mengirimkannya ke server.

## Batas integrasi

Semua state, label tahap, dan ID adalah kontrak demo, bukan validasi state machine produksi. Backend harus menyediakan identitas, permission per record/aksi, total, status, bukti, transisi atomik, audit permanen, session cookie aman, CSRF, dan ekspor resmi. Proteksi UI tidak menggantikan otorisasi backend.

Standar Next.js terbaru dari pengguna diterapkan pada frontend. Bot Flask/SQLite existing tetap menjadi rencana backend sesuai PRD. Tidak membuat Node backend, Prisma, atau PostgreSQL. Dashboard operasional diberi `noindex` dan robots disallow; sitemap publik, canonical produksi, dan structured data bisnis tidak dibuat untuk halaman berisi data Finance.

URL `#overview`, `#reimburse`, `#pjd`, `#reports`, `#users`, `#audit` merupakan navigasi demo. Saat integrasi, buat routes dan API adapter sesuai kontrak yang disepakati. Nilai Core Web Vitals p75 membutuhkan pengukuran pengguna nyata; belum diklaim terpenuhi oleh build lokal.

## Hasil verifikasi

Pada lingkungan pengembangan ini: lint dan TypeScript lulus; 7 unit/component test lulus; 8 skenario E2E desktop/mobile lulus menggunakan Google Chrome lokal. Cakupan E2E meliputi alasan penolakan, keputusan demo, pencarian/empty state, unduh XLSX, pelunasan yang terpisah dari persetujuan, Escape/pemulihan fokus dialog, dan tidak ada overflow horizontal halaman. Screenshot overview dibuat pada direktori `test-results/` yang diabaikan Git.

Build produksi static berhasil. Pengujian browser bukan pengganti audit WCAG menyeluruh atau pengukuran Core Web Vitals di produksi.
