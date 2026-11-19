import { expect, test } from '@playwright/test';
test('review and reject an eligible request with required reason', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  if (isMobile)
    await page.getByRole('button', { name: 'Buka navigasi' }).click();
  await page
    .getByRole('link', { name: 'Reimburse', exact: false })
    .first()
    .click();
  await page.getByRole('button', { name: 'Lihat detail RMB-2611-042' }).click();
  await page.getByRole('button', { name: 'Tolak', exact: true }).click();
  await page.getByRole('button', { name: 'Konfirmasi simulasi' }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'Alasan penolakan wajib diisi.',
  );
  await page.getByLabel('Alasan penolakan').fill('Bukti perlu dilengkapi');
  await page.getByRole('button', { name: 'Konfirmasi simulasi' }).click();
  await expect(page.getByRole('status')).toContainText('Simulasi berhasil');
  await expect(
    page.getByRole('row').filter({ hasText: 'RMB-2611-042' }),
  ).toContainText('Ditolak');
});
test('search, empty state, responsive layout and export', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  if (isMobile)
    await page.getByRole('button', { name: 'Buka navigasi' }).click();
  await page
    .getByRole('link', { name: 'Reimburse', exact: false })
    .first()
    .click();
  await page.getByRole('textbox', { name: 'Cari pengajuan' }).fill('tidak-ada');
  await expect(
    page.getByText('Tidak ada pengajuan', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Hapus pencarian' }).click();
  await expect(
    page.getByRole('button', { name: 'Lihat detail RMB-2611-042' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Ekspor laporan' }).click();
  expect((await download).suggestedFilename()).toBe('rekap-demo-2026-11.xlsx');
});

test('PJD payment stays separate from approval and dialogs support Escape', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  if (isMobile)
    await page.getByRole('button', { name: 'Buka navigasi' }).click();
  await page
    .getByRole('link', { name: 'Perjalanan dinas', exact: true })
    .click();
  await page.getByRole('button', { name: 'Lihat detail PJD-2611-017' }).click();
  await page.getByRole('button', { name: 'Catat pelunasan' }).click();
  await page
    .getByLabel('Catatan pembayaran')
    .fill('Pelunasan simulasi transfer');
  await page
    .getByRole('button', { name: 'Konfirmasi pembayaran demo' })
    .click();
  await expect(page.getByRole('status')).toContainText(
    'Pembayaran contoh dicatat',
  );
  await page.getByRole('button', { name: 'Lihat detail PJD-2611-017' }).click();
  await expect(page.getByRole('dialog')).toContainText('Lunas');
  await expect(page.getByRole('dialog')).toContainText('Disetujui');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Lihat detail PJD-2611-017' }),
  ).toBeFocused();
});

test('overview has no horizontal overflow and renders consistently', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Dashboard PJD.' }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('overview.png'),
    fullPage: true,
    animations: 'disabled',
    caret: 'initial',
  });
});
