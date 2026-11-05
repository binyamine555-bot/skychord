/**
 * ============================================================================
 * SKYCHORD — MOTEUR AUDIO WEB & INTERACTIONS CÉLESTES
 * Moteur audio Web Audio API polyphonique, oscilloscope en direct,
 * constellation de particules interactive et synthétiseur d'accords.
 * ============================================================================
 */

(function () {
  'use strict';

  // --- 1. DÉFINITION DES ACCORDS CÉLESTES & FRÉQUENCES (Hz) ---
  const CHORDS = [
    {
      name: "Aura Céleste",
      symbol: "Cmaj9",
      freqs: [130.81, 196.00, 246.94, 293.66, 329.63], // C3, G3, B3, D4, E4
      notes: "Do • Sol • Si • Ré • Mi",
      color: "#00f0ff"
    },
    {
      name: "Brume d'Améthyste",
      symbol: "Am11",
      freqs: [110.00, 164.81, 196.00, 261.63, 293.66], // A2, E3, G3, C4, D4
      notes: "La • Mi • Sol • Do • Ré",
      color: "#8e65ff"
    },
    {
      name: "Éclat Solaire",
      symbol: "Fmaj7#11",
      freqs: [87.31, 130.81, 164.81, 220.00, 246.94], // F2, C3, E3, A3, B3
      notes: "Fa • Do • Mi • La • Si",
      color: "#ffd166"
    },
    {
      name: "Vortex Sidéral",
      symbol: "Em9",
      freqs: [82.41, 123.47, 146.83, 196.00, 369.99], // E2, B2, D3, G3, F#4
      notes: "Mi • Si • Ré • Sol • Fa#",
      color: "#ff4d8d"
    },
    {
      name: "Aurore Boréale",
      symbol: "Dm9",
      freqs: [146.83, 220.00, 261.63, 349.23, 329.63], // D3, A3, C4, F4, E4
      notes: "Ré • La • Do • Fa • Mi",
      color: "#38ef7d"
    },
    {
      name: "Constellation Finale",
      symbol: "G9sus4",
      freqs: [98.00, 146.83, 174.61, 220.00, 261.63], // G2, D3, F3, A3, C4
      notes: "Sol • Ré • Fa • La • Do",
      color: "#00d2ff"
    }
  ];

  // --- 2. ARCHITECTURE WEB AUDIO API ---
  let audioCtx = null;
  let masterGain = null;
  let masterFilter = null;
  let analyser = null;
  let delayNode = null;
  let delayFeedback = null;

  // État du synthétiseur
  let currentPreset = 'celeste';
  let activeVoices = [];
  let isArpActive = false;
  let arpTimer = null;
  let currentChordIndex = 0;
  let filterCutoff = 3200;
  let reverbWet = 0.7;

  // Ambiance céleste de fond
  let ambientDroneActive = false;
  let droneGain = null;
  let droneOscs = [];

  function initAudio() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    // Analyseur pour oscilloscopes
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.85;

    // Filtre passe-bas principal
    masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(filterCutoff, audioCtx.currentTime);
    masterFilter.Q.setValueAtTime(3.0, audioCtx.currentTime);

    // Ligne de délai spatial (écho céleste)
    delayNode = audioCtx.createDelay();
    delayNode.delayTime.setValueAtTime(0.35, audioCtx.currentTime);
    delayFeedback = audioCtx.createGain();
    delayFeedback.gain.setValueAtTime(0.45 * reverbWet, audioCtx.currentTime);

    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);

    // Gain principal
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.75, audioCtx.currentTime);

    // Chaîne de connexion
    masterFilter.connect(analyser);
    analyser.connect(masterGain);
    masterFilter.connect(delayNode);
    delayNode.connect(analyser);
    masterGain.connect(audioCtx.destination);
  }

  function ensureAudioUnlocked() {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Jouer un accord complet
  function playChord(index, duration = 2.8) {
    ensureAudioUnlocked();
    const chord = CHORDS[index];
    if (!chord) return;

    currentChordIndex = index;
    stopAllVoices();

    // Mettre à jour l'affichage de l'accord
    const nameEl = document.getElementById('currentChordName');
    const freqEl = document.getElementById('currentChordFreq');
    if (nameEl) nameEl.textContent = `Accord : ${chord.name} (${chord.symbol})`;
    if (freqEl) freqEl.textContent = `Notes : ${chord.notes}`;

    // Illuminer le pad
    const pads = document.querySelectorAll('.chord-pad');
    pads.forEach((p, idx) => {
      p.classList.toggle('playing', idx === index);
    });

    if (isArpActive) {
      startArpeggiator(chord);
      return;
    }

    const now = audioCtx.currentTime;
    const chordGain = audioCtx.createGain();
    chordGain.gain.setValueAtTime(0.001, now);
    chordGain.gain.exponentialRampToValueAtTime(0.8 / Math.sqrt(chord.freqs.length), now + 0.12);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    chordGain.connect(masterFilter);

    chord.freqs.forEach((freq, i) => {
      let oscType1 = 'sine';
      let oscType2 = 'triangle';
      let detune = (i % 2 === 0 ? 5 : -5);

      if (currentPreset === 'cristal') {
        oscType1 = 'sine';
        oscType2 = 'sine';
        freq = freq * 2; // Octave plus haute
      } else if (currentPreset === 'abysse') {
        oscType1 = 'sawtooth';
        oscType2 = 'triangle';
        freq = freq * 0.5; // Basse profonde
      } else if (currentPreset === 'arpege') {
        oscType1 = 'triangle';
        oscType2 = 'sawtooth';
      }

      // Oscillateur principal
      const osc1 = audioCtx.createOscillator();
      osc1.type = oscType1;
      osc1.frequency.setValueAtTime(freq, now);
      osc1.detune.setValueAtTime(detune, now);
      osc1.connect(chordGain);
      osc1.start(now);
      osc1.stop(now + duration);

      // Oscillateur harmonique
      const osc2 = audioCtx.createOscillator();
      osc2.type = oscType2;
      osc2.frequency.setValueAtTime(freq * 1.002, now);
      osc2.detune.setValueAtTime(-detune, now);
      osc2.connect(chordGain);
      osc2.start(now);
      osc2.stop(now + duration);

      activeVoices.push(osc1, osc2);
    });

    setTimeout(() => {
      pads[index]?.classList.remove('playing');
    }, 600);
  }

  function stopAllVoices() {
    activeVoices.forEach(v => {
      try { v.stop(); } catch (e) {}
    });
    activeVoices = [];
    if (arpTimer) {
      clearInterval(arpTimer);
      arpTimer = null;
    }
  }

  // Arpégiateur stellaire
  function startArpeggiator(chord) {
    if (arpTimer) clearInterval(arpTimer);
    let step = 0;
    const interval = 180; // ms

    arpTimer = setInterval(() => {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const freq = chord.freqs[step % chord.freqs.length];

      const noteGain = audioCtx.createGain();
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.5, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      noteGain.connect(masterFilter);

      const osc = audioCtx.createOscillator();
      osc.type = currentPreset === 'cristal' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq * (step % 2 === 0 ? 1 : 2), now);
      osc.connect(noteGain);
      osc.start(now);
      osc.stop(now + 0.4);

      step++;
    }, interval);
  }

  // Theremin Céleste (Ruban tactile)
  let ribbonVoice = null;
  let ribbonGain = null;

  function startRibbon(freq) {
    ensureAudioUnlocked();
    stopRibbon();

    const now = audioCtx.currentTime;
    ribbonGain = audioCtx.createGain();
    ribbonGain.gain.setValueAtTime(0.001, now);
    ribbonGain.gain.exponentialRampToValueAtTime(0.4, now + 0.05);
    ribbonGain.connect(masterFilter);

    ribbonVoice = audioCtx.createOscillator();
    ribbonVoice.type = 'sine';
    ribbonVoice.frequency.setValueAtTime(freq, now);
    ribbonVoice.connect(ribbonGain);
    ribbonVoice.start(now);
  }

  function updateRibbon(freq) {
    if (ribbonVoice && audioCtx) {
      ribbonVoice.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.04);
    }
  }

  function stopRibbon() {
    if (ribbonGain && audioCtx) {
      const now = audioCtx.currentTime;
      ribbonGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      setTimeout(() => {
        if (ribbonVoice) {
          try { ribbonVoice.stop(); } catch (e) {}
          ribbonVoice = null;
        }
      }, 160);
    }
  }

  // Ambiance céleste de fond (Drone cosmique)
  function toggleAmbientDrone() {
    ensureAudioUnlocked();
    ambientDroneActive = !ambientDroneActive;

    const btn = document.getElementById('ambientSoundBtn');
    const iconOn = btn?.querySelector('.sound-icon-on');
    const iconOff = btn?.querySelector('.sound-icon-off');

    if (ambientDroneActive) {
      btn?.classList.add('active');
      iconOn?.classList.remove('hidden');
      iconOff?.classList.add('hidden');

      const now = audioCtx.currentTime;
      droneGain = audioCtx.createGain();
      droneGain.gain.setValueAtTime(0.001, now);
      droneGain.gain.exponentialRampToValueAtTime(0.18, now + 2.0);

      const droneFilter = audioCtx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(450, now);
      droneFilter.connect(masterGain);
      droneGain.connect(droneFilter);

      // Fréquences cosmiques sacrées (Do 65.4 Hz, Sol 98 Hz, Do 130.8 Hz)
      [65.41, 98.00, 130.81, 196.00].forEach((f, idx) => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        osc.detune.setValueAtTime(idx * 3 - 4, now);
        osc.connect(droneGain);
        osc.start(now);
        droneOscs.push(osc);
      });
    } else {
      btn?.classList.remove('active');
      iconOn?.classList.add('hidden');
      iconOff?.classList.remove('hidden');

      if (droneGain && audioCtx) {
        const now = audioCtx.currentTime;
        droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        setTimeout(() => {
          droneOscs.forEach(o => {
            try { o.stop(); } catch (e) {}
          });
          droneOscs = [];
        }, 1300);
      }
    }
  }

  // --- 3. RENDU DES OSCILLOSCOPES EN DIRECT ---

  function setupOscilloscopes() {
    const scopeCanvas = document.getElementById('scopeCanvas');
    const heroCanvas = document.getElementById('heroVisualizerCanvas');

    function resizeCanvas() {
      if (scopeCanvas) {
        scopeCanvas.width = scopeCanvas.parentElement.clientWidth * window.devicePixelRatio;
        scopeCanvas.height = scopeCanvas.parentElement.clientHeight * window.devicePixelRatio;
      }
      if (heroCanvas) {
        heroCanvas.width = heroCanvas.parentElement.clientWidth * window.devicePixelRatio;
        heroCanvas.height = heroCanvas.parentElement.clientHeight * window.devicePixelRatio;
      }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const scopeCtx = scopeCanvas ? scopeCanvas.getContext('2d') : null;
    const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;

    let timeData = new Uint8Array(512);
    let freqData = new Uint8Array(128);
    let idleAngle = 0;

    function renderAudioVisuals() {
      requestAnimationFrame(renderAudioVisuals);
      idleAngle += 0.03;

      // 1. Oscilloscope principal du sanctuaire
      if (scopeCtx && scopeCanvas) {
        const w = scopeCanvas.width;
        const h = scopeCanvas.height;
        scopeCtx.clearRect(0, 0, w, h);

        // Grille de fond
        scopeCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        scopeCtx.lineWidth = 1;
        scopeCtx.beginPath();
        for (let x = 0; x < w; x += 60 * window.devicePixelRatio) {
          scopeCtx.moveTo(x, 0); scopeCtx.lineTo(x, h);
        }
        for (let y = 0; y < h; y += 40 * window.devicePixelRatio) {
          scopeCtx.moveTo(0, y); scopeCtx.lineTo(w, y);
        }
        scopeCtx.stroke();

        if (analyser) {
          if (timeData.length !== analyser.frequencyBinCount) {
            timeData = new Uint8Array(analyser.frequencyBinCount);
          }
          analyser.getByteTimeDomainData(timeData);
        }

        // Ligne d'onde luminescente
        scopeCtx.lineWidth = 3 * window.devicePixelRatio;
        scopeCtx.strokeStyle = CHORDS[currentChordIndex]?.color || '#00f0ff';
        scopeCtx.shadowColor = scopeCtx.strokeStyle;
        scopeCtx.shadowBlur = 15;
        scopeCtx.beginPath();

        const sliceWidth = w / (timeData.length - 1);
        let x = 0;

        for (let i = 0; i < timeData.length; i++) {
          const v = analyser ? (timeData[i] / 128.0) : (1.0 + Math.sin(idleAngle + i * 0.05) * 0.08);
          const y = (v * h) / 2;

          if (i === 0) scopeCtx.moveTo(x, y);
          else scopeCtx.lineTo(x, y);

          x += sliceWidth;
        }

        scopeCtx.stroke();
        scopeCtx.shadowBlur = 0; // Reset ombre
      }

      // 2. Visualiseur dynamique du Hero
      if (heroCtx && heroCanvas) {
        const hw = heroCanvas.width;
        const hh = heroCanvas.height;
        heroCtx.clearRect(0, 0, hw, hh);

        if (analyser) {
          if (freqData.length !== analyser.frequencyBinCount) {
            freqData = new Uint8Array(analyser.frequencyBinCount);
          }
          analyser.getByteFrequencyData(freqData);
        }

        const bars = 48;
        const barWidth = (hw / bars) * 0.65;
        const gap = (hw / bars) * 0.35;

        for (let i = 0; i < bars; i++) {
          const freqValue = analyser ? freqData[i * 2] : (35 + Math.sin(idleAngle * 0.8 + i * 0.2) * 25);
          const barHeight = (freqValue / 255.0) * (hh * 0.75);
          const bx = i * (barWidth + gap) + gap / 2;
          const by = hh - barHeight - 20;

          const grad = heroCtx.createLinearGradient(0, by, 0, hh);
          grad.addColorStop(0, '#00f0ff');
          grad.addColorStop(0.5, '#8e65ff');
          grad.addColorStop(1, '#ff4d8d');

          heroCtx.fillStyle = grad;
          heroCtx.shadowColor = '#00f0ff';
          heroCtx.shadowBlur = 8;
          heroCtx.fillRect(bx, by, barWidth, barHeight);
        }
        heroCtx.shadowBlur = 0;
      }
    }

    renderAudioVisuals();
  }

  // --- 4. TOILE DE FOND DES CONSTELLATIONS INTERACTIVE ---

  function setupConstellationCanvas() {
    const canvas = document.getElementById('constellationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const numStars = Math.floor(Math.min(w, 1400) / 12);
    const stars = [];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.4 ? '#8e65ff' : '#00f0ff'
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function drawStars() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        // Interaction douce avec la souris
        const dxMouse = mouseX - s.x;
        const dyMouse = mouseY - s.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 120) {
          s.x -= (dxMouse / distMouse) * 1.2;
          s.y -= (dyMouse / distMouse) * 1.2;
        }

        // Dessiner l'étoile
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Relier les étoiles proches (constellation)
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dist = Math.hypot(s.x - s2.x, s.y - s2.y);
          if (dist < 110) {
            ctx.strokeStyle = '#7c5cff';
            ctx.globalAlpha = (1 - dist / 110) * 0.22;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(drawStars);
    }

    drawStars();
  }

  // --- 5. INITIALISATION DES ÉVÉNEMENTS & CONTRÔLES ---

  function setupInteractions() {
    // Pads d'accords
    const pads = document.querySelectorAll('.chord-pad');
    pads.forEach(pad => {
      const idx = parseInt(pad.dataset.chord, 10);
      pad.addEventListener('click', () => playChord(idx));
      pad.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playChord(idx);
        }
      });
    });

    // Raccourcis clavier (1 à 6)
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 6) {
        playChord(keyNum - 1);
      }
    });

    // Mini boutons d'accords du Hero
    const miniBtns = document.querySelectorAll('.mini-chord-btn');
    const chordMap = { Cmaj9: 0, Am11: 1, Fmaj7: 2, G9sus4: 5 };
    miniBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        miniBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cName = btn.dataset.chord;
        if (chordMap[cName] !== undefined) {
          playChord(chordMap[cName]);
        }
      });
    });

    // Boutons des 5 Sphères
    const worldBtns = document.querySelectorAll('.world-listen-btn');
    worldBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cName = btn.dataset.worldChord;
        if (chordMap[cName] !== undefined) {
          playChord(chordMap[cName]);
        }
      });
    });

    // Sélecteur de preset synthé
    const presetPills = document.querySelectorAll('.mode-pill');
    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        presetPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentPreset = pill.dataset.preset;
      });
    });

    // Sliders de filtre et réverb
    const filterSlider = document.getElementById('filterSlider');
    if (filterSlider) {
      filterSlider.addEventListener('input', (e) => {
        filterCutoff = parseFloat(e.target.value);
        if (masterFilter && audioCtx) {
          masterFilter.frequency.setTargetAtTime(filterCutoff, audioCtx.currentTime, 0.05);
        }
      });
    }

    const reverbSlider = document.getElementById('reverbSlider');
    if (reverbSlider) {
      reverbSlider.addEventListener('input', (e) => {
        reverbWet = parseFloat(e.target.value) / 100.0;
        if (delayFeedback && audioCtx) {
          delayFeedback.gain.setTargetAtTime(0.55 * reverbWet, audioCtx.currentTime, 0.05);
        }
      });
    }

    // Bascule de l'arpégiateur
    const arpBtn = document.getElementById('arpeggiatorToggle');
    if (arpBtn) {
      arpBtn.addEventListener('click', () => {
        isArpActive = !isArpActive;
        arpBtn.classList.toggle('active', isArpActive);
        if (isArpActive) {
          playChord(currentChordIndex);
        } else {
          stopAllVoices();
        }
      });
    }

    // Ribbon Controller (Theremin Céleste)
    const ribbon = document.getElementById('ribbonController');
    const glow = document.getElementById('ribbonGlow');

    if (ribbon && glow) {
      function handleRibbonMove(clientX) {
        const rect = ribbon.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        glow.style.left = `${ratio * 100}%`;
        glow.style.opacity = '1';

        // Gamme pentatonique cosmique de 220Hz à 880Hz
        const baseFreq = 220;
        const freq = baseFreq * Math.pow(2, ratio * 2);
        updateRibbon(freq);
      }

      ribbon.addEventListener('mousedown', (e) => {
        handleRibbonMove(e.clientX);
        const rect = ribbon.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        startRibbon(220 * Math.pow(2, ratio * 2));

        function onMove(moveEvent) {
          handleRibbonMove(moveEvent.clientX);
        }
        function onUp() {
          stopRibbon();
          glow.style.opacity = '0';
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });

      // Support tactile sur mobile
      ribbon.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        handleRibbonMove(touch.clientX);
        const rect = ribbon.getBoundingClientRect();
        const ratio = (touch.clientX - rect.left) / rect.width;
        startRibbon(220 * Math.pow(2, ratio * 2));
      }, { passive: true });

      ribbon.addEventListener('touchmove', (e) => {
        handleRibbonMove(e.touches[0].clientX);
      }, { passive: true });

      ribbon.addEventListener('touchend', () => {
        stopRibbon();
        glow.style.opacity = '0';
      });
    }

    // Bouton d'ambiance céleste
    const ambientBtn = document.getElementById('ambientSoundBtn');
    if (ambientBtn) {
      ambientBtn.addEventListener('click', toggleAmbientDrone);
    }

    // Formulaire d'inscription Playtest
    const betaForm = document.getElementById('betaForm');
    const feedback = document.getElementById('formFeedback');
    if (betaForm && feedback) {
      betaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('userEmail');
        const email = emailInput ? emailInput.value.trim() : '';

        if (email) {
          // Sauvegarde dans le localStorage
          const list = JSON.parse(localStorage.getItem('skychord_waitlist') || '[]');
          list.push({ email, date: new Date().toISOString() });
          localStorage.setItem('skychord_waitlist', JSON.stringify(list));

          feedback.textContent = `✦ Accord Parfait ! Ton invitation pour l'Alpha fermée a été enregistrée pour ${email}.`;
          feedback.className = 'form-feedback success';
          feedback.classList.remove('hidden');

          if (emailInput) emailInput.value = '';

          // Jouer un accord de célébration
          playChord(0, 3.5);
        }
      });
    }

    // Menu Mobile
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        const isHidden = getComputedStyle(navLinks).display === 'none';
        navLinks.style.display = isHidden ? 'flex' : 'none';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(5, 7, 20, 0.96)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
      });
    }
  }

  // --- INITIALISATION AU CHARGEMENT ---
  window.addEventListener('DOMContentLoaded', () => {
    setupConstellationCanvas();
    setupOscilloscopes();
    setupInteractions();
  });

})();
