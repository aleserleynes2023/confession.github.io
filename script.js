window.onload = function () {
  setTimeout(() => {
    document.getElementById('fadeBg').style.opacity = 1;
  }, 200);
  setTimeout(() => {
    document.getElementById('envelopeContainer').style.opacity = 1;
  }, 1350);

  // Floating heart background effect
  setInterval(() => {
    if (Math.random() > 0.7) createFloatingHeart();
  }, 1200);

  // Background music: try to play on user gesture if blocked by browser
  const bgMusic = document.getElementById('bgMusic');
  function isMobile() {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent);
  }
  if (bgMusic) {
    // Handle browser autoplay restrictions
    const startMusic = () => {
      bgMusic.volume = isMobile() ? 0.03 : 0.04; // In between 0.01 and 0.05
      bgMusic.play().catch(() => {});
      document.removeEventListener('click', startMusic);
      document.removeEventListener('touchstart', startMusic);
    };
    bgMusic.volume = isMobile() ? 0.03 : 0.04;
    bgMusic.play().catch(() => {});
    document.addEventListener('click', startMusic);
    document.addEventListener('touchstart', startMusic);
  }
};

function createFloatingHeart() {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.style.left = (30 + Math.random() * 40) + 'vw';
  heart.style.fontSize = (1.5 + Math.random() * 1.5) + 'em';
  heart.style.animationDuration = (3 + Math.random() * 2) + 's';
  heart.innerHTML = ['💗','💖','💞','💕'][Math.floor(Math.random()*4)];
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 4800);
}

function fadeIn(el, duration = 600) {
  el.style.opacity = 0;
  el.style.display = el.dataset.display || 'block';
  setTimeout(() => {
    el.style.transition = `opacity ${duration}ms`;
    el.style.opacity = 1;
  }, 10);
}
function fadeOut(el, duration = 600, cb) {
  el.style.transition = `opacity ${duration}ms`;
  el.style.opacity = 0;
  setTimeout(() => {
    el.style.display = 'none';
    if (cb) cb();
  }, duration);
}

function updateConfessionMessage(html, cb) {
  confessionMessage.style.transition = 'opacity 400ms';
  confessionMessage.style.opacity = 0;
  setTimeout(() => {
    confessionMessage.innerHTML = html;
    confessionMessage.style.opacity = 0;
    if (cb) cb();
    setTimeout(() => {
      confessionMessage.style.transition = 'opacity 500ms';
      confessionMessage.style.opacity = 1;
    }, 50);
  }, 400);
}

const ribbonBtn = document.getElementById('ribbonBtn');
const envelope = document.getElementById('envelope');
const envelopeContainer = document.getElementById('envelopeContainer');
const letterPaper = document.getElementById('letterPaper');
const heartBtn = document.getElementById('heartBtn');
const confessionSection = document.getElementById('confessionSection');
const confessionMessage = document.getElementById('confessionMessage');
const audioSection = document.getElementById('audioSection');
const closeLetterBtn = document.getElementById('closeLetterBtn');
const closeConfessionBtn = document.getElementById('closeConfessionBtn');
const imgBg = document.getElementById('imgBg');

const IMAGE_URL = 'Couple.jpeg';

// --- ENVELOPE POSITION HELPERS ---
function setEnvelopeToCenter() {
  envelopeContainer.style.left = "50%";
  envelopeContainer.style.top = "50%";
  envelopeContainer.style.transform = "translate(-50%, -50%)";
}

function setEnvelopeToRandomCorner() {
  const corners = [
    [5, 5], [95, 5], [5, 85], [95, 85],
  ];
  const [x, y] = corners[Math.floor(Math.random() * corners.length)];
  envelopeContainer.style.left = x + "%";
  envelopeContainer.style.top = y + "%";
  envelopeContainer.style.transform = "translate(-50%, -50%)";
}

function setActiveCloseBtn(btn) {
  if (closeLetterBtn) closeLetterBtn.classList.remove('active');
  if (closeConfessionBtn) closeConfessionBtn.classList.remove('active');
  if (btn) btn.classList.add('active');
}

let isRibbonUntied = false;

// Untie the ribbon to open the envelope and show the letter
ribbonBtn.onclick = function () {
  if (!isRibbonUntied) {
    setEnvelopeToCenter();
    ribbonBtn.classList.add('untied');
    envelope.classList.add('open');
    showHeartsPop();

    setTimeout(() => {
      imgBg.style.backgroundImage = `url('${IMAGE_URL}')`;
      imgBg.classList.add('visible');
    }, 450);

    setTimeout(() => {
      fadeOut(envelopeContainer, 650, () => {
        fadeIn(letterPaper, 650);
        setActiveCloseBtn(closeLetterBtn);
      });
      ribbonBtn.style.display = 'none';
    }, 900);

    isRibbonUntied = true;
  }
};

function showHeartsPop() {
  for (let i = 0; i < 7; ++i) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = (110 + Math.random() * 40) + 'px';
      sparkle.style.top = (70 + Math.random() * 20) + 'px';
      sparkle.innerHTML = ['💖','✨','💗','💞'][Math.floor(Math.random()*4)];
      envelope.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 850);
    }, 120 * i);
  }
}

closeLetterBtn.onclick = function () {
  fadeOut(letterPaper, 650, () => {
    setEnvelopeToCenter(); // Always center when showing envelope again!
    envelopeContainer.style.display = 'block';
    fadeIn(envelopeContainer, 650);
    envelope.classList.remove('open');
    ribbonBtn.classList.remove('untied');
    ribbonBtn.style.display = '';
    isRibbonUntied = false;
    setActiveCloseBtn(null);
    imgBg.classList.remove('visible');
  });
};

heartBtn.onclick = function () {
  fadeOut(letterPaper, 650, () => {
    confessionSection.style.display = 'flex';
    fadeIn(confessionSection, 650);
    setTimeout(() => setActiveCloseBtn(closeConfessionBtn), 20);
    naurPressCount = 0;
    yesPressed = false;
    showConfessionChoices();
  });
};

closeConfessionBtn.onclick = function () {
  fadeOut(confessionSection, 650, () => {
    confessionMessage.innerHTML = '';
    confessionMessage.style.opacity = 0;
    audioSection.style.display = 'none';
    fadeIn(letterPaper, 650);
    setActiveCloseBtn(closeLetterBtn);
  });
};

// --- Main Confession Logic ---

let naurPressCount = 0;
let yesPressed = false;

function showConfessionChoices() {
  updateConfessionMessage(`
    <div class="confession-note">
      <span style="font-family:'Dancing Script',cursive;font-size:1.5em;color:#cf5f99;">Alesia...</span>
      <br>
      <span style="display:inline-block;margin-top:0.8em;">
        Matagal na kitang pinagmamasdan sa tahimik. <b style="background: #ffe3f0; border-radius: 6px; padding: 0 5px;">Alam ko na hindi tayo laging magkasama</b>, at malayo tayo sa isa’t isa, pero hindi ‘yon naging hadlang para makita ko kung gaano ka kahalaga sa akin.<br><br>
        Sa bawat kwento mo, sa bawat ngiti mo, mas lalo kong gustong mapalapit sa’yo <span style="color:#ae318c;font-weight:700;"> kahit pa mahirap dahil sa distansya</span>. Pero gusto ko sanang simulan nang tama...<br><br>
        <span style="background: #ffe082; border-radius: 6px; padding: 0 6px;">Alesia, pwede ba akong manligaw?</span>
      </span>
    </div>
    <button id="listenConfessionBtn" class="box-btn fancy-btn" style="margin-bottom:16px;">
      <span class="btn-heart">🎧</span> Listen to my voice
    </button>
    <div id="confessionAudioPlayer" style="display:none; margin-bottom:12px;">
      <audio id="confessionVoiceAudio" style="width:100%;">
        <source src="confession-voice.mp3" type="audio/mp3">
        Your browser does not support the audio element.
      </audio>
    </div>
    <div id="confessionButtons" style="display:flex;justify-content:center;gap:18px;margin-top:18px;flex-wrap:wrap;">
      <button id="yesBtn" class="box-btn fancy-btn">
        <span class="btn-heart">💗</span> Yes yes yes
      </button>
      <button id="naurBtn" class="box-btn fancy-btn">
        <span class="btn-heart">💔</span> Naur naur naur
      </button>
    </div>
  `, () => {
    audioSection.style.display = 'none';
    attachConfessionButtonListeners();
    attachListenConfessionBtn();
  });
}

// Naur sequence with listen button and voice for every naur (no "No 1, 2, 3, 4" text)
function showNaurSequence() {
  let messageHtml = '';
  let showNaurBtn = true;
  let audioFile = '';
  let messageText = '';

  if (naurPressCount === 1) {
    messageText = `
      <span style="font-size:2em; display:block;">😂</span>
      rororororor say yes yes yes!
    `;
    audioFile = 'naur-1.mp3';
  } else if (naurPressCount === 2) {
    messageText = `
      <span style="font-size:2em; display:block;">😝</span>
      You sure you want to press "naur"?<br>
      Here's a joke: Why did I turn sad?<br>
      Because you said naur naur naur. 😢<br>
      Okay, okay... but will you say yes? 🥺
    `;
    audioFile = 'naur-2.mp3';
  } else if (naurPressCount === 3) {
    messageText = `
      <span style="font-size:2em; display:block;">🥹💌</span>
      Last chance...<br>
      My heart can't handle another "naur"!<br>
      But if you must, click again... or finally say YES? 😳
    `;
    audioFile = 'naur-3.mp3';
  } else {
    messageText = `
      <span style="font-size:2.2em; display:block;">🤖</span>
      You have discovered the secret "naur" ending!<br>
      But even robots ship Alesia and Aleser.<br>
      Press YES na please? 😩 I'll libre you those pancit canton you always crave for! 🍜
    `;
    audioFile = 'naur-4.mp3';
    showNaurBtn = false;
  }

  messageHtml = `
    <div class="confession-note" style="text-align:center;">
      ${messageText}
    </div>
    <button id="listenNaurBtn" class="box-btn fancy-btn" style="margin-bottom:16px;">
      <span class="btn-heart">🎧</span> Listen to my voice
    </button>
    <div id="naurAudioPlayer" style="display:none; margin-bottom:12px;">
      <audio id="naurVoiceAudio" style="width:100%;">
        <source src="${audioFile}" type="audio/mp3">
        Your browser does not support the audio element.
      </audio>
    </div>
    <div id="confessionButtons" style="display:flex;justify-content:center;gap:18px;margin-top:18px;flex-wrap:wrap;">
      <button id="yesBtn" class="box-btn fancy-btn"><span class="btn-heart">💗</span> Yes yes yes</button>
      ${showNaurBtn ? `<button id="naurBtn" class="box-btn fancy-btn"><span class="btn-heart">💔</span> Naur naur naur</button>` : ''}
    </div>
  `;

  updateConfessionMessage(messageHtml, () => {
    attachConfessionButtonListeners();
    attachNaurListenBtn();
  });
}

function attachNaurListenBtn() {
  const listenBtn = document.getElementById('listenNaurBtn');
  const naurAudioDiv = document.getElementById('naurAudioPlayer');
  const naurVoiceAudio = document.getElementById('naurVoiceAudio');
  if (listenBtn && naurAudioDiv && naurVoiceAudio) {
    naurVoiceAudio.controls = false;
    listenBtn.onclick = function () {
      if (window.lastAudio && window.lastAudio !== naurVoiceAudio) {
        window.lastAudio.pause();
        window.lastAudio.currentTime = 0;
        if (window.lastAudioDiv) window.lastAudioDiv.style.display = 'none';
      }
      naurAudioDiv.style.display = naurAudioDiv.style.display === 'none' ? 'block' : 'none';
      if (naurAudioDiv.style.display === 'block') {
        naurVoiceAudio.currentTime = 0;
        naurVoiceAudio.play();
        window.lastAudio = naurVoiceAudio;
        window.lastAudioDiv = naurAudioDiv;
      } else {
        naurVoiceAudio.pause();
        naurVoiceAudio.currentTime = 0;
      }
    }
  }
}

function attachConfessionButtonListeners() {
  const yesBtn = document.getElementById('yesBtn');
  const naurBtn = document.getElementById('naurBtn');
  if (yesBtn) {
    yesBtn.onclick = () => {
      if (yesPressed) return;
      yesPressed = true;
      showYesConfetti();
      updateConfessionMessage("", () => {
        audioSection.style.display = 'none';
        setTimeout(showFinalMessage, 850);
      });
    };
  }
  if (naurBtn) {
    naurBtn.onclick = () => {
      naurPressCount++;
      showNaurSequence();
    };
  }
}

function attachListenConfessionBtn() {
  const listenBtn = document.getElementById('listenConfessionBtn');
  const confessionAudio = document.getElementById('confessionAudioPlayer');
  const audioEl = document.getElementById('confessionVoiceAudio');
  if (listenBtn && confessionAudio && audioEl) {
    audioEl.controls = false;
    listenBtn.onclick = function () {
      if (window.lastAudio && window.lastAudio !== audioEl) {
        window.lastAudio.pause();
        window.lastAudio.currentTime = 0;
        if (window.lastAudioDiv) window.lastAudioDiv.style.display = 'none';
      }
      confessionAudio.style.display = confessionAudio.style.display === 'none' ? 'block' : 'none';
      if (confessionAudio.style.display === 'block') {
        audioEl.currentTime = 0;
        audioEl.play();
        window.lastAudio = audioEl;
        window.lastAudioDiv = confessionAudio;
      } else {
        audioEl.pause();
        audioEl.currentTime = 0;
      }
    }
  }
}

function showYesConfetti() {
  const yesBtn = document.getElementById('yesBtn');
  if (!yesBtn) return;
  const rect = yesBtn.getBoundingClientRect();
  const containerRect = confessionSection.getBoundingClientRect();
  const baseTop = rect.top - containerRect.top;
  const baseLeft = rect.left - containerRect.left;

  for (let i = 0; i < 16; ++i) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = (baseLeft + rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.65) + 'px';
      sparkle.style.top = (baseTop + rect.height / 2 + (Math.random() - 0.6) * rect.height * 0.4) + 'px';
      sparkle.innerHTML = ['💖','✨','💗','💞','🌸','🎉'][Math.floor(Math.random()*6)];
      confessionSection.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }, 35 * i);
  }
}

function showFinalMessage() {
  updateConfessionMessage(`
    <div class="confession-note">
      <div style="font-size:1.35em; color:#b465c2; margin-bottom:1em;font-family:'Dancing Script',cursive;">Alesia…</div>
      <div style="font-size:1.11em; color:#4b2840;">
        Thank you. From the bottom of my heart, thank you for saying yes.<br><br>
        <span style="background:#cbeafe;border-radius:5px;padding:0 5px;">You didn’t just say yes to me.</span><br>
        You said yes to this journey to deep conversations, to honest moments, to staying connected even across the distance.<br><br>
        I promise to court you with intention, with patience, with respect, and with a love that grows a little stronger every single day.<br><br>
        I don’t want to rush anything. I just want to be real with you, to know you deeper, to cherish you better.<br><br>
        This moment means everything to me.<br><br>
        <b style="color:#ae318c;">Let’s write this story together, one day at a time. 💌</b><br><br>
        You have my heart, Alesia. And I’m grateful you gave me the chance to offer it.
      </div>
      <div class="signature-script">— Yours truly,<br><span class="sig-name">Aleser</span></div>
      <button id="listenFinalBtn" class="box-btn fancy-btn" style="margin:20px auto 0 auto; display:block;">
        <span class="btn-heart">🎧</span> Listen to my voice
      </button>
      <div id="finalAudioPlayer" style="display:none; margin-top:14px;">
        <audio id="finalVoiceAudio" style="width:100%;">
          <source src="final-voice.mp3" type="audio/mp3">
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  `, () => {
    audioSection.style.display = 'none';
    const listenFinalBtn = document.getElementById('listenFinalBtn');
    const finalAudio = document.getElementById('finalAudioPlayer');
    const finalVoiceAudio = document.getElementById('finalVoiceAudio');
    if (listenFinalBtn && finalAudio && finalVoiceAudio) {
      finalVoiceAudio.controls = false;
      listenFinalBtn.onclick = function () {
        if (window.lastAudio && window.lastAudio !== finalVoiceAudio) {
          window.lastAudio.pause();
          window.lastAudio.currentTime = 0;
          if (window.lastAudioDiv) window.lastAudioDiv.style.display = 'none';
        }
        finalAudio.style.display = finalAudio.style.display === 'none' ? 'block' : 'none';
        if (finalAudio.style.display === 'block') {
          finalVoiceAudio.currentTime = 0;
          finalVoiceAudio.play();
          window.lastAudio = finalVoiceAudio;
          window.lastAudioDiv = finalAudio;
        } else {
          finalVoiceAudio.pause();
          finalVoiceAudio.currentTime = 0;
        }
      }
    }
  });
}