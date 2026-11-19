'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="not-found">
      <h1>Tampilan belum dapat dimuat.</h1>
      <p>Silakan coba lagi untuk melanjutkan.</p>
      <button className="button button-primary" onClick={reset}>
        Coba lagi
      </button>
    </main>
  );
}
