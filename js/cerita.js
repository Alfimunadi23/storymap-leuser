/* Mesin storymap: membaca window.ISI (js/isi.js) lalu menyusun halaman.
   Tidak perlu diubah untuk mengisi konten. */
(function () {
  'use strict';
  var I = window.ISI || {};
  document.documentElement.classList.add('js');
  var WARNA = ['peta'];
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  var sorotKata = function (s) { return esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>'); };

  /* --- kotak penanda bila file gambar belum ada --- */
  function penanda(file, rasio, label) {
    var w = 1200, h = Math.round(w * (rasio || 0.72));
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#e6dfbb" stroke-width="1"/></pattern></defs>' +
      '<rect width="100%" height="100%" fill="#f8f4de"/><rect width="100%" height="100%" fill="url(#g)"/>' +
      '<path d="M' + (w / 2 - 26) + ' ' + h / 2 + 'h52M' + w / 2 + ' ' + (h / 2 - 26) + 'v52" stroke="#606C38" stroke-width="2"/>' +
      '<circle cx="' + w / 2 + '" cy="' + h / 2 + '" r="16" fill="none" stroke="#606C38" stroke-width="2"/>' +
      (label ? '<text x="50%" y="' + (h / 2 - 70) + '" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="' + (label.length > 12 ? 64 : 110) + '" fill="#606C38">' + esc(label) + '</text>' : '') +
      '<text x="50%" y="' + (h / 2 + 70) + '" text-anchor="middle" font-family="Menlo,monospace" font-size="26" fill="#283618">TARUH FILE INI DI SINI</text>' +
      '<text x="50%" y="' + (h / 2 + 108) + '" text-anchor="middle" font-family="Menlo,monospace" font-size="24" fill="#BC6C25">' + esc(file) + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function img(file, alt, kelas, rasio) {
    return '<img class="' + (kelas || '') + '" src="' + esc(file) + '" alt="' + esc(alt || '') + '" data-file="' + esc(file) + '" data-rasio="' + (rasio || '') + '" loading="lazy">';
  }
  function pasangPenanda(root) {
    root.querySelectorAll('img[data-file]').forEach(function (el) {
      var gagal = function () { if (!el.dataset.ganti) { el.dataset.ganti = 1; el.src = penanda(el.dataset.file, +el.dataset.rasio || 0.72, el.alt && el.alt.length < 30 ? el.alt : ''); } };
      el.addEventListener('error', gagal);
      if (el.complete && el.naturalWidth === 0 && el.getAttribute('src')) gagal();
      if (!el.dataset.file) gagal();
    });
  }
  function paragraf(arr) { return (arr || []).map(function (p) { return '<p>' + esc(p).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') + '</p>'; }).join(''); }
  function gambarBingkai(g) {
    if (!g || !g.file) return '';
    return '<figure class="isi-lebar" style="margin:36px 0 0 174px"><div class="bingkai">' + img(g.file, g.keterangan, 'zoom') + '</div><figcaption>' + esc(g.keterangan) + '</figcaption></figure>';
  }

  /* --- sampul --- */
  document.title = (I.judul || 'Storymap').replace(/\*/g, '');
  document.getElementById('lbJudul').textContent = (I.judul || '').replace(/\*/g, '') + ' · ' + (I.kegiatan || '');
  var t = I.tim || {};
  var lg = function (l) { return img(l.file, l.nama || 'Logo', l.bentuk || '', 1); };
  var logoHtml = function () { return '<div class="logo-atas"><div class="kiri">' + [].concat(I.logoKiri || []).map(lg).join('') + '</div><div class="kanan">' + [].concat(I.logoKanan || []).map(lg).join('') + '</div></div>'; };
  var SP = I.sampul || {};
  var latarHtml = (function () {
    if (SP.foto) return '<div class="hero-latar"><img src="' + esc(SP.foto) + '" alt=""></div>';
    var c = SP.pusat || [4.10, 97.66], z = SP.zoom || 11, n = Math.pow(2, z), la = c[0] * Math.PI / 180;
    var fx = (c[1] + 180) / 360 * n, fy = (1 - Math.log(Math.tan(la) + 1 / Math.cos(la)) / Math.PI) / 2 * n, cols = 9, rows = 6;
    var x0 = Math.floor(fx - cols / 2), y0 = Math.floor(fy - rows / 2), t = '';
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++)
      t += '<img alt="" loading="eager" style="left:' + (i * 256) + 'px;top:' + (j * 256) + 'px" src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/' + z + '/' + (y0 + j) + '/' + (x0 + i) + '">';
    var ox = (fx - x0) * 256, oy = (fy - y0) * 256;
    return '<div class="hero-latar"><div class="hero-ubin" style="width:' + cols * 256 + 'px;height:' + rows * 256 + 'px;margin-left:' + (-ox) + 'px;margin-top:' + (-oy) + 'px">' + t + '</div></div>';
  })();
  document.getElementById('sampul').innerHTML = latarHtml + '<div class="hero-redup"></div>' +
    '<div class="wrap">' + logoHtml() + '<div class="hero-isi">' +
    '<div class="kode">' + esc(I.kegiatan) + '</div>' +
    '<h1>' + sorotKata(I.judul) + '</h1><p class="sub">' + esc(I.subjudul) + '</p>' +
    '<div class="hero-aksi"><a class="gulir" href="#b1">Mulai baca</a><a class="hero-link" id="keBanjir" href="#">Lihat peta banjir</a></div>' +
    (I.wilayah ? '<p class="hero-wil">' + esc(I.wilayah) + ' · Kawasan Ekosistem Leuser</p>' : '') +
    '</div></div><p class="hero-atribusi">' + esc(SP.foto ? (SP.kredit || '') : 'Citra satelit hulu DAS Tamiang: Esri World Imagery') + '</p>';

  /* --- bagian --- */
  var B = (I.bagian || []).filter(function (b) { return !(b.jenis === 'peta-web' && !b.alamat); });
  var GRAFIK = [], GPLUS = [], PINT = [], nBanding = 0, nomor = 0;
  var WK = { merah: '#BC6C25', hijau: '#606C38', biru: '#DDA15E', kuning: '#DDA15E', oranye: '#BC6C25', olive: '#606C38', emas: '#DDA15E' };

  function blok(b) {
    switch (b.jenis) {
      case 'teks':
        return (b.subjudul ? '<h3 class="sub-blok isi-lebar">' + sorotKata(b.subjudul) + '</h3>' : '') +
          '<div class="isi-kolom">' + paragraf(b.paragraf) + '</div>' + gambarBingkai(b.gambar);
      case 'angka':
        return '<div class="angka isi-lebar muncul">' + (b.isi || []).map(function (a) {
          return '<div><b>' + esc(a.nilai) + '<small>' + esc(a.satuan) + '</small></b><span>' + esc(a.keterangan) + '</span><span class="sumber">' + esc(a.sumber) + '</span></div>';
        }).join('') + '</div>';
      case 'peta-scroll':
        return '<div class="scroll"><div class="tahap"><div class="bingkai"><div class="tumpuk">' +
          (b.langkah || []).map(function (l, k) { return img(l.peta, l.judul, 'zoom' + (k === 0 ? ' aktif' : ''), 0.72); }).join('') +
          '</div></div><div class="titik-langkah">' + (b.langkah || []).map(function (l, k) { return '<i' + (k === 0 ? ' class="aktif"' : '') + '></i>'; }).join('') + '</div><div class="sumber" data-sumber>' + esc(((b.langkah || [])[0] || {}).sumber) + '</div></div>' +
          '<div class="langkah-daftar">' + (b.langkah || []).map(function (l, k) {
            return '<div class="langkah' + (k === 0 ? ' aktif' : '') + '" data-k="' + k + '" data-sumber="' + esc(l.sumber) + '"><div class="kode"><b>' + pad2(k + 1) + '</b> / ' + pad2((b.langkah || []).length) + '</div><h3>' + esc(l.judul) + '</h3><p>' + esc(l.teks) + '</p></div>';
          }).join('') + '</div></div>';
      case 'peta-tab':
        var tabs = b.tab || [];
        return (b.paragraf ? '<div class="isi-kolom" style="margin-bottom:28px">' + paragraf(b.paragraf) + '</div>' : '') +
          '<div class="ptab isi-lebar' + (b.waktu ? ' waktu' : '') + '" data-ptab>' +
          (b.subjudul ? '<h3 class="sub-blok">' + sorotKata(b.subjudul) + '</h3>' : '') +
          '<div class="ptab-nav" role="tablist" aria-label="' + esc(b.subjudul || 'Pilih peta') + '">' +
          tabs.map(function (t, k) { return '<button type="button" role="tab" aria-selected="' + (k === 0) + '" data-k="' + k + '"' + (k === 0 ? ' class="aktif"' : '') + '>' + esc(t.label) + '</button>'; }).join('') +
          (b.putar ? '<button type="button" class="ptab-putar">▶ Putar</button>' : '') + '</div>' +
          '<div class="ptab-badan"><div class="bingkai"><div class="tumpuk">' +
          tabs.map(function (t, k) { return img(t.peta, t.label, 'zoom' + (k === 0 ? ' aktif' : ''), 0.72); }).join('') +
          '<span class="ptab-cap">' + esc((tabs[0] || {}).label) + '</span></div></div>' +
          '<div class="ptab-info">' + tabs.map(function (t, k) {
            return '<div class="ptab-isi" data-k="' + k + '"' + (k ? ' hidden' : '') + '><div class="ptab-besar">' + esc(t.label) + '</div>' +
              (t.angka ? '<dl>' + t.angka.map(function (a) { return '<div><dt>' + esc(a.keterangan) + '</dt><dd><b>' + esc(a.nilai) + '</b> ' + esc(a.satuan || '') + '</dd></div>'; }).join('') + '</dl>' : '') +
              (t.teks ? '<p>' + esc(t.teks) + '</p>' : '') + (t.sumber ? '<div class="sumber">' + esc(t.sumber) + '</div>' : '') + '</div>';
          }).join('') + '</div></div>' +
          (b.sumber ? '<div class="sumber">' + esc(b.sumber) + '</div>' : '') +
          (b.legenda ? '<div class="legenda">' + b.legenda.map(function (l) { return '<span><i style="background:' + esc(l.warna) + '"></i>' + esc(l.label) + '</span>'; }).join('') + '</div>' : '') +
          '</div>';
      case 'peta-interaktif':
        PINT.push(b); var TT = b.tahun || [];
        return (b.paragraf ? '<div class="isi-kolom" style="margin-bottom:28px">' + paragraf(b.paragraf) + '</div>' : '') +
          '<div class="ptab waktu pint isi-lebar" data-pint="' + (PINT.length - 1) + '">' +
          (b.subjudul ? '<h3 class="sub-blok">' + sorotKata(b.subjudul) + '</h3>' : '') +
          '<div class="ptab-nav" role="tablist">' + TT.map(function (y, k) { return '<button type="button" role="tab" data-k="' + k + '">' + y + '</button>'; }).join('') +
          '<button type="button" class="ptab-putar">▶ Putar</button></div>' +
          '<div class="ptab-badan"><div class="bingkai"><div class="peta-leaflet" role="application" aria-label="Peta interaktif"></div></div><div class="pint-info ptab-isi"><p class="kode">Memuat peta…</p></div></div>' +
          (b.legenda ? '<div class="legenda">' + b.legenda.map(function (l) { return '<span><i style="background:' + esc(l.warna) + '"></i>' + esc(l.label) + '</span>'; }).join('') + '</div>' : '') +
          (b.sumber ? '<div class="sumber">' + esc(b.sumber) + '</div>' : '') + '</div>';
      case 'peta-web':
        PINT.push(b); var TW = b.tab || [];
        return (b.paragraf ? '<div class="isi-kolom" style="margin-bottom:28px">' + paragraf(b.paragraf) + '</div>' : '') +
          '<div class="ptab pint pweb isi-lebar' + (b.waktu ? ' waktu' : '') + '" data-pweb="' + (PINT.length - 1) + '">' +
          (b.subjudul ? '<h3 class="sub-blok">' + sorotKata(b.subjudul) + '</h3>' : '') +
          (TW.length > 1 ? '<div class="ptab-nav" role="tablist">' + TW.map(function (t, k) { return '<button type="button" role="tab" data-k="' + k + '">' + esc(t.label) + '</button>'; }).join('') +
          (b.waktu ? '<button type="button" class="ptab-putar">▶ Putar</button>' : '') + '</div>' : '') +
          '<div class="ptab-badan"><div class="bingkai"><div class="pweb-wadah"><div class="peta-leaflet" role="application" aria-label="Peta interaktif"></div>' +
          (b.pilihDasar !== false ? '<div class="pweb-dasar">' + ['citra', 'relief', 'topo'].map(function (d) { return '<button type="button" data-d="' + d + '">' + { citra: 'Citra', relief: 'Relief', topo: 'Topografi' }[d] + '</button>'; }).join('') + '</div>' : '') +
          (TW.some(function (t) { return t.geser; }) ? '<div class="pweb-geser" hidden tabindex="0" role="slider" aria-label="Geser perbandingan"><span class="gk"></span><span class="gn"></span><i></i></div>' : '') +
          '</div></div><div class="pint-info ptab-isi"><p class="kode">Memuat peta…</p></div></div>' +
          (b.sumber ? '<div class="sumber">' + esc(b.sumber) + '</div>' : '') + '</div>';
      case 'peta-lereng':
        PINT.push(b); var TL = b.tahun || [];
        return (b.paragraf ? '<div class="isi-kolom" style="margin-bottom:28px">' + paragraf(b.paragraf) + '</div>' : '') +
          '<div class="ptab waktu pint plg isi-lebar" data-plg="' + (PINT.length - 1) + '">' +
          (b.subjudul ? '<h3 class="sub-blok">' + sorotKata(b.subjudul) + '</h3>' : '') +
          '<div class="plg-wil" role="group" aria-label="Wilayah"><button type="button" data-w="" class="aktif">DAS Tamiang</button><button type="button" data-w="-tmg">Kab. Aceh Tamiang saja</button></div>' +
          '<div class="ptab-nav" role="tablist">' + TL.map(function (y, k) { return '<button type="button" role="tab" data-k="' + k + '">' + y + '</button>'; }).join('') +
          '<button type="button" class="ptab-putar">▶ Putar</button></div>' +
          '<div class="ptab-badan"><div class="bingkai"><div class="peta-leaflet" role="application" aria-label="Peta interaktif deforestasi lereng"></div></div><div class="pint-info ptab-isi"><p class="kode">Memuat peta…</p></div></div>' +
          '<div class="plg-batang" aria-label="Luas hutan hilang per kelas lereng per tahun"></div>' +
          (b.sumber ? '<div class="sumber">' + esc(b.sumber) + '</div>' : '') + '</div>';
      case 'grafik-plus':
        GPLUS.push(b); var TP = b.tampilan || [];
        return (b.subjudul ? '<h3 class="sub-blok isi-lebar">' + sorotKata(b.subjudul) + '</h3>' : '') +
          (b.paragraf ? '<div class="isi-kolom" style="margin-bottom:22px">' + paragraf(b.paragraf) + '</div>' : '') +
          '<figure class="gplus isi-lebar muncul" data-gplus="' + (GPLUS.length - 1) + '">' +
          (b.ringkas ? '<div class="gp-ringkas">' + b.ringkas.map(function (a) { return '<div><b>' + esc(a.nilai) + '<small>' + esc(a.satuan || '') + '</small></b><span>' + esc(a.keterangan) + '</span></div>'; }).join('') + '</div>' : '') +
          '<div class="gp-atas">' + (TP.length > 1 ? '<div class="gp-ganti" role="group">' + TP.map(function (t, i) { return '<button type="button" aria-pressed="' + (i === 0) + '"' + (i === 0 ? ' class="aktif"' : '') + '>' + esc(t.label) + '</button>'; }).join('') + '</div>' : '') +
          '<div class="gp-legenda"></div></div>' +
          '<div class="gp-kanvas"><svg></svg><div class="tip"></div></div><p class="gp-ket" hidden></p>' +
          '<details class="gp-detail"><summary>Lihat tabel angka</summary><div class="gp-tabel"></div></details>' +
          '<figcaption>' + esc(b.catatan ? b.catatan + ' ' : '') + esc(b.sumber || '') + '</figcaption></figure>';
      case 'grafik':
        GRAFIK.push(b);
        return (b.subjudul ? '<h3 class="sub-blok isi-lebar">' + sorotKata(b.subjudul) + '</h3>' : '') +
          '<figure class="grafik isi-lebar muncul" style="margin-top:0;margin-right:0;margin-bottom:0" data-grafik="' + (GRAFIK.length - 1) + '"><svg></svg><div class="tip"></div><figcaption>' + esc(b.catatan ? b.catatan + ' ' : '') + esc(b.sumber) + '</figcaption></figure>';
      case 'perbandingan':
        nBanding++;
        return (b.subjudul ? '<h3 class="sub-blok isi-lebar">' + sorotKata(b.subjudul) + '</h3>' : '') +
          '<figure class="isi-lebar" style="margin-top:0;margin-right:0;margin-bottom:0"><div class="bingkai banding">' + img((b.kanan || {}).gambar, (b.kanan || {}).label, '', 0.62) +
          '<div class="atas">' + img((b.kiri || {}).gambar, (b.kiri || {}).label, '', 0.62) + '</div><div class="garis-geser"></div>' +
          '<span class="lbl k">' + esc((b.kiri || {}).label) + '</span><span class="lbl n">' + esc((b.kanan || {}).label) + '</span>' +
          '<input type="range" min="0" max="100" value="50" aria-label="Geser perbandingan" id="geser' + nBanding + '"></div><figcaption>' + esc(b.sumber) + '</figcaption></figure>';
      case 'riwayat':
        return (b.subjudul ? '<h3 class="sub-blok isi-lebar">' + sorotKata(b.subjudul) + '</h3>' : '') +
          '<ol class="riwayat isi-lebar muncul">' + (b.isi || []).map(function (r) {
            return '<li' + (r.sorot ? ' class="sorot"' : '') + '><div class="r-tahun">' + esc(r.tahun) + '</div><div class="r-isi"><h4>' + esc(r.judul) + '</h4><p>' + esc(r.teks) + '</p>' + (r.sumber ? '<span class="sumber">' + esc(r.sumber) + '</span>' : '') + '</div></li>';
          }).join('') + '</ol>';
      case 'kutipan':
        return '<div class="kutipan"><blockquote>' + esc(b.teks) + '</blockquote><cite class="kode">' + esc(b.sumber) + '</cite></div>' +
          (b.paragraf ? '<div class="isi-kolom" style="margin-top:32px">' + paragraf(b.paragraf) + '</div>' : '');
      case 'kartu':
        return (b.subjudul ? '<h3 class="sub-blok isi-lebar">' + sorotKata(b.subjudul) + '</h3>' : '') +
          gambarBingkai(b.gambar).replace('margin:36px 0 0 174px', 'margin:0 0 0 174px') +
          '<div class="kartu isi-lebar muncul">' + (b.isi || []).map(function (k) {
            return '<div style="--c:' + (WK[k.warna] || 'var(--aksen)') + '"><span class="kode">' + esc(k.label || k.warna || '') + '</span><h3>' + esc(k.judul) + '</h3><p>' + esc(k.teks) + '</p></div>';
          }).join('') + '</div>';
      case 'galeri':
        return (b.paragraf ? '<div class="isi-kolom">' + paragraf(b.paragraf) + '</div>' : '') + '<div class="galeri isi-lebar muncul">' + (b.foto || []).map(function (f) {
          return '<figure>' + img(f.file, f.keterangan, 'zoom', 0.75) + '<figcaption>' + esc(f.keterangan) + '</figcaption></figure>';
        }).join('') + '</div>';
      case 'peta-web':
        return '<div class="isi-kolom"><p>' + esc(b.teks) + '</p></div><div class="bingkai peta-web isi-lebar" style="margin-top:28px"><iframe src="' + esc(b.alamat) + '" title="' + esc(b.judul) + '" loading="lazy"></iframe></div>';
      case 'tabel':
        return (b.paragraf ? '<div class="isi-kolom">' + paragraf(b.paragraf) + '</div>' : '') + '<div class="tabel isi-lebar"><table><thead><tr>' +
          (b.kolom || []).map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          (b.baris || []).map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
          '</tbody></table></div>' + (b.catatanAI ? '<p class="catatan-ai isi-lebar">' + esc(b.catatanAI) + '</p>' : '');
    }
    return '';
  }

  var total = B.filter(function (b) { return !b.tanpaNomor; }).length;
  var html = B.map(function (b, i) {
    var no = b.tanpaNomor ? 0 : ++nomor, id = 'b' + (i + 1);
    var kep = '<div class="kepala muncul"><div class="no">' + (no ? 'BAGIAN<b>' + pad2(no) + '</b>' : '<b class="tanpa">—</b>') + '<span>' + esc(b.label) + '</span></div><div>' +
      (b.judul ? '<h2>' + sorotKata(b.judul) + '</h2>' : '') + (b.pengantar ? '<p class="pengantar">' + esc(b.pengantar) + '</p>' : '') + '</div></div>';
    var daftar = b.blok || [b];
    var isi = daftar.map(function (x) { return '<div class="blok">' + blok(x) + '</div>'; }).join('');
    return '<section class="bagian" data-warna="' + (b.warna || WARNA[i % WARNA.length]) + '" id="' + id + '" data-label="' + esc(b.label) + '" data-no="' + no + '"><div class="wrap">' + kep + isi + '</div></section>';
  }).join('');
  var P = I.penutup || {};
  html += '<section class="penutup" data-warna="' + WARNA[B.length % WARNA.length] + '" data-label="Penutup" data-no="0"><div class="wrap"><div class="kode">Penutup</div><h2 style="margin-top:14px">' + sorotKata(P.judul) + '</h2><p>' + esc(P.teks) + '</p></div></section>';
  var main = document.getElementById('cerita'); main.innerHTML = html;

  /* --- tepi (marginalia lembar peta) --- */
  document.getElementById('tepi').innerHTML = '<div class="wrap"><div>' + logoHtml() +
    '<h3>Kegiatan</h3><p>' + esc(I.kegiatan) + '</p><h3 style="margin-top:18px">Subtema</h3><p>' + esc(I.subtema) + '</p></div>' +
    '<div><h3>Tim' + (t.nama ? ' · ' + esc(t.nama) : '') + '</h3><dl class="peran">' +
      (t.ketua ? '<dt>Ketua</dt><dd>' + esc(t.ketua) + '</dd>' : '') +
      ((t.anggota || []).length ? '<dt>Anggota</dt><dd>' + (t.anggota || []).map(esc).join('<br>') + '</dd>' : '') + '</dl>' +
      (t.instansi ? '<p style="margin-top:12px">' + esc(t.instansi) + '</p>' : '') + '</div>' +
    '<div><h3>Sumber data</h3><ul>' + (I.sumberData || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
    (I.metode ? '<p class="catatan-kecil">' + esc(I.metode) + '</p>' : '') + (I.catatanAI ? '<p class="catatan-kecil">' + esc(I.catatanAI) + '</p>' : '') + '</div></div>';

  pasangPenanda(document.body);

  /* --- grafik SVG --- */
  function grafik(fig, b) {
    var svg = fig.querySelector('svg'), w = Math.max(320, fig.clientWidth), h = w < 520 ? 260 : 340;
    var m = { t: 28, r: 16, b: 34, l: 56 }, d = b.data || [], n = d.length;
    var maks = Math.max.apply(null, d.map(function (x) { return +x[1]; }).concat([0]));
    if (!(maks > 0)) {
      svg.setAttribute('viewBox', '0 0 ' + w + ' 160');
      svg.innerHTML = '<rect x="0" y="0" width="' + w + '" height="160" fill="none" stroke="rgba(' + (getComputedStyle(fig).getPropertyValue('--g').trim() || '241,234,216') + ',.3)" stroke-dasharray="6 6"/>' +
        '<text x="' + w / 2 + '" y="76" text-anchor="middle" class="nilai">Grafik belum diisi</text><text x="' + w / 2 + '" y="100" text-anchor="middle">Tulis angkanya di js/isi.js, bagian "' + esc(b.subjudul || b.judul || 'grafik') + '"</text>';
      return;
    }
    var step = Math.pow(10, Math.floor(Math.log10(maks))), top = Math.ceil(maks / step) * step; if (top / step < 3) { step /= 2; top = Math.ceil(maks / step) * step; }
    var y = function (v) { return m.t + (h - m.t - m.b) * (1 - v / top); };
    var bw = (w - m.l - m.r) / n, x = function (k) { return m.l + bw * k + bw / 2; };
    var fmt = function (v) { return (+v).toLocaleString('id-ID'); };
    var cs = getComputedStyle(fig), AK = cs.getPropertyValue('--aksen').trim() || '#9fcf7a', BR = cs.getPropertyValue('--bara').trim() || '#ee6b4d';
    var GR = 'rgba(' + (cs.getPropertyValue('--g').trim() || '241,234,216') + ',.16)';
    var s = '';
    for (var v = 0; v <= top + 1e-9; v += step) s += '<line x1="' + m.l + '" x2="' + (w - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + GR + '"/><text x="' + (m.l - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmt(v) + '</text>';
    var lewat = n > 12 ? Math.ceil(n / 8) : 1;
    d.forEach(function (p, k) { if (k % lewat === 0 || k === n - 1) s += '<text x="' + x(k) + '" y="' + (h - 10) + '" text-anchor="middle">' + esc(p[0]) + '</text>'; });
    var sorot = String(b.sorot || '');
    if (b.tipe === 'batang') {
      d.forEach(function (p, k) { var on = String(p[0]) === sorot; s += '<rect x="' + (x(k) - bw * .34) + '" width="' + bw * .68 + '" y="' + y(p[1]) + '" height="' + (y(0) - y(p[1])) + '" fill="' + (on ? BR : AK) + '" opacity="' + (sorot && !on ? .6 : 1) + '"/>'; if (on || !sorot) s += '<text class="nilai" x="' + x(k) + '" y="' + (y(p[1]) - 7) + '" text-anchor="middle">' + fmt(p[1]) + '</text>'; });
    } else {
      var pts = d.map(function (p, k) { return x(k) + ',' + y(p[1]); }).join(' ');
      s += '<polygon points="' + x(0) + ',' + y(0) + ' ' + pts + ' ' + x(n - 1) + ',' + y(0) + '" fill="' + AK + '" opacity=".14"/>';
      s += '<polyline points="' + pts + '" fill="none" stroke="' + AK + '" stroke-width="3" stroke-linejoin="round"/>';
      d.forEach(function (p, k) { var on = String(p[0]) === sorot; s += '<circle cx="' + x(k) + '" cy="' + y(p[1]) + '" r="' + (on ? 7 : 4) + '" fill="' + (on ? BR : AK) + '"/>'; if (on) s += '<text class="nilai" x="' + (x(k) - 10) + '" y="' + (y(p[1]) + 5) + '" text-anchor="end" style="fill:' + BR + '">' + fmt(p[1]) + ' ' + esc(b.satuan) + '</text>'; });
    }
    d.forEach(function (p, k) { s += '<rect class="hit" data-k="' + k + '" x="' + (x(k) - bw / 2) + '" y="' + m.t + '" width="' + bw + '" height="' + (h - m.t - m.b) + '"/>'; });
    s += '<text x="' + m.l + '" y="12">' + esc(b.satuan ? 'Satuan: ' + b.satuan : '') + '</text>';
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', b.judul || 'Grafik'); svg.innerHTML = s;
    var tip = fig.querySelector('.tip');
    svg.querySelectorAll('.hit').forEach(function (r) {
      var k = +r.dataset.k, show = function () {
        var sc = svg.getBoundingClientRect().width / w;
        tip.innerHTML = esc(d[k][0]) + ': <b>' + fmt(d[k][1]) + ' ' + esc(b.satuan || '') + '</b>';
        tip.style.left = (22 + x(k) * sc) + 'px'; tip.style.top = (22 + y(d[k][1]) * sc) + 'px'; tip.classList.add('on');
      };
      r.addEventListener('mouseenter', show); r.addEventListener('touchstart', show, { passive: true });
      r.addEventListener('mouseleave', function () { tip.classList.remove('on'); });
    });
  }
  function semuaGrafik() { main.querySelectorAll('[data-grafik]').forEach(function (f) { grafik(f, GRAFIK[+f.dataset.grafik]); }); }
  semuaGrafik(); var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(semuaGrafik, 150); });

  /* --- grafik-plus: grafik interaktif multi-seri --- */
  function gplus(fig, b) {
    var st = fig._st || (fig._st = { v: 0, mati: {} });
    var V = b.tampilan[st.v], kat = b.kategori || [], svg = fig.querySelector('svg'), tip = fig.querySelector('.tip');
    var W = Math.max(300, fig.querySelector('.gp-kanvas').clientWidth), datar = V.tipe === 'mendatar';
    var H = datar ? Math.max(170, kat.length * 64 + 40) : (W < 520 ? 270 : 330);
    var pjg = Math.max.apply(null, kat.map(function (c) { return String(c).length; }));
    var m = { t: 26, r: datar ? 150 : 18, b: 34, l: datar ? Math.min(170, pjg * 7.6 + 16) : 58 };
    if (W < 520 && datar) { m.r = 118; m.l = Math.min(120, pjg * 6.6 + 12); }
    var seri = V.seri.map(function (s, i) { return { s: s, i: i, on: !st.mati[s.nama] }; }), aktif = seri.filter(function (x) { return x.on; });
    var dec = V.desimal == null ? 0 : V.desimal, f = function (v, d) { return (+v).toLocaleString('id-ID', { minimumFractionDigits: d == null ? dec : d, maximumFractionDigits: d == null ? dec : d }); };
    var tumpuk = V.tipe === 'tumpuk';
    var vals = [];
    kat.forEach(function (_, k) { if (tumpuk) vals.push(aktif.reduce(function (a, x) { return a + (+x.s.nilai[k] || 0); }, 0)); else aktif.forEach(function (x) { vals.push(+x.s.nilai[k]); }); });
    if (V.rujukan) vals.push(V.rujukan.nilai);
    var maks = Math.max.apply(null, vals.concat([0])), min0 = 0;
    if (V.tipe === 'garis' && V.nolBebas) { var mn = Math.min.apply(null, vals); min0 = mn - (maks - mn) * .15; }
    var nT = datar ? (W < 520 ? 3 : 6) : 6;
    function bulat(lo, hi) { var r = hi - lo || 1, st0 = Math.pow(10, Math.floor(Math.log10(r))), c = [1, 2, 2.5, 5, 10]; for (var i = 0; i < c.length; i++) { if (r / (st0 * c[i]) <= nT) { st0 *= c[i]; break; } } return { lo: Math.floor(lo / st0) * st0, hi: Math.ceil(hi / st0) * st0, st: st0 }; }
    var sk = bulat(min0, maks * (datar ? 1 : 1.08));
    var GR = 'rgba(254,250,224,.12)', s = '';
    if (datar) {
      var X = function (v) { return m.l + (W - m.l - m.r) * (v - sk.lo) / (sk.hi - sk.lo); }, bh = (H - m.t - m.b) / kat.length;
      for (var v = sk.lo; v <= sk.hi + 1e-9; v += sk.st) s += '<line x1="' + X(v) + '" x2="' + X(v) + '" y1="' + m.t + '" y2="' + (H - m.b) + '" stroke="' + GR + '"/><text x="' + X(v) + '" y="' + (H - m.b + 18) + '" text-anchor="middle">' + f(v, 0) + '</text>';
      kat.forEach(function (c, k) {
        var x = aktif[0] || seri[0], val = +x.s.nilai[k], y0 = m.t + bh * k + bh * .18, hh = bh * .64, col = (x.s.warnaPer || [])[k] || x.s.warna;
        s += '<text x="' + (m.l - 10) + '" y="' + (y0 + hh / 2 + 4) + '" text-anchor="end" class="gp-kat">' + esc(c) + '</text>';
        s += '<path class="gp-m tumbuh-x" d="M' + X(0) + ',' + y0 + 'H' + (X(val) - 4) + 'a4,4 0 0 1 4,4V' + (y0 + hh - 4) + 'a4,4 0 0 1 -4,4H' + X(0) + 'Z" fill="' + col + '"/>';
        s += '<text x="' + (X(val) + 8) + '" y="' + (y0 + hh / 2 + 5) + '" class="nilai">' + f(val) + (V.labelBatang ? '<tspan class="gp-sub"> ' + esc(V.labelBatang[k]) + '</tspan>' : '') + '</text>';
        s += '<rect class="hit" data-k="' + k + '" x="' + m.l + '" y="' + (m.t + bh * k) + '" width="' + (W - m.l - m.r) + '" height="' + bh + '"/>';
      });
    } else {
      var n = kat.length, bw = (W - m.l - m.r) / n, X = function (k) { return m.l + bw * k + bw / 2; }, Y = function (v) { return m.t + (H - m.t - m.b) * (1 - (v - sk.lo) / (sk.hi - sk.lo)); };
      for (var v = sk.lo; v <= sk.hi + 1e-9; v += sk.st) s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="' + GR + '"/><text x="' + (m.l - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + f(v, sk.st < 1 ? 1 : 0) + '</text>';
      var lewat = n > 14 ? Math.ceil(n / 9) : 1;
      kat.forEach(function (c, k) { if (k % lewat === 0) s += '<text x="' + X(k) + '" y="' + (H - 12) + '" text-anchor="middle"' + (String(c) === String(V.sorot) ? ' class="gp-sorot"' : '') + '>' + esc(c) + '</text>'; });
      if (V.rujukan) s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(V.rujukan.nilai) + '" y2="' + Y(V.rujukan.nilai) + '" stroke="#FEFAE0" stroke-width="1.5" stroke-dasharray="6 5" opacity=".7"/><text x="' + (m.l + 6) + '" y="' + (Y(V.rujukan.nilai) - 7) + '" text-anchor="start" class="gp-ruj">' + esc(V.rujukan.label) + '</text>';
      if (V.tipe === 'garis') {
        aktif.forEach(function (x) {
          var pts = x.s.nilai.map(function (v, k) { return X(k) + ',' + Y(v); }).join(' ');
          s += '<polyline class="gp-garis" points="' + pts + '" fill="none" stroke="' + x.s.warna + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
          x.s.nilai.forEach(function (v, k) { s += '<circle cx="' + X(k) + '" cy="' + Y(v) + '" r="4.5" fill="' + x.s.warna + '" stroke="#283618" stroke-width="2"/>'; });
        });
        if (aktif.length > 1 || V.labelAkhir) {
          var kL = n - 1, lb = aktif.map(function (x) { return { y: Y(x.s.nilai[kL]) - 10, t: f(x.s.nilai[kL]) }; }).sort(function (a, b2) { return a.y - b2.y; });
          for (var q = 1; q < lb.length; q++) if (lb[q].y - lb[q - 1].y < 15) lb[q].y = lb[q - 1].y + 15;
          lb.forEach(function (l) { s += '<text x="' + (X(kL) - 10) + '" y="' + l.y + '" text-anchor="end" class="nilai">' + l.t + '</text>'; });
        }
      } else {
        var g = tumpuk ? 1 : aktif.length, gw = bw * .7 / g;
        kat.forEach(function (c, k) {
          var acc = 0;
          aktif.forEach(function (x, j) {
            var v = +x.s.nilai[k] || 0, on = !V.sorot || String(c) === String(V.sorot), col = (x.s.warnaPer || [])[k] || x.s.warna;
            if (tumpuk) {
              var yT = Y(acc + v), yB = Y(acc), hgt = Math.max(0, yB - yT - (acc > 0 ? 2 : 0)), top = j === aktif.length - 1;
              if (hgt > 0) s += top ? '<path class="gp-m tumbuh" d="M' + (X(k) - bw * .35) + ',' + (yT + hgt) + 'V' + (yT + Math.min(4, hgt)) + 'a4,4 0 0 1 4,-4H' + (X(k) + bw * .35 - 4) + 'a4,4 0 0 1 4,4V' + (yT + hgt) + 'Z" fill="' + col + '"/>' : '<rect class="gp-m tumbuh" x="' + (X(k) - bw * .35) + '" y="' + yT + '" width="' + bw * .7 + '" height="' + hgt + '" fill="' + col + '"/>';
              acc += v;
            } else {
              var x0 = X(k) - bw * .35 + gw * j + (g > 1 ? 1 : 0), ww = gw - (g > 1 ? 2 : 0), yv = Y(v), hb = Y(sk.lo) - yv;
              if (hb > 0) s += '<path class="gp-m tumbuh" d="M' + x0 + ',' + (yv + hb) + 'V' + (yv + Math.min(4, hb)) + 'a4,4 0 0 1 4,-4H' + (x0 + ww - 4) + 'a4,4 0 0 1 4,4V' + (yv + hb) + 'Z" fill="' + col + '" opacity="' + (on ? 1 : .45) + '"/>';
              if (g === 1 && (V.labelNilai === 'semua' || (V.sorot ? String(c) === String(V.sorot) : false))) s += '<text x="' + X(k) + '" y="' + (yv - 8) + '" text-anchor="middle" class="nilai">' + f(v) + '</text>';
            }
          });
          if (tumpuk && (String(c) === String(V.sorot) || V.labelNilai === 'semua')) s += '<text x="' + X(k) + '" y="' + (Y(acc) - 8) + '" text-anchor="middle" class="nilai">' + f(acc) + '</text>';
        });
      }
      s += '<line class="gp-x" x1="0" x2="0" y1="' + m.t + '" y2="' + (H - m.b) + '" stroke="#FEFAE0" stroke-opacity=".45" style="display:none"/>';
      kat.forEach(function (c, k) { s += '<rect class="hit" data-k="' + k + '" x="' + (X(k) - bw / 2) + '" y="' + m.t + '" width="' + bw + '" height="' + (H - m.t - m.b) + '"/>'; });
    }
    s += '<text x="' + (datar ? m.l : m.l) + '" y="13" class="gp-sat">' + esc(V.satuan ? 'Satuan: ' + V.satuan : '') + '</text>';
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', (b.subjudul || 'Grafik').replace(/\*/g, '')); svg.innerHTML = s;
    var cx = svg.querySelector('.gp-x');
    svg.querySelectorAll('.hit').forEach(function (r) {
      var k = +r.dataset.k, show = function (ev) {
        var sc = svg.getBoundingClientRect().width / W, tot = 0;
        var baris = aktif.map(function (x) { var v = +x.s.nilai[k] || 0; tot += v; return '<div><i style="background:' + ((x.s.warnaPer || [])[k] || x.s.warna) + '"></i>' + esc(x.s.nama) + '<b>' + f(v) + ' ' + esc(V.satuanTip || V.satuan || '') + '</b></div>'; }).join('');
        if (tumpuk) baris += '<div class="tot">Total<b>' + f(tot) + ' ' + esc(V.satuan || '') + '</b></div>';
        if (V.labelBatang && datar) baris += '<div class="tot">Porsi: ' + esc(V.labelBatang[k]) + '</div>';
        tip.innerHTML = '<strong>' + esc(kat[k]) + '</strong>' + baris;
        var bx = +r.getAttribute('x') + +r.getAttribute('width') / 2, by = +r.getAttribute('y');
        if (cx) { cx.setAttribute('x1', bx); cx.setAttribute('x2', bx); cx.style.display = ''; }
        var kv = fig.querySelector('.gp-kanvas').getBoundingClientRect(), px = ev && ev.clientX != null ? ev.clientX - kv.left : bx * sc, py = ev && ev.clientY != null ? ev.clientY - kv.top : by * sc + 20;
        tip.classList.add('on'); var tw = tip.offsetWidth || 200;
        var left = px + 18; if (left + tw > kv.width) left = px - tw - 18; left = Math.max(0, Math.min(left, kv.width - tw));
        tip.style.left = left + 'px'; tip.style.top = Math.max(0, py - 30) + 'px'; tip.classList.add('on');
      };
      r.addEventListener('mousemove', show); r.addEventListener('touchstart', function (e) { show(e.touches[0]); }, { passive: true }); r.addEventListener('click', show);
      r.addEventListener('mouseleave', function () { tip.classList.remove('on'); if (cx) cx.style.display = 'none'; });
    });
    var lg = fig.querySelector('.gp-legenda');
    lg.innerHTML = V.seri.length > 1 ? V.seri.map(function (x) { return '<button type="button" aria-pressed="' + !st.mati[x.nama] + '" data-n="' + esc(x.nama) + '"><i style="background:' + x.warna + '"></i>' + esc(x.nama) + '</button>'; }).join('') + '<span class="gp-pet">klik untuk sembunyikan/tampilkan</span>' : '';
    lg.querySelectorAll('button').forEach(function (bt) { bt.addEventListener('click', function () {
      var nm = bt.dataset.n, sisa = V.seri.filter(function (x) { return !st.mati[x.nama]; }).length;
      if (!st.mati[nm] && sisa <= 1) return; st.mati[nm] = !st.mati[nm]; gplus(fig, b);
    }); });
    var tb = fig.querySelector('.gp-tabel');
    tb.innerHTML = '<table><thead><tr><th></th>' + V.seri.map(function (x) { return '<th>' + esc(x.nama) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      kat.map(function (c, k) { return '<tr><th>' + esc(c) + '</th>' + V.seri.map(function (x) { return '<td>' + f(x.nilai[k]) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    var ket = fig.querySelector('.gp-ket'); ket.innerHTML = V.ket ? esc(V.ket).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') : ''; ket.hidden = !V.ket;
  }
  function semuaGplus() { main.querySelectorAll('[data-gplus]').forEach(function (fg) { gplus(fg, GPLUS[+fg.dataset.gplus]); }); }
  main.querySelectorAll('[data-gplus]').forEach(function (fg) {
    var b = GPLUS[+fg.dataset.gplus];
    fg.querySelectorAll('.gp-ganti button').forEach(function (bt, i) { bt.addEventListener('click', function () { fg._st = { v: i, mati: {} }; fg.querySelectorAll('.gp-ganti button').forEach(function (x, j) { x.classList.toggle('aktif', j === i); x.setAttribute('aria-pressed', j === i); }); gplus(fg, b); }); });
  });
  semuaGplus(); var rtg; window.addEventListener('resize', function () { clearTimeout(rtg); rtg = setTimeout(semuaGplus, 150); });

  /* --- peta scroll --- */
  if ('IntersectionObserver' in window) {
    var ioL = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sc = e.target.closest('.scroll'), k = +e.target.dataset.k;
        sc.querySelectorAll('.langkah').forEach(function (l) { l.classList.toggle('aktif', l === e.target); });
        sc.querySelectorAll('.tumpuk img').forEach(function (im, j) { im.classList.toggle('aktif', j === k); });
        sc.querySelectorAll('.titik-langkah i').forEach(function (d, j) { d.classList.toggle('aktif', j <= k); });
        sc.querySelector('[data-sumber]').textContent = e.target.dataset.sumber || '';
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    main.querySelectorAll('.langkah').forEach(function (l) { ioL.observe(l); });

    /* --- nomor lembar di bar atas --- */
    var lbL = document.getElementById('lbLabel'), lbN = document.getElementById('lbNo');
    lbN.textContent = '00 / ' + pad2(total);
    var noTxt = function (n) { return +n ? pad2(+n) + ' / ' + pad2(total) : '—'; };
    var ioS = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { lbL.textContent = e.target.dataset.label; lbN.textContent = noTxt(e.target.dataset.no); } });
    }, { rootMargin: '-40% 0px -55% 0px' });
    main.querySelectorAll('[data-label]').forEach(function (s) { ioS.observe(s); });
  }
  var bar = document.getElementById('lbProgres');
  window.addEventListener('scroll', function () { var dh = document.documentElement.scrollHeight - innerHeight; bar.style.width = (dh > 0 ? scrollY / dh * 100 : 0) + '%'; }, { passive: true });

  /* --- perbandingan geser --- */
  main.querySelectorAll('.banding input').forEach(function (r) {
    var box = r.closest('.banding'), atas = box.querySelector('.atas'), g = box.querySelector('.garis-geser');
    var set = function () { atas.style.clipPath = 'inset(0 ' + (100 - r.value) + '% 0 0)'; g.style.left = 'calc(10px + (100% - 20px) * ' + r.value / 100 + ')'; };
    r.addEventListener('input', set); set();
  });

  /* --- muncul saat digulir + angka berhitung --- */
  var hitung = function (el) {
    var akhir = el.dataset.akhir || el.firstChild.nodeValue; el.dataset.akhir = akhir;
    var angka = parseFloat(akhir.replace(/\./g, '').replace(',', '.'));
    if (isNaN(angka) || angka === 0) return;
    var t0 = null, dur = 1100, desimal = (akhir.split(',')[1] || '').length;
    var jalan = function (ts) { if (!t0) t0 = ts; var r = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - r, 3);
      el.firstChild.nodeValue = r < 1 ? (angka * e).toLocaleString('id-ID', { minimumFractionDigits: desimal, maximumFractionDigits: desimal }) : akhir;
      if (r < 1) requestAnimationFrame(jalan); };
    requestAnimationFrame(jalan);
  };
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ioM = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.add('tampak'); ioM.unobserve(e.target);
        if (e.target.matches('.angka')) e.target.querySelectorAll('b').forEach(hitung); });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.muncul').forEach(function (el) { ioM.observe(el); });
  } else { document.querySelectorAll('.muncul').forEach(function (el) { el.classList.add('tampak'); }); }

  /* --- garis kontur bergerak di sampul --- */
  (function () {
    var cv = document.getElementById('kontur'); if (!cv) return; var ctx = cv.getContext('2d'), W, H, dpr;
    var gerak = !matchMedia('(prefers-reduced-motion: reduce)').matches, t0 = performance.now(), tampil = true, jalan = false;
    function ukur() { var r = cv.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function gambar(ts) {
      var t = gerak ? (ts - t0) / 9000 : 0; ctx.clearRect(0, 0, W, H);
      var n = 26;
      for (var k = 0; k < n; k++) {
        var base = H * (k / (n - 1)) * 1.2 - H * .1;
        ctx.beginPath();
        for (var x = 0; x <= W + 10; x += 10) {
          var u = x / W, y = base + Math.sin(u * 5.2 + k * .35 + t) * 26 + Math.sin(u * 11.5 - k * .2 - t * 1.4) * 9 + Math.cos(u * 2.1 + t * .6) * 40 * (1 - u);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = k % 5 === 0 ? 'rgba(221,161,94,.5)' : 'rgba(254,250,224,.14)';
        ctx.lineWidth = k % 5 === 0 ? 1.4 : 1; ctx.stroke();
      }
      if (gerak && tampil) requestAnimationFrame(gambar); else jalan = false;
    }
    ukur(); jalan = true; requestAnimationFrame(gambar);
    addEventListener('resize', function () { ukur(); if (!jalan) { jalan = true; requestAnimationFrame(gambar); } });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { tampil = es[0].isIntersecting; if (tampil && !jalan) { jalan = true; requestAnimationFrame(gambar); } }).observe(cv);
  })();

  /* --- peta per tahun / per kategori --- */
  document.querySelectorAll('[data-ptab]').forEach(function (box) {
    var btn = [].slice.call(box.querySelectorAll('.ptab-nav [data-k]')), imgs = box.querySelectorAll('.tumpuk img'),
      info = box.querySelectorAll('.ptab-isi'), cap = box.querySelector('.ptab-cap'), play = box.querySelector('.ptab-putar'), cur = 0, timer = null;
    function pilih(k) {
      cur = k;
      btn.forEach(function (b, j) { b.classList.toggle('aktif', j === k); b.classList.toggle('lewat', j < k); b.setAttribute('aria-selected', j === k); });
      imgs.forEach(function (im, j) { im.classList.toggle('aktif', j === k); });
      info.forEach(function (d, j) { d.hidden = j !== k; });
      if (cap) cap.textContent = btn[k].textContent;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; if (play) play.textContent = '▶ Putar'; } }
    btn.forEach(function (b) { b.addEventListener('click', function () { stop(); pilih(+b.dataset.k); }); });
    box.querySelector('.ptab-nav').addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault(); var k = (cur + (e.key === 'ArrowRight' ? 1 : -1) + btn.length) % btn.length; stop(); pilih(k); btn[k].focus();
    });
    if (play) play.addEventListener('click', function () {
      if (timer) { stop(); return; }
      play.textContent = '❚❚ Jeda'; if (cur === btn.length - 1) pilih(0);
      timer = setInterval(function () { if (cur >= btn.length - 1) { stop(); return; } pilih(cur + 1); }, 1700);
    });
  });

  /* --- peta interaktif (Leaflet) --- */
  (function () {
    var boxes = document.querySelectorAll('[data-pint]'), boxL = document.querySelectorAll('[data-plg]'), boxW = document.querySelectorAll('[data-pweb]'); if (!boxes.length && !boxL.length && !boxW.length) return;
    function muat(src, css) {
      return new Promise(function (ok, gagal) {
        var el = document.createElement(css ? 'link' : 'script');
        if (css) { el.rel = 'stylesheet'; el.href = src; } else { el.src = src; }
        el.onload = ok; el.onerror = gagal; document.head.appendChild(el);
      });
    }
    var fmt = function (v) { return (+v).toLocaleString('id-ID', { maximumFractionDigits: 0 }); };
    var cdn = ['https://unpkg.com/leaflet@1.9.4/dist/', 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/'];
    var muatLeaflet = function (i) {
      if (i >= cdn.length) return Promise.reject();
      return muat(cdn[i] + 'leaflet.css', true).catch(function () {}).then(function () { return muat(cdn[i] + 'leaflet.js'); }).catch(function () { return muatLeaflet(i + 1); });
    };
    var WL = ['#FBC02D', '#F57C00', '#D32F2F'], WG = ['#F57F17', '#E65100', '#B71C1C'];
    function petaLereng(box) {
      var cfg = PINT[+box.dataset.plg], folder = cfg.folder || 'data/', T = cfg.tahun || [];
      var map = L.map(box.querySelector('.peta-leaflet'), { scrollWheelZoom: false, zoomSnap: 0.25 });
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Citra: Esri World Imagery' }).addTo(map);
      var info = box.querySelector('.pint-info'), btn = [].slice.call(box.querySelectorAll('.ptab-nav [data-k]')), play = box.querySelector('.ptab-putar'), strip = box.querySelector('.plg-batang');
      var cap = L.DomUtil.create('div', 'cap-tahun', box.querySelector('.peta-leaflet'));
      var R = null, RR = {}, lap = {}, aktif = null, cur = 0, timer = null, nyala = [true, true, true], wil = '', masker = {}, bbTmg = null, bbDas = null, wbtn = [].slice.call(box.querySelectorAll('.plg-wil button'));
      function gaya(f) { var i = f.properties.i; return { className: 'lap-tahun', color: WL[i], weight: 1.3, fillColor: WL[i], fillOpacity: nyala[i] ? .95 : 0, opacity: nyala[i] ? 1 : 0 }; }
      function pop(p, y, RW) {
        var d = RW.info[p.kelas] || {}, tot = RW.total[y].reduce(function (a, b) { return a + b; }, 0);
        return '<div class="pint-pop"><b>' + esc(p.kelas) + ' · ' + y + '</b><span>Kemiringan ' + esc(d.rentang) + ' (' + esc(d.derajat) + ')</span>' +
          '<div class="pop-baris"><em>Hutan hilang</em><strong>' + fmt(p.ha) + ' ha</strong></div>' +
          '<div class="pop-baris"><em>Porsi tahun ini</em><strong>' + Math.round(p.ha / tot * 100) + '%</strong></div>' +
          '<p class="pop-risiko">Risiko: ' + esc(d.risiko) + '</p></div>';
      }
      function isiInfo(y) {
        var t = R.total[y], tot = t[0] + t[1] + t[2];
        info.innerHTML = '<div class="ptab-besar">' + y + '</div>' +
          '<dl><div><dt>' + (wil ? 'Hutan hilang di lereng Kab. Aceh Tamiang (dalam DAS)' : 'Hutan hilang di lereng DAS Tamiang') + '</dt><dd><b>' + fmt(tot) + '</b> ha</dd></div></dl>' +
          '<div class="plg-kelas">' + R.kelas.map(function (k, i) {
            var d = R.info[k] || {};
            return '<label class="' + (nyala[i] ? '' : 'mati') + '"><input type="checkbox" data-i="' + i + '"' + (nyala[i] ? ' checked' : '') + '>' +
              '<i style="background:' + WL[i] + '"></i><span>' + esc(k) + '<small>' + esc(d.rentang) + '</small></span>' +
              '<b>' + fmt(t[i]) + ' ha<small>' + Math.round(t[i] / tot * 100) + '%</small></b></label>';
          }).join('') + '</div>' +
          '<p class="kode" style="margin-top:10px">Kecamatan terbanyak</p><ol class="pint-top">' +
          R.kec[y].filter(function (r) { return r[1] + r[2] + r[3] >= 0.5; }).slice(0, 4).map(function (r) { var n = r[0].split('|'), s3 = r[1] + r[2] + r[3];
            return '<li><span>' + esc(n[0]) + '<small>' + esc(n[1]) + ' · ' + Math.round(r[3] / s3 * 100) + '% sangat curam</small></span><b>' + fmt(s3) + ' ha</b></li>'; }).join('') + '</ol>' +
          (wil ? '<p class="pint-petunjuk">Hanya bagian Aceh Tamiang yang masuk DAS. Hulu DAS lainnya ada di Gayo Lues dan Aceh Timur: klik <b>DAS Tamiang</b>.</p>' : '<p class="pint-petunjuk">Garis merah: batas DAS Tamiang (562.251 ha). Data kehilangan hutan mencakup bagian DAS di dalam Kawasan Ekosistem Leuser, sekitar 70% luas DAS. Klik garis merah untuk info DAS.</p>') +
          '<p class="pint-petunjuk">Centang/hapus centang kelas lereng untuk menyaring peta. Klik area berwarna untuk detail risikonya.</p>';
        [].forEach.call(info.querySelectorAll('input[data-i]'), function (c) {
          c.addEventListener('change', function () { nyala[+c.dataset.i] = c.checked; c.parentNode.classList.toggle('mati', !c.checked); if (aktif) aktif.setStyle(gaya); });
        });
      }
      function batang() {
        var maks = Math.max.apply(null, T.map(function (y) { return R.total[y].reduce(function (a, b) { return a + b; }, 0); }));
        strip.innerHTML = '<p class="kode">Luas hutan hilang per kelas lereng (ha) · klik batangnya</p><div class="plg-kolom">' + T.map(function (y, k) {
          var t = R.total[y], tot = t[0] + t[1] + t[2];
          return '<button type="button" data-k="' + k + '" title="' + y + ': ' + fmt(tot) + ' ha"><span class="plg-nilai">' + fmt(tot) + '</span><span class="plg-tumpuk" style="height:' + Math.max(2, tot / maks * 100) + '%">' +
            [2, 1, 0].map(function (i) { return '<i style="flex:' + t[i] + ';background:' + WL[i] + '"></i>'; }).join('') + '</span><em>' + y + '</em></button>';
        }).join('') + '</div>';
        [].forEach.call(strip.querySelectorAll('button'), function (b) { b.addEventListener('click', function () { stop(); pilih(+b.dataset.k); }); });
      }
      function pilih(k) {
        cur = k; var y = T[k];
        cap.textContent = y; cap.classList.remove('ganti'); void cap.offsetWidth; cap.classList.add('ganti');
        btn.forEach(function (b, j) { b.classList.toggle('aktif', j === k); b.classList.toggle('lewat', j < k); b.setAttribute('aria-selected', j === k); });
        [].forEach.call(strip.querySelectorAll('button'), function (b, j) { b.classList.toggle('aktif', j === k); });
        isiInfo(y);
        var kunci = wil + y, w0 = wil, RW = R;
        var tampil = function () { if (aktif) map.removeLayer(aktif); aktif = lap[kunci].addTo(map); aktif.setStyle(gaya); };
        if (lap[kunci]) { tampil(); return; }
        info.classList.add('memuat');
        fetch(folder + 'lereng' + wil + '-' + y + '.geojson').then(function (r) { return r.json(); }).then(function (gj) {
          gj.features.sort(function (a, b) { return a.properties.i - b.properties.i; });
          lap[kunci] = L.geoJSON(gj, { style: gaya, onEachFeature: function (f, l) { l.bindPopup(pop(f.properties, y, RW), { maxWidth: 280 }); } });
          info.classList.remove('memuat'); if (T[cur] === y && wil === w0) tampil();
        });
      }
      function gantiWil(w) {
        wil = w; wbtn.forEach(function (b) { b.classList.toggle('aktif', b.dataset.w === w); });
        var lanjut = function () {
          R = RR[w]; Object.keys(masker).forEach(function (k) { if (k === w) masker[k].addTo(map); else map.removeLayer(masker[k]); });
          var bb = w ? bbTmg : bbDas; map.fitBounds(bb, { padding: [8, 8] }); setTimeout(function () { map.invalidateSize(); map.fitBounds(bb, { padding: [8, 8] }); }, 400);
          batang(); pilih(cur);
        };
        if (RR[w]) { lanjut(); return; }
        fetch(folder + 'lereng' + w + '.json').then(function (r) { return r.json(); }).then(function (j) { RR[w] = j; lanjut(); });
      }
      Promise.all([fetch(folder + 'kabupaten.geojson').then(function (r) { return r.json(); }), fetch(folder + 'masker-tamiang.geojson').then(function (r) { return r.json(); }), fetch(folder + 'masker-das.geojson').then(function (r) { return r.json(); }), fetch(folder + 'das-tamiang.geojson').then(function (r) { return r.json(); })]).then(function (d) {
        var gm = { stroke: false, fillColor: '#283618', fillOpacity: .72, interactive: false };
        masker['-tmg'] = L.geoJSON(d[1], { interactive: false, style: gm }); masker[''] = L.geoJSON(d[2], { interactive: false, style: gm });
        var kab = L.geoJSON(d[0], { interactive: false, style: function (f) { var t = f.properties.kab === (cfg.sorotKab || ''); return { color: '#FEFAE0', weight: t ? 3 : 1.2, opacity: t ? 1 : .6, dashArray: t ? null : '6 5', fill: false }; } }).addTo(map);
        kab.eachLayer(function (l) { if (l.feature.properties.kab === cfg.sorotKab) bbTmg = l.getBounds(); });
        var das = L.geoJSON(d[3], { style: { color: '#DC143C', weight: 3, fill: true, fillOpacity: 0 }, onEachFeature: function (f, l) {
          var p = f.properties;
          l.bindPopup('<div class="pint-pop"><b>' + esc(p.NAMA_DAS) + '</b><span>' + esc(p.KODE_DAS) + ' · ' + esc(p.NAMA_KLHK) + '</span>' +
            [['Luas', fmt(p.LUAS_HA) + ' ha'], ['Di dalam KEL', fmt(p.LUAS_KEL) + ' ha (' + p.PERSEN_KEL + '%)'], ['Sungai', p.SUNGAI], ['Hulu', p.HULU], ['Hilir', p.HILIR], ['Kabupaten', p.KABUPATEN], ['Status', p.LINTAS]].map(function (r) { return '<div class="pop-baris"><em>' + r[0] + '</em><strong>' + esc(r[1]) + '</strong></div>'; }).join('') +
            '<p class="pop-risiko" style="color:#5c6440">Sumber: ' + esc(p.SUMBER) + '</p></div>', { maxWidth: 320 });
        } }).addTo(map);
        bbDas = das.getBounds(); das.bringToBack();
        cur = T.length - 1; gantiWil('');
      });
      wbtn.forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.w !== wil) gantiWil(b.dataset.w); }); });
      btn.forEach(function (b) { b.addEventListener('click', function () { stop(); pilih(+b.dataset.k); }); });
      function stop() { if (timer) { clearInterval(timer); timer = null; play.textContent = '▶ Putar'; } }
      play.addEventListener('click', function () {
        if (timer) { stop(); return; } play.textContent = '❚❚ Jeda'; pilih(0);
        timer = setInterval(function () { if (cur >= T.length - 1) { stop(); return; } pilih(cur + 1); }, 2200);
      });
    }
    /* ===== peta-web: mesin peta umum (tab / tahun / geser / dasar) ===== */
    var CACHE = {};
    function ambil(f) { if (!CACHE[f]) CACHE[f] = fetch(f).then(function (r) { if (!r.ok) throw new Error(f); return r.json(); }); return CACHE[f]; }
    var DASAR = {
      citra: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Citra: Esri World Imagery' }],
      relief: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, maxNativeZoom: 13, attribution: 'Relief: Esri' }],
      topo: ['https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, subdomains: 'abc', attribution: 'Topografi: OpenTopoMap (CC-BY-SA)' }]
    };
    var NAMA_DASAR = { citra: 'Citra', relief: 'Relief', topo: 'Topografi' };
    function nilaiF(p, k) { return typeof k === 'function' ? k(p) : p[k]; }
    function angkaF(v, d) { if (v == null || v === '') return '–'; if (typeof v !== 'number') return esc(v); return v.toLocaleString('id-ID', { maximumFractionDigits: d == null ? 1 : d }); }
    function warnaDari(L0, p) {
      if (L0.warnaDari) { var v = p[L0.warnaDari.field]; return L0.warnaDari.nilai[v] || L0.warnaDari.lain || '#999'; }
      if (L0.skala) { var x = +p[L0.skala.field] || 0, b = L0.skala.batas, i = 0; while (i < b.length && x >= b[i]) i++; return L0.skala.warna[i]; }
      return L0.warna || '#DDA15E';
    }
    function gayaLapis(L0) {
      return function (f) {
        var p = f.properties, w = warnaDari(L0, p);
        if (L0.tipe === 'garis') {
          var t = L0.tebalDari ? (L0.tebalDari.nilai[p[L0.tebalDari.field]] || 1) : (L0.tebal || 1.5);
          return { color: w, weight: t, opacity: L0.opasitas == null ? .95 : L0.opasitas, lineCap: 'round' };
        }
        return { color: L0.garis || w, weight: L0.tebal == null ? .8 : L0.tebal, opacity: 1, fillColor: w, fillOpacity: L0.isi == null ? .65 : L0.isi, dashArray: L0.putus || null };
      };
    }
    function popupLapis(L0, p) {
      var P = L0.popup; if (!P) return null;
      return '<div class="pint-pop"><b>' + esc(nilaiF(p, P.judul)) + '</b>' + (P.sub ? '<span>' + esc(nilaiF(p, P.sub)) + '</span>' : '') +
        (P.baris || []).map(function (r) { var v = nilaiF(p, r[1]); return '<div class="pop-baris"><em>' + esc(r[0]) + '</em><strong>' + angkaF(v, r[3]) + (r[2] && v != null ? ' ' + esc(r[2]) : '') + '</strong></div>'; }).join('') +
        (P.catatan ? '<p class="pop-risiko">' + esc(nilaiF(p, P.catatan)) + '</p>' : '') + '</div>';
    }
    function petaWeb(box) {
      var cfg = PINT[+box.dataset.pweb], folder = cfg.folder || 'data/', TAB = cfg.tab || [], LAP = cfg.lapis || {};
      var el = box.querySelector('.peta-leaflet');
      var map = L.map(el, { scrollWheelZoom: false, zoomSnap: 0.25 });
      var dasar = {}, dAktif = null;
      function pakaiDasar(k) { if (dAktif) map.removeLayer(dasar[dAktif]); if (!dasar[k]) dasar[k] = L.tileLayer(DASAR[k][0], DASAR[k][1]); dasar[k].addTo(map).bringToBack(); dAktif = k; [].forEach.call(box.querySelectorAll('.pweb-dasar button'), function (b) { b.classList.toggle('aktif', b.dataset.d === k); }); }
      pakaiDasar(cfg.dasar || 'citra');
      [].forEach.call(box.querySelectorAll('.pweb-dasar button'), function (b) { L.DomEvent.disableClickPropagation(b); b.addEventListener('click', function () { pakaiDasar(b.dataset.d); }); });
      map.createPane('geser'); map.getPane('geser').style.zIndex = 450;
      var info = box.querySelector('.pint-info'), btn = [].slice.call(box.querySelectorAll('.ptab-nav [data-k]')), play = box.querySelector('.ptab-putar');
      var inst = {}, tampil = [], cur = -1, timer = null, bbDas = null, gs = box.querySelector('.pweb-geser'), gx = .5;
      function lapis(id, sisi) {
        var key = id + (sisi ? '@' + sisi : '');
        if (inst[key]) return Promise.resolve(inst[key]);
        var L0 = LAP[id];
        return ambil(folder + L0.file).then(function (gj) {
          if (L0.urut) gj.features.sort(function (a, b) { return (a.properties[L0.urut] || 0) - (b.properties[L0.urut] || 0); });
          var st = gayaLapis(L0);
          var lyr = L.geoJSON(gj, { pane: sisi ? 'geser' : 'overlayPane', style: st, interactive: !!(L0.popup || L0.tooltip), filter: L0.saring ? function (f) { return L0.saring(f.properties); } : null,
            onEachFeature: function (f, l) {
              if (L0.popup) l.bindPopup(popupLapis(L0, f.properties), { maxWidth: 300 });
              if (L0.tooltip) l.bindTooltip(String(nilaiF(f.properties, L0.tooltip)), { sticky: true, className: 'pweb-tip' });
              if (L0.popup && L0.tipe !== 'garis') { l.on('mouseover', function () { l.setStyle({ weight: (st(f).weight || 1) + 1.6, color: '#FEFAE0' }); }); l.on('mouseout', function () { l.setStyle(st(f)); }); }
              if (L0.popup && L0.tipe === 'garis') { l.on('mouseover', function () { l.setStyle({ weight: st(f).weight + 2.5 }); }); l.on('mouseout', function () { l.setStyle(st(f)); }); }
            } });
          inst[key] = lyr; return lyr;
        });
      }
      function klip() {
        if (!gs || gs.hidden) { map.getPane('geser').style.clip = ''; return; }
        var sz = map.getSize(), nw = map.containerPointToLayerPoint([0, 0]), se = map.containerPointToLayerPoint(sz), x = map.containerPointToLayerPoint([sz.x * gx, 0]).x;
        map.getPane('geser').style.clip = 'rect(' + [nw.y, se.x, se.y, x].join('px,') + 'px)';
        gs.style.left = (gx * 100) + '%';
      }
      map.on('move zoom resize', klip);
      if (gs) {
        var seret = false;
        L.DomEvent.disableClickPropagation(gs); L.DomEvent.disableScrollPropagation(gs);
        gs.addEventListener('pointerdown', function (e) { seret = true; gs.setPointerCapture(e.pointerId); map.dragging.disable(); e.preventDefault(); });
        gs.addEventListener('pointermove', function (e) { if (!seret) return; var r = el.getBoundingClientRect(); gx = Math.min(.97, Math.max(.03, (e.clientX - r.left) / r.width)); klip(); });
        gs.addEventListener('pointerup', function () { seret = false; map.dragging.enable(); });
        gs.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') gx = Math.max(.03, gx - .05); else if (e.key === 'ArrowRight') gx = Math.min(.97, gx + .05); else return; klip(); e.preventDefault(); });
      }
      function isiInfo(T) {
        info.innerHTML = '<div class="ptab-besar">' + esc(T.besar || T.label) + '</div>' +
          (T.judul ? '<h4 class="pweb-judul">' + esc(T.judul) + '</h4>' : '') +
          (T.angka ? '<dl>' + T.angka.map(function (a) { return '<div><dt>' + esc(a.keterangan) + '</dt><dd><b>' + esc(a.nilai) + '</b> ' + esc(a.satuan || '') + '</dd></div>'; }).join('') + '</dl>' : '') +
          (T.legenda ? '<div class="pweb-legenda">' + T.legenda.map(function (l) { return '<span><i class="' + (l.garis ? 'g' : '') + '" style="' + (l.garis ? 'border-color:' : 'background:') + esc(l.warna) + '"></i>' + esc(l.label) + '</span>'; }).join('') + '</div>' : '') +
          (T.teks ? '<p class="pweb-teks">' + esc(T.teks).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>' : '') +
          (T.petunjuk || cfg.petunjuk ? '<p class="pint-petunjuk">' + esc(T.petunjuk || cfg.petunjuk) + '</p>' : '');
      }
      function pilih(k) {
        cur = k; var T = TAB[k]; if (T.dasar && T.dasar !== dAktif) pakaiDasar(T.dasar);
        btn.forEach(function (b, j) { b.classList.toggle('aktif', j === k); b.classList.toggle('lewat', j < k); b.setAttribute('aria-selected', j === k); });
        isiInfo(T); info.classList.add('memuat');
        var ids = (T.lapis || []).map(function (i) { return [i, null]; });
        if (T.geser) ids = T.geser.kiri.map(function (i) { return [i, null]; }).concat(T.geser.kanan.map(function (i) { return [i, 'kanan']; }));
        if (gs) { gs.hidden = !T.geser; if (T.geser) { gs.querySelector('.gk').textContent = T.geser.labelKiri || ''; gs.querySelector('.gn').textContent = T.geser.labelKanan || ''; } }
        var k0 = k;
        Promise.all(ids.map(function (x) { return lapis(x[0], x[1]); })).then(function (ls) {
          if (cur !== k0) return;
          tampil.forEach(function (l) { map.removeLayer(l); }); tampil = ls;
          ls.forEach(function (l) { l.addTo(map); });
          if (inst.__das) inst.__das.bringToFront();
          info.classList.remove('memuat'); klip();
          if (T.fit) map.flyToBounds(T.fit === 'das' ? bbDas : T.fit, { duration: .8, padding: [8, 8] });
        }).catch(function () { info.classList.remove('memuat'); });
      }
      var siap = cfg.das === false ? Promise.resolve() : Promise.all([ambil(folder + 'das-tamiang.geojson'), ambil(folder + 'masker-das.geojson')]).then(function (d) {
        L.geoJSON(d[1], { interactive: false, style: { stroke: false, fillColor: '#283618', fillOpacity: cfg.masker == null ? .6 : cfg.masker } }).addTo(map);
        inst.__das = L.geoJSON(d[0], { interactive: false, style: { color: '#DC143C', weight: 2.6, fill: false } }).addTo(map);
        bbDas = inst.__das.getBounds();
      });
      siap.then(function () {
        var bb = cfg.awal || bbDas; if (bb) { map.fitBounds(bb, { padding: [8, 8] }); setTimeout(function () { map.invalidateSize(); map.fitBounds(bb, { padding: [8, 8] }); }, 400); }
        pilih(cfg.mulai == null ? 0 : cfg.mulai);
      });
      btn.forEach(function (b) { b.addEventListener('click', function () { stop(); pilih(+b.dataset.k); }); });
      function stop() { if (timer) { clearInterval(timer); timer = null; if (play) play.textContent = '▶ Putar'; } }
      if (play) play.addEventListener('click', function () {
        if (timer) { stop(); return; } play.textContent = '❚❚ Jeda'; pilih(0);
        timer = setInterval(function () { if (cur >= TAB.length - 1) { stop(); return; } pilih(cur + 1); }, cfg.jeda || 2400);
      });
    }
    muatLeaflet(0).then(function () {
      boxW.forEach(petaWeb);
      boxL.forEach(petaLereng);
      boxes.forEach(function (box) {
        var cfg = PINT[+box.dataset.pint], folder = cfg.folder || 'data/', T = cfg.tahun || [];
        var map = L.map(box.querySelector('.peta-leaflet'), { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Citra: Esri World Imagery' }).addTo(map);
        var cap = L.DomUtil.create('div', 'cap-tahun', box.querySelector('.peta-leaflet'));
        var info = box.querySelector('.pint-info'), btn = [].slice.call(box.querySelectorAll('.ptab-nav [data-k]')), play = box.querySelector('.ptab-putar');
        var lapKec, lapHilang = {}, aktif = null, ringkas = {}, kecData = null, cur = 0, timer = null;
        var gaya = function (y) {
          return function (f) {
            var v = f.properties['h' + y] || 0, a = Math.min(1, Math.sqrt(v / 3600));
            return { color: '#FEFAE0', weight: 1, opacity: .55, fillColor: '#DDA15E', fillOpacity: v > 0 ? .06 + a * .5 : 0 };
          };
        };
        function isiInfo(y) {
          var top = kecData.features.slice().sort(function (a, b) { return (b.properties['h' + y] || 0) - (a.properties['h' + y] || 0); }).slice(0, 5);
          info.innerHTML = '<div class="ptab-besar">' + y + '</div>' +
            '<dl><div><dt>Hutan hilang di DAS Tamiang</dt><dd><b>' + fmt(ringkas.total[y] || 0) + '</b> ha</dd></div></dl>' +
            '<p class="kode" style="margin-top:6px">Kecamatan terbanyak (bagian di dalam DAS)</p><ol class="pint-top">' +
            top.map(function (f) { return '<li><span>' + esc(f.properties.kec) + '<small>' + esc(f.properties.kab) + '</small></span><b>' + fmt(f.properties['h' + y]) + ' ha</b></li>'; }).join('') + '</ol>' +
            '<p class="pint-petunjuk">Klik kecamatan di peta untuk melihat datanya per tahun.</p>';
        }
        function popupKec(p) {
          var maks = Math.max.apply(null, T.map(function (y) { return p['h' + y] || 0; }).concat([1]));
          return '<div class="pint-pop"><b>' + esc(p.kec) + '</b><span>' + esc(p.kab) + ' · ' + fmt(p.luas) + ' ha</span>' +
            T.map(function (y) { var v = p['h' + y] || 0; return '<div class="bar"><em>' + y + '</em><i style="width:' + (v / maks * 100) + '%"></i><strong>' + fmt(v) + ' ha</strong></div>'; }).join('') + '</div>';
        }
        function pilih(k) {
          cur = k; var y = T[k];
          cap.textContent = y; cap.classList.remove('ganti'); void cap.offsetWidth; cap.classList.add('ganti');
          btn.forEach(function (b, j) { b.classList.toggle('aktif', j === k); b.classList.toggle('lewat', j < k); b.setAttribute('aria-selected', j === k); });
          if (lapKec) lapKec.setStyle(gaya(y));
          if (kecData && ringkas.total) isiInfo(y);
          var tampil = function () {
            if (aktif) map.removeLayer(aktif);
            aktif = lapHilang[y].addTo(map); if (lapKec) lapKec.bringToBack();
          };
          if (lapHilang[y]) { tampil(); return; }
          info.classList.add('memuat');
          fetch(folder + 'hilang-' + y + '.geojson').then(function (r) { return r.json(); }).then(function (gj) {
            lapHilang[y] = L.geoJSON(gj, {
              style: function (f) { var nd = f.properties.k >= 11 && y === 2025; return { className: 'lap-tahun', color: nd ? '#FF6B35' : '#FFD166', weight: 1.4, fillColor: nd ? '#FF6B35' : '#FFD166', fillOpacity: .95 }; },
              onEachFeature: function (f, l) { l.bindTooltip(f.properties.bulan + ' ' + y + ': ' + fmt(f.properties.ha) + ' ha hilang', { sticky: true }); }
            });
            info.classList.remove('memuat'); if (T[cur] === y) tampil();
          });
        }
        Promise.all([fetch(folder + 'ringkas.json').then(function (r) { return r.json(); }), fetch(folder + 'kecamatan.geojson').then(function (r) { return r.json(); }), fetch(folder + 'kabupaten.geojson').then(function (r) { return r.json(); })]).then(function (d) {
          ringkas = d[0]; kecData = d[1];
          lapKec = L.geoJSON(kecData, { style: gaya(T[0]), onEachFeature: function (f, l) {
            l.bindPopup(popupKec(f.properties), { maxWidth: 280 });
            l.on('mouseover', function () { l.setStyle({ weight: 2.5, color: '#DDA15E' }); });
            l.on('mouseout', function () { lapKec.resetStyle(l); });
          } }).addTo(map);
          L.geoJSON(d[2], { interactive: false, style: function (f) { var t = f.properties.kab === (cfg.sorotKab || ''); return { color: t ? '#DDA15E' : '#FEFAE0', weight: t ? 3.5 : 1.8, dashArray: t ? null : '6 5', fill: false }; } }).addTo(map);
          var bbK = lapKec.getBounds();
          map.fitBounds(bbK, { padding: [10, 10] });
          setTimeout(function () { map.invalidateSize(); map.fitBounds(bbK, { padding: [10, 10] }); }, 400);
          if (cfg.das) Promise.all([ambil(folder + 'das-tamiang.geojson'), ambil(folder + 'masker-das.geojson')]).then(function (dd) {
            L.geoJSON(dd[1], { interactive: false, style: { stroke: false, fillColor: '#283618', fillOpacity: .55 } }).addTo(map);
            var dl = L.geoJSON(dd[0], { interactive: false, style: { color: '#DC143C', weight: 2.8, fill: false } }).addTo(map);
            bbK = dl.getBounds(); map.fitBounds(bbK, { padding: [8, 8] });
          });
          pilih(T.length - 1);
        });
        btn.forEach(function (b) { b.addEventListener('click', function () { stop(); pilih(+b.dataset.k); }); });
        function stop() { if (timer) { clearInterval(timer); timer = null; if (play) play.textContent = '▶ Putar'; } }
        if (play) play.addEventListener('click', function () {
          if (timer) { stop(); return; } play.textContent = '❚❚ Jeda'; pilih(0);
          timer = setInterval(function () { if (cur >= T.length - 1) { stop(); return; } pilih(cur + 1); }, 2200);
        });
      });
    }).catch(function () { [].slice.call(boxes).concat([].slice.call(boxL), [].slice.call(boxW)).forEach(function (b) { b.querySelector('.peta-leaflet').innerHTML = '<p style="padding:24px">Peta interaktif gagal dimuat. Periksa koneksi internet.</p>'; }); });
  })();

  (function () { var g = document.querySelector('[data-label="Genangan"]'), k = document.getElementById('keBanjir'); if (g && k) k.href = '#' + g.id; })();
  /* --- perbesar gambar --- */
  var lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p');
  document.addEventListener('click', function (e) {
    var el = e.target.closest('img.zoom'); if (!el || el.dataset.ganti) return;
    lbImg.src = el.src; lbCap.textContent = el.alt; lb.hidden = false;
  });
  lb.addEventListener('click', function () { lb.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.hidden = true; });
})();
