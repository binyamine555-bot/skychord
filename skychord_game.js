/**
 * SKYCHORD: COMBAT CÉLESTE — Moteur de Combat Anime Dragon Ball Z Kai
 * - Qualité Graphique DBZ Kai : Encrage cel-shading, flammes de Ki montantes, éclairs SSJ2, lignes de vitesse, étoiles de choc.
 * - Modes de jeu : Mode Histoire avec cinématiques animées, Mort Subite (300%), Défi Titan Colosse, Survie Vagues, Versus 1v1.
 * - Commandes tactiles mobiles adaptées à 5 touches : FRAPPE (tap=combo, maintien=Smash avec jauge de Ki), SPÉ, SAUT, GARDE, PRISE.
 * - Moteur audio Web Audio API autonome : bruitages d'impact, rayons d'énergie, charges de Ki et thèmes orchestraux.
 */

class SkyChordAudio {
  constructor() {
    this.ctx = null;
    this.init();
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Son de frappe punch / impact
  punch(heavy = false) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = heavy ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(heavy ? 140 : 220, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + (heavy ? 0.22 : 0.12));
    gain.gain.setValueAtTime(heavy ? 0.8 : 0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + (heavy ? 0.22 : 0.12));
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + (heavy ? 0.25 : 0.15));

    if (heavy) {
      // Bruit blanc d'impact explosif
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, t);
      noiseGain.gain.linearRampToValueAtTime(0.01, t + 0.18);
      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    }
  }

  // Son de charge de Ki
  kiCharge(ratio) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180 + ratio * 320, t);
    gain.gain.setValueAtTime(0.18 * ratio, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Rayon Ki / Kamehameha
  kiBeam() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(280, t + 0.4);
    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  // Déflexion / Bouclier
  shield() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }
}

// ==========================================
// PERSONNAGES CÉLESTES (DBZ KAI AESTHETICS)
// ==========================================
const FIGHTERS_DATA = {
  sola: {
    id: 'sola',
    name: 'SOLA',
    title: 'Guerrière Solaire (Super Saiyan)',
    color: '#f59e0b',
    auraColor: 'rgba(251, 191, 36, 0.85)',
    accent: '#fbbf24',
    hairColor: '#fde047',
    giColor: '#ea580c',
    speed: 7.2,
    jumpPower: -16.5,
    maxHp: 200,
    specialName: 'RAYON SOLAIRE NOVA'
  },
  aether: {
    id: 'aether',
    name: 'AETHER',
    title: 'Dieu Céleste de la Foudre',
    color: '#06b6d4',
    auraColor: 'rgba(34, 211, 238, 0.85)',
    accent: '#38bdf8',
    hairColor: '#e0f2fe',
    giColor: '#1e293b',
    speed: 8.0,
    jumpPower: -17.0,
    maxHp: 190,
    specialName: 'ÉCLAIR JUGEMENT DIVIN'
  },
  nox: {
    id: 'nox',
    name: 'NOX',
    title: 'Ombre Astrale du Néant',
    color: '#8b5cf6',
    auraColor: 'rgba(168, 85, 247, 0.85)',
    accent: '#a855f7',
    hairColor: '#3b0764',
    giColor: '#0f172a',
    speed: 7.5,
    jumpPower: -16.0,
    maxHp: 210,
    specialName: 'CATACLYSME DU VIDE'
  },
  titan: {
    id: 'titan',
    name: 'TITAN KRONOS',
    title: 'Colosse Primordial (Raid Boss)',
    color: '#dc2626',
    auraColor: 'rgba(239, 68, 68, 0.9)',
    accent: '#ef4444',
    hairColor: '#450a0a',
    giColor: '#1c1917',
    speed: 4.8,
    jumpPower: -14.0,
    maxHp: 500,
    isTitan: true,
    scale: 2.1,
    superArmor: true,
    specialName: 'SEISME D\'ANÉANTISSEMENT'
  }
};

// ==========================================
// MOTEUR PRINCIPAL DU JEU SKYCHORD
// ==========================================
class SkyChordGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.audio = new SkyChordAudio();

    // Dimensions logiques
    this.width = 1280;
    this.height = 720;
    this.scale = 1;

    // État du jeu : 'menu', 'cinematic', 'playing', 'gameover'
    this.state = 'menu';
    this.mode = 'versus'; // 'histoire', 'eclair', 'titan', 'survie', 'versus'

    // Combattants
    this.p1 = null;
    this.p2 = null;

    // Particules & Effets DBZ Kai
    this.particles = [];
    this.hitSparks = [];
    this.speedLines = [];
    this.projectiles = [];
    this.shake = 0;
    this.hitStop = 0;
    this.time = 0;

    // Histoire & Cinématiques
    this.storyChapter = 1;
    this.cinematicFrame = 0;
    this.cinematicDialogue = '';
    this.cinematicSpeaker = '';

    // Entrées
    this.keys = {};
    this.touch = {
      joy: { active: false, startX: 0, startY: 0, currX: 0, currY: 0, dx: 0, dy: 0 },
      attackHold: 0,
      smashCharged: false
    };

    this.initCanvas();
    this.bindEvents();
    this.startLoop();
  }

  initCanvas() {
    const resize = () => {
      const container = this.canvas.parentElement;
      const w = container ? container.clientWidth : window.innerWidth;
      const h = container ? container.clientHeight : window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.scale = Math.min(w / this.width, h / this.height);
      this.canvas.style.width = `${this.width * this.scale}px`;
      this.canvas.style.height = `${this.height * this.scale}px`;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  bindEvents() {
    // Clavier
    window.addEventListener('keydown', (e) => {
      this.audio.init();
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' && this.state === 'cinematic') this.nextCinematic();
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Tactile
    const c = this.canvas;
    const getPos = (touch) => {
      const r = c.getBoundingClientRect();
      return {
        x: (touch.clientX - r.left) / this.scale,
        y: (touch.clientY - r.top) / this.scale
      };
    };

    c.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.audio.init();
      if (this.state === 'cinematic') {
        this.nextCinematic();
        return;
      }
      for (let t of e.changedTouches) {
        const p = getPos(t);
        // Joystick gauche
        if (p.x < this.width * 0.45) {
          this.touch.joy.active = true;
          this.touch.joy.id = t.identifier;
          this.touch.joy.startX = p.x;
          this.touch.joy.startY = p.y;
          this.touch.joy.currX = p.x;
          this.touch.joy.currY = p.y;
        } else {
          // Boutons droits (5 boutons)
          this.handleButtonTouch(p, true);
        }
      }
    }, { passive: false });

    c.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let t of e.changedTouches) {
        const p = getPos(t);
        if (this.touch.joy.active && t.identifier === this.touch.joy.id) {
          this.touch.joy.currX = p.x;
          this.touch.joy.currY = p.y;
          const maxR = 65;
          const dX = p.x - this.touch.joy.startX;
          const dY = p.y - this.touch.joy.startY;
          const dist = Math.hypot(dX, dY);
          this.touch.joy.dx = dist > 0 ? (dX / Math.max(dist, maxR)) : 0;
          this.touch.joy.dy = dist > 0 ? (dY / Math.max(dist, maxR)) : 0;
        }
      }
    }, { passive: false });

    c.addEventListener('touchend', (e) => {
      e.preventDefault();
      for (let t of e.changedTouches) {
        if (this.touch.joy.active && t.identifier === this.touch.joy.id) {
          this.touch.joy.active = false;
          this.touch.joy.dx = 0;
          this.touch.joy.dy = 0;
        } else {
          const p = getPos(t);
          this.handleButtonTouch(p, false);
        }
      }
    }, { passive: false });
  }

  // Configuration des 5 boutons tactiles
  getButtons() {
    return [
      { id: 'attack', label: 'FRAPPE', x: 1120, y: 575, r: 72, color: '#f59e0b' },
      { id: 'special', label: 'SPÉ', x: 980, y: 600, r: 58, color: '#06b6d4' },
      { id: 'jump', label: 'SAUT', x: 1120, y: 425, r: 60, color: '#10b981' },
      { id: 'shield', label: 'GARDE', x: 980, y: 450, r: 54, color: '#6366f1' },
      { id: 'burst', label: 'PRISE', x: 855, y: 530, r: 52, color: '#ec4899' }
    ];
  }

  handleButtonTouch(p, isDown) {
    const btns = this.getButtons();
    for (let b of btns) {
      if (Math.hypot(p.x - b.x, p.y - b.y) <= b.r * 1.1) {
        if (b.id === 'attack') {
          if (isDown) {
            this.touch.attackDown = true;
          } else {
            // Relâché : si tenu < 10 frames = coup normal ; si tenu >= 10 frames = Smash !
            if (this.p1) {
              if (this.touch.attackHold >= 10) {
                this.p1.releaseSmash(this);
              } else {
                this.p1.attack(this);
              }
            }
            this.touch.attackDown = false;
            this.touch.attackHold = 0;
            this.touch.smashCharged = false;
          }
        } else if (isDown) {
          if (this.p1) {
            if (b.id === 'special') this.p1.special(this);
            if (b.id === 'jump') this.p1.jump();
            if (b.id === 'shield') this.p1.toggleShield(true);
            if (b.id === 'burst') this.p1.grabOrBurst(this);
          }
        } else {
          if (this.p1 && b.id === 'shield') this.p1.toggleShield(false);
        }
        break;
      }
    }
  }

  // Lancement d'un combat
  startMatch(mode = 'versus', p1Id = 'sola', p2Id = 'aether') {
    this.mode = mode;
    this.p1 = new Fighter(FIGHTERS_DATA[p1Id], 320, 520, 1, false);
    
    // Configuration selon le mode
    if (mode === 'titan') {
      this.p2 = new Fighter(FIGHTERS_DATA.titan, 960, 520, -1, true);
    } else if (mode === 'eclair') {
      this.p1.hp = 1;
      this.p1.damagePercent = 300;
      this.p2 = new Fighter(FIGHTERS_DATA[p2Id], 960, 520, -1, true);
      this.p2.hp = 1;
      this.p2.damagePercent = 300;
    } else if (mode === 'histoire') {
      this.startStoryChapter(this.storyChapter);
      return;
    } else {
      this.p2 = new Fighter(FIGHTERS_DATA[p2Id], 960, 520, -1, true);
    }

    this.particles = [];
    this.hitSparks = [];
    this.speedLines = [];
    this.projectiles = [];
    this.state = 'playing';
    this.time = 0;
  }

  startStoryChapter(ch) {
    this.storyChapter = ch;
    this.state = 'cinematic';
    this.cinematicFrame = 0;
    if (ch === 1) {
      this.cinematicSpeaker = 'SOLA (Voix Céleste)';
      this.cinematicDialogue = '« Le Silence Obscur a brisé le Chœur des Étoiles... Mes flammes solaires doivent s\'éveiller pour le combat décisif ! »';
      this.cinematicTitle = 'ÉPISODE I : L\'ÉVEIL DES GUERRIERS CÉLESTES';
    } else if (ch === 2) {
      this.cinematicSpeaker = 'AETHER';
      this.cinematicDialogue = '« Montre-moi la puissance de ton Ki solaire, Sola ! Les cieux ne reconnaissent que la force pure ! »';
      this.cinematicTitle = 'ÉPISODE II : CHOC DIVIN AU SOMMET DU CIEL';
    } else {
      this.cinematicSpeaker = 'TITAN KRONOS';
      this.cinematicDialogue = '« RIEN NE PEUT RÉSISTER À L\'ANÉANTISSEMENT PRIMORDIAL ! TREMBLEZ, MORTELS ! »';
      this.cinematicTitle = 'ÉPISODE III : LE COMBAT CONTRE LE COLOSSE';
    }
  }

  nextCinematic() {
    this.state = 'playing';
    if (this.storyChapter === 1) {
      this.p1 = new Fighter(FIGHTERS_DATA.sola, 320, 520, 1, false);
      this.p2 = new Fighter(FIGHTERS_DATA.aether, 960, 520, -1, true);
    } else if (this.storyChapter === 2) {
      this.p1 = new Fighter(FIGHTERS_DATA.sola, 320, 520, 1, false);
      this.p2 = new Fighter(FIGHTERS_DATA.nox, 960, 520, -1, true);
    } else {
      this.p1 = new Fighter(FIGHTERS_DATA.sola, 320, 520, 1, false);
      this.p2 = new Fighter(FIGHTERS_DATA.titan, 960, 520, -1, true);
    }
  }

  startLoop() {
    const loop = () => {
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update() {
    this.time++;

    // Gestion du gel d'impact (Hitstop) DBZ Kai
    if (this.hitStop > 0) {
      this.hitStop--;
      return;
    }

    if (this.shake > 0) this.shake *= 0.88;

    if (this.state === 'cinematic') {
      this.cinematicFrame++;
      return;
    }

    if (this.state !== 'playing') return;

    // Mise à jour de la charge de smash tactile
    if (this.touch.attackDown) {
      this.touch.attackHold++;
      this.audio.kiCharge(Math.min(1.0, this.touch.attackHold / 40));
      if (this.touch.attackHold >= 10 && this.p1) {
        this.p1.chargeSmash();
        this.touch.smashCharged = this.p1.smashCharge >= 1.0;
      }
    }

    // Commandes Clavier P1
    if (this.p1) {
      let mx = 0;
      if (this.keys['arrowleft'] || this.keys['q'] || this.keys['a']) mx -= 1;
      if (this.keys['arrowright'] || this.keys['d']) mx += 1;
      
      // Combiner clavier et joystick tactile
      if (this.touch.joy.active) mx = this.touch.joy.dx;
      this.p1.move(mx);

      if ((this.keys['arrowup'] || this.keys['z'] || this.keys['w']) && this.p1.onGround) {
        this.p1.jump();
      }

      // Attaque clavier
      if (this.keys['j']) {
        if (!this.keys._jHeld) {
          this.keys._jHeld = true;
          this.keys._jTime = this.time;
        } else if (this.time - this.keys._jTime > 8) {
          this.p1.chargeSmash();
        }
      } else if (this.keys._jHeld) {
        if (this.time - this.keys._jTime > 8) {
          this.p1.releaseSmash(this);
        } else {
          this.p1.attack(this);
        }
        this.keys._jHeld = false;
      }

      if (this.keys['k'] && !this.keys._kPressed) {
        this.keys._kPressed = true;
        this.p1.special(this);
      }
      if (!this.keys['k']) this.keys._kPressed = false;

      if (this.keys['u']) this.p1.toggleShield(true);
      else if (!this.touch.shieldDown) this.p1.toggleShield(false);

      if (this.keys['i'] && !this.keys._iPressed) {
        this.keys._iPressed = true;
        this.p1.grabOrBurst(this);
      }
      if (!this.keys['i']) this.keys._iPressed = false;
    }

    // IA P2
    if (this.p2 && this.p2.isAi) {
      this.updateAi(this.p2, this.p1);
    }

    // Physiques combattants
    if (this.p1) this.p1.update(this);
    if (this.p2) this.p2.update(this);

    // Collisions combattants
    if (this.p1 && this.p2) {
      this.checkCombatCollisions(this.p1, this.p2);
      this.checkCombatCollisions(this.p2, this.p1);
    }

    // Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx;
      proj.life--;

      // Collision projectile contre adversaire
      const target = proj.owner === this.p1 ? this.p2 : this.p1;
      if (target && Math.hypot(proj.x - target.x, proj.y - (target.y - target.h * 0.5)) < proj.radius + target.w * 0.4) {
        target.takeDamage(proj.damage, proj.vx * 1.5, -6, this, true);
        this.addHitSpark(proj.x, proj.y, proj.color, 1.8, true);
        this.projectiles.splice(i, 1);
        continue;
      }
      if (proj.life <= 0 || proj.x < -100 || proj.x > this.width + 100) {
        this.projectiles.splice(i, 1);
      }
    }

    // Particules & Étincelles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.hitSparks.length - 1; i >= 0; i--) {
      const s = this.hitSparks[i];
      s.age++;
      if (s.age > s.maxAge) this.hitSparks.splice(i, 1);
    }

    // Lignes de vitesse manga
    if (this.p1 && (Math.abs(this.p1.vx) > 6 || this.p1.isSmashing)) {
      this.addSpeedLine(this.p1.x, this.p1.y - this.p1.h * 0.5, this.p1.vx, this.p1.data.accent);
    }
    if (this.p2 && (Math.abs(this.p2.vx) > 6 || this.p2.isSmashing)) {
      this.addSpeedLine(this.p2.x, this.p2.y - this.p2.h * 0.5, this.p2.vx, this.p2.data.accent);
    }

    for (let i = this.speedLines.length - 1; i >= 0; i--) {
      const l = this.speedLines[i];
      l.x += l.vx;
      l.alpha -= 0.08;
      if (l.alpha <= 0) this.speedLines.splice(i, 1);
    }

    // Victoire / Défaite
    if (this.p1 && this.p1.hp <= 0) this.triggerGameOver(this.p2);
    if (this.p2 && this.p2.hp <= 0) this.triggerGameOver(this.p1);
  }

  updateAi(ai, target) {
    if (!target) return;
    const dist = target.x - ai.x;
    const absDist = Math.abs(dist);

    // Direction
    if (absDist > 110) {
      ai.move(Math.sign(dist) * (ai.isTitan ? 0.7 : 0.85));
    } else {
      ai.move(0);
    }

    // Saut pour esquive ou poursuite
    if (Math.random() < 0.02 && ai.onGround) {
      ai.jump();
    }

    // Attaques & Coups spéciaux
    if (absDist < 140 && Math.random() < 0.06) {
      if (Math.random() < 0.25) {
        ai.special(this);
      } else {
        ai.attack(this);
      }
    }

    // Garde occasionnelle
    if (target.isAttacking && absDist < 120 && Math.random() < 0.05) {
      ai.toggleShield(true);
      setTimeout(() => ai.toggleShield(false), 350);
    }
  }

  checkCombatCollisions(attacker, victim) {
    if (!attacker.isAttacking || attacker.hitHasConnected) return;

    const hitbox = attacker.getHitbox();
    const hurtbox = victim.getHurtbox();

    if (
      hitbox.x < hurtbox.x + hurtbox.w &&
      hitbox.x + hitbox.w > hurtbox.x &&
      hitbox.y < hurtbox.y + hurtbox.h &&
      hitbox.y + hitbox.h > hurtbox.y
    ) {
      attacker.hitHasConnected = true;
      const isCrit = attacker.isSmashing;
      const damage = isCrit ? 38 : (attacker.isTitan ? 28 : 16);
      const knockbackX = attacker.facing * (isCrit ? 22 : 9);
      const knockbackY = isCrit ? -14 : -7;

      victim.takeDamage(damage, knockbackX, knockbackY, this, isCrit);
      this.addHitSpark(hitbox.x + hitbox.w * 0.5, hitbox.y + hitbox.h * 0.5, attacker.data.accent, isCrit ? 2.2 : 1.2, isCrit);
      this.audio.punch(isCrit);

      // Hitstop & secousse d'écran DBZ Kai
      this.hitStop = isCrit ? 7 : 3;
      this.shake = isCrit ? 16 : 6;
    }
  }

  addHitSpark(x, y, color, scale = 1, isCrit = false) {
    this.hitSparks.push({
      x, y, color, scale, isCrit, age: 0, maxAge: isCrit ? 16 : 10
    });
  }

  addSpeedLine(x, y, vx, color) {
    this.speedLines.push({
      x, y, vx: -vx * 1.6, len: Math.abs(vx) * 12 + 40, color, alpha: 0.8
    });
  }

  triggerGameOver(winner) {
    this.state = 'gameover';
    this.winner = winner;
  }

  // ==========================================
  // RENDU GRAPHIQUE DRAGON BALL Z KAI
  // ==========================================
  render() {
    const c = this.ctx;
    c.save();

    // Secousse d'écran (Screen Shake)
    if (this.shake > 0) {
      const sx = (Math.random() * 2 - 1) * this.shake;
      const sy = (Math.random() * 2 - 1) * this.shake;
      c.translate(sx, sy);
    }

    // 1. Fond Arène Céleste DBZ Kai
    this.renderArena(c);

    // 2. Lignes de vitesse manga en arrière-plan
    this.renderSpeedLines(c);

    // 3. Projectiles & Rayons Ki
    this.renderProjectiles(c);

    // 4. Combattants Cel-Shadés avec Auras de Ki
    if (this.p1) this.p1.render(c, this.time);
    if (this.p2) this.p2.render(c, this.time);

    // 5. Étincelles & Étoiles de choc DBZ Kai
    this.renderHitSparks(c);

    // 6. HUD de combat (Barres de PV, portrait, jauge de Ki, timers)
    this.renderHUD(c);

    // 7. Commandes tactiles mobiles (5 boutons élégants)
    this.renderTouchControls(c);

    // 8. Écrans spécifiques (Cinématique, Menus, GameOver)
    if (this.state === 'cinematic') this.renderCinematic(c);
    if (this.state === 'gameover') this.renderGameOver(c);
    if (this.state === 'menu') this.renderMenu(c);

    c.restore();
  }

  renderArena(c) {
    // Dégradé céleste cosmique
    const grad = c.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(0.65, '#1e1b4b');
    grad.addColorStop(1, '#311042');
    c.fillStyle = grad;
    c.fillRect(0, 0, this.width, this.height);

    // Étoiles et nébuleuses
    c.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 40; i++) {
      const ex = (i * 97 + this.time * 0.1) % this.width;
      const ey = (i * 137) % (this.height * 0.7);
      const r = (i % 3) + 1;
      c.beginPath();
      c.arc(ex, ey, r, 0, Math.PI * 2);
      c.fill();
    }

    // Plateforme céleste centrale (temple doré en ruine flottant)
    const platY = 560;
    c.fillStyle = '#1e1b2e';
    c.strokeStyle = '#f59e0b';
    c.lineWidth = 4;
    c.beginPath();
    c.roundRect(160, platY, 960, 140, [12, 12, 0, 0]);
    c.fill();
    c.stroke();

    // Motifs d'or céleste cel-shadés
    c.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    c.lineWidth = 2;
    for (let x = 200; x < 1080; x += 80) {
      c.strokeRect(x, platY + 15, 60, 40);
    }
  }

  renderSpeedLines(c) {
    for (let l of this.speedLines) {
      c.save();
      c.strokeStyle = l.color;
      c.lineWidth = 3;
      c.globalAlpha = Math.max(0, l.alpha);
      c.beginPath();
      c.moveTo(l.x, l.y);
      c.lineTo(l.x + l.len, l.y);
      c.stroke();
      c.restore();
    }
  }

  renderProjectiles(c) {
    for (let p of this.projectiles) {
      c.save();
      // Rayon d'énergie Kamehameha / Beam
      const grad = c.createRadialGradient(p.x, p.y, 4, p.x, p.y, p.radius * 2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, p.color);
      grad.addColorStop(1, 'transparent');
      c.fillStyle = grad;
      c.beginPath();
      c.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      c.fill();

      // Traînée de foudre
      c.strokeStyle = '#ffffff';
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(p.x, p.y);
      c.lineTo(p.x - p.vx * 3, p.y);
      c.stroke();
      c.restore();
    }
  }

  renderHitSparks(c) {
    for (let s of this.hitSparks) {
      c.save();
      c.translate(s.x, s.y);
      const pr = s.age / s.maxAge;
      const alpha = 1.0 - pr;

      // Étoile de choc acérée DBZ Kai à 8 branches
      const branches = s.isCrit ? 8 : 6;
      const rExt = (35 + 80 * pr) * s.scale;
      const rInt = (8 + 15 * pr) * s.scale;

      c.fillStyle = s.color;
      c.globalAlpha = alpha * 0.85;
      c.beginPath();
      for (let i = 0; i < branches * 2; i++) {
        const ang = (Math.PI / branches) * i + s.age * 0.1;
        const r = (i % 2 === 0) ? rExt : rInt;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();

      // Cœur ardent blanc
      c.fillStyle = '#ffffff';
      c.globalAlpha = alpha;
      c.beginPath();
      c.arc(0, 0, rInt * 1.2, 0, Math.PI * 2);
      c.fill();

      // Double onde de choc sonique
      c.strokeStyle = '#ffffff';
      c.lineWidth = (3 * alpha + 1);
      c.beginPath();
      c.arc(0, 0, (20 + 90 * pr) * s.scale, 0, Math.PI * 2);
      c.stroke();

      c.restore();
    }
  }

  renderHUD(c) {
    if (!this.p1 || !this.p2) return;

    // Cartouche Joueur 1 (Gauche)
    this.renderFighterCard(c, this.p1, 60, 40, false);

    // Cartouche Joueur 2 / Boss (Droite)
    this.renderFighterCard(c, this.p2, this.width - 440, 40, true);

    // Titre central du mode
    c.save();
    c.font = 'bold 22px "Cinzel", "Outfit", sans-serif';
    c.textAlign = 'center';
    c.fillStyle = '#fbbf24';
    c.shadowColor = 'rgba(251, 191, 36, 0.8)';
    c.shadowBlur = 10;
    const modeLabels = {
      histoire: 'MODE HISTOIRE — CHANT DES ORIGINES',
      eclair: '⚡ MORT SUBITE — 300% DÉGÂTS ⚡',
      titan: '☠ DÉFI TITAN COLOSSE ☠',
      survie: 'SURVIE VAGUES CÉLESTES',
      versus: 'DUEL VERSUS CÉLESTE'
    };
    c.fillText(modeLabels[this.mode] || 'SKYCHORD COMBAT', this.width / 2, 45);
    c.restore();
  }

  renderFighterCard(c, f, x, y, isRight) {
    c.save();
    const w = 380;
    const h = 55;

    // Fond verre sombre et cadre d'or
    c.fillStyle = 'rgba(15, 10, 30, 0.85)';
    c.strokeStyle = f.data.accent;
    c.lineWidth = 3;
    c.beginPath();
    c.roundRect(x, y, w, h, 8);
    c.fill();
    c.stroke();

    // Barre de PV
    const hpRatio = Math.max(0, f.hp / f.data.maxHp);
    const hpGrad = c.createLinearGradient(x, 0, x + w, 0);
    hpGrad.addColorStop(0, '#ef4444');
    hpGrad.addColorStop(0.5, '#f59e0b');
    hpGrad.addColorStop(1, '#10b981');
    c.fillStyle = hpGrad;
    c.beginPath();
    c.roundRect(x + 6, y + 24, (w - 12) * hpRatio, 24, 4);
    c.fill();

    // Nom et Pourcentage façon Smash / DBZ Kai
    c.font = 'bold 18px "Outfit", sans-serif';
    c.fillStyle = '#ffffff';
    c.textAlign = isRight ? 'right' : 'left';
    c.fillText(f.data.name, isRight ? x + w - 12 : x + 12, y + 18);

    c.font = '900 20px "JetBrains Mono", sans-serif';
    c.fillStyle = f.hp < f.data.maxHp * 0.3 ? '#ef4444' : '#fde047';
    c.textAlign = isRight ? 'left' : 'right';
    c.fillText(`${Math.round(f.damagePercent)}%`, isRight ? x + 12 : x + w - 12, y + 42);

    c.restore();
  }

  renderTouchControls(c) {
    // Ne dessine que si du tactile ou mobile est utilisé
    const btns = this.getButtons();

    // 1. Joystick gauche
    const jx = this.touch.joy.active ? this.touch.joy.startX : 160;
    const jy = this.touch.joy.active ? this.touch.joy.startY : 560;
    const jr = 65;

    c.save();
    c.fillStyle = 'rgba(15, 12, 35, 0.35)';
    c.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(jx, jy, jr, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Tête du stick
    const knobX = jx + this.touch.joy.dx * jr * 0.7;
    const knobY = jy + this.touch.joy.dy * jr * 0.7;
    c.fillStyle = 'rgba(251, 191, 36, 0.85)';
    c.beginPath();
    c.arc(knobX, knobY, 28, 0, Math.PI * 2);
    c.fill();
    c.restore();

    // 2. 5 Boutons droits ergonomiques
    for (let b of btns) {
      c.save();
      // Effet de verre
      c.fillStyle = 'rgba(15, 12, 35, 0.45)';
      c.strokeStyle = b.color;
      c.lineWidth = 3;
      c.beginPath();
      c.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Texte centré net
      c.font = `bold ${Math.round(b.r * 0.34)}px "Outfit", sans-serif`;
      c.fillStyle = '#ffffff';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(b.label, b.x, b.y);

      // Anneau dynamique de charge DBZ Kai sur FRAPPE
      if (b.id === 'attack' && this.touch.attackHold > 0) {
        const ratio = Math.min(1.0, this.touch.attackHold / 40);
        c.strokeStyle = this.touch.smashCharged ? '#22d3ee' : '#fbbf24';
        c.lineWidth = 5;
        c.beginPath();
        c.arc(b.x, b.y, b.r + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio);
        c.stroke();

        if (this.touch.smashCharged) {
          c.font = '900 16px "Outfit", sans-serif';
          c.fillStyle = '#22d3ee';
          c.fillText('MAX !', b.x, b.y - b.r - 14);
        }
      }
      c.restore();
    }
  }

  // Cinématique vidéo de l'Histoire (Letterboxing cinéma + dialogues anime)
  renderCinematic(c) {
    c.save();
    // Bandes noires de cinéma 2.39:1
    const barH = 85;
    c.fillStyle = '#000000';
    c.fillRect(0, 0, this.width, barH);
    c.fillRect(0, this.height - barH, this.width, barH);

    // Titre d'épisode façon Dragon Ball Z Kai
    if (this.cinematicFrame < 180) {
      c.font = 'bold 32px "Cinzel", serif';
      c.textAlign = 'center';
      c.fillStyle = '#fde047';
      c.shadowColor = 'rgba(253, 224, 71, 0.9)';
      c.shadowBlur = 18;
      c.fillText(this.cinematicTitle || '', this.width / 2, 60);
    }

    // Boîte de dialogue anime en bas
    c.fillStyle = 'rgba(15, 10, 30, 0.92)';
    c.strokeStyle = '#f59e0b';
    c.lineWidth = 3;
    c.beginPath();
    c.roundRect(140, this.height - 210, this.width - 280, 115, 10);
    c.fill();
    c.stroke();

    // Nom de l'orateur
    c.font = 'bold 20px "Outfit", sans-serif';
    c.fillStyle = '#38bdf8';
    c.textAlign = 'left';
    c.fillText(this.cinematicSpeaker, 165, this.height - 180);

    // Dialogue
    c.font = '18px "Outfit", sans-serif';
    c.fillStyle = '#ffffff';
    c.fillText(this.cinematicDialogue, 165, this.height - 145);

    // Bouton PASSER / Toucher pour continuer
    c.font = 'bold 15px "Outfit", sans-serif';
    c.fillStyle = '#f59e0b';
    c.textAlign = 'right';
    c.fillText('Toucher ou Espace pour continuer ▶', this.width - 165, this.height - 110);

    c.restore();
  }

  renderGameOver(c) {
    c.save();
    c.fillStyle = 'rgba(0, 0, 0, 0.75)';
    c.fillRect(0, 0, this.width, this.height);

    c.font = '900 64px "Cinzel", serif';
    c.textAlign = 'center';
    c.fillStyle = '#fbbf24';
    c.shadowColor = 'rgba(251, 191, 36, 1)';
    c.shadowBlur = 24;
    c.fillText('VICTOIRE !', this.width / 2, 300);

    c.font = 'bold 28px "Outfit", sans-serif';
    c.fillStyle = '#ffffff';
    c.shadowBlur = 0;
    c.fillText(`${this.winner ? this.winner.data.name : 'VAINQUEUR'} TRIOMPHE DU COMBAT !`, this.width / 2, 360);

    // Bouton rejouer
    c.fillStyle = '#ea580c';
    c.beginPath();
    c.roundRect(this.width / 2 - 130, 420, 260, 60, 30);
    c.fill();

    c.font = 'bold 20px "Outfit", sans-serif';
    c.fillStyle = '#ffffff';
    c.fillText('REJOUER LE COMBAT', this.width / 2, 458);
    c.restore();
  }

  renderMenu(c) {
    c.save();
    c.fillStyle = 'rgba(10, 5, 20, 0.9)';
    c.fillRect(0, 0, this.width, this.height);

    c.font = '900 52px "Cinzel", serif';
    c.textAlign = 'center';
    c.fillStyle = '#fbbf24';
    c.shadowColor = 'rgba(251, 191, 36, 0.9)';
    c.shadowBlur = 20;
    c.fillText('SKYCHORD : COMBAT CÉLESTE', this.width / 2, 160);

    c.font = '300 20px "Outfit", sans-serif';
    c.fillStyle = '#e2e8f0';
    c.shadowBlur = 0;
    c.fillText('Refonte Graphique Dragon Ball Z Kai • 5 Commandes Mobiles • Cinématiques', this.width / 2, 210);

    // Sélection des modes de jeu
    const modes = [
      { id: 'histoire', title: 'MODE HISTOIRE', desc: 'Cinématiques animées & combats épiques', col: '#f59e0b', x: 260, y: 300 },
      { id: 'eclair', title: '⚡ MORT SUBITE', desc: '300% de dégâts, tension mortelle', col: '#ef4444', x: 500, y: 300 },
      { id: 'titan', title: '☠ DÉFI TITAN', desc: 'Raid Boss colossal avec Super Armure', col: '#a855f7', x: 740, y: 300 },
      { id: 'versus', title: 'DUEL VERSUS', desc: 'Combat classique 1v1 contre l\'IA', col: '#06b6d4', x: 980, y: 300 }
    ];

    for (let m of modes) {
      c.fillStyle = 'rgba(20, 15, 40, 0.85)';
      c.strokeStyle = m.col;
      c.lineWidth = 3;
      c.beginPath();
      c.roundRect(m.x - 100, m.y, 200, 180, 12);
      c.fill();
      c.stroke();

      c.font = 'bold 20px "Outfit", sans-serif';
      c.fillStyle = m.col;
      c.fillText(m.title, m.x, m.y + 40);

      c.font = '14px "Outfit", sans-serif';
      c.fillStyle = '#94a3b8';
      c.fillText(m.desc, m.x, m.y + 80, 170);

      c.fillStyle = m.col;
      c.beginPath();
      c.roundRect(m.x - 65, m.y + 120, 130, 38, 19);
      c.fill();

      c.font = 'bold 15px "Outfit", sans-serif';
      c.fillStyle = '#ffffff';
      c.fillText('JOUER', m.x, m.y + 144);
    }

    c.restore();
  }
}

// ==========================================
// CLASSE FIGHTER (COMBATTANT ANIME KAI)
// ==========================================
class Fighter {
  constructor(data, x, y, facing = 1, isAi = false) {
    this.data = data;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.facing = facing;
    this.isAi = isAi;
    this.isTitan = !!data.isTitan;
    this.scale = data.scale || 1.0;

    // Dimensions
    this.w = 54 * this.scale;
    this.h = 105 * this.scale;

    // Stats de combat
    this.hp = data.maxHp;
    this.damagePercent = 0;
    this.onGround = false;
    this.jumpsLeft = 2;

    // États d'attaque
    this.isAttacking = false;
    this.attackTimer = 0;
    this.isSmashing = false;
    this.smashCharge = 0;
    this.isShielding = false;
    this.hitstun = 0;
    this.hitHasConnected = false;
  }

  move(dir) {
    if (this.hitstun > 0 || this.isShielding) return;
    this.vx = dir * this.data.speed;
    if (dir !== 0) this.facing = Math.sign(dir);
  }

  jump() {
    if (this.hitstun > 0 || this.isShielding) return;
    if (this.jumpsLeft > 0) {
      this.vy = this.data.jumpPower;
      this.jumpsLeft--;
      this.onGround = false;
    }
  }

  attack(game) {
    if (this.isAttacking || this.hitstun > 0 || this.isShielding) return;
    this.isAttacking = true;
    this.attackTimer = 16;
    this.isSmashing = false;
    this.hitHasConnected = false;
    game.audio.punch(false);
  }

  chargeSmash() {
    if (this.hitstun > 0 || this.isShielding) return;
    this.isAttacking = true;
    this.isSmashing = true;
    this.smashCharge = Math.min(1.0, this.smashCharge + 0.025);
  }

  releaseSmash(game) {
    if (!this.isSmashing) return;
    this.attackTimer = 24;
    this.isSmashing = true;
    this.hitHasConnected = false;
    game.audio.punch(true);
    // Impulsion vers l'avant lors du Smash
    this.vx = this.facing * 12;
    this.smashCharge = 0;
  }

  special(game) {
    if (this.isAttacking || this.hitstun > 0 || this.isShielding) return;
    this.isAttacking = true;
    this.attackTimer = 30;
    game.audio.kiBeam();

    // Émission du rayon d'énergie Ki
    game.projectiles.push({
      x: this.x + this.facing * 40,
      y: this.y - this.h * 0.55,
      vx: this.facing * 18,
      radius: this.isTitan ? 32 : 18,
      damage: this.isTitan ? 45 : 32,
      color: this.data.accent,
      owner: this,
      life: 65
    });
  }

  toggleShield(active) {
    if (this.hitstun > 0) return;
    this.isShielding = active;
  }

  grabOrBurst(game) {
    if (this.hitstun > 0) return;
    // Ki Burst d'onde de choc
    this.isAttacking = true;
    this.attackTimer = 20;
    game.audio.shield();
    game.addHitSpark(this.x, this.y - this.h * 0.5, this.data.accent, 2.0, true);
    
    // Repousse l'adversaire
    const opp = (this === game.p1) ? game.p2 : game.p1;
    if (opp && Math.abs(opp.x - this.x) < 140) {
      opp.takeDamage(15, this.facing * 18, -10, game, true);
    }
  }

  takeDamage(dmg, kbx, kby, game, isCrit = false) {
    if (this.isShielding) {
      game.audio.shield();
      return;
    }

    // Super armure du Titan colosse
    if (this.isTitan && this.data.superArmor) {
      kbx *= 0.45;
      kby *= 0.45;
      this.hitstun = Math.min(10, this.hitstun);
    } else {
      this.hitstun = isCrit ? 24 : 14;
    }

    this.hp -= dmg;
    this.damagePercent += dmg;
    this.vx = kbx;
    this.vy = kby;
    this.isAttacking = false;
    this.isSmashing = false;
  }

  getHitbox() {
    return {
      x: this.facing > 0 ? this.x : this.x - this.w * 1.5,
      y: this.y - this.h * 0.8,
      w: this.w * 1.5,
      h: this.h * 0.7
    };
  }

  getHurtbox() {
    return {
      x: this.x - this.w * 0.5,
      y: this.y - this.h,
      w: this.w,
      h: this.h
    };
  }

  update(game) {
    // Gravité
    this.vy += 0.95;
    this.x += this.vx;
    this.y += this.vy;

    // Ralentissement horizontal
    this.vx *= 0.85;

    // Collision sol (y = 560)
    const groundY = 560;
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.onGround = true;
      this.jumpsLeft = 2;
    } else {
      this.onGround = false;
    }

    // Limites arène
    if (this.x < 120) { this.x = 120; this.vx = 0; }
    if (this.x > 1160) { this.x = 1160; this.vx = 0; }

    if (this.attackTimer > 0) {
      this.attackTimer--;
      if (this.attackTimer === 0) {
        this.isAttacking = false;
        this.isSmashing = false;
      }
    }

    if (this.hitstun > 0) this.hitstun--;
  }

  // Rendu Cel-Shadé du combattant et Aura DBZ Kai
  render(c, time) {
    c.save();
    c.translate(this.x, this.y);

    // 1. Aura de Ki Flamboyante (Super Saiyan / Kaioken)
    const isCharging = this.isSmashing || (this.isAttacking && this.attackTimer > 15);
    const isAwakened = this.hp < this.data.maxHp * 0.3;

    if (isCharging || isAwakened) {
      this.renderKiAura(c, time, isAwakened);
    }

    // 2. Bouclier énergétique sphérique
    if (this.isShielding) {
      c.save();
      c.strokeStyle = '#38bdf8';
      c.fillStyle = 'rgba(56, 189, 248, 0.35)';
      c.lineWidth = 4;
      c.beginPath();
      c.arc(0, -this.h * 0.5, this.h * 0.65, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.restore();
    }

    // 3. Ombre portée au sol
    c.fillStyle = 'rgba(0, 0, 0, 0.45)';
    c.beginPath();
    c.ellipse(0, -2, this.w * 0.85, 10, 0, 0, Math.PI * 2);
    c.fill();

    // 4. Dessin du personnage cel-shadé avec trait d'encrage noir épais (2.5 px)
    c.scale(this.facing, 1);
    this.renderFighterBody(c, time);

    c.restore();
  }

  renderKiAura(c, time, isAwakened) {
    c.save();
    const auraCol = isAwakened ? '#ef4444' : this.data.accent;
    const heightAura = this.h * 1.35;
    const widthAura = this.w * 1.6;

    // Flammes montantes étirées
    for (let k = 0; k < 8; k++) {
      const ang = (Math.PI / 4) * k;
      const flicker = Math.sin(time * 0.3 + k) * 12;
      const flameH = -heightAura - (k % 2 === 0 ? 30 : 15) - flicker;

      c.fillStyle = (k % 2 === 0) ? auraCol : 'rgba(255, 255, 255, 0.75)';
      c.globalAlpha = 0.55;
      c.beginPath();
      c.moveTo(-widthAura * 0.5, 0);
      c.quadraticCurveTo(Math.cos(ang) * widthAura, flameH * 0.6, 0, flameH);
      c.quadraticCurveTo(-Math.cos(ang) * widthAura, flameH * 0.6, widthAura * 0.5, 0);
      c.fill();
    }

    // Arcs électriques Super Saiyan 2
    c.strokeStyle = '#e0f2fe';
    c.lineWidth = 2.5;
    for (let e = 0; e < 3; e++) {
      const ey = -Math.random() * heightAura;
      c.beginPath();
      c.moveTo(-widthAura * 0.5, ey);
      c.lineTo(-widthAura * 0.2, ey - 15);
      c.lineTo(widthAura * 0.2, ey - 5);
      c.lineTo(widthAura * 0.5, ey - 20);
      c.stroke();
    }
    c.restore();
  }

  renderFighterBody(c, time) {
    const w = this.w;
    const h = this.h;

    c.save();
    // Contour cel-shading manga noir 3px
    c.strokeStyle = '#050308';
    c.lineWidth = 3.5;
    c.lineJoin = 'miter';

    // Jambes
    c.fillStyle = this.data.giColor;
    c.beginPath();
    c.roundRect(-w * 0.45, -h * 0.45, w * 0.38, h * 0.45, 4);
    c.roundRect(w * 0.05, -h * 0.45, w * 0.38, h * 0.45, 4);
    c.fill();
    c.stroke();

    // Torse / Gi
    c.fillStyle = this.data.giColor;
    c.beginPath();
    c.roundRect(-w * 0.45, -h * 0.78, w * 0.9, h * 0.38, 6);
    c.fill();
    c.stroke();

    // Tête
    c.fillStyle = '#fde68a'; // Teint chair anime
    c.beginPath();
    c.arc(0, -h * 0.88, w * 0.34, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Cheveux anime flamboyants (Super Saiyan)
    c.fillStyle = this.data.hairColor;
    c.beginPath();
    c.moveTo(-w * 0.4, -h * 0.9);
    c.lineTo(-w * 0.7, -h * 1.15);
    c.lineTo(-w * 0.2, -h * 1.05);
    c.lineTo(0, -h * 1.3);
    c.lineTo(w * 0.2, -h * 1.05);
    c.lineTo(w * 0.7, -h * 1.15);
    c.lineTo(w * 0.4, -h * 0.9);
    c.closePath();
    c.fill();
    c.stroke();

    // Bras en position de frappe
    if (this.isAttacking) {
      c.fillStyle = this.data.giColor;
      c.beginPath();
      c.roundRect(w * 0.2, -h * 0.72, w * 0.8, h * 0.2, 4);
      c.fill();
      c.stroke();

      // Poing étincelant
      c.fillStyle = this.data.accent;
      c.beginPath();
      c.arc(w * 1.05, -h * 0.62, w * 0.22, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }

    c.restore();
  }
}

// Initialisation globale
window.SkyChordGame = SkyChordGame;
