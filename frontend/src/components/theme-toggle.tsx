'use client';
import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

function subscribe(callback: () => void) {
  window.addEventListener('theme-change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('theme-change', callback);
    window.removeEventListener('storage', callback);
  };
}
function snapshot() {
  return document.documentElement.dataset.theme === 'dark';
}
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, snapshot, () => false);
  return (
    <button
      className="icon-button theme-toggle"
      aria-label={dark ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
      title={dark ? 'Tema terang' : 'Tema gelap'}
      aria-pressed={dark}
      onClick={() => {
        const theme = dark ? 'light' : 'dark';
        document.documentElement.dataset.theme = theme;
        try {
          localStorage.setItem('indotek-theme', theme);
        } catch {
          /* Theme still works without storage. */
        }
        window.dispatchEvent(new Event('theme-change'));
      }}
    >
      {dark ? (
        <Sun aria-hidden="true" size={18} />
      ) : (
        <Moon aria-hidden="true" size={18} />
      )}
    </button>
  );
}
