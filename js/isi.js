/* =====================================================================
   ISI STORYMAP — HANYA FILE INI YANG PERLU DIUBAH
   ---------------------------------------------------------------------
   Cara mengisi:
   • Ganti teks di antara tanda kutip '...'. Jangan hapus tanda kutip,
     koma, atau kurung { } [ ].
   • Peta  : simpan gambar hasil ekspor QGIS (PNG/JPG) ke folder "peta/",
             lalu tulis nama filenya di bawah (misal 'peta/peta-1.png').
   • Foto  : simpan ke folder "foto/".
   • Kalau file gambar belum ada, halaman menampilkan kotak penanda
     berisi nama file yang harus kamu tambahkan.
   • Jenis bagian yang tersedia: 'teks', 'peta-scroll', 'angka',
     'grafik', 'perbandingan', 'kutipan', 'kartu', 'tabel', 'galeri',
     'peta-web'. Hapus bagian yang tidak dipakai, atau salin untuk menambah.
   ===================================================================== */

window.ISI = {

  /* ---------- 1. IDENTITAS (elemen wajib lomba) ---------- */
  judul: 'Judul Storymap',
  subjudul: 'Satu kalimat yang merangkum pesan utama karya kalian.',
  kegiatan: 'Leuser GeoStory Challenge | Festival Rimba Leuser 2026',
  subtema: 'Mitigasi Bencana Hidrometeorologi',
  wilayah: 'Nama wilayah kajian, misal DAS ... , Aceh',
  tim: {
    nama: 'Nama Tim',
    anggota: ['Nama Anggota 1', 'Nama Anggota 2', 'Nama Anggota 3'],
    instansi: 'Kampus / Komunitas'
  },
  logo: 'foto/logo-haka.png',          // logo penyelenggara
  sampul: {
    gambar: 'foto/sampul.jpg',         // foto atau peta besar untuk pembuka
    keterangan: 'Keterangan foto sampul. Sumber: ...'
  },

  /* ---------- 2. BAGIAN-BAGIAN CERITA (urut dari atas ke bawah) ---------- */
  bagian: [

    { jenis: 'teks',
      label: 'Pembuka',
      judul: 'Kalimat pembuka yang membuat pembaca ingin terus membaca',
      paragraf: [
        'Paragraf 1: ceritakan peristiwa atau fakta yang paling menarik perhatian. Dua sampai tiga kalimat cukup.',
        'Paragraf 2: ajukan pertanyaan yang akan dijawab storymap ini.'
      ]
    },

    { jenis: 'angka',
      label: 'Sekilas',
      judul: 'Angka-angka kunci',
      isi: [
        { nilai: '000.000', satuan: 'ha',   keterangan: 'Contoh: luas wilayah kajian', sumber: 'Sumber data' },
        { nilai: '00',      satuan: '%',    keterangan: 'Contoh: persentase tutupan hutan', sumber: 'Sumber data' },
        { nilai: '0.000',   satuan: 'ha',   keterangan: 'Contoh: hutan yang hilang', sumber: 'Sumber data' },
        { nilai: '000',     satuan: 'jiwa', keterangan: 'Contoh: warga terdampak', sumber: 'Sumber data' }
      ]
    },

    { jenis: 'peta-scroll',
      label: 'Wilayah',
      judul: 'Mengenal wilayah kajian',
      pengantar: 'Satu kalimat pengantar sebelum peta mulai bergerak.',
      langkah: [
        { peta: 'peta/peta-1.png', judul: 'Lokasi', teks: 'Jelaskan posisi wilayah kajian di Aceh dan di Kawasan Ekosistem Leuser.', sumber: 'Sumber: batas administrasi BIG 2025' },
        { peta: 'peta/peta-2.png', judul: 'Hulu dan hilir', teks: 'Jelaskan pembagian hulu, tengah, dan hilir.', sumber: 'Sumber: DEMNAS, BIG' },
        { peta: 'peta/peta-3.png', judul: 'Siapa yang tinggal di sini', teks: 'Jelaskan permukiman dan jumlah penduduk.', sumber: 'Sumber: BPS' }
      ]
    },

    { jenis: 'peta-scroll',
      label: 'Masalah',
      judul: 'Apa yang berubah',
      pengantar: 'Pengantar bagian masalah.',
      langkah: [
        { peta: 'peta/peta-4.png', judul: 'Kondisi awal', teks: 'Peta kondisi tahun awal.', sumber: 'Sumber: ...' },
        { peta: 'peta/peta-5.png', judul: 'Kondisi sekarang', teks: 'Peta kondisi terbaru dan apa yang hilang.', sumber: 'Sumber: ...' }
      ]
    },

    { jenis: 'grafik',
      label: 'Data',
      judul: 'Judul grafik',
      tipe: 'garis',                    // 'garis' atau 'batang'
      satuan: 'ha',
      sorot: '2025',                     // label yang ingin ditonjolkan (boleh dikosongkan '')
      data: [
        ['2019', 100], ['2020', 120], ['2021', 90], ['2022', 80],
        ['2023', 95],  ['2024', 110], ['2025', 300]
      ],
      catatan: 'Contoh data. Ganti dengan angka hasil olahan kalian.',
      sumber: 'Sumber: ...'
    },

    { jenis: 'perbandingan',
      label: 'Sebelum dan sesudah',
      judul: 'Geser untuk membandingkan',
      kiri:  { gambar: 'peta/sebelum.png', label: 'Sebelum (tahun ...)' },
      kanan: { gambar: 'peta/sesudah.png', label: 'Sesudah (tahun ...)' },
      sumber: 'Sumber: citra satelit ...'
    },

    { jenis: 'teks',
      label: 'Analisis',
      judul: 'Apa yang ditunjukkan data',
      paragraf: [
        'Jelaskan metode analisis singkat (overlay, perhitungan luas, dsb.).',
        'Jelaskan temuan utama beserta angkanya. Tulis sebagai keterkaitan, bukan klaim mutlak.'
      ],
      gambar: { file: 'peta/peta-analisis.png', keterangan: 'Peta hasil analisis. Sumber: diolah tim.' }
    },

    { jenis: 'galeri',
      label: 'Dampak',
      judul: 'Dampak di lapangan',
      paragraf: ['Ceritakan dampak terhadap warga.'],
      foto: [
        { file: 'foto/foto-1.jpg', keterangan: 'Keterangan foto 1. Sumber: ...' },
        { file: 'foto/foto-2.jpg', keterangan: 'Keterangan foto 2. Sumber: ...' },
        { file: 'foto/foto-3.jpg', keterangan: 'Keterangan foto 3. Sumber: ...' }
      ]
    },

    { jenis: 'kutipan',
      label: 'Ekoteologi',
      teks: 'Tulis ayat, hadis, petuah adat, atau kutipan narasumber di sini.',
      sumber: 'Sumber kutipan',
      paragraf: ['Jelaskan hubungan kutipan dengan menjaga hutan dan keseimbangan alam (mizan).']
    },

    { jenis: 'kartu',
      label: 'Solusi',
      judul: 'Rekomendasi',
      gambar: { file: 'peta/peta-zonasi.png', keterangan: 'Peta zonasi rekomendasi. Sumber: diolah tim.' },
      isi: [
        { warna: 'merah', judul: 'Zona 1', teks: 'Rekomendasi untuk zona ini.' },
        { warna: 'hijau', judul: 'Zona 2', teks: 'Rekomendasi untuk zona ini.' },
        { warna: 'biru',  judul: 'Zona 3', teks: 'Rekomendasi untuk zona ini.' }
      ]
    },

    { jenis: 'peta-web',
      label: 'Peta interaktif',
      judul: 'Jelajahi peta sendiri',
      teks: 'Opsional. Ekspor proyek QGIS dengan plugin qgis2web, taruh hasilnya di folder "peta-web/", lalu isi alamat di bawah dengan "peta-web/index.html". Kosongkan untuk menyembunyikan bagian ini.',
      alamat: ''
    },

    { jenis: 'tabel',
      label: 'Metodologi',
      judul: 'Data dan cara pengolahan',
      paragraf: ['Alur kerja: Data → Pengolahan di QGIS → Analisis → Storymap.'],
      kolom: ['Data', 'Sumber', 'Tahun', 'Dipakai untuk'],
      baris: [
        ['Batas administrasi', 'BIG', '2025', 'Semua peta'],
        ['Tutupan & kehilangan hutan', 'HAkA (data dasar panitia)', '2006–2025', 'Bagian masalah'],
        ['...', '...', '...', '...']
      ],
      catatanAI: 'Pernyataan penggunaan AI: tulis bagian mana yang dibantu AI, sesuai Surat Pernyataan Orisinalitas.'
    }
  ],

  /* ---------- 3. PENUTUP ---------- */
  penutup: {
    judul: 'Kalimat ajakan penutup',
    teks: 'Satu paragraf penutup: pesan yang ingin diingat pembaca.'
  },
  sumberData: [
    'Data dasar panitia: Yayasan HAkA',
    'Batas administrasi: Badan Informasi Geospasial (BIG) 2025',
    'Tambahkan sumber lain di sini'
  ]
};
