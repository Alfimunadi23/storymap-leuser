/* Mesin storymap: membaca window.ISI (js/isi.js) lalu menyusun halaman.
   Tidak perlu diubah untuk mengisi konten. */
(function () {
  'use strict';
  var I = window.ISI || {};
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  /* --- kotak penanda bila file gambar belum ada --- */
  function penanda(file, rasio) {
    var w = 1200, h = Math.round(w * (rasio || 0.72));
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#c8cdc6" stroke-width="1"/></pattern></defs>' +
      '<rect width="100%" height="100%" fill="#eef0ec"/><rect width="100%" height="100%" fill="url(#g)"/>' +
      '<path d="M' + (w / 2 - 26) + ' ' + h / 2 + 'h52M' + w / 2 + ' ' + (h / 2 - 26) + 'v52" stroke="#57616b" stroke-width="2"/>' +
      '<circle cx="' + w / 2 + '" cy="' + h / 2 + '" r="16" fill="none" stroke="#57616b" stroke-width="2"/>' +
      '<text x="50%" y="' + (h / 2 + 70) + '" text-anchor="middle" font-family="Menlo,monospace" font-size="26" fill="#17202a">TAMBAHKAN FILE</text>' +
      '<text x="50%" y="' + (h / 2 + 108) + '" text-anchor="middle" font-family="Menlo,monospace" font-size="24" fill="#1d5f8a">' + esc(file) + '</text></svg>';
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
  document.title = I.judul || 'Storymap';
  document.getElementById('lbJudul').textContent = (I.judul || '') + ' · ' + (I.kegiatan || '');
  var t = I.tim || {};
  document.getElementById('sampul').innerHTML =
    '<div class="wrap"><div>' +
    (I.logo ? img(I.logo, 'Logo penyelenggara', 'logo-kecil', 1) : '') +
    '<div class="kode">' + esc(I.kegiatan) + '</div>' +
    '<h1>' + esc(I.judul) + '</h1><p class="sub">' + esc(I.subjudul) + '</p>' +
    '<dl class="meta"><dt>Subtema</dt><dd>' + esc(I.subtema) + '</dd><dt>Wilayah</dt><dd>' + esc(I.wilayah) + '</dd>' +
    '<dt>Tim</dt><dd>' + esc(t.nama) + '</dd><dt>Anggota</dt><dd>' + esc((t.anggota || []).join(' · ')) + '</dd>' +
    (t.instansi ? '<dt>Instansi</dt><dd>' + esc(t.instansi) + '</dd>' : '') + '</dl>' +
    '<a class="gulir" href="#b1">Mulai membaca</a></div>' +
    '<figure style="margin:0"><div class="bingkai">' + img((I.sampul || {}).gambar, 'Sampul', 'zoom', 0.78) + '</div><figcaption>' + esc((I.sampul || {}).keterangan) + '</figcaption></figure></div>';

  /* --- bagian --- */
  var B = (I.bagian || []).filter(function (b) { return !(b.jenis === 'peta-web' && !b.alamat); });
  var total = B.length;
  var html = B.map(function (b, i) {
    var no = i + 1, id = 'b' + no;
    var kep = '<div class="kepala"><div class="no">LEMBAR<b>' + pad2(no) + '</b>' + esc(b.label) + '</div><div>' +
      (b.judul ? '<h2>' + esc(b.judul) + '</h2>' : '') + (b.pengantar ? '<p class="pengantar">' + esc(b.pengantar) + '</p>' : '') + '</div></div>';
    var isi = '';
    switch (b.jenis) {
      case 'teks':
        isi = '<div class="isi-kolom">' + paragraf(b.paragraf) + '</div>' + gambarBingkai(b.gambar); break;
      case 'angka':
        isi = '<div class="angka isi-lebar">' + (b.isi || []).map(function (a) {
          return '<div><b>' + esc(a.nilai) + '<small>' + esc(a.satuan) + '</small></b><span>' + esc(a.keterangan) + '</span><span class="sumber">' + esc(a.sumber) + '</span></div>';
        }).join('') + '</div>'; break;
      case 'peta-scroll':
        isi = '<div class="scroll"><div class="tahap"><div class="bingkai"><div class="tumpuk">' +
          (b.langkah || []).map(function (l, k) { return img(l.peta, l.judul, 'zoom' + (k === 0 ? ' aktif' : ''), 0.72); }).join('') +
          '</div></div><div class="sumber" data-sumber>' + esc(((b.langkah || [])[0] || {}).sumber) + '</div></div>' +
          '<div class="langkah-daftar">' + (b.langkah || []).map(function (l, k) {
            return '<div class="langkah' + (k === 0 ? ' aktif' : '') + '" data-k="' + k + '" data-sumber="' + esc(l.sumber) + '"><div class="kode"><b>' + pad2(k + 1) + '</b> / ' + pad2((b.langkah || []).length) + '</div><h3>' + esc(l.judul) + '</h3><p>' + esc(l.teks) + '</p></div>';
          }).join('') + '</div></div>'; break;
      case 'grafik':
        isi = '<figure class="grafik isi-lebar" style="margin:0" data-grafik="' + i + '"><svg></svg><figcaption>' + esc(b.catatan ? b.catatan + ' ' : '') + esc(b.sumber) + '</figcaption></figure>'; break;
      case 'perbandingan':
        isi = '<figure class="isi-lebar" style="margin:0"><div class="bingkai banding">' + img((b.kanan || {}).gambar, (b.kanan || {}).label, '', 0.62) +
          '<div class="atas">' + img((b.kiri || {}).gambar, (b.kiri || {}).label, '', 0.62) + '</div><div class="garis-geser"></div>' +
          '<span class="lbl k">' + esc((b.kiri || {}).label) + '</span><span class="lbl n">' + esc((b.kanan || {}).label) + '</span>' +
          '<input type="range" min="0" max="100" value="50" aria-label="Geser perbandingan" id="geser' + no + '"></div><figcaption>' + esc(b.sumber) + '</figcaption></figure>'; break;
      case 'kutipan':
        isi = '<div class="kutipan"><blockquote>' + esc(b.teks) + '</blockquote><cite class="kode">' + esc(b.sumber) + '</cite></div>' +
          (b.paragraf ? '<div class="isi-kolom" style="margin-top:32px">' + paragraf(b.paragraf) + '</div>' : ''); break;
      case 'kartu':
        var W = { merah: 'var(--bahaya)', hijau: 'var(--hutan)', biru: 'var(--air)', kuning: 'var(--kuning)' };
        isi = gambarBingkai(b.gambar).replace('margin:36px 0 0 174px', 'margin:0 0 0 174px') +
          '<div class="kartu isi-lebar">' + (b.isi || []).map(function (k) {
            return '<div style="--c:' + (W[k.warna] || 'var(--tinta)') + '"><span class="kode">' + esc(k.warna || '') + '</span><h3>' + esc(k.judul) + '</h3><p>' + esc(k.teks) + '</p></div>';
          }).join('') + '</div>'; break;
      case 'galeri':
        isi = (b.paragraf ? '<div class="isi-kolom">' + paragraf(b.paragraf) + '</div>' : '') + '<div class="galeri isi-lebar">' + (b.foto || []).map(function (f) {
          return '<figure>' + img(f.file, f.keterangan, 'zoom', 0.75) + '<figcaption>' + esc(f.keterangan) + '</figcaption></figure>';
        }).join('') + '</div>'; break;
      case 'peta-web':
        isi = '<div class="isi-kolom"><p>' + esc(b.teks) + '</p></div><div class="bingkai peta-web isi-lebar" style="margin-top:28px"><iframe src="' + esc(b.alamat) + '" title="' + esc(b.judul) + '" loading="lazy"></iframe></div>'; break;
      case 'tabel':
        isi = (b.paragraf ? '<div class="isi-kolom">' + paragraf(b.paragraf) + '</div>' : '') + '<div class="tabel isi-lebar"><table><thead><tr>' +
          (b.kolom || []).map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          (b.baris || []).map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
          '</tbody></table></div>' + (b.catatanAI ? '<p class="catatan-ai isi-lebar">' + esc(b.catatanAI) + '</p>' : ''); break;
    }
    return '<section class="bagian" id="' + id + '" data-label="' + esc(b.label) + '" data-no="' + no + '"><div class="wrap">' + kep + isi + '</div></section>';
  }).join('');
  var P = I.penutup || {};
  html += '<section class="penutup" data-label="Penutup" data-no="' + total + '"><div class="wrap"><div class="kode">Penutup</div><h2 style="margin-top:14px">' + esc(P.judul) + '</h2><p>' + esc(P.teks) + '</p></div></section>';
  var main = document.getElementById('cerita'); main.innerHTML = html;

  /* --- tepi (marginalia lembar peta) --- */
  document.getElementById('tepi').innerHTML = '<div class="wrap"><div>' + (I.logo ? img(I.logo, 'Logo penyelenggara', 'logo-tepi', 1) : '') +
    '<h3>Kegiatan</h3><p>' + esc(I.kegiatan) + '<br>Subtema: ' + esc(I.subtema) + '</p></div>' +
    '<div><h3>Tim</h3><p><b>' + esc(t.nama) + '</b><br>' + esc((t.anggota || []).join(', ')) + (t.instansi ? '<br>' + esc(t.instansi) : '') + '</p></div>' +
    '<div><h3>Sumber data</h3><ul>' + (I.sumberData || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div></div>';

  pasangPenanda(document.body);

  /* --- grafik SVG --- */
  function grafik(fig, b) {
    var svg = fig.querySelector('svg'), w = Math.max(320, fig.clientWidth), h = w < 520 ? 260 : 340;
    var m = { t: 28, r: 16, b: 34, l: 56 }, d = b.data || [], n = d.length;
    var maks = Math.max.apply(null, d.map(function (x) { return +x[1]; }).concat([1]));
    var step = Math.pow(10, Math.floor(Math.log10(maks))), top = Math.ceil(maks / step) * step; if (top / step < 3) { step /= 2; top = Math.ceil(maks / step) * step; }
    var y = function (v) { return m.t + (h - m.t - m.b) * (1 - v / top); };
    var bw = (w - m.l - m.r) / n, x = function (k) { return m.l + bw * k + bw / 2; };
    var fmt = function (v) { return (+v).toLocaleString('id-ID'); };
    var s = '';
    for (var v = 0; v <= top + 1e-9; v += step) s += '<line x1="' + m.l + '" x2="' + (w - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#c8cdc6"/><text x="' + (m.l - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmt(v) + '</text>';
    var lewat = n > 12 ? Math.ceil(n / 8) : 1;
    d.forEach(function (p, k) { if (k % lewat === 0 || k === n - 1) s += '<text x="' + x(k) + '" y="' + (h - 10) + '" text-anchor="middle">' + esc(p[0]) + '</text>'; });
    var sorot = String(b.sorot || '');
    if (b.tipe === 'batang') {
      d.forEach(function (p, k) { var on = String(p[0]) === sorot; s += '<rect x="' + (x(k) - bw * .34) + '" width="' + bw * .68 + '" y="' + y(p[1]) + '" height="' + (y(0) - y(p[1])) + '" fill="' + (on ? '#b8452f' : '#1d5f8a') + '" opacity="' + (sorot && !on ? .55 : 1) + '"/>'; if (on || !sorot) s += '<text class="nilai" x="' + x(k) + '" y="' + (y(p[1]) - 7) + '" text-anchor="middle">' + fmt(p[1]) + '</text>'; });
    } else {
      var pts = d.map(function (p, k) { return x(k) + ',' + y(p[1]); }).join(' ');
      s += '<polygon points="' + x(0) + ',' + y(0) + ' ' + pts + ' ' + x(n - 1) + ',' + y(0) + '" fill="#1d5f8a" opacity=".1"/>';
      s += '<polyline points="' + pts + '" fill="none" stroke="#1d5f8a" stroke-width="2.5" stroke-linejoin="round"/>';
      d.forEach(function (p, k) { var on = String(p[0]) === sorot; s += '<circle cx="' + x(k) + '" cy="' + y(p[1]) + '" r="' + (on ? 6 : 3.5) + '" fill="' + (on ? '#b8452f' : '#1d5f8a') + '"/>'; if (on) s += '<text class="nilai" x="' + (x(k) - 10) + '" y="' + (y(p[1]) + 5) + '" text-anchor="end" style="fill:#b8452f">' + fmt(p[1]) + ' ' + esc(b.satuan) + '</text>'; });
    }
    s += '<text x="' + m.l + '" y="12">' + esc(b.satuan ? 'Satuan: ' + b.satuan : '') + '</text>';
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', b.judul || 'Grafik'); svg.innerHTML = s;
  }
  function semuaGrafik() { main.querySelectorAll('[data-grafik]').forEach(function (f) { grafik(f, B[+f.dataset.grafik]); }); }
  semuaGrafik(); var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(semuaGrafik, 150); });

  /* --- peta scroll --- */
  if ('IntersectionObserver' in window) {
    var ioL = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sc = e.target.closest('.scroll'), k = +e.target.dataset.k;
        sc.querySelectorAll('.langkah').forEach(function (l) { l.classList.toggle('aktif', l === e.target); });
        sc.querySelectorAll('.tumpuk img').forEach(function (im, j) { im.classList.toggle('aktif', j === k); });
        sc.querySelector('[data-sumber]').textContent = e.target.dataset.sumber || '';
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    main.querySelectorAll('.langkah').forEach(function (l) { ioL.observe(l); });

    /* --- nomor lembar di bar atas --- */
    var lbL = document.getElementById('lbLabel'), lbN = document.getElementById('lbNo');
    lbN.textContent = '00 / ' + pad2(total);
    var ioS = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { lbL.textContent = e.target.dataset.label; lbN.textContent = pad2(+e.target.dataset.no) + ' / ' + pad2(total); } });
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

  /* --- perbesar gambar --- */
  var lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p');
  document.addEventListener('click', function (e) {
    var el = e.target.closest('img.zoom'); if (!el || el.dataset.ganti) return;
    lbImg.src = el.src; lbCap.textContent = el.alt; lb.hidden = false;
  });
  lb.addEventListener('click', function () { lb.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.hidden = true; });
})();
