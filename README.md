# Template Storymap — Leuser GeoStory Challenge 2026

Template storymap kosong dengan desain "lembar peta". Isi cerita, angka, dan peta
cukup diubah di **satu file: `js/isi.js`**. Kode lain tidak perlu disentuh.

## Struktur folder

```
index.html      halaman utama (jangan diubah)
css/gaya.css    desain (warna dan huruf ada di bagian paling atas)
js/isi.js       ← SEMUA ISI DI SINI: judul, tim, teks, angka, grafik, nama file peta
js/cerita.js    mesin penyusun halaman (jangan diubah)
peta/           taruh peta hasil ekspor QGIS (PNG/JPG) di sini
foto/           taruh foto dan logo di sini
peta-web/       (opsional) hasil ekspor plugin qgis2web
```

## Cara mengisi

1. **Ekspor peta dari QGIS.** Project → New Print Layout → susun peta → Layout →
   Export as Image (PNG, 150–200 dpi untuk web). Simpan dengan nama seperti
   `peta-1.png`, `peta-2.png`, dan seterusnya.
2. **Unggah ke folder `peta/`.** Di GitHub: buka folder `peta` → Add file →
   Upload files → seret file → Commit changes.
3. **Edit `js/isi.js`.** Di GitHub: buka file → ikon pensil (Edit) → ganti teks di
   antara tanda kutip `'...'` → Commit changes. Jangan hapus koma dan kurung.
4. **Tunggu 1–2 menit**, lalu muat ulang website. Peta yang filenya belum ada
   akan tampil sebagai kotak bertuliskan nama file yang perlu ditambahkan.

## Jenis bagian yang tersedia

| Jenis | Fungsi |
| --- | --- |
| `teks` | Judul + paragraf, opsional satu peta di bawahnya |
| `angka` | Deretan angka kunci (luas, persen, jumlah warga) |
| `peta-scroll` | Peta berganti saat pembaca menggulir (inti storymap) |
| `grafik` | Grafik garis atau batang dari angka yang kamu tulis |
| `perbandingan` | Dua peta/citra yang bisa digeser (sebelum vs sesudah) |
| `kutipan` | Ayat, petuah adat, atau kutipan narasumber |
| `kartu` | Rekomendasi per zona, opsional peta zonasi |
| `galeri` | Beberapa foto lapangan |
| `peta-web` | Peta interaktif hasil qgis2web (opsional) |
| `tabel` | Tabel sumber data dan metodologi |

Untuk menambah bagian, salin satu blok `{ jenis: ... },` lalu tempel di urutan
yang diinginkan. Nomor "LEMBAR" di setiap bagian dibuat otomatis.

## Elemen wajib lomba

Nama tim dan anggota, logo HAkA (`foto/logo-haka.png`), nama kegiatan, dan sumber
data sudah punya tempat di `js/isi.js`. Pastikan semuanya diisi.

## Kalau perubahan belum muncul di HP

HP dan browser menyimpan file lama (cache) sampai sekitar 10 menit. Agar langsung
diperbarui setelah mengubah `js/isi.js` atau `css/gaya.css`, buka `index.html` lalu
naikkan angka versinya, misalnya `?v=2` menjadi `?v=3` (ada di 3 baris), lalu commit.
