import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

// ---------- CONFIG ----------
const MAX_PLAYERS = 10;

// ---------- HERO DATA ----------
const HEROES = {
    KAI: {
        id: "KAI", icon: "🎯", name: "KAI 🎯", color: 0x3c4f8f, glow: 0x88bfff, primaryWeapon: "VOID BOW",
        role: "Shadow Archer",
        desc: "Expert archer who strikes from the dark with piercing energy arrows.",
        damage: 28, fireRate: 0.32,
        skill1: { name: "SHADOW ARROW", desc: "Piercing attack" },
        skill2: { name: "PHASE SHIFT", desc: "Quick heal" },
        skill3: { name: "DUSK RAIN", desc: "Storm arrow volley" }
    },
    ZEA: {
        id: "ZEA", icon: "🔥", name: "ZEA 🔥", color: 0xd14427, glow: 0xffb774, primaryWeapon: "EMBER SWORD",
        role: "Flame Knight",
        desc: "Blazing swordsman who burns rivals with swift close combat.",
        damage: 30, fireRate: 0.30,
        skill1: { name: "BLAZE SLASH", desc: "Heat wave strike" },
        skill2: { name: "EMBER GUARD", desc: "Shield and heal" },
        skill3: { name: "INFERNO RUSH", desc: "Explosive charge" }
    },
    EON: {
        id: "EON", icon: "🌀", name: "EON 🌀", color: 0x2b6a8f, glow: 0x88d4ff, primaryWeapon: "AETHER STAFF",
        role: "Quantum Mage",
        desc: "Master of time and space with mystic bolts and area control.",
        damage: 24, fireRate: 0.34,
        skill1: { name: "TIME LANCE", desc: "Temporal strike" },
        skill2: { name: "AETHER BARRIER", desc: "Slow and restore" },
        skill3: { name: "QUANTUM SURGE", desc: "Massive arcane burst" }
    },
    SYLA: {
        id: "SYLA", icon: "🌿", name: "SYLA 🌿", color: 0x3a7f44, glow: 0x9effa1, primaryWeapon: "VINE WHIP",
        role: "Forest Warden",
        desc: "Nature sentinel who roots enemies and heals the battlefield.",
        damage: 22, fireRate: 0.36,
        skill1: { name: "ROOT SNARE", desc: "Immobilizes foes" },
        skill2: { name: "GROWTH BLESSING", desc: "Heals allies" },
        skill3: { name: "WILLOW STORM", desc: "Area entangle" }
    },
    DRAV: {
        id: "DRAV", icon: "💥", name: "DRAV 💥", color: 0xa12e1b, glow: 0xff8866, primaryWeapon: "MAGMA HAMMER",
        role: "Volcanic Brute",
        desc: "Tank warrior that shatters ground with molten power.",
        damage: 32, fireRate: 0.28,
        skill1: { name: "MOLTEN SWING", desc: "Heavy smash" },
        skill2: { name: "LAVA SHIELD", desc: "Reduces damage" },
        skill3: { name: "ERUPTION", desc: "Explosive ground slam" }
    }
};

// MAPS
const MAPS = {
    ARENA: { name: "1. CHIBY ARENA", bgColor: 0x111629, groundColor: 0x3f3b5a, skyColor: 0x13182e, decoType: "arena" },
    PIRATE: { name: "2. PIRATE COVE", bgColor: 0x142442, groundColor: 0x253f6c, skyColor: 0x101a30, decoType: "pirate" },
    VOLCANO: { name: "3. VOLCANO PEAK", bgColor: 0x170d0d, groundColor: 0x3d1d10, skyColor: 0x221213, decoType: "volcano" }
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a2a);
scene.fog = new THREE.FogExp2(0x0a0a2a, 0.008);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 400);
camera.position.set(0, 1.65, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.75, 0.45, 0.18);
bloomPass.threshold = 0.2;
bloomPass.strength = 0.9;
bloomPass.radius = 0.35;
composer.addPass(bloomPass);
composer.addPass(new SMAAPass(window.innerWidth, window.innerHeight));

const ambientLight = new THREE.HemisphereLight(0x7788aa, 0x221100, 0.55);
scene.add(ambientLight);
const mainLight = new THREE.DirectionalLight(0xfff7cc, 1.5);
mainLight.position.set(7, 16, 8);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(2048, 2048);
mainLight.shadow.camera.left = -25;
mainLight.shadow.camera.right = 25;
mainLight.shadow.camera.top = 25;
mainLight.shadow.camera.bottom = -25;
scene.add(mainLight);
const rimLight = new THREE.DirectionalLight(0x5588ff, 0.45);
rimLight.position.set(-8, 5, -7);
scene.add(rimLight);
const fillLight = new THREE.PointLight(0x6699ff, 0.35, 30);
fillLight.position.set(-4, 5, 5);
scene.add(fillLight);

class ChibiFighter {
    constructor(id, name, heroType, isBot, startX, startZ) {
        this.id = id;
        this.name = name;
        this.heroType = heroType;
        this.isBot = isBot;
        this.health = 100;
        this.maxHealth = 100;
        this.position = { x: startX, z: startZ };
        this.mesh = null;
        this.label = null;
        this.speed = 4.6;
        this.attackCooldown = 0;
        this.ammo = 30;
        this.reserveAmmo = 90;
        this.skillCooldowns = [0, 0, 0];
    }

    createModel() {
        this.mesh = new THREE.Group();
        this.mesh.position.set(this.position.x, 0, this.position.z);
        scene.add(this.mesh);

        const bodyGroup = new THREE.Group();
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd7bc, roughness: 0.22, metalness: 0.03, emissive: 0x110000, emissiveIntensity: 0.02 });
        const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 32), skinMat);
        headMesh.position.y = 0.82;
        headMesh.castShadow = true;
        bodyGroup.add(headMesh);

        const faceDetail = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 26), new THREE.MeshStandardMaterial({ color: 0xffdbc7, roughness: 0.22, metalness: 0.02 }));
        faceDetail.position.set(0, 0.74, 0.08);
        faceDetail.scale.set(1, 0.85, 0.96);
        faceDetail.castShadow = true;
        bodyGroup.add(faceDetail);

        const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
        const irisMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.1 });
        const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeWhiteMat);
        const rightEye = leftEye.clone();
        leftEye.position.set(-0.16, 0.78, 0.38);
        rightEye.position.set(0.16, 0.78, 0.38);
        const leftIris = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), irisMat);
        const rightIris = leftIris.clone();
        leftIris.position.set(-0.16, 0.78, 0.44);
        rightIris.position.set(0.16, 0.78, 0.44);
        bodyGroup.add(leftEye, rightEye, leftIris, rightIris);

        const blushMat = new THREE.MeshStandardMaterial({ color: 0xffa0b3, roughness: 0.35 });
        const blushLeft = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), blushMat);
        const blushRight = blushLeft.clone();
        blushLeft.position.set(-0.22, 0.74, 0.3);
        blushRight.position.set(0.22, 0.74, 0.3);
        bodyGroup.add(blushLeft, blushRight);

        const bodyMat = new THREE.MeshStandardMaterial({
            color: HEROES[this.heroType].color,
            roughness: 0.36,
            metalness: 0.15,
            emissive: 0x000000,
            emissiveIntensity: 0.05
        });
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.38, 0.6, 24), bodyMat);
        torso.position.y = 0.22;
        torso.castShadow = true;
        bodyGroup.add(torso);

        const waistMat = new THREE.MeshStandardMaterial({ color: 0x2b2f3f, roughness: 0.55, metalness: 0.2 });
        const belt = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.1, 0.22), waistMat);
        belt.position.set(0, 0.02, 0.16);
        belt.castShadow = true;
        bodyGroup.add(belt);

        const armMat = new THREE.MeshStandardMaterial({ color: HEROES[this.heroType].color, roughness: 0.4, metalness: 0.12 });
        const makeArm = (side) => {
            const arm = new THREE.Group();
            const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 14), armMat);
            upper.rotation.z = Math.PI / 2;
            upper.position.set(side * 0.27, 0.34, 0);
            upper.castShadow = true;
            const hand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), skinMat);
            hand.position.set(side * 0.55, 0.34, 0);
            hand.castShadow = true;
            arm.add(upper, hand);
            return arm;
        };
        bodyGroup.add(makeArm(-1), makeArm(1));

        const legMat = new THREE.MeshStandardMaterial({ color: 0x1c2237, roughness: 0.65, metalness: 0.18 });
        const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.38, 14), legMat);
        leftLeg.position.set(-0.14, -0.32, 0);
        leftLeg.castShadow = true;
        const rightLeg = leftLeg.clone();
        rightLeg.position.x = 0.14;
        const bootMat = new THREE.MeshStandardMaterial({ color: 0x262c45, roughness: 0.45, metalness: 0.3 });
        const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.22), bootMat);
        leftBoot.position.set(-0.14, -0.54, 0.08);
        leftBoot.castShadow = true;
        const rightBoot = leftBoot.clone();
        rightBoot.position.x = 0.14;
        bodyGroup.add(leftLeg, rightLeg, leftBoot, rightBoot);

        // Generic hero appearance for all current heroes
        this.mesh.add(bodyGroup);

        const div = document.createElement('div');
        div.textContent = `${this.name} ❤️ ${Math.floor(this.health)}`;
        div.style.background = 'rgba(0,0,0,0.8)';
        div.style.color = '#ffdd99';
        div.style.padding = '3px 10px';
        div.style.borderRadius = '20px';
        div.style.fontWeight = 'bold';
        div.style.fontSize = '11px';
        div.style.border = `1px solid ${new THREE.Color(HEROES[this.heroType].color).getStyle()}`;
        this.label = new CSS2DObject(div);
        this.label.position.set(0, 1.45, 0);
        this.mesh.add(this.label);
    }

    updateLabel() {
        if (this.label && this.label.element) this.label.element.textContent = `${this.name} ❤️ ${Math.max(0, Math.floor(this.health))}`;
    }

    setPosition(x, z) {
        const bound = 26;
        this.position.x = Math.min(bound, Math.max(-bound, x));
        this.position.z = Math.min(bound, Math.max(-bound, z));
        if (this.mesh) this.mesh.position.set(this.position.x, 0, this.position.z);
    }

    damage(amount, sourceId) {
        this.health = Math.max(0, this.health - amount);
        this.updateLabel();
        if (this.health <= 0) {
            addKillMessage(`${this.name} was defeated!`);
            if (sourceId !== undefined && sourceId !== this.id) {
                const killer = fighters.find(f => f.id === sourceId);
                if (killer && !killer.isBot && killer.id === localPlayer?.id) {
                    if (killer.ammo + 12 <= 30) killer.ammo += 12; else killer.ammo = 30;
                    updateAmmoUI();
                    advanceMission(1);
                }
            }
            this.respawn();
        }
        updateLobbyCount();
    }

    respawn() {
        this.health = this.maxHealth;
        this.ammo = 30;
        this.reserveAmmo = 90;
        const randX = (Math.random() - 0.5) * 44;
        const randZ = (Math.random() - 0.5) * 44;
        this.setPosition(randX, randZ);
        this.updateLabel();
        if (!this.isBot && this.id === localPlayer?.id) updateAmmoUI();
    }

    shoot() {
        if (this.attackCooldown > 0) return false;
        if (this.ammo <= 0) {
            if (this.reserveAmmo > 0) {
                let needed = Math.min(30 - this.ammo, this.reserveAmmo);
                this.ammo += needed;
                this.reserveAmmo -= needed;
                if (!this.isBot && this.id === localPlayer?.id) { updateAmmoUI(); addKillMessage("🔁 Reloaded!"); }
            }
            return false;
        }
        this.attackCooldown = HEROES[this.heroType].fireRate;
        this.ammo--;
        if (!this.isBot && this.id === localPlayer?.id) updateAmmoUI();
        return true;
    }
}

let fighters = [];
let localPlayer = null;
let currentMapId = "ARENA";
let lastFrameTime = performance.now();
let yawAngle = -Math.PI / 3;
let pitchAngle = 0;
let mouseX = 0, mouseY = 0;
const keyStates = { w: false, s: false, a: false, d: false };
let gameActive = false;
let selectedMission = null;
let missionProgress = 0;
const MISSIONS = [
    { id: 'ARENA_STRIKE', name: 'Arena Strike', desc: 'Defeat 4 enemies in the arena.', goal: 4 },
    { id: 'PIRATE_HUNT', name: 'Pirate Hunt', desc: 'Defeat 5 enemies guarding the cove.', goal: 5 },
    { id: 'VOLCANO_SURGE', name: 'Volcano Surge', desc: 'Survive and defeat 3 enemies near the lava pit.', goal: 3 }
];
Object.defineProperty(window, 'gameActive', {
    get() { return gameActive; },
    set(value) { gameActive = value; }
});
Object.defineProperty(window, 'localPlayer', {
    get() { return localPlayer; },
    set(value) { localPlayer = value; }
});
window.scene = scene;
window.camera = camera;
window.renderer = renderer;
window.composer = composer;

function addKillMessage(msg) {
    const feed = document.getElementById('killFeed');
    const entry = document.createElement('div');
    entry.className = 'kill-entry';
    entry.textContent = `💀 ${msg}`;
    feed.appendChild(entry);
    setTimeout(() => entry.remove(), 5000);
}

function updateLobbyCount() {
    const alive = fighters.filter(f => f.health > 0).length;
    document.getElementById('playerCountDisplay').innerHTML = `👥 ${alive}/${MAX_PLAYERS}`;
}

function updateAmmoUI() {
    if (localPlayer) {
        document.getElementById('ammoText').innerHTML = `${localPlayer.ammo}/${localPlayer.reserveAmmo}`;
        document.getElementById('healthFillBar').style.width = `${(localPlayer.health/localPlayer.maxHealth)*100}%`;
    }
}

function updateHeroPreview(heroId) {
    const hero = HEROES[heroId];
    if (!hero) return;
    const heroIcon = document.getElementById('heroPreviewIcon');
    const heroName = document.getElementById('heroPreviewName');
    const heroRole = document.getElementById('heroPreviewRole');
    const heroDesc = document.getElementById('heroPreviewDesc');
    const heroWeapon = document.getElementById('heroPreviewWeapon');
    const heroSkill1 = document.getElementById('heroPreviewSkill1');
    const heroSkill2 = document.getElementById('heroPreviewSkill2');
    const heroSkill3 = document.getElementById('heroPreviewSkill3');
    if (!heroIcon || !heroName || !heroRole || !heroDesc || !heroWeapon || !heroSkill1 || !heroSkill2 || !heroSkill3) return;
    heroIcon.textContent = hero.icon || '✨';
    heroName.textContent = hero.name;
    heroRole.textContent = hero.role || '';
    heroDesc.textContent = hero.desc || '';
    heroWeapon.textContent = hero.primaryWeapon;
    heroSkill1.textContent = hero.skill1.name;
    heroSkill2.textContent = hero.skill2.name;
    heroSkill3.textContent = hero.skill3.name;
}

function updateMissionPreview(missionId) {
    const mission = MISSIONS.find(m => m.id === missionId) || MISSIONS[0];
    if (!mission) return;
    const missionName = document.getElementById('missionPreviewName');
    const missionDesc = document.getElementById('missionPreviewDesc');
    const missionGoal = document.getElementById('missionPreviewGoal');
    if (!missionName || !missionDesc || !missionGoal) {
        console.warn('Mission preview elements were not found before updateMissionPreview.');
        return;
    }
    selectedMission = mission.id;
    missionProgress = 0;
    missionName.textContent = mission.name;
    missionDesc.textContent = mission.desc;
    missionGoal.textContent = `0 / ${mission.goal}`;
}

function advanceMission(amount = 1) {
    if (!selectedMission) return;
    const mission = MISSIONS.find(m => m.id === selectedMission);
    if (!mission) return;
    const missionGoal = document.getElementById('missionPreviewGoal');
    if (!missionGoal) return;
    missionProgress = Math.min(mission.goal, missionProgress + amount);
    missionGoal.textContent = `${missionProgress} / ${mission.goal}`;
    if (missionProgress >= mission.goal) {
        addKillMessage(`🎉 Mission complete: ${mission.name}`);
        selectedMission = null;
    }
}

function setupMissionSelector() {
    const container = document.getElementById('missionSelector');
    if (!container) {
        console.warn('Mission selector container not found.');
        return;
    }
    container.innerHTML = '';
    MISSIONS.forEach(mission => {
        const card = document.createElement('div');
        card.className = 'mission-card';
        card.dataset.mission = mission.id;
        card.innerHTML = `<strong>${mission.name}</strong><span>${mission.desc}</span>`;
        card.addEventListener('click', () => {
            document.querySelectorAll('.mission-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            updateMissionPreview(mission.id);
        });
        container.appendChild(card);
    });
    const initial = container.querySelector('.mission-card');
    if (initial) {
        initial.classList.add('selected');
        selectedMission = initial.dataset.mission;
        updateMissionPreview(selectedMission);
    }
}

function buildMap(mapId) {
    const toRemove = [];
    scene.children.forEach(child => { if (child.userData && child.userData.isMapPart) toRemove.push(child); });
    toRemove.forEach(item => scene.remove(item));
    const mapData = MAPS[mapId];
    scene.background = new THREE.Color(mapData.bgColor);
    scene.fog.color = new THREE.Color(mapData.bgColor);
    scene.fog.density = 0.007;

    const groundMat = new THREE.MeshStandardMaterial({ color: mapData.groundColor, roughness: 0.9, metalness: 0.05 });
    const groundPlane = new THREE.Mesh(new THREE.PlaneGeometry(72, 72), groundMat);
    groundPlane.rotation.x = -Math.PI/2;
    groundPlane.position.y = -0.75;
    groundPlane.receiveShadow = true;
    groundPlane.userData = { isMapPart: true };
    scene.add(groundPlane);

    const borderMat = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.8, metalness: 0.1 });
    const border = new THREE.Mesh(new THREE.RingGeometry(30.5, 33, 64), borderMat);
    border.rotation.x = -Math.PI/2;
    border.position.y = -0.73;
    border.userData = { isMapPart: true };
    scene.add(border);

    const floorDecoMat = new THREE.MeshStandardMaterial({ color: 0x5f5c6f, roughness: 0.95 });
    for (let i = 0; i < 5; i++) {
        const tile = new THREE.Mesh(new THREE.BoxGeometry(6, 0.02, 6), floorDecoMat);
        tile.position.set((i - 2) * 7, -0.74, -3);
        tile.userData = { isMapPart: true };
        scene.add(tile);
    }

    const createCrate = (x, z, scale=1) => {
        const crate = new THREE.Mesh(new THREE.BoxGeometry(0.9 * scale, 0.9 * scale, 0.9 * scale),
            new THREE.MeshStandardMaterial({ color: 0x8b6b4d, roughness: 0.75 }));
        crate.position.set(x, -0.24 + 0.45*scale, z);
        crate.castShadow = true;
        crate.userData = { isMapPart: true };
        scene.add(crate);
    };

    const createBarrel = (x, z) => {
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.6, 12),
            new THREE.MeshStandardMaterial({ color: 0x6a3f1d, roughness: 0.8 }));
        barrel.position.set(x, -0.45 + 0.3, z);
        barrel.castShadow = true;
        barrel.userData = { isMapPart: true };
        scene.add(barrel);
    };

    const createRock = (x, z, color, emissive) => {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 0),
            new THREE.MeshStandardMaterial({ color, emissive, roughness: 0.85 }));
        rock.position.set(x, -0.58, z);
        rock.castShadow = true;
        rock.userData = { isMapPart: true };
        scene.add(rock);
    };

    if (mapData.decoType === "arena") {
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x5a5869, roughness: 0.9 });
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x37364a, roughness: 0.85 });
        const central = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.5, 16), stoneMat);
        central.position.set(0, -0.5, 0);
        central.receiveShadow = true;
        central.userData = { isMapPart: true };
        scene.add(central);
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.2, 12), wallMat);
            pillar.position.set(Math.cos(angle) * 10.5, -0.5, Math.sin(angle) * 10.5);
            pillar.castShadow = true;
            pillar.userData = { isMapPart: true };
            scene.add(pillar);
            createCrate(Math.cos(angle) * 8.2, Math.sin(angle) * 8.2, 1.1);
        }
        for (let i=0; i<8; i += 2) {
            const connector = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 1.2), wallMat);
            connector.position.set(Math.cos(i * Math.PI/4) * 7.5, -0.3, Math.sin(i * Math.PI/4) * 7.5);
            connector.rotation.y = i % 4 === 0 ? 0 : Math.PI/2;
            connector.userData = { isMapPart: true };
            scene.add(connector);
        }
        for (let i = 0; i < 12; i++) {
            const theta = Math.random() * Math.PI * 2;
            const radius = 18 + Math.random() * 6;
            createCrate(Math.cos(theta) * radius, Math.sin(theta) * radius, 0.8 + Math.random()*0.4);
        }
    } else if (mapData.decoType === "pirate") {
        const waterMat = new THREE.MeshStandardMaterial({ color: 0x1d4b8f, roughness: 0.6, transparent: true, opacity: 0.9 });
        const water = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), waterMat);
        water.rotation.x = -Math.PI/2;
        water.position.y = -0.72;
        water.receiveShadow = true;
        water.userData = { isMapPart: true };
        scene.add(water);

        const deckMat = new THREE.MeshStandardMaterial({ color: 0x6d4b32, roughness: 0.9 });
        for (let i = -2; i <= 2; i++) {
            const plank = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 4), deckMat);
            plank.position.set(i * 11, -0.5, 0);
            plank.rotation.y = Math.PI / 20 * i;
            plank.receiveShadow = true;
            plank.userData = { isMapPart: true };
            scene.add(plank);
        }
        for (let i = 0; i < 7; i++) createBarrel(-14 + i * 4, 6 - (i % 2) * 2);
        createCrate(18, -6, 1.2);
        createCrate(14, 8, 1);
        createCrate(-16, -8, 1);

        const ship = new THREE.Group();
        const hull = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.8, 1.8), deckMat);
        hull.position.set(0, -0.4, -2.4);
        ship.add(hull);
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5, 8), new THREE.MeshStandardMaterial({ color: 0x3f2a1a }));
        mast.position.set(0, 1.0, -2.4);
        ship.add(mast);
        const sail = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.4), new THREE.MeshStandardMaterial({ color: 0xf1f0e0, side: THREE.DoubleSide }));
        sail.position.set(0, 1.0, -2.4);
        sail.rotation.y = Math.PI / 2;
        ship.add(sail);
        ship.position.set(-6, -0.25, 12);
        ship.userData = { isMapPart: true };
        ship.traverse(c => { if (c.isMesh) c.castShadow = true; });
        scene.add(ship);

        for (let i = 0; i < 18; i++) {
            const rockX = Math.cos(i * Math.PI / 9) * 20;
            const rockZ = Math.sin(i * Math.PI / 9) * 20;
            createRock(rockX, rockZ, 0x4b4f52, 0x112233);
        }
    } else if (mapData.decoType === "volcano") {
        const lavaMat = new THREE.MeshStandardMaterial({ color: 0xff5e2e, emissive: 0xff2e00, emissiveIntensity: 0.85, roughness: 0.7 });
        const lava = new THREE.Mesh(new THREE.CircleGeometry(24, 64), lavaMat);
        lava.rotation.x = -Math.PI/2;
        lava.position.y = -0.74;
        lava.userData = { isMapPart: true };
        scene.add(lava);

        const rockMat = new THREE.MeshStandardMaterial({ color: 0x3d2d28, roughness: 0.95 });
        const center = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 0.9, 20), rockMat);
        center.position.set(0, -0.2, 0);
        center.castShadow = true;
        center.receiveShadow = true;
        center.userData = { isMapPart: true };
        scene.add(center);

        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const bridge = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, 2.2), rockMat);
            bridge.position.set(Math.cos(angle) * 13, -0.4, Math.sin(angle) * 13);
            bridge.rotation.y = angle;
            bridge.castShadow = true;
            bridge.userData = { isMapPart: true };
            scene.add(bridge);
        }

        for (let i = 0; i < 14; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 16 + Math.random() * 7;
            const spike = new THREE.Mesh(new THREE.ConeGeometry(0.65, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0x4c3831, emissive: 0x260f09 }));
            spike.position.set(Math.cos(angle) * radius, -0.1, Math.sin(angle) * radius);
            spike.rotation.x = Math.PI;
            spike.castShadow = true;
            spike.userData = { isMapPart: true };
            scene.add(spike);
        }

        for (let i = 0; i < 8; i++) {
            const light = new THREE.PointLight(0xff6600, 1.2, 8);
            light.position.set(Math.cos(i * Math.PI / 4) * 10.5, 0.5, Math.sin(i * Math.PI / 4) * 10.5);
            light.userData = { isMapPart: true };
            scene.add(light);
        }
    }

    const particleCount = 600;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        pos[i*3] = (Math.random()-0.5) * 110;
        pos[i*3+1] = Math.random() * 18 + 1;
        pos[i*3+2] = (Math.random()-0.5) * 110;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const glow = new THREE.PointsMaterial({ color: 0xffcc88, size: 0.08, transparent: true, opacity: 0.7 });
    const dust = new THREE.Points(geo, glow);
    dust.userData = { isMapPart: true };
    scene.add(dust);
}

function clearGame() {
    if (fighters.length) {
        fighters.forEach(fighter => {
            if (fighter.mesh) scene.remove(fighter.mesh);
            if (fighter.label) scene.remove(fighter.label);
        });
        fighters = [];
        localPlayer = null;
    }
    const toRemove = [];
    scene.children.forEach(child => { if (child.userData && child.userData.isMapPart) toRemove.push(child); });
    toRemove.forEach(item => scene.remove(item));
}

function initFighters(selectedHeroId) {
    fighters = [];
    const heroOptions = ["KAI","ZEA","EON","SYLA","DRAV"];
    for (let i=0;i<MAX_PLAYERS;i++) {
        const isBot = i !== 0;
        let heroPick;
        if (!isBot) heroPick = selectedHeroId;
        else heroPick = heroOptions[i % heroOptions.length];
        const playerName = isBot ? `BOT_${i}` : "🔥 CHIBI CHAMPION";
        const startX = (Math.random() - 0.5) * 40;
        const startZ = (Math.random() - 0.5) * 40;
        const fighter = new ChibiFighter(i, playerName, heroPick, isBot, startX, startZ);
        fighters.push(fighter);
        fighter.createModel();
        if (!isBot) {
            localPlayer = fighter;
            document.getElementById('playerNameDisplay').innerHTML = `⚔️ ${HEROES[heroPick].name}`;
            document.getElementById('weaponDisplay').innerHTML = `🔫 ${HEROES[heroPick].primaryWeapon}`;
            document.getElementById('skill1Btn').innerHTML = `✨ ${HEROES[heroPick].skill1.name}`;
            document.getElementById('skill2Btn').innerHTML = `🛡️ ${HEROES[heroPick].skill2.name}`;
            document.getElementById('skill3Btn').innerHTML = `⭐ ${HEROES[heroPick].skill3.name}`;
        }
    }
    updateLobbyCount();
    updateAmmoUI();
}

function exitToMenu() {
    if (!gameActive) return;
    gameActive = false;
    if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
    }
    clearGame();
    const menu = document.getElementById('gameMenu');
    menu.style.display = 'flex';
    menu.style.opacity = '1';
    document.getElementById('exitGameBtn').style.display = 'none';
    localPlayer = null;
    fighters = [];
    document.getElementById('killFeed').innerHTML = '';
}

function raycastHitEnemy(origin, direction) {
    let closest=null, minD=999;
    for(let f of fighters) {
        if(f===localPlayer||f.health<=0) continue;
        const toF=new THREE.Vector3(f.position.x,0.8,f.position.z).sub(origin);
        const d=toF.length();
        const dot=direction.clone().normalize().dot(toF.clone().normalize());
        if(dot>0.85 && d<3.7 && d<minD) { minD=d; closest=f; }
    }
    return closest;
}

function createMuzzleFlash(pos,dir){ const f=new THREE.PointLight(0xffaa66,1.2,6); f.position.copy(pos.clone().add(dir.clone().multiplyScalar(0.6))); scene.add(f); setTimeout(()=>scene.remove(f),70); }
function getClosestEnemy(){ if(!localPlayer)return null; let c=null,minD=Infinity; for(let f of fighters) if(f!==localPlayer&&f.health>0){ const d=Math.hypot(f.position.x-localPlayer.position.x, f.position.z-localPlayer.position.z); if(d<minD){minD=d;c=f;} } return c; }
function areaDamage(dmg,source){ for(let f of fighters) if(f!==source&&f.health>0&&Math.hypot(f.position.x-source.position.x,f.position.z-source.position.z)<6) f.damage(dmg,source.id); }
function createBeamEffect(s,t){ if(t&&t.mesh){ const pts=[s.mesh.position.clone(), t.mesh.position.clone()]; const geo=new THREE.BufferGeometry().setFromPoints(pts); const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xffaa66})); scene.add(line); setTimeout(()=>scene.remove(line),180); } }
function createShieldEffect(f){ const s=new THREE.Mesh(new THREE.SphereGeometry(0.95,16,16),new THREE.MeshStandardMaterial({color:0xffcc88,emissive:0xff8844,transparent:true})); s.position.copy(f.mesh.position); scene.add(s); setTimeout(()=>scene.remove(s),1000); }
function useHeroSkill(idx){
    if(!localPlayer||localPlayer.skillCooldowns[idx]>0) return;
    localPlayer.skillCooldowns[idx]=7.5;
    const hero=localPlayer.heroType, target=getClosestEnemy();
    if (idx === 0) {
        if (hero === 'KAI') {
            if (target) target.damage(38, localPlayer.id);
            createBeamEffect(localPlayer, target);
            addKillMessage(`🎯 ${HEROES.KAI.skill1.name}!`);
        } else if (hero === 'ZEA') {
            if (target) target.damage(36, localPlayer.id);
            createMuzzleFlash(localPlayer.mesh.position, new THREE.Vector3(Math.random(), 0, Math.random()).normalize());
            addKillMessage(`🔥 ${HEROES.ZEA.skill1.name}!`);
        } else if (hero === 'EON') {
            if (target) target.damage(34, localPlayer.id);
            addKillMessage(`🌀 ${HEROES.EON.skill1.name}!`);
        } else if (hero === 'SYLA') {
            if (target) target.damage(28, localPlayer.id);
            addKillMessage(`🌿 ${HEROES.SYLA.skill1.name}!`);
        } else if (hero === 'DRAV') {
            if (target) target.damage(40, localPlayer.id);
            addKillMessage(`💥 ${HEROES.DRAV.skill1.name}!`);
        }
    } else if (idx === 1) {
        if (hero === 'KAI') {
            localPlayer.health = Math.min(localPlayer.maxHealth, localPlayer.health + 22);
            createShieldEffect(localPlayer);
            addKillMessage(`🛡️ ${HEROES.KAI.skill2.name}!`);
        } else if (hero === 'ZEA') {
            localPlayer.health = Math.min(localPlayer.maxHealth, localPlayer.health + 24);
            addKillMessage(`🔥 ${HEROES.ZEA.skill2.name}!`);
        } else if (hero === 'EON') {
            if (target) {
                target.speed *= 0.55;
                setTimeout(() => { if (target) target.speed = 4.6; }, 2000);
            }
            addKillMessage(`🌀 ${HEROES.EON.skill2.name}!`);
        } else if (hero === 'SYLA') {
            localPlayer.health = Math.min(localPlayer.maxHealth, localPlayer.health + 26);
            addKillMessage(`🌿 ${HEROES.SYLA.skill2.name}!`);
        } else if (hero === 'DRAV') {
            localPlayer.health = Math.min(localPlayer.maxHealth, localPlayer.health + 18);
            addKillMessage(`💥 ${HEROES.DRAV.skill2.name}!`);
        }
        localPlayer.updateLabel();
        updateAmmoUI();
    } else if (idx === 2) {
        if (hero === 'KAI') {
            areaDamage(46, localPlayer);
            addKillMessage(`🌙 ${HEROES.KAI.skill3.name}!`);
        } else if (hero === 'ZEA') {
            areaDamage(42, localPlayer);
            addKillMessage(`🔥 ${HEROES.ZEA.skill3.name}!`);
        } else if (hero === 'EON') {
            if (target) target.damage(48, localPlayer.id);
            else areaDamage(36, localPlayer);
            addKillMessage(`🌀 ${HEROES.EON.skill3.name}!`);
        } else if (hero === 'SYLA') {
            areaDamage(40, localPlayer);
            addKillMessage(`🌿 ${HEROES.SYLA.skill3.name}!`);
        } else if (hero === 'DRAV') {
            areaDamage(46, localPlayer);
            addKillMessage(`💥 ${HEROES.DRAV.skill3.name}!`);
        }
    }
    updateLobbyCount();
    updateAmmoUI();
}

function updateMovementAndAI(delta){
    if(!gameActive) return;
    if(localPlayer){
        let mx=0,mz=0;
        if(keyStates.w)mz-=1; if(keyStates.s)mz+=1; if(keyStates.a)mx-=1; if(keyStates.d)mx+=1;
        if(mx!==0||mz!==0){
            const len=Math.hypot(mx,mz); mx/=len; mz/=len;
            const forward={x:Math.sin(yawAngle),z:Math.cos(yawAngle)};
            const right={x:Math.cos(yawAngle),z:-Math.sin(yawAngle)};
            let newX=localPlayer.position.x+(forward.x*mz+right.x*mx)*localPlayer.speed*delta;
            let newZ=localPlayer.position.z+(forward.z*mz+right.z*mx)*localPlayer.speed*delta;
            localPlayer.setPosition(newX,newZ);
        }
        camera.position.set(localPlayer.position.x,1.68,localPlayer.position.z);
        camera.rotation.order='YXZ'; camera.rotation.set(pitchAngle,yawAngle,0);
    }
    for(let bot of fighters){
        if(bot.isBot&&bot.health>0){
            let closest=null,minD=Infinity;
            for(let other of fighters) if(other!==bot&&other.health>0){ const d=Math.hypot(other.position.x-bot.position.x,other.position.z-bot.position.z); if(d<minD){minD=d;closest=other;} }
            if(closest){
                const dx=closest.position.x-bot.position.x, dz=closest.position.z-bot.position.z, len=Math.hypot(dx,dz);
                if(len>1.2){ const move=Math.min(bot.speed*delta,len-0.8); bot.setPosition(bot.position.x+(dx/len)*move,bot.position.z+(dz/len)*move); }
                else if(len<=2.8&&bot.attackCooldown<=0&&bot.ammo>0){ bot.ammo--; closest.damage(HEROES[bot.heroType].damage,bot.id); bot.attackCooldown=HEROES[bot.heroType].fireRate; createMuzzleFlash(bot.mesh.position,new THREE.Vector3(dx,0,dz).normalize()); }
                else if(bot.ammo<=0&&bot.reserveAmmo>0){ let load=Math.min(30,bot.reserveAmmo); bot.ammo+=load; bot.reserveAmmo-=load; }
            }
        }
        if(bot.attackCooldown>0) bot.attackCooldown-=delta;
        for(let i=0;i<3;i++) if(bot.skillCooldowns[i]>0) bot.skillCooldowns[i]-=delta;
    }
}

window.addEventListener('mousedown', (e)=>{
    if(e.button!==0||!gameActive||!localPlayer) return;
    const rayOrigin=camera.position.clone(), direction=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
    if(localPlayer.shoot()){
        const hit=raycastHitEnemy(rayOrigin,direction);
        if(hit&&hit!==localPlayer){ hit.damage(HEROES[localPlayer.heroType].damage,localPlayer.id); createMuzzleFlash(rayOrigin,direction); if(hit.health<=0) updateLobbyCount(); }
        else createMuzzleFlash(rayOrigin,direction);
    }
    localPlayer.attackCooldown=HEROES[localPlayer.heroType].fireRate;
});

document.addEventListener('mousemove',(e)=>{ if(gameActive&&document.pointerLockElement===renderer.domElement){ mouseX+=e.movementX*0.0022; mouseY+=e.movementY*0.0022; mouseY=Math.max(-1.3,Math.min(1.3,mouseY)); yawAngle=mouseX; pitchAngle=mouseY; } });
renderer.domElement.addEventListener('click',()=>{ if(gameActive) renderer.domElement.requestPointerLock(); });
document.addEventListener('keydown',(e)=>{
    if (!gameActive) return;
    const k = e.key.toLowerCase();
    if (k === 'w') keyStates.w = true;
    if (k === 's') keyStates.s = true;
    if (k === 'a') keyStates.a = true;
    if (k === 'd') keyStates.d = true;
    if (k === 'q') useHeroSkill(0);
    if (k === 'e') useHeroSkill(1);
    if (k === 'r') useHeroSkill(2);
    if (k === 'f' && localPlayer && localPlayer.ammo < 30 && localPlayer.reserveAmmo > 0) {
        let need = 30 - localPlayer.ammo;
        let take = Math.min(need, localPlayer.reserveAmmo);
        localPlayer.ammo += take;
        localPlayer.reserveAmmo -= take;
        updateAmmoUI();
        addKillMessage('🔁 Reloaded!');
    }
    if (e.key === 'Escape' && document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
    }
});
document.addEventListener('keyup',(e)=>{ if(!gameActive) return; const k=e.key.toLowerCase(); if(k==='w')keyStates.w=false; if(k==='s')keyStates.s=false; if(k==='a')keyStates.a=false; if(k==='d')keyStates.d=false; });
document.getElementById('skill1Btn').onclick=()=>{ if(gameActive) useHeroSkill(0); };
document.getElementById('skill2Btn').onclick=()=>{ if(gameActive) useHeroSkill(1); };
document.getElementById('skill3Btn').onclick=()=>{ if(gameActive) useHeroSkill(2); };
document.getElementById('exitGameBtn').onclick=exitToMenu;

let selectedHero = "KAI";
let selectedMap = "ARENA";
function selectHeroCard(card) {
    document.querySelectorAll('.hero-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');
    selectedHero = card.dataset.hero;
    updateHeroPreview(selectedHero);
}
function selectMapCard(card) {
    document.querySelectorAll('.map-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMap = card.dataset.map;
}

document.querySelectorAll('.hero-card').forEach(card => card.addEventListener('click', () => selectHeroCard(card)));
document.querySelectorAll('.map-card').forEach(card => card.addEventListener('click', () => selectMapCard(card)));
document.getElementById('playBtn').addEventListener('click', () => {
    const fsTarget = document.documentElement;
    if (fsTarget.requestFullscreen) fsTarget.requestFullscreen().catch(() => {});
    else if (fsTarget.webkitRequestFullscreen) fsTarget.webkitRequestFullscreen();
    else if (fsTarget.mozRequestFullScreen) fsTarget.mozRequestFullScreen();
    clearGame();
    document.getElementById('gameMenu').style.opacity = '0';
    setTimeout(() => { document.getElementById('gameMenu').style.display = 'none'; }, 400);
    currentMapId = selectedMap;
    buildMap(currentMapId);
    initFighters(selectedHero);
    gameActive = true;
    lastFrameTime = performance.now();
    document.getElementById('exitGameBtn').style.display = 'block';
    for (let k in keyStates) keyStates[k] = false;
    if (selectedMode !== 'PLAY') {
        addKillMessage(`⚡ Mode set to ${selectedMode}`);
    }
});

let selectedMode = 'PLAY';
function selectModeCard(card) {
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMode = card.dataset.mode;
    addKillMessage(`🎮 Mode selected: ${selectedMode}`);
}

document.querySelectorAll('.mode-card').forEach(card => card.addEventListener('click', () => selectModeCard(card)));
document.querySelectorAll('.quick-card').forEach(card => card.addEventListener('click', () => {
    const action = card.querySelector('.quick-name')?.textContent?.trim();
    if (action === 'PROFILE') {
        addKillMessage('🧾 PROFILE menu is not available yet');
    } else if (action === 'SETTINGS') {
        addKillMessage('⚙️ SETTINGS not implemented yet');
    } else if (action === 'CHALLENGES') {
        addKillMessage('🎯 CHALLENGES opened');
    } else if (action === 'FORGE') {
        addKillMessage('🛠️ FORGE opened');
    }
}));

const initialHero = document.querySelector('.hero-card[data-hero="KAI"]');
if (initialHero) initialHero.classList.add('selected');
const initialMap = document.querySelector('.map-card[data-map="ARENA"]');
if (initialMap) initialMap.classList.add('selected');
updateHeroPreview(selectedHero);
setupMissionSelector();

function gameLoop(){
    const now=performance.now();
    let delta=Math.min(0.033,(now-lastFrameTime)/1000);
    lastFrameTime=now;
    if(gameActive) updateMovementAndAI(delta);
    composer.render();
    labelRenderer.render(scene,camera);
    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    composer.setSize(window.innerWidth,window.innerHeight);
    labelRenderer.setSize(window.innerWidth,window.innerHeight);
});

document.addEventListener('fullscreenchange', ()=>{
    if (document.fullscreenElement) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }
});

gameLoop();
