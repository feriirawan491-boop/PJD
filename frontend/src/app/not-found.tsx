import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">404 · INDOTEK FINANCE</span>
      <h1>Halaman tidak ditemukan.</h1>
      <p>Halaman ini mungkin sudah berpindah atau alamatnya tidak sesuai.</p>
      <Link href="/" className="button button-primary">
        Kembali ke ringkasan
      </Link>
    </main>
  );
}
