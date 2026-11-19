# Air dari Hulu

Storymap interaktif tentang hubungan perubahan tutupan hutan di hulu Daerah Aliran Sungai (DAS) Tamiang dengan banjir besar Aceh Tamiang pada November 2025.

Karya Tim Alue Lhee, Universitas Syiah Kuala, untuk Leuser GeoStory Challenge, Festival Rimba Leuser 2026. Subtema: Mitigasi Bencana Hidrometeorologi.

**Tautan:** https://alfimunadi23.github.io/storymap-leuser/

## Tim

| Peran | Nama |
| --- | --- |
| Ketua | Muhammad Farhan |
| Anggota | Nur Jalal |
| Anggota | Alfi Munadi |

## Ringkasan isi

Storymap disusun dalam delapan bagian yang mengikuti alur hulu ke hilir:

1. Mengenal DAS Tamiang
2. Kondisi fisik hulu
3. Dinamika tutupan hutan 2019–2025
4. Vegetasi dan sempadan sungai
5. Karakteristik curah hujan
6. Distribusi genangan banjir
7. Paparan wilayah hilir
8. Sintesis dan strategi mitigasi hulu–hilir

## Data dan metode

| Data | Sumber |
| --- | --- |
| Batas DAS | Kementerian Lingkungan Hidup dan Kehutanan (KLHK) |
| Batas KEL, tutupan dan kehilangan hutan 2019–2025 | Yayasan HAkA |
| Batas kecamatan dan desa | BIG, Dukcapil |
| Ketinggian dan kemiringan lereng | DEMNAS (BIG) |
| Curah hujan | CHIRPS, NASA GPM IMERG |
| Genangan banjir 28 November 2025 | UNOSAT |
| Data korban, kerusakan, dan lahan pertanian terdampak | Pemerintah Kabupaten Aceh Tamiang |

Seluruh data spasial diolah dengan QGIS. Perhitungan luas memakai sistem koordinat UTM zona 47N (EPSG:32647). Indeks bahaya banjir, zonasi DAS, dan tumpang-susun genangan dengan data desa merupakan hasil analisis tim.

## Struktur berkas

```
index.html      halaman utama
css/gaya.css    tata letak dan gaya tampilan
js/isi.js       narasi, angka, dan konfigurasi peta setiap bagian
js/cerita.js    penyusun halaman, peta interaktif, dan grafik
data/           data spasial (GeoJSON) dan ringkasan angka
peta/           gambar peta sampul
foto/           foto lapangan dan logo
video/          animasi ringkasan
```

## Teknologi

Situs statis tanpa server, ditayangkan melalui GitHub Pages. Peta interaktif memakai Leaflet dengan citra dasar Esri World Imagery. Grafik dibuat dengan SVG.

## Menjalankan secara lokal

Buka folder proyek melalui server lokal, misalnya:

```
python -m http.server 8000
```

lalu akses `http://localhost:8000`.
