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
              tooltip: function (p) { return (p.n || 'Tanpa nama') + ' / ' + p.km + ' km'; } },
    aliran: { file: 'aliran.geojson', tipe: 'garis', urut: 'o', warnaDari: { field: 'o', nilai: { 1: '#BDE3FF', 2: '#4FA8FF', 3: '#0A4FD6' } }, tebalDari: { field: 'o', nilai: { 1: .6, 2: 1.3, 3: 2.6 } },
              tooltip: function (p) { return 'Orde ' + p.o + ' / ' + p.tipe + ' / total ' + p.km.toLocaleString('id-ID') + ' km'; } },
    lh2019: { file: 'lahan-2019.geojson', warnaDari: { field: 'kode', nilai: { 1: '#1A5BAB', 2: '#1B7837', 3: '#C28441', 4: '#2F6146', 5: '#FFDB5C', 7: '#ED022A', 8: '#EDD9A3', 11: '#9BBF6A' } }, isi: .88, tebal: 0, animasi: true,
              popup: { judul: 'kelas', sub: 'Tutupan lahan 2019', baris: [ ['Luas kelas di DAS', 'ha', 'ha', 0] ] } },
    lh2020: { file: 'lahan-2020.geojson', warnaDari: { field: 'kode', nilai: { 1: '#1A5BAB', 2: '#1B7837', 3: '#C28441', 4: '#2F6146', 5: '#FFDB5C', 7: '#ED022A', 8: '#EDD9A3', 11: '#9BBF6A' } }, isi: .88, tebal: 0, animasi: true,
              popup: { judul: 'kelas', sub: 'Tutupan lahan 2020', baris: [ ['Luas kelas di DAS', 'ha', 'ha', 0] ] } },
    lh2021: { file: 'lahan-2021.geojson', warnaDari: { field: 'kode', nilai: { 1: '#1A5BAB', 2: '#1B7837', 3: '#C28441', 4: '#2F6146', 5: '#FFDB5C', 7: '#ED022A', 8: '#EDD9A3', 11: '#9BBF6A' } }, isi: .88, tebal: 0, animasi: true,
              popup: { judul: 'kelas', sub: 'Tutupan lahan 2021', baris: [ ['Luas kelas di DAS', 'ha', 'ha', 0] ] } },
    lh2022: { file: 'lahan-2022.geojson', warnaDari: { field: 'kode', nilai: { 1: '#1A5BAB', 2: '#1B7837', 3: '#C28441', 4: '#2F6146', 5: '#FFDB5C', 7: '#ED022A', 8: '#EDD9A3', 11: '#9BBF6A' } }, isi: .88, tebal: 0, animasi: true,
              popup: { judul: 'kelas', sub: 'Tutupan lahan 2022', baris: [ ['Luas kelas di DAS', 'ha', 'ha', 0] ] } },
    lh2023: { file: 'lahan-2023.geojson', warnaDari: { field: 'kode', nilai: { 1: '#1A5BAB', 2: '#1B7837', 3: '#C28441', 4: '#2F6146', 5: '#FFDB5C', 7: '#ED022A', 8: '#EDD9A3', 11: '#9BBF6A' } }, isi: .88, tebal: 0, animasi: true,
              popup: { judul: 'kelas', sub: 'Tutupan lahan 2023', baris: [ ['Luas kelas di DAS', 'ha', 'ha', 0] ] } },
    lh2024: { file: 'lahan-2024.geojson', warnaDari: { field: 'kode', nilai: { 1: '#1A5BAB', 2: '#1B7837', 3: '#C28441', 4: '#2F6146', 5: '#FFDB5C', 7: '#ED022A', 8: '#EDD9A3', 11: '#9BBF6A' } }, isi: .88, tebal: 0, animasi: true,
              popup: { judul: 'kelas', sub: 'Tutupan lahan 2024', baris: [ ['Luas kelas di DAS', 'ha', 'ha', 0] ] } },
    lh2025: { file: 'lahan-2025.geojson', warnaDari: { field: 'kode', nilai: { 1: '#1A5BAB', 2: '#1B7837', 3: '#C28441', 4: '#2F6146', 5: '#FFDB5C', 7: '#ED022A', 8: '#EDD9A3', 11: '#9BBF6A' } }, isi: .88, tebal: 0, animasi: true,
              popup: { judul: 'kelas', sub: 'Tutupan lahan 2025', baris: [ ['Luas kelas di DAS', 'ha', 'ha', 0] ] } },
    hk2019: { file: 'hutan-2019.geojson', warna: '#35A76A', garis: '#145A35', tebal: .4, isi: .9, animasi: true },
    hk2020: { file: 'hutan-2020.geojson', warna: '#35A76A', garis: '#145A35', tebal: .4, isi: .9, animasi: true },
    hk2021: { file: 'hutan-2021.geojson', warna: '#35A76A', garis: '#145A35', tebal: .4, isi: .9, animasi: true },
    hk2022: { file: 'hutan-2022.geojson', warna: '#35A76A', garis: '#145A35', tebal: .4, isi: .9, animasi: true },
    hk2023: { file: 'hutan-2023.geojson', warna: '#35A76A', garis: '#145A35', tebal: .4, isi: .9, animasi: true },
    hk2024: { file: 'hutan-2024.geojson', warna: '#35A76A', garis: '#145A35', tebal: .4, isi: .9, animasi: true },
    hk2025: { file: 'hutan-2025.geojson', warna: '#35A76A', garis: '#145A35', tebal: .4, isi: .9, animasi: true },
    hutan19: { file: 'hutan-2019.geojson', warna: '#E2B655', garis: '#8A6417', tebal: .4, isi: .88 },
    hutan25: { file: 'hutan-2025.geojson', warna: '#35A76A', garis: '#145A35', tebal: .4, isi: .9 },
    hilangSemua: { file: 'hutan-status.geojson', saring: function (p) { return p.s.indexOf('Kehilangan') === 0; }, warnaDari: { field: 's', nilai: { 'Kehilangan hutan 2025': '#FF4B3E' }, lain: '#FF9F43' }, tebal: 1.6, isi: 1,
              popup: { judul: 's', sub: 'Hutan yang sudah hilang', baris: [ ['Luas di DAS', 'ha', 'ha', 0] ] } },
    hutanStatus: { file: 'hutan-status.geojson', warnaDari: { field: 's', nilai: { 'Tutupan hutan stabil (2019–2025)': '#238B45', 'Kehilangan hutan 2020': '#FEE5D9', 'Kehilangan hutan 2021': '#FCAE91', 'Kehilangan hutan 2022': '#FB6A4A', 'Kehilangan hutan 2023': '#DE2D26', 'Kehilangan hutan 2024': '#A50F15', 'Kehilangan hutan 2025': '#FFD400' } }, isi: .85, tebal: .3,
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
    genanganTipis: { file: 'genangan.geojson', warna: '#5BB8FF', garis: '#5BB8FF', tebal: 0, isi: .35 },
    tani: { file: 'pertanian.geojson', skala: { field: 'ha', batas: [1, 250, 600, 1200, 2000], warna: ['rgba(254,250,224,.12)', '#FFF3C4', '#FCD581', '#F4A93C', '#D9771E', '#A34E0F'] }, garis: '#FEFAE0', tebal: 1, isi: .82,
            popup: { judul: function (p) { return 'Kec. ' + p.kec; }, sub: function (p) { return 'Peringkat ' + p.rank + ' dari 12 kecamatan'; }, baris: [ ['Lahan pertanian terdampak', 'ha', 'ha', 0], ['Porsi dari total Aceh Tamiang', 'pct', '%'] ] } },
    lahanTani: { file: 'lahan-2025.geojson', saring: function (p) { return p.kode === 5 || p.kode === 3; }, warnaDari: { field: 'kode', nilai: { 3: '#C28441', 5: '#FFDB5C' } }, isi: .55, tebal: 0,
            popup: { judul: 'kelas', sub: 'Tutupan lahan 2025', baris: [ ['Luas kelas di DAS', 'ha', 'ha', 0] ] } }
  };
  var HILIR = [[4.16, 97.86], [4.58, 98.30]];
  var TAMIANG = [[3.89, 97.73], [4.53, 98.29]];
  var WZ = { hulu: '#26A69A', tengah: '#D27330', hilir: '#6F8FF0' };
  var WK = ['#628AD0', '#CF7A27', '#E4477A'];
  var THN = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];

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
    gambar: 'peta/00-sampul.svg',
    keterangan: 'DAS Tamiang (garis merah). Kuning: kehilangan hutan 2025. Biru muda: sungai utama. Biru: genangan 28 Nov 2025. Sumber: HAkA, UNOSAT, DEMNAS, KLHK; hasil analisis tim.'
  },

  /* ---------- ISI CERITA ----------
     Urutan mengikuti struktur storymap tim: 8 bagian utama.
     Warna latar: olive (#606C38) di semua bagian.          */
  bagian: [

    /* ===== PEMBUKA (tanpa nomor) ===== */
    { label: 'Pembuka', tanpaNomor: true,
      judul: 'Air dari *Hulu*',
      blok: [
        { jenis: 'teks', paragraf: [
          'Hujan turun berhari-hari di pegunungan. Pada 26 November 2025, Sungai Tamiang meluap dan menyapu Kuala Simpang, Karang Baru, sampai pesisir Bendahara dan Seruway. Banjir datang membawa air, lumpur, dan material kayu yang terbawa arus. Di sejumlah wilayah, genangan mencapai permukiman, sekolah, dan fasilitas umum, meninggalkan kerusakan serta material yang harus dibersihkan masyarakat.',
          'Menurut data Pemkab Aceh Tamiang, 287.168 warga terdampak dan 101 orang meninggal. Lebih dari 75 ribu rumah rusak, dan sebagian warga bertahan berhari-hari di atap rumah.',
          'Banjir bukan peristiwa baru bagi Aceh Tamiang. Namun, skala kejadian kali ini jauh lebih besar dibandingkan sebelumnya. Hal ini memunculkan pertanyaan: perubahan apa yang terjadi di wilayah hulu sebelum air mencapai hilir?'
        ]},
        { jenis: 'angka', isi: [
          { nilai: '287.168', satuan: 'jiwa', keterangan: 'Warga Aceh Tamiang terdampak', sumber: 'Pemkab Aceh Tamiang, cekdatabencana' },
          { nilai: '101',     satuan: 'jiwa', keterangan: 'Korban meninggal; 18 luka-luka', sumber: 'Pemkab Aceh Tamiang, cekdatabencana' },
          { nilai: '75.088',  satuan: 'rumah', keterangan: 'Rumah rusak', sumber: 'Pemkab Aceh Tamiang, cekdatabencana' },
          { nilai: '562.251', satuan: 'ha',    keterangan: 'Luas DAS Tamiang', sumber: 'Batas DAS KLHK (DAS130029)' }
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
      judul: 'Mengenal *DAS Tamiang*',
      pengantar: 'Satu sistem air, dari hutan Leuser di hulu sampai pesisir Selat Malaka.',
      blok: [
        { jenis: 'teks',
          subjudul: '1.1 Bentang alam DAS Tamiang',
          paragraf: [
            'DAS Tamiang (562.251 ha) membentang dari pegunungan berhutan di Gayo Lues dan Aceh Timur hingga dataran pesisir Aceh Tamiang, melintasi enam kabupaten/kota.',
            'Sebagai satu sistem hidrologi, air hujan di DAS ini mengalami **intersepsi** oleh tajuk, **infiltrasi** ke dalam tanah, dan **limpasan permukaan** menuju Sungai Tamiang.'
          ]
        },
        { jenis: 'alur',
          isi: [
            { judul: 'Intersepsi', teks: 'Tajuk hutan menahan sebagian air hujan sebelum jatuh ke tanah.' },
            { judul: 'Infiltrasi', teks: 'Akar dan serasah membantu air meresap ke dalam tanah.' },
            { judul: 'Limpasan', teks: 'Air yang tidak meresap mengalir di permukaan, masuk ke sungai.' },
            { judul: 'Hilir', teks: 'Semua aliran berkumpul di Sungai Tamiang menuju Selat Malaka.' }
          ]
        },
        { jenis: 'teks',
          subjudul: '1.2 Keterkaitan dengan *Ekosistem Leuser*',
          paragraf: [
            'Sekitar 70% DAS Tamiang berada di Kawasan Ekosistem Leuser (KEL), mencakup hampir seluruh wilayah hulu. Kajian ini berfokus pada bagian tersebut untuk menilai perubahan tutupan hutan, penggunaan lahan, dan vegetasi sempadan sungai.'
          ]
        },
        { jenis: 'teks',
          subjudul: '1.3 Dari *hulu* menuju *hilir*',
          paragraf: [
            'DAS dibagi menjadi tiga zona analisis. Zona hulu dikaji dari aspek tutupan hutan, topografi, dan sempadan; zona tengah dari keterhubungan sungai dan penggunaan lahan; zona hilir dari genangan dan paparan masyarakat. Ketiganya dianalisis sebagai satu kesatuan sistem.'
          ]
        },
        { jenis: 'kartu',
          isi: [
            { warna: 'hijau', label: 'Hulu / 48,9% DAS / >500 mdpl', judul: 'Hutan dan lereng', teks: 'Fokus pada kondisi tutupan hutan, topografi, dan vegetasi sempadan sungai.' },
            { warna: 'emas', label: 'Tengah / 31,1% DAS / 50–500 mdpl', judul: 'Sungai dan lahan', teks: 'Menggambarkan keterhubungan jaringan sungai dengan penggunaan lahan.' },
            { warna: 'merah', label: 'Hilir / 20,1% DAS / <50 mdpl', judul: 'Genangan dan warga', teks: 'Fokus analisis genangan banjir dan paparan aktivitas masyarakat.' }
          ]
        },
        { jenis: 'peta-web',
          subjudul: 'Peta DAS Tamiang: klik tabnya, klik petanya',
          lapis: LAPIS,
          petunjuk: 'Perbesar peta dan klik wilayah berwarna untuk melihat angkanya. Garis merah = batas DAS Tamiang.',
          tab: [
            { label: 'Letak', besar: 'DAS Tamiang', judul: 'DAS130029 (Manyak Payed/Tamiang)', lapis: ['kel', 'sungai'],
              angka: [ { keterangan: 'Luas DAS', nilai: '562.251', satuan: 'ha' }, { keterangan: 'Masuk Kawasan Ekosistem Leuser', nilai: '70', satuan: '%' }, { keterangan: 'Kabupaten/kota yang dilalui', nilai: '6', satuan: '' } ],
              legenda: [ { warna: '#DC143C', label: 'Batas DAS Tamiang', garis: true }, { warna: '#7CFC9A', label: 'Batas KEL di dalam DAS', garis: true }, { warna: '#5BB8FF', label: 'Sungai', garis: true } ],
              teks: 'Hulunya di pegunungan Leuser (Gayo Lues, Aceh Tenggara, Aceh Tengah). Airnya turun lewat Simpang Kiri dan Simpang Kanan, bertemu jadi Sungai Tamiang, lalu bermuara di Selat Malaka.' },
            { label: 'Hulu–tengah–hilir', besar: '3 zona', lapis: ['zona'], fit: 'das',
              angka: [ { keterangan: 'Hulu, >500–2.500 mdpl', nilai: '48,9', satuan: '%' }, { keterangan: 'Tengah, 50–500 mdpl', nilai: '31,1', satuan: '%' }, { keterangan: 'Hilir, <50 mdpl', nilai: '20,1', satuan: '%' } ],
              legenda: [ { warna: '#2E7D32', label: 'Hulu (Ekosistem Leuser)' }, { warna: '#F57C00', label: 'Tengah (transisi)' }, { warna: '#0288D1', label: 'Hilir (dataran banjir)' } ],
              teks: 'Hampir separuh DAS adalah hulu. Tapi 92% genangan November 2025 justru ada di zona hilir, tempat orang paling banyak tinggal.' },
            { label: 'Lima sub-DAS', besar: '5 sub-DAS', lapis: ['subdas'], fit: 'das',
              legenda: [ { warna: '#238B45', label: 'Simpang Kiri Hulu / 48,9%' }, { warna: '#41B6C4', label: 'Simpang Kiri Hilir / 19,6%' }, { warna: '#FE9929', label: 'Simpang Kanan / 6,0%' }, { warna: '#8856A7', label: 'Tenggulun / 5,4%' }, { warna: '#2B8CBE', label: 'Cempegih / Tamiang Hilir / 20,1%' } ],
              teks: 'Simpang Kiri Hulu masih 89% berhutan, tapi kehilangan 6.777 ha hanya di 2025. Cempegih di hilir tinggal 3% berhutan dan menampung 9.283 ha genangan.' }
          ],
          sumber: 'Sumber: batas DAS KLHK; batas KEL; zona & sub-DAS hasil analisis tim; sungai OpenStreetMap; Citra Esri.'
        }
      ]
    },

    /* ===== 2. KONDISI FISIK HULU ===== */
    { label: 'Kondisi fisik',
      judul: 'Memahami kondisi fisik *hulu*',
      pengantar: 'Bentuk lahan menentukan seberapa cepat air turun ke sungai.',
      blok: [
        { jenis: 'teks',
          subjudul: 'Ketinggian, lereng, dan jaringan sungai',
          paragraf: [
            '**2.1 Ketinggian.** Elevasi DAS berkisar 500–2.500 mdpl di hulu, 50–500 mdpl di zona tengah, dan kurang dari 50 mdpl di hilir (DEMNAS). Gradien yang tajam ini mempercepat aliran air menuju dataran rendah.',
            '**2.2 Kemiringan lereng.** Sebanyak 49,7% wilayah DAS tergolong landai, sedangkan 31,9% sangat curam (>40%). Lereng sangat curam berpotensi tinggi menghasilkan limpasan permukaan, terutama bila tutupan vegetasinya hilang.',
            '**2.3 Jaringan sungai.** Ekstraksi DEM menghasilkan 4.989 segmen alur dengan panjang total sekitar 5.966 km. Seluruhnya bermuara ke Sungai Simpang Kiri dan Simpang Kanan yang membentuk Sungai Tamiang.'
          ]
        },
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
          sumber: 'Sumber: aliran turunan DEMNAS (hasil analisis tim); sungai OpenStreetMap; relief Esri; topografi OpenTopoMap.'
        },
        { jenis: 'grafik-plus',
          subjudul: 'Seberapa *curam* DAS Tamiang',
          paragraf: [ 'Separuh DAS landai, tapi hampir sepertiganya sangat curam (di atas 40%). Lereng seperti ini yang paling cepat longsor kalau hutannya dibuka.' ],
          kategori: ['Landai (<25%)', 'Curam (25–40%)', 'Sangat curam (>40%)'],
          tampilan: [ { label: 'Luas', tipe: 'mendatar', satuan: 'ha', seri: [ { nama: 'Luas kelas lereng', warna: WK[0], warnaPer: WK, nilai: [277007.37, 102884.00, 177538.44] } ], labelBatang: ['49,69%', '18,46%', '31,85%'] } ],
          sumber: 'Sumber: kelas lereng turunan DEMNAS, hasil analisis tim.'
        }
      ]
    },

    /* ===== 3. DINAMIKA TUTUPAN HUTAN ===== */
    { label: 'Tutupan hutan',
      judul: 'Perubahan *tutupan hutan*',
      pengantar: 'Bagaimana hutan di hulu DAS Tamiang berubah selama 2019–2025.',
      blok: [
        { jenis: 'teks',
          subjudul: 'Dinamika tutupan hutan',
          paragraf: [
            '**3.1 Sebaran hutan.** Pada 2019, tutupan hutan mencakup 319.739 ha (56,9% DAS), terkonsentrasi di zona hulu dengan tutupan 89,3%. Zona hilir hanya menyisakan 3,2%.',
            '**3.2 Perubahan luas.** Selama 2019–2024 luas hutan berkurang sekitar 3.000 ha. Pada 2025 kehilangan melonjak menjadi 8.358 ha dalam satu tahun, sehingga tutupan tersisa 308.381 ha (54,9%).',
            '**3.3 Kehilangan dan penambahan.** Data HAkA hanya merekam kehilangan tutupan hutan bulanan; penambahan tutupan tidak tersedia sehingga tidak dianalisis.',
            '**3.4 Sebaran kehilangan.** Sebanyak 81% kehilangan hutan 2025 terjadi di zona hulu, terutama di Kecamatan Pining (Gayo Lues) dan Serbajadi (Aceh Timur).'
          ]
        },
        { jenis: 'peta-web', waktu: true,
          subjudul: 'Tutupan hutan KEL *2019–2025*',
          lapis: LAPIS, mulai: 0, jeda: 2600,
          legenda: [],
          petunjuk: 'Klik tahun atau tekan Putar. Perhatikan bagian hutan yang menghilang di zona hulu pada 2025.',
          tab: [
            { label: '2019', besar: '2019', judul: 'tutupan hutan KEL', lapis: ['hk2019'],
              angka: [ { keterangan: 'Luas tutupan hutan DAS', nilai: '319.739', satuan: 'ha' }, { keterangan: 'Persentase luas DAS', nilai: '56,87', satuan: '%' }, { keterangan: 'Zona hulu / tengah / hilir', nilai: '89,3 / 40,5 / 3,2', satuan: '%' }, { keterangan: 'Retensi hutan', nilai: '100', satuan: '%' } ],
              teks: 'Tahun dasar. Hutan menutupi 56,87% DAS, terutama di zona hulu (89,30%).' },
            { label: '2020', besar: '2020', judul: 'tutupan hutan KEL', lapis: ['hk2020'],
              angka: [ { keterangan: 'Luas tutupan hutan DAS', nilai: '318.399', satuan: 'ha' }, { keterangan: 'Persentase luas DAS', nilai: '56,63', satuan: '%' }, { keterangan: 'Zona hulu / tengah / hilir', nilai: '89,2 / 40,2 / 2,8', satuan: '%' }, { keterangan: 'Kehilangan dari tahun sebelumnya', nilai: '1.340', satuan: 'ha' } ],
              teks: 'Penurunan tahunan terbesar sebelum 2025, terutama di zona tengah dan hilir.' },
            { label: '2021', besar: '2021', judul: 'tutupan hutan KEL', lapis: ['hk2021'],
              angka: [ { keterangan: 'Luas tutupan hutan DAS', nilai: '317.612', satuan: 'ha' }, { keterangan: 'Persentase luas DAS', nilai: '56,49', satuan: '%' }, { keterangan: 'Zona hulu / tengah / hilir', nilai: '89,1 / 40,1 / 2,6', satuan: '%' }, { keterangan: 'Kehilangan dari tahun sebelumnya', nilai: '786', satuan: 'ha' } ],
              teks: 'Laju melambat, tetapi zona hilir masih kehilangan 9,47% hutannya.' },
            { label: '2022', besar: '2022', judul: 'tutupan hutan KEL', lapis: ['hk2022'],
              angka: [ { keterangan: 'Luas tutupan hutan DAS', nilai: '317.309', satuan: 'ha' }, { keterangan: 'Persentase luas DAS', nilai: '56,44', satuan: '%' }, { keterangan: 'Zona hulu / tengah / hilir', nilai: '89,0 / 40,0 / 2,5', satuan: '%' }, { keterangan: 'Kehilangan dari tahun sebelumnya', nilai: '303', satuan: 'ha' } ],
              teks: 'Kehilangan tutupan hutan terendah kedua dalam periode ini.' },
            { label: '2023', besar: '2023', judul: 'tutupan hutan KEL', lapis: ['hk2023'],
              angka: [ { keterangan: 'Luas tutupan hutan DAS', nilai: '317.080', satuan: 'ha' }, { keterangan: 'Persentase luas DAS', nilai: '56,40', satuan: '%' }, { keterangan: 'Zona hulu / tengah / hilir', nilai: '89,0 / 40,0 / 2,5', satuan: '%' }, { keterangan: 'Kehilangan dari tahun sebelumnya', nilai: '229', satuan: 'ha' } ],
              teks: 'Kehilangan tutupan hutan terendah selama 2019–2025.' },
            { label: '2024', besar: '2024', judul: 'tutupan hutan KEL', lapis: ['hk2024'],
              angka: [ { keterangan: 'Luas tutupan hutan DAS', nilai: '316.739', satuan: 'ha' }, { keterangan: 'Persentase luas DAS', nilai: '56,34', satuan: '%' }, { keterangan: 'Zona hulu / tengah / hilir', nilai: '88,9 / 39,9 / 2,3', satuan: '%' }, { keterangan: 'Kehilangan dari tahun sebelumnya', nilai: '341', satuan: 'ha' } ],
              teks: 'Zona hilir kembali kehilangan 5,18% hutannya.' },
            { label: '2025', besar: '2025', judul: 'tutupan hutan KEL', lapis: ['hk2025'],
              angka: [ { keterangan: 'Luas tutupan hutan DAS', nilai: '308.381', satuan: 'ha' }, { keterangan: 'Persentase luas DAS', nilai: '54,85', satuan: '%' }, { keterangan: 'Zona hulu / tengah / hilir', nilai: '86,5 / 39,2 / 2,0', satuan: '%' }, { keterangan: 'Kehilangan dari tahun sebelumnya', nilai: '8.358', satuan: 'ha' } ],
              teks: 'Kehilangan melonjak menjadi 8.358 ha, 81% di antaranya di zona hulu.' }
          ],
          sumber: 'Sumber: Tutupan Hutan KEL 2019–2025 (HAkA); Tabel Tutupan Hutan per Zona DAS 2019–2025, hasil analisis tim; batas DAS KLHK.'
        },
        { jenis: 'peta-web', waktu: true,
          subjudul: 'Tutupan lahan *2019–2025*',
          lapis: LAPIS, mulai: 0, jeda: 2600,
          petunjuk: 'Klik tahun atau tekan Putar. Klik warna di peta untuk melihat luas kelasnya.',
          legenda: [],
          tab: [
            { label: '2019', besar: '2019', judul: 'tutupan lahan DAS Tamiang', lapis: ['lh2019'],
              legenda: [ { warna: '#1B7837', label: 'Hutan alami Leuser' }, { warna: '#C28441', label: 'Kebun kelapa sawit' }, { warna: '#FFDB5C', label: 'Pertanian & tanaman semusim' }, { warna: '#9BBF6A', label: 'Semak belukar' }, { warna: '#EDD9A3', label: 'Lahan terbuka' }, { warna: '#ED022A', label: 'Permukiman' }, { warna: '#2F6146', label: 'Rawa' }, { warna: '#1A5BAB', label: 'Badan air' } ],
              angka: [ { keterangan: 'Hutan alami Leuser', nilai: '318.040', satuan: 'ha' }, { keterangan: 'Kebun kelapa sawit', nilai: '177.596', satuan: 'ha' }, { keterangan: 'Pertanian & tanaman semusim', nilai: '28.446', satuan: 'ha' }, { keterangan: 'Lahan terbuka', nilai: '44', satuan: 'ha' } ],
              teks: 'Tahun dasar. Hutan alami Leuser mendominasi hulu, kebun sawit mendominasi tengah dan hilir.' },
            { label: '2020', besar: '2020', judul: 'tutupan lahan DAS Tamiang', lapis: ['lh2020'],
              legenda: [ { warna: '#1B7837', label: 'Hutan alami Leuser' }, { warna: '#C28441', label: 'Kebun kelapa sawit' }, { warna: '#FFDB5C', label: 'Pertanian & tanaman semusim' }, { warna: '#9BBF6A', label: 'Semak belukar' }, { warna: '#EDD9A3', label: 'Lahan terbuka' }, { warna: '#ED022A', label: 'Permukiman' }, { warna: '#2F6146', label: 'Rawa' }, { warna: '#1A5BAB', label: 'Badan air' } ],
              angka: [ { keterangan: 'Hutan alami Leuser', nilai: '314.649', satuan: 'ha' }, { keterangan: 'Kebun kelapa sawit', nilai: '178.136', satuan: 'ha' }, { keterangan: 'Pertanian & tanaman semusim', nilai: '25.647', satuan: 'ha' }, { keterangan: 'Lahan terbuka', nilai: '147', satuan: 'ha' } ],
              teks: 'Pertanian semusim menyusut, sebagian berganti menjadi kebun dan semak.' },
            { label: '2021', besar: '2021', judul: 'tutupan lahan DAS Tamiang', lapis: ['lh2021'],
              legenda: [ { warna: '#1B7837', label: 'Hutan alami Leuser' }, { warna: '#C28441', label: 'Kebun kelapa sawit' }, { warna: '#FFDB5C', label: 'Pertanian & tanaman semusim' }, { warna: '#9BBF6A', label: 'Semak belukar' }, { warna: '#EDD9A3', label: 'Lahan terbuka' }, { warna: '#ED022A', label: 'Permukiman' }, { warna: '#2F6146', label: 'Rawa' }, { warna: '#1A5BAB', label: 'Badan air' } ],
              angka: [ { keterangan: 'Hutan alami Leuser', nilai: '313.902', satuan: 'ha' }, { keterangan: 'Kebun kelapa sawit', nilai: '175.962', satuan: 'ha' }, { keterangan: 'Pertanian & tanaman semusim', nilai: '29.849', satuan: 'ha' }, { keterangan: 'Lahan terbuka', nilai: '242', satuan: 'ha' } ],
              teks: 'Komposisi relatif stabil; luas rawa dan vegetasi tergenang mulai bertambah.' },
            { label: '2022', besar: '2022', judul: 'tutupan lahan DAS Tamiang', lapis: ['lh2022'],
              legenda: [ { warna: '#1B7837', label: 'Hutan alami Leuser' }, { warna: '#C28441', label: 'Kebun kelapa sawit' }, { warna: '#FFDB5C', label: 'Pertanian & tanaman semusim' }, { warna: '#9BBF6A', label: 'Semak belukar' }, { warna: '#EDD9A3', label: 'Lahan terbuka' }, { warna: '#ED022A', label: 'Permukiman' }, { warna: '#2F6146', label: 'Rawa' }, { warna: '#1A5BAB', label: 'Badan air' } ],
              angka: [ { keterangan: 'Hutan alami Leuser', nilai: '312.407', satuan: 'ha' }, { keterangan: 'Kebun kelapa sawit', nilai: '179.420', satuan: 'ha' }, { keterangan: 'Pertanian & tanaman semusim', nilai: '20.949', satuan: 'ha' }, { keterangan: 'Lahan terbuka', nilai: '38', satuan: 'ha' } ],
              teks: 'Rawa/vegetasi tergenang mencapai 8.646 ha, pertanian semusim turun ke titik terendah.' },
            { label: '2023', besar: '2023', judul: 'tutupan lahan DAS Tamiang', lapis: ['lh2023'],
              legenda: [ { warna: '#1B7837', label: 'Hutan alami Leuser' }, { warna: '#C28441', label: 'Kebun kelapa sawit' }, { warna: '#FFDB5C', label: 'Pertanian & tanaman semusim' }, { warna: '#9BBF6A', label: 'Semak belukar' }, { warna: '#EDD9A3', label: 'Lahan terbuka' }, { warna: '#ED022A', label: 'Permukiman' }, { warna: '#2F6146', label: 'Rawa' }, { warna: '#1A5BAB', label: 'Badan air' } ],
              angka: [ { keterangan: 'Hutan alami Leuser', nilai: '309.601', satuan: 'ha' }, { keterangan: 'Kebun kelapa sawit', nilai: '175.754', satuan: 'ha' }, { keterangan: 'Pertanian & tanaman semusim', nilai: '27.004', satuan: 'ha' }, { keterangan: 'Lahan terbuka', nilai: '68', satuan: 'ha' } ],
              teks: 'Hutan alami Leuser turun menjadi 309.601 ha.' },
            { label: '2024', besar: '2024', judul: 'tutupan lahan DAS Tamiang', lapis: ['lh2024'],
              legenda: [ { warna: '#1B7837', label: 'Hutan alami Leuser' }, { warna: '#C28441', label: 'Kebun kelapa sawit' }, { warna: '#FFDB5C', label: 'Pertanian & tanaman semusim' }, { warna: '#9BBF6A', label: 'Semak belukar' }, { warna: '#EDD9A3', label: 'Lahan terbuka' }, { warna: '#ED022A', label: 'Permukiman' }, { warna: '#2F6146', label: 'Rawa' }, { warna: '#1A5BAB', label: 'Badan air' } ],
              angka: [ { keterangan: 'Hutan alami Leuser', nilai: '316.213', satuan: 'ha' }, { keterangan: 'Kebun kelapa sawit', nilai: '177.696', satuan: 'ha' }, { keterangan: 'Pertanian & tanaman semusim', nilai: '23.275', satuan: 'ha' }, { keterangan: 'Lahan terbuka', nilai: '84', satuan: 'ha' } ],
              teks: 'Komposisi tutupan lahan sebelum kejadian banjir 2025.' },
            { label: '2025', besar: '2025', judul: 'tutupan lahan DAS Tamiang', lapis: ['lh2025'],
              legenda: [ { warna: '#1B7837', label: 'Hutan alami Leuser' }, { warna: '#C28441', label: 'Kebun kelapa sawit' }, { warna: '#FFDB5C', label: 'Pertanian & tanaman semusim' }, { warna: '#9BBF6A', label: 'Semak belukar' }, { warna: '#EDD9A3', label: 'Lahan terbuka' }, { warna: '#ED022A', label: 'Permukiman' }, { warna: '#2F6146', label: 'Rawa' }, { warna: '#1A5BAB', label: 'Badan air' } ],
              angka: [ { keterangan: 'Hutan alami Leuser', nilai: '307.895', satuan: 'ha' }, { keterangan: 'Kebun kelapa sawit', nilai: '177.696', satuan: 'ha' }, { keterangan: 'Pertanian & tanaman semusim', nilai: '23.275', satuan: 'ha' }, { keterangan: 'Lahan terbuka', nilai: '8.402', satuan: 'ha' } ],
              teks: 'Lahan terbuka melonjak dari 84 ha (2024) menjadi 8.402 ha, sejalan dengan kehilangan hutan di hulu pada 2025.' }
          ],
          sumber: 'Sumber: tutupan lahan vektor 2019–2025, hasil analisis tim; batas DAS KLHK.'
        },
        { jenis: 'peta-web',
          subjudul: 'Waktu dan sebaran kehilangan *tutupan hutan*',
          lapis: LAPIS,
          tab: [
            { label: 'Waktu kehilangan', besar: '2020–2025', lapis: ['hutanStatus'],
              legenda: [ { warna: '#238B45', label: 'Tutupan hutan stabil (2019–2025)' }, { warna: '#FEE5D9', label: 'Kehilangan hutan 2020 / 1.340 ha' }, { warna: '#FCAE91', label: 'Kehilangan hutan 2021 / 786 ha' }, { warna: '#FB6A4A', label: 'Kehilangan hutan 2022 / 303 ha' }, { warna: '#DE2D26', label: 'Kehilangan hutan 2023 / 229 ha' }, { warna: '#A50F15', label: 'Kehilangan hutan 2024 / 341 ha' }, { warna: '#FFD400', label: 'Kehilangan hutan 2025 / 8.358 ha' } ],
              teks: 'Perbesar ke bagian kuning: itu hutan yang hilang di 2025, kebanyakan di punggung hulu.' },
            { label: 'Sisa hutan per zona', besar: '2025', lapis: ['hutanZona', 'zonaGaris'],
              angka: [ { keterangan: 'Zona hulu masih berhutan', nilai: '86,5', satuan: '%' }, { keterangan: 'Zona tengah', nilai: '39,2', satuan: '%' }, { keterangan: 'Zona hilir', nilai: '2,0', satuan: '%' } ],
              legenda: [ { warna: '#1B5E20', label: 'Hutan zona hulu' }, { warna: '#43A047', label: 'Hutan zona tengah' }, { warna: '#A5D6A7', label: 'Hutan zona hilir' } ],
              teks: 'Hilir hampir tidak punya hutan lagi. Satu-satunya penahan air yang tersisa ada di hulu.' }
          ],
          sumber: 'Sumber: Tutupan Hutan KEL 2019–2025 (HAkA); tutupan lahan vektor hasil analisis tim; batas DAS KLHK.'
        },
        { jenis: 'peta-interaktif',
          subjudul: 'Sebaran kehilangan hutan per tahun',
          paragraf: [ 'Peta dapat diperbesar. Klik tahun untuk berganti data, lalu klik kecamatan mana saja untuk melihat angkanya per tahun.' ],
          folder: 'data/',
          tahun: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
          sorotKab: 'Aceh Tamiang', das: true,
          legenda: [ { warna: '#FFD166', label: 'Kehilangan hutan' }, { warna: '#FF6B35', label: 'Kehilangan hutan Nov–Des 2025 (saat bencana)' }, { warna: 'rgba(221,161,94,.35)', label: 'Warna kecamatan: makin pekat, makin banyak hilang' }, { warna: '#DC143C', label: 'Garis merah: batas DAS Tamiang' } ],
          sumber: 'Sumber: Kehilangan Tutupan Hutan KEL (HAkA, data dasar panitia); batas kecamatan BIG 2025; hasil analisis tim.'
        },
        { jenis: 'grafik-plus',
          subjudul: 'Kehilangan hutan, *tahun demi tahun*',
          ringkas: [ { nilai: '8.358', satuan: 'ha', keterangan: 'Kehilangan hutan 2025' }, { nilai: '4.061', satuan: 'ha', keterangan: 'Total enam tahun sebelumnya (2019–2024)' }, { nilai: '2×', satuan: '', keterangan: 'Satu tahun 2025 = dua kali enam tahun sebelumnya' } ],
          kategori: THN,
          tampilan: [
            { label: 'Total DAS', tipe: 'batang', satuan: 'ha', desimal: 0, sorot: '2025', labelNilai: 'semua',
              seri: [ { nama: 'Kehilangan hutan di DAS', warna: '#DDA15E', warnaPer: ['#DDA15E', '#DDA15E', '#DDA15E', '#DDA15E', '#DDA15E', '#DDA15E', '#E4477A'], nilai: [1061.0, 1339.7, 786.4, 303.3, 228.9, 341.3, 8358.2] } ],
              ket: 'Enam tahun berturut-turut angkanya turun, lalu melonjak di 2025.' },
            { label: 'Per zona', tipe: 'tumpuk', satuan: 'ha', sorot: '2025',
              seri: [ { nama: 'Hulu', warna: WZ.hulu, nilai: [375.88, 421.97, 258.52, 129.07, 97.18, 84.31, 6776.81] }, { nama: 'Tengah', warna: WZ.tengah, nilai: [390.14, 551.37, 224.30, 82.88, 81.19, 114.01, 1260.52] }, { nama: 'Hilir', warna: WZ.hilir, nilai: [295.14, 366.58, 303.88, 91.52, 50.67, 143.47, 321.27] } ],
              ket: '**81%** hutan yang hilang di 2025 ada di zona hulu (6.777 ha). Sebelumnya, hulu justru paling sedikit kehilangan.' },
            { label: 'Akumulasi', tipe: 'garis', satuan: 'ha', labelAkhir: true,
              seri: [ { nama: 'Hulu', warna: WZ.hulu, nilai: [0, 421.97, 680.49, 809.56, 906.74, 991.05, 7767.86] }, { nama: 'Tengah', warna: WZ.tengah, nilai: [0, 551.37, 775.67, 858.55, 939.74, 1053.75, 2314.27] }, { nama: 'Hilir', warna: WZ.hilir, nilai: [0, 366.58, 670.46, 761.98, 812.65, 956.12, 1277.39] } ],
              ket: 'Dihitung dari 2019 sebagai titik nol. Sampai 2024 ketiga zona berjalan beriringan, lalu garis hulu melompat sendirian.' },
            { label: 'Laju (%)', tipe: 'garis', satuan: '% hutan zona per tahun', satuanTip: '%', desimal: 2, labelAkhir: true,
              seri: [ { nama: 'Hulu', warna: WZ.hulu, nilai: [0, 0.17, 0.11, 0.05, 0.04, 0.03, 2.77] }, { nama: 'Tengah', warna: WZ.tengah, nilai: [0, 0.78, 0.32, 0.12, 0.12, 0.16, 1.81] }, { nama: 'Hilir', warna: WZ.hilir, nilai: [0, 10.26, 9.47, 3.15, 1.80, 5.19, 12.27] } ],
              ket: 'Laju = hutan hilang dibagi hutan yang tersisa tahun sebelumnya. Hilir kecil luasnya tapi lajunya paling tinggi: **12%** hutannya yang tersisa habis di 2025. Laju hulu naik sekitar **80 kali** dari 2024 ke 2025.' }
          ],
          catatan: '2019 dipakai sebagai tahun dasar untuk akumulasi dan laju.',
          sumber: 'Sumber: Kehilangan Tutupan Hutan KEL (HAkA) dipotong batas DAS dan zona, hasil analisis tim.'
        },
        { jenis: 'grafik-plus',
          subjudul: 'Berapa hutan yang *tersisa*',
          kategori: THN,
          tampilan: [
            { label: 'Total DAS', tipe: 'garis', nolBebas: true, satuan: 'ha', labelAkhir: true,
              seri: [ { nama: 'Luas hutan DAS', warna: '#26A69A', nilai: [319738.63, 318398.91, 317612.48, 317309.17, 317080.27, 316739.00, 308380.76] } ],
              ket: 'Sumbu tegak tidak mulai dari nol supaya perubahannya terlihat. Dari 2019 ke 2025 hutan DAS berkurang **11.358 ha** (3,6%).' },
            { label: 'Per zona (ha)', tipe: 'garis', satuan: 'ha', labelAkhir: true,
              seri: [ { nama: 'Hulu', warna: WZ.hulu, nilai: [245392.94, 244970.97, 244712.45, 244583.38, 244486.20, 244401.89, 237625.08] }, { nama: 'Tengah', warna: WZ.tengah, nilai: [70772.85, 70221.48, 69997.18, 69914.30, 69833.11, 69719.10, 68458.58] }, { nama: 'Hilir', warna: WZ.hilir, nilai: [3574.48, 3207.90, 2904.02, 2812.50, 2761.83, 2618.36, 2297.09] } ],
              ket: '77% hutan DAS ada di zona hulu. Itu sebabnya kehilangan di hulu paling berpengaruh ke seluruh DAS.' },
            { label: '% berhutan', tipe: 'kelompok', satuan: '% luas zona', satuanTip: '%', desimal: 2,
              seri: [ { nama: 'Hulu', warna: WZ.hulu, nilai: [89.30, 89.15, 89.06, 89.01, 88.97, 88.94, 86.48] }, { nama: 'Tengah', warna: WZ.tengah, nilai: [40.54, 40.22, 40.10, 40.05, 40.00, 39.94, 39.21] }, { nama: 'Hilir', warna: WZ.hilir, nilai: [3.17, 2.84, 2.57, 2.49, 2.45, 2.32, 2.04] } ],
              ket: 'Hulu 86% masih berhutan, tengah 39%, hilir tinggal 2%. Arahkan kursor ke batang untuk angka tepatnya.' }
          ],
          sumber: 'Sumber: Tutupan Hutan KEL 2019–2025 (HAkA), hasil analisis tim.'
        },
        { jenis: 'teks',
          subjudul: 'Kehilangan hutan di *lereng* mana',
          paragraf: [
            'Luas saja belum cukup. Yang lebih penting: hutannya hilang di tanah yang seperti apa. Kami bagi lereng DAS Tamiang jadi tiga kelas, lalu kami tumpuk dengan peta kehilangan hutan tiap tahun.',
            'Landai (di bawah 25%) itu dataran dan kaki bukit. Curam (25–40%) mulai rawan erosi. Sangat curam (di atas 40%, lebih dari 21,8°) adalah lereng yang kalau hutannya hilang, tanahnya gampang longsor dan ikut hanyut ke sungai.'
          ]
        },
        { jenis: 'peta-lereng',
          subjudul: 'Kehilangan hutan per kelas lereng di DAS Tamiang',
          folder: 'data/',
          tahun: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
          sorotKab: 'Aceh Tamiang',
          sumber: 'Sumber: Kehilangan Tutupan Hutan KEL (HAkA) ditumpang-susun dengan kelas lereng dari DEMNAS (BIG), hasil analisis tim (Deforestasi_Lereng_Kritis 2019–2025). Garis merah: batas DAS Tamiang (KLHK, DAS130029); area gelap di luar DAS. Tombol Kab. Aceh Tamiang saja memotong data ke batas kabupaten.'
        },
        { jenis: 'angka',
          isi: [
            { nilai: '8.358', satuan: 'ha', keterangan: 'Hutan hilang di lereng DAS Tamiang tahun 2025, dua kali lipat total enam tahun sebelumnya (4.057 ha)', sumber: 'Hasil analisis tim' },
            { nilai: '52', satuan: '%', keterangan: 'Porsi lereng sangat curam pada 2025 (4.339 ha). Tahun 2019–2024 hanya 11–24%', sumber: 'Hasil analisis tim' },
            { nilai: '604', satuan: 'ha', keterangan: 'Bagiannya di Kab. Aceh Tamiang, 11 kali lipat tahun 2024 (55 ha)', sumber: 'Hasil analisis tim' },
            { nilai: '3.270', satuan: 'ha', keterangan: 'Kec. Pining (Gayo Lues), hulu terparah, 61% di lereng sangat curam', sumber: 'Hasil analisis tim' }
          ]
        },
        { jenis: 'grafik-plus',
          subjudul: 'Lereng mana yang *paling* kena',
          kategori: THN,
          tampilan: [
            { label: 'Per tahun', tipe: 'tumpuk', satuan: 'ha', sorot: '2025',
              seri: [ { nama: 'Landai (<25%)', warna: WK[0], nilai: [659.0, 852.3, 460.3, 178.5, 146.0, 264.0, 1811.72] }, { nama: 'Curam (25–40%)', warna: WK[1], nilai: [241.1, 302.4, 134.4, 67.5, 48.0, 38.6, 2207.72] }, { nama: 'Sangat curam (>40%)', warna: WK[2], nilai: [160.3, 185.5, 190.7, 56.5, 34.8, 37.0, 4339.03] } ],
              ket: 'Sembunyikan kelas Landai lewat legenda: terlihat lereng curam dan sangat curam nyaris diam selama enam tahun, lalu meledak di 2025.' }
          ],
          sumber: 'Sumber: Deforestasi_Lereng_Kritis 2019–2025, hasil analisis tim.'
        },
        { jenis: 'grafik-plus',
          subjudul: '2025: luas dan *intensitasnya*',
          kategori: ['Landai', 'Curam', 'Sangat curam'],
          tampilan: [
            { label: 'Luas kehilangan', tipe: 'mendatar', satuan: 'ha', desimal: 2, labelBatang: ['21,7%', '26,4%', '51,9%'],
              seri: [ { nama: 'Kehilangan hutan 2025', warna: WK[0], warnaPer: WK, nilai: [1811.72, 2207.72, 4339.03] } ],
              ket: 'Lebih dari separuh hutan yang hilang di 2025 ada di lereng sangat curam.' },
            { label: 'Intensitas', tipe: 'batang', satuan: '% luas kelas lereng', satuanTip: '%', desimal: 2, labelNilai: 'semua',
              seri: [ { nama: 'Intensitas deforestasi 2025', warna: WK[0], warnaPer: WK, nilai: [0.65, 2.15, 2.44] } ],
              ket: 'Dibandingkan luas masing-masing kelas, lereng sangat curam kehilangan hutan **3,8 kali** lebih cepat daripada lereng landai (2,44% vs 0,65%).' }
          ],
          sumber: 'Sumber: Deforestasi_Lereng_Kritis 2025 dan kelas lereng DEMNAS, hasil analisis tim.'
        },
        { jenis: 'teks',
          subjudul: 'Apa yang *berubah* di 2025',
          paragraf: [
            '**2019–2024: hilangnya di dataran.** Selama enam tahun, sekitar enam dari sepuluh hektare hutan yang hilang ada di lereng landai. Pusatnya di Birem Bayeun (Aceh Timur) dan Sekerak (Aceh Tamiang), pola yang cocok dengan pembukaan lahan untuk kebun di kaki bukit. Jumlahnya juga terus turun, dari 1.340 ha di 2020 sampai sekitar 230–340 ha di 2023–2024.',
            '**2025: polanya terbalik.** Luasnya melonjak jadi 8.358 ha dan pindah ke atas. Lereng sangat curam menyumbang lebih dari separuh (4.339 ha), ditambah 2.208 ha lereng curam. Artinya hampir 8 dari 10 hektare yang hilang ada di lereng yang rawan longsor dan erosi.',
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
      judul: 'Kondisi vegetasi *tepi sungai*',
      pengantar: 'Sempadan sungai adalah penyangga terakhir sebelum air dan tanah masuk ke sungai.',
      blok: [
        { jenis: 'teks',
          subjudul: 'Koridor sempadan sungai',
          paragraf: [
            '**4.1 Koridor sempadan.** Sempadan didefinisikan sebagai zona penyangga 100 m di kiri dan kanan sungai, kemudian ditumpangsusunkan dengan tutupan hutan tahunan.',
            '**4.2 Klasifikasi kondisi.** Sempadan dikelompokkan menjadi berhutan, kritis (tidak berhutan), dan terdeforestasi pada tahun berjalan. Pada 2025 tercatat 25.782 ha berhutan dan 24.247 ha kritis.',
            '**4.3 Sebaran spasial.** Proporsi sempadan kritis meningkat ke arah hilir: 21% di Sub-DAS Simpang Kiri Hulu hingga 97% di Sub-DAS Cempegih.'
          ]
        },
        { jenis: 'peta-web',
          subjudul: 'Sempadan 100 m di kiri-kanan sungai',
          lapis: LAPIS,
          tab: [
            { label: 'Kondisi 2025', besar: '48%', judul: 'sempadan sudah terbuka', lapis: ['smp25'],
              angka: [ { keterangan: 'Masih berhutan', nilai: '25.782', satuan: 'ha' }, { keterangan: 'Rusak / non-hutan', nilai: '24.247', satuan: 'ha' } ],
              legenda: [ { warna: '#238B45', label: 'Berhutan alami (terjaga)' }, { warna: '#FA8C16', label: 'Rusak / non-hutan (kritis)' } ],
              teks: 'Perbesar ke hilir: hampir seluruh tepi sungai sudah jadi kebun dan permukiman.' },
            { label: 'Swipe 2019 ↔ 2025', besar: '+1.744 ha', judul: 'sempadan rusak bertambah', geser: { kiri: ['smp19'], kanan: ['smp25'], labelKiri: 'Sempadan 2019', labelKanan: 'Sempadan 2025' },
              angka: [ { keterangan: 'Rusak 2019', nilai: '22.503', satuan: 'ha' }, { keterangan: 'Rusak 2025', nilai: '24.247', satuan: 'ha' } ],
              legenda: [ { warna: '#238B45', label: 'Berhutan' }, { warna: '#FA8C16', label: 'Rusak / non-hutan' } ],
              petunjuk: 'Swipe bulatan putih untuk membandingkan.' },
            { label: 'Dibuka per tahun', besar: '1.744 ha', judul: 'hutan sempadan dibuka 2019–2025', lapis: ['smpDef'],
              angka: [ { keterangan: '2019–2024 (enam tahun)', nilai: '475', satuan: 'ha' }, { keterangan: '2025 saja', nilai: '1.268', satuan: 'ha' } ],
              legenda: [ { warna: '#FED976', label: '2019' }, { warna: '#FD8D3C', label: '2021' }, { warna: '#E31A1C', label: '2023' }, { warna: '#BD0026', label: '2024' }, { warna: '#FF1E6E', label: '2025' } ],
              teks: '84% hutan sempadan yang dibuka di 2025 ada di Sub-DAS Simpang Kiri Hulu (1.063 ha). Itu hulu sungai utamanya.' }
          ],
          sumber: 'Sumber: sempadan sungai 100 m (OSM) ditumpang-susun dengan tutupan hutan KEL, hasil analisis tim.'
        },
        { jenis: 'grafik',
          subjudul: 'Hutan sempadan yang dibuka tiap tahun',
          tipe: 'batang', satuan: 'ha', sorot: '2025',
          data: [ ['2019', 106], ['2020', 158], ['2021', 92], ['2022', 40], ['2023', 30], ['2024', 49], ['2025', 1268] ],
          sumber: 'Sumber: Deforestasi Sempadan Sungai 2019–2025, hasil analisis tim'
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
      judul: 'Karakteristik *curah hujan*',
      pengantar: 'Kehilangan hutan memperparah dampak, tetapi pemicunya tetap hujan ekstrem.',
      blok: [
        { jenis: 'teks',
          subjudul: 'Curah hujan historis dan kejadian November 2025',
          paragraf: [
            '**5.1 Curah hujan historis.** Curah hujan tahunan rata-rata DAS (CHIRPS) berkisar 2.453–3.933 mm selama 2019–2025. Nilai 2025 sebesar 3.549 mm berada di atas rata-rata, tetapi bukan yang tertinggi.',
            '**5.2 Intensitas November 2025.** Data GPM IMERG resolusi 30 menit menunjukkan hujan lebat bergelombang pada 24–27 November 2025 dengan intensitas puncak 35,15 mm/jam pada 26 November pukul 04.30 WIB.',
            '**5.3 Sebaran spasial.** Akumulasi hujan 24–26 November tidak merata di seluruh DAS dan digunakan sebagai konteks dalam membaca pola genangan.'
          ]
        },
        { jenis: 'grafik-plus',
          subjudul: 'Curah hujan tahunan (CHIRPS)',
          ringkas: [ { nilai: '3.549', satuan: 'mm', keterangan: 'Hujan 2025, kedua tertinggi sejak 2019' }, { nilai: '3.154', satuan: 'mm', keterangan: 'Rata-rata 2019–2025' }, { nilai: '+12', satuan: '%', keterangan: '2025 di atas rata-rata' } ],
          kategori: THN,
          tampilan: [ { label: 'Tahunan', tipe: 'batang', satuan: 'mm/tahun', sorot: '2025', labelNilai: 'semua', rujukan: { nilai: 3154, label: 'Rata-rata 3.154 mm' },
              seri: [ { nama: 'Curah hujan rata-rata DAS', warna: '#6F8FF0', warnaPer: ['#6F8FF0', '#6F8FF0', '#6F8FF0', '#6F8FF0', '#6F8FF0', '#6F8FF0', '#E4477A'], nilai: [2453, 3014, 3251, 3933, 3054, 2820, 3549] } ],
              ket: 'Tahun 2022 malah lebih basah (3.933 mm), tapi hutan yang hilang tahun itu cuma 303 ha, dan banjirnya tidak sebesar 2025. Jadi **jumlah hujan setahun saja tidak cukup** menjelaskan banjir 2025. Yang membedakan adalah hujan ekstrem dalam beberapa hari.' } ],
          sumber: 'Sumber: CHIRPS, rata-rata spasial DAS Tamiang, hasil analisis tim.'
        },
        { jenis: 'teks',
          subjudul: 'Hujan *harian* dan bulanan',
          paragraf: [
            'Dari data harian CHIRPS, selama 2019–2024 puncak hujan rata-rata DAS tidak pernah lebih dari sekitar 56 mm per hari. Tahun 2025 dua kali jauh melampauinya: sekitar April 2025 (hampir 90 mm) dan akhir November 2025, **lebih dari 100 mm dalam sehari**, tertinggi selama tujuh tahun.',
            'Secara bulanan, November 2025 juga jadi bulan terbasah dalam periode 2019–2025, sekitar 570 mm dalam sebulan. Itu hampir seperlima hujan setahun yang turun hanya dalam satu bulan.'
          ]
        },
        { jenis: 'angka', isi: [
          { nilai: '35,15', satuan: 'mm/jam', keterangan: 'Puncak intensitas hujan rata-rata DAS, 26 Nov 2025 pukul 04.30 WIB', sumber: 'IMERG Late V07B' },
          { nilai: '7,60', satuan: 'mm/jam', keterangan: 'Rata-rata intensitas selama periode pengamatan 24–28 Nov 2025', sumber: 'IMERG Late V07B' }
        ]},
        { jenis: 'teks',
          subjudul: 'Detik-detik 24–27 November 2025 (IMERG)',
          paragraf: [
            'Data IMERG per 30 menit memperlihatkan hujan datang bergelombang. Mulai 25 November pagi intensitasnya naik ke 20–23 mm/jam, malamnya menembus 30 mm/jam, lalu puncaknya **35,15 mm/jam pada 26 November pukul 04.30 WIB**. Siangnya masih ada gelombang 25 mm/jam sebelum mereda.',
            'Hujan selebat ini selama hampir dua hari jatuh di atas lereng hulu yang hutannya baru saja terbuka. Air tidak sempat meresap. Ia langsung mengalir ke sungai, membawa tanah, lalu menumpuk di dataran hilir.'
          ]
        }
      ]
    },

    /* ===== 6. DISTRIBUSI GENANGAN BANJIR ===== */
    { label: 'Genangan',
      judul: 'Sebaran *genangan banjir*',
      pengantar: 'Ke mana air pergi setelah turun dari hulu.',
      blok: [
        { jenis: 'teks',
          subjudul: 'Sebaran genangan',
          paragraf: [
            '**6.1 Luas genangan.** Berdasarkan citra UNOSAT 28 November 2025, genangan di dalam DAS Tamiang mencapai sekitar 10.035 ha.',
            '**6.2 Distribusi per zona.** Sebanyak 92% genangan (9.217 ha) berada di zona hilir dan 818 ha di zona tengah; tidak terdeteksi genangan di zona hulu.',
            '**6.3 Kesesuaian dengan indeks bahaya.** Sekitar 85% genangan berada pada kelas bahaya tinggi dan sangat tinggi, yaitu dataran rendah di sekitar sungai. Genangan merupakan hasil kombinasi berbagai faktor, bukan satu penyebab tunggal.'
          ]
        },
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
              teks: 'Peta indeks bahaya banjir hasil analisis tim. Kelas rendah dan sangat rendah tidak ditampilkan supaya peta tetap ringan.' },
            { label: 'Bahaya vs kejadian', besar: '±85%', judul: 'genangan jatuh di kelas bahaya tinggi–sangat tinggi', lapis: ['bahaya', 'genangan'], fit: HILIR,
              legenda: [ { warna: '#D7191C', label: 'Bahaya sangat tinggi' }, { warna: '#EB8D00', label: 'Bahaya tinggi' }, { warna: '#1E90FF', label: 'Genangan 28 Nov 2025' } ],
              angka: [ { keterangan: 'Di kelas tinggi', nilai: '±69', satuan: '%' }, { keterangan: 'Di kelas sangat tinggi', nilai: '±16', satuan: '%' }, { keterangan: 'Di kelas sedang', nilai: '±17', satuan: '%' } ],
              teks: 'Sebagian besar genangan nyata jatuh di wilayah yang memang dinilai berbahaya. Artinya peta bahaya ini bisa dipakai untuk siaga di banjir berikutnya. (Angka dari tumpang-susun peta yang sudah disederhanakan, jadi dibulatkan.)' }
          ],
          sumber: 'Sumber: UNOSAT (FL20251126IDN, citra 28 Nov 2025); indeks bahaya banjir hasil analisis tim; zona DAS hasil analisis tim.'
        },
        { jenis: 'angka', isi: [
          { nilai: '10.035', satuan: 'ha', keterangan: 'Genangan di dalam DAS Tamiang', sumber: 'UNOSAT, hasil analisis tim' },
          { nilai: '92', satuan: '%',  keterangan: 'Genangan berada di zona hilir', sumber: 'Hasil analisis tim' },
          { nilai: '11,3', satuan: 'km', keterangan: 'Jalan yang terendam, termasuk Jalan Raya Medan–Banda Aceh', sumber: 'OSM + UNOSAT' }
        ]}
      ]
    },

    /* ===== 7. PAPARAN WILAYAH HILIR ===== */
    { label: 'Paparan hilir',
      judul: 'Paparan *wilayah hilir*',
      pengantar: 'Siapa dan apa yang berada di wilayah tergenang.',
      blok: [
        { jenis: 'teks',
          subjudul: 'Paparan penduduk, lahan, dan infrastruktur',
          paragraf: [
            '**7.1 Penduduk terpapar.** Estimasi berbasis proporsi luas desa tergenang menunjukkan 34.956 jiwa (9.763 KK) di 219 desa berada di wilayah genangan.',
            '**7.2 Lahan pertanian.** Pemkab Aceh Tamiang mencatat 8.242 ha lahan pertanian terdampak; 75% di antaranya berada di Kecamatan Manyak Payed, Bendahara, Banda Mulia, dan Karang Baru.',
            '**7.3 Infrastruktur.** Sepanjang 11,3 km jalan tergenang, termasuk ruas Medan–Banda Aceh. Tercatat pula 543 fasilitas pendidikan, 192 fasilitas kesehatan, dan 724 sarana ibadah rusak di tingkat kabupaten.',
            '**7.4 Sebaran administratif.** Penduduk terpapar terbanyak berada di Kecamatan Manyak Payed (9.130 jiwa), diikuti Banda Mulia, Bendahara, dan Karang Baru.'
          ]
        },
        { jenis: 'angka', isi: [
          { nilai: '543', satuan: 'unit', keterangan: 'Fasilitas pendidikan rusak', sumber: 'Pemkab Aceh Tamiang' },
          { nilai: '192', satuan: 'unit', keterangan: 'Fasilitas kesehatan rusak', sumber: 'Pemkab Aceh Tamiang' },
          { nilai: '724', satuan: 'unit', keterangan: 'Sarana ibadah rusak', sumber: 'Pemkab Aceh Tamiang' },
          { nilai: '1.396', satuan: 'jiwa', keterangan: 'Warga mengungsi di 13 titik pengungsian', sumber: 'Pemkab Aceh Tamiang' }
        ]},
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
            { label: 'Lahan pertanian', besar: '8.242 ha', judul: 'lahan pertanian terdampak di Aceh Tamiang', lapis: ['tani', 'genanganTipis'], fit: TAMIANG,
              angka: [ { keterangan: 'Terluas: Kec. Manyak Payed', nilai: '2.424', satuan: 'ha' }, { keterangan: 'Empat kecamatan teratas', nilai: '75', satuan: '%' }, { keterangan: 'Kecamatan terdampak', nilai: '11 dari 12', satuan: '' } ],
              legenda: [ { warna: '#A34E0F', label: '2.000 ha ke atas' }, { warna: '#D9771E', label: '1.200–1.999 ha' }, { warna: '#F4A93C', label: '600–1.199 ha' }, { warna: '#FCD581', label: '250–599 ha' }, { warna: '#FFF3C4', label: '1–249 ha' }, { warna: '#5BB8FF', label: 'Genangan 28 Nov 2025' } ],
              teks: 'Empat kecamatan di dataran hilir (Manyak Payed, Bendahara, Banda Mulia, Karang Baru) menanggung tiga perempat kerusakan lahan pertanian. Itu persis wilayah dengan genangan terluas.',
              petunjuk: 'Klik kecamatan untuk melihat luas lahan pertanian yang terdampak.' },
            { label: 'Sawah & kebun 2025', besar: 'Lahan', judul: 'pertanian dan kebun di bawah genangan', lapis: ['lahanTani', 'genanganTipis'], fit: HILIR,
              legenda: [ { warna: '#FFDB5C', label: 'Pertanian & tanaman semusim' }, { warna: '#C28441', label: 'Kebun kelapa sawit' }, { warna: '#5BB8FF', label: 'Genangan 28 Nov 2025' } ],
              teks: 'Tumpang-susun tutupan lahan 2025 dengan genangan: sebagian besar dataran hilir adalah sawah, ladang, dan kebun, jadi setiap banjir besar langsung jadi kerugian panen.' },
            { label: 'Jalan terendam', besar: '11,3 km', judul: 'jalan terendam (59 ruas)', lapis: ['genanganTipis', 'jalan', 'jalanAir'],
              legenda: [ { warna: '#FF3D7F', label: 'Jalan terendam', garis: true }, { warna: '#F4E9C8', label: 'Jalan utama', garis: true }, { warna: '#5BB8FF', label: 'Genangan' } ],
              teks: 'Termasuk 220 m Jalan Raya Medan–Banda Aceh, jalur utama Sumatra. Kalau jalan ini putus, bantuan dan evakuasi ikut tertahan.' }
          ],
          sumber: 'Sumber: genangan UNOSAT; batas & penduduk desa Dukcapil; lahan pertanian terdampak cekdatabencana.acehtamiangkab.go.id; tutupan lahan 2025; jalan OpenStreetMap; hasil analisis tim.'
        },
        { jenis: 'grafik-plus',
          subjudul: 'Lahan pertanian terdampak *per kecamatan*',
          ringkas: [ { nilai: '8.242', satuan: 'ha', keterangan: 'Total lahan pertanian terdampak banjir 2025' }, { nilai: '29,4', satuan: '%', keterangan: 'Ada di Kec. Manyak Payed saja' }, { nilai: '75', satuan: '%', keterangan: 'Di empat kecamatan teratas' } ],
          kategori: ['Manyak Payed', 'Bendahara', 'Banda Mulia', 'Karang Baru', 'Rantau', 'Seruway', 'Kejuruan Muda', 'Bandar Pusaka', 'Tamiang Hulu', 'Tenggulun', 'Sekerak', 'Kota Kuala Simpang'],
          tampilan: [
            { label: 'Luas', tipe: 'mendatar', satuan: 'ha', labelBatang: ['29,4%', '19,0%', '14,3%', '12,2%', '7,2%', '6,3%', '4,7%', '3,1%', '2,0%', '1,2%', '0,7%', '0,0%'],
              seri: [ { nama: 'Lahan pertanian terdampak', warna: '#F4A93C', nilai: [2424, 1569, 1177, 1007, 592, 516, 384, 254, 162, 97, 60, 0] } ],
              ket: 'Makin ke hilir, makin luas lahan yang rusak. Kecamatan hulu seperti Tamiang Hulu, Tenggulun, dan Sekerak hanya kena di bawah 200 ha.' },
            { label: 'Kumulatif (%)', tipe: 'garis', maks: 100, satuan: '% kumulatif', satuanTip: '%', desimal: 1, labelAkhir: true,
              seri: [ { nama: 'Persentase kumulatif', warna: '#F4A93C', nilai: [29.4, 48.4, 62.7, 74.9, 82.1, 88.4, 93.0, 96.1, 98.1, 99.3, 100, 100] } ],
              ket: 'Dua kecamatan saja sudah hampir separuh (48%), empat kecamatan tiga perempat (75%).' }
          ],
          sumber: 'Sumber: cekdatabencana.acehtamiangkab.go.id, hasil analisis tim.'
        },
        { jenis: 'galeri',
          subjudul: 'Yang terekam di *lapangan*',
          paragraf: [ 'Angka dan peta di atas punya wajah. Tiga foto ini memperlihatkan banjir Tamiang dari udara: permukiman yang terendam, kayu gelondongan yang menumpuk, dan kampung yang porak-poranda setelah air surut.' ],
          foto: [
            { file: 'foto/foto-masjid-kayu-2025.jpg', keterangan: 'Masjid dikepung ribuan batang kayu gelondongan yang terbawa banjir bandang, Aceh Tamiang, akhir 2025.', sumber: 'Antara Foto (via Instagram)', tautan: 'https://www.instagram.com/p/DShvKcPiZ2t/?img_index=1' },
            { file: 'foto/foto-pascabanjir-2025.jpg', keterangan: 'Kampung di Aceh Tamiang setelah diterjang banjir bandang: rumah hancur, jalan tertutup lumpur dan puing.', sumber: 'Liputan6.com', tautan: 'https://www.liputan6.com/photo/read/6229537/potret-aceh-tamiang-pasca-terjangan-banjir-bandang-sumatra' },
            { file: 'foto/foto-banjir-2022.jpg', keterangan: 'Banjir November 2022: permukiman di Aceh Tamiang terendam air cokelat. Tiga tahun kemudian bencananya jauh lebih besar.', sumber: 'Kompas.com, 6 Nov 2022', tautan: 'https://regional.kompas.com/image/2022/11/06/142128578/hari-keenam-banjir-aceh-tamiang-1-warga-tewas?page=1' }
          ]
        }
      ]
    },

    /* ===== 8. SINTESIS DAN REKOMENDASI ===== */
    { label: 'Sintesis',
      judul: 'Sintesis dan *rekomendasi*',
      pengantar: 'Menyatukan temuan dari hulu sampai hilir.',
      blok: [
        { jenis: 'video', otomatis: true,
          subjudul: 'Dari hulu ke hilir dalam *30 detik*',
          file: 'video/air-dari-hulu-v4.mp4', poster: 'video/animasi-poster.jpg',
          keterangan: 'Perjalanan air di DAS Tamiang: hutan hulu, tutupan hutan yang hilang sejak 2020, hujan lebat akhir November 2025, hingga genangan di hilir. Data dari KLHK, HAkA, DEMNAS, NASA IMERG, UNOSAT, dan Dukcapil, diolah tim.'
        },
        { jenis: 'teks',
          paragraf: [
            '**8.1 Integrasi hulu–hilir.** Pada 2025, kehilangan 8.358 ha hutan hulu, separuhnya di lereng sangat curam, dan terbukanya 1.268 ha sempadan bertepatan dengan hujan berintensitas tinggi. Kombinasi ini berkaitan dengan genangan 10.035 ha di dataran hilir.',
            '**8.2 Wilayah prioritas.** Prioritas mitigasi mencakup lereng curam terbuka di hulu (Pining, Serbajadi, Tamiang Hulu) serta dataran hilir dengan paparan penduduk tertinggi (Manyak Payed, Bendahara, Banda Mulia, Karang Baru).'
          ],
        },
        { jenis: 'peta-web',
          subjudul: 'Satu peta, hulu sampai hilir',
          lapis: LAPIS,
          tab: [
            { label: 'Hulu', besar: '8.358 ha', judul: 'kehilangan hutan 2025', lapis: ['zonaGaris', 'hutanStatus'],
              teks: 'Hutan di punggung hulu hilang, sebagian besar di lereng sangat curam.',
              legenda: [ { warna: '#FFD400', label: 'Kehilangan hutan 2025' }, { warna: '#238B45', label: 'Tutupan hutan stabil' } ] },
            { label: 'Sungai', besar: '1.268 ha', judul: 'hutan sempadan dibuka 2025', lapis: ['zonaGaris', 'smpDef', 'sungai'],
              teks: 'Penyangga di tepi sungai ikut terbuka, terutama di Simpang Kiri Hulu.',
              legenda: [ { warna: '#FF1E6E', label: 'Sempadan dibuka' }, { warna: '#5BB8FF', label: 'Sungai', garis: true } ] },
            { label: 'Hilir', besar: '34.956', judul: 'jiwa terpapar genangan', lapis: ['desaJiwa', 'genangan'], fit: HILIR,
              teks: 'Air dan lumpur berkumpul di dataran hilir, tempat permukiman paling padat.',
              legenda: [ { warna: '#1E90FF', label: 'Genangan' }, { warna: '#E34A33', label: 'Desa terpapar' } ] },
            { label: 'Semuanya', besar: 'Satu DAS', lapis: ['zonaGaris', 'hutanStatus', 'smpDef', 'genangan'], fit: 'das',
              teks: 'Kehilangan hutan di hulu, sempadan terbuka di tengah, genangan di hilir. Semuanya dalam satu garis merah yang sama.',
              legenda: [ { warna: '#FFD400', label: 'Kehilangan hutan 2025' }, { warna: '#FF1E6E', label: 'Sempadan dibuka' }, { warna: '#1E90FF', label: 'Genangan' } ] }
          ],
          sumber: 'Sumber: gabungan seluruh data di atas, hasil analisis tim.'
        },
        { jenis: 'kutipan',
          teks: 'Lam hudep tameusare, lam meugle tameubila, lam lampoh tameutulong alang, lam meublang tameusyedara.',
          sumber: 'Hadih maja (petuah adat Aceh)',
          paragraf: [ 'Petuah ini mengajarkan bahwa hidup bersama di Aceh berarti saling menjaga, di hutan, di kebun, dan di sawah. Menjaga hutan hulu bukan hanya urusan orang yang tinggal di gunung, tetapi juga tanggung jawab bersama warga hilir yang hidupnya bergantung pada air yang sama.' ]
        },
        { jenis: 'kartu',
          subjudul: '8.3 Rekomendasi',
          isi: [
            { warna: 'merah', label: 'Hulu', judul: 'Pulihkan dan lindungi', teks: 'Lindungi hutan yang tersisa dan pulihkan lereng curam serta sempadan sungai yang sudah terbuka.' },
            { warna: 'hijau', label: 'Tengah', judul: 'Tata ruang berbasis risiko', teks: 'Atur penggunaan lahan di sepanjang sungai dengan memperhatikan peta bahaya banjir.' },
            { warna: 'biru',  label: 'Hilir', judul: 'Siaga bersama warga', teks: 'Pantau hujan di hulu sebagai peringatan dini, dan siapkan jalur evakuasi di desa-desa hilir.' }
          ]
        }
      ]
    }
  ],

  /* ---------- PENUTUP ---------- */
  penutup: {
    judul: 'Menjaga hulu, *melindungi hilir*',
    teks: 'DAS Tamiang menunjukkan bahwa hutan, hujan, dan kehidupan warga saling terhubung. Banjir di hilir berawal dari apa yang terjadi di hulu. Selama hutan Leuser di hulu terjaga, air punya tempat untuk meresap dan warga di hilir punya waktu untuk bersiap.'
  },
  sumberData: [
    'Batas DAS Tamiang: KLHK, Batas DAS se-Indonesia',
    'Batas KEL serta tutupan dan kehilangan hutan: Yayasan HAkA (data dasar panitia)',
    'Batas kecamatan dan desa: BIG 2025 dan Dukcapil',
    'Ketinggian dan kemiringan lereng: DEMNAS (BIG)',
    'Curah hujan: CHIRPS dan NASA GPM IMERG',
    'Genangan banjir: UNOSAT, citra 28 November 2025',
    'Jaringan jalan: OpenStreetMap',
    'Data korban, kerusakan, dan lahan pertanian terdampak: Pemkab Aceh Tamiang (cekdatabencana.acehtamiangkab.go.id)',
    'Foto lapangan: Kompas.com, Antara Foto, dan Liputan6.com'
  ],
  metode: 'Seluruh data diolah tim menggunakan QGIS. Perhitungan luas memakai sistem koordinat UTM zona 47N (EPSG:32647).',
  catatanAI: ''
};
