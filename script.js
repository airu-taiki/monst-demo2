const startBtn = document.getElementById('startBtn');
const fakeLink = document.getElementById('fakeLink');
const feed = document.getElementById('feed');
const sequence = document.getElementById('sequence');
const alertVideo = document.getElementById('alertVideo');
const bgmVideo = document.getElementById('bgmVideo');
const glitchVideo = document.getElementById('glitchVideo');
const redFlash = document.getElementById('redFlash');
const warningText = document.getElementById('warningText');
const stageText = document.getElementById('stageText');
const bossUI = document.getElementById('bossUI');
const comboText = document.getElementById('comboText');
const hitsText = document.getElementById('hitsText');
const strikeText = document.getElementById('strikeText');
const ssText = document.getElementById('ssText');
const systemText = document.getElementById('systemText');
const failureText = document.getElementById('failureText');
const awareness = document.getElementById('awareness');
const dolphinField = document.getElementById('dolphinField');

let started = false;
let hitCount = 1;
let timers = [];

function show(el) {
  if (el) el.classList.remove('hidden');
}

function hide(el) {
  if (el) el.classList.add('hidden');
}

function later(ms, fn) {
  const t = setTimeout(fn, ms);
  timers.push(t);
}

function flashRed() {
  redFlash.classList.remove('flash-anim');
  void redFlash.offsetWidth;
  redFlash.classList.add('flash-anim');
}

function shake() {
  const app = document.getElementById('app');
  app.classList.remove('shake');
  void app.offsetWidth;
  app.classList.add('shake');
}

function resetDolphins() {
  dolphinField.innerHTML = '';
}

function resetMedia(video, volume = 1) {
  if (!video) return;
  try {
    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.volume = volume;
  } catch (e) {
    console.warn('reset media failed', e);
  }
}

async function safePlay(video, volume = 1) {
  if (!video) return;
  try {
    video.muted = false;
    video.volume = volume;
    video.currentTime = 0;
    await video.play();
  } catch (e) {
    console.warn('play blocked', e);
  }
}

function stopVideo(video) {
  if (!video) return;
  try {
    video.pause();
    video.currentTime = 0;
  } catch (e) {
    console.warn('stop video failed', e);
  }
}

function spawnDolphin(count = 1, fast = false) {
  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    img.src = 'assets/dolphin.png';
    img.className = 'dolphin';

    const scale = 0.7 + Math.random() * 0.7;
    const fromLeft = Math.random() > 0.2;
    const top = 120 + Math.random() * (window.innerHeight * 0.65);

    img.style.top = `${top}px`;
    img.style.width = `${84 * scale}px`;
    img.style.transform = `${fromLeft ? '' : 'scaleX(-1) '}rotate(${(-15 + Math.random() * 30).toFixed(1)}deg)`;
    img.style.left = fromLeft ? '-140px' : '110%';
    dolphinField.appendChild(img);

    const duration = fast ? 1000 + Math.random() * 1200 : 2600 + Math.random() * 1800;

    requestAnimationFrame(() => {
      img.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
      img.style.left = fromLeft ? '110%' : '-180px';
      img.style.top = `${top + (-60 + Math.random() * 120)}px`;
    });

    setTimeout(() => img.remove(), duration + 150);
  }
}

function comboBurst() {
  hitCount += Math.floor(2 + Math.random() * 8);
  hitsText.textContent = `${hitCount} Hits`;
  spawnDolphin(2, true);
}

async function playGlitchWithAudio() {
  show(glitchVideo);
  glitchVideo.classList.add('glitch-on');
  await safePlay(glitchVideo, 0.85);
}

function stopGlitch() {
  glitchVideo.classList.remove('glitch-on');
  hide(glitchVideo);
  stopVideo(glitchVideo);
}

async function startSequence() {
  if (started) return;
  started = true;

  timers.forEach(clearTimeout);
  timers = [];
  resetDolphins();
  resetMedia(alertVideo, 1);
  resetMedia(bgmVideo, 0.72);
  resetMedia(glitchVideo, 0.85);

  feed.classList.remove('active');
  sequence.classList.add('active');

  show(alertVideo);
  await safePlay(alertVideo, 1);
  flashRed();

  later(500, () => {
    show(warningText);
    shake();
  });

  later(2100, () => {
    hide(warningText);
    hide(alertVideo);
    stopVideo(alertVideo);
  });

  later(3000, async () => {
    show(bgmVideo);
    await safePlay(bgmVideo, 0.72);
    spawnDolphin(1, false);
  });

  later(4200, () => spawnDolphin(2, false));

  later(5200, () => {
    for (let i = 0; i < 10; i++) {
      later(i * 140, () => spawnDolphin(1, true));
    }
  });

  later(6800, async () => {
    await playGlitchWithAudio();
  });

  later(7600, () => show(stageText));
  later(9300, () => hide(stageText));

  later(9800, () => {
    show(bossUI);
    flashRed();
    shake();
  });

  later(12000, () => {
    show(comboText);
    show(hitsText);
    hitCount = 1;
    hitsText.textContent = '1 Hits';
    for (let i = 0; i < 18; i++) {
      later(i * 120, comboBurst);
    }
  });

  later(14600, () => {
    show(strikeText);
    shake();
  });

  later(15400, () => {
    show(ssText);
    for (let i = 0; i < 10; i++) {
      later(i * 100, () => {
        hitCount += Math.floor(18 + Math.random() * 28);
        hitsText.textContent = `${hitCount} Hits!!!`;
        spawnDolphin(3, true);
        flashRed();
      });
    }
  });

  later(17600, () => {
    hide(comboText);
    hide(strikeText);
    hide(ssText);
    show(systemText);
    shake();
  });

  later(19300, () => {
    hide(systemText);
    hide(bossUI);
    stopGlitch();
    resetDolphins();
    show(failureText);
  });

  later(21300, async () => {
    hide(failureText);
    await playGlitchWithAudio();
  });

  later(23500, () => {
    stopGlitch();
    try {
      bgmVideo.pause();
    } catch (e) {}
    hide(bgmVideo);
    show(awareness);
  });
}

startBtn.addEventListener('click', startSequence);
fakeLink.addEventListener('click', startSequence);