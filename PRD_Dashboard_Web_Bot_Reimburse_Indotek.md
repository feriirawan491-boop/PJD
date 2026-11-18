# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Dashboard Web — Bot Reimburse & Perjalanan Dinas PT Indotek Buana Karya

| Metadata | Keterangan |
|---|---|
| Versi | 1.1 — Pembaruan keputusan stakeholder |
| Tanggal | 18 November 2026 |
| Pemilik produk | PT Indotek Buana Karya (penanggung jawab belum ditetapkan) |
| Disusun sebagai | Senior Project Manager & Business Analyst |
| Sumber utama | `AGENT.md — Dashboard Web Bot Reimburse Indotek` |
| Status | **DRAFT — 3 keputusan disetujui, alamat dashboard menunggu konfirmasi** |

> **Konvensi:** **[SUMBER]** = ketentuan eksplisit AGENT.md; **[USULAN]** = elaborasi PRD yang perlu validasi; **[PENDING]** = keputusan yang tidak boleh diasumsikan. Dokumen ini merinci kebutuhan, **bukan** laporan bahwa dashboard telah dibuat atau diuji. Dokumentasi kode dan PHASE2–PHASE6, PJD-F16, PJD-F17, DRIVE-OAUTH belum diperiksa dalam penyusunan PRD ini.

---

## 1. Ringkasan Eksekutif

**[SUMBER]** Sistem bot WhatsApp untuk reimburse dan perjalanan dinas telah tersedia dan dilaporkan lulus **102/102** pengujian lokal. Dashboard web akan menjadi antarmuka **tambahan** untuk memantau, memutuskan, dan merekap data yang sama. Pengajuan baru tetap dilakukan melalui WhatsApp. Dashboard tidak boleh membangun ulang alur existing, mengubah stack tanpa persetujuan, atau menggunakan Google Sheets sebagai sumber kebenaran.

**Masalah bisnis:** Pengguna berwenang harus menggunakan perintah WhatsApp untuk memantau dan mengambil keputusan; antarmuka daftar, filter, detail, audit, dan rekap terpusat belum tersedia di web. **[USULAN]** Rumusan masalah ini diturunkan dari tujuan fitur dan perlu dikonfirmasi kepada Finance, Direktur, dan atasan.

**Solusi:** Modul Flask Blueprint `/dashboard` dengan halaman server-rendered Jinja dan kontrol akses berdasarkan data master `users`; seluruh operasi melalui `store.py` dan business logic yang sama dengan bot WhatsApp.

## 2. Tujuan, Outcome, dan Ukuran Keberhasilan

### 2.1 Tujuan produk
1. **[KEPUTUSAN USER]** Memudahkan tim Finance memantau pengajuan melalui web; Direktur dan atasan tetap menggunakan WhatsApp pada v1.
2. **[KEPUTUSAN USER]** Memungkinkan keputusan melalui dashboard oleh Finance sesuai otorisasi Finance pada alur existing; persetujuan atasan/Direktur tetap melalui WhatsApp.
3. **[SUMBER]** Menampilkan laporan dan audit dari SQLite sebagai sumber data tunggal.
4. **[USULAN]** Mengurangi pekerjaan manual dalam mencari pengajuan dan menyusun rekap tanpa mengubah alur pengajuan.

### 2.2 Indikator keberhasilan (target belum ditetapkan)
| Indikator | Definisi operasional | Target/status |
|---|---|---|
| Konsistensi status | Status pada dashboard sama dengan hasil query `store.py` untuk ID yang sama | **[USULAN] 100%** pada skenario uji |
| Kepatuhan akses | Pengguna tidak berwenang tidak dapat melihat/memutuskan data | **[USULAN] 100%** kasus negatif tertolak |
| Jejak audit | Setiap aksi mutasi web menghasilkan audit beridentitas dan kanal | **[SUMBER] Wajib** |
| Regresi existing | Seluruh test existing tetap lulus setelah perubahan | **[SUMBER] Wajib** |
| Kecepatan penyelesaian keputusan | Waktu dari membuka detail hingga aksi berhasil | **[PENDING]** baseline dan target |
| Kinerja halaman | Latensi daftar/detail pada volume data nyata | **[PENDING]** target dan ukuran dataset |

## 3. Stakeholder dan Persona

| Peran | Kebutuhan utama | Hak dasar |
|---|---|---|
| Finance | Review reimburse, kasbon/pelunasan, rekap, pendaftaran pengguna | Keputusan reimburse, pencatatan kasbon/pelunasan, verifikasi F-17, administrasi pengguna sesuai aturan existing |
| Atasan | Memeriksa permohonan PJD dan laporan realisasi | Tahap `KETAHUI` / `KETAHUILAPORAN` sesuai relasi atasan existing |
| Direktur | Persetujuan PJD dan laporan | `SETUJUIPJD` / `SETUJUILAPORAN` sesuai aturan existing |
| Staf | Mengajukan dan memeriksa miliknya | Pengajuan via WhatsApp; akses dashboard **Tidak diizinkan** pada v1 |
| Administrator teknis | Operasi, pengujian, backup dan deployment | **[USULAN]** Tidak otomatis mendapat hak keputusan bisnis |

> **[PENDING]** Data master `users` dalam sumber menyebut role `staff/finance/direktur`, sementara alur bisnis memiliki **atasan**. Representasi atasan, relasi pelapor, dan mapping izin harus diverifikasi di source code sebelum desain RBAC difinalkan. Jangan menciptakan role baru secara sepihak.

## 4. Ruang Lingkup

### 4.1 In scope v1 — kebutuhan dengan keputusan stakeholder
- Login dengan **email dan password** hanya untuk pengguna tim Finance yang terdaftar; tidak ada registrasi publik.
- Beranda: jumlah pengajuan Menunggu/Disetujui/Ditolak, antrean PJD per tahap, total nominal bulan berjalan.
- Reimburse: daftar, filter status/bulan/pengguna, detail struk/item/total/audit, keputusan Finance.
- PJD F-16 dan F-17: daftar/detail, rantai persetujuan, anggaran vs realisasi, kasbon/pelunasan, selisih Kurang/Lebih; aksi web hanya untuk kewenangan Finance. Tahapan atasan/Direktur tetap melalui WhatsApp.
- Rekap bulanan dengan reuse `recap.py` dan unduh XLSX.
- Daftar pengguna dan pendaftaran pengguna oleh Finance dengan padanan `DAFTARKAN`.
- Audit log per pengajuan/PJD.

### 4.2 Out of scope v1 — batas tegas
- Pengajuan reimburse/PJD baru dari web; penggantian bot WhatsApp.
- Aplikasi mobile native; multi-perusahaan.
- Edit pengajuan yang sudah diputuskan; hapus data.
- Frontend framework atau build step baru.
- Migrasi database atau perubahan teknologi utama tanpa persetujuan.

### 4.3 Dependensi
- `app.py`, `store.py`, `config.py`, `wa.py`, `ocr_receipt.py`, `pdf_bill.py`, `pdf_pjd.py`, `recap.py`, `sheets_sync.py`, `drive_sync.py`.
- `PHASE2.md`–`PHASE6.md`, `PJD-F16.md`, `PJD-F17.md`, `DRIVE-OAUTH.md` perlu dibaca sebelum perubahan modul terkait.
- Oracle Cloud Always Free, nginx/HTTPS, konfigurasi Meta dan Google yang sudah ada.

## 5. Business Process: As-Is dan To-Be

### 5.1 As-Is — bot WhatsApp [SUMBER]

**Reimburse:** Staf mengirim foto struk → Tesseract OCR → konfirmasi/koreksi/BATAL → Finance `SETUJU` atau `TOLAK` dengan ID (penolakan wajib alasan) → bill PDF → arsip Drive dan sinkron Sheets.

**PJD F-16:** Pengajuan anggaran sebelum perjalanan → atasan `KETAHUI` → Direktur `SETUJUIPJD`; PDF HR-IBK-F-16 wajib dibuat sebelum status berubah.

**PJD F-17:** Finance mencatat `KASBON` bertahap / `PELUNASAN`; realisasi dari struk terkait atau bukti non-struk/nominal asumsi (wajib jenis bukti dan catatan) → Finance `VERIFIKASILAPORAN` → atasan `KETAHUILAPORAN` → Direktur `SETUJUILAPORAN`. Selisih Kurang/Lebih dihitung sistem; `LUNAS` terpisah dari status persetujuan.

### 5.2 To-Be — dashboard [SUMBER + USULAN rincian UI]
1. Finance mengakses dashboard melalui HTTPS menggunakan email dan password. Path `/dashboard` pada domain webhook adalah rekomendasi sementara, belum disetujui.
2. Sistem mengidentifikasi baris `users` dan izin tahap sesuai identitas existing.
3. Pengguna melihat ringkasan, memfilter daftar, membuka detail dan audit.
4. Finance dapat melakukan aksi keputusan sesuai kewenangan Finance pada tahap valid; tindakan yang secara bisnis menjadi kewenangan atasan/Direktur tidak tersedia di web v1.
5. Server memvalidasi identitas, CSRF, ID, tahap, alasan/bukti bila wajib, dan memanggil fungsi keputusan bersama.
6. Sistem menyimpan perubahan atomik melalui `store.py`, menulis audit dengan kanal `web`, serta menjalankan pembuatan PDF/sinkronisasi mengikuti aturan existing.
7. UI menampilkan hasil terbaru dari SQLite; kegagalan sinkron eksternal tidak boleh membuat status UI diklaim telah tersinkron bila belum.

> Urutan transaksi persis, mekanisme retry, dan konsekuensi gagal PDF/Google harus mengikuti kode existing setelah ditinjau; langkah di atas bukan spesifikasi perubahan state machine baru.

## 6. Functional Requirements

Prioritas: **P0** = prasyarat keamanan/integritas; **P1** = kebutuhan inti v1; **P2** = peningkatan opsional. ID stabil untuk tracking.

### 6.1 Autentikasi & Otorisasi

| ID | Prioritas | Kebutuhan | Acceptance criteria |
|---|---|---|---|
| FR-AUTH-01 | P0 | Seluruh halaman data dan endpoint aksi memerlukan sesi login | Akses tanpa sesi ditolak/diarahkan login; tidak membocorkan data |
| FR-AUTH-02 | P0 | Identitas dashboard merujuk record `users` existing | Pengguna tidak terdaftar tidak dapat masuk; nama/jabatan/role dari master |
| FR-AUTH-03 | P0 | Izin divalidasi di server pada setiap request | Manipulasi URL/form tidak melewati otorisasi |
| FR-AUTH-04 | P0 | Semua form mutasi menggunakan token CSRF | Request tanpa token/invalid ditolak tanpa perubahan data |
| FR-AUTH-05 | P0 | Session cookie HttpOnly, SameSite=Lax, Secure di HTTPS | Konfigurasi cookie terverifikasi dalam test/konfigurasi |
| FR-AUTH-06 | P1 | Logout mengakhiri sesi | Sesi lama tidak dapat mengakses halaman terlindungi |
| FR-AUTH-07 | P0 | Login menggunakan email + password untuk akun Finance terdaftar | Email harus terhubung ke record `users` yang sah; passwordiverifikasi dengan hash kuat, tidak tersimpan plaintext; login gagal tidak membuka sesi |
| FR-AUTH-08 | P0 | Hanya tim Finance boleh login dashboard v1 | Akun staf, atasan, atau Direktur tidak dapat mengakses dashboard walau punya akun WhatsApp |

**[KEPUTUSAN USER + USULAN TEKNIS]** Email/password dipilih menggantikan usulan OTP di AGENT.md. Email belum tercantum dalam data master existing (`users`: nomor WA, nama, jabatan, role); perlu perluasan skema/relasi identitas secara terkendali setelah review `store.py`. Password harus menggunakan password hashing modern (misalnya Argon2id/scrypt), pembatasan percobaan login, pengamanan sesi, dan proses reset yang dikendalikan Finance/admin berwenang. Mekanisme provisioning, reset, dan parameter keamanan masih perlu spesifikasi teknis sebelum coding.

### 6.2 Beranda

| ID | Prioritas | Kebutuhan | Acceptance criteria |
|---|---|---|---|
| FR-HOME-01 | P1 | Tampilkan jumlah reimburse berdasarkan status | Angka sesuai query terotorisasi di SQLite |
| FR-HOME-02 | P1 | Tampilkan PJD menunggu menurut tahap persetujuan | Tahap sesuai state existing, bukan label baru yang mengubah makna |
| FR-HOME-03 | P1 | Tampilkan total nominal bulan berjalan | Total dihitung sistem; definisi nominal dan tanggal **[PENDING]** |
| FR-HOME-04 | P0 | Data ringkasan tidak bocor lintas izin | Staf (jika diaktifkan) hanya melihat data miliknya; cakupan agregat per peran perlu validasi |

### 6.3 Reimburse

| ID | Prioritas | Kebutuhan | Acceptance criteria |
|---|---|---|---|
| FR-RMB-01 | P1 | Daftar dengan filter status, bulan, pengguna | Hasil filter konsisten dengan `store.py`; data terotorisasi |
| FR-RMB-02 | P1 | Detail foto struk (tautan Drive bila ada), item, total, audit | Detail terkait ID benar; tautan tidak membuka akses yang tidak berhak |
| FR-RMB-03 | P1 | Finance menyetujui pengajuan Menunggu | Memakai fungsi keputusan bersama; status dan audit sama dengan WhatsApp |
| FR-RMB-04 | P1 | Finance menolak dengan alasan wajib | Penolakan tanpa alasan ditolak tanpa perubahan status |
| FR-RMB-05 | P0 | Semua keputusan menggunakan ID valid | ID hilang/tidak ditemukan/salah tahap ditolak aman |
| FR-RMB-06 | P0 | Mencegah keputusan ganda/konflik | Dua permintaan pada ID yang sama tidak menghasilkan dua transisi tidak sah |

### 6.4 PJD F-16

| ID | Prioritas | Kebutuhan | Acceptance criteria |
|---|---|---|---|
| FR-F16-01 | P1 | Daftar/detail F-16 beserta pos anggaran dan tahap | Total dihitung dari pos; rincian konsisten dengan data existing |
| FR-F16-02 | P1 | Aksi atasan `KETAHUI` pada tahap sah | Hanya atasan yang sesuai dapat memutuskan |
| FR-F16-03 | P1 | Aksi Direktur `SETUJUIPJD` pada tahap sah | Tahap atasan harus terpenuhi menurut aturan existing |
| FR-F16-04 | P1 | Aksi `TOLAKPJD` sesuai peran/tahap existing | Alasan dan izin mengikuti aturan existing; detail perlu verifikasi kode |
| FR-F16-05 | P0 | Pembuatan PDF resmi mendahului perubahan status ketika disyaratkan | Jika pembuatan PDF gagal, status tidak berubah |

### 6.5 PJD F-17, Kasbon & Pelunasan

| ID | Prioritas | Kebutuhan | Acceptance criteria |
|---|---|---|---|
| FR-F17-01 | P1 | Tampilkan anggaran vs realisasi, bukti, selisih Kurang/Lebih | Perhitungan mengikuti fungsi existing; tidak menerima total manual |
| FR-F17-02 | P1 | Finance mencatat `KASBON` bertahap | Mutasi melalui fungsi existing; pencairan dan audit konsisten |
| FR-F17-03 | P1 | Finance mencatat `PELUNASAN` | Status pembayaran dihitung/diperbarui sesuai aturan existing |
| FR-F17-04 | P1 | Finance `VERIFIKASILAPORAN` | Hanya Finance pada tahap valid |
| FR-F17-05 | P1 | Atasan `KETAHUILAPORAN` | Hanya atasan pada tahap valid |
| FR-F17-06 | P1 | Direktur `SETUJUILAPORAN` | Hanya Direktur pada tahap valid |
| FR-F17-07 | P1 | `TOLAKLAPORAN` pada tahap/peran sah | Alasan wajib bila ditentukan aturan existing; verifikasi detail diperlukan |
| FR-F17-08 | P0 | Status `LUNAS` independen dari status persetujuan | UI tidak menyamakan disetujui dengan lunas |
| FR-F17-09 | P0 | Bukti non-struk/asumsi harus mencantumkan jenis bukti + catatan | Validasi wajib pada jalur input terkait; dashboard v1 hanya menampilkan bukti existing kecuali aksi baru disetujui |

### 6.6 Rekap, Pengguna, Audit

| ID | Prioritas | Kebutuhan | Acceptance criteria |
|---|---|---|---|
| FR-REC-01 | P1 | Tampilkan rekap bulanan memakai `recap.py` | Nilai sama dengan rekap existing untuk periode yang sama |
| FR-REC-02 | P1 | Unduh XLSX | File valid, periode dan akses sesuai pengguna |
| FR-USR-01 | P1 | Daftar pengguna master | Data berasal dari `users`, tidak disalin ke tabel identitas baru |
| FR-USR-02 | P1 | Finance mendaftarkan pengguna via logika `DAFTARKAN` existing | Input nomor/nama/jabatan/role divalidasi sesuai existing, tercatat audit |
| FR-AUD-01 | P1 | Tampilkan audit per reimburse/PJD | Riwayat memuat waktu, aktor, tindakan dan status sesuai data yang tersedia |
| FR-AUD-02 | P0 | Mutasi web memiliki penanda kanal `web` | Audit mengaitkan aksi ke identitas pengambil keputusan |

## 7. User Stories & Skenario Penerimaan

**US-01 — Finance meninjau reimburse**  
Sebagai Finance, saya ingin memfilter pengajuan Menunggu dan melihat struk serta item agar dapat mengambil keputusan berdasarkan bukti.  
**Given** Finance telah login dan ada reimburse Menunggu, **when** Finance membuka daftar/detail, **then** sistem menampilkan hanya data yang berhak diakses beserta total sistem dan audit.

**US-02 — Finance menolak reimburse**  
Sebagai Finance, saya ingin menolak dengan alasan agar keputusan terdokumentasi.  
**Given** pengajuan valid dan aksi web disetujui, **when** alasan kosong, **then** tidak ada transisi; **when** alasan valid, **then** fungsi bersama memproses keputusan dan audit kanal web dicatat.

**US-03 — Atasan mengetahui F-16**  
Sebagai atasan, saya ingin memberi `KETAHUI` pada F-16 yang menjadi kewenangan saya.  
**Given** relasi atasan dan tahap valid, **when** saya bertindak, **then** keputusan tercatat sesuai aturan existing; pengguna lain ditolak.

**US-04 — Direktur menyetujui F-16**  
Sebagai Direktur, saya ingin menyetujui F-16 setelah tahap atasan.  
**Given** tahap sah, **when** PDF resmi gagal dibuat, **then** status tidak berubah; **when** proses berhasil, **then** status dan audit sesuai fungsi bersama.

**US-05 — Finance mengelola kasbon**  
Sebagai Finance, saya ingin melihat riwayat kasbon dan mencatat pencairan/pelunasan agar posisi pembayaran jelas.  
**Then** nilai, riwayat, selisih, dan status `LUNAS` ditampilkan terpisah dari persetujuan laporan.

**US-06 — Direktur memeriksa F-17**  
Sebagai Direktur, saya ingin meninjau realisasi dan bukti sebelum `SETUJUILAPORAN`.  
**Then** keputusan hanya tersedia setelah tahapan Finance dan atasan yang diwajibkan existing.

**US-07 — Finance mengunduh rekap**  
Sebagai Finance, saya ingin memilih bulan dan mengunduh XLSX agar dapat melaporkan transaksi.  
**Then** file dihasilkan dari `recap.py` dan nilainya konsisten dengan SQLite.

**US-08 — Finance mendaftarkan pengguna**  
Sebagai Finance, saya ingin menambah pengguna melalui form web tanpa mengubah identitas master.  
**Then** pendaftaran memanggil fungsi existing, validasi dilakukan server-side, dan audit tercatat.

**US-09 — Pengguna tanpa izin**  
Sebagai pemilik sistem, saya ingin pengguna tidak berhak tidak dapat melihat data/mengeksekusi aksi.  
**Given** sesi tidak valid atau role tidak sesuai, **when** endpoint diakses langsung, **then** sistem menolak tanpa membocorkan detail maupun mengubah database.

## 8. Business Rules & State Integrity

| ID | Aturan wajib | Sumber |
|---|---|---|
| BR-01 | SQLite merupakan sumber kebenaran; Sheets dan Drive hanya cermin/arsip | AGENT.md §1 |
| BR-02 | Semua total dihitung dari item/pos oleh sistem | AGENT.md §1 |
| BR-03 | Nama, jabatan, role dari `users`; bukan input bebas untuk keputusan | AGENT.md §1 |
| BR-04 | Keputusan wajib ID; penolakan reimburse wajib alasan | AGENT.md §1 |
| BR-05 | PDF dibuat sebelum perubahan status pada alur yang mensyaratkannya | AGENT.md §1 |
| BR-06 | Setiap perubahan status menulis `audit_log` dengan identitas aktor | AGENT.md §1 |
| BR-07 | Dashboard tidak menulis SQL mutasi langsung atau menduplikasi logika | AGENT.md §1–2 |
| BR-08 | `LUNAS` dan persetujuan F-17 adalah dua dimensi status berbeda | AGENT.md §1 |
| BR-09 | Hanya Finance/atasan/Direktur sesuai tahap yang dapat memutuskan | AGENT.md §2 |
| BR-10 | Pengajuan baru hanya dari WhatsApp pada v1 | AGENT.md §2 |

**[PENDING]** Matriks lengkap state transition (nama status internal, urutan gagal/tolak, role atasan, batas nominal kasbon/pelunasan) harus diekstraksi dari `store.py`, `app.py`, `PJD-F16.md`, dan `PJD-F17.md`. PRD tidak mengarang nama state atau aturan finansial baru.

## 9. Matriks Akses Dashboard v1 — disetujui untuk Finance saja

| Kapabilitas | Finance (web) | Staf (web) | Atasan (web) | Direktur (web) |
|---|---|---|---|---|
| Login dashboard | **Ya** | Tidak | Tidak | Tidak |
| Beranda, daftar/detail, rekap/audit | **Ya**, sesuai kebijakan data | Tidak | Tidak | Tidak |
| Setuju/Tolak reimburse | **Ya**, sesuai rule existing | Tidak | Tidak | Tidak |
| PJD `KASBON`/`PELUNASAN` | **Ya**, sesuai rule existing | Tidak | Tidak | Tidak |
| PJD `VERIFIKASILAPORAN` | **Ya**, sesuai rule existing | Tidak | Tidak | Tidak |
| PJD `KETAHUI` / `KETAHUILAPORAN` | **Tidak** | Tidak | Tidak | Tidak |
| PJD `SETUJUIPJD` / `SETUJUILAPORAN` | **Tidak** | Tidak | Tidak | Tidak |
| Pendaftaran pengguna | **Ya**, sesuai role Finance existing | Tidak | Tidak | Tidak |

**[KEPUTUSAN USER]** Pembatasan login hanya berlaku untuk **dashboard**, bukan pemblokiran operasi WhatsApp. Tahap keputusan atasan dan Direktur tetap dilakukan dari WhatsApp sesuai business rules existing. Persetujuan web tidak berarti Finance dapat mengambil alih hak persetujuan Direktur/atasan. Kebijakan data lintas karyawan serta pemisahan pengelola akun Finance dari pengguna Finance biasa perlu diperjelas untuk implementasi.

## 10. Information Architecture & Rancangan Halaman

**[USULAN]** Sitemap server-rendered berikut untuk menyampaikan cakupan, bukan keputusan final URL selain `/dashboard`:

```text
/dashboard
├── /login                  Email + password; Finance only
├── /                      Beranda
├── /reimburse             Daftar dan filter
│   └── /<id>              Detail, audit, aksi Finance
├── /pjd                   Daftar F-16/F-17
│   └── /<id>              Detail, tahap, kasbon, pelunasan, aksi
├── /rekap                 Bulanan dan unduh XLSX
├── /pengguna              Daftar/pendaftaran Finance
└── /audit                 Riwayat per pengajuan
```

### Komponen UI yang disarankan [USULAN]
- Layout: header identitas, navigasi modul, penanda peran, logout.
- Beranda: kartu KPI dan antrean keputusan menurut kewenangan.
- Daftar: tabel status, ID, tanggal, pengaju, nominal, tahap; filter dan empty state.
- Detail: informasi utama, rincian pos/item, bukti, riwayat audit, tindakan sesuai role.
- Konfirmasi keputusan: ringkasan ID, jenis aksi, alasan jika wajib, CSRF, umpan balik sukses/gagal.
- Status: bedakan jelas status persetujuan vs pelunasan.
- Responsif: dapat dipakai di browser desktop dan mobile; **bukan** aplikasi mobile native.
- Aksesibilitas: label form, navigasi keyboard, pesan error tekstual, fokus terlihat.

## 11. Arsitektur Teknis dan Kontrak Integrasi

### 11.1 Stack terkunci [SUMBER]
Python 3.10+, Flask, SQLite (WAL, transaksi, ID atomik melalui `store.py`), WhatsApp Cloud API, Tesseract, fpdf2, gspread, requests + google-auth, gunicorn **1 worker × 4 thread**, nginx, Oracle Cloud Always Free. Gunicorn tidak boleh dinaikkan jumlah workernya tanpa analisis worker OCR in-process dan SQLite.

### 11.2 Komponen
```text
Browser HTTPS
   ↓ nginx
Flask application (gunicorn: 1 worker, 4 threads)
   ├── WhatsApp webhook / app.py
   └── Dashboard Blueprint / dashboard.py
             ├── templates/ (Jinja)
             └── static/ (CSS/JS minimal)
   ↓ Shared decision functions (existing / extracted from app.py)
   ↓ store.py → SQLite [source of truth, audit_log]
   ├── pdf_bill.py / pdf_pjd.py
   ├── recap.py → XLSX
   ├── sheets_sync.py → Google Sheets (mirror)
   └── drive_sync.py → Google Drive (archive)
```

### 11.3 Kontrak implementasi
1. Semua baca/tulis SQLite melalui `store.py` (tambahkan fungsi query di sana bila diperlukan).
2. Jika logika keputusan hanya berada di handler WhatsApp, refactor menjadi fungsi bersama **sebelum** menambahkan aksi dashboard.
3. Jangan mengubah perilaku webhook HMAC `X-Hub-Signature-256`, dedup `wamid`, antrean foto, atau audit existing.
4. Jangan memperkenalkan DB kedua untuk identitas bisnis.
5. Pertahankan upsert Sheets berdasarkan ID dan worksheet per bulan pengajuan; Drive menggunakan OAuth pemilik folder.
6. Integrasi Google bersifat fail-soft sebagaimana existing; definisi indikator kegagalan/retry perlu ditinjau di kode.

### 11.4 Data dan model konseptual [bukan DDL]
- **Users:** nomor WA, nama, jabatan, role; sumber identitas.
- **Reimburse:** ID, pengaju, item, nominal hasil hitung, bukti, status, keputusan.
- **PJD F-16:** ID, pemohon, pos anggaran, status/tahap, PDF.
- **PJD F-17:** keterkaitan PJD, realisasi, bukti, tahap persetujuan.
- **Kasbon/pelunasan:** transaksi pencairan dan penyelesaian; status pelunasan terpisah.
- **Audit:** aktor, tindakan, referensi pengajuan, waktu, kanal.

**[PENDING]** Nama tabel/kolom, foreign key, indeks, dan schema sesi/OTP hanya boleh ditetapkan setelah membaca migrasi dan `store.py`.

## 12. Non-Functional Requirements

| ID | Aspek | Persyaratan |
|---|---|---|
| NFR-SEC-01 | HTTPS | Semua akses dashboard melalui HTTPS di nginx dan sertifikat layanan yang sama |
| NFR-SEC-02 | Sesi | Cookie HttpOnly, SameSite=Lax, Secure; logout dan expiry **[USULAN]** |
| NFR-SEC-03 | CSRF | Semua form mutasi terlindungi dan diverifikasi server-side |
| NFR-SEC-04 | Authorization | Default deny; pemeriksaan per request, per record, dan per aksi |
| NFR-SEC-05 | Secrets | Token `.env`, file `credentials/` mode 0600 dan gitignored; jangan cetak ke log/dokumen/chat |
| NFR-DAT-01 | Integritas | Total dihitung sistem; transaksi status konsisten; audit lengkap |
| NFR-REL-01 | Reliabilitas | Kegagalan Google tidak mengubah SQLite menjadi data sekunder; tangani kegagalan eksplisit |
| NFR-OPS-01 | Deployment | Menggunakan deploy Oracle existing; tidak ada hosting dashboard terpisah |
| NFR-TEST-01 | Regresi | Test baru `tests/test_dashboard_*.py`; suite existing harus tetap lulus |
| NFR-PERF-01 | Performa | **[PENDING]** target p95, volume transaksi, retensi, ukuran berkas |
| NFR-OPS-02 | Backup | Gunakan paket backup `deploy/`; **[PENDING]** RPO/RTO, jadwal dan uji restore |
| NFR-UX-01 | Usability | **[USULAN]** feedback jelas untuk validasi, kegagalan dan aksi sukses; aksesibilitas dasar |

**[USULAN]** Terapkan pengamanan tambahan untuk aksi sensitif: pembatasan percobaan login, pengamanan sesi dari fixation, validasi tautan Drive, sanitasi output Jinja, dan audit kegagalan autentikasi tanpa membocorkan rahasia. Rincian implementasi perlu disetujui dan diuji.

## 13. Prioritas MVP dan Urutan Delivery

| Fase | Paket pekerjaan | Dependency / gate | Keluaran |
|---|---|---|---|
| 0 | Discovery dan keputusan produk | Empat keputusan terbuka disetujui; review kode dan dokumentasi | Baseline, RBAC final, state map, backlog disetujui |
| 1 | Blueprint, login, otorisasi, sesi/CSRF | Fase 0 | Fondasi dashboard aman |
| 2 | Beranda, daftar dan detail reimburse | Fase 1 | Monitoring reimburse |
| 3 | Aksi reimburse (jika disetujui) | Fungsi keputusan bersama | Persetujuan/penolakan dengan audit |
| 4 | PJD F-16/F-17 read-only | Review state PJD dan model bukti | Monitoring anggaran, realisasi dan tahap |
| 5 | Aksi PJD, kasbon/pelunasan (jika disetujui) | Reuse logika keputusan + PDF | Workflow web sesuai peran |
| 6 | Rekap, pengguna, audit | Reuse `recap.py` dan `DAFTARKAN` | Fitur administratif v1 |
| 7 | Hardening, UAT, deployment | Semua test dan keamanan lulus; server siap | Rilis bersama bot ke Oracle |

> **[USULAN]** Urutan fase untuk pengendalian risiko; bukan estimasi durasi atau komitmen jadwal. Satu fitur diimplementasikan dan diuji sebelum melanjutkan sesuai protokol AGENT.md.

## 14. Test Strategy & Definition of Done

### 14.1 Tingkat pengujian
- **Unit:** query/filter, validasi input, aturan izin, mapping status dan perhitungan yang memanggil fungsi existing.
- **Integration:** endpoint dashboard ↔ fungsi keputusan bersama ↔ `store.py` ↔ audit ↔ PDF.
- **Security:** tanpa login, akses silang ID, role salah, CSRF tidak valid, replay/double-submit, session invalid.
- **Regression:** seluruh suite existing; baseline dilaporkan 102/102 dalam sumber, tetapi wajib dijalankan ulang.
- **UAT:** Finance, atasan, Direktur memvalidasi alur riil dan perbedaan status persetujuan vs lunas.
- **Deployment smoke test:** login HTTPS, health, webhook Meta, akses dashboard, arsip/rekap; OCR diuji di lingkungan dengan Tesseract.

### 14.2 Skenario wajib
| Test ID | Skenario | Hasil diharapkan |
|---|---|---|
| TC-01 | GET dashboard tanpa login | Ditolak/tidak ada data |
| TC-02 | Staf membuka detail milik orang lain (jika staf diaktifkan) | Ditolak |
| TC-03 | Finance mencoba aksi Direktur | Ditolak tanpa perubahan status |
| TC-04 | Reimburse ditolak tanpa alasan | Validasi gagal, audit keputusan tidak dibuat |
| TC-05 | Form mutasi tanpa CSRF | Ditolak |
| TC-06 | Dua aksi bersamaan pada ID sama | Maksimal satu transisi sah menurut state machine |
| TC-07 | PDF wajib gagal dibuat | Status tidak berubah |
| TC-08 | Aksi web sukses | Audit memuat aktor dan kanal web |
| TC-09 | F-17 disetujui namun belum lunas | Kedua status ditampilkan berbeda |
| TC-10 | Rekap XLSX periode terpilih | Nilai sama dengan `recap.py`/SQLite |
| TC-11 | Google Sheets/Drive gagal | Status sumber tetap konsisten, kegagalan tidak disamarkan |
| TC-12 | Jalur WhatsApp existing setelah refactor | Perilaku lama dan test regresi tetap lulus |

### 14.3 Definition of Done per fitur
- Pemahaman fitur, file terdampak, dan pendekatan teknis telah dijelaskan sebelum implementasi.
- Semua keputusan yang relevan telah disetujui; tidak ada asumsi tersembunyi.
- Test baru untuk perilaku baru/perbaikan bug ditambahkan; untuk bug, bila relevan buktikan test gagal sebelum fix.
- Test relevan dan suite regresi lulus di lingkungan yang mendukung; keterbatasan lingkungan dilaporkan jelas.
- Akses, audit, CSRF, validasi, dan integritas data diverifikasi.
- Dokumentasi file berubah, cara uji, risiko, dan hasil aktual tercatat.
- Stakeholder menyetujui acceptance criteria pada UAT sebelum rilis.

## 15. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Duplikasi logika WhatsApp vs web | Keputusan/status tidak konsisten | Shared service sebelum menambah endpoint aksi |
| Role atasan tidak jelas dalam master | Kebocoran/penolakan akses | Audit model otorisasi existing pada fase 0 |
| Race condition aksi paralel | Persetujuan ganda | Validasi state + transaksi atomik di `store.py` |
| Kegagalan PDF | Status tidak sah/tanpa dokumen | Pertahankan urutan PDF sebelum transisi |
| Kegagalan Drive/Sheets | Data arsip/cermin tertinggal | SQLite tetap otoritatif; observabilitas dan prosedur retry existing |
| Session/CSRF lemah | Aksi tidak sah | Pengujian negatif dan HTTPS wajib |
| Server Oracle belum ada | Rilis tertunda | Jadikan provisioning dan sertifikat gate deployment |
| Tesseract tak ada di sandbox | Uji OCR tidak lengkap | Uji OCR di laptop/Oracle; jangan mengklaim rusak |
| Lingkup v1 melebar | Jadwal dan regresi | Change control, out-of-scope tegas, delivery per fitur |

## 16. Decision Log — pembaruan stakeholder 18 November 2026

| ID | Keputusan | Hasil | Status |
|---|---|---|---|
| DEC-01 | Metode login | **Email dan password**, bukan OTP WhatsApp | **DISETUJUI** |
| DEC-02 | Pengguna dashboard v1 | **Hanya tim Finance** | **DISETUJUI** |
| DEC-03 | Kemampuan aksi web | **Ya, bisa persetujuan**, terbatas kewenangan Finance existing | **DISETUJUI** |
| DEC-04 | Alamat dashboard | Rekomendasi `/dashboard` di domain yang sama dengan webhook; **alamat final belum diberikan** | **PENDING APPROVAL** |

**Dampak keputusan:** ketiga keputusan pertama menggantikan opsi rekomendasi yang belum diputuskan di §3 AGENT.md. Dokumen sumber tetap dipertahankan sebagai catatan awal; keputusan stakeholder terbaru menjadi acuan PRD. Pengembangan login membutuhkan desain pengaitan email ke identitas `users` tanpa mengganti nomor WhatsApp sebagai identitas bot.

### 16.1 Klarifikasi lanjutan hasil analisis [USULAN]
1. Bagaimana identitas dan relasi **atasan** direpresentasikan dalam `users`/alur existing?
2. Siapa dapat melihat rekap agregat dan data lintas staf? Apakah Direktur melihat semua, dan atasan hanya timnya?
3. Definisi nominal beranda: total pengajuan, disetujui, dibayar, atau gabungan? Periode berdasar tanggal pengajuan atau transaksi?
4. Apa aturan alasan `TOLAKPJD` dan `TOLAKLAPORAN` pada kode existing?
5. Apa aturan validasi kasbon, pelunasan, batas nominal, dan bukti pendukung yang sudah berlaku?
6. Bagaimana email Finance didaftarkan/diverifikasi, siapa mengelola akun dan reset password, berapa timeout sesi serta kebijakan lockout?
7. Berapa volume data, retensi, SLA, RPO/RTO, dan kriteria performa?
8. Siapa penanggung jawab UAT, approval rilis, dan operasi server?

## 17. Kriteria Go/No-Go Rilis

**Go** hanya jika: DEC-04 telah disetujui dan DEC-01–03 telah diterjemahkan ke kontrol akses serta spesifikasi akun yang dapat diuji; otorisasi dan matriks transisi terverifikasi; seluruh P0 selesai; regression suite lulus; pengujian keamanan negatif lulus; UAT Finance diterima untuk dashboard dan regresi alur WhatsApp atasan/Direktur lulus; HTTPS/backup/monitoring sesuai deployment existing; tidak ada rahasia di kode, dokumen, maupun log.

**No-Go** jika: ada bypass izin, mutasi tanpa audit, status berubah sebelum PDF wajib selesai, data web tidak konsisten dengan SQLite, atau server produksi belum aman/siap.

## 18. Change Management & Protokol Agent

Setiap fitur mengikuti urutan wajib: **(1)** jelaskan pemahaman; **(2)** sebut file yang dibuat/diubah; **(3)** jelaskan pendekatan dan dampak; **(4)** implementasikan dan uji; **(5)** dokumentasikan perubahan. Perubahan stack, scope besar, atau keputusan terbuka memerlukan persetujuan pengguna terlebih dahulu. Tidak boleh mengklaim fitur berjalan tanpa hasil pengujian aktual.

## 19. Lampiran: Pemetaan File Implementasi

| File/Folder | Tindakan yang direncanakan | Catatan |
|---|---|---|
| `dashboard.py` | **Baru** | Flask Blueprint `/dashboard` |
| `templates/` | **Baru/tambah** | Jinja login, beranda, daftar/detail, rekap, pengguna, audit |
| `static/` | **Baru/tambah** | CSS dan JS minimal |
| `store.py` | **Mungkin ubah** | Query/aksi bersama melalui satu lapisan DB |
| `app.py` | **Mungkin refactor** | Ekstraksi keputusan bersama bila belum ada |
| `config.py` | **Mungkin ubah** | Pengaturan sesi/autentikasi setelah keputusan |
| `recap.py` | **Reuse** | Rekap XLSX existing |
| `pdf_bill.py`, `pdf_pjd.py` | **Reuse** | Jangan ubah urutan dokumen/status |
| `sheets_sync.py`, `drive_sync.py` | **Reuse** | Fail-soft dan autentikasi existing |
| `tests/test_dashboard_*.py` | **Baru** | Regression tests dashboard |
| `deploy/`, `PHASE6.md` | **Review/ubah bila perlu** | Deployment satu layanan di Oracle |
| `credentials/`, `.env` | **Rahasia — tidak didokumentasikan nilainya** | Jangan cetak/commit |

---

## 20. Traceability terhadap Sumber

| Bagian AGENT.md | Penerapan dalam PRD |
|---|---|
| §1 Sistem existing | §1, §5, §8, §11, §19 |
| §1 Stack dan peta file | §4.3, §11, §19 |
| §1 Business rules | §6, §8, §14 |
| §2 Dashboard v1 | §4, §6, §10, §13 |
| §2 Keamanan dan out-of-scope | §4, §9, §12 |
| §3 Keputusan terbuka | §16 |
| §4 Protokol agent | §14, §18 |
| §5 Konteks operasional | §11, §13, §15, §17 |

**Catatan akhir:** PRD ini siap digunakan untuk review bisnis dan penyelarasan tim. Implementasi tidak boleh dimulai pada area yang bergantung pada alamat dashboard final dan detail teknis akun sampai disetujui; source code existing harus ditinjau sebelum modifikasi.
