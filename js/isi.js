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
  logoKanan: [ { file: 'foto/logo-usk.png', nama: 'Logo Universitas Syiah Kuala' },
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
      judul: 'Akhir November 2025, air datang membawa lumpur dan kayu',
      blok: [
        { jenis: 'teks', paragraf: [
          'Ceritakan singkat kejadian banjir di DAS Tamiang: kapan, di mana, seberapa parah.',
          'Lalu ajukan pertanyaan yang mau dijawab storymap ini: apa yang terjadi di hulu sebelum air sampai ke hilir?'
        ]},
        { jenis: 'angka', isi: [
          { nilai: '494.988', satuan: 'ha',  keterangan: 'Luas DAS Tamiang', sumber: 'Data dasar panitia (HAkA)' },
          { nilai: '…',       satuan: 'ha',  keterangan: 'Luas genangan 28 November 2025', sumber: 'UNOSAT' },
          { nilai: '…',       satuan: 'desa', keterangan: 'Desa yang terpapar banjir', sumber: 'Olahan tim' },
          { nilai: '8.026',   satuan: 'ha',  keterangan: 'Hutan hilang di DAS Tamiang sepanjang 2025', sumber: 'Data dasar panitia (HAkA)' }
        ]}
      ]
    },

    /* ===== 1. MENGENAL DAS TAMIANG ===== */
    { label: 'Mengenal DAS',
      judul: 'Kenalan dulu dengan *DAS Tamiang*',
      pengantar: 'Gulir pelan-pelan, petanya ikut berganti.',
      blok: [
        { jenis: 'peta-scroll', langkah: [
          { peta: 'peta/01-lokasi-das-kel.png', judul: 'Di mana letaknya', teks: 'Posisi DAS Tamiang di Aceh dan irisannya dengan Kawasan Ekosistem Leuser.', sumber: 'Sumber: batas DAS dan KEL (data dasar panitia)' },
          { peta: 'peta/01-administrasi.png', judul: 'Masuk wilayah siapa', teks: 'Kabupaten, kecamatan, dan desa yang ada di dalam DAS.', sumber: 'Sumber: BIG 2025, Dukcapil' },
          { peta: 'peta/01-hulu-tengah-hilir.png', judul: 'Hulu, tengah, hilir', teks: 'Pembagian zona DAS dan lima sub-DAS. Hulunya di pegunungan, hilirnya di pesisir Selat Malaka.', sumber: 'Sumber: zona dan sub-DAS olahan tim' }
        ]}
      ]
    },

    /* ===== 2. KONDISI FISIK HULU ===== */
    { label: 'Kondisi fisik',
      judul: 'Seperti apa *bentuk* hulunya',
      pengantar: 'Klik tiap tab untuk melihat petanya.',
      blok: [
        { jenis: 'peta-tab',
          subjudul: 'Elevasi, lereng, dan sungai',
          tab: [
            { label: 'Elevasi', peta: 'peta/02-elevasi.png', teks: 'Bagian mana yang tinggi dan mana yang rendah.',
              angka: [ { keterangan: 'Titik tertinggi', nilai: '…', satuan: 'mdpl' }, { keterangan: 'Titik terendah', nilai: '…', satuan: 'mdpl' } ],
              sumber: 'Sumber: DEMNAS (BIG)' },
            { label: 'Kemiringan lereng', peta: 'peta/02-lereng.png', teks: 'Lereng curam lebih mudah longsor kalau hutannya hilang.',
              angka: [ { keterangan: 'Luas lereng > 25%', nilai: '…', satuan: 'ha' } ],
              sumber: 'Sumber: turunan DEMNAS, olahan tim' },
            { label: 'Jaringan sungai', peta: 'peta/02-sungai.png', teks: 'Anak-anak sungai yang berkumpul ke Sungai Tamiang.',
              angka: [ { keterangan: 'Panjang sungai utama', nilai: '…', satuan: 'km' } ],
              sumber: 'Sumber: turunan DEM, olahan tim' }
          ]
        }
      ]
    },

    /* ===== 3. DINAMIKA TUTUPAN HUTAN ===== */
    { label: 'Tutupan hutan',
      judul: 'Hutannya *berkurang* dari tahun ke tahun',
      pengantar: 'Tiga cara melihat perubahan hutan di DAS Tamiang.',
      blok: [
        { jenis: 'perbandingan',
          subjudul: 'Geser: 2018 dibanding 2025',
          kiri:  { gambar: 'peta/03-tutupan-2018.png', label: '2018' },
          kanan: { gambar: 'peta/03-tutupan-2025.png', label: '2025' },
          sumber: 'Sumber: tutupan hutan KEL (data dasar panitia), olahan tim'
        },
        { jenis: 'peta-interaktif',
          subjudul: 'Klik tahunnya: di mana hutan hilang',
          paragraf: [ 'Peta ini bisa digeser dan diperbesar. Klik tahun untuk berganti data, lalu klik kecamatan mana saja untuk melihat angkanya per tahun.' ],
          folder: 'data/',
          tahun: [2019, 2020, 2024, 2025],
          sorotKab: 'Aceh Tamiang',
          legenda: [ { warna: '#DDA15E', label: 'Hutan hilang' }, { warna: '#BC6C25', label: 'Hilang Nov–Des 2025 (saat bencana)' }, { warna: 'rgba(221,161,94,.35)', label: 'Warna kecamatan: makin pekat, makin banyak hilang' } ],
          sumber: 'Sumber: Kehilangan Tutupan Hutan KEL (HAkA, data dasar panitia); batas kecamatan BIG 2025; olahan tim. Tahun 2021–2023 ditambahkan setelah file .shp-nya tersedia.'
        },
        { jenis: 'grafik',
          subjudul: 'Kalau dijadikan grafik',
          tipe: 'batang', satuan: 'ha', sorot: '2025',
          data: [ ['2019', 776], ['2020', 1001], ['2021', 489], ['2022', 240], ['2023', 199], ['2024', 229], ['2025', 8026] ],
          catatan: 'Angka dari tabel data dasar panitia (lembar DAS). Ganti kalau hasil olahan kalian berbeda.',
          sumber: 'Sumber: HAkA'
        },
        { jenis: 'peta-tab',
          subjudul: 'Hutan hilang di lereng mana',
          tab: [
            { label: 'Landai', peta: 'peta/03-lereng-landai.png', angka: [ { keterangan: 'Hutan hilang 2025', nilai: '…', satuan: 'ha' } ] },
            { label: 'Curam', peta: 'peta/03-lereng-curam.png', angka: [ { keterangan: 'Hutan hilang 2025', nilai: '…', satuan: 'ha' } ] },
            { label: 'Sangat curam', peta: 'peta/03-lereng-sangat-curam.png', angka: [ { keterangan: 'Hutan hilang 2025', nilai: '…', satuan: 'ha' } ],
              teks: 'Di lereng seperti ini, tanah gampang longsor dan ikut terbawa ke sungai.' }
          ],
          sumber: 'Sumber: deforestasi lereng kritis 2025, olahan tim'
        }
      ]
    },

    /* ===== 4. VEGETASI DAN SEMPADAN SUNGAI ===== */
    { label: 'Sempadan sungai',
      judul: 'Bagaimana kondisi *pinggir sungainya*',
      pengantar: 'Sempadan sungai (100 meter dari tepi) adalah benteng terakhir sebelum air dan tanah masuk ke sungai.',
      blok: [
        { jenis: 'peta-tab',
          subjudul: 'Tiga kondisi sempadan',
          tab: [
            { label: 'Zona kritis', peta: 'peta/04-sempadan-kritis.png', angka: [ { keterangan: 'Panjang / luas', nilai: '…', satuan: 'ha' } ], teks: 'Bagian sungai yang paling perlu dipulihkan.' },
            { label: 'Terdeforestasi', peta: 'peta/04-sempadan-deforestasi.png', angka: [ { keterangan: 'Hilang 2019–2025', nilai: '…', satuan: 'ha' } ] },
            { label: 'Masih berhutan', peta: 'peta/04-sempadan-berhutan.png', angka: [ { keterangan: 'Masih berhutan', nilai: '…', satuan: 'ha' } ] }
          ],
          sumber: 'Sumber: sempadan sungai 100 m dan tutupan hutan, olahan tim'
        },
        { jenis: 'peta-tab', waktu: true, putar: true,
          subjudul: 'Kerusakan sempadan dari tahun ke tahun',
          tab: [
            { label: '2019', peta: 'peta/04-sempadan-2019.png', angka: [ { keterangan: 'Sempadan rusak', nilai: '…', satuan: 'ha' } ] },
            { label: '2020', peta: 'peta/04-sempadan-2020.png', angka: [ { keterangan: 'Sempadan rusak', nilai: '…', satuan: 'ha' } ] },
            { label: '2021', peta: 'peta/04-sempadan-2021.png', angka: [ { keterangan: 'Sempadan rusak', nilai: '…', satuan: 'ha' } ] },
            { label: '2022', peta: 'peta/04-sempadan-2022.png', angka: [ { keterangan: 'Sempadan rusak', nilai: '…', satuan: 'ha' } ] },
            { label: '2023', peta: 'peta/04-sempadan-2023.png', angka: [ { keterangan: 'Sempadan rusak', nilai: '…', satuan: 'ha' } ] },
            { label: '2024', peta: 'peta/04-sempadan-2024.png', angka: [ { keterangan: 'Sempadan rusak', nilai: '…', satuan: 'ha' } ] },
            { label: '2025', peta: 'peta/04-sempadan-2025.png', angka: [ { keterangan: 'Sempadan rusak', nilai: '…', satuan: 'ha' } ] }
          ]
        },
        { jenis: 'peta-tab', waktu: true, putar: true,
          subjudul: 'Kehijauan vegetasi (NDVI)',
          tab: [
            { label: '2019', peta: 'peta/04-ndvi-2019.png', angka: [ { keterangan: 'NDVI rata-rata', nilai: '…', satuan: '' } ] },
            { label: '2021', peta: 'peta/04-ndvi-2021.png', angka: [ { keterangan: 'NDVI rata-rata', nilai: '…', satuan: '' } ] },
            { label: '2023', peta: 'peta/04-ndvi-2023.png', angka: [ { keterangan: 'NDVI rata-rata', nilai: '…', satuan: '' } ] },
            { label: '2025', peta: 'peta/04-ndvi-2025.png', angka: [ { keterangan: 'NDVI rata-rata', nilai: '…', satuan: '' } ] },
            { label: '2026', peta: 'peta/04-ndvi-2026.png', angka: [ { keterangan: 'NDVI rata-rata', nilai: '…', satuan: '' } ], teks: 'Setelah banjir.' }
          ],
          legenda: [ { warna: '#a3542c', label: 'Jarang / terbuka' }, { warna: '#e6d77a', label: 'Sedang' }, { warna: '#2f6b47', label: 'Rapat' } ],
          sumber: 'Sumber: NDVI, olahan tim'
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
        { jenis: 'teks',
          paragraf: [ 'Ceritakan sebaran genangan 28 November 2025: daerah mana yang paling luas tergenang, dan bagaimana kaitannya dengan zona hilir.' ],
          gambar: { file: 'peta/06-genangan-unosat.png', keterangan: 'Genangan banjir 28 November 2025. Sumber: UNOSAT, olahan tim.' }
        },
        { jenis: 'angka', isi: [
          { nilai: '…', satuan: 'ha', keterangan: 'Total luas genangan', sumber: 'UNOSAT' },
          { nilai: '…', satuan: '%',  keterangan: 'Genangan di zona hilir', sumber: 'Olahan tim' },
          { nilai: '…', satuan: 'km', keterangan: 'Jalan yang terendam', sumber: 'OSM + UNOSAT' }
        ]}
      ]
    },

    /* ===== 7. PAPARAN WILAYAH HILIR ===== */
    { label: 'Paparan hilir',
      judul: 'Siapa dan apa yang *terkena*',
      pengantar: 'Klik kategorinya.',
      blok: [
        { jenis: 'peta-tab',
          tab: [
            { label: 'Permukiman', peta: 'peta/07-permukiman.png', angka: [ { keterangan: 'Permukiman tergenang', nilai: '…', satuan: 'ha' } ] },
            { label: 'Pertanian', peta: 'peta/07-pertanian.png', angka: [ { keterangan: 'Lahan pertanian tergenang', nilai: '…', satuan: 'ha' } ] },
            { label: 'Infrastruktur', peta: 'peta/07-infrastruktur.png', angka: [ { keterangan: 'Jalan terendam', nilai: '…', satuan: 'km' } ] },
            { label: 'Desa', peta: 'peta/07-desa-terpapar.png', angka: [ { keterangan: 'Desa terpapar', nilai: '…', satuan: 'desa' }, { keterangan: 'Kecamatan', nilai: '…', satuan: '' } ] }
          ],
          sumber: 'Sumber: genangan UNOSAT, batas desa Dukcapil, jalan OSM, olahan tim'
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
          gambar: { file: 'peta/08-sintesis.png', keterangan: 'Peta sintesis hulu–hilir. Sumber: olahan tim.' }
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
