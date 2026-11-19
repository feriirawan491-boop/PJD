'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Expand, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from './ui';

const evidence = [
  { name: 'Struk belanja operasional', url: '/images/evidence/alfamart.svg' },
  { name: 'Struk bahan bakar', url: '/images/evidence/pertamina.svg' },
  { name: 'Struk konsumsi', url: '/images/evidence/restoran.svg' },
];
export function DemoEvidence() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section className="demo-evidence">
      <h4 className="section-label">
        Bukti pengajuan <span className="inline-count">{evidence.length}</span>
      </h4>
      <p className="muted">
        Tinjau struk sebelum mengambil keputusan. Klik gambar untuk memperbesar.
      </p>
      <div className="evidence-gallery">
        {evidence.map((file, index) => (
          <button
            key={file.url}
            onClick={() => setSelected(index)}
            className="evidence-card"
            aria-label={`Perbesar ${file.name}`}
          >
            <span className="evidence-thumbnail">
              <Image
                src={file.url}
                alt={file.name}
                fill
                unoptimized
                sizes="(max-width:767px) 40vw, 170px"
              />
            </span>
            <span>
              {file.name}
              <Expand size={16} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
      <p className="muted">Salinan ilustrasi struk untuk data dummy.</p>
      <Modal
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected !== null ? evidence[selected].name : 'Bukti pengajuan'}
        description="Periksa tanggal, rincian item, dan total pada bukti sebelum memutuskan pengajuan."
      >
        {selected !== null && (
          <>
            <div className="evidence-review-controls">
              <button
                className="button button-secondary"
                onClick={() =>
                  setSelected(
                    (selected + evidence.length - 1) % evidence.length,
                  )
                }
                aria-label="Bukti sebelumnya"
              >
                <ChevronLeft size={18} />
              </button>
              <span>
                Bukti {selected + 1} dari {evidence.length}
              </span>
              <button
                className="button button-secondary"
                onClick={() => setSelected((selected + 1) % evidence.length)}
                aria-label="Bukti berikutnya"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="evidence-full">
              <Image
                src={evidence[selected].url}
                alt={evidence[selected].name}
                width={420}
                height={740}
                unoptimized
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
