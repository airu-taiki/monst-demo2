
const startBtn = document.getElementById('startBtn');
const intro = document.getElementById('intro');
const alertVideo = document.getElementById('alertVideo');
const bgmVideo = document.getElementById('bgmVideo');
const glitchVideo = document.getElementById('glitchVideo');
const dolphinLayer = document.getElementById('dolphinLayer');
const hud = document.getElementById('hud');
const bossBlock = document.getElementById('bossBlock');
const comboLabel = document.getElementById('comboLabel');
const hitCounter = document.getElementById('hitCounter');
const strikeShot = document.getElementById('strikeShot');
const systemError = document.getElementById('systemError');
const systemFailure = document.getElementById('systemFailure');
const awareness = document.getElementById('awareness');

let running = false;
let hitValue = 1;
let dolphinTimer = null;

function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }
function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function resetLayers() {
  [alertVideo, bgmVideo, glitchVideo, hud, bossBlock, comboLabel, hitCounter, strikeShot, systemError, systemFailure, awareness]
    .forEach(hide);
  dolphinLayer.innerHTML = '';
}

function spawnDolphin(speed = 9000) {
  const img = document.createElement('img');
  img.src = 'assets/dolphin.png';
  img.className = 'dolphin';

  const fromLeft = Math.random() > 0.2;
  const y = Math.random() * (window.innerHeight * 0.72) + 80;
  const scale = 0.8 + Math.random() * 0.7;
  const rot = -18 + Math.random() * 36;
  img.style.top = `${y}px`;
  img.style.transform = `scale(${fromLeft ? scale : -scale}, ${scale}) rotate(${rot}deg)`;
  img.style.left = fromLeft ? '-22vw' : '110vw';

  dolphinLayer.appendChild(img);

  requestAnimationFrame(() => {
    img.style.transition = `transform ${speed}ms linear, left ${speed}ms linear`;
    img.style.left = fromLeft ? '120vw' : '-32vw';
  });

  setTimeout(() => img.remove(), speed + 350);
}

function startDolphins() {
  spawnDolphin(12000);
  setTimeout(() => spawnDolphin(7000), 1200);
  setTimeout(() => spawnDolphin(6000), 1800);
  setTimeout(() => {
    dolphinTimer = setInterval(() => spawnDolphin(3200 + Math.random() * 1800), 240);
  }, 2600);
}

function stopDolphins() {
  if (dolphinTimer) clearInterval(dolphinTimer);
}

async function playGlitchFullscreen(duration = 2200) {
  glitchVideo.currentTime = 0;
  show(glitchVideo);
  try { await glitchVideo.play(); } catch (e) {}
  await wait(duration);
  glitchVideo.pause();
  hide(glitchVideo);
}

function animateHits(target, stepMin, stepMax, interval) {
  return new Promise(resolve => {
    const timer = setInterval(() => {
      hitValue += Math.floor(Math.random() * (stepMax - stepMin + 1)) + stepMin;
      hitCounter.textContent = `${hitValue} Hits${hitValue > 100 ? '!!!' : ''}`;
      if (hitValue >= target) {
        clearInterval(timer);
        hitValue = target;
        hitCounter.textContent = `${hitValue} Hits${hitValue > 100 ? '!!!' : ''}`;
        resolve();
      }
    }, interval);
  });
}

async function startSequence() {
  if (running) return;
  running = true;
  resetLayers();
  hide(intro);

  show(alertVideo);
  alertVideo.currentTime = 0;
  try { await alertVideo.play(); } catch (e) {}
  await wait(2200);
  hide(alertVideo);

  show(bgmVideo);
  bgmVideo.currentTime = 0;
  try { await bgmVideo.play(); } catch (e) {}
  startDolphins();

  await wait(2200);
  show(hud);

  await wait(1300);
  show(bossBlock);

  await wait(1800);
  show(comboLabel);
  show(hitCounter);
  hitCounter.textContent = '1 Hits';
  hitValue = 1;
  await animateHits(98, 2, 7, 90);

  await wait(500);
  show(strikeShot);
  await animateHits(360, 20, 48, 95);

  await wait(900);
  hide(strikeShot);
  show(systemError);

  await wait(1200);
  hide(systemError);
  show(systemFailure);

  await wait(700);
  hide(systemFailure);

  // Fullscreen glitch before awareness.
  // object-fit: cover in CSS makes it fill the vertical frame,
  // allowing left/right cropping as requested.
  await playGlitchFullscreen(2200);

  stopDolphins();
  hide(comboLabel);
  hide(hitCounter);
  hide(hud);
  bgmVideo.pause();
  hide(bgmVideo);
  dolphinLayer.innerHTML = '';

  show(awareness);
  running = false;
}

startBtn.addEventListener('click', startSequence);
