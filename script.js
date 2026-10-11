const music = document.getElementById('bgMusic');
const opening = document.getElementById('opening');
const enterBtn = document.getElementById('enterBtn');
const birthday = document.getElementById('birthday');
const musicBtn = document.getElementById('musicBtn');
const giftBtn = document.getElementById('giftBtn');
const surpriseMessage = document.getElementById('surpriseMessage');

async function tryPlayMusic() {
  if (!music) {
    return false;
  }

  try {
    await music.play();
    musicBtn.textContent = '♫';
    musicBtn.setAttribute('aria-label', 'Pause music');
    return true;
  } catch (error) {
    musicBtn.textContent = '♪';
    musicBtn.setAttribute('aria-label', 'Play music');
    return false;
  }
}

function openBirthdayPage() {
  opening.style.opacity = '0';
  setTimeout(() => {
    opening.style.visibility = 'hidden';
    opening.style.pointerEvents = 'none';
    birthday.classList.remove('hidden');
    createLeaves();
  }, 850);
}

enterBtn.addEventListener('click', async () => {
  await tryPlayMusic();
  openBirthdayPage();
});

musicBtn.addEventListener('click', async () => {
  if (music.paused) {
    await tryPlayMusic();
  } else {
    music.pause();
    musicBtn.textContent = '♪';
    musicBtn.setAttribute('aria-label', 'Play music');
  }
});

giftBtn.addEventListener('click', () => {
  surpriseMessage.classList.remove('hidden');
  giftBtn.textContent = '🎉';
  createSparkles(32);
});

function createLeaves() {
  const holder = document.querySelector('.falling-leaves');
  const symbols = ['🍂', '🍁', '✦'];
  for (let i = 0; i < 20; i++) {
    const leaf = document.createElement('span');
    leaf.className = 'leaf';
    leaf.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.animationDuration = `${7 + Math.random() * 8}s`;
    leaf.style.animationDelay = `${Math.random() * 5}s`;
    leaf.style.fontSize = `${14 + Math.random() * 15}px`;
    holder.appendChild(leaf);
    setTimeout(() => leaf.remove(), 17000);
  }
}

function createSparkles(count) {
  for (let i = 0; i < count; i++) {
    const item = document.createElement('span');
    item.className = 'sparkle';
    item.textContent = ['✨', '🍂', '🤍', '🎉'][Math.floor(Math.random() * 4)];
    item.style.left = `${Math.random() * 100}vw`;
    item.style.top = `${-20 - Math.random() * 80}px`;
    item.style.fontSize = `${14 + Math.random() * 18}px`;
    item.style.animationDuration = `${2 + Math.random() * 2}s`;
    document.body.appendChild(item);
    setTimeout(() => item.remove(), 4500);
  }
}
