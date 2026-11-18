# DESIGN SYSTEM & FRONTEND UI SPECIFICATION
## Dashboard Web Reimburse & Perjalanan Dinas — PT Indotek Buana Karya

| Metadata | Nilai |
|---|---|
| Versi | 1.1 — Spesifikasi Design System |
| Tanggal | 18 November 2026 |
| Pemilik produk | PT Indotek Buana Karya |
| Target pengguna | Tim Finance (dashboard v1) |
| Dokumen induk | `AGENT.md`; `PRD_Dashboard_Web_Bot_Reimburse_Indotek.md` (v1.1); `PRD_UIUX_Frontend_Dashboard_Indotek_v1.0.md` |
| Status | Design direction **ditetapkan pengguna**; integrasi teknis tertentu **pending approval** |
| Bahasa UI | Bahasa Indonesia |

> **Konvensi status:** `[DISETUJUI]` = instruksi eksplisit pengguna; `[SUMBER]` = aturan pada dokumen induk; `[REKOMENDASI]` = proposal desain yang harus divalidasi; `[PERLU PERSETUJUAN]` = perubahan yang berdampak pada stack/keputusan lama. Dokumen ini spesifikasi desain, bukan bukti implementasi.

## 1. Ringkasan keputusan desain

**[DISETUJUI]**
- **CSS design system:** [Tailwind CSS](https://tailwindcss.com/).
- **Referensi komponen dan accessibility:** [Radix UI](https://www.radix-ui.com/).
- **Ikon:** [Lucide](https://lucide.dev/).
- **Warna utama:** `#0077FF` (Primary Blue).
- **Font:** Plus Jakarta Sans.
- **Karakter:** modern, minimalis, profesional, kredibel, mudah dipindai, cocok untuk operasional keuangan.

**[SUMBER / keputusan produk sebelumnya]** Login menggunakan **email + password**; dashboard v1 hanya untuk **Finance**; Finance dapat melakukan aksi persetujuan sesuai otorisasi existing; pengajuan baru tetap melalui WhatsApp; persetujuan atasan dan Direktur tetap melalui WhatsApp. URL final belum diputuskan (rekomendasi `/dashboard` di domain yang sama).

**Penting — konflik implementasi yang harus diselesaikan:** AGENT.md dan PRD frontend awal mengunci **Flask + Jinja server-rendered, CSS/JS minimal, tanpa frontend framework dan tanpa build step**. Radix Primitives adalah **library komponen React**, sehingga **tidak dapat dipasang langsung ke Jinja sebagai komponen native** tanpa menambahkan React/tooling baru. Tailwind CSS produksi secara umum dikompilasi menjadi CSS statis melalui CLI, artinya ada **build step saat development/CI**, walau **tidak ada runtime Node.js atau React di server**. Pilihan berikut adalah rekomendasi implementasi dan **memerlukan persetujuan perubahan constraint build step**:

1. **Jalur A — DIREKOMENDASIKAN:** pertahankan Flask/Jinja; gunakan Tailwind CLI untuk menghasilkan CSS statis yang di-commit/dipaketkan; pakai pola UX, keyboard, fokus, dan aksesibilitas Radix sebagai **referensi desain**, bukan paket React; gunakan Lucide SVG statis/vanilla JS. **Tidak menambah React dan tidak membutuhkan Node di server produksi.**
2. **Jalur B — ALTERNATIF (belum disetujui):** adopsi React + Radix Primitives sebagai library sungguhan; membutuhkan keputusan arsitektur, tooling bundling, integrasi Flask, keamanan, pengujian, dan perubahan deployment. **Jangan mulai jalur B tanpa persetujuan eksplisit.**
3. **Jika larangan build step tetap absolut:** gunakan CSS manual yang mengikuti tokens dan gaya utility terkurasi; **jangan mengklaim memakai Tailwind CSS runtime penuh**.

## 2. Design principles & UX heuristics

1. **Clarity over decoration:** prioritaskan ID, status, pemilik pengajuan, nominal, bukti, dan next action.
2. **Decision with context:** sebelum `Setujui`/`Tolak`, selalu tampilkan ringkasan dan rincian yang diperlukan.
3. **Safe by default:** tindakan keputusan memakai dialog konfirmasi dan proteksi pengiriman ganda; alasan wajib untuk penolakan.
4. **One source of truth:** nominal final, status, kewenangan, serta keputusan dari backend existing; frontend hanya format tampilan.
5. **Accessible by design:** target WCAG 2.2 AA, navigasi keyboard, kontras, label, dan focus ring.
6. **Efficient finance workflow:** pencarian/filter, pagination, status jelas, notifikasi hasil tindakan, audit historis.
7. **Progressive disclosure:** beranda ringkas → daftar → detail → tindakan.

## 3. Color system

### 3.1 Primary palette (usulan turunan, kecuali warna primary)

| Token | Hex | Peran |
|---|---|---|
| `primary-50` | `#EFF7FF` | Latar lembut info/selection |
| `primary-100` | `#DCEEFF` | Surface biru sangat terang |
| `primary-200` | `#B8DEFF` | Border highlight |
| `primary-300` | `#88C5FF` | Grafik aksen ringan |
| `primary-400` | `#4DA4FF` | Aksen |
| `primary-500` | **`#0077FF`** | **Primary brand — keputusan pengguna** |
| `primary-600` | `#0067DE` | Tombol solid (usulan) |
| `primary-700` | `#0055B8` | Hover/pressed, link kontras (usulan) |
| `primary-800` | `#063D81` | Teks brand kuat |
| `primary-900` | `#0B2A56` | Nuansa gelap |

> **Aksesibilitas:** `#0077FF` + putih tidak otomatis memenuhi kontras WCAG AA untuk teks normal (kontras sekitar 4.13:1). Gunakan `#0055B8` atau warna lebih gelap untuk kombinasi teks kecil di atas putih, atau periksa dan setujui pasangan warna setelah diuji. Tombol solid primary `#0077FF` dengan teks putih **perlu diuji/diubah** untuk target AA teks normal. Teks pada tombol dapat menggunakan `primary-700` + putih. Semua pasangan final diuji dengan contrast checker.

### 3.2 Neutral & semantic palette [REKOMENDASI]

| Token | Hex | Penggunaan |
|---|---|---|
| `canvas` | `#F7F9FC` | Background aplikasi |
| `surface` | `#FFFFFF` | Card, modal, tabel |
| `surface-muted` | `#F1F5F9` | Hover subtle/alternate row |
| `text-strong` | `#17243A` | Heading, nominal |
| `text-body` | `#334155` | Body text |
| `text-muted` | `#64748B` | Secondary text |
| `border` | `#E2E8F0` | Separator dan input |
| `success` | `#167447` | Disetujui/berhasil |
| `success-bg` | `#ECFDF3` | Badge success |
| `warning` | `#925F0D` | Menunggu/perlu review |
| `warning-bg` | `#FFF8E6` | Badge pending |
| `danger` | `#B42318` | Ditolak/destructive |
| `danger-bg` | `#FEF3F2` | Badge rejected |
| `info` | `#0055B8` | Informasi/progress |
| `info-bg` | `#EFF7FF` | Badge info |

**Aturan status:** badge harus memuat **teks + warna**, tidak mengandalkan warna saja. Kategori tampilan dipetakan dari status internal existing, **jangan menciptakan status database baru**. Status `LUNAS` tidak setara dengan status persetujuan F-17. Gunakan semantic colors konsisten di tabel, detail, timeline, dan toast.

## 4. Typography — Plus Jakarta Sans

**[DISETUJUI]** Font utama: `Plus Jakarta Sans`; fallback `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

| Gaya | Ukuran / line-height | Weight | Pemakaian |
|---|---|---|---|
| Display | 30 / 38 px | 700 | Judul dashboard terpilih |
| H1 | 24 / 32 px | 700 | Judul halaman |
| H2 | 20 / 28 px | 600 | Judul section |
| H3 | 16 / 24 px | 600 | Judul card / modal |
| Body | 14 / 22 px | 400 | Tabel, deskripsi, form |
| Body strong | 14 / 22 px | 600 | Label penting |
| Small | 12 / 18 px | 400–600 | Caption dan helper |
| KPI amount | 28 / 36 px | 700 | Nilai metrik |

- Angka nominal/tabular: `font-variant-numeric: tabular-nums;`.
- Gunakan `Rp 1.250.000` dengan formatting Indonesia; nominal diterima dari backend.
- Pertahankan ukuran text nyaman, hindari penggunaan 12px untuk isi tabel inti jika tidak diperlukan.
- File font harus bersumber dari lisensi/distribusi yang sah; untuk keamanan dan performa, **self-host** aset webfont dengan `font-display: swap`. Font tidak disertakan dalam dokumen ini.

## 5. Layout, spacing, responsive

- Spacing scale: `4, 8, 12, 16, 20, 24, 32, 40, 48 px` (basis 4px).
- Radius: `sm 6px`, `md 10px`, `lg 14px`, `xl 18px`, `full 9999px`.
- Shadow: low elevation untuk card; jangan memisahkan seluruh layout dengan bayangan berlebihan.
- Border input/card: 1px; focus ring 2–3px plus offset bila sesuai.
- Touch target: rekomendasi minimal **44 × 44 px** untuk kontrol sentuh penting; hit area tombol/ikon tidak mengandalkan glyph saja.

| Breakpoint desain | App shell | Data table | Detail |
|---|---|---|---|
| Mobile `<768px` | Header + sidebar drawer | Kartu ringkas atau horizontal scroll terkontrol | 1 kolom |
| Tablet `768–1199px` | Sidebar collapse/drawer | Scroll horizontal terukur | 1–2 kolom |
| Desktop `>=1200px` | Sidebar `240px`, topbar, konten | Tabel lengkap + filter | Konten + panel konteks |

- Lebar konten rekomendasi maksimum 1440px, padding desktop 24px.
- Dukung zoom browser 200% tanpa kehilangan akses tindakan penting.
- Pada mobile, jangan sembunyikan status/ID/nominal ketika mengganti tabel menjadi kartu.

## 6. Design tokens (Tailwind CSS v4, proposal implementasi Jalur A)

Contoh `assets/styles/dashboard.css` sebagai **input build**, setelah Jalur A disetujui:

```css
@import "tailwindcss";
@source "../../templates/dashboard/**/*.html";

@font-face {
  font-family: "Plus Jakarta Sans";
  src: url("../../static/fonts/plus-jakarta-sans.woff2") format("woff2");
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
}

@theme {
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
  --color-primary-50: #eff7ff;
  --color-primary-100: #dceeff;
  --color-primary-200: #b8deff;
  --color-primary-300: #88c5ff;
  --color-primary-400: #4da4ff;
  --color-primary-500: #0077ff;
  --color-primary-600: #0067de;
  --color-primary-700: #0055b8;
  --color-primary-800: #063d81;
  --color-primary-900: #0b2a56;
  --color-canvas: #f7f9fc;
  --color-surface: #ffffff;
  --color-text-strong: #17243a;
  --color-text-body: #334155;
  --color-text-muted: #64748b;
  --color-divider: #e2e8f0;
  --color-success: #167447;
  --color-warning: #925f0d;
  --color-danger: #b42318;
}

:root { color-scheme: light; }
body { font-family: var(--font-sans); }
.tabular-numeric { font-variant-numeric: tabular-nums; }
```

**Catatan integrasi:** path `@source` dan path relatif font **harus diverifikasi terhadap struktur folder aktual** sebelum build. `@font-face` di atas adalah contoh: nama file webfont bergantung pada aset sah yang didapatkan. Jangan menggunakan class Tailwind yang dibentuk dinamis seperti `bg-{{ status }}` karena scanner kelas mungkin tidak menemukannya; gunakan mapping literal status→class di Jinja/komponen. CSS output ditempatkan pada `static/css/dashboard.css`.

### 6.1 Build lokal (hanya setelah persetujuan)

```bash
npm install --save-dev tailwindcss @tailwindcss/cli
npx @tailwindcss/cli -i ./assets/styles/dashboard.css -o ./static/css/dashboard.css --minify
```

- Output CSS statis disajikan melalui `url_for('static', filename='css/dashboard.css')` pada Jinja.
- Lock versi dependency dan catat prosedur build; **Node/npm tidak diperlukan saat request runtime Flask**, tetapi mungkin diperlukan di CI/development.
- Jangan menggunakan Tailwind Play CDN untuk deployment produksi.
- Jika project tidak mengizinkan build sama sekali, proses ini **tidak dilakukan** sampai ada keputusan baru.

## 7. Radix UI: compatibility & interaction contract

**[DISETUJUI]** Radix UI sebagai referensi design system; **[PERLU PERSETUJUAN]** penggunaan `@radix-ui/react-*` runtime karena memerlukan React. Untuk jalur Jinja, bangun komponen semantik aksesibel yang *mengikuti pola perilaku* Radix, bukan mengklaim memakai primitive React.

| Komponen UX | Acuan Radix | Implementasi Jinja-first |
|---|---|---|
| Konfirmasi setuju/tolak | Alert Dialog | Dialog HTML/JS minimal, focus trap, Esc sesuai kebijakan, pengembalian fokus |
| Dropdown aksi | Dropdown Menu | Tombol + menu keyboard dan state terbuka/tertutup |
| Filter/select | Select | `<select>` native bila memadai |
| Tooltip | Tooltip | Teks accessible; jangan sembunyikan info kritis di tooltip |
| Tabs detail F-16/F-17 | Tabs | Tablist keyboard atau navigasi biasa yang eksplisit |
| Form fields | Label, Checkbox | `<label for>`, `name`, hint, error, autocomplete |
| Modal overlay | Dialog | Judul/deskripsi diumumkan, background inert, fokus terkelola |

**Persyaratan wajib dialog keputusan:** nama tindakan + ID pengajuan + ringkasan nominal; alasan wajib saat penolakan; submit POST + CSRF; tombol disabled/loading selama submit; hasil aksi dari server; pulihkan fokus setelah batal; tangani stale state (409) dan kegagalan (4xx/5xx). Untuk dialog destructive, atur kebijakan menutup dengan Escape/backdrop secara sadar agar tidak ada keputusan tanpa konfirmasi.

## 8. Lucide icon guidelines

**[DISETUJUI]** gunakan Lucide (SVG). Default ukuran `18–20px` untuk navigasi/tombol, `16px` untuk inline, `24px` untuk empty state; stroke `1.75–2px`, `currentColor` agar mengikuti token.

| Area | Icon rekomendasi (nama Lucide) |
|---|---|
| Dashboard | `layout-dashboard` |
| Reimburse | `receipt` |
| Perjalanan Dinas | `briefcase-business` |
| Rekap | `file-spreadsheet` |
| Pengguna | `users` |
| Audit | `history` |
| Filter | `filter` |
| Pencarian | `search` |
| Unduh | `download` |
| Setujui | `check-circle-2` |
| Tolak | `x-circle` |
| Logout | `log-out` |
| Kalender | `calendar-days` |
| Informasi | `info` |
| Warning | `alert-triangle` |

- **Implementasi Jinja:** idealnya SVG statis yang sudah dipilih/sanitasi sebagai template partial, atau integrasi **Lucide vanilla JavaScript** bila diperlukan; hindari memasukkan seluruh icon library lewat font besar.
- Ikon dekoratif `aria-hidden="true"`; tombol icon-only perlu `aria-label`/teks yang dapat diakses.
- Jangan pakai ikon saja untuk status atau aksi berisiko.

## 9. Reusable UI components — spesifikasi

| Komponen | Variants/state | Kriteria dasar |
|---|---|---|
| `Button` | primary, secondary, outline, ghost, danger; default/loading/disabled | Ukuran konsisten, fokus, label aksi spesifik; satu primary CTA per area |
| `Input` | default, focus, invalid, disabled | Label eksplisit, helper/error terkait, autocomplete sesuai |
| `PasswordInput` | show/hide, invalid | Toggle dapat diakses; tidak menampilkan password di log |
| `Select` | idle, selected, invalid | Native-first; keyboard |
| `Textarea` | default, invalid | Wajib alasan untuk tolak; counter opsional |
| `Badge` | pending, success, rejected, info, neutral | Label status tekstual + warna semantik |
| `KpiCard` | loading, populated, empty | Angka dari backend, format Rupiah/kuantitas |
| `DataTable` | loading, empty, error, populated | Header semantik, sorting hanya bila tersedia, pagination |
| `FilterBar` | idle, applied, no results | Filter status/bulan/pengguna; reset; query persist |
| `DetailCard` | normal, missing evidence | Data terstruktur dan provenance jelas |
| `AuditTimeline` | populated, empty | Urut waktu, aktor, kanal, keputusan, alasan bila ada |
| `ApprovalTimeline` | pending, approved, rejected | Rantai peran sesuai PJD existing |
| `AlertDialog` | confirm approve/reject, loading, conflict | CSRF, akses keyboard, alasan wajib saat reject |
| `Toast/Alert` | success, error, warning | Tidak mengeklaim sukses sampai backend mengonfirmasi |
| `Pagination` | prev/next, disabled | Query filter bertahan |
| `EmptyState` | no data, no search results | Copy informatif, CTA bila ada |
| `Skeleton` | loading | Jangan tampilkan nilai nominal palsu |
| `EvidenceLink` | available, unavailable, forbidden | Link aman; jangan mengekspose file lokal/kredensial |
| `AppShell` | sidebar expanded/collapsed | Navigasi konsisten, mobile drawer accessible |

### 9.1 Button variants [REKOMENDASI]

- **Primary:** isi `primary-700`, label putih, hover lebih gelap; gunakan untuk tindakan utama.
- **Secondary:** surface putih, border netral, teks kuat.
- **Ghost:** tanpa border untuk toolbar dengan label yang jelas.
- **Danger:** `danger` untuk aksi penolakan, selalu dengan konfirmasi.
- **Disabled:** state visual + atribut HTML `disabled`, tetap jelaskan alasan bila perlu.

### 9.2 Form & table conventions

- Field email: `type=email`, `autocomplete=username`; password: `type=password`, `autocomplete=current-password`.
- Pesan login generik: **"Email atau kata sandi tidak sesuai."**; hindari mengonfirmasi keberadaan akun.
- Pada tabel, baris tidak boleh sekadar clickable tanpa navigasi keyboard; beri link `Lihat detail`.
- Kolom penting: ID, waktu, pengaju, nominal, status, tahap, aksi. Seluruhnya mengikuti ketersediaan data existing.
- Aksi persetujuan **tidak muncul** bila bukan kewenangan Finance, status tidak eligible, atau user belum terautentikasi; backend tetap wajib memverifikasi semuanya.

## 10. UI information architecture (Finance only)

```text
/dashboard                       # alamat path direkomendasikan, host pending
├── /login                       # Email + password
├── /                            # Ringkasan / Finance action queue
├── /reimburse                   # Daftar + filter
│   └── /<id>                    # Detail + approve/reject Finance
├── /pjd                         # Daftar F-16 & F-17
│   └── /<id>                    # Detail, langkah yang berwenang saja
├── /rekap                       # Rekap bulanan + ekspor XLSX
├── /pengguna                    # Daftar / pendaftaran sesuai kewenangan
└── /audit                       # Audit log sesuai kebijakan akses
```

**Catatan:** ini navigasi konseptual, bukan kepastian rute Flask atau nama URL endpoint aktual. Finalisasi setelah membaca `app.py`, `store.py`, dan kontrak data existing.

## 11. Screen-specific UI requirements

### UI-01 — Login
- Desktop: form terpusat dengan identitas Indotek, heading, email, password, show/hide password, tombol `Masuk`.
- Mobile: full-width card, padding nyaman, tidak ada informasi transaksi sebelum login.
- State: kosong, invalid, loading, akun tidak berwenang, sesi habis; error generik tanpa bocor status akun.
- AC: email/password disubmit aman melalui HTTPS; sesi dan rate limiting ditangani backend; login non-Finance ditolak.

### UI-02 — Ringkasan Finance
- KPI: jumlah reimburse per status, PJD yang memerlukan tindakan Finance, total nominal bulan berjalan (hanya metrik yang mampu dihitung backend).
- Action queue: item prioritas yang perlu diputuskan Finance; link ke detail, bukan persetujuan buta.
- State: empty, loading, partial integration failure; label periode jelas.
- AC: setiap angka dapat ditelusuri ke sumber query/backend dan tidak dijumlah ulang pada browser.

### UI-03 — Daftar Reimburse
- Filter: bulan, status, pengaju; tabel ID/tanggal/pengaju/nominal/status/aksi.
- Sorting/search hanya diaktifkan jika backend mendukung.
- State: hasil kosong, error filter, pagination, persetujuan berubah di tab lain.
- AC: filter persist via query string, setiap detail dapat dibuka keyboard.

### UI-04 — Detail Reimburse + Approval
- Header: ID, pengaju, status, total dari sistem.
- Section: struk/bukti, rincian OCR/item, audit timeline.
- CTA Finance hanya bila status eligible: `Setujui` dan `Tolak`; penolakan mewajibkan alasan.
- AC: modal menampilkan konsekuensi, form CSRF, aksi memanggil fungsi keputusan bersama, success UI hanya dari respon server, 409 conflict tertangani.

### UI-05 — Daftar PJD
- Daftar F-16/F-17 dengan tahap keputusan, anggaran, realisasi, status pembayaran yang relevan.
- Status approval dan `LUNAS` dipisahkan sebagai dua dimensi, bukan satu label gabungan.
- AC: filter dan detail tidak menampilkan aksi atasan/Direktur bagi Finance.

### UI-06 — Detail F-16
- Ringkasan pengaju/tujuan/waktu bila tersedia; pos anggaran, total, riwayat, PDF resmi.
- Timeline `Mengetahui` (atasan) → `Setujui PJD` (Direktur) secara **read-only** untuk Finance.
- AC: jangan menduplikasi pembuatan PDF dan transisi state.

### UI-07 — Detail F-17, kasbon, pelunasan
- Tampilan pos realisasi, bukti, kasbon bertahap, pelunasan, dan selisih Kurang/Lebih dari backend.
- Finance dapat menjalankan `VERIFIKASILAPORAN` serta pencatatan `KASBON`/`PELUNASAN` pada keadaan yang diizinkan business logic.
- AC: validasi data wajib; status LUNAS tetap terpisah dari persetujuan laporan.

### UI-08 — Rekap bulanan
- Pilihan periode, ringkasan, tombol `Unduh XLSX`.
- AC: file berasal dari `recap.py` existing; tidak menghitung ulang laporan di browser.

### UI-09 — Pengguna
- Daftar pengguna dari master `users`; pendaftaran menggunakan jalur sistem yang disetujui.
- AC: tidak ada public signup; role/name tidak ditulis sebagai teks bebas tak tervalidasi.

### UI-10 — Audit
- Riwayat aktor, waktu, objek, aksi, hasil, kanal WhatsApp/web; filter hanya bila didukung query.
- AC: rekam aksi web di backend; UI tidak dapat mengubah audit log.

### UI-11 — Error & special states
- `401`/session expired → login (tanpa bocor data), `403` akses ditolak, `404` data tidak ditemukan, `409` data berubah, `422` validasi gagal, `500` masalah sistem.
- Copy Bahasa Indonesia, tidak memuat stack trace/token/path; tombol kembali atau coba lagi bila aman.

## 12. Core Finance interaction flows

### 12.1 Login
`Buka /dashboard → Login → Validasi backend → Cek role Finance → Beranda / Pesan gagal`.

### 12.2 Setujui reimburse
`Daftar → Detail → Tinjau bukti & nominal → Setujui → Konfirmasi ID & nominal → POST + CSRF → Shared backend business rule → Audit + PDF sesuai urutan existing → Status baru + notifikasi`.

### 12.3 Tolak reimburse
`Daftar → Detail → Tolak → Isi alasan wajib → Konfirmasi → POST + CSRF → Validasi otorisasi/status → Audit → Tampilkan alasan & status dari backend`.

### 12.4 Verifikasi F-17
`Daftar PJD → Detail F-17 → Tinjau realisasi/selisih/bukti → Verifikasi laporan (bila eligible) → Konfirmasi → Backend → Tampilkan tahap berikutnya`.

## 13. Frontend architecture (Jinja-first, pending Tailwind build approval)

```text
assets/
  styles/
    dashboard.css                 # Input Tailwind CLI; hanya jika build disetujui
static/
  css/
    dashboard.css                 # CSS terkompilasi untuk Flask
  js/
    dashboard.js                  # JS minimal: dialog, sidebar, progressive enhancement
  fonts/
    plus-jakarta-sans.woff2       # Contoh nama aset; harus diadakan legal
  icons/
    ...                           # SVG Lucide terpilih; bila dipakai statis
templates/
  dashboard/
    base.html
    login.html
    home.html
    reimburse/
      list.html
      detail.html
    pjd/
      list.html
      detail_f16.html
      detail_f17.html
    recap/
      index.html
    users/
      list.html
      new.html
    audit/
      index.html
    partials/
      _sidebar.html
      _topbar.html
      _button.html
      _status_badge.html
      _table.html
      _dialog_confirm.html
      _pagination.html
      _audit_timeline.html
      _form_field.html
```

- Gunakan Jinja template inheritance/macro/partial untuk reusable building blocks.
- Semua aksi mutasi menggunakan POST dengan CSRF, autentikasi, otorisasi, validasi server, dan audit.
- Tidak menambah SQL mutasi di template/dashboard; `store.py` adalah lapisan akses SQLite.
- Tidak ada state transaksi kritis yang hanya ada di JS; validasi server final.
- Jangan menambahkan dependensi React/SPA tanpa persetujuan dan revisi PRD/AGENT.

## 14. Accessibility checklist (QA)

- [ ] Kontras teks normal >= 4.5:1; teks besar >= 3:1; komponen/focus yang relevan >= 3:1.
- [ ] Focus indicator terlihat pada seluruh kontrol interaktif.
- [ ] Seluruh flow dapat dipakai dengan keyboard; dialog memulihkan fokus ke pemicu.
- [ ] Input punya label dan pesan error yang dapat diakses; `aria-describedby` dihubungkan dengan benar.
- [ ] Ikon-only button mempunyai accessible name.
- [ ] Tidak ada status/keputusan disampaikan hanya lewat warna.
- [ ] Table mempunyai header yang benar; mobile tetap menyajikan ID/status/nominal.
- [ ] Error validasi dan hasil aksi diumumkan secara aksesibel.
- [ ] Zoom/responsive/reflow dan ukuran target diuji pada browser/perangkat sasaran.
- [ ] `prefers-reduced-motion` dihormati.

## 15. Security & error UX checklist

- [ ] Login hanya untuk Finance (pengguna yang sama terikat ke master user existing).
- [ ] Tidak ada halaman dashboard sensitif yang dapat diakses tanpa sesi.
- [ ] Tidak menyimpan password/token pada localStorage, source JS, atau HTML.
- [ ] Session cookie HttpOnly, Secure via HTTPS, SameSite sesuai kebijakan server.
- [ ] Form mutasi dilindungi CSRF dan mencegah double-submit.
- [ ] Approved/rejected state diverifikasi ulang server; konflik ditampilkan jelas.
- [ ] Penolakan selalu memerlukan alasan dan identitas pengambil keputusan.
- [ ] File bukti/Drive hanya ditampilkan sesuai hak akses.
- [ ] Error tidak mengandung kredensial, SQL, path server, maupun stack trace.
- [ ] Audit action menggunakan penanda kanal `web` yang dibuat backend.

## 16. Design deliverables & acceptance criteria

| Deliverable | Output | Exit criteria |
|---|---|---|
| Visual foundations | Tokens warna, font, spacing, elevation | Primary `#0077FF`, Jakarta Sans, skala semantik konsisten |
| Components | UI kit & states | Setiap komponen punya default/hover/focus/disabled/error bila relevan |
| Sitemap & flows | Navigation map, finance approval flows | Tidak ada kewenangan atasan/Direktur di dashboard Finance |
| Wireframes | Login, home, reimburse, F-16/F-17, rekap, pengguna, audit | Diuji bersama Finance terhadap tugas inti |
| High-fidelity mockups | Desktop + mobile dan state penting | Konsisten dengan tokens dan WCAG AA target |
| Frontend handoff | Jinja partials, token mapping, CSS output, state contract | Tidak memodifikasi business logic lewat UI |
| QA evidence | Screenshot/test keyboard/responsive/CSRF/regresi | Test ditambah ke suite pytest; klaim keberhasilan berdasarkan hasil uji |

### Acceptance criteria khusus design system

- **DS-01:** semua halaman v1 menggunakan Plus Jakarta Sans atau fallback yang disepakati.
- **DS-02:** warna primary yang didokumentasikan adalah `#0077FF`, tetapi pasangan teks/latar memenuhi target kontras.
- **DS-03:** navigasi dan aksi menggunakan ikon Lucide secara konsisten.
- **DS-04:** pola dialog, dropdown, tab, dan forms mengikuti kontrak aksesibilitas Radix; klaim penggunaan komponen React hanya jika benar-benar terpasang.
- **DS-05:** Tailwind CSS output dipakai di Flask **hanya bila build step disetujui**; tidak ada dependency runtime frontend baru secara diam-diam.
- **DS-06:** desktop, tablet, dan mobile menampilkan ID, nominal, status, serta akses detail yang konsisten.
- **DS-07:** dialog keputusan memberikan konteks dan alasan wajib untuk penolakan; backend otoritatif.
- **DS-08:** komponen utama reusable, tidak mengulang CSS/markup tanpa alasan.
- **DS-09:** setiap error, empty, loading, dan conflict state memiliki desain tertulis.
- **DS-10:** tidak ada logo/aset brand yang direka sebagai aset resmi tanpa materi dari pemilik merek.

## 17. Implementation phases & handoff

| Fase | Fokus | Outcome |
|---|---|---|
| 0 | Persetujuan perubahan stack/build dan keputusan URL | Gate implementasi terlewati |
| 1 | Audit source existing, mapping status dan kewenangan | Kontrak data dan action matrix |
| 2 | Foundation: tokens, typography, icons, app shell | Design system base |
| 3 | Login dan dashboard ringkasan | UX flow end-to-end awal |
| 4 | Reimburse list/detail + keputusan | Flow Finance utama teruji |
| 5 | PJD F-16/F-17, kasbon, pelunasan | Flow finansial PJD teruji |
| 6 | Rekap, pengguna, audit | Fitur pendukung lengkap |
| 7 | Responsive, accessibility, security, regression, UAT | Release candidate |

## 18. Decision log & open questions

| ID | Topik | Keputusan/status |
|---|---|---|
| DS-DEC-01 | Primary | `#0077FF` — **DISETUJUI** |
| DS-DEC-02 | Typeface | Plus Jakarta Sans — **DISETUJUI** |
| DS-DEC-03 | Styling | Tailwind CSS — **DISETUJUI SEBAGAI PILIHAN DESAIN**; build tool memerlukan approval |
| DS-DEC-04 | Component reference | Radix UI — **DISETUJUI SEBAGAI ACUAN**; penggunaan React belum disetujui |
| DS-DEC-05 | Icons | Lucide — **DISETUJUI** |
| DS-DEC-06 | Implementasi frontend | Rekomendasi Flask/Jinja + compiled CSS + JS ringan — **PERLU PERSETUJUAN BUILD STEP** |
| DS-DEC-07 | Dashboard hostname/path | `/dashboard` pada domain webhook — **PENDING APPROVAL** |
| DS-DEC-08 | Official brand assets | Logo Indotek dan guidelines lain — **BELUM TERSEDIA/TERVERIFIKASI** |
| DS-DEC-09 | User provisioning/reset password | Spesifikasi detail — **PENDING** |
| DS-DEC-10 | Role/action mapping | Verifikasi terhadap `store.py`/`app.py` — **VALIDASI KODE** |

**Pertanyaan keputusan sebelum development:** Apakah pengguna menyetujui **Tailwind CLI pada development/CI untuk menghasilkan CSS statis**, sambil mempertahankan Flask/Jinja tanpa React di server? Jika tidak, pilih penyesuaian pendekatan styling tanpa melanggar larangan build.

## 19. Referensi

### Dokumen internal
- `AGENT.md` — arsitektur, hard rules, workflow, keamanan.
- `PRD_Dashboard_Web_Bot_Reimburse_Indotek.md` — requirement bisnis & keputusan stakeholder v1.1.
- `PRD_UIUX_Frontend_Dashboard_Indotek_v1.0.md` — kebutuhan UI, flow, komponen awal, dan acceptance criteria.

### Dokumentasi resmi vendor
- Tailwind CSS CLI: https://tailwindcss.com/docs/installation/tailwind-cli
- Tailwind CSS v4 upgrade: https://tailwindcss.com/docs/upgrade-guide
- Radix Primitives: https://www.radix-ui.com/primitives/docs/overview/introduction
- Radix Colors: https://www.radix-ui.com/colors
- Lucide: https://lucide.dev/guide/
- Lucide Vanilla JavaScript: https://lucide.dev/guide/lucide
- Plus Jakarta Sans: https://fonts.google.com/specimen/Plus+Jakarta+Sans

---

**Status akhir:** Spesifikasi visual siap menjadi acuan desain; rute implementasi Tailwind/Radix harus menyelesaikan konflik terhadap batasan `AGENT.md` sebelum coding. Tidak ada perubahan codebase yang dilakukan oleh dokumen ini.
