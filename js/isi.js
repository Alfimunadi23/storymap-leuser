/* =====================================================================
   ISI STORYMAP — cukup file ini yang diubah
   ---------------------------------------------------------------------
   • Ganti tulisan di antara tanda kutip '...'. Tanda kutip, koma, dan
     kurung { } [ ] jangan ikut dihapus.
   • Peta : ekspor dari QGIS (PNG/JPG), taruh di folder "peta/", lalu tulis
            namanya di bawah, misal 'peta/peta-1.png'.
   • Foto : taruh di folder "foto/".
   • Kalau gambarnya belum ada, di website muncul kotak kosong bertuliskan
     nama file yang perlu kamu taruh.
   • Jenis bagian: 'teks', 'peta-scroll', 'angka', 'grafik', 'perbandingan',
     'kutipan', 'kartu', 'tabel', 'galeri', 'peta-web'.
     Yang tidak dipakai hapus saja, yang kurang tinggal salin.
   • Kata yang diapit *bintang* akan berwarna, contoh: 'Air dari *Hulu*'.
   ===================================================================== */

window.ISI = {

  /* ---------- 1. IDENTITAS (wajib ada untuk lomba) ---------- */
  judul: 'Judul *Cerita* Kalian',
  subjudul: 'Satu kalimat yang bikin orang paham ini cerita tentang apa.',
  kegiatan: 'Leuser GeoStory Challenge | Festival Rimba Leuser 2026',
  subtema: 'Mitigasi Bencana Hidrometeorologi',
  wilayah: 'Nama tempat yang kalian bahas, misal DAS Tamiang',
  tim: {
    nama: 'Nama Tim',
    anggota: ['Nama 1', 'Nama 2', 'Nama 3'],
    instansi: 'Kampus atau komunitas'
  },
  logo: 'foto/logo-haka.png',
  sampul: {
    gambar: 'foto/sampul.jpg',          // foto atau peta paling kuat untuk pembuka
    keterangan: 'Foto apa ini, diambil di mana. Sumber: ...'
  },

  /* ---------- 2. ISI CERITA (urut dari atas ke bawah) ----------
     Warna latar berganti sendiri: hutan, kabut, gambut, lumut.
     Mau pilih sendiri? Tambahkan  warna: 'kabut',  di bagian itu. */
  bagian: [

    { jenis: 'teks',
      label: 'Pembuka',
      judul: 'Mulai dari momen yang paling bikin penasaran',
      paragraf: [
        'Ceritakan kejadiannya dulu: kapan, di mana, apa yang terjadi. Dua atau tiga kalimat sudah cukup.',
        'Lalu ajukan pertanyaan yang mau kalian jawab lewat peta-peta di bawah.'
      ]
    },

    { jenis: 'angka',
      label: 'Sekilas',
      judul: 'Beberapa angka dulu',
      isi: [
        { nilai: '000.000', satuan: 'ha',   keterangan: 'Misal: luas wilayah yang dibahas', sumber: 'Sumber: ...' },
        { nilai: '00',      satuan: '%',    keterangan: 'Misal: hutan yang masih tersisa', sumber: 'Sumber: ...' },
        { nilai: '0.000',   satuan: 'ha',   keterangan: 'Misal: hutan yang hilang', sumber: 'Sumber: ...' },
        { nilai: '000',     satuan: 'jiwa', keterangan: 'Misal: warga yang terdampak', sumber: 'Sumber: ...' }
      ]
    },

    { jenis: 'peta-scroll',
      label: 'Wilayah',
      judul: 'Kenalan dulu dengan tempatnya',
      pengantar: 'Gulir pelan-pelan, petanya ikut berganti.',
      langkah: [
        { peta: 'peta/peta-1.png', judul: 'Letaknya di mana', teks: 'Tunjukkan posisinya di Aceh dan di Kawasan Ekosistem Leuser.', sumber: 'Sumber: batas administrasi BIG 2025' },
        { peta: 'peta/peta-2.png', judul: 'Hulu sampai hilir', teks: 'Bagian mana yang pegunungan, mana yang dataran, di mana sungainya bermuara.', sumber: 'Sumber: DEMNAS, BIG' },
        { peta: 'peta/peta-3.png', judul: 'Siapa yang tinggal di sana', teks: 'Desa dan kecamatan yang ada di sepanjang aliran sungai.', sumber: 'Sumber: BPS' }
      ]
    },

    { jenis: 'peta-scroll',
      label: 'Perubahan',
      judul: 'Apa yang berubah',
      pengantar: 'Bandingkan dulu dan sekarang.',
      langkah: [
        { peta: 'peta/peta-4.png', judul: 'Dulu', teks: 'Seperti apa kondisinya di tahun awal.', sumber: 'Sumber: ...' },
        { peta: 'peta/peta-5.png', judul: 'Sekarang', teks: 'Apa yang hilang, dan paling banyak di mana.', sumber: 'Sumber: ...' }
      ]
    },

    { jenis: 'grafik',
      label: 'Data',
      judul: 'Kalau dilihat dari tahun ke tahun',
      tipe: 'garis',                     // 'garis' atau 'batang'
      satuan: 'ha',
      sorot: '2025',                      // tahun yang mau ditonjolkan, boleh dikosongkan ''
      data: [
        ['2019', 100], ['2020', 120], ['2021', 90], ['2022', 80],
        ['2023', 95],  ['2024', 110], ['2025', 300]
      ],
      catatan: 'Angka contoh, ganti dengan hasil olahan kalian.',
      sumber: 'Sumber: ...'
    },

    { jenis: 'perbandingan',
      label: 'Sebelum–sesudah',
      judul: 'Geser dan lihat bedanya',
      kiri:  { gambar: 'peta/sebelum.png', label: 'Sebelum' },
      kanan: { gambar: 'peta/sesudah.png', label: 'Sesudah' },
      sumber: 'Sumber: citra satelit ...'
    },

    { jenis: 'teks',
      label: 'Analisis',
      judul: 'Jadi, apa artinya?',
      paragraf: [
        'Ceritakan singkat cara kalian mengolah datanya, misalnya ditumpuk dengan peta lereng lalu dihitung luasnya.',
        'Lalu sampaikan temuannya pakai angka. Hati-hati: tulis sebagai "berkaitan", jangan langsung "menyebabkan".'
      ],
      gambar: { file: 'peta/peta-analisis.png', keterangan: 'Peta hasil olahan tim. Sumber: ...' }
    },

    { jenis: 'galeri',
      label: 'Dampak',
      judul: 'Yang dirasakan warga',
      paragraf: ['Apa yang terjadi di lapangan. Foto sendiri lebih kuat daripada foto dari internet.'],
      foto: [
        { file: 'foto/foto-1.jpg', keterangan: 'Keterangan foto. Sumber: ...' },
        { file: 'foto/foto-2.jpg', keterangan: 'Keterangan foto. Sumber: ...' },
        { file: 'foto/foto-3.jpg', keterangan: 'Keterangan foto. Sumber: ...' }
      ]
    },

    { jenis: 'kutipan',
      label: 'Ekoteologi',
      teks: 'Tulis ayat, petuah adat, atau omongan warga yang paling mengena.',
      sumber: 'Dari siapa atau dari mana',
      paragraf: ['Kaitkan dengan kenapa hutan perlu dijaga, dan apa hubungannya dengan keseimbangan (mizan).']
    },

    { jenis: 'kartu',
      label: 'Solusi',
      judul: 'Terus, harus bagaimana?',
      gambar: { file: 'peta/peta-zonasi.png', keterangan: 'Peta zonasi usulan tim. Sumber: ...' },
      isi: [
        { warna: 'merah', judul: 'Pulihkan', teks: 'Daerah yang paling rusak dan perlu ditanami lagi.' },
        { warna: 'hijau', judul: 'Jaga', teks: 'Hutan yang masih ada dan harus dilindungi.' },
        { warna: 'biru',  judul: 'Siaga', teks: 'Permukiman yang rawan dan butuh peringatan dini.' }
      ]
    },

    { jenis: 'peta-web',
      label: 'Peta interaktif',
      judul: 'Jelajahi sendiri',
      teks: 'Opsional. Ekspor proyek QGIS pakai plugin qgis2web, taruh hasilnya di folder "peta-web/", lalu isi alamatnya jadi "peta-web/index.html". Kalau dikosongkan, bagian ini tidak tampil.',
      alamat: ''
    },

    { jenis: 'tabel',
      label: 'Metodologi',
      judul: 'Datanya dari mana',
      paragraf: ['Alurnya: kumpulkan data, olah di QGIS, analisis, lalu susun jadi cerita ini.'],
      kolom: ['Data', 'Sumber', 'Tahun', 'Dipakai di'],
      baris: [
        ['Batas administrasi', 'BIG', '2025', 'Semua peta'],
        ['Tutupan dan kehilangan hutan', 'HAkA (data dasar panitia)', '2006–2025', 'Bagian perubahan'],
        ['...', '...', '...', '...']
      ],
      catatanAI: 'Soal AI: tulis jujur bagian mana yang dibantu AI, sama seperti di Surat Pernyataan Orisinalitas.'
    }
  ],

  /* ---------- 3. PENUTUP ---------- */
  penutup: {
    judul: 'Kalimat terakhir yang mau diingat pembaca',
    teks: 'Satu paragraf pendek: ajakan, harapan, atau pengingat.'
  },
  sumberData: [
    'Data dasar panitia: Yayasan HAkA',
    'Batas administrasi: Badan Informasi Geospasial (BIG) 2025',
    'Tambahkan sumber lain di sini'
  ]
};
