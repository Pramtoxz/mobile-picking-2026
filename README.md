# Operator Picking (Mobile App)

Aplikasi mobile untuk operator lapangan gudang — menjalankan picking part di rak area masing-masing.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi API

Copy `.env.example` ke `.env` dan sesuaikan URL backend:

```bash
VITE_API_URL=
```

### 3. Development

```bash
npm run dev
```

Akses di browser: http://localhost:5173

### 4. Build Production

```bash
npm run build
```

### 5. Capacitor (Android)

```bash
npm install @capacitor/cli -D
npx cap add android
npx cap sync
npx cap open android
```

---

## 📋 Architecture

### Backend API (di @new Laravel)

| Endpoint                           | Method | Deskripsi                                                  |
| ---------------------------------- | ------ | ---------------------------------------------------------- |
| `/api/lapangan/auth/login`         | POST   | Login operator dengan email/password → return Bearer token |
| `/api/lapangan/logout`             | POST   | Logout (delete token)                                      |
| `/api/lapangan/do`                 | GET    | Daftar DO dengan status Waiting, filtered by area operator |
| `/api/lapangan/do/{fkDo}/parts`    | GET    | Semua part dalam satu DO, urut: waiting dulu → lokasi rak  |
| `/api/lapangan/part/update-status` | POST   | Mark done / undo part                                      |
| `/api/lapangan/kartustok`          | POST   | Simpan kartu stok keluar (validasi qty harus match)        |

### Frontend Pages

- **/login** — Email + password form untuk HP landscape
- **/do** — Grid card DO (badge URGENT jika bundling)
- **/kerja/:fkDo** — Satu part per layar dengan tombol besar + progress bar
- **/kartustok/:fkDo** — Input jumlah barang (modal muncul otomatis saat mark done)

---

## 📱 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 7
- **Routing**: React Router v7
- **State**: Zustand (persisted token)
- **HTTP**: Axios
- **UI**: Tailwind CSS 4 + custom components
- **Mobile**: Capacitor 7 (Android)

---

## 🛠️ Key Features

### Auto-Advance Flow

Setiap kali operator tekan "SUDAH DIAMBIL ✓":

1. Backend update `status_picking_list = 'done'` dan `qty_picking = qty_part`
2. Jika ada kartu stok, modal muncul otomatis
3. Setelah submit → auto advance ke part berikutnya

### Landscape Optimization

- Screen orientation: **landscape only** (configurasi Capacitor)
- Layout grid 2 kolom untuk DO list
- Tombol minimal size **48×48px** untuk touch targets

---

## 🚧 Troubleshooting

### Build error dengan Tailwind CSS v4

Install plugin PostCSS yang benar:

```bash
npm install @tailwindcss/postcss
```

Dan update `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
```

---

## 📦 Deployment ke HP Android

1. Pastikan **USB Debugging** enabled di HP
2. Colok HP ke PC via USB
3. Di Android Studio:
   - Device → Select physical device
   - Run → Run app
4. Atau langsung dari terminal:
   ```bash
   npx cap run android
   ```

---

## 🔐 Security Notes

- Token Sanctum disimpan di localStorage (encrypted by Capacitor on native builds)
- Rate limiting: 3 attempts/minute per email, 10/minute per IP
- Semua API request pakai Bearer token di header `Authorization`
