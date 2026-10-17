/* 全ページ共通UI: 告知バナー / ヘッダー縮小 / メニューパネル / NEWリンク / スクロールスパイ / フォームのエラー表示 / 記事の目次・関連記事 */
(function(){
  var script = document.currentScript;
  var base = new URL('.', script ? script.src : location.href);
  var basePath = base.pathname;
  var isHome = location.pathname === basePath || location.pathname === basePath + 'index.html';
  var shinHref = isHome ? '#shin-reposul' : new URL('#shin-reposul', base).href;
  var header = document.querySelector('header');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, val){
    try{ if(val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); }catch(e){ return null; }
  }

  /* P1 告知バナー */
  var BANNER_KEY = 'sc-banner-shin-closed';
  if(header && store(BANNER_KEY) !== '1'){
    var banner = document.createElement('div');
    banner.className = 'sc-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'お知らせ');
    banner.innerHTML = '<a href="' + shinHref + '">開発中の「シン・レポスル」デモ公開中 →</a>' +
      '<button type="button" class="sc-banner-x" aria-label="お知らせを閉じる">×</button>';
    header.insertBefore(banner, header.firstChild);
    document.body.classList.add('sc-has-banner');
    banner.querySelector('.sc-banner-x').addEventListener('click', function(){
      banner.remove();
      document.body.classList.remove('sc-has-banner');
      store(BANNER_KEY, '1');
    });
  }

  /* P2 スクロール中はヘッダーを細くする */
  if(header){
    var ticking = false;
    var onScroll = function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        header.classList.toggle('sc-compact', window.scrollY > 80);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* P4 メニューに「シン・レポスル NEW」 */
  var navLinks = document.querySelector('.nav-links');
  if(navLinks){
    var newLink = document.createElement('a');
    newLink.className = 'sc-new-link';
    newLink.href = shinHref;
    newLink.innerHTML = 'シン・レポスル<span class="sc-new">NEW</span>';
    navLinks.insertBefore(newLink, navLinks.firstChild);
    // PCでメニューが満杯になる場合はヘッダーには出さない（メニューパネルには出す）
    var logoImg = header && header.querySelector('.nav-logo img');
    var fitNew = function(){
      newLink.classList.remove('sc-no-room');
      if(window.innerWidth <= 1024) return;
      if(navLinks.scrollWidth > navLinks.clientWidth + 1) newLink.classList.add('sc-no-room');
    };
    fitNew();
    if(logoImg && !logoImg.complete) logoImg.addEventListener('load', fitNew);
    window.addEventListener('resize', fitNew);
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(fitNew);
  }

  /* P3 メニューパネル */
  var toggle = document.querySelector('.nav-toggle');
  if(toggle && navLinks){
    var here = location.pathname.replace(/index\.html$/, '');
    var scrim = document.createElement('div');
    scrim.className = 'sc-scrim';
    scrim.hidden = true;
    var drawer = document.createElement('aside');
    drawer.className = 'sc-drawer';
    drawer.id = 'sc-drawer';
    drawer.setAttribute('aria-label', 'メニュー');
    drawer.hidden = true;
    var navHtml = '';
    Array.prototype.forEach.call(navLinks.querySelectorAll('a'), function(a){
      var u = new URL(a.getAttribute('href'), location.href);
      var path = u.pathname.replace(/index\.html$/, '');
      var current = !u.hash && (path === here || (path.slice(-1) === '/' && path !== basePath && here.indexOf(path) === 0));
      var cls = a.classList.contains('nav-login') ? ' class="sc-sub"' : '';
      var extra = a.target ? ' target="' + a.target + '" rel="noopener"' : '';
      navHtml += '<a href="' + a.getAttribute('href') + '"' + cls + extra + (current ? ' aria-current="page"' : '') + '>' + a.innerHTML + '</a>';
    });
    var cta = document.querySelector('.nav-cta .btn');
    drawer.innerHTML = '<div class="sc-drawer-head"><span>MENU</span><button type="button" class="sc-drawer-x" aria-label="メニューを閉じる">×</button></div>' +
      '<nav aria-label="サイト内メニュー">' + navHtml + '</nav>' +
      (cta ? '<div class="sc-drawer-cta"><a class="btn btn-primary" href="' + cta.getAttribute('href') + '">' + cta.textContent.trim() + '</a></div>' : '');
    document.body.appendChild(scrim);
    document.body.appendChild(drawer);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'sc-drawer');

    var open = function(){
      scrim.hidden = false; drawer.hidden = false;
      document.body.classList.add('sc-lock');
      requestAnimationFrame(function(){ scrim.classList.add('show'); drawer.classList.add('show'); });
      toggle.setAttribute('aria-expanded', 'true');
      drawer.querySelector('.sc-drawer-x').focus();
    };
    var close = function(returnFocus){
      scrim.classList.remove('show'); drawer.classList.remove('show');
      document.body.classList.remove('sc-lock');
      toggle.setAttribute('aria-expanded', 'false');
      var done = function(){ scrim.hidden = true; drawer.hidden = true; };
      if(reduceMotion) done(); else setTimeout(done, 280);
      if(returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', function(){
      navLinks.classList.remove('open');
      if(drawer.classList.contains('show')) close(true); else open();
    });
    scrim.addEventListener('click', function(){ close(true); });
    drawer.querySelector('.sc-drawer-x').addEventListener('click', function(){ close(true); });
    drawer.addEventListener('click', function(e){ if(e.target.closest('a')) close(false); });
    document.addEventListener('keydown', function(e){
      if(!drawer.classList.contains('show')) return;
      if(e.key === 'Escape'){ close(true); return; }
      if(e.key === 'Tab'){
        var f = drawer.querySelectorAll('a, button');
        var first = f[0], last = f[f.length - 1];
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function(){ if(window.innerWidth > 1024 && drawer.classList.contains('show')) close(false); });
  }

  /* P6 今読んでいるセクションをメニューに示す */
  if(navLinks){
    var spy = [];
    Array.prototype.forEach.call(navLinks.querySelectorAll('a'), function(a){
      var href = a.getAttribute('href') || '';
      if(href.charAt(0) !== '#' || href.length < 2) return;
      var target = document.getElementById(href.slice(1));
      if(target) spy.push({a:a, el:target});
    });
    if(spy.length){
      var spyTick = false;
      var updateSpy = function(){
        spyTick = false;
        var line = window.innerHeight * 0.4;
        spy.forEach(function(s){
          var r = s.el.getBoundingClientRect();
          var on = r.top <= line && r.bottom > line;
          s.a.classList.toggle('sc-active', on);
          if(on) s.a.setAttribute('aria-current', 'location'); else s.a.removeAttribute('aria-current');
        });
      };
      window.addEventListener('scroll', function(){ if(!spyTick){ spyTick = true; requestAnimationFrame(updateSpy); } }, {passive:true});
      window.addEventListener('resize', updateSpy);
      updateSpy();
    }
  }

  /* P8 お問い合わせフォームのエラー表示 */
  var form = document.getElementById('contact-form');
  if(form){
    form.setAttribute('novalidate', '');
    var fields = Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]'));
    fields.forEach(function(input, i){
      if(!input.id) input.id = 'cf-' + (input.name || i);
      var wrap = input.closest('.field');
      var label = wrap && wrap.querySelector('label');
      if(label){
        label.setAttribute('for', input.id);
        if(!label.querySelector('.sc-req')) label.insertAdjacentHTML('beforeend', '<span class="sc-req">必須</span>');
      }
      var err = document.createElement('span');
      err.className = 'sc-field-err';
      err.id = input.id + '-err';
      err.hidden = true;
      input.insertAdjacentElement('afterend', err);
      input.setAttribute('aria-describedby', err.id);
    });
    Array.prototype.forEach.call(form.querySelectorAll('.field'), function(w){
      var l = w.querySelector('label'), c = w.querySelector('input, textarea');
      if(l && c && !l.getAttribute('for')){ if(!c.id) c.id = 'cf-' + (c.name || 'f'); l.setAttribute('for', c.id); }
    });
    var check = function(input){
      var v = input.value.trim();
      var name = (input.closest('.field') && input.closest('.field').querySelector('label')) ?
        input.closest('.field').querySelector('label').childNodes[0].textContent.trim() : '';
      if(!v) return name + 'を入力してください';
      if(input.name === 'contact' || input.type === 'email' || input.type === 'tel'){
        var isMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        var digits = v.replace(/[^0-9０-９]/g, '').length;
        var isTel = /^[0-9０-９\-－ー()（）+\s]+$/.test(v) && digits >= 10 && digits <= 13;
        if(input.type === 'email' && !isMail) return 'メールアドレスの形式で入力してください（例：mail@example.com）';
        if(input.type === 'tel' && !isTel) return '電話番号を入力してください（例：03-1234-5678）';
        if(input.name === 'contact' && !isMail && !isTel) return '電話番号（例：03-1234-5678）か、メールアドレスを入力してください';
      }
      return '';
    };
    var show = function(input){
      var msg = check(input);
      var err = document.getElementById(input.id + '-err');
      if(msg){ input.setAttribute('aria-invalid', 'true'); err.textContent = msg; err.hidden = false; }
      else { input.removeAttribute('aria-invalid'); err.textContent = ''; err.hidden = true; }
      return !msg;
    };
    fields.forEach(function(input){
      input.addEventListener('blur', function(){ if(input.value.trim() || input.hasAttribute('aria-invalid')) show(input); });
      input.addEventListener('input', function(){ if(input.hasAttribute('aria-invalid')) show(input); });
    });
    document.addEventListener('submit', function(e){
      if(e.target !== form) return;
      var firstBad = null;
      fields.forEach(function(input){ if(!show(input) && !firstBad) firstBad = input; });
      if(firstBad){
        e.preventDefault();
        e.stopImmediatePropagation();
        firstBad.focus();
      }
    }, true);
  }

  /* ブログ記事ページだけの処理 */
  var article = document.querySelector('article');
  var isPost = article && article.querySelector('.post-meta') && article.querySelector('h1');
  if(!isPost) return;

  /* P11 記事の目次 */
  var heads = Array.prototype.slice.call(article.querySelectorAll(':scope > h2'));
  if(heads.length >= 3){
    var items = '';
    heads.forEach(function(h, i){
      if(!h.id) h.id = 'sec-' + (i + 1);
      items += '<li><a href="#' + h.id + '">' + h.textContent.trim() + '</a></li>';
    });
    var inline = document.createElement('details');
    inline.className = 'sc-toc-inline';
    inline.innerHTML = '<summary>この記事の目次<small>' + heads.length + '項目</small></summary><ol>' + items + '</ol>';
    article.insertBefore(inline, heads[0]);
    var side = document.createElement('nav');
    side.className = 'sc-toc-side';
    side.setAttribute('aria-label', '目次');
    side.innerHTML = '<p>CONTENTS</p><ol>' + items + '</ol>';
    document.body.appendChild(side);
    var sideLinks = side.querySelectorAll('a');
    inline.addEventListener('click', function(e){ if(e.target.closest('a')) inline.open = false; });
    var footer = document.querySelector('footer');
    var tocTick = false;
    var updateToc = function(){
      tocTick = false;
      var idx = -1;
      for(var i = 0; i < heads.length; i++){ if(heads[i].getBoundingClientRect().top < 140) idx = i; else break; }
      for(var j = 0; j < sideLinks.length; j++){
        if(j === idx) sideLinks[j].setAttribute('aria-current', 'true'); else sideLinks[j].removeAttribute('aria-current');
      }
      var hide = footer && footer.getBoundingClientRect().top < window.innerHeight - 40;
      side.classList.toggle('sc-hide', !!hide);
    };
    window.addEventListener('scroll', function(){ if(!tocTick){ tocTick = true; requestAnimationFrame(updateToc); } }, {passive:true});
    window.addEventListener('resize', updateToc);
    updateToc();
  }

  /* P12 関連記事をカードにし、5本目以降は折りたたむ */
  var related = article.querySelector('.related ul');
  if(related){
    var lis = Array.prototype.slice.call(related.querySelectorAll('li')).reverse();
    related.classList.add('sc-rel-grid');
    lis.forEach(function(li){ related.appendChild(li); });
    var SHOW = 4;
    if(lis.length > SHOW + 1){
      lis.slice(SHOW).forEach(function(li){ li.hidden = true; });
      var more = document.createElement('button');
      more.type = 'button';
      more.className = 'sc-rel-more';
      more.textContent = 'ほか' + (lis.length - SHOW) + '本を見る';
      related.insertAdjacentElement('afterend', more);
      more.addEventListener('click', function(){
        lis.slice(SHOW).forEach(function(li){ li.hidden = false; });
        more.remove();
        var next = lis[SHOW] && lis[SHOW].querySelector('a');
        if(next) next.focus();
      });
    }
  }
})();
