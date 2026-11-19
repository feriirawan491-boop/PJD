import Image from 'next/image';

export function CompanyLogo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/images/indotek-logo.png"
      alt="Indotek Buana Karya"
      width={3000}
      height={678}
      className={`company-logo ${className}`}
      sizes="(max-width: 767px) 200px, 220px"
      priority
    />
  );
}
