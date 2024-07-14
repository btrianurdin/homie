# Homie - Platform Pencarian Kos 

Homie merupakan platform pencarian kos berbasis web. Dibangun khusus untuk membantu Anda menemukan tempat tinggal yang nyaman dan sesuai kebutuhan. Dengan Homie, mencari kos impian jadi lebih cepat, mudah, dan menyenangkan. Uhuy!!

## Fitur & Todo
**Owner**
- [x] Authentication
- [x] Daftar/List Kos
- [x] Tambah Kos
- [x] Edit Kos
- [x] Hapus Kos
- [ ] Terima Transaksi Booking
- [ ] Edit Profile
- [ ] Halaman Review
- [ ] Dashboard Statistik

**User**
- [x] Authentication
- [x] Cari Kos berdasarkan Keyword/Suggestion
- [x] Cari Kos berdasarkan Kota
- [x] Melihat Galeri/Foto Kos
- [x] Melihat Detail Kos
- [ ] Melakukan Transaksi Booking
- [ ] Edit Profile
- [ ] Rating Kos
- [ ] Memberi Review

## How to Running Project
### Setup Environment Variable
You need a Postgres Database, Mapbox API and AWS S3 Key.
```bash
# CONFIG DATABASE
DB_PG_URL=

# CONFIG MAPBOX
NUXT_PUBLIC_MAP_BOX_API=

# CONFIG AWS S3
AWS_S3_BUCKET=
AWS_S3_REGION=
AWS_S3_ACCESS_KEY=
AWS_S3_SECRET_KEY=
```
### Setup Project
```bash
# npm
npm install

# yarn
yarn install
```

### Running Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# yarn
yarn dev
```
## Build Production
```bash
# npm
npm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# yarn
yarn preview
```

## Preview Fitur
| Nama Fitur | Preview |
| ----------- | ----------- |
| Authentication | ![Preview](https://i.ibb.co.com/V25BDWb/image.png) |
| Tambah & Edit Kos | ![Preview](https://i.ibb.co.com/BLyDJT1/image.png) |
| Tambah & Edit Fasilitas | ![Preview](https://i.ibb.co.com/mGxG2zN/image.png) |
| Daftar Kos | ![Preview](https://i.ibb.co.com/hd6fTT8/image.png) |
| Pencarian Kos | ![Preview](https://i.ibb.co.com/gSXWdcD/image.png) |
| Hasil Pencarian Kos | ![Preview](https://i.ibb.co.com/x7yCr8z/image.png) |
| Detail Kos | ![Preview](https://i.ibb.co.com/CHXBR4L/image.png) |
| Detail Kos | ![Preview](https://i.ibb.co.com/CHXBR4L/image.png) |
| Galeri Kos | ![Preview](https://i.ibb.co.com/2hKn9NQ/image.png) |

## Tools & Framework Used
- Nuxt
- NuxtAuth
- NuxtUI
- Tailwindcss
- Mapbox
- Drizzle ORM
- Postgres
- AWS S3

---
[btrianurdin](https://bnurd.com)