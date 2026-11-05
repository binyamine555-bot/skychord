/**
 * SKYCHORD: COMBAT CÉLESTE — ROSTER OFFICIEL DE 24 COMBATTANTS MANGA ORIGINAUX
 * 
 * - Qualité Graphique Manga DBZ Kai :
 *   Encrage cel-shading noir 3.5px, visages anime expressifs (yeux effilés, iris colorés, reflets spéculaires),
 *   anatomies et coiffures uniques, auras de Ki flamboyantes ascendantes, éclairs SSJ2 et étoiles d'impact à 8 branches.
 * 
 * - 24 Combattants Célestes Originaux aux Styles et Movesets Distincts :
 *   1. SOLA (Zénith Solaire)          13. TERRAX (Astéroïdes & Pierre)
 *   2. AETHER (Dieu de la Foudre)     14. VESPERA (Aurore Boréale)
 *   3. NOX (Ombre du Silence)         15. SOLIAN (Paladin Solaire)
 *   4. TITAN KRONOS (Raid Boss)       16. MORTEX (Faucheur Stellaire)
 *   5. ZEPHYRA (Vents Célestes)       17. KAIROS (Flux Temporels)
 *   6. IGNIS (Flammes Astrales)       18. AQUILON (Faucon Céleste)
 *   7. GLACIA (Reine des Comètes)     19. UMBRA (Crépuscule Furtif)
 *   8. ORION (Chasseur d'Étoiles)     20. SERAPH (Archange Céleste)
 *   9. LYRA (Valkyrie du Chœur)       21. VULCAN (Forge Magmatique)
 *   10. DRAKOS (Dragon Cosmique)      22. CHRONOS ALPHA (Boss Suprême)
 *   11. NEBULA (Poussière Cosmique)   23. ASTRA (Prêtresse Nébuleuse)
 *   12. VOLTIS (Moine Foudroyant)     24. KAGE MARU (Shinobi Lunaire)
 * 
 * - Système de Gameplay Complet :
 *   • Combo normal 3 coups unique à chaque combattant (Tap FRAPPE).
 *   • Coup Smash chargé avec jauge circulaire de Ki et déflagration "MAX !" (Maintien FRAPPE).
 *   • Tir / Attaque à distance spécifique avec trajectoire et physique propres (Bouton TIR SPÉ).
 *   • Attaque aérienne plongeante / tournoyante (Saut + Frappe).
 *   • Prise brise-garde & Parade Parfaite (Just-Guard sur GARDE avec contre garanti).
 *   • Jauge d'Harmonie Céleste & Déchaînement ULTRA cinématique manga.
 *   • Commandes tactiles mobiles adaptées à 5 boutons ergonomiques.
 */

// ==========================================
// 1. MOTEUR AUDIO HARMONIQUE WEB AUDIO API
// ==========================================
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

  punch(type = 'normal', isCrit = false) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'electric') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.18);
    } else if (type === 'void') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.22);
    } else if (type === 'rock') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(25, t + 0.28);
    } else if (type === 'flame') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.2);
    } else if (type === 'crystal') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(340, t + 0.16);
    } else if (type === 'wind') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.15);
    } else {
      osc.type = isCrit ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(isCrit ? 170 : 250, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + (isCrit ? 0.24 : 0.12));
    }

    gain.gain.setValueAtTime(isCrit ? 0.85 : 0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + (isCrit ? 0.24 : 0.12));
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + (isCrit ? 0.26 : 0.14));

    if (isCrit) {
      const bSize = Math.floor(this.ctx.sampleRate * 0.2);
      const buffer = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bSize * 0.25));
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.65, t);
      nGain.gain.linearRampToValueAtTime(0.01, t + 0.2);
      noise.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(t);
    }
  }

  kiCharge(ratio) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160 + ratio * 380, t);
    gain.gain.setValueAtTime(0.16 * ratio, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  projectileSound(type) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'beam' || type === 'holy') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.linearRampToValueAtTime(320, t + 0.35);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    } else if (type === 'lightning') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.25);
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    } else if (type === 'void') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, t);
      osc.frequency.linearRampToValueAtTime(290, t + 0.45);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    } else if (type === 'crystal') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.2);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    } else if (type === 'wind' || type === 'arrow') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.2);
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, t);
      osc.frequency.exponentialRampToValueAtTime(28, t + 0.5);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  shield(isParry = false) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isParry ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isParry ? 1200 : 700, t);
    osc.frequency.exponentialRampToValueAtTime(isParry ? 1800 : 1100, t + 0.2);
    gain.gain.setValueAtTime(isParry ? 0.75 : 0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + (isParry ? 0.32 : 0.18));
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + (isParry ? 0.35 : 0.2));
  }

  ultraSwarm() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [440, 554, 659, 880, 1108].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);
      gain.gain.setValueAtTime(0.24, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.85);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.04);
      osc.stop(t + 0.9);
    });
  }
}

// ==========================================
// 2. LE ROSTER COMPLET DES 24 COMBATTANTS
// ==========================================
const FIGHTERS_DATA = {
  // 1. SOLA
  sola: {
    id: 'sola',
    name: 'SOLA',
    title: 'Guerrière Solaire du Zénith',
    archetype: 'Équilibrée • Pression & Supernova',
    color: '#f59e0b', accent: '#fbbf24', auraColor: 'rgba(251, 191, 36, 0.9)',
    hairColor: '#fde047', hairShadow: '#d97706', giColor: '#ea580c', giShadow: '#9a3412',
    sashColor: '#dc2626', skinColor: '#fde68a', skinShadow: '#fcd34d', eyeColor: '#f59e0b',
    hairType: 'spiky', bodyType: 'standard', speed: 7.5, dashSpeed: 17, jumpPower: -16.5, maxHp: 200,
    shotType: 'beam', soundType: 'normal',
    moves: {
      combo: ['Jab Solaire', 'Double Coup Zénith', 'Rising Sol Uppercut'],
      smash: 'GIGA SMASH SOLAIRE (Supernova)', special: 'RAYON SOLAIRE NOVA (Laser perçant)',
      air: 'Météore Solaire Plongeant', grab: 'Projection Solaire & Déflagration',
      ultra: 'ÉVEIL SUPRÊME : CHANT DU SOLEIL'
    }
  },
  // 2. AETHER
  aether: {
    id: 'aether',
    name: 'AETHER',
    title: 'Dieu Céleste de la Foudre',
    archetype: 'Vitesse Éclair • Téléportations & Arcs SSJ2',
    color: '#06b6d4', accent: '#38bdf8', auraColor: 'rgba(34, 211, 238, 0.9)',
    hairColor: '#e0f2fe', hairShadow: '#7dd3fc', giColor: '#0f172a', giShadow: '#020617',
    sashColor: '#0284c7', skinColor: '#fed7aa', skinShadow: '#fdba74', eyeColor: '#06b6d4',
    hairType: 'swept', bodyType: 'speed', speed: 8.8, dashSpeed: 21, jumpPower: -17.5, maxHp: 185,
    shotType: 'lightning', soundType: 'electric',
    moves: {
      combo: ['Frappe Tonnerre', 'Coude Foudroyant', 'Volt Kick Électrostatique'],
      smash: 'RAIKIRI FOUDROYANT (Perce-Éclair)', special: '3 LANCES DE FOUDRE RAIJIN',
      air: 'Volt Drill Aérien Tournoyant', grab: 'Suplex Foudroyant Haute Tension',
      ultra: 'JUGEMENT DIVIN DU TEMPLE DE L\'ÉCLAIR'
    }
  },
  // 3. NOX
  nox: {
    id: 'nox',
    name: 'NOX',
    title: 'Ombre Astrale du Silence',
    archetype: 'Ruse & Gravité • Lames du Néant',
    color: '#8b5cf6', accent: '#c084fc', auraColor: 'rgba(168, 85, 247, 0.9)',
    hairColor: '#2e1065', hairShadow: '#1e1b4b', giColor: '#1e1b4b', giShadow: '#090514',
    sashColor: '#7c3aed', skinColor: '#f1f5f9', skinShadow: '#cbd5e1', eyeColor: '#a855f7',
    hairType: 'cowl', bodyType: 'standard', speed: 8.0, dashSpeed: 18, jumpPower: -16.0, maxHp: 195,
    shotType: 'void', soundType: 'void',
    moves: {
      combo: ['Lame du Néant', 'Tranchant Spectral', 'Eclipse Spin Nova'],
      smash: 'FAUX DE L\'ÉCLIPSE (Tranchant du vide)', special: 'SINGULARITÉ DU NÉANT (Attraction)',
      air: 'Chute de l\'Ombre Perforante', grab: 'Substitution & Déchirure Astrale',
      ultra: 'EFFONDREMENT TOTAL DU TROU NOIR'
    }
  },
  // 4. KRONOS TITAN
  titan: {
    id: 'titan',
    name: 'TITAN KRONOS',
    title: 'Colosse Primordial des Origines',
    archetype: 'Poids Lourd • Super Armure & Séismes',
    color: '#dc2626', accent: '#f87171', auraColor: 'rgba(239, 68, 68, 0.95)',
    hairColor: '#450a0a', hairShadow: '#1c1917', giColor: '#1c1917', giShadow: '#0a0a0a',
    sashColor: '#991b1b', skinColor: '#78716c', skinShadow: '#44403c', eyeColor: '#ef4444',
    isTitan: true, scale: 2.15, superArmor: true, hairType: 'helmet', bodyType: 'heavy',
    speed: 5.0, dashSpeed: 11, jumpPower: -14.2, maxHp: 480, shotType: 'rock', soundType: 'rock',
    moves: {
      combo: ['Poing Sismique', 'Revers Magmatique', 'Fracas Colossal au Sol'],
      smash: 'ÉCRASEMENT TITANESQUE (Double choc)', special: 'MÉTÉORE DE ROCHE VOLCANIQUE',
      air: 'Séisme Terrestre Colossal', grab: 'Étreinte Broyeuse & Projection',
      ultra: 'CATACLYSME TELLURIQUE MONDIAL'
    }
  },
  // 5. ZEPHYRA
  zephyra: {
    id: 'zephyra',
    name: 'ZEPHYRA',
    title: 'Danseuse des Vents Stratosphériques',
    archetype: 'Vitesse Aérienne • Tornades & Esquives',
    color: '#10b981', accent: '#34d399', auraColor: 'rgba(52, 211, 153, 0.85)',
    hairColor: '#a7f3d0', hairShadow: '#059669', giColor: '#064e3b', giShadow: '#022c22',
    sashColor: '#10b981', skinColor: '#fef3c7', skinShadow: '#fde68a', eyeColor: '#10b981',
    hairType: 'swept', bodyType: 'speed', speed: 9.0, dashSpeed: 22, jumpPower: -18.0, maxHp: 180,
    shotType: 'wind', soundType: 'wind',
    moves: {
      combo: ['Bise Tranchante', 'Tourbillon Vif', 'Cyclone Ascendant'],
      smash: 'LAME TYPHON (Rafale supersonique)', special: 'TORNADE D\'ÉMERAUDE',
      air: 'Spirale Céleste Descendante', grab: 'Projection Cyclonique',
      ultra: 'OURAGAN DU CHŒUR DES ÉTOILES'
    }
  },
  // 6. IGNIS
  ignis: {
    id: 'ignis',
    name: 'IGNIS',
    title: 'Maître des Flammes Astrales',
    archetype: 'Attaque Furieuse • Brûlures & Éruptions',
    color: '#f97316', accent: '#fb923c', auraColor: 'rgba(251, 146, 60, 0.9)',
    hairColor: '#ef4444', hairShadow: '#991b1b', giColor: '#7c2d12', giShadow: '#431407',
    sashColor: '#ea580c', skinColor: '#fed7aa', skinShadow: '#fdba74', eyeColor: '#f97316',
    hairType: 'spiky', bodyType: 'standard', speed: 7.6, dashSpeed: 17, jumpPower: -16.5, maxHp: 205,
    shotType: 'flame', soundType: 'flame',
    moves: {
      combo: ['Poing Flamboyant', 'Balayage Incandescent', 'Éruption Solaire'],
      smash: 'IMPACT PYROCLASTIQUE', special: 'BOULE DE BRAISE ASTRALE',
      air: 'Plongeon du Phénix Ardent', grab: 'Fournaise Corporelle',
      ultra: 'SUPERNOVA PRIMORDIALE'
    }
  },
  // 7. GLACIA
  glacia: {
    id: 'glacia',
    name: 'GLACIA',
    title: 'Reine des Comètes Cristallines',
    archetype: 'Zone & Contrôle • Piques de Givre',
    color: '#38bdf8', accent: '#7dd3fc', auraColor: 'rgba(125, 211, 252, 0.9)',
    hairColor: '#f0f9ff', hairShadow: '#38bdf8', giColor: '#0c4a6e', giShadow: '#082f49',
    sashColor: '#0284c7', skinColor: '#e0f2fe', skinShadow: '#bae6fd', eyeColor: '#0284c7',
    hairType: 'long', bodyType: 'standard', speed: 7.2, dashSpeed: 16, jumpPower: -16.0, maxHp: 195,
    shotType: 'crystal', soundType: 'crystal',
    moves: {
      combo: ['Stalactite Rapide', 'Gifle de Verre', 'Pointe Zéro Absolu'],
      smash: 'AVALANCHE STELLAIRE', special: '3 LANCES DE COMÈTE DE GIVRE',
      air: 'Miroir de Glace Plongeant', grab: 'Enclave de Cristaux',
      ultra: 'GLACIATION DU COSMOS'
    }
  },
  // 8. ORION
  orion: {
    id: 'orion',
    name: 'ORION',
    title: 'Chasseur des Constellations',
    archetype: 'Distance & Précision • Flèches de Lumière',
    color: '#eab308', accent: '#fde047', auraColor: 'rgba(253, 224, 71, 0.85)',
    hairColor: '#713f12', hairShadow: '#422006', giColor: '#1e293b', giShadow: '#0f172a',
    sashColor: '#ca8a04', skinColor: '#fde68a', skinShadow: '#fcd34d', eyeColor: '#eab308',
    hairType: 'short', bodyType: 'speed', speed: 8.2, dashSpeed: 19, jumpPower: -17.0, maxHp: 190,
    shotType: 'arrow', soundType: 'arrow',
    moves: {
      combo: ['Coup d\'Arc Court', 'Flèche de Pied', 'Tir Perforant Zénith'],
      smash: 'FLÈCHE ÉTOILÉE DU CENTAURE', special: 'TRAIT DE LUMIÈRE STELLAIRE',
      air: 'Pluie de Météores Fléchée', grab: 'Entrave Astrale & Tir Point-Blanc',
      ultra: 'PLUIE COSMIQUE DES CONSTELLATIONS'
    }
  },
  // 9. LYRA
  lyra: {
    id: 'lyra',
    name: 'VALKYRIE LYRA',
    title: 'Protectrice du Chœur Céleste',
    archetype: 'Polyvalente • Épée Harmonique & Ailes',
    color: '#ec4899', accent: '#f472b6', auraColor: 'rgba(244, 114, 182, 0.9)',
    hairColor: '#fdf2f8', hairShadow: '#f472b6', giColor: '#831843', giShadow: '#500724',
    sashColor: '#db2777', skinColor: '#fdf2f8', skinShadow: '#fce7f3', eyeColor: '#ec4899',
    hairType: 'long', bodyType: 'standard', speed: 8.1, dashSpeed: 18, jumpPower: -17.5, maxHp: 200,
    shotType: 'holy', soundType: 'holy',
    moves: {
      combo: ['Entaille d\'Accords', 'Tranchant Lyrique', 'Vole de la Valkyrie'],
      smash: 'LAME D\'HARMONIE PARFAITE', special: 'CHOC D\'ONDE SONORE SACRÉE',
      air: 'Descente des Ailes Célestes', grab: 'Arrachage Lyrique',
      ultra: 'SYMPHONIE DES VALKYRIES CÉLESTES'
    }
  },
  // 10. DRAKOS
  drakos: {
    id: 'drakos',
    name: 'DRAKOS',
    title: 'Berserker des Étoiles Mortes',
    archetype: 'Brutalité & Griffes • Plasma Draconique',
    color: '#991b1b', accent: '#f87171', auraColor: 'rgba(248, 113, 113, 0.95)',
    hairColor: '#18181b', hairShadow: '#09090b', giColor: '#450a0a', giShadow: '#1c1917',
    sashColor: '#b91c1c', skinColor: '#a1a1aa', skinShadow: '#71717a', eyeColor: '#dc2626',
    hairType: 'horns', bodyType: 'heavy', scale: 1.3, speed: 6.8, dashSpeed: 15, jumpPower: -16.0, maxHp: 240,
    shotType: 'flame', soundType: 'flame',
    moves: {
      combo: ['Griffe Draconique', 'Revers de Queue', 'Morsure du Vide'],
      smash: 'ÉCRASEMENT DU DRAGON NOIR', special: 'SOUFFLE DE PLASMA SOLAIRE',
      air: 'Plongeon Draconique Féroce', grab: 'Broyeur de Dragon & Projection',
      ultra: 'COLÈRE DU DRAGON DE L\'APOCALYPSE'
    }
  },
  // 11. NEBULA
  nebula: {
    id: 'nebula',
    name: 'NEBULA',
    title: 'Sorcière des Poussières Cosmiques',
    archetype: 'Illusions & Magie • Dédoublements',
    color: '#a855f7', accent: '#d8b4fe', auraColor: 'rgba(216, 180, 254, 0.9)',
    hairColor: '#581c87', hairShadow: '#3b0764', giColor: '#3b0764', giShadow: '#1e1b4b',
    sashColor: '#9333ea', skinColor: '#faf5ff', skinShadow: '#e9d5ff', eyeColor: '#a855f7',
    hairType: 'long', bodyType: 'speed', speed: 7.9, dashSpeed: 18, jumpPower: -16.8, maxHp: 185,
    shotType: 'crystal', soundType: 'crystal',
    moves: {
      combo: ['Éclat Nébuleux', 'Danse des Poussières', 'Prisme Éthéré'],
      smash: 'EXPLOSION D\'AMÉTHYSTE ASTRALE', special: 'PLUIE D\'ÉTOILES FILANTES',
      air: 'Chute de Poussière Cosmique', grab: 'Illusion Miroir & Détonation',
      ultra: 'VORTEX DE LA NÉBULEUSE PRIMORDIALE'
    }
  },
  // 12. VOLTIS
  voltis: {
    id: 'voltis',
    name: 'VOLTIS',
    title: 'Moine du Tonnerre Sacré',
    archetype: 'Arts Martiaux Foudroyants • Enchaînements',
    color: '#0284c7', accent: '#38bdf8', auraColor: 'rgba(56, 189, 248, 0.9)',
    hairColor: '#0369a1', hairShadow: '#075985', giColor: '#0c4a6e', giShadow: '#082f49',
    sashColor: '#38bdf8', skinColor: '#fed7aa', skinShadow: '#fdba74', eyeColor: '#38bdf8',
    hairType: 'spiky', bodyType: 'standard', speed: 8.4, dashSpeed: 20, jumpPower: -17.2, maxHp: 195,
    shotType: 'lightning', soundType: 'electric',
    moves: {
      combo: ['Paume Électrique', 'Pied Tonnerre', 'Choc de Foudre Sacrée'],
      smash: 'POING DU DIEU DE LA FOUDRE', special: 'ORBE ÉLECTROSTATIQUE',
      air: 'Écrasement Électrique Plongeant', grab: 'Prise Volt Haute Puissance',
      ultra: 'DÉCHAÎNEMENT DES MILLE ÉCLAIRS'
    }
  },
  // 13. TERRAX
  terrax: {
    id: 'terrax',
    name: 'TERRAX',
    title: 'Gardien des Astéroïdes',
    archetype: 'Défense Tectonique • Blocs de Pierre',
    color: '#84cc16', accent: '#a3e635', auraColor: 'rgba(163, 230, 53, 0.85)',
    hairColor: '#3f6212', hairShadow: '#1a2e05', giColor: '#365314', giShadow: '#14532d',
    sashColor: '#65a30d', skinColor: '#a1a1aa', skinShadow: '#71717a', eyeColor: '#84cc16',
    hairType: 'helmet', bodyType: 'heavy', scale: 1.4, superArmor: true,
    speed: 5.6, dashSpeed: 12, jumpPower: -14.8, maxHp: 260, shotType: 'rock', soundType: 'rock',
    moves: {
      combo: ['Coup de Basalte', 'Balayage Rocheux', 'Séisme de Pierre'],
      smash: 'ÉBOULEMENT ASTRONOMIQUE', special: 'BLOC D\'ASTÉROÏDE CÉLESTE',
      air: 'Météore de Calcite Plongeant', grab: 'Pétrification & Lancer Lourd',
      ultra: 'BOUCLIER MONDIAL TECTONIQUE'
    }
  },
  // 14. VESPERA
  vespera: {
    id: 'vespera',
    name: 'VESPERA',
    title: 'Voleuse des Aurores Boréales',
    archetype: 'Furtivité & Poignards • Téléportation',
    color: '#06b6d4', accent: '#22d3ee', auraColor: 'rgba(34, 211, 238, 0.9)',
    hairColor: '#164e63', hairShadow: '#083344', giColor: '#0e7490', giShadow: '#155e75',
    sashColor: '#06b6d4', skinColor: '#f0fdfa', skinShadow: '#ccfbf1', eyeColor: '#06b6d4',
    hairType: 'cowl', bodyType: 'speed', speed: 8.9, dashSpeed: 21, jumpPower: -17.8, maxHp: 180,
    shotType: 'wind', soundType: 'wind',
    moves: {
      combo: ['Dague Boréale', 'Double Estocade', 'Flash du Crépuscule'],
      smash: 'DANSE DES OMBRES POLAIRES', special: 'DAGUES DE GLACE PRISMATIQUES',
      air: 'Plongeon du Silence Arctique', grab: 'Disparition & Frappe Nuque',
      ultra: 'AURORE BORÉALE ANÉANTISSANTE'
    }
  },
  // 15. SOLIAN
  solian: {
    id: 'solian',
    name: 'SOLIAN',
    title: 'Paladin du Rayon d\'Or',
    archetype: 'Honneur & Allonge • Hallebarde Solaire',
    color: '#eab308', accent: '#fef08a', auraColor: 'rgba(254, 240, 138, 0.9)',
    hairColor: '#ca8a04', hairShadow: '#854d0e', giColor: '#713f12', giShadow: '#422006',
    sashColor: '#eab308', skinColor: '#fef9c3', skinShadow: '#fef08a', eyeColor: '#eab308',
    hairType: 'helmet', bodyType: 'standard', speed: 7.4, dashSpeed: 16, jumpPower: -16.2, maxHp: 215,
    shotType: 'beam', soundType: 'holy',
    moves: {
      combo: ['Estoc du Chevalier', 'Taille Dorée', 'Balayage Solaire'],
      smash: 'POINTE DU SOLEIL LEVANT', special: 'LAME D\'ÉNERGIE RADIATIVE',
      air: 'Percée Céleste Verticale', grab: 'Jugement du Bouclier d\'Or',
      ultra: 'CHÂTIMENT DU SOLEIL PRIMORDIAL'
    }
  },
  // 16. MORTEX
  mortex: {
    id: 'mortex',
    name: 'MORTEX',
    title: 'Faucheur des Supernovas Noires',
    archetype: 'Faux Céleste • Vampirisme & Âmes',
    color: '#475569', accent: '#94a3b8', auraColor: 'rgba(148, 163, 184, 0.85)',
    hairColor: '#0f172a', hairShadow: '#020617', giColor: '#1e293b', giShadow: '#0f172a',
    sashColor: '#64748b', skinColor: '#e2e8f0', skinShadow: '#cbd5e1', eyeColor: '#ef4444',
    hairType: 'helmet', bodyType: 'standard', speed: 7.7, dashSpeed: 17, jumpPower: -16.4, maxHp: 210,
    shotType: 'void', soundType: 'void',
    moves: {
      combo: ['Tranchant Spectral', 'Moisson de Givre', 'Faux du Destin'],
      smash: 'FAUCHE DE L\'ÉTERNITÉ', special: 'CRÂNE D\'ÉNERGIE NOIRE',
      air: 'Plongeon de la Mort Silencieuse', grab: 'Absorption Vitale & Éjection',
      ultra: 'CATACLYSME DES SUPERNOVAS NOIRES'
    }
  },
  // 17. KAIROS
  kairos: {
    id: 'kairos',
    name: 'KAIROS',
    title: 'Maître des Flux Temporels',
    archetype: 'Distorsion & Timing • Frappes en Différé',
    color: '#14b8a6', accent: '#2dd4bf', auraColor: 'rgba(45, 212, 191, 0.9)',
    hairColor: '#0f766e', hairShadow: '#115e59', giColor: '#134e4a', giShadow: '#042f2e',
    sashColor: '#14b8a6', skinColor: '#ccfbf1', skinShadow: '#99f6e4', eyeColor: '#14b8a6',
    hairType: 'swept', bodyType: 'speed', speed: 8.3, dashSpeed: 19, jumpPower: -17.0, maxHp: 190,
    shotType: 'wind', soundType: 'normal',
    moves: {
      combo: ['Frappe Chrono', 'Attaque en Écho', 'Rupture Temporelle'],
      smash: 'IMPACT DU SABLIER COSMIQUE', special: 'ANNEAU DE TEMPS SUSPENDU',
      air: 'Piquée Temporelle Synchrone', grab: 'Téléportation Passée & Frappe',
      ultra: 'ARRÊT DU TEMPS DE L\'UNIVERS'
    }
  },
  // 18. AQUILON
  aquilon: {
    id: 'aquilon',
    name: 'AQUILON',
    title: 'Faucon Céleste du Grand Nord',
    archetype: 'Domination Aérienne • Plumes d\'Acier',
    color: '#0284c7', accent: '#38bdf8', auraColor: 'rgba(56, 189, 248, 0.85)',
    hairColor: '#e0f2fe', hairShadow: '#bae6fd', giColor: '#0369a1', giShadow: '#075985',
    sashColor: '#0284c7', skinColor: '#fed7aa', skinShadow: '#fdba74', eyeColor: '#0284c7',
    hairType: 'swept', bodyType: 'speed', speed: 8.7, dashSpeed: 21, jumpPower: -18.2, maxHp: 185,
    shotType: 'wind', soundType: 'wind',
    moves: {
      combo: ['Serre Aérienne', 'Aile Supersonique', 'Piqué de Faucon'],
      smash: 'PERCÉE DU BEC D\'ACIER', special: 'SALVE DE PLUMES TRANCHANTES',
      air: 'Piquée Foudroyante du Rapace', grab: 'Enlèvement Céleste & Écrasement',
      ultra: 'TEMPETE DU FAUCON STRATOSPHÉRIQUE'
    }
  },
  // 19. UMBRA
  umbra: {
    id: 'umbra',
    name: 'UMBRA',
    title: 'Assassin du Crépuscule',
    archetype: 'Contre-Attaque Furtive • Dagues Obscures',
    color: '#6366f1', accent: '#818cf8', auraColor: 'rgba(129, 140, 248, 0.9)',
    hairColor: '#312e81', hairShadow: '#1e1b4b', giColor: '#1e1b4b', giShadow: '#0f172a',
    sashColor: '#4f46e5', skinColor: '#e0e7ff', skinShadow: '#c7d2fe', eyeColor: '#6366f1',
    hairType: 'cowl', bodyType: 'speed', speed: 8.5, dashSpeed: 20, jumpPower: -17.2, maxHp: 190,
    shotType: 'void', soundType: 'void',
    moves: {
      combo: ['Entaille Obscure', 'Poignard de Brume', 'Tornade Crépusculaire'],
      smash: 'LAME DANS L\'OMBRE', special: 'SHURIKEN DE MATIÈRE NOIRE',
      air: 'Chute de l\'Ombre Fatale', grab: 'Prise Fantôme & Frappe Arrière',
      ultra: 'NÉANTISSEMENT DU CRÉPUSCULE TOTAL'
    }
  },
  // 20. SERAPH
  seraph: {
    id: 'seraph',
    name: 'SERAPH',
    title: 'Archange de la Rédemption',
    archetype: 'Lumière Prismatique • Piliers Sacrés',
    color: '#fbbf24', accent: '#fef08a', auraColor: 'rgba(254, 240, 138, 0.95)',
    hairColor: '#ffffff', hairShadow: '#fef08a', giColor: '#78350f', giShadow: '#451a03',
    sashColor: '#fbbf24', skinColor: '#fffbeb', skinShadow: '#fef3c7', eyeColor: '#38bdf8',
    hairType: 'long', bodyType: 'standard', speed: 7.8, dashSpeed: 17, jumpPower: -17.5, maxHp: 210,
    shotType: 'holy', soundType: 'holy',
    moves: {
      combo: ['Glaive de Lumière', 'Éclat Angélique', 'Frappe Séraphique'],
      smash: 'PILIER DU JUGEMENT SACRÉ', special: 'RAYON DE GRÂCE DIVINE',
      air: 'Descente des Six Ailes', grab: 'Purification Sacrée & Projection',
      ultra: 'JUGEMENT SUPRÊME DU SÉRAPHIN'
    }
  },
  // 21. VULCAN
  vulcan: {
    id: 'vulcan',
    name: 'VULCAN',
    title: 'Forge-Monde Magmatique',
    archetype: 'Marteau Lourd • Scories & Fusion',
    color: '#ea580c', accent: '#fb923c', auraColor: 'rgba(251, 146, 60, 0.95)',
    hairColor: '#7c2d12', hairShadow: '#431407', giColor: '#292524', giShadow: '#1c1917',
    sashColor: '#ea580c', skinColor: '#d6d3d1', skinShadow: '#a8a29e', eyeColor: '#ea580c',
    hairType: 'helmet', bodyType: 'heavy', scale: 1.35, superArmor: true,
    speed: 5.8, dashSpeed: 13, jumpPower: -15.0, maxHp: 250, shotType: 'rock', soundType: 'rock',
    moves: {
      combo: ['Coup de Masse', 'Écrasement d\'Enclume', 'Onde de Fusion'],
      smash: 'MARTEAU DU CŒUR DE LA TERRE', special: 'SCORIE DE FUSION BRÛLANTE',
      air: 'Chute Lourde de la Forge', grab: 'Prise de Fer Chaud & Projection',
      ultra: 'ÉRUPTION DE LA FORGE-MONDE'
    }
  },
  // 22. CHRONOS ALPHA
  chronos: {
    id: 'chronos',
    name: 'CHRONOS ALPHA',
    title: 'Entité Suprême des Origines',
    archetype: 'Boss Ultime Débloqué • Distorsions Dimensionnelles',
    color: '#6366f1', accent: '#f43f5e', auraColor: 'rgba(244, 63, 94, 0.95)',
    hairColor: '#ffffff', hairShadow: '#f43f5e', giColor: '#18181b', giShadow: '#09090b',
    sashColor: '#6366f1', skinColor: '#f4f4f5', skinShadow: '#e4e4e7', eyeColor: '#f43f5e',
    hairType: 'horns', bodyType: 'heavy', scale: 1.3, speed: 8.2, dashSpeed: 19, jumpPower: -17.0, maxHp: 320,
    shotType: 'beam', soundType: 'void',
    moves: {
      combo: ['Fissure d\'Éther', 'Choc Cosmique', 'Rupture Spatio-Temporelle'],
      smash: 'ANÉANTISSEMENT DES DIMENSIONS', special: 'RAYON DE MATIÈRE PRIMORDIALE',
      air: 'Plongeon de l\'Alpha et l\'Oméga', grab: 'Déchirure de Réalité',
      ultra: 'GENÈSE & DESTRUCTION DU COSMOS'
    }
  },
  // 23. ASTRA
  astra: {
    id: 'astra',
    name: 'ASTRA',
    title: 'Prêtresse de la Nébuleuse Nacrée',
    archetype: 'Magie Stellaire & Protection • Orbes d\'Énergie',
    color: '#818cf8', accent: '#c7d2fe', auraColor: 'rgba(199, 210, 254, 0.9)',
    hairColor: '#e0e7ff', hairShadow: '#a5b4fc', giColor: '#312e81', giShadow: '#1e1b4b',
    sashColor: '#6366f1', skinColor: '#f5f3ff', skinShadow: '#ede9fe', eyeColor: '#818cf8',
    hairType: 'long', bodyType: 'standard', speed: 7.7, dashSpeed: 17, jumpPower: -16.6, maxHp: 195,
    shotType: 'holy', soundType: 'holy',
    moves: {
      combo: ['Bâton Étoilé', 'Sphère Nacrée', 'Choc Astral'],
      smash: 'RAYONNEMENT DU CHŒUR STELLAIRE', special: 'ORBE DE NÉBULEUSE GUIDÉE',
      air: 'Descente du Voile Nacré', grab: 'Purification Stellaire & Répulsion',
      ultra: 'BÉNÉDICTION DU COSMOS INFINI'
    }
  },
  // 24. KAGE MARU
  kage: {
    id: 'kage',
    name: 'KAGE MARU',
    title: 'Shinobi Céleste du Rayon Lunaire',
    archetype: 'Vitesse Extrême • Clones & Shurikens de Lumière',
    color: '#0f172a', accent: '#38bdf8', auraColor: 'rgba(56, 189, 248, 0.9)',
    hairColor: '#020617', hairShadow: '#000000', giColor: '#0f172a', giShadow: '#020617',
    sashColor: '#0284c7', skinColor: '#f8fafc', skinShadow: '#e2e8f0', eyeColor: '#38bdf8',
    hairType: 'cowl', bodyType: 'speed', speed: 9.2, dashSpeed: 23, jumpPower: -18.5, maxHp: 175,
    shotType: 'wind', soundType: 'normal',
    moves: {
      combo: ['Frappe Ninjutsu', 'Coup de Pied Lunaire', 'Lame de l\'Ombre Vole'],
      smash: 'TECHNIQUE SECRÈTE : CHOC DU CLONE', special: 'SHURIKENS DE LUMIÈRE LUNAIRE',
      air: 'Piquée Ninja Inversible', grab: 'Substitution d\'Arbre & Tranchant Nuque',
      ultra: 'DÉCUPLEMENT NINJA DES MILLE OMBRES'
    }
  }
};

// ==========================================
// 3. MOTEUR DU JEU SKYCHORD COMBAT CÉLESTE
// ==========================================
class SkyChordGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.audio = new SkyChordAudio();

    this.width = 1280;
    this.height = 720;
    this.scale = 1;

    this.state = 'playing';
    this.mode = 'versus';

    this.p1 = null;
    this.p2 = null;

    this.particles = [];
    this.hitSparks = [];
    this.speedLines = [];
    this.projectiles = [];
    this.floatingTexts = [];
    this.ghostTrails = [];

    this.shake = 0;
    this.hitStop = 0;
    this.time = 0;

    this.ultraCutin = null;
    this.storyChapter = 1;
    this.cinematicFrame = 0;
    this.cinematicDialogue = '';
    this.cinematicSpeaker = '';
    this.cinematicTitle = '';

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
    window.addEventListener('keydown', (e) => {
      this.audio.init();
      const k = e.key.toLowerCase();
      this.keys[k] = true;

      if (e.key === ' ' && this.state === 'cinematic') {
        this.nextCinematic();
        return;
      }

      if (this.state === 'playing' && this.p1) {
        if (k === 'j') this.touch.attackHold++;
        if (k === 'k') this.p1.special(this);
        if (k === ' ' || k === 'z' || k === 'arrowup') this.p1.jump();
        if (k === 'l') this.p1.toggleShield(true);
        if (k === 'u') this.p1.grabOrUltra(this);
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      this.keys[k] = false;

      if (this.state === 'playing' && this.p1) {
        if (k === 'j') {
          if (this.touch.attackHold >= 14) {
            this.p1.releaseSmash(this);
          } else {
            this.p1.normalCombo(this);
          }
          this.touch.attackHold = 0;
          this.touch.smashCharged = false;
        }
        if (k === 'l') this.p1.toggleShield(false);
      }
    });

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
        if (p.x < this.width * 0.45) {
          this.touch.joy.active = true;
          this.touch.joy.id = t.identifier;
          this.touch.joy.startX = p.x;
          this.touch.joy.startY = p.y;
          this.touch.joy.currX = p.x;
          this.touch.joy.currY = p.y;
        } else {
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

  getButtons() {
    const p1 = this.p1;
    const isUltraReady = p1 && p1.kiGauge >= 100;
    const p1Data = p1 ? p1.data : FIGHTERS_DATA.sola;

    return [
      { id: 'attack', label: 'FRAPPE', sub: 'Combo / Smash', x: 1120, y: 565, r: 68, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' },
      { id: 'special', label: 'TIR SPÉ', sub: p1Data.moves.special.slice(0, 14), x: 980, y: 590, r: 56, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.6)' },
      { id: 'jump', label: 'SAUT', sub: 'Double Saut', x: 1120, y: 415, r: 58, color: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' },
      { id: 'shield', label: 'GARDE', sub: 'Parade Parfaite', x: 980, y: 445, r: 52, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.6)' },
      { id: 'burst', label: isUltraReady ? 'ULTRA !' : 'PRISE', sub: isUltraReady ? 'CÉLESTE' : 'Brise-Garde', x: 855, y: 525, r: 50, color: isUltraReady ? '#f43f5e' : '#ec4899', glow: isUltraReady ? 'rgba(244, 63, 94, 0.9)' : 'rgba(236, 72, 153, 0.5)' }
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
            if (this.p1) {
              if (this.touch.attackHold >= 12) {
                this.p1.releaseSmash(this);
              } else {
                this.p1.normalCombo(this);
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
            if (b.id === 'burst') this.p1.grabOrUltra(this);
          }
        } else {
          if (this.p1 && b.id === 'shield') this.p1.toggleShield(false);
        }
        break;
      }
    }
  }

  startMatch(mode = 'versus', p1Id = 'sola', p2Id = 'aether') {
    this.mode = mode;
    const d1 = FIGHTERS_DATA[p1Id] || FIGHTERS_DATA.sola;
    const d2 = FIGHTERS_DATA[p2Id] || FIGHTERS_DATA.aether;

    this.p1 = new Fighter(d1, 320, 540, 1, false);

    if (mode === 'titan') {
      this.p2 = new Fighter(FIGHTERS_DATA.titan, 960, 540, -1, true);
    } else if (mode === 'eclair') {
      this.p1.hp = 1;
      this.p1.damagePercent = 300;
      this.p2 = new Fighter(d2, 960, 540, -1, true);
      this.p2.hp = 1;
      this.p2.damagePercent = 300;
    } else if (mode === 'histoire') {
      this.startStoryChapter(1);
      return;
    } else {
      this.p2 = new Fighter(d2, 960, 540, -1, true);
    }

    this.particles = [];
    this.hitSparks = [];
    this.speedLines = [];
    this.projectiles = [];
    this.floatingTexts = [];
    this.ghostTrails = [];
    this.state = 'playing';
    this.time = 0;
    this.ultraCutin = null;
  }

  startStoryChapter(ch) {
    this.storyChapter = ch;
    this.state = 'cinematic';
    this.cinematicFrame = 0;

    if (ch === 1) {
      this.cinematicSpeaker = 'SOLA (Zénith Solaire)';
      this.cinematicDialogue = '« Le Silence Obscur dévore le Chœur Céleste... Aether, laisse-moi passer pour éveiller l\'harmonie ! »';
      this.cinematicTitle = 'ÉPISODE I : LE CHOC DES ÉLÉMENTS SACRÉS';
    } else if (ch === 2) {
      this.cinematicSpeaker = 'NOX (Ombre Astrale)';
      this.cinematicDialogue = '« Ta lumière ne fait qu\'alimenter les ténèbres. Le vide astral engloutira ton soleil ! »';
      this.cinematicTitle = 'ÉPISODE II : L\'ÉCLIPSE DU NÉANT';
    } else {
      this.cinematicSpeaker = 'TITAN KRONOS (Colosse Primordial)';
      this.cinematicDialogue = '« TREMBLEZ DEVANT LE POIDS DE L\'UNIVERS ! RIEN NE SURVIVRA AU CATACLYSME PRIMORDIAL ! »';
      this.cinematicTitle = 'ÉPISODE III : L\'ANÉANTISSEMENT DU TITAN';
    }
  }

  nextCinematic() {
    this.state = 'playing';
    if (this.storyChapter === 1) {
      this.p1 = new Fighter(FIGHTERS_DATA.sola, 320, 540, 1, false);
      this.p2 = new Fighter(FIGHTERS_DATA.aether, 960, 540, -1, true);
    } else if (this.storyChapter === 2) {
      this.p1 = new Fighter(FIGHTERS_DATA.sola, 320, 540, 1, false);
      this.p2 = new Fighter(FIGHTERS_DATA.nox, 960, 540, -1, true);
    } else {
      this.p1 = new Fighter(FIGHTERS_DATA.sola, 320, 540, 1, false);
      this.p2 = new Fighter(FIGHTERS_DATA.titan, 960, 540, -1, true);
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

    if (this.hitStop > 0) {
      this.hitStop--;
      return;
    }

    if (this.shake > 0) this.shake *= 0.88;

    if (this.ultraCutin) {
      this.ultraCutin.timer--;
      if (this.ultraCutin.timer <= 0) this.ultraCutin = null;
      return;
    }

    if (this.state === 'cinematic') {
      this.cinematicFrame++;
      return;
    }

    if (this.state !== 'playing') return;

    if (this.touch.attackDown && this.p1 && !this.p1.hitstun) {
      this.touch.attackHold++;
      this.p1.chargeSmash();
      if (this.touch.attackHold >= 38) {
        this.touch.smashCharged = true;
      }
      this.audio.kiCharge(Math.min(1.0, this.touch.attackHold / 38));
    }

    if (this.p1) {
      let moveDir = 0;
      if (this.touch.joy.active && Math.abs(this.touch.joy.dx) > 0.2) {
        moveDir = Math.sign(this.touch.joy.dx);
      } else if (this.keys['q'] || this.keys['arrowleft']) {
        moveDir = -1;
      } else if (this.keys['d'] || this.keys['arrowright']) {
        moveDir = 1;
      }

      this.p1.move(moveDir);

      if (this.touch.joy.active && Math.abs(this.touch.joy.dx) > 0.85) {
        this.p1.dash();
      }

      this.p1.update(this);
    }

    if (this.p2) {
      this.updateAI(this.p2, this.p1);
      this.p2.update(this);
    }

    if (this.p1 && this.p2) {
      this.checkCombatCollisions(this.p1, this.p2);
      this.checkCombatCollisions(this.p2, this.p1);
    }

    this.updateProjectiles();

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= ft.vy;
      ft.alpha -= 0.025;
      if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
    }

    for (let i = this.hitSparks.length - 1; i >= 0; i--) {
      const s = this.hitSparks[i];
      s.age++;
      if (s.age > s.maxAge) this.hitSparks.splice(i, 1);
    }

    for (let i = this.ghostTrails.length - 1; i >= 0; i--) {
      const gt = this.ghostTrails[i];
      gt.alpha -= 0.06;
      if (gt.alpha <= 0) this.ghostTrails.splice(i, 1);
    }

    if (this.p1 && this.p1.hp <= 0) this.triggerGameOver(this.p2);
    if (this.p2 && this.p2.hp <= 0) {
      if (this.mode === 'histoire' && this.storyChapter < 3) {
        this.startStoryChapter(this.storyChapter + 1);
      } else {
        this.triggerGameOver(this.p1);
      }
    }
  }

  updateAI(ai, target) {
    if (!ai || !target || ai.hitstun > 0) return;
    const dx = target.x - ai.x;
    const absDist = Math.abs(dx);
    ai.facing = Math.sign(dx) || 1;

    if (absDist > 160) {
      ai.move(ai.facing);
      if (Math.random() < 0.02) ai.dash();
    } else if (absDist < 60 && Math.random() < 0.03) {
      ai.move(-ai.facing);
    } else {
      ai.move(0);
    }

    if (target.y < ai.y - 60 && Math.random() < 0.04) {
      ai.jump();
    }

    if (absDist < 140) {
      if (Math.random() < 0.06) {
        ai.normalCombo(this);
      } else if (Math.random() < 0.015) {
        ai.chargeSmash();
        setTimeout(() => ai.releaseSmash(this), 300);
      } else if (Math.random() < 0.02) {
        ai.grabOrUltra(this);
      }
    } else if (absDist > 250 && Math.random() < 0.025) {
      ai.special(this);
    }

    if (target.isAttacking && absDist < 120 && Math.random() < 0.06) {
      ai.toggleShield(true);
      setTimeout(() => ai.toggleShield(false), 380);
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
      if (victim.isShielding && victim.shieldTimer < 10) {
        attacker.hitHasConnected = true;
        attacker.hitstun = 30;
        victim.toggleShield(false);
        this.audio.shield(true);
        this.shake = 10;
        this.hitStop = 8;
        this.addFloatingText(victim.x, victim.y - victim.h, 'PARADE PARFAITE !', '#38bdf8', 1.8);
        this.addHitSpark(hitbox.x + hitbox.w * 0.5, hitbox.y + hitbox.h * 0.5, '#38bdf8', 2.5, true);
        return;
      }

      attacker.hitHasConnected = true;
      const isCrit = attacker.isSmashing;
      const comboStep = attacker.comboStep;

      let damage = 14;
      let knockX = attacker.facing * 8;
      let knockY = -6;

      if (isCrit) {
        damage = attacker.isTitan ? 52 : 40;
        knockX = attacker.facing * (attacker.isTitan ? 28 : 22);
        knockY = -15;
      } else if (comboStep === 2) {
        damage = 22;
        knockX = attacker.facing * 16;
        knockY = -12;
      } else if (comboStep === 1) {
        damage = 16;
        knockX = attacker.facing * 9;
        knockY = -4;
      }

      victim.takeDamage(damage, knockX, knockY, this, isCrit);
      attacker.kiGauge = Math.min(100, attacker.kiGauge + (isCrit ? 22 : 12));

      this.audio.punch(attacker.data.soundType, isCrit || comboStep === 2);
      this.addHitSpark(hitbox.x + hitbox.w * 0.5, hitbox.y + hitbox.h * 0.5, attacker.data.accent, isCrit ? 2.4 : 1.3, isCrit);

      this.hitStop = isCrit ? 8 : (comboStep === 2 ? 5 : 2);
      this.shake = isCrit ? 18 : (comboStep === 2 ? 10 : 4);

      attacker.comboHits++;
      if (attacker.comboHits > 1) {
        this.addFloatingText(attacker.x, attacker.y - attacker.h - 20, `${attacker.comboHits} HITS !`, attacker.data.accent, 1.4);
      }
    }
  }

  updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.hasGravity) p.vy += 0.45;

      if (p.isSingularity) {
        const opp = (p.owner === this.p1) ? this.p2 : this.p1;
        if (opp) {
          const dist = Math.hypot(p.x - opp.x, p.y - (opp.y - opp.h * 0.5));
          if (dist < 260 && !opp.isShielding) {
            opp.x += Math.sign(p.x - opp.x) * 3.5;
          }
        }
      }

      if (this.time % 2 === 0) {
        this.hitSparks.push({
          x: p.x, y: p.y, color: p.color, scale: 0.6, isCrit: false, age: 0, maxAge: 8
        });
      }

      const target = (p.owner === this.p1) ? this.p2 : this.p1;
      if (target) {
        const hurt = target.getHurtbox();
        if (
          p.x > hurt.x && p.x < hurt.x + hurt.w &&
          p.y > hurt.y && p.y < hurt.y + hurt.h
        ) {
          target.takeDamage(p.damage, Math.sign(p.vx) * 14, -8, this, true);
          this.addHitSpark(p.x, p.y, p.color, 2.0, true);
          this.audio.punch(p.owner.data.soundType, true);
          this.shake = 8;
          this.hitStop = 4;
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      if (p.life <= 0 || p.x < 50 || p.x > this.width - 50 || p.y > 600) {
        this.addHitSpark(p.x, p.y, p.color, 1.4, false);
        this.projectiles.splice(i, 1);
      }
    }
  }

  addHitSpark(x, y, color, scale = 1, isCrit = false) {
    this.hitSparks.push({ x, y, color, scale, isCrit, age: 0, maxAge: isCrit ? 16 : 9 });
  }

  addFloatingText(x, y, text, color, scale = 1.0) {
    this.floatingTexts.push({ x, y, text, color, scale, vy: 1.8, alpha: 1.0 });
  }

  triggerGameOver(winner) {
    this.state = 'gameover';
    this.winner = winner;
  }

  render() {
    const c = this.ctx;
    c.save();

    if (this.shake > 0) {
      const sx = (Math.random() * 2 - 1) * this.shake;
      const sy = (Math.random() * 2 - 1) * this.shake;
      c.translate(sx, sy);
    }

    this.renderArena(c);
    this.renderGhostTrails(c);
    this.renderProjectiles(c);

    if (this.p1) this.p1.render(c, this.time);
    if (this.p2) this.p2.render(c, this.time);

    this.renderHitSparks(c);
    this.renderFloatingTexts(c);
    this.renderHUD(c);
    this.renderTouchControls(c);

    if (this.ultraCutin) this.renderUltraCutin(c);
    if (this.state === 'cinematic') this.renderCinematic(c);
    if (this.state === 'gameover') this.renderGameOver(c);

    c.restore();
  }

  renderArena(c) {
    const grad = c.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#060411');
    grad.addColorStop(0.5, '#161233');
    grad.addColorStop(1, '#2c103a');
    c.fillStyle = grad;
    c.fillRect(0, 0, this.width, this.height);

    c.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let i = 0; i < 45; i++) {
      const sx = (i * 103 + this.time * 0.15) % this.width;
      const sy = (i * 149) % (this.height * 0.72);
      const r = (i % 3 === 0) ? 2.2 : 1.2;
      c.beginPath();
      c.arc(sx, sy, r, 0, Math.PI * 2);
      c.fill();
    }

    const platY = 560;
    c.save();
    c.fillStyle = '#171426';
    c.strokeStyle = '#f59e0b';
    c.lineWidth = 4;
    c.beginPath();
    c.roundRect(140, platY, 1000, 160, [14, 14, 0, 0]);
    c.fill();
    c.stroke();

    c.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    c.lineWidth = 2.5;
    for (let x = 180; x < 1100; x += 75) {
      c.strokeRect(x, platY + 14, 55, 35);
      c.beginPath();
      c.moveTo(x + 27, platY + 14);
      c.lineTo(x + 27, platY + 49);
      c.stroke();
    }
    c.restore();
  }

  renderGhostTrails(c) {
    for (let gt of this.ghostTrails) {
      c.save();
      c.translate(gt.x, gt.y);
      c.scale(gt.facing, 1);
      c.globalAlpha = Math.max(0, gt.alpha * 0.45);
      c.fillStyle = gt.color;
      c.beginPath();
      c.roundRect(-gt.w * 0.5, -gt.h, gt.w, gt.h, 6);
      c.fill();
      c.restore();
    }
  }

  renderProjectiles(c) {
    for (let p of this.projectiles) {
      c.save();
      c.translate(p.x, p.y);

      if (p.isBeam) {
        const beamW = 140;
        const beamH = p.radius * 2;
        const bGrad = c.createLinearGradient(-beamW * 0.5, 0, beamW * 0.5, 0);
        bGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        bGrad.addColorStop(0.5, p.color);
        bGrad.addColorStop(1, 'transparent');
        c.fillStyle = bGrad;
        c.beginPath();
        c.ellipse(0, 0, beamW, beamH, 0, 0, Math.PI * 2);
        c.fill();
      } else if (p.isSingularity) {
        c.fillStyle = '#0f051d';
        c.strokeStyle = p.color;
        c.lineWidth = 4;
        c.beginPath();
        c.arc(0, 0, p.radius, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        c.strokeStyle = '#c084fc';
        c.lineWidth = 2;
        c.beginPath();
        c.ellipse(0, 0, p.radius * 1.6, p.radius * 0.6, this.time * 0.1, 0, Math.PI * 2);
        c.stroke();
      } else {
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(0, 0, p.radius * 0.6, 0, Math.PI * 2);
        c.fill();

        c.strokeStyle = p.color;
        c.lineWidth = 3.5;
        c.beginPath();
        c.arc(0, 0, p.radius, 0, Math.PI * 2);
        c.stroke();
      }
      c.restore();
    }
  }

  renderHitSparks(c) {
    for (let s of this.hitSparks) {
      c.save();
      c.translate(s.x, s.y);
      const pr = s.age / s.maxAge;
      const alpha = 1 - pr;

      c.fillStyle = s.color;
      c.globalAlpha = alpha;
      c.beginPath();
      const spikes = 8;
      const rOut = (s.isCrit ? 45 : 24) * (1 + pr * 0.8) * s.scale;
      const rIn = rOut * 0.25;

      for (let i = 0; i < spikes * 2; i++) {
        const rad = (Math.PI / spikes) * i;
        const r = (i % 2 === 0) ? rOut : rIn;
        const px = Math.cos(rad) * r;
        const py = Math.sin(rad) * r;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();

      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(0, 0, rIn * 1.2, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  }

  renderFloatingTexts(c) {
    for (let ft of this.floatingTexts) {
      c.save();
      c.font = `900 ${Math.round(24 * ft.scale)}px "Outfit", sans-serif`;
      c.textAlign = 'center';
      c.fillStyle = ft.color;
      c.globalAlpha = ft.alpha;
      c.strokeStyle = '#000000';
      c.lineWidth = 4;
      c.strokeText(ft.text, ft.x, ft.y);
      c.fillText(ft.text, ft.x, ft.y);
      c.restore();
    }
  }

  renderHUD(c) {
    if (!this.p1 || !this.p2) return;

    this.renderFighterCard(c, this.p1, 60, 35, false);
    this.renderFighterCard(c, this.p2, this.width - 440, 35, true);

    c.save();
    c.font = 'bold 20px "Cinzel", serif';
    c.textAlign = 'center';
    c.fillStyle = '#fbbf24';
    c.shadowColor = 'rgba(251, 191, 36, 0.8)';
    c.shadowBlur = 12;
    const modeNames = {
      versus: 'DUEL VERSUS CÉLESTE (24 COMBATTANTS)',
      histoire: 'MODE HISTOIRE — CHANT DES ORIGINES',
      eclair: '⚡ MORT SUBITE (300% DÉGÂTS) ⚡',
      titan: '☠ DÉFI DU TITAN KRONOS ☠'
    };
    c.fillText(modeNames[this.mode] || 'SKYCHORD COMBAT', this.width / 2, 42);
    c.restore();
  }

  renderFighterCard(c, f, x, y, isRight) {
    c.save();
    const w = 380;
    const h = 65;

    c.fillStyle = 'rgba(12, 8, 26, 0.88)';
    c.strokeStyle = f.data.accent;
    c.lineWidth = 3;
    c.beginPath();
    c.roundRect(x, y, w, h, 10);
    c.fill();
    c.stroke();

    const hpRatio = Math.max(0, f.hp / f.data.maxHp);
    const hpGrad = c.createLinearGradient(x, 0, x + w, 0);
    hpGrad.addColorStop(0, '#ef4444');
    hpGrad.addColorStop(0.5, '#f59e0b');
    hpGrad.addColorStop(1, '#10b981');
    c.fillStyle = hpGrad;
    c.beginPath();
    c.roundRect(x + 8, y + 26, (w - 16) * hpRatio, 20, 4);
    c.fill();

    const kiRatio = Math.max(0, f.kiGauge / 100);
    c.fillStyle = f.kiGauge >= 100 ? '#f43f5e' : '#38bdf8';
    c.beginPath();
    c.roundRect(x + 8, y + 50, (w - 16) * kiRatio, 6, 2);
    c.fill();

    c.font = '900 17px "Outfit", sans-serif';
    c.fillStyle = '#ffffff';
    c.textAlign = isRight ? 'right' : 'left';
    c.fillText(f.data.name, isRight ? x + w - 12 : x + 12, y + 20);

    c.font = '900 18px "JetBrains Mono", sans-serif';
    c.fillStyle = f.hp < f.data.maxHp * 0.3 ? '#ef4444' : '#fde047';
    c.textAlign = isRight ? 'left' : 'right';
    c.fillText(`${Math.round(f.damagePercent)}%`, isRight ? x + 12 : x + w - 12, y + 42);

    c.restore();
  }

  renderTouchControls(c) {
    const btns = this.getButtons();

    const jx = this.touch.joy.active ? this.touch.joy.startX : 160;
    const jy = this.touch.joy.active ? this.touch.joy.startY : 550;
    const jr = 65;

    c.save();
    c.fillStyle = 'rgba(15, 12, 35, 0.4)';
    c.strokeStyle = 'rgba(251, 191, 36, 0.65)';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(jx, jy, jr, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    const knobX = jx + this.touch.joy.dx * jr * 0.7;
    const knobY = jy + this.touch.joy.dy * jr * 0.7;
    c.fillStyle = 'rgba(251, 191, 36, 0.9)';
    c.beginPath();
    c.arc(knobX, knobY, 28, 0, Math.PI * 2);
    c.fill();
    c.restore();

    for (let b of btns) {
      c.save();
      c.fillStyle = 'rgba(15, 12, 35, 0.55)';
      c.strokeStyle = b.color;
      c.lineWidth = 3.5;
      c.beginPath();
      c.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      c.font = `900 ${Math.round(b.r * 0.33)}px "Outfit", sans-serif`;
      c.fillStyle = '#ffffff';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(b.label, b.x, b.y - (b.sub ? 6 : 0));

      if (b.sub) {
        c.font = `600 ${Math.round(b.r * 0.19)}px "Outfit", sans-serif`;
        c.fillStyle = b.color;
        c.fillText(b.sub, b.x, b.y + b.r * 0.32);
      }

      if (b.id === 'attack' && this.touch.attackHold > 0) {
        const ratio = Math.min(1.0, this.touch.attackHold / 38);
        c.strokeStyle = this.touch.smashCharged ? '#38bdf8' : '#fbbf24';
        c.lineWidth = 5;
        c.beginPath();
        c.arc(b.x, b.y, b.r + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio);
        c.stroke();

        if (this.touch.smashCharged) {
          c.font = '900 16px "Outfit", sans-serif';
          c.fillStyle = '#38bdf8';
          c.fillText('MAX !', b.x, b.y - b.r - 14);
        }
      }
      c.restore();
    }
  }

  renderUltraCutin(c) {
    const u = this.ultraCutin;
    if (!u) return;

    c.save();
    c.fillStyle = 'rgba(0, 0, 0, 0.88)';
    c.fillRect(0, 220, this.width, 280);

    c.strokeStyle = u.fighter.data.accent;
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(0, 220); c.lineTo(this.width, 220);
    c.moveTo(0, 500); c.lineTo(this.width, 500);
    c.stroke();

    c.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    c.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      const y = 230 + i * 13;
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(this.width, y);
      c.stroke();
    }

    c.font = '900 44px "Cinzel", "Outfit", serif';
    c.fillStyle = u.fighter.data.accent;
    c.textAlign = 'center';
    c.shadowColor = u.fighter.data.accent;
    c.shadowBlur = 25;
    c.fillText(u.fighter.data.moves.ultra, this.width / 2, 340);

    c.font = 'bold 24px "Outfit", sans-serif';
    c.fillStyle = '#ffffff';
    c.shadowBlur = 0;
    c.fillText(`DÉCHAÎNEMENT CÉLESTE DE ${u.fighter.data.name} !`, this.width / 2, 400);

    c.restore();
  }

  renderCinematic(c) {
    c.save();
    const barH = 85;
    c.fillStyle = '#000000';
    c.fillRect(0, 0, this.width, barH);
    c.fillRect(0, this.height - barH, this.width, barH);

    c.font = 'bold 30px "Cinzel", serif';
    c.textAlign = 'center';
    c.fillStyle = '#fde047';
    c.shadowColor = 'rgba(253, 224, 71, 0.9)';
    c.shadowBlur = 18;
    c.fillText(this.cinematicTitle || '', this.width / 2, 58);

    c.fillStyle = 'rgba(15, 10, 30, 0.94)';
    c.strokeStyle = '#f59e0b';
    c.lineWidth = 3;
    c.beginPath();
    c.roundRect(140, this.height - 215, this.width - 280, 115, 12);
    c.fill();
    c.stroke();

    c.font = 'bold 20px "Outfit", sans-serif';
    c.fillStyle = '#38bdf8';
    c.textAlign = 'left';
    c.fillText(this.cinematicSpeaker, 165, this.height - 180);

    c.font = '18px "Outfit", sans-serif';
    c.fillStyle = '#ffffff';
    c.fillText(this.cinematicDialogue, 165, this.height - 145);

    c.font = 'bold 15px "Outfit", sans-serif';
    c.fillStyle = '#f59e0b';
    c.textAlign = 'right';
    c.fillText('Toucher ou Espace pour continuer ▶', this.width - 165, this.height - 115);

    c.restore();
  }

  renderGameOver(c) {
    c.save();
    c.fillStyle = 'rgba(0, 0, 0, 0.78)';
    c.fillRect(0, 0, this.width, this.height);

    c.font = '900 64px "Cinzel", serif';
    c.textAlign = 'center';
    c.fillStyle = '#fbbf24';
    c.shadowColor = 'rgba(251, 191, 36, 1)';
    c.shadowBlur = 25;
    c.fillText('VICTOIRE !', this.width / 2, 290);

    c.font = 'bold 28px "Outfit", sans-serif';
    c.fillStyle = '#ffffff';
    c.shadowBlur = 0;
    c.fillText(`${this.winner ? this.winner.data.name : 'VAINQUEUR'} TRIOMPHE DU COMBAT !`, this.width / 2, 350);

    c.fillStyle = '#ea580c';
    c.beginPath();
    c.roundRect(this.width / 2 - 140, 410, 280, 60, 30);
    c.fill();

    c.font = 'bold 20px "Outfit", sans-serif';
    c.fillStyle = '#ffffff';
    c.fillText('REJOUER LE COMBAT', this.width / 2, 448);
    c.restore();
  }
}

// ==========================================
// 4. CLASSE FIGHTER (ANATOMIE & COIFFURES)
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

    this.w = 56 * this.scale;
    this.h = 108 * this.scale;

    this.hp = data.maxHp;
    this.damagePercent = 0;
    this.kiGauge = 30;
    this.onGround = false;
    this.jumpsLeft = 2;

    this.comboStep = 0;
    this.comboTimer = 0;
    this.comboHits = 0;
    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackType = 'normal';

    this.isSmashing = false;
    this.smashCharge = 0;

    this.isShielding = false;
    this.shieldTimer = 0;

    this.hitstun = 0;
    this.hitHasConnected = false;
    this.isDashing = false;
    this.dashTimer = 0;
  }

  move(dir) {
    if (this.hitstun > 0 || this.isShielding || this.isSmashing) return;
    this.vx = dir * this.data.speed;
    if (dir !== 0) this.facing = Math.sign(dir);
  }

  dash() {
    if (this.hitstun > 0 || this.isShielding || this.dashTimer > 0) return;
    this.isDashing = true;
    this.dashTimer = 16;
    this.vx = this.facing * this.data.dashSpeed;
  }

  jump() {
    if (this.hitstun > 0 || this.isShielding || this.isSmashing) return;
    if (this.jumpsLeft > 0) {
      this.vy = this.data.jumpPower;
      this.jumpsLeft--;
      this.onGround = false;
    }
  }

  normalCombo(game) {
    if (this.isAttacking || this.hitstun > 0 || this.isShielding) return;

    if (!this.onGround) {
      this.airAttack(game);
      return;
    }

    if (this.comboTimer > 0) {
      this.comboStep = (this.comboStep + 1) % 3;
    } else {
      this.comboStep = 0;
      this.comboHits = 0;
    }

    this.isAttacking = true;
    this.attackType = 'normal';
    this.attackTimer = this.comboStep === 2 ? 22 : 14;
    this.comboTimer = 35;
    this.hitHasConnected = false;

    this.vx = this.facing * (this.comboStep === 2 ? 8 : 4);
    game.audio.punch(this.data.soundType, false);
  }

  airAttack(game) {
    this.isAttacking = true;
    this.attackType = 'air';
    this.attackTimer = 18;
    this.hitHasConnected = false;
    this.vy = 8;
    this.vx = this.facing * 9;
    game.audio.punch(this.data.soundType, true);
  }

  chargeSmash() {
    if (this.hitstun > 0 || this.isShielding) return;
    this.isAttacking = true;
    this.isSmashing = true;
    this.attackType = 'smash';
    this.smashCharge = Math.min(1.0, this.smashCharge + 0.03);
  }

  releaseSmash(game) {
    if (!this.isSmashing) return;
    this.attackTimer = 26;
    this.isSmashing = false;
    this.hitHasConnected = false;

    this.vx = this.facing * (this.isTitan ? 16 : 22);
    game.audio.punch(this.data.soundType, true);
    game.addHitSpark(this.x + this.facing * 50, this.y - this.h * 0.5, this.data.accent, 2.2, true);
    this.smashCharge = 0;
  }

  special(game) {
    if (this.isAttacking || this.hitstun > 0 || this.isShielding) return;
    this.isAttacking = true;
    this.attackType = 'special';
    this.attackTimer = 28;

    game.audio.projectileSound(this.data.shotType);

    const sType = this.data.shotType;
    if (sType === 'beam') {
      game.projectiles.push({
        x: this.x + this.facing * 40, y: this.y - this.h * 0.55, vx: this.facing * 22, vy: 0,
        radius: 24, damage: 34, color: this.data.accent, isBeam: true, owner: this, life: 55
      });
    } else if (sType === 'lightning') {
      [-3, 0, 3].forEach((vy, idx) => {
        game.projectiles.push({
          x: this.x + this.facing * (35 + idx * 10), y: this.y - this.h * 0.55 + vy * 8,
          vx: this.facing * 24, vy: vy * 0.8, radius: 14, damage: 18, color: this.data.accent,
          owner: this, life: 48
        });
      });
    } else if (sType === 'void') {
      game.projectiles.push({
        x: this.x + this.facing * 45, y: this.y - this.h * 0.55, vx: this.facing * 9, vy: 0,
        radius: 28, damage: 38, color: this.data.accent, isSingularity: true, owner: this, life: 75
      });
    } else if (sType === 'rock') {
      game.projectiles.push({
        x: this.x + this.facing * 50, y: this.y - this.h * 0.65, vx: this.facing * 12, vy: -7,
        radius: 36, damage: 48, color: this.data.accent, hasGravity: true, owner: this, life: 70
      });
    } else if (sType === 'flame') {
      [-2, 0, 2].forEach((vy, idx) => {
        game.projectiles.push({
          x: this.x + this.facing * 40, y: this.y - this.h * 0.55 + vy * 6, vx: this.facing * 18, vy: vy * 0.5,
          radius: 18, damage: 24, color: this.data.accent, owner: this, life: 50
        });
      });
    } else if (sType === 'crystal') {
      [-3, 3].forEach((vy, idx) => {
        game.projectiles.push({
          x: this.x + this.facing * 40, y: this.y - this.h * 0.55 + vy * 8, vx: this.facing * 25, vy: vy * 0.6,
          radius: 12, damage: 20, color: this.data.accent, owner: this, life: 45
        });
      });
    } else if (sType === 'arrow') {
      game.projectiles.push({
        x: this.x + this.facing * 42, y: this.y - this.h * 0.55, vx: this.facing * 28, vy: 0,
        radius: 14, damage: 32, color: this.data.accent, owner: this, life: 45
      });
    } else {
      game.projectiles.push({
        x: this.x + this.facing * 40, y: this.y - this.h * 0.55, vx: this.facing * 20, vy: 0,
        radius: 18, damage: 28, color: this.data.accent, owner: this, life: 52
      });
    }
  }

  grabOrUltra(game) {
    if (this.hitstun > 0) return;

    if (this.kiGauge >= 100) {
      this.kiGauge = 0;
      this.isAttacking = true;
      this.attackTimer = 45;
      game.ultraCutin = { fighter: this, timer: 50 };
      game.audio.ultraSwarm();
      game.shake = 22;
      game.hitStop = 15;

      const opp = (this === game.p1) ? game.p2 : game.p1;
      if (opp && Math.abs(opp.x - this.x) < 380) {
        opp.takeDamage(60, this.facing * 26, -16, game, true);
        game.addHitSpark(opp.x, opp.y - opp.h * 0.5, this.data.accent, 3.2, true);
      }
      return;
    }

    this.isAttacking = true;
    this.attackType = 'grab';
    this.attackTimer = 22;
    const opp = (this === game.p1) ? game.p2 : game.p1;

    if (opp && Math.abs(opp.x - this.x) < 130 && Math.abs(opp.y - this.y) < 60) {
      opp.takeDamage(24, this.facing * 19, -12, game, true);
      game.addHitSpark(opp.x, opp.y - opp.h * 0.5, this.data.accent, 2.0, true);
      game.audio.punch(this.data.soundType, true);
      this.kiGauge = Math.min(100, this.kiGauge + 20);
    }
  }

  toggleShield(active) {
    if (this.hitstun > 0) return;
    this.isShielding = active;
    if (active) this.shieldTimer = 0;
  }

  takeDamage(dmg, kbx, kby, game, isCrit = false) {
    if (this.isShielding) {
      game.audio.shield(false);
      this.hp -= Math.round(dmg * 0.15);
      return;
    }

    if (this.isTitan && this.data.superArmor) {
      kbx *= 0.4;
      kby *= 0.4;
      this.hitstun = Math.min(8, this.hitstun);
    } else {
      this.hitstun = isCrit ? 26 : 14;
    }

    this.hp -= dmg;
    this.damagePercent += dmg;
    this.kiGauge = Math.min(100, this.kiGauge + dmg * 0.4);
    this.vx = kbx;
    this.vy = kby;
    this.isAttacking = false;
    this.isSmashing = false;
  }

  getHitbox() {
    return {
      x: this.facing > 0 ? this.x : this.x - this.w * 1.6,
      y: this.y - this.h * 0.85,
      w: this.w * 1.6,
      h: this.h * 0.75
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
    this.vy += 0.95;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.84;

    const groundY = 560;
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.onGround = true;
      this.jumpsLeft = 2;
    } else {
      this.onGround = false;
    }

    if (this.x < 140) { this.x = 140; this.vx = 0; }
    if (this.x > 1140) { this.x = 1140; this.vx = 0; }

    if (this.attackTimer > 0) {
      this.attackTimer--;
      if (this.attackTimer === 0) {
        this.isAttacking = false;
        this.isSmashing = false;
      }
    }

    if (this.comboTimer > 0) this.comboTimer--;
    if (this.hitstun > 0) this.hitstun--;
    if (this.isShielding) this.shieldTimer++;

    if (this.dashTimer > 0) {
      this.dashTimer--;
      if (this.dashTimer === 0) this.isDashing = false;
      if (this.dashTimer % 3 === 0) {
        game.ghostTrails.push({
          x: this.x, y: this.y, facing: this.facing, w: this.w, h: this.h, color: this.data.accent, alpha: 1.0
        });
      }
    }
  }

  render(c, time) {
    c.save();
    c.translate(this.x, this.y);

    const isCharging = this.isSmashing || (this.isAttacking && this.attackTimer > 12);
    const isAwakened = this.hp < this.data.maxHp * 0.35 || this.kiGauge >= 100;

    if (isCharging || isAwakened) {
      this.renderKiAura(c, time, isAwakened);
    }

    if (this.isShielding) {
      c.save();
      c.strokeStyle = this.data.accent;
      c.fillStyle = this.data.auraColor;
      c.lineWidth = 4;
      c.beginPath();
      c.arc(0, -this.h * 0.5, this.h * 0.65, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.restore();
    }

    c.fillStyle = 'rgba(0, 0, 0, 0.45)';
    c.beginPath();
    c.ellipse(0, -2, this.w * 0.85, 10, 0, 0, Math.PI * 2);
    c.fill();

    c.scale(this.facing, 1);
    this.renderFighterBody(c, time);

    c.restore();
  }

  renderKiAura(c, time, isAwakened) {
    c.save();
    const auraCol = isAwakened ? '#f43f5e' : this.data.accent;
    const hAura = this.h * 1.35;
    const wAura = this.w * 1.6;

    for (let k = 0; k < 8; k++) {
      const ang = (Math.PI / 4) * k;
      const flicker = Math.sin(time * 0.35 + k) * 14;
      const flameH = -hAura - (k % 2 === 0 ? 35 : 18) - flicker;

      c.fillStyle = (k % 2 === 0) ? auraCol : 'rgba(255, 255, 255, 0.75)';
      c.globalAlpha = 0.55;
      c.beginPath();
      c.moveTo(-wAura * 0.5, 0);
      c.quadraticCurveTo(Math.cos(ang) * wAura, flameH * 0.6, 0, flameH);
      c.quadraticCurveTo(-Math.cos(ang) * wAura, flameH * 0.6, wAura * 0.5, 0);
      c.fill();
    }

    c.strokeStyle = '#e0f2fe';
    c.lineWidth = 2.5;
    for (let e = 0; e < 4; e++) {
      const ey = -Math.random() * hAura;
      c.beginPath();
      c.moveTo(-wAura * 0.5, ey);
      c.lineTo(-wAura * 0.2, ey - 15);
      c.lineTo(wAura * 0.2, ey - 5);
      c.lineTo(wAura * 0.5, ey - 22);
      c.stroke();
    }
    c.restore();
  }

  renderFighterBody(c, time) {
    const w = this.w;
    const h = this.h;
    const d = this.data;

    c.save();
    c.strokeStyle = '#050308';
    c.lineWidth = 3.5;
    c.lineJoin = 'round';

    const breath = Math.sin(time * 0.1) * 2;

    // 1. Jambes & Bottes
    c.fillStyle = d.giColor;
    c.beginPath();
    c.roundRect(-w * 0.42, -h * 0.44 + breath, w * 0.36, h * 0.44, 4);
    c.roundRect(w * 0.04, -h * 0.44 + breath, w * 0.36, h * 0.44, 4);
    c.fill();
    c.stroke();

    c.fillStyle = d.sashColor;
    c.beginPath();
    c.roundRect(-w * 0.44, -h * 0.18 + breath, w * 0.4, h * 0.18, [0, 0, 4, 4]);
    c.roundRect(w * 0.02, -h * 0.18 + breath, w * 0.4, h * 0.18, [0, 0, 4, 4]);
    c.fill();
    c.stroke();

    // 2. Torse
    c.fillStyle = d.giColor;
    c.beginPath();
    c.roundRect(-w * 0.46, -h * 0.78 + breath, w * 0.92, h * 0.36, 6);
    c.fill();
    c.stroke();

    c.fillStyle = d.giShadow;
    c.beginPath();
    c.moveTo(-w * 0.46, -h * 0.78 + breath);
    c.lineTo(-w * 0.2, -h * 0.5 + breath);
    c.lineTo(-w * 0.46, -h * 0.5 + breath);
    c.fill();

    // Ceinture / Écharpe
    c.fillStyle = d.sashColor;
    c.beginPath();
    c.roundRect(-w * 0.5, -h * 0.46 + breath, w * 1.0, h * 0.09, 3);
    c.fill();
    c.stroke();

    const sashSway = Math.sin(time * 0.2) * 8;
    c.beginPath();
    c.moveTo(-w * 0.1, -h * 0.4 + breath);
    c.quadraticCurveTo(-w * 0.3 + sashSway, -h * 0.2, -w * 0.25 + sashSway, -h * 0.05);
    c.lineTo(-w * 0.1 + sashSway, -h * 0.05);
    c.quadraticCurveTo(-w * 0.15 + sashSway, -h * 0.2, 0, -h * 0.4 + breath);
    c.fill();
    c.stroke();

    // Médaillon Céleste
    c.fillStyle = d.accent;
    c.beginPath();
    c.arc(0, -h * 0.65 + breath, w * 0.16, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // 3. Tête & Visage
    c.fillStyle = d.skinColor;
    c.beginPath();
    c.moveTo(-w * 0.32, -h * 0.9 + breath);
    c.lineTo(-w * 0.28, -h * 0.78 + breath);
    c.lineTo(0, -h * 0.73 + breath);
    c.lineTo(w * 0.28, -h * 0.78 + breath);
    c.lineTo(w * 0.32, -h * 0.9 + breath);
    c.closePath();
    c.fill();
    c.stroke();

    // Yeux Anime
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.ellipse(w * 0.12, -h * 0.83 + breath, w * 0.11, w * 0.07, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.fillStyle = d.eyeColor;
    c.beginPath();
    c.arc(w * 0.14, -h * 0.83 + breath, w * 0.05, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#ffffff';
    c.beginPath();
    c.arc(w * 0.16, -h * 0.84 + breath, 2, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = d.hairShadow;
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(0, -h * 0.88 + breath);
    c.lineTo(w * 0.24, -h * 0.87 + breath);
    c.stroke();

    // 4. Coiffure selon le type du personnage
    c.strokeStyle = '#050308';
    c.lineWidth = 3.5;
    c.fillStyle = d.hairColor;
    c.beginPath();

    if (d.hairType === 'cowl') {
      // Capuche d'assassin mystique
      c.arc(0, -h * 0.88 + breath, w * 0.44, Math.PI, 0);
      c.lineTo(w * 0.45, -h * 0.75 + breath);
      c.lineTo(-w * 0.45, -h * 0.75 + breath);
      c.closePath();
      c.fill();
      c.stroke();
    } else if (d.hairType === 'helmet') {
      // Casque / Heaume blindé à cornes
      c.arc(0, -h * 0.9 + breath, w * 0.42, Math.PI, 0);
      c.lineTo(w * 0.6, -h * 1.15 + breath);
      c.lineTo(w * 0.35, -h * 0.95 + breath);
      c.lineTo(-w * 0.35, -h * 0.95 + breath);
      c.lineTo(-w * 0.6, -h * 1.15 + breath);
      c.closePath();
      c.fill();
      c.stroke();
    } else if (d.hairType === 'long') {
      // Longue chevelure flottante
      c.moveTo(-w * 0.4, -h * 0.88 + breath);
      c.lineTo(-w * 0.55, -h * 1.15 + breath);
      c.lineTo(-w * 0.2, -h * 1.05 + breath);
      c.lineTo(0, -h * 1.25 + breath);
      c.lineTo(w * 0.2, -h * 1.05 + breath);
      c.lineTo(w * 0.55, -h * 1.15 + breath);
      c.lineTo(w * 0.4, -h * 0.88 + breath);
      c.lineTo(w * 0.5, -h * 0.55 + breath);
      c.lineTo(-w * 0.5, -h * 0.55 + breath);
      c.closePath();
      c.fill();
      c.stroke();
    } else {
      // Chevelure manga spiky / Super Saiyan
      c.moveTo(-w * 0.35, -h * 0.88 + breath);
      c.lineTo(-w * 0.65, -h * 1.05 + breath);
      c.lineTo(-w * 0.25, -h * 0.98 + breath);
      c.lineTo(-w * 0.45, -h * 1.25 + breath);
      c.lineTo(-w * 0.05, -h * 1.05 + breath);
      c.lineTo(w * 0.1, -h * 1.35 + breath);
      c.lineTo(w * 0.25, -h * 1.05 + breath);
      c.lineTo(w * 0.65, -h * 1.25 + breath);
      c.lineTo(w * 0.4, -h * 0.95 + breath);
      c.lineTo(w * 0.65, -h * 0.88 + breath);
      c.lineTo(w * 0.35, -h * 0.82 + breath);
      c.closePath();
      c.fill();
      c.stroke();
    }

    // 5. Bras & Position d'Attaque
    if (this.isAttacking) {
      c.fillStyle = d.giColor;
      c.beginPath();
      c.roundRect(w * 0.2, -h * 0.72 + breath, w * 0.85, h * 0.2, 4);
      c.fill();
      c.stroke();

      c.fillStyle = d.accent;
      c.beginPath();
      c.arc(w * 1.08, -h * 0.62 + breath, w * 0.24, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    } else {
      c.fillStyle = d.giColor;
      c.beginPath();
      c.roundRect(w * 0.05, -h * 0.72 + breath, w * 0.32, h * 0.38, 4);
      c.fill();
      c.stroke();
    }

    c.restore();
  }
}

window.SkyChordGame = SkyChordGame;
window.FIGHTERS_DATA = FIGHTERS_DATA;
