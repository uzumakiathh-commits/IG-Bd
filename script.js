'use strict';

/* ==========================================================================
   Configuration
   ========================================================================== */

// Messages are delivered by FormSubmit (https://formsubmit.co).
// The first message triggers an activation email: click the link in it once.
// Tip: after activating, replace the address below with the random ID that
// FormSubmit emails you, so your address isn't visible in the page source.
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/uzumakiathh@gmail.com';

const LEAF_SYMBOLS = ['🍂', '🍁', '✦'];
const SPARKLE_SYMBOLS = ['✨', '🍂', '🤍', '💗'];
const MAX_LEAVES = 22;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   Elements
   ========================================================================== */

const $ = (id) => document.getElementById(id);

const music = $('bgMusic');
const opening = $('opening');
const enterBtn = $('enterBtn');
const birthday = $('birthday');
const musicBtn = $('musicBtn');
const leavesLayer = $('leaves');
const giftBtn = $('giftBtn');
const surprise = $('surpriseMessage');
const form = $('messageForm');
const textarea = $('visitorMessage');
const sendBtn = $('sendBtn');
const sendAnimation = $('sendAnimation');
const sendStatus = $('sendStatus');

/* ==========================================================================
   Helpers
   ========================================================================== */

const random = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

/* ==========================================================================
   Music
   ========================================================================== */

function setMusicButton(isPlaying) {
  musicBtn.textContent = isPlaying ? '♫' : '♪';
  musicBtn.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
}

async function playMusic() {
  try {
    await music.play();
    setMusicButton(true);
  } catch {
    setMusicButton(false); // Autoplay blocked or file missing
  }
}

musicBtn.addEventListener('click', () => {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
    setMusicButton(false);
  }
});

/* ==========================================================================
   Opening screen
   ========================================================================== */

enterBtn.addEventListener('click', () => {
  enterBtn.disabled = true;
  playMusic(); // Started inside the click so mobile browsers allow it

  opening.classList.add('is-leaving');
  birthday.hidden = false;
  musicBtn.hidden = false;
  window.scrollTo(0, 0);

  setTimeout(() => {
    opening.hidden = true;
    document.body.classList.remove('is-locked');
    initReveal();
  }, 900);
});

/* ==========================================================================
   Falling leaves (run on both the opening screen and the main page)
   ========================================================================== */

function spawnLeaf() {
  if (document.hidden || leavesLayer.childElementCount >= MAX_LEAVES) return;

  const leaf = document.createElement('span');
  const duration = random(8, 15);

  leaf.className = 'leaf';
  leaf.textContent = pick(LEAF_SYMBOLS);
  leaf.style.left = `${random(0, 100)}%`;
  leaf.style.fontSize = `${random(14, 28)}px`;
  leaf.style.animationDuration = `${duration}s`;

  leaf.addEventListener('animationend', () => leaf.remove());
  leavesLayer.appendChild(leaf);
}

if (!prefersReducedMotion) {
  for (let i = 0; i < 8; i++) setTimeout(spawnLeaf, i * 350);
  setInterval(spawnLeaf, 900);
}

/* ==========================================================================
   Sparkles
   ========================================================================== */

function createSparkles(count) {
  if (prefersReducedMotion) return;

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.textContent = pick(SPARKLE_SYMBOLS);
    sparkle.style.left = `${random(0, 100)}vw`;
    sparkle.style.top = `${random(-100, -20)}px`;
    sparkle.style.fontSize = `${random(14, 32)}px`;
    sparkle.style.animationDuration = `${random(2, 4)}s`;

    sparkle.addEventListener('animationend', () => sparkle.remove());
    document.body.appendChild(sparkle);
  }
}

/* ==========================================================================
   Scroll reveal
   ========================================================================== */

function initReveal() {
  const targets = document.querySelectorAll('.memories > *, .wish-card, .final-surprise > :not(.surprise-message)');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ==========================================================================
   Gift & message form
   ========================================================================== */

giftBtn.addEventListener('click', () => {
  surprise.hidden = false;
  giftBtn.textContent = '🎀';
  giftBtn.disabled = true;
  giftBtn.setAttribute('aria-expanded', 'true');

  surprise.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
  createSparkles(18);
  setTimeout(() => textarea.focus({ preventScroll: true }), 600);
});

function setSendState(state, text) {
  sendAnimation.hidden = false;
  sendAnimation.classList.remove('is-sending', 'is-sent', 'is-error');
  void sendAnimation.offsetWidth; // Restart the envelope animation
  sendAnimation.classList.add(`is-${state}`);
  sendStatus.textContent = text;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = textarea.value.trim();
  if (!message) {
    textarea.focus();
    return;
  }

  sendBtn.disabled = true;
  textarea.disabled = true;
  setSendState('sending', 'Sending your little message...');
  createSparkles(24);

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        message,
        _honey: form.elements._honey.value,
        _captcha: 'false',
        _subject: 'A little message from your birthday website',
        _template: 'table'
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || String(result.success) === 'false') {
      throw new Error(result.message || 'Request failed');
    }

    surprise.classList.add('is-sent');
    setTimeout(() => {
      form.hidden = true;
      setSendState('sent', 'A little wish, just for you ♡');
      setTimeout(() => createSparkles(30), 3400); // as the envelope lands in the postbox
    }, 500);
  } catch (error) {
    console.error('Message could not be sent:', error);
    setSendState('error', "The message couldn't be sent. Check your connection and try again.");
    sendBtn.disabled = false;
    textarea.disabled = false;
  }
});

/* ==========================================================================
   Broken photo fallback: keep the polaroid frame tidy if an image is missing
   ========================================================================== */

document.querySelectorAll('.polaroid img').forEach((img) => {
  img.addEventListener('error', () => {
    img.alt = '';
    img.style.visibility = 'hidden';
  });
});
