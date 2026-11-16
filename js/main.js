// =========================================================
// Марина Вильданова — скрипты сайта
// Меню на мобильных, подсветка раздела в меню, плавное появление блоков
// =========================================================

(function () {
  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');

  // --- Мобильное меню ---
  function closeMenu() {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    nav.classList.remove('is-open');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
      nav.classList.toggle('is-open', !open);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // --- Тень у шапки при прокрутке ---
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Год в подвале ---
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // --- Окна «Подробнее» в форматах ---
  // Кнопка с data-open="id" открывает <dialog id="id">.
  // Закрывается крестиком, клавишей Esc, кликом по затемнению или по ссылке внутри.
  document.querySelectorAll('[data-open]').forEach(function (btn) {
    var dlg = document.getElementById(btn.getAttribute('data-open'));
    if (!dlg || typeof dlg.showModal !== 'function') return;

    btn.addEventListener('click', function () {
      dlg.showModal();
      document.documentElement.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('dialog.dlg').forEach(function (dlg) {
    dlg.addEventListener('close', function () {
      document.documentElement.style.overflow = '';
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) dlg.close(); // клик по затемнению вокруг окна
    });
    dlg.querySelectorAll('.dlg__close, a[href^="#"]').forEach(function (el) {
      el.addEventListener('click', function () { dlg.close(); });
    });
  });

  // Без IntersectionObserver просто показываем всё
  if (!('IntersectionObserver' in window)) {
    document.documentElement.classList.add('no-js');
    return;
  }

  // --- Плавное появление блоков ---
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Подсветка текущего раздела в меню ---
  var navLinks = nav ? nav.querySelectorAll('a[href^="#"]:not(.nav__cta)') : [];
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  navLinks.forEach(function (link) {
    var section = document.querySelector(link.getAttribute('href'));
    if (section) sectionObserver.observe(section);
  });
})();
