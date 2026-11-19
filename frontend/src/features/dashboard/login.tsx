'use client';
import { ThemeToggle } from '@/components/theme-toggle';
import { FinanceIllustration } from '@/components/finance-illustration';
import { CompanyLogo } from '@/components/company-logo';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui';
import { company } from '@/constants/company';
const schema = z.object({
  email: z.email('Masukkan alamat email yang valid.'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter.'),
});
type LoginValues = z.infer<typeof schema>;
export function Login({ onEnter }: { onEnter: () => void }) {
  const [visible, setVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema) });
  return (
    <main className="login-screen">
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>
      <section className="login-story">
        <div className="login-brand">
          <CompanyLogo />
        </div>
        <div className="login-story-content">
          <span className="eyebrow">Finance workspace</span>
          <h1>
            Lebih teratur.
            <br />
            Lebih mudah
            <br />
            <span>mengambil keputusan.</span>
          </h1>
          <p>
            Satu ruang untuk meninjau reimburse, memantau perjalanan dinas, dan
            melihat setiap proses dengan jelas.
          </p>
          <FinanceIllustration />
        </div>
        <small>{company.legalName} © 2026</small>
      </section>
      <section className="login-form-wrap">
        <div className="login-form">
          <span className="icon-tile blue">
            <ShieldCheck size={25} />
          </span>
          <h2>Selamat datang kembali</h2>
          <p>Masuk ke ruang kerja Finance Anda.</p>
          <div className="info-banner">
            Mode demonstrasi UI. Jangan gunakan kredensial asli. Form ini tidak
            mengautentikasi akun.
          </div>
          <form onSubmit={handleSubmit(onEnter)} noValidate>
            <label className="form-field">
              Email
              <input
                type="email"
                autoComplete="username"
                placeholder="nama@perusahaan.co.id"
                {...register('email')}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && (
                <small id="email-error" className="form-error">
                  {errors.email.message}
                </small>
              )}
            </label>
            <label className="form-field">
              Kata sandi
              <span className="password-wrap">
                <input
                  type={visible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Minimal 8 karakter"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  aria-label={
                    visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                  }
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
              {errors.password && (
                <small id="password-error" className="form-error">
                  {errors.password.message}
                </small>
              )}
            </label>
            <Button
              className="full-width"
              variant="primary"
              disabled={isSubmitting}
              type="submit"
            >
              Masuk ke demo <ArrowRight size={17} />
            </Button>
          </form>
          <div className="login-divider">atau jelajahi tampilan</div>
          <Button className="full-width" onClick={onEnter}>
            Buka demo tanpa akun
          </Button>
          <p className="login-footnote">
            Akses produksi hanya untuk tim Finance yang terdaftar.
          </p>
        </div>
      </section>
    </main>
  );
}
