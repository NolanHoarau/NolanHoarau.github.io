document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar ul');
    const dot = navbar.querySelector('.dot');
    const links = navbar.querySelectorAll('li a');

    links.forEach(link => {
        link.addEventListener('mouseenter', function () {
            const rect = link.getBoundingClientRect();
            const navbarRect = navbar.getBoundingClientRect();
            dot.style.left = (rect.left - navbarRect.left + rect.width / 2 - dot.offsetWidth / 2) + 'px';
            dot.style.opacity = 1;
        });
        link.addEventListener('mouseleave', function () {
            dot.style.opacity = 0;
        });
    });

    // CV dropdown toggle
    const cvToggle = document.getElementById('cv-toggle');
    const cvDropdown = document.getElementById('cv-dropdown');
    if (cvToggle && cvDropdown) {
        cvToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = cvDropdown.classList.toggle('open');
            cvToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        document.addEventListener('click', function() {
            cvDropdown.classList.remove('open');
            cvToggle.setAttribute('aria-expanded', 'false');
        });
        cvDropdown.addEventListener('click', function(e) { e.stopPropagation(); });
    }
});

// APROPOS tabs and content
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.apropos-nav li');
    const links = document.querySelectorAll('.js_affiche');
    const contents = document.querySelectorAll('.apropos_content');

    function hideAllContents() {
        contents.forEach(content => {
            content.style.display = 'none';
        });
    }

    function showContent(targetId) {
        hideAllContents();
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.style.display = 'block';
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const link = this.querySelector('.js_affiche');
            if (!link) return;
            if (e.target === link) e.preventDefault();
            const targetId = link.getAttribute('data-nw-id-target');
            showContent(targetId);
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    if (contents.length > 0) {
        showContent('apropos_presentation');
        if (links.length > 0) links[0].classList.add('active');
    }
});

// Modal behaviour (with open animation)
document.querySelectorAll('.projet_card').forEach(card => {
  card.addEventListener('click', function() {
    const modalId = card.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      // allow CSS transition
      requestAnimationFrame(()=> modal.classList.add('is-open'));
    }
  });
});

document.querySelectorAll('.modal .close').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const modal = btn.closest('.modal');
    modal.classList.remove('is-open');
    setTimeout(()=> modal.style.display = 'none', 300);
    e.stopPropagation();
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('is-open');
      setTimeout(()=> modal.style.display = 'none', 300);
    }
  });
});

document.querySelectorAll('.content_parcours').forEach(block => {
  const toggleExpanded = () => {
    const expanded = block.classList.toggle('expanded');
    block.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  };

  block.addEventListener('click', toggleExpanded);
  block.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpanded();
    }
  });
});

/* ====== New: reveal on scroll, stagger, parallax, progress, typing, tilt ====== */
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // respect user

  // Scroll progress
  const progress = document.getElementById('scroll-progress');
  function updateProgress(){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', ()=> requestAnimationFrame(updateProgress));
  updateProgress();

  // Reveal on scroll with small stagger
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el,i)=>{
    el.style.setProperty('--delay', i*90 + 'ms');
    el.setAttribute('data-delay', i*90);
    observer.observe(el);
  });

  // Parallax for profile picture
  const pdp = document.querySelector('.pdp[data-parallax]');
  if (pdp) {
    const img = pdp.querySelector('img');
    let bound = pdp.getBoundingClientRect();
    window.addEventListener('resize', ()=> bound = pdp.getBoundingClientRect());
    pdp.addEventListener('mousemove', (e)=>{
      const x = (e.clientX - (bound.left + bound.width/2)) / (bound.width/2);
      const y = (e.clientY - (bound.top + bound.height/2)) / (bound.height/2);
      img.style.transform = `translate(${x*8}px, ${y*6}px) scale(1.035)`;
    });
    pdp.addEventListener('mouseleave', ()=> img.style.transform = 'translate(0,0) scale(1)');
  }

  // Typing effect for subtitle
  const typedEl = document.querySelector('.typed');
  if (typedEl){
    const words = (typedEl.getAttribute('data-words')||'').split(';').map(s=>s.trim()).filter(Boolean);
    let wi = 0, ci = 0, deleting = false;
    function tick(){
      const word = words[wi] || '';
      if (!deleting){
        ci++;
        typedEl.textContent = word.slice(0,ci);
        if (ci === word.length){ deleting = true; setTimeout(tick, 1000); return; }
      } else {
        ci--;
        typedEl.textContent = word.slice(0,ci);
        if (ci === 0){ deleting = false; wi = (wi+1)%words.length; }
      }
      setTimeout(tick, deleting?40:80);
    }
    if (words.length) tick();
  }

  // Tilt effect for project cards
  document.querySelectorAll('.projet_card').forEach(card=>{
    card.dataset.tilt = 'true';
    card.addEventListener('mousemove', e=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * 8; // rotateX
      const ry = (x - 0.5) * -14; // rotateY
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', ()=> card.style.transform = '');
  });

  // Theme toggle from before: ensure it still applies
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', ()=>{
      document.documentElement.classList.toggle('light-mode');
      const isLight = document.documentElement.classList.contains('light-mode');
      try { localStorage.setItem('light-mode', isLight ? '1' : '0'); } catch(e){}
    });
  }
})();

