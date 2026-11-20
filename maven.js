// Click-to-load YouTube players and an Arabic/English switch.
(() => {
  document.querySelectorAll('.video[data-yt]').forEach((box) => {
    box.querySelector('.video-play').addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0`;
      frame.title = box.closest('.skill').querySelector('h3').textContent;
      frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      box.replaceChildren(frame);
    });
  });

  // Demo reels play muted on loop; the button turns the sound on and off.
  document.querySelectorAll('.reel-frame').forEach((frame) => {
    const video = frame.querySelector('video');
    const button = frame.querySelector('.sound-toggle');
    if (!video || !button) return;  // a still frame, nothing to play
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { video.removeAttribute('autoplay'); video.pause(); }
    button.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.muted) { video.currentTime = 0; video.play().catch(() => {}); }
      button.setAttribute('aria-pressed', String(!video.muted));
      button.firstElementChild.textContent = video.muted ? '🔇' : '🔊';
      const en = document.documentElement.lang === 'en';
      button.setAttribute('aria-label', video.muted ? (en ? 'Turn sound on' : 'شغّل الصوت') : (en ? 'Turn sound off' : 'اطفي الصوت'));
    });
    // Only play while on screen.
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.25 }).observe(video);
  });

  const html = document.documentElement;
  const textNodes = [...document.querySelectorAll('[data-en]')];
  const labelNodes = [...document.querySelectorAll('[data-en-label]')];
  const altNodes = [...document.querySelectorAll('[data-en-alt]')];
  altNodes.forEach((el) => { el.dataset.arAlt = el.alt; });
  textNodes.forEach((el) => { el.dataset.ar = el.innerHTML; });
  labelNodes.forEach((el) => { el.dataset.arLabel = el.getAttribute('aria-label'); });
  const titles = { ar: document.title, en: 'Maven | Free Claude skills' };

  const apply = (lang) => {
    const en = lang === 'en';
    html.lang = lang;
    html.dir = en ? 'ltr' : 'rtl';
    textNodes.forEach((el) => { el.innerHTML = en ? el.dataset.en : el.dataset.ar; });
    labelNodes.forEach((el) => el.setAttribute('aria-label', en ? el.dataset.enLabel : el.dataset.arLabel));
    altNodes.forEach((el) => { el.alt = en ? el.dataset.enAlt : el.dataset.arAlt; });
    const sw = document.querySelector('.language-switch');
    sw.lang = en ? 'ar' : 'en';
    document.title = titles[lang];
    try { localStorage.setItem('maven-lang', lang); } catch {}
  };

  document.querySelector('.language-switch').addEventListener('click', () => apply(html.lang === 'en' ? 'ar' : 'en'));
  let saved = null;
  try { saved = localStorage.getItem('maven-lang'); } catch {}
  if (saved === 'en') apply('en');
})();
