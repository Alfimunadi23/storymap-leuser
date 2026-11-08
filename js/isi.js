/* =====================================================================
   ISI STORYMAP — cukup file ini yang diubah
   ---------------------------------------------------------------------
   • Ganti tulisan di antara tanda kutip '...'. Tanda kutip, koma, dan
     kurung { } [ ] jangan ikut dihapus.
   • Peta : ekspor dari Layout QGIS (PNG, 150–200 dpi), taruh di folder
            "peta/" dengan nama PERSIS seperti yang tertulis di bawah.
            Selama filenya belum ada, di website muncul kotak bertuliskan
            nama file yang harus kamu taruh.
   • Satu bagian bisa berisi beberapa "blok" (peta, grafik, teks, dst).
   • Jenis blok: 'teks', 'angka', 'peta-scroll', 'peta-tab', 'grafik',
     'perbandingan', 'kutipan', 'kartu', 'galeri', 'tabel', 'peta-web'.
   • 'peta-tab' = peta yang bisa diklik per tahun / per kategori.
       waktu: true  → tombolnya tampil sebagai garis waktu
       putar: true  → ada tombol ▶ Putar untuk memutar otomatis
   • Kata yang diapit *bintang* jadi berwarna, contoh: 'Air dari *Hulu*'.
   • Angka bertanda '…' belum diisi. Ganti dengan hasil olahan kalian.
   ===================================================================== */


  /* ---------- gaya layer peta (dipakai bersama) ---------- */
  var WARNA_SUB = { 1: '#238B45', 2: '#41B6C4', 3: '#FE9929', 4: '#8856A7', 5: '#2B8CBE' };
  var WARNA_ZONA = { 1: '#2E7D32', 2: '#F57C00', 3: '#0288D1' };
  var LAPIS = {
    kel:    { file: 'kel-das.geojson', warna: 'rgba(0,0,0,0)', garis: '#7CFC9A', tebal: 2, isi: 0, putus: '6 5' },
    subdas: { file: 'subdas.geojson', warnaDari: { field: 'KODE_SUB', nilai: WARNA_SUB }, isi: .38, tebal: 1.6,
              popup: { judul: 'NAMA_SUB', sub: 'ZONA', baris: [ ['Luas', 'LUAS_HA', 'ha', 0], ['Porsi DAS', 'PERSEN_DAS', '%'], ['Masih berhutan', 'PERSEN_HTN', '%'], ['Hutan hilang 2019–25', 'TOT_DEF', 'ha', 0], ['Hilang 2025 saja', 'DEF_2025', 'ha', 0], ['Tergenang Nov 2025', 'BANJIR_HA', 'ha', 0] ], catatan: 'DESKRIPSI' } },
    zona:   { file: 'zona.geojson', warnaDari: { field: 'KODE_ZONA', nilai: WARNA_ZONA }, isi: .4, tebal: 1.6,
              popup: { judul: 'NAMA_ZONA', sub: 'ELEVASI', baris: [ ['Luas', 'LUAS_HA', 'ha', 0], ['Porsi DAS', 'PERSEN_DAS', '%'], ['Cakupan', 'CAKUPAN'], ['Hutan hilang 2019–25', 'DEF_TOTAL', 'ha', 0], ['Hilang 2025', 'DEF_2025', 'ha', 0], ['Tergenang Nov 2025', 'BANJIR_HA', 'ha', 0] ], catatan: 'FUNGSI_EKO' } },
    zonaGaris: { file: 'zona.geojson', warnaDari: { field: 'KODE_ZONA', nilai: WARNA_ZONA }, isi: .08, tebal: 2.2,
              popup: { judul: 'NAMA_ZONA', sub: 'ELEVASI', baris: [ ['Luas', 'LUAS_HA', 'ha', 0], ['Porsi DAS', 'PERSEN_DAS', '%'] ], catatan: 'FUNGSI_EKO' } },
    sungai: { file: 'sungai.geojson', tipe: 'garis', warnaDari: { field: 'j', nilai: { 'Sungai': '#5BB8FF', 'Anak Sungai / Alur': '#9fd3ff' } }, tebalDari: { field: 'j', nilai: { 'Sungai': 2.6, 'Anak Sungai / Alur': 1 } },
              tooltip: function (p) { return (p.n || 'Tanpa nama') + ' · ' + p.km + ' km'; } },
    aliran: { file: 'aliran.geojson', tipe: 'garis', urut: 'o', warnaDari: { field: 'o', nilai: { 1: '#BDE3FF', 2: '#4FA8FF', 3: '#0A4FD6' } }, tebalDari: { field: 'o', nilai: { 1: .6, 2: 1.3, 3: 2.6 } },
              tooltip: function (p) { return 'Orde ' + p.o + ' · ' + p.tipe + ' · total ' + p.km.toLocaleString('id-ID') + ' km'; } },
    hutan19: { file: 'hutan-2019.geojson', warna: '#2CA25F', garis: '#1B4D3E', tebal: .4, isi: .75 },
    hutan25: { file: 'hutan-2025.geojson', warna: '#2CA25F', garis: '#1B4D3E', tebal: .4, isi: .75 },
    hutanStatus: { file: 'hutan-status.geojson', warnaDari: { field: 's', nilai: { 'Hutan Tetap (Hingga 2025)': '#238B45', 'Hilang 2020': '#FEE5D9', 'Hilang 2021': '#FCAE91', 'Hilang 2022': '#FB6A4A', 'Hilang 2023': '#DE2D26', 'Hilang 2024': '#A50F15', 'Hilang 2025': '#FFD400' } }, isi: .85, tebal: .3,
              popup: { judul: 's', baris: [ ['Luas di DAS', 'ha', 'ha', 0] ] } },
    hutanZona: { file: 'hutan-zona-2025.geojson', warnaDari: { field: 'KODE_ZONA', nilai: { 1: '#1B5E20', 2: '#43A047', 3: '#A5D6A7' } }, isi: .82, tebal: .4,
              popup: { judul: 'NAMA_ZONA', sub: 'Hutan tersisa 2025', baris: [ ['Luas hutan', 'LUAS_HA', 'ha', 0], ['Porsi zona yang berhutan', 'PCT_ZONA', '%'], ['Porsi seluruh DAS', 'PCT_DAS', '%'] ] } },
    lahan19: { file: 'lahan-2019.geojson', warnaDari: { field: 'kode', nilai: { 1: '#1A5BAB', 2: '#1B7837', 3: '#C28441', 4: '#2F6146', 5: '#FFDB5C', 7: '#ED022A', 8: '#EDD9A3', 11: '#9BBF6A' } }, isi: .85, tebal: 0,
              popup: { judul: 'kelas', sub: 'Tutupan lahan 2019', baris: [ ['Luas kelas ini', 'ha', 'ha', 0] ] } },
    lahan25: { file: 'lahan-2025.geojson', warnaDari: { field: 'kode', nilai: { 1: '#1A5BAB', 2: '#1B7837', 3: '#C28441', 4: '#2F6146', 5: '#FFDB5C', 7: '#ED022A', 8: '#EDD9A3', 11: '#9BBF6A' } }, isi: .85, tebal: 0,
              popup: { judul: 'kelas', sub: 'Tutupan lahan 2025', baris: [ ['Luas kelas ini', 'ha', 'ha', 0] ] } },
    smp19:  { file: 'sempadan-2019.geojson', warnaDari: { field: 'kode', nilai: { 1: '#238B45', 2: '#FA8C16' } }, isi: .8, tebal: .3,
              popup: { judul: 'status', sub: 'Sempadan 100 m, 2019', baris: [ ['Luas', 'ha', 'ha', 0] ] } },
    smp25:  { file: 'sempadan-2025.geojson', warnaDari: { field: 'kode', nilai: { 1: '#238B45', 2: '#FA8C16' } }, isi: .8, tebal: .3,
              popup: { judul: 'status', sub: 'Sempadan 100 m, 2025', baris: [ ['Luas', 'ha', 'ha', 0] ] } },
    smpDef: { file: 'sempadan-def.geojson', urut: 'tahun', warnaDari: { field: 'tahun', nilai: { 2019: '#FED976', 2020: '#FEB24C', 2021: '#FD8D3C', 2022: '#FC4E2A', 2023: '#E31A1C', 2024: '#BD0026', 2025: '#FF1E6E' } }, tebal: 2, isi: .95,
              popup: { judul: function (p) { return 'Hutan sempadan dibuka ' + p.tahun; }, sub: 'sub', baris: [ ['Luas', 'ha', 'ha', 2] ] } },
    genangan: { file: 'genangan.geojson', warna: '#1E90FF', garis: '#0050B3', tebal: .5, isi: .6,
              popup: { judul: 'Genangan banjir UNOSAT', sub: function (p) { return 'Citra ' + p.tgl; }, baris: [], catatan: function () { return 'Air yang terekam satelit saat banjir. Daerah yang airnya sudah surut saat citra diambil tidak ikut terhitung.'; } } },
    bahaya: { file: 'bahaya.geojson', urut: 'kelas', warnaDari: { field: 'kelas', nilai: { 3: '#FFE800', 4: '#EB8D00', 5: '#D7191C' } }, isi: .7, tebal: 0,
              popup: { judul: function (p) { return 'Bahaya banjir: ' + p.tingkat; }, baris: [ ['Luas kelas ini di DAS', 'ha', 'ha', 0] ] } },
    desaJiwa: { file: 'desa.geojson', skala: { field: 'PEN_TERPPR', batas: [1, 100, 300, 600], warna: ['rgba(254,250,224,.15)', '#FEE8C8', '#FDBB84', '#E34A33', '#99000D'] }, garis: '#FEFAE0', tebal: .5, isi: .78,
              popup: { judul: 'DESA', sub: function (p) { return 'Kec. ' + p.KECAMATAN + ', ' + p.KAB_KOTA; }, baris: [ ['Penduduk terpapar', 'PEN_TERPPR', 'jiwa', 0], ['KK terpapar', 'KK_TERPPR', 'KK', 0], ['Wilayah tergenang', 'BANJIR_HA', 'ha'], ['Porsi desa tergenang', 'PCT_BANJIR', '%'], ['Jumlah penduduk', 'JUMLAH_PEN', 'jiwa', 0] ] } },
    desaPersen: { file: 'desa.geojson', skala: { field: 'PCT_BANJIR', batas: [1, 10, 25, 50], warna: ['rgba(254,250,224,.15)', '#DEEBF7', '#9ECAE1', '#3182BD', '#08306B'] }, garis: '#FEFAE0', tebal: .5, isi: .8,
              popup: { judul: 'DESA', sub: function (p) { return 'Kec. ' + p.KECAMATAN + ', ' + p.KAB_KOTA; }, baris: [ ['Porsi desa tergenang', 'PCT_BANJIR', '%'], ['Wilayah tergenang', 'BANJIR_HA', 'ha'], ['Luas desa', 'LUAS_DESA', 'ha'], ['Penduduk terpapar', 'PEN_TERPPR', 'jiwa', 0] ] } },
    jalan:  { file: 'jalan.geojson', tipe: 'garis', warna: '#F4E9C8', tebal: 1.4, opasitas: .8, tooltip: function (p) { return p.n || 'Jalan ' + p.h; } },
    jalanAir: { file: 'jalan-terendam.geojson', tipe: 'garis', warna: '#FF3D7F', tebal: 4,
              popup: { judul: function (p) { return p.n || 'Jalan tanpa nama'; }, sub: function (p) { return 'Kelas jalan: ' + p.h; }, baris: [ ['Panjang terendam', 'km', 'km', 2] ] } },
    genanganTipis: { file: 'genangan.geojson', warna: '#5BB8FF', garis: '#5BB8FF', tebal: 0, isi: .35 }
  };
  var HILIR = [[4.16, 97.86], [4.58, 98.30]];

window.ISI = {

  /* ---------- IDENTITAS (wajib ada untuk lomba) ---------- */
  judul: 'Air dari *Hulu*',
  subjudul: 'Membaca DAS Tamiang dari pegunungan Leuser sampai ke rumah-rumah yang terendam November 2025.',
  kegiatan: 'Leuser GeoStory Challenge | Festival Rimba Leuser 2026',
  subtema: 'Mitigasi Bencana Hidrometeorologi',
  wilayah: 'DAS Tamiang, Aceh',
  tim: {
    nama: '',                              // isi nama tim kalau ada
    ketua: 'Muhammad Farhan',
    anggota: ['Nur Jalal', 'Alfi Munadi'],
    instansi: 'Universitas Syiah Kuala'
  },
  logoKiri:  [ { file: 'foto/logo-haka.png', nama: 'Logo Yayasan HAkA' } ],
  logoKanan: [ { file: 'foto/logo-usk.png', nama: 'Logo Universitas Syiah Kuala', bentuk: 'polos' },
               { file: 'foto/logo-cru.png', nama: 'Logo CRU Aceh', bentuk: 'persegi' } ],
  sampul: {
    gambar: 'peta/00-sampul.png',        // peta paling kuat atau foto banjir
    keterangan: 'Keterangan gambar sampul. Sumber: ...'
  },

  /* ---------- ISI CERITA ----------
     Urutan mengikuti struktur storymap tim: 8 bagian utama.
     Warna latar: olive (#606C38) di semua bagian.          */
  bagian: [

    /* ===== PEMBUKA (tanpa nomor) ===== */
    { label: 'Pembuka', tanpaNomor: true,
      judul: 'Akhir November 2025, air datang membawa *lumpur dan kayu*',
      blok: [
        { jenis: 'teks', paragraf: [
          'Hujan turun berhari-hari di pegunungan. Pada 26 November 2025, Sungai Tamiang meluap dan menyapu Kuala Simpang, Karang Baru, sampai pesisir Bendahara dan Seruway. Warga menyebutnya tsunami bandang: air setinggi atap, lumpur tebal, dan ribuan batang kayu gelondongan yang menumpuk di halaman rumah, sekolah, dan pesantren.',
          'Lebih dari 300 ribu warga Aceh Tamiang terdampak. Sebagian bertahan berhari-hari di atap rumah, dan ribuan rumah hilang tersapu.',
          'Tapi ini bukan pertama kalinya Tamiang kebanjiran. Jadi pertanyaannya: kenapa kali ini jauh lebih parah, dan apa yang terjadi di hulu sebelum air sampai ke hilir?'
        ]},
        { jenis: 'angka', isi: [
          { nilai: '300.000', satuan: 'jiwa', keterangan: 'Lebih dari sekian warga Aceh Tamiang terdampak', sumber: 'Pratama dkk., Jurnal Ibnu Sina (2026)' },
          { nilai: '80',      satuan: 'jiwa', keterangan: 'Lebih dari sekian warga Aceh Tamiang meninggal (BNPB, 17 Des 2025)', sumber: 'BNPB via Investortrust' },
          { nilai: '4.839',   satuan: 'rumah', keterangan: 'Rumah hilang tersapu banjir', sumber: 'Kompas.com, 30 Des 2025' },
          { nilai: '494.988', satuan: 'ha',    keterangan: 'Luas DAS Tamiang', sumber: 'Data dasar panitia (HAkA)' }
        ]},
        { jenis: 'riwayat',
          subjudul: 'Tamiang dan banjir: bukan cerita baru',
          isi: [
            { tahun: '2006', judul: 'Banjir bandang menjelang akhir tahun', teks: 'Setelah sepekan hujan deras, banjir bandang melanda Aceh Tamiang sekitar 24 Desember 2006. Sedikitnya 60 jenazah ditemukan di Aceh Tamiang, dan lebih dari 110 ribu orang di Aceh terpaksa mengungsi. Dalam catatan 2003–2018, inilah banjir paling parah di DAS Tamiang.', sumber: 'Dawn/AFP, 25 Des 2006; Azizah (2020)' },
            { tahun: '2003–18', judul: '37 kali banjir dalam 16 tahun', teks: 'Data BNPB mencatat 37 kejadian banjir di DAS Tamiang. Hampir tiap tahun ada banjir, paling sering di bulan Oktober dan Desember. Tahun 2012 dan 2018 jadi tahun dengan kejadian terbanyak.', sumber: 'Azizah, disertasi DAS Tamiang (2020), via Kompas.com' },
            { tahun: '2022', judul: 'Banjir luapan besar', teks: 'Sungai Tamiang kembali meluap dan merendam permukiman di bantaran, termasuk Kuala Simpang.', sumber: 'Repositori Universitas Malikussaleh' },
            { tahun: '2025', judul: 'Banjir bandang terbesar', sorot: true, teks: 'Akhir November 2025, banjir dan longsor melanda Aceh, Sumatera Utara, dan Sumatera Barat. Aceh Tamiang jadi salah satu daerah paling parah. Data hutan menunjukkan, hanya pada November–Desember 2025, KEL kehilangan 21.244 ha hutan.', sumber: 'BNPB; Kehilangan Tutupan Hutan KEL 2025 (HAkA)' }
          ]
        }
      ]
    },

    /* ===== 1. MENGENAL DAS TAMIANG ===== */
    { label: 'Mengenal DAS',
      judul: 'Kenalan dulu dengan *DAS Tamiang*',
      pengantar: 'Gulir pelan-pelan, petanya ikut berganti.',
      blok: [
        { jenis: 'peta-web',
          subjudul: 'Peta DAS Tamiang: klik tabnya, klik petanya',
          lapis: LAPIS,
          petunjuk: 'Geser dan perbesar peta. Klik wilayah berwarna untuk melihat angkanya. Garis merah = batas DAS Tamiang.',
          tab: [
            { label: 'Letak', besar: 'DAS Tamiang', judul: 'DAS130029 · Manyak Payed/Tamiang', lapis: ['kel', 'sungai'],
              angka: [ { keterangan: 'Luas DAS', nilai: '562.251', satuan: 'ha' }, { keterangan: 'Masuk Kawasan Ekosistem Leuser', nilai: '70', satuan: '%' }, { keterangan: 'Kabupaten/kota yang dilalui', nilai: '6', satuan: '' } ],
              legenda: [ { warna: '#DC143C', label: 'Batas DAS Tamiang', garis: true }, { warna: '#7CFC9A', label: 'Batas KEL di dalam DAS', garis: true }, { warna: '#5BB8FF', label: 'Sungai', garis: true } ],
              teks: 'Hulunya di pegunungan Leuser (Gayo Lues, Aceh Tenggara, Aceh Tengah). Airnya turun lewat Simpang Kiri dan Simpang Kanan, bertemu jadi Sungai Tamiang, lalu bermuara di Selat Malaka.' },
            { label: 'Hulu–tengah–hilir', besar: '3 zona', lapis: ['zona'], fit: 'das',
              angka: [ { keterangan: 'Hulu, >500–2.500 mdpl', nilai: '48,9', satuan: '%' }, { keterangan: 'Tengah, 50–500 mdpl', nilai: '31,1', satuan: '%' }, { keterangan: 'Hilir, <50 mdpl', nilai: '20,1', satuan: '%' } ],
              legenda: [ { warna: '#2E7D32', label: 'Hulu (Ekosistem Leuser)' }, { warna: '#F57C00', label: 'Tengah (transisi)' }, { warna: '#0288D1', label: 'Hilir (dataran banjir)' } ],
              teks: 'Hampir separuh DAS adalah hulu. Tapi 92% genangan November 2025 justru ada di zona hilir, tempat orang paling banyak tinggal.' },
            { label: 'Lima sub-DAS', besar: '5 sub-DAS', lapis: ['subdas'], fit: 'das',
              legenda: [ { warna: '#238B45', label: 'Simpang Kiri Hulu · 48,9%' }, { warna: '#41B6C4', label: 'Simpang Kiri Hilir · 19,6%' }, { warna: '#FE9929', label: 'Simpang Kanan · 6,0%' }, { warna: '#8856A7', label: 'Tenggulun · 5,4%' }, { warna: '#2B8CBE', label: 'Cempegih / Tamiang Hilir · 20,1%' } ],
              teks: 'Simpang Kiri Hulu masih 89% berhutan, tapi kehilangan 6.777 ha hanya di 2025. Cempegih di hilir tinggal 3% berhutan dan menampung 9.283 ha genangan.' }
          ],
          sumber: 'Sumber: batas DAS KLHK; batas KEL; zona & sub-DAS olahan tim; sungai OpenStreetMap; Citra Esri.'
        }
      ]
    },

    /* ===== 2. KONDISI FISIK HULU ===== */
    { label: 'Kondisi fisik',
      judul: 'Seperti apa *bentuk* hulunya',
      pengantar: 'Klik tiap tab untuk melihat petanya.',
      blok: [
        { jenis: 'peta-web',
          subjudul: 'Relief, aliran, dan sungai',
          dasar: 'relief',
          lapis: LAPIS,
          petunjuk: 'Ganti peta dasar (Citra / Relief / Topografi) di pojok peta untuk melihat bentuk lahannya.',
          tab: [
            { label: 'Ketinggian', besar: '0–2.500 mdpl', lapis: ['zonaGaris'],
              angka: [ { keterangan: 'Zona hulu', nilai: '>500–2.500', satuan: 'mdpl' }, { keterangan: 'Zona tengah', nilai: '50–500', satuan: 'mdpl' }, { keterangan: 'Zona hilir', nilai: '<50', satuan: 'mdpl' } ],
              legenda: [ { warna: '#2E7D32', label: 'Hulu', garis: true }, { warna: '#F57C00', label: 'Tengah', garis: true }, { warna: '#0288D1', label: 'Hilir', garis: true } ],
              teks: 'Lihat bayangan reliefnya: punggung pegunungan di barat daya, lalu melandai sampai pesisir Selat Malaka. Air yang jatuh di ketinggian 2.500 m turun cepat ke dataran yang hampir datar.' },
            { label: 'Jaringan aliran', besar: '4.989 alur', lapis: ['aliran'],
              angka: [ { keterangan: 'Alur hulu (orde 1)', nilai: '2.322', satuan: 'km' }, { keterangan: 'Anak sungai (orde 2)', nilai: '2.278', satuan: 'km' }, { keterangan: 'Aliran utama (orde 3)', nilai: '1.366', satuan: 'km' } ],
              legenda: [ { warna: '#0A4FD6', label: 'Aliran utama', garis: true }, { warna: '#4FA8FF', label: 'Anak sungai', garis: true }, { warna: '#BDE3FF', label: 'Alur hulu', garis: true } ],
              teks: 'Dihitung dari DEMNAS. Hulu penuh alur kecil seperti akar. Semua airnya berkumpul ke satu jalur di hilir.' },
            { label: 'Sungai bernama', besar: '2.606 km', lapis: ['sungai'], dasar: 'citra',
              angka: [ { keterangan: 'Sungai Simpang Kiri', nilai: '99', satuan: 'km' }, { keterangan: 'Sungai Simpang Kanan', nilai: '58', satuan: 'km' }, { keterangan: 'Sungai Tamiang', nilai: '56', satuan: 'km' } ],
              legenda: [ { warna: '#5BB8FF', label: 'Sungai (74 ruas, 753 km)', garis: true }, { warna: '#9fd3ff', label: 'Anak sungai / alur (297 ruas, 1.852 km)', garis: true } ],
              teks: 'Arahkan kursor ke garis sungai untuk melihat namanya.' }
          ],
          sumber: 'Sumber: aliran turunan DEMNAS (olahan tim); sungai OpenStreetMap; relief Esri; topografi OpenTopoMap.'
        }
      ]
    },

    /* ===== 3. DINAMIKA TUTUPAN HUTAN ===== */
    { label: 'Tutupan hutan',
      judul: 'Hutannya *berkurang* dari tahun ke tahun',
      pengantar: 'Tiga cara melihat perubahan hutan di DAS Tamiang.',
      blok: [
        { jenis: 'peta-web',
          subjudul: 'Geser garisnya: hutan *2019* dibanding *2025*',
          lapis: LAPIS,
          tab: [
            { label: 'Geser 2019 ↔ 2025', besar: '−11.358 ha', geser: { kiri: ['hutan19'], kanan: ['hutan25'], labelKiri: 'Hutan 2019', labelKanan: 'Hutan 2025' },
              angka: [ { keterangan: 'Hutan 2019', nilai: '319.739', satuan: 'ha' }, { keterangan: 'Hutan 2025', nilai: '308.381', satuan: 'ha' }, { keterangan: 'Porsi DAS berhutan', nilai: '56,9 → 54,9', satuan: '%' } ],
              legenda: [ { warna: '#2CA25F', label: 'Tutupan hutan KEL di DAS' } ],
              petunjuk: 'Tarik bulatan putih ke kiri-kanan. Sisi kiri 2019, sisi kanan 2025.',
              teks: 'Dari 2019 ke 2024 hutan berkurang pelan, sekitar 3.000 ha. Lalu tahun 2025 saja hilang 8.358 ha.' },
            { label: 'Kapan hilangnya', besar: '2020–2025', lapis: ['hutanStatus'],
              legenda: [ { warna: '#238B45', label: 'Hutan tetap sampai 2025' }, { warna: '#FEE5D9', label: 'Hilang 2020 · 1.340 ha' }, { warna: '#FCAE91', label: 'Hilang 2021 · 786 ha' }, { warna: '#FB6A4A', label: 'Hilang 2022 · 303 ha' }, { warna: '#DE2D26', label: 'Hilang 2023 · 229 ha' }, { warna: '#A50F15', label: 'Hilang 2024 · 341 ha' }, { warna: '#FFD400', label: 'Hilang 2025 · 8.358 ha' } ],
              teks: 'Perbesar ke bagian kuning: itu hutan yang hilang di 2025, kebanyakan di punggung hulu.' },
            { label: 'Sisa hutan per zona', besar: '2025', lapis: ['hutanZona', 'zonaGaris'],
              angka: [ { keterangan: 'Zona hulu masih berhutan', nilai: '86,5', satuan: '%' }, { keterangan: 'Zona tengah', nilai: '39,2', satuan: '%' }, { keterangan: 'Zona hilir', nilai: '2,0', satuan: '%' } ],
              legenda: [ { warna: '#1B5E20', label: 'Hutan zona hulu' }, { warna: '#43A047', label: 'Hutan zona tengah' }, { warna: '#A5D6A7', label: 'Hutan zona hilir' } ],
              teks: 'Hilir hampir tidak punya hutan lagi. Satu-satunya penahan air yang tersisa ada di hulu.' },
            { label: 'Tutupan lahan', besar: '2019 ↔ 2025', geser: { kiri: ['lahan19'], kanan: ['lahan25'], labelKiri: 'Lahan 2019', labelKanan: 'Lahan 2025' },
              legenda: [ { warna: '#1B7837', label: 'Hutan alami Leuser' }, { warna: '#C28441', label: 'Kebun sawit' }, { warna: '#FFDB5C', label: 'Pertanian semusim' }, { warna: '#9BBF6A', label: 'Semak belukar' }, { warna: '#EDD9A3', label: 'Lahan terbuka' }, { warna: '#ED022A', label: 'Permukiman' }, { warna: '#2F6146', label: 'Rawa' }, { warna: '#1A5BAB', label: 'Badan air' } ],
              petunjuk: 'Tarik garis putih. Klik warna untuk melihat luas kelasnya.' }
          ],
          sumber: 'Sumber: Tutupan Hutan KEL 2019–2025 (HAkA); tutupan lahan vektor olahan tim; batas DAS KLHK.'
        },
        { jenis: 'peta-interaktif',
          subjudul: 'Klik tahunnya: di mana hutan hilang',
          paragraf: [ 'Peta ini bisa digeser dan diperbesar. Klik tahun untuk berganti data, lalu klik kecamatan mana saja untuk melihat angkanya per tahun.' ],
          folder: 'data/',
          tahun: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
          sorotKab: 'Aceh Tamiang', das: true,
          legenda: [ { warna: '#DDA15E', label: 'Hutan hilang' }, { warna: '#BC6C25', label: 'Hilang Nov–Des 2025 (saat bencana)' }, { warna: 'rgba(221,161,94,.35)', label: 'Warna kecamatan: makin pekat, makin banyak hilang' }, { warna: '#DC143C', label: 'Garis merah: batas DAS Tamiang' } ],
          sumber: 'Sumber: Kehilangan Tutupan Hutan KEL (HAkA, data dasar panitia); batas kecamatan BIG 2025; olahan tim.'
        },
        { jenis: 'grafik',
          subjudul: 'Kalau dijadikan grafik',
          tipe: 'batang', satuan: 'ha', sorot: '2025',
          data: [ ['2019', 1060], ['2020', 1340], ['2021', 785], ['2022', 302], ['2023', 229], ['2024', 340], ['2025', 8352] ],
          catatan: 'Hutan hilang di dalam batas DAS Tamiang (ha).',
          sumber: 'Sumber: Kehilangan Tutupan Hutan KEL (HAkA), dipotong batas DAS, olahan tim'
        },
        { jenis: 'teks',
          subjudul: 'Hutan hilang di *lereng* mana',
          paragraf: [
            'Luas saja belum cukup. Yang lebih penting: hutannya hilang di tanah yang seperti apa. Kami bagi lereng DAS Tamiang jadi tiga kelas, lalu kami tumpuk dengan peta kehilangan hutan tiap tahun.',
            'Landai (di bawah 25%) itu dataran dan kaki bukit. Curam (25–40%) mulai rawan erosi. Sangat curam (di atas 40%, lebih dari 21,8°) adalah lereng yang kalau hutannya hilang, tanahnya gampang longsor dan ikut hanyut ke sungai.'
          ]
        },
        { jenis: 'peta-lereng',
          subjudul: 'Klik tahunnya: hutan hilang per kelas lereng di DAS Tamiang',
          folder: 'data/',
          tahun: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
          sorotKab: 'Aceh Tamiang',
          sumber: 'Sumber: Kehilangan Tutupan Hutan KEL (HAkA) ditumpang-susun dengan kelas lereng dari DEMNAS (BIG), olahan tim (Deforestasi_Lereng_Kritis 2019–2025). Garis merah: batas DAS Tamiang (KLHK, DAS130029); area gelap di luar DAS. Tombol Kab. Aceh Tamiang saja memotong data ke batas kabupaten.'
        },
        { jenis: 'angka',
          isi: [
            { nilai: '8.352', satuan: 'ha', keterangan: 'Hutan hilang di lereng DAS Tamiang tahun 2025, dua kali lipat total enam tahun sebelumnya (4.057 ha)', sumber: 'Olahan tim' },
            { nilai: '52', satuan: '%', keterangan: 'Porsi lereng sangat curam pada 2025 (4.339 ha). Tahun 2019–2024 hanya 11–24%', sumber: 'Olahan tim' },
            { nilai: '604', satuan: 'ha', keterangan: 'Bagiannya di Kab. Aceh Tamiang, 11 kali lipat tahun 2024 (55 ha)', sumber: 'Olahan tim' },
            { nilai: '3.270', satuan: 'ha', keterangan: 'Kec. Pining (Gayo Lues), hulu terparah, 61% di lereng sangat curam', sumber: 'Olahan tim' }
          ]
        },
        { jenis: 'teks',
          subjudul: 'Apa yang *berubah* di 2025',
          paragraf: [
            '**2019–2024: hilangnya di dataran.** Selama enam tahun, sekitar enam dari sepuluh hektare hutan yang hilang ada di lereng landai. Pusatnya di Birem Bayeun (Aceh Timur) dan Sekerak (Aceh Tamiang), pola yang cocok dengan pembukaan lahan untuk kebun di kaki bukit. Jumlahnya juga terus turun, dari 1.340 ha di 2020 sampai sekitar 230–340 ha di 2023–2024.',
            '**2025: polanya terbalik.** Luasnya melonjak jadi 8.352 ha dan pindah ke atas. Lereng sangat curam menyumbang lebih dari separuh (4.339 ha), ditambah 2.208 ha lereng curam. Artinya hampir 8 dari 10 hektare yang hilang ada di lereng yang rawan longsor dan erosi.',
            '**Titik panasnya di hulu.** Pining (Gayo Lues) dan Serbajadi (Aceh Timur) mendominasi, dua kecamatan di punggung pegunungan tempat anak-anak Sungai Tamiang bermula. Dari sinilah air dan lumpur turun ke Kuala Simpang dan Karang Baru di hilir.',
            '**Di Aceh Tamiang sendiri.** Selama 2019–2024, hutan yang hilang di lereng Aceh Tamiang kebanyakan di Sekerak dan Bandar Pusaka, sebagian besar di lereng landai. Tahun 2025 pusatnya pindah ke Tamiang Hulu dan Tenggulun, dua kecamatan paling hulu di kabupaten ini. Di Tenggulun, dua pertiga yang hilang (67%) ada di lereng sangat curam.',
            '**Satu catatan penting.** Data kehilangan hutan mencatat semua tajuk yang hilang, termasuk yang tersapu longsor saat hujan ekstrem akhir November. Jadi sebagian angka 2025 di lereng sangat curam bisa jadi *akibat* bencana, bukan hanya penyebabnya. Coba bandingkan di peta bagian sebelumnya: warna cokelat tua menandai hutan yang hilang tepat pada November–Desember 2025.',
            'Apa pun urutannya, pesannya sama: lereng sangat curam di hulu adalah bagian DAS yang paling tidak boleh kehilangan hutan. Begitu tutupannya terbuka, tanah tidak lagi ditahan akar, dan hujan berikutnya punya jalan yang lebih cepat menuju hilir.'
          ]
        }
      ]
    },

    /* ===== 4. VEGETASI DAN SEMPADAN SUNGAI ===== */
    { label: 'Sempadan sungai',
      judul: 'Bagaimana kondisi *pinggir sungainya*',
      pengantar: 'Sempadan sungai (100 meter dari tepi) adalah benteng terakhir sebelum air dan tanah masuk ke sungai.',
      blok: [
        { jenis: 'peta-web',
          subjudul: 'Sempadan 100 m di kiri-kanan sungai',
          lapis: LAPIS,
          tab: [
            { label: 'Kondisi 2025', besar: '48%', judul: 'sempadan sudah terbuka', lapis: ['smp25'],
              angka: [ { keterangan: 'Masih berhutan', nilai: '25.782', satuan: 'ha' }, { keterangan: 'Rusak / non-hutan', nilai: '24.247', satuan: 'ha' } ],
              legenda: [ { warna: '#238B45', label: 'Berhutan alami (terjaga)' }, { warna: '#FA8C16', label: 'Rusak / non-hutan (kritis)' } ],
              teks: 'Perbesar ke hilir: hampir seluruh tepi sungai sudah jadi kebun dan permukiman.' },
            { label: 'Geser 2019 ↔ 2025', besar: '+1.744 ha', judul: 'sempadan rusak bertambah', geser: { kiri: ['smp19'], kanan: ['smp25'], labelKiri: 'Sempadan 2019', labelKanan: 'Sempadan 2025' },
              angka: [ { keterangan: 'Rusak 2019', nilai: '22.503', satuan: 'ha' }, { keterangan: 'Rusak 2025', nilai: '24.247', satuan: 'ha' } ],
              legenda: [ { warna: '#238B45', label: 'Berhutan' }, { warna: '#FA8C16', label: 'Rusak / non-hutan' } ],
              petunjuk: 'Tarik bulatan putih untuk membandingkan.' },
            { label: 'Dibuka per tahun', besar: '1.744 ha', judul: 'hutan sempadan dibuka 2019–2025', lapis: ['smpDef'],
              angka: [ { keterangan: '2019–2024 (enam tahun)', nilai: '475', satuan: 'ha' }, { keterangan: '2025 saja', nilai: '1.268', satuan: 'ha' } ],
              legenda: [ { warna: '#FED976', label: '2019' }, { warna: '#FD8D3C', label: '2021' }, { warna: '#E31A1C', label: '2023' }, { warna: '#BD0026', label: '2024' }, { warna: '#FF1E6E', label: '2025' } ],
              teks: '84% hutan sempadan yang dibuka di 2025 ada di Sub-DAS Simpang Kiri Hulu (1.063 ha). Itu hulu sungai utamanya.' }
          ],
          sumber: 'Sumber: sempadan sungai 100 m (OSM) ditumpang-susun dengan tutupan hutan KEL, olahan tim.'
        },
        { jenis: 'grafik',
          subjudul: 'Hutan sempadan yang dibuka tiap tahun',
          tipe: 'batang', satuan: 'ha', sorot: '2025',
          data: [ ['2019', 106], ['2020', 158], ['2021', 92], ['2022', 40], ['2023', 30], ['2024', 49], ['2025', 1268] ],
          sumber: 'Sumber: Deforestasi Sempadan Sungai 2019–2025, olahan tim'
        },
        { jenis: 'teks',
          paragraf: [
            'Kalau dilihat per sub-DAS, bedanya jelas. Di Simpang Kiri Hulu baru 21% sempadan yang rusak. Di Tenggulun 74%, Simpang Kanan 96%, dan Cempegih (Tamiang Hilir) 97%.',
            'Artinya, di hilir sungai hampir tidak punya penyangga lagi. Tebing gampang longsor, air cepat meluap ke kebun dan rumah.'
          ]
        }
      ]
    },

    /* ===== 5. KARAKTERISTIK CURAH HUJAN ===== */
    { label: 'Curah hujan',
      judul: 'Hujannya memang *ekstrem*',
      pengantar: 'Hilangnya hutan memperparah, tapi pemicunya tetap hujan. Bagian ini membuat analisisnya adil.',
      blok: [
        { jenis: 'grafik',
          subjudul: 'Curah hujan tahunan (CHIRPS)',
          tipe: 'batang', satuan: 'mm', sorot: '2025',
          data: [ ['2018', 0], ['2019', 0], ['2020', 0], ['2021', 0], ['2022', 0], ['2023', 0], ['2024', 0], ['2025', 0] ],
          catatan: 'Isi dengan rata-rata curah hujan tahunan DAS dari raster CHIRPS.',
          sumber: 'Sumber: CHIRPS'
        },
        { jenis: 'grafik',
          subjudul: 'Hujan harian sekitar kejadian (IMERG)',
          tipe: 'garis', satuan: 'mm', sorot: '26 Nov',
          data: [ ['20 Nov', 0], ['21 Nov', 0], ['22 Nov', 0], ['23 Nov', 0], ['24 Nov', 0], ['25 Nov', 0], ['26 Nov', 0], ['27 Nov', 0], ['28 Nov', 0] ],
          catatan: 'Isi dengan hujan harian rata-rata DAS dari IMERG.',
          sumber: 'Sumber: NASA GPM IMERG'
        },
        { jenis: 'teks',
          subjudul: 'Akumulasi hujan tiga hari, 24–26 November 2025',
          paragraf: [ 'Jelaskan di sub-DAS mana hujan paling deras turun, dan berapa milimeter totalnya.' ],
          gambar: { file: 'peta/05-imerg-3hari.png', keterangan: 'Akumulasi hujan 24–26 November 2025. Sumber: IMERG, olahan tim.' }
        }
      ]
    },

    /* ===== 6. DISTRIBUSI GENANGAN BANJIR ===== */
    { label: 'Genangan',
      judul: 'Ke mana *airnya* pergi',
      blok: [
        { jenis: 'peta-web',
          subjudul: 'Genangan 28 November 2025 dan peta bahaya banjir',
          lapis: LAPIS,
          tab: [
            { label: 'Genangan', besar: '10.035 ha', judul: 'tergenang di dalam DAS', lapis: ['genangan', 'zonaGaris'],
              angka: [ { keterangan: 'Di zona hilir', nilai: '9.217', satuan: 'ha' }, { keterangan: 'Di zona tengah', nilai: '818', satuan: 'ha' }, { keterangan: 'Di zona hulu', nilai: '0', satuan: 'ha' } ],
              legenda: [ { warna: '#1E90FF', label: 'Genangan terekam satelit (UNOSAT)' }, { warna: '#0288D1', label: 'Batas zona hilir', garis: true } ],
              teks: 'Hujannya di hulu, airnya ke hilir. 92% genangan ada di dataran hilir sekitar Kuala Simpang, Karang Baru, dan Manyak Payed.' },
            { label: 'Indeks bahaya', besar: '69.884 ha', judul: 'bahaya tinggi & sangat tinggi', lapis: ['bahaya'],
              angka: [ { keterangan: 'Sangat tinggi', nilai: '11.098', satuan: 'ha' }, { keterangan: 'Tinggi', nilai: '58.786', satuan: 'ha' }, { keterangan: 'Sedang', nilai: '76.846', satuan: 'ha' } ],
              legenda: [ { warna: '#D7191C', label: 'Sangat tinggi' }, { warna: '#EB8D00', label: 'Tinggi' }, { warna: '#FFE800', label: 'Sedang' } ],
              teks: 'Peta indeks bahaya banjir olahan tim. Kelas rendah dan sangat rendah tidak ditampilkan supaya peta tetap ringan.' },
            { label: 'Bahaya vs kejadian', besar: '±85%', judul: 'genangan jatuh di kelas bahaya tinggi–sangat tinggi', lapis: ['bahaya', 'genangan'], fit: HILIR,
              legenda: [ { warna: '#D7191C', label: 'Bahaya sangat tinggi' }, { warna: '#EB8D00', label: 'Bahaya tinggi' }, { warna: '#1E90FF', label: 'Genangan 28 Nov 2025' } ],
              angka: [ { keterangan: 'Di kelas tinggi', nilai: '±69', satuan: '%' }, { keterangan: 'Di kelas sangat tinggi', nilai: '±16', satuan: '%' }, { keterangan: 'Di kelas sedang', nilai: '±17', satuan: '%' } ],
              teks: 'Sebagian besar genangan nyata jatuh di wilayah yang memang dinilai berbahaya. Artinya peta bahaya ini bisa dipakai untuk siaga di banjir berikutnya. (Angka dari tumpang-susun peta yang sudah disederhanakan, jadi dibulatkan.)' }
          ],
          sumber: 'Sumber: UNOSAT (FL20251126IDN, citra 28 Nov 2025); indeks bahaya banjir olahan tim; zona DAS olahan tim.'
        },
        { jenis: 'angka', isi: [
          { nilai: '10.035', satuan: 'ha', keterangan: 'Genangan di dalam DAS Tamiang', sumber: 'UNOSAT, olahan tim' },
          { nilai: '92', satuan: '%',  keterangan: 'Genangan berada di zona hilir', sumber: 'Olahan tim' },
          { nilai: '11,3', satuan: 'km', keterangan: 'Jalan yang terendam, termasuk Jalan Raya Medan–Banda Aceh', sumber: 'OSM + UNOSAT' }
        ]}
      ]
    },

    /* ===== 7. PAPARAN WILAYAH HILIR ===== */
    { label: 'Paparan hilir',
      judul: 'Siapa dan apa yang *terkena*',
      pengantar: 'Klik tabnya, lalu klik desanya.',
      blok: [
        { jenis: 'peta-web',
          subjudul: 'Desa dan jalan yang kena banjir',
          lapis: LAPIS,
          awal: HILIR,
          tab: [
            { label: 'Penduduk terpapar', besar: '34.956', judul: 'jiwa di 219 desa', lapis: ['desaJiwa'],
              angka: [ { keterangan: 'Kepala keluarga', nilai: '9.763', satuan: 'KK' }, { keterangan: 'Kecamatan', nilai: '20', satuan: '' }, { keterangan: 'Terbanyak: Kec. Manyak Payed', nilai: '9.130', satuan: 'jiwa' } ],
              legenda: [ { warna: '#99000D', label: '600 jiwa ke atas' }, { warna: '#E34A33', label: '300–599' }, { warna: '#FDBB84', label: '100–299' }, { warna: '#FEE8C8', label: '1–99' } ],
              teks: 'Desa paling banyak terpapar: Sampaimah (1.110 jiwa), Telaga Meuku Dua (896), Suka Jadi (812), dan Pahlawan (787).',
              petunjuk: 'Klik desa untuk melihat jumlah penduduk, KK, dan luas yang tergenang.' },
            { label: 'Porsi desa tergenang', besar: '10 desa', judul: 'lebih dari separuh wilayahnya terendam', lapis: ['desaPersen'],
              legenda: [ { warna: '#08306B', label: '50% ke atas' }, { warna: '#3182BD', label: '25–49%' }, { warna: '#9ECAE1', label: '10–24%' }, { warna: '#DEEBF7', label: '1–9%' } ],
              teks: 'Paling parah sampai 75% wilayah desa. Rata-rata desa terdampak kehilangan 14% wilayahnya ke air.' },
            { label: 'Jalan terendam', besar: '11,3 km', judul: 'jalan terendam (59 ruas)', lapis: ['genanganTipis', 'jalan', 'jalanAir'],
              legenda: [ { warna: '#FF3D7F', label: 'Jalan terendam', garis: true }, { warna: '#F4E9C8', label: 'Jalan utama', garis: true }, { warna: '#5BB8FF', label: 'Genangan' } ],
              teks: 'Termasuk 220 m Jalan Raya Medan–Banda Aceh, jalur utama Sumatra. Kalau jalan ini putus, bantuan dan evakuasi ikut tertahan.' }
          ],
          sumber: 'Sumber: genangan UNOSAT; batas & penduduk desa Dukcapil; jalan OpenStreetMap; olahan tim.'
        },
        { jenis: 'galeri',
          paragraf: [ 'Kalau ada, tambahkan foto lapangan. Foto sendiri lebih kuat.' ],
          foto: [
            { file: 'foto/foto-1.jpg', keterangan: 'Keterangan foto. Sumber: ...' },
            { file: 'foto/foto-2.jpg', keterangan: 'Keterangan foto. Sumber: ...' },
            { file: 'foto/foto-3.jpg', keterangan: 'Keterangan foto. Sumber: ...' }
          ]
        }
      ]
    },

    /* ===== 8. SINTESIS DAN REKOMENDASI ===== */
    { label: 'Sintesis',
      judul: 'Kalau semuanya *disatukan*',
      blok: [
        { jenis: 'teks',
          paragraf: [
            'Rangkai temuannya: hutan hulu yang hilang di lereng curam, sempadan yang rusak, hujan ekstrem, lalu genangan di hilir.',
            'Tulis sebagai keterkaitan yang didukung data, bukan klaim satu penyebab.'
          ],
        },
        { jenis: 'peta-web',
          subjudul: 'Satu peta, hulu sampai hilir',
          lapis: LAPIS,
          tab: [
            { label: 'Hulu', besar: '8.358 ha', judul: 'hutan hilang 2025', lapis: ['zonaGaris', 'hutanStatus'],
              teks: 'Hutan di punggung hulu hilang, sebagian besar di lereng sangat curam.',
              legenda: [ { warna: '#FFD400', label: 'Hutan hilang 2025' }, { warna: '#238B45', label: 'Hutan tersisa' } ] },
            { label: 'Sungai', besar: '1.268 ha', judul: 'hutan sempadan dibuka 2025', lapis: ['zonaGaris', 'smpDef', 'sungai'],
              teks: 'Penyangga di tepi sungai ikut terbuka, terutama di Simpang Kiri Hulu.',
              legenda: [ { warna: '#FF1E6E', label: 'Sempadan dibuka' }, { warna: '#5BB8FF', label: 'Sungai', garis: true } ] },
            { label: 'Hilir', besar: '34.956', judul: 'jiwa terpapar genangan', lapis: ['desaJiwa', 'genangan'], fit: HILIR,
              teks: 'Air dan lumpur berkumpul di dataran hilir, tempat permukiman paling padat.',
              legenda: [ { warna: '#1E90FF', label: 'Genangan' }, { warna: '#E34A33', label: 'Desa terpapar' } ] },
            { label: 'Semuanya', besar: 'Satu DAS', lapis: ['zonaGaris', 'hutanStatus', 'smpDef', 'genangan'], fit: 'das',
              teks: 'Hutan hilang di hulu, sempadan terbuka di tengah, genangan di hilir. Semuanya dalam satu garis merah yang sama.',
              legenda: [ { warna: '#FFD400', label: 'Hutan hilang 2025' }, { warna: '#FF1E6E', label: 'Sempadan dibuka' }, { warna: '#1E90FF', label: 'Genangan' } ] }
          ],
          sumber: 'Sumber: gabungan seluruh data di atas, olahan tim.'
        },
        { jenis: 'kutipan',
          teks: 'Tulis ayat, petuah adat, atau omongan warga yang paling mengena.',
          sumber: 'Dari siapa atau dari mana',
          paragraf: [ 'Kaitkan dengan menjaga keseimbangan alam (mizan) dan peran adat seperti Panglima Uteun.' ]
        },
        { jenis: 'kartu',
          subjudul: 'Terus, harus bagaimana?',
          gambar: { file: 'peta/08-zonasi-rekomendasi.png', keterangan: 'Peta zonasi rekomendasi. Sumber: olahan tim.' },
          isi: [
            { warna: 'merah', label: 'Hulu', judul: 'Pulihkan', teks: 'Lereng curam dan sempadan yang rusak ditanami lagi.' },
            { warna: 'hijau', label: 'Tengah', judul: 'Jaga', teks: 'Hutan yang tersisa dilindungi bersama masyarakat.' },
            { warna: 'biru',  label: 'Hilir', judul: 'Siaga', teks: 'Peringatan dini dari hujan di hulu dan jalur evakuasi desa.' }
          ]
        }
      ]
    }
  ],

  /* ---------- PENUTUP ---------- */
  penutup: {
    judul: 'Menjaga hulu, *menjaga kita*',
    teks: 'Satu paragraf pendek: ajakan, harapan, atau pengingat untuk pembaca.'
  },
  sumberData: [
    'Batas DAS, KEL, tutupan & kehilangan hutan: Yayasan HAkA (data dasar panitia)',
    'Batas kecamatan & desa: BIG 2025, Dukcapil',
    'Elevasi & lereng: DEMNAS (BIG)',
    'Curah hujan: CHIRPS, NASA GPM IMERG',
    'Genangan banjir: UNOSAT (28 Nov 2025)',
    'Jalan: OpenStreetMap'
  ],
  metode: 'Semua peta diolah di QGIS; luas dihitung dalam UTM 47N (EPSG:32647).',
  catatanAI: 'Penggunaan AI dideklarasikan dalam Surat Pernyataan Orisinalitas.'
};
