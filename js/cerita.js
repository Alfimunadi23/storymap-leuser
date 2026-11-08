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
  function penanda(file, rasio) {
    var w = 1200, h = Math.round(w * (rasio || 0.72));
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#e6dfbb" stroke-width="1"/></pattern></defs>' +
      '<rect width="100%" height="100%" fill="#f8f4de"/><rect width="100%" height="100%" fill="url(#g)"/>' +
      '<path d="M' + (w / 2 - 26) + ' ' + h / 2 + 'h52M' + w / 2 + ' ' + (h / 2 - 26) + 'v52" stroke="#606C38" stroke-width="2"/>' +
      '<circle cx="' + w / 2 + '" cy="' + h / 2 + '" r="16" fill="none" stroke="#606C38" stroke-width="2"/>' +
      '<text x="50%" y="' + (h / 2 + 70) + '" text-anchor="middle" font-family="Menlo,monospace" font-size="26" fill="#283618">TARUH FILE INI DI SINI</text>' +
      '<text x="50%" y="' + (h / 2 + 108) + '" text-anchor="middle" font-family="Menlo,monospace" font-size="24" fill="#BC6C25">' + esc(file) + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function img(file, alt, kelas, rasio) {
    return '<img class="' + (kelas || '') + '" src="' + esc(file) + '" alt="' + esc(alt || '') + '" data-file="' + esc(file) + '" data-rasio="' + (rasio || '') + '" loading="lazy">';
  }
  function pasangPenanda(root) {
    root.querySelectorAll('img[data-file]').forEach(function (el) {
      var gagal = function () { if (!el.dataset.ganti) { el.dataset.ganti = 1; el.src = penanda(el.dataset.file, +el.dataset.rasio || 0.72); } };
      el.addEventListener('error', gagal);
      if (el.complete && el.naturalWidth === 0 && el.getAttribute('src')) gagal();
      if (!el.dataset.file) gagal();
    });
  }
  function paragraf(arr) { return (arr || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join(''); }
  function gambarBingkai(g) {
    if (!g || !g.file) return '';
    return '<figure class="isi-lebar" style="margin:36px 0 0 174px"><div class="bingkai">' + img(g.file, g.keterangan, 'zoom') + '</div><figcaption>' + esc(g.keterangan) + '</figcaption></figure>';
  }

  /* --- sampul --- */
  document.title = (I.judul || 'Storymap').replace(/\*/g, '');
  document.getElementById('lbJudul').textContent = (I.judul || '').replace(/\*/g, '') + ' · ' + (I.kegiatan || '');
  var t = I.tim || {};
  var lg = function (l) { return img(l.file, l.nama || 'Logo', l.bentuk === 'persegi' ? 'persegi' : '', 1); };
  var logoHtml = function () { return '<div class="logo-atas"><div class="kiri">' + [].concat(I.logoKiri || []).map(lg).join('') + '</div><div class="kanan">' + [].concat(I.logoKanan || []).map(lg).join('') + '</div></div>'; };
  document.getElementById('sampul').innerHTML = '<canvas id="kontur" aria-hidden="true"></canvas>' +
    '<div class="wrap">' + logoHtml() + '<div>' +
    '<div class="kode">' + esc(I.kegiatan) + '</div>' +
    '<h1>' + sorotKata(I.judul) + '</h1><p class="sub">' + esc(I.subjudul) + '</p>' +
    (I.wilayah ? '<dl class="meta"><dt>Wilayah</dt><dd>' + esc(I.wilayah) + '</dd></dl>' : '') +
    '<a class="gulir" href="#b1">Mulai baca</a></div>' +
    '<figure style="margin:0"><div class="bingkai">' + img((I.sampul || {}).gambar, 'Sampul', 'zoom', 0.78) + '</div><figcaption>' + esc((I.sampul || {}).keterangan) + '</figcaption></figure></div>';

  /* --- bagian --- */
  var B = (I.bagian || []).filter(function (b) { return !(b.jenis === 'peta-web' && !b.alamat); });
  var GRAFIK = [], PINT = [], nBanding = 0, nomor = 0;
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
    var boxes = document.querySelectorAll('[data-pint]'); if (!boxes.length) return;
    function muat(src, css) {
      return new Promise(function (ok, gagal) {
        var el = document.createElement(css ? 'link' : 'script');
        if (css) { el.rel = 'stylesheet'; el.href = src; } else { el.src = src; }
        el.onload = ok; el.onerror = gagal; document.head.appendChild(el);
      });
    }
    var fmt = function (v) { return (+v).toLocaleString('id-ID', { maximumFractionDigits: 0 }); };
    muat('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', true).then(function () { return muat('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'); }).then(function () {
      boxes.forEach(function (box) {
        var cfg = PINT[+box.dataset.pint], folder = cfg.folder || 'data/', T = cfg.tahun || [];
        var map = L.map(box.querySelector('.peta-leaflet'), { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Citra: Esri World Imagery' }).addTo(map);
        var info = box.querySelector('.pint-info'), btn = [].slice.call(box.querySelectorAll('.ptab-nav [data-k]')), play = box.querySelector('.ptab-putar');
        var lapKec, lapHilang = {}, aktif = null, ringkas = {}, kecData = null, cur = 0, timer = null;
        var gaya = function (y) {
          return function (f) {
            var v = f.properties['h' + y] || 0, a = Math.min(1, v / 1500);
            return { color: '#FEFAE0', weight: 1, opacity: .7, fillColor: '#DDA15E', fillOpacity: v > 0 ? .08 + a * .32 : 0 };
          };
        };
        function isiInfo(y) {
          var top = kecData.features.slice().sort(function (a, b) { return (b.properties['h' + y] || 0) - (a.properties['h' + y] || 0); }).slice(0, 5);
          info.innerHTML = '<div class="ptab-besar">' + y + '</div>' +
            '<dl><div><dt>Hutan hilang di wilayah peta</dt><dd><b>' + fmt(ringkas.total[y] || 0) + '</b> ha</dd></div></dl>' +
            '<p class="kode" style="margin-top:6px">Kecamatan terbanyak</p><ol class="pint-top">' +
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
              style: function (f) { var nd = f.properties.k >= 11 && y === 2025; return { color: nd ? '#BC6C25' : '#DDA15E', weight: .6, fillColor: nd ? '#BC6C25' : '#DDA15E', fillOpacity: .9 }; },
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
          map.fitBounds(lapKec.getBounds(), { padding: [10, 10] });
          pilih(T.length - 1);
        });
        btn.forEach(function (b) { b.addEventListener('click', function () { stop(); pilih(+b.dataset.k); }); });
        function stop() { if (timer) { clearInterval(timer); timer = null; if (play) play.textContent = '▶ Putar'; } }
        if (play) play.addEventListener('click', function () {
          if (timer) { stop(); return; } play.textContent = '❚❚ Jeda'; pilih(0);
          timer = setInterval(function () { if (cur >= T.length - 1) { stop(); return; } pilih(cur + 1); }, 2200);
        });
      });
    }).catch(function () { boxes.forEach(function (b) { b.querySelector('.peta-leaflet').innerHTML = '<p style="padding:24px">Peta interaktif gagal dimuat. Periksa koneksi internet.</p>'; }); });
  })();

  /* --- perbesar gambar --- */
  var lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p');
  document.addEventListener('click', function (e) {
    var el = e.target.closest('img.zoom'); if (!el || el.dataset.ganti) return;
    lbImg.src = el.src; lbCap.textContent = el.alt; lb.hidden = false;
  });
  lb.addEventListener('click', function () { lb.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.hidden = true; });
})();
