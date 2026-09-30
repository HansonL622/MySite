import * as THREE from 'three';
import './style.css';

const sceneRoot = document.querySelector('#scene');
const heroUI = document.querySelector('#hero-ui');
const insideUI = document.querySelector('#inside-ui');
const hint = document.querySelector('#scene-hint');
const transition = document.querySelector('#transition');
const entrySplit = document.querySelector('#entry-split');
const roomUI = document.querySelector('#room-ui');
const app = document.querySelector('#app');

const rooms = {
  education: {
    category: '01 / EDUCATION', title: '教育', intro: '在通信工程的基础上，持续探索 AI 应用与产品实践。',
    entries: [{ date: '2023.09 — 2027.07', title: '电子科技大学 · 通信工程本科', points: [
      '主修人工智能与机器学习、信号与系统、通信原理、嵌入式系统设计和 C 语言。',
      '雅思 6.5，具备英文技术文档阅读与英文报告撰写能力。',
    ] }],
  },
  internship: {
    category: '02 / INTERNSHIP', title: '实习', intro: '从产品规划到客户交付，参与真实业务场景中的产品和技术落地。',
    entries: [
      { date: '2026.09 — 至今', title: '字节跳动 · 飞书商业化 FDE 实习生', points: [
        '独立对接 10+ 家企业客户；主导一家制造企业的协同办公平台迁移，推动 50 人灰度上线。',
        '设计培训任务管理平台及电商 AI 场景应用，编写演示与交付 SOP，并承担客户 AI 培训。',
      ] },
      { date: '2026.06 — 2026.09', title: '上海七牛信息技术有限公司 · 产品架构实习生', points: [
        '规划 AI 英语口语学习产品的自由对话、场景训练和学习复盘链路，完成 PRD 与 MVP 定义。',
        '带领 5 人实习小组交付 MVP，组织 100+ 场景的大模型测试并优化对话体验。',
      ], link: 'https://github.com/HansonL622/UniSpeaking', linkLabel: '查看 UniSpeaking ↗' },
      { date: '2026.01 — 2026.03', title: '中国移动重庆公司 · 建设维护部实习生', points: [
        '参与低空安防项目调研与无人机预警防御方案分析，比较雷达、光电与 5G-A 探测方案。',
        '使用 Python 和 MATLAB 清洗、可视化感知数据，支持系统优化与现场测试。',
      ] },
    ],
  },
  projects: {
    category: '03 / PROJECTS', title: '项目', intro: '把研究和想法做成能真实使用的产品。',
    entries: [
      { date: '2026.01 — 2026.05 · 独立开发', title: 'DuoMi · AI 心理陪伴', points: [
        '围绕大学生倾诉与隐私需求，回收 200+ 份问卷、深访 15 人，定义产品 MVP。',
        '使用 React、TypeScript、Vite 实现多会话、流式回复、日记与长期记忆体验。',
      ], link: 'https://github.com/HansonL622/DuoMI', linkLabel: '查看 DuoMi ↗' },
      { date: '2026.06 — 2026.09 · 团队项目', title: 'UniSpeaking · AI 口语学习', points: [
        '设计“词汇—句型—模拟对话”学习闭环和五维练习反馈体系。',
        '规划实时语音、语音打断、字幕同步及 AI 口语评测能力，并交付 MVP。',
      ], link: 'https://github.com/HansonL622/UniSpeaking', linkLabel: '查看 UniSpeaking ↗' },
    ],
  },
  contact: {
    category: '04 / CONTACT ME', title: 'Contact Me', intro: '欢迎交流 AI 产品、应用开发与新的合作想法。',
    entries: [
      { title: '邮箱', link: 'mailto:zhli622@outlook.com', linkLabel: 'zhli622@outlook.com ↗' },
      { title: 'GitHub', link: 'https://github.com/HansonL622', linkLabel: 'github.com/HansonL622 ↗' },
    ],
  },
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
sceneRoot.appendChild(renderer.domElement);
scene.fog = new THREE.Fog('#f6e9dc', 28, 90);

scene.add(new THREE.HemisphereLight(0xd9efff, 0xffdfb1, 1.35));
const sun = new THREE.DirectionalLight(0xffe6ba, 2.2);
sun.position.set(-6, 12, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -15; sun.shadow.camera.right = 15; sun.shadow.camera.top = 15; sun.shadow.camera.bottom = -15;
scene.add(sun);
const interiorLight = new THREE.PointLight(0xffcf98, 45, 25, 2);
interiorLight.position.set(0, 4, -6);
scene.add(interiorLight);

const mat = (color, extra = {}) => new THREE.MeshToonMaterial({ color, ...extra });
const materials = {
  cream: mat('#fff3d8'), plaster: mat('#fee8cb'), coral: mat('#e98a79'), roof: mat('#6f86a8'),
  roofEdge: mat('#4e6388'), wood: mat('#a66655'), darkWood: mat('#80516a'), door: mat('#e38c73'),
  blue: mat('#7abbd3'), window: mat('#a4dbe8', { transparent: true, opacity: .82 }),
  grass: mat('#86b686'), floor: mat('#dfa788'), interior: mat('#fcdec7'), mint: mat('#91c7b6'),
  yellow: mat('#f7cf87'), white: mat('#fffaf0'), navy: mat('#536d88'),
};

function outlined(mesh, color = 0x6e6680, opacity = .38) {
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  mesh.add(edges);
  return mesh;
}
function block(parent, material, pos, size, outline = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...pos);
  mesh.castShadow = true; mesh.receiveShadow = true;
  parent.add(mesh);
  return outline ? outlined(mesh) : mesh;
}
function plane(parent, material, pos, size, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), material);
  mesh.position.set(...pos); mesh.rotation.set(...rotation);
  mesh.receiveShadow = true; parent.add(mesh); return mesh;
}

const house = new THREE.Group();
scene.add(house);
const doorTargets = [];
const artTargets = [];

function addWindow(x) {
  block(house, materials.darkWood, [x, 2.48, .2], [1.44, 1.55, .16]);
  block(house, materials.window, [x, 2.48, .3], [1.23, 1.34, .035], false);
  block(house, materials.white, [x, 2.48, .35], [.08, 1.34, .08], false);
  block(house, materials.white, [x, 2.48, .35], [1.23, .08, .08], false);
  block(house, materials.wood, [x, 1.67, .34], [1.68, .18, .38]);
}

function petPart(parent, color, position, scale, shape = 'sphere') {
  const geometry = shape === 'cone'
    ? new THREE.ConeGeometry(1, 1, 5)
    : new THREE.SphereGeometry(1, 12, 9);
  const part = new THREE.Mesh(geometry, mat(color));
  part.position.set(...position);
  part.scale.set(...scale);
  part.castShadow = true;
  parent.add(part);
  return part;
}

function petEyes(group, y, z, spacing, color = '#282c3a') {
  for (const side of [-1, 1]) {
    petPart(group, color, [side * spacing, y, z], [.045, .065, .035]);
    petPart(group, '#ffffff', [side * spacing - .012, y + .02, z + .028], [.012, .015, .008]);
  }
}

function makeWestie() {
  const dog = new THREE.Group();
  dog.position.set(-3.55, .03, 2.2);
  house.add(dog);
  petPart(dog, '#fff9e9', [0, .56, -.05], [.43, .44, .54]);
  petPart(dog, '#fffdf2', [0, 1.08, .32], [.39, .39, .35]);
  petPart(dog, '#f4eddf', [0, .9, .57], [.26, .2, .2]);
  for (const side of [-1, 1]) {
    petPart(dog, '#fff9e9', [side * .27, 1.4, .22], [.15, .29, .13], 'cone');
    petPart(dog, '#efbbbd', [side * .27, 1.41, .34], [.07, .16, .035], 'cone');
    for (const z of [-.34, .33]) petPart(dog, '#fffaf0', [side * .27, .21, z], [.16, .23, .17]);
    petPart(dog, '#fffdf4', [side * .36, 1.03, .43], [.1, .22, .16]);
  }
  petEyes(dog, 1.13, .641, .16);
  petPart(dog, '#34343b', [0, .99, .755], [.09, .075, .05]);
  petPart(dog, '#fffaf0', [0, .88, -.57], [.13, .27, .16]).rotation.x = -.42;
  return dog;
}

function makeDachshund() {
  const dog = new THREE.Group();
  dog.position.set(-2.28, .03, 2.6);
  dog.rotation.y = -.12;
  house.add(dog);
  petPart(dog, '#9e5536', [0, .43, -.13], [.37, .34, .76]);
  petPart(dog, '#c48253', [0, .37, .38], [.26, .24, .31]);
  petPart(dog, '#ad6340', [0, .77, .58], [.31, .31, .34]);
  petPart(dog, '#c47d50', [0, .63, .86], [.21, .15, .28]);
  for (const side of [-1, 1]) {
    petPart(dog, '#743c31', [side * .31, .69, .56], [.15, .34, .14]).rotation.z = side * .22;
    for (const z of [-.57, .43]) petPart(dog, '#9e5536', [side * .26, .18, z], [.12, .21, .14]);
    petPart(dog, '#c48253', [side * .26, .09, .43], [.14, .08, .18]);
  }
  petEyes(dog, .83, .866, .14);
  petPart(dog, '#312d32', [0, .66, 1.145], [.075, .06, .055]);
  petPart(dog, '#9e5536', [0, .47, -.88], [.09, .1, .38]).rotation.x = -.38;
  return dog;
}

function makePosterTexture(project, accent, subtitle, shape) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 640;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff9eb'; ctx.fillRect(0, 0, 512, 640);
  ctx.fillStyle = accent; ctx.fillRect(24, 24, 464, 402);
  ctx.globalAlpha = .16; ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(62 + i * 49, 78 + (i % 2) * 40, 25 + i * 2, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  if (shape === 'book') {
    ctx.fillStyle = '#fff6dc';
    ctx.beginPath(); ctx.moveTo(90, 143); ctx.quadraticCurveTo(176, 112, 256, 158); ctx.quadraticCurveTo(336, 112, 422, 143); ctx.lineTo(422, 321); ctx.quadraticCurveTo(329, 291, 256, 339); ctx.quadraticCurveTo(183, 291, 90, 321); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#597b91'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(256, 158); ctx.lineTo(256, 339); ctx.stroke();
  } else if (shape === 'briefcase') {
    ctx.fillStyle = '#fff6dc'; ctx.fillRect(93, 172, 326, 171);
    ctx.strokeStyle = '#637a90'; ctx.lineWidth = 12; ctx.strokeRect(93, 172, 326, 171);
    ctx.strokeRect(203, 123, 106, 49); ctx.beginPath(); ctx.moveTo(93, 227); ctx.lineTo(419, 227); ctx.stroke();
    ctx.fillStyle = '#f1c58e'; ctx.fillRect(235, 215, 42, 27);
  } else if (shape === 'speech') {
    ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.roundRect(99, 118, 314, 195, 42); ctx.fill();
    ctx.beginPath(); ctx.moveTo(150, 296); ctx.lineTo(145, 353); ctx.lineTo(217, 302); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7ba5a0'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(179 + i * 76, 216, 18, 0, Math.PI * 2); ctx.fill(); }
  } else if (shape === 'signal') {
    ctx.strokeStyle = '#fff7e9'; ctx.lineWidth = 13; ctx.lineCap = 'round';
    for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.moveTo(94, 175 + j * 47); ctx.bezierCurveTo(172, 80 + j * 65, 247, 293 + j * 17, 412, 165 + j * 44); ctx.stroke(); }
    ctx.fillStyle = '#ffe7a4'; ctx.beginPath(); ctx.arc(362, 146, 38, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = '#fff4de'; ctx.beginPath(); ctx.arc(256, 208, 114, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#637a90'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(256, 214, 62, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = '#637a90'; ctx.beginPath(); ctx.arc(205, 218, 14, 0, Math.PI * 2); ctx.arc(307, 218, 14, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#e18e7e'; ctx.font = '700 19px DM Sans, sans-serif'; ctx.fillText(subtitle, 38, 470);
  ctx.fillStyle = '#334b64'; ctx.font = project.length > 14 ? '700 31px DM Sans, sans-serif' : '700 43px DM Sans, sans-serif';
  ctx.fillText(project, 38, 536, 440);
  ctx.strokeStyle = '#d6c5b5'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(38, 572); ctx.lineTo(472, 572); ctx.stroke();
  ctx.fillStyle = '#647c92'; ctx.font = '600 18px DM Sans, sans-serif'; ctx.fillText('OPEN THE STORY  ↗', 38, 609);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildWorld() {
  // Exterior house: the open doorway and the entire walkable room are new geometry.
  block(house, materials.cream, [-2.2, 2.22, 0], [2.3, 4.44, .36]);
  block(house, materials.cream, [2.2, 2.22, 0], [2.3, 4.44, .36]);
  block(house, materials.cream, [0, 3.62, 0], [2.1, 1.64, .36]);
  block(house, materials.wood, [-1.03, 1.42, .22], [.18, 2.86, .18]);
  block(house, materials.wood, [1.03, 1.42, .22], [.18, 2.86, .18]);
  block(house, materials.wood, [0, 2.82, .22], [2.24, .17, .18]);
  const pivot = new THREE.Group(); pivot.position.set(-.92, 1.39, .32); house.add(pivot);
  const door = block(pivot, materials.door, [.92, 0, 0], [1.84, 2.74, .13]);
  block(pivot, materials.wood, [.92, .96, .08], [1.55, .12, .045]);
  block(pivot, materials.wood, [.92, -.96, .08], [1.55, .12, .045]);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(.09, 16, 12), mat('#f7dc9d'));
  knob.position.set(1.59, -.1, .13); pivot.add(knob);
  doorTargets.push(door, knob);
  house.userData.doorPivot = pivot;
  addWindow(-2.2); addWindow(2.2);

  const gableShape = new THREE.Shape();
  gableShape.moveTo(-3.58, 4.42); gableShape.lineTo(3.58, 4.42); gableShape.lineTo(0, 6.18); gableShape.closePath();
  const gable = new THREE.Mesh(new THREE.ShapeGeometry(gableShape), materials.plaster);
  gable.position.z = .25; house.add(outlined(gable));
  for (const sign of [-1, 1]) {
    const roof = block(house, materials.roof, [sign * 1.95, 5.35, -3.7], [4.32, .25, 8.6]);
    roof.rotation.z = sign * -.42;
  }
  block(house, materials.roofEdge, [0, 6.25, -3.7], [.26, .25, 8.7]);
  block(house, materials.plaster, [2.5, 6.08, -4.5], [.65, 1.3, .68]);
  block(house, materials.roofEdge, [2.5, 6.77, -4.5], [.83, .16, .83]);
  block(house, materials.wood, [0, 4.25, .32], [2.8, .55, .18]);

  const signCanvas = document.createElement('canvas'); signCanvas.width = 1024; signCanvas.height = 170;
  const s = signCanvas.getContext('2d'); s.clearRect(0,0,1024,170); s.fillStyle = '#fff5dc'; s.fillRect(0,0,1024,170);
  s.fillStyle = '#45627f'; s.textAlign = 'center'; s.font = '800 83px DM Sans, sans-serif'; s.fillText('ZHENGHAN’S CORNER',512,112);
  const signTexture = new THREE.CanvasTexture(signCanvas); signTexture.colorSpace = THREE.SRGBColorSpace;
  plane(house, new THREE.MeshBasicMaterial({ map: signTexture }), [0, 4.25, .425], [2.66, .44]);

  // Ground and garden.
  const garden = new THREE.Mesh(new THREE.PlaneGeometry(60, 50), materials.grass);
  garden.rotation.x = -Math.PI/2; garden.position.set(0,-.06,0); garden.receiveShadow = true; house.add(garden);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 13), mat('#f6d2aa'));
  path.rotation.x = -Math.PI/2; path.position.set(0,-.045,7.7); house.add(path);
  for (let i=0;i<8;i++) {
    const p = block(house, mat(i%2 ? '#f9e0bb':'#eac7a7'), [(i%2-.5)*.45, -.005, 1.6+i*1.6], [1.2,.045,.82]);
    p.rotation.y = Math.sin(i*1.7)*.12;
  }
  for (const x of [-4.45, 4.45]) {
    const bush = new THREE.Group(); bush.position.set(x,.12,.5); house.add(bush);
    for(let i=0;i<5;i++){const ball=new THREE.Mesh(new THREE.SphereGeometry(.56+(i%2)*.13, 10, 8),mat(i%2?'#7fb5a2':'#9cc79a'));ball.position.set((i-2)*.39,.45+(i%3)*.22,(i%2)*.3);ball.castShadow=true;bush.add(ball)}
  }
  for(let i=0;i<13;i++){const flower=new THREE.Mesh(new THREE.SphereGeometry(.05,8,8),mat(i%3?'#f9d186':'#eaa4a0')); flower.position.set((i%2?1:-1)*(3.9+(i%3)*.4),.35+(i%4)*.05,1+(i*1.37)%5);house.add(flower)}

  house.userData.pets = [makeWestie(), makeDachshund()];

  return pivot;
}

const doorPivot=buildWorld();
const SEGMENT_LENGTH = 12;
const SEGMENT_COUNT = 4;
const LOOP_LENGTH = SEGMENT_LENGTH * SEGMENT_COUNT;
const corridorSegments = [];
const corridorDoors = [];
const loopDoors = [];
const corridorTopics = [
  { key: 'education', label: '01 EDUCATION', accent: '#8dc8d8', shape: 'book' },
  { key: 'internship', label: '02 INTERNSHIP', accent: '#e6aaa9', shape: 'briefcase' },
  { key: 'projects', label: '03 PROJECTS', accent: '#c6b9dd', shape: 'signal' },
  { key: 'contact', label: '04 CONTACT ME', accent: '#a2c8b8', shape: 'speech' },
];

function makeDoorLabel(text, accent) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff8eb'; ctx.fillRect(0, 0, 512, 160);
  ctx.fillStyle = accent; ctx.fillRect(0, 0, 18, 160);
  ctx.fillStyle = '#38516b'; ctx.textAlign = 'center';
  ctx.font = '800 45px DM Sans, sans-serif'; ctx.fillText(text, 256, 102, 445);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeDoorGraffiti(theme) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 640;
  const ctx = canvas.getContext('2d');
  const name = { education: '教育', internship: '实习', projects: '项目', contact: '联系我' }[theme.key];
  const english = { education: 'EDUCATION', internship: 'INTERNSHIP', projects: 'PROJECTS', contact: 'CONTACT ME' }[theme.key];
  const color = { education: '#f5b86c', internship: '#f28d86', projects: '#ad94db', contact: '#80bd9f' }[theme.key];
  ctx.translate(256, 320);
  ctx.rotate((theme.key === 'internship' ? 1 : -1) * .055);
  ctx.fillStyle = '#fff8db';
  ctx.beginPath(); ctx.moveTo(-215, -180); ctx.lineTo(181, -197); ctx.lineTo(221, -137);
  ctx.lineTo(195, 180); ctx.lineTo(-195, 190); ctx.lineTo(-225, 112); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#334e68'; ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-216, -180); ctx.lineTo(195, -190); ctx.lineTo(210, -125);
  ctx.lineTo(-204, -110); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#334e68'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 42px "DM Sans", sans-serif';
  ctx.fillText(`ROOM ${theme.label.slice(0, 2)}  ✦`, 0, -145);
  ctx.font = '900 166px "Noto Sans SC", sans-serif';
  ctx.lineWidth = 15; ctx.strokeStyle = '#334e68'; ctx.strokeText(name, 0, 0, 390);
  ctx.fillStyle = color; ctx.fillText(name, 0, 0, 390);
  ctx.lineWidth = 5; ctx.strokeStyle = '#fff8db'; ctx.strokeText(name, 0, 0, 390);
  ctx.fillStyle = '#334e68'; ctx.font = '900 43px "DM Sans", sans-serif';
  ctx.fillText(english, 0, 124, 405);
  ctx.fillStyle = '#e98b81';
  for (const [x, y, r] of [[-202, 245, 13], [201, -242, 9], [172, 223, 8]]) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

function buildCorridorSegment(index) {
  const group = new THREE.Group();
  group.position.z = -index * SEGMENT_LENGTH;
  house.add(group);
  const theme = corridorTopics[index % corridorTopics.length];
  const side = index % 2 ? 1 : -1;
  const doorZ = -6.2;
  const wall = index % 2 ? mat('#fbe3d7') : mat('#fae9d7');
  const trim = index % 2 ? mat('#a68693') : mat('#85aab0');
  const doorMat = mat(theme.accent);

  block(group, materials.floor, [0, -.09, -6], [5.62, .18, 12], false);
  block(group, materials.cream, [0, 4.45, -6], [5.62, .16, 12], false);
  block(group, mat('#9cb5b7'), [0, .025, -6], [1.42, .025, 12], false);
  for (let i=0; i<12; i++) {
    block(group, mat(i%2 ? '#e8b99d' : '#deb092'), [0, .015, -.55-i], [5.58, .018, .042], false);
  }
  for (const wallSide of [-1, 1]) {
    const x = wallSide * 2.81;
    if (wallSide === side) {
      block(group, wall, [x, 2.23, -2.27], [.18, 4.45, 4.54], false);
      block(group, wall, [x, 2.23, -9.9], [.18, 4.45, 4.2], false);
      block(group, wall, [x, 3.78, doorZ], [.18, 1.35, 3.06], false);
      block(group, trim, [wallSide*2.69, 1.55, doorZ-1.31], [.2, 3.1, .12]);
      block(group, trim, [wallSide*2.69, 1.55, doorZ+1.31], [.2, 3.1, .12]);
      block(group, trim, [wallSide*2.69, 3.12, doorZ], [.2, .13, 2.77]);
      block(group, mat('#756779'), [wallSide*2.85, 1.53, doorZ], [.12, 2.98, 2.48], false);
      const hinge = new THREE.Group();
      hinge.position.set(wallSide*2.74, 0, doorZ+1.18);
      group.add(hinge);
      const projectDoor = block(hinge, doorMat, [0, 1.53, -1.18], [.13, 2.88, 2.36]);
      projectDoor.userData.project = theme.key;
      artTargets.push(projectDoor);
      block(hinge, trim, [-wallSide*.09, 1.53, -1.18], [.045, 2.38, 1.78], false);
      const graffiti = plane(
        hinge,
        new THREE.MeshBasicMaterial({ map: makeDoorGraffiti(theme), transparent: true, side: THREE.DoubleSide, depthWrite: false }),
        [-wallSide*.135, 1.57, -1.18],
        [1.75, 2.18],
        [0, wallSide === -1 ? Math.PI / 2 : -Math.PI / 2, 0],
      );
      graffiti.userData.project = theme.key;
      artTargets.push(graffiti);
      const label = plane(group, new THREE.MeshBasicMaterial({map:makeDoorLabel(theme.label,theme.accent),side:THREE.DoubleSide}), [wallSide*2.55,3.59,doorZ], [2.23,.7], [0,wallSide===-1?Math.PI/2:-Math.PI/2,0]);
      label.userData.project = theme.key;
      artTargets.push(label);
      const handle = new THREE.Mesh(new THREE.SphereGeometry(.085, 12, 8), mat('#f6d391'));
      handle.position.set(-wallSide*.19, 1.42, -1.96);
      handle.userData.project = theme.key;
      hinge.add(handle);
      artTargets.push(handle);
      corridorDoors.push({hinge, segment:group, doorZ, side:wallSide, key:theme.key});
    } else {
      block(group, wall, [x, 2.23, -6], [.18, 4.45, 12], false);
      block(group, trim, [wallSide*2.68, .73, -6], [.08, 1.38, 12], false);
      const poster = plane(group, new THREE.MeshBasicMaterial({map:makePosterTexture(theme.label,theme.accent,'OPEN THE DOOR',theme.shape),side:THREE.DoubleSide}), [wallSide*2.55,2.43,doorZ], [1.52,1.9], [0,wallSide===-1?Math.PI/2:-Math.PI/2,0]);
      poster.userData.project = theme.key;
      artTargets.push(poster);
    }
    block(group, materials.darkWood, [wallSide*2.68,.32,-6], [.14,.2,12], false);
    block(group, materials.white, [wallSide*2.68,4.05,-6], [.14,.11,12], false);
  }
  for(let j=0;j<5;j++){
    const z=-j*3;
    block(group, trim, [0,4.27,z], [5.63,.28,.18], false);
    if(j<4){
      const glow=plane(group,new THREE.MeshBasicMaterial({color:'#fff2c9'}),[0,4.18,z-1.5],[.8,.22],[-Math.PI/2,0,0]);
      glow.material.side=THREE.DoubleSide;
    }
  }
  block(group, trim, [-2.67,2.16,-12], [.23,4.33,.2], false);
  block(group, trim, [2.67,2.16,-12], [.23,4.33,.2], false);
  block(group, trim, [0,4.22,-12], [5.58,.22,.2], false);
  corridorSegments.push(group);
}

for (let i=0;i<SEGMENT_COUNT;i++) buildCorridorSegment(i);

function makeLoopDoorTexture(word, side) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 768;
  const ctx = canvas.getContext('2d');
  const colors = side === 'left'
    ? ['#f2c768', '#e88279', '#81c8cf', '#a38ccc', '#9dc17f']
    : ['#f4a467', '#84b7df', '#e99db4'];
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = side === 'left' ? '#e9947b88' : '#85b9d188';
  ctx.beginPath(); ctx.ellipse(256, 360, 223, 92, side === 'left' ? -.13 : .12, 0, Math.PI * 2); ctx.fill();
  ctx.font = '900 38px "DM Sans", sans-serif';
  ctx.fillStyle = '#38516b'; ctx.fillText('✦  THE STORY GOES ON  ✦', 256, 192, 450);
  const fontSize = word.length === 5 ? 126 : 170;
  const spacing = word.length === 5 ? 87 : 132;
  ctx.font = `900 ${fontSize}px "Arial Black", "DM Sans", sans-serif`;
  for (let i = 0; i < word.length; i++) {
    const x = 256 + (i - (word.length - 1) / 2) * spacing;
    const y = 362 + (i % 2 ? -12 : 10);
    ctx.save(); ctx.translate(x, y); ctx.rotate((i % 2 ? 1 : -1) * .09);
    ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = '#304960'; ctx.strokeText(word[i], 0, 0);
    ctx.fillStyle = colors[i]; ctx.fillText(word[i], 0, 0);
    ctx.restore();
  }
  ctx.strokeStyle = side === 'left' ? '#e98379' : '#7db4ce';
  ctx.lineWidth = 17; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(63, 471); ctx.quadraticCurveTo(256, 492, 446, 461); ctx.stroke();
  ctx.fillStyle = '#38516b'; ctx.font = '800 41px "Noto Sans SC", sans-serif';
  ctx.fillText(side === 'left' ? '继续探索' : '下一轮见', 256, 581);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

function buildLoopDoor() {
  const gateway = new THREE.Group();
  house.add(gateway);
  const frame = mat('#9d8291');
  block(gateway, frame, [-2.66, 2.08, 0], [.2, 4.16, .28]);
  block(gateway, frame, [2.66, 2.08, 0], [.2, 4.16, .28]);
  block(gateway, frame, [0, 4.12, 0], [5.46, .24, .32]);
  const hinges = [];
  for (const side of [-1, 1]) {
    const hinge = new THREE.Group();
    hinge.position.x = side * 2.55;
    gateway.add(hinge);
    const centerX = -side * 1.275;
    block(hinge, mat(side === -1 ? '#f8e7c9' : '#f4dfdd'), [centerX, 1.94, 0], [2.55, 3.88, .16]);
    block(hinge, mat(side === -1 ? '#f1d5b8' : '#e9c6c4'), [centerX, 1.94, .088], [2.29, 3.6, .055], false);
    plane(
      hinge,
      new THREE.MeshBasicMaterial({ map: makeLoopDoorTexture(side === -1 ? 'ZHENG' : 'HAN', side === -1 ? 'left' : 'right'), transparent: true, side: THREE.DoubleSide, depthWrite: false }),
      [centerX, 1.94, .122],
      [2.28, 3.45],
    );
    block(hinge, mat('#f6d28e'), [-side * 2.25, 1.54, .18], [.09, .43, .1]);
    hinges.push(hinge);
  }
  loopDoors.push({ gateway, left: hinges[0], right: hinges[1] });
}

for (let i = 0; i < 3; i++) buildLoopDoor();
const roomStage = new THREE.Group();
roomStage.position.z = 60;
roomStage.visible = false;
scene.add(roomStage);
const roomSets = {};
const roomPalettes = {
  education: { wall:'#d6e7e5', floor:'#d5a88c', accent:'#7fb8c8', secondary:'#f1bd78', sign:'LEARNING LAB' },
  internship: { wall:'#f1dcd6', floor:'#cda287', accent:'#e69992', secondary:'#8db6af', sign:'FIELD NOTES' },
  projects: { wall:'#e5dff1', floor:'#bfa18e', accent:'#ab91d1', secondary:'#f6c878', sign:'IDEA WORKSHOP' },
  contact: { wall:'#d9e9d7', floor:'#d5aa89', accent:'#87b9a0', secondary:'#f0b97e', sign:'SAY HELLO' },
};

function roomSign(title, color) {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 240;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,1024,240); ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='900 112px "DM Sans", sans-serif';ctx.lineJoin='round';ctx.lineWidth=20;
  ctx.strokeStyle='#334e68';ctx.strokeText(title,512,125,950);
  ctx.fillStyle=color;ctx.fillText(title,512,125,950);
  ctx.lineWidth=4;ctx.strokeStyle='#fff8eb';ctx.strokeText(title,512,125,950);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});
}
function cylinder(parent, material, radius, height, pos, rotation=[0,0,0]) {
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,12),material);
  mesh.position.set(...pos);mesh.rotation.set(...rotation);mesh.castShadow=true;parent.add(mesh);return mesh;
}
function makeRoomSet(key) {
  const palette=roomPalettes[key];
  const group=new THREE.Group();roomStage.add(group);roomSets[key]=group;
  const wall=mat(palette.wall),accent=mat(palette.accent),secondary=mat(palette.secondary);
  block(group,mat(palette.floor),[0,-.08,1.5],[11,.16,15],false);
  block(group,wall,[0,2.65,-5.9],[11,5.4,.28],false);
  block(group,wall,[-5.48,2.65,1.5],[.22,5.4,15],false);
  block(group,wall,[5.48,2.65,1.5],[.22,5.4,15],false);
  block(group,mat('#fff2da'),[0,5.35,1.5],[11,.18,15],false);
  block(group,accent,[0,.2,-5.66],[11,.24,.08],false);
  block(group,accent,[-5.32,.2,1.5],[.08,.24,15],false);
  block(group,accent,[5.32,.2,1.5],[.08,.24,15],false);
  for(let i=0;i<10;i++)block(group,mat(i%2?'#f8dec6':'#edc9ad'),[0,-.002,-4.8+i*1.35],[10.8,.015,.025],false);
  block(group,mat('#fff9e9'),[0,4.17,-5.68],[5.8,1.1,.16]);
  plane(group,roomSign(palette.sign,palette.accent),[0,4.15,-5.57],[5.65,1.07]);
  for(const x of [-4.1,4.1]){
    block(group,accent,[x,3.07,-5.68],[1.15,.12,.13]);
    plane(group,new THREE.MeshBasicMaterial({color:'#fff8dc',side:THREE.DoubleSide}),[x,2.7,-5.55],[.78,.48]);
    cylinder(group,secondary,.12,.15,[x,3.57,-5.48],[Math.PI/2,0,0]);
  }
  const rug=plane(group,new THREE.MeshBasicMaterial({color:palette.accent,side:THREE.DoubleSide}),[0,.011,1.6],[3.8,7],[-Math.PI/2,0,0]);rug.rotation.z=.035;
  for(const z of [-2.4,.7,3.8]){
    block(group,mat('#fff8df'),[0,5.16,z],[1.7,.12,.5],false);
    cylinder(group,new THREE.MeshBasicMaterial({color:'#fff3c9'}),.12,.06,[0,5.03,z],[0,0,Math.PI/2]);
  }
  if(key==='education'){
    for(const x of [-3.8,3.8]){
      block(group,mat('#9a778b'),[x,2,-4.7],[1.8,3.6,.75]);
      for(let row=0;row<4;row++){
        block(group,mat('#fff2db'),[x,.58+row*.82,-4.24],[1.55,.08,.1],false);
        for(let i=0;i<5;i++)block(group,mat(['#eaa291','#86b8c3','#f2c989','#af9acb'][i%4]),[x-.53+i*.26,.88+row*.82,-4.22],[.2,.55,.24]);
      }
    }
    block(group,mat('#c48971'),[0,.94,-2.5],[2.6,.2,1.25]);
    for(const x of [-1,1])block(group,mat('#a56e64'),[x,.45,-2.5],[.15,.9,1]);
    block(group,mat('#fff4dc'),[0,1.12,-2.5],[.8,.05,.58]);
    block(group,accent,[.8,1.17,-2.6],[.45,.1,.3]);
  }else if(key==='internship'){
    for(const x of [-3.65,3.65]){
      block(group,mat('#b78688'),[x,2.46,-4.7],[2.2,2.45,.24]);
      for(let i=0;i<3;i++){
        const note=block(group,mat(i%2?'#fff1ca':'#d6ecdf'),[x-.5+(i%2)*.85,2.9-Math.floor(i/2)*.92,-4.52],[.72,.72,.05],false);
        note.rotation.z=(i-1)*.08;
      }
      cylinder(group,mat('#f3c481'),.08,.06,[x,3.68,-4.45],[Math.PI/2,0,0]);
    }
    block(group,mat('#9d797a'),[0,.79,-2.5],[3.1,.2,1.25]);
    for(const x of [-1.2,1.2])block(group,mat('#806578'),[x,.4,-2.5],[.17,.78,1.1]);
    for(let i=0;i<3;i++)block(group,mat(['#fff0d4','#a8ccbe','#f1ae9e'][i]),[-.65+i*.6,1.02,-2.5],[.48,.11,.65]);
  }else if(key==='projects'){
    for(const x of [-3.25,3.25]){
      block(group,mat('#5f6f91'),[x,1.95,-4.7],[2.65,1.8,.16]);
      block(group,mat(x<0?'#79bbcb':'#c3a6db'),[x,1.95,-4.59],[2.35,1.5,.035],false);
      block(group,mat('#fff1d2'),[x,1.92,-4.54],[1.9,.12,.04],false);
      block(group,mat('#fff1d2'),[x,1.57,-4.54],[1.35,.1,.04],false);
      block(group,mat('#7b7289'),[x,.61,-4.68],[1.9,.16,.7]);
    }
    const bulb=new THREE.Mesh(new THREE.SphereGeometry(.55,16,10),mat('#ffe094'));bulb.position.set(0,2.1,-3.6);group.add(bulb);
    cylinder(group,mat('#8d7d99'),.12,1.2,[0,1.03,-3.6]);
    for(let i=0;i<6;i++){const ray=block(group,secondary,[Math.cos(i*Math.PI/3)*.95,2.1+Math.sin(i*Math.PI/3)*.95,-3.65],[.12,.43,.1],false);ray.rotation.z=-i*Math.PI/3}
  }else{
    block(group,mat('#f4be87'),[0,1.36,-4.57],[2.45,1.5,.85]);
    block(group,mat('#fff2d6'),[0,1.52,-4.08],[1.88,.92,.05],false);
    block(group,accent,[0,1.11,-4.04],[2.55,.16,.12]);
    for(const x of [-3.4,3.4]){
      cylinder(group,mat('#9f806d'),.09,1.75,[x,.88,-4.3]);
      const leaf=new THREE.Mesh(new THREE.SphereGeometry(.62,10,7),mat('#9bc9a8'));leaf.position.set(x,2.12,-4.3);group.add(leaf);
      block(group,secondary,[x,.18,-4.3],[.8,.36,.78]);
    }
    for(let i=0;i<3;i++){const envelope=block(group,mat('#fff6dc'),[-.45+i*.38,2.35+i*.08,-4.02],[.52,.36,.04],false);envelope.rotation.z=(i-1)*.18}
  }
  group.visible=false;
}
Object.keys(roomPalettes).forEach(makeRoomSet);
let phase='outside';
let soundOn=false;
let audioContext;
let dragStart=null;
let dragYaw=0;
let pointerX=0;
let walkProgress=0;
let walkTarget=0;
let roomJourney=null;
let activeRoomDoor=null;
let roomExit=null;
let closedDoor=null;
const raycaster=new THREE.Raycaster();
const pointer=new THREE.Vector2();
const clock=new THREE.Clock();
const cameraGoal=new THREE.Vector3();
const lookGoal=new THREE.Vector3();

function playChime(){
  if(!soundOn)return;
  audioContext ||= new (window.AudioContext||window.webkitAudioContext)();
  const now=audioContext.currentTime;
  [523.25,659.25,783.99].forEach((frequency,i)=>{
    const osc=audioContext.createOscillator();const gain=audioContext.createGain();
    osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,now+i*.09);gain.gain.exponentialRampToValueAtTime(.055,now+i*.09+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+i*.09+.7);
    osc.connect(gain).connect(audioContext.destination);osc.start(now+i*.09);osc.stop(now+i*.09+.72);
  });
}
function enter(){
  if(phase!=='outside')return;
  walkProgress=0;walkTarget=0;dragYaw=0;
  phase='entering';playChime();heroUI.classList.add('is-hidden');hint.classList.add('is-hidden');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(()=>entrySplit.classList.add('is-active'),reduceMotion?20:360);
  setTimeout(()=>{
    insideUI.hidden=false;
    document.querySelector('#app').classList.add('inside-mode');
    entrySplit.classList.add('is-opening');
  },reduceMotion?100:1380);
  setTimeout(()=>{
    entrySplit.classList.remove('is-active','is-opening');
    if(phase==='entering')phase='inside';
  },reduceMotion?220:2480);
}
function exit(){
  if(phase!=='inside')return;
  phase='exiting';insideUI.hidden=true;transition.classList.add('active');
  setTimeout(()=>{walkProgress=0;walkTarget=0;camera.position.set(house.position.x,1.85,-2.5);heroUI.classList.remove('is-hidden');hint.classList.remove('is-hidden');document.querySelector('#app').classList.remove('inside-mode');transition.classList.remove('active');},650);
  setTimeout(()=>{phase='outside';dragYaw=0;},1750);
}
function showRoomContent(key){
  const item=rooms[key];if(!item)return;
  roomUI.dataset.theme=key;
  document.querySelector('#room-kicker').textContent=item.category;
  document.querySelector('#room-title').textContent=item.title;
  document.querySelector('#room-intro').textContent=item.intro;
  const content=document.querySelector('#room-exhibits');
  content.replaceChildren();
  item.entries.forEach((entry,index)=>{
    const card=document.createElement('article');card.className='exhibit-card';
    const number=document.createElement('span');number.className='exhibit-number';number.textContent=String(index+1).padStart(2,'0');card.append(number);
    if(entry.date){const date=document.createElement('div');date.className='exhibit-date';date.textContent=entry.date;card.append(date)}
    const heading=document.createElement('h3');heading.textContent=entry.title;card.append(heading);
    if(entry.points){const list=document.createElement('ul');entry.points.forEach(point=>{const line=document.createElement('li');line.textContent=point;list.append(line)});card.append(list)}
    if(entry.link){const link=document.createElement('a');link.href=entry.link;link.textContent=entry.linkLabel;link.rel='noopener noreferrer';if(!entry.link.startsWith('mailto:'))link.target='_blank';card.append(link)}
    content.append(card);
  });
  content.scrollTop=0;
}
function enterRoom(key){
  if(phase!=='inside'||!rooms[key])return;
  const door=corridorDoors.find(item=>item.key===key);
  if(!door)return;
  const forward=new THREE.Vector3();camera.getWorldDirection(forward);
  roomJourney={
    key,start:clock.getElapsedTime(),
    from:camera.position.clone(),fromLook:camera.position.clone().addScaledVector(forward,8),
    to:new THREE.Vector3(house.position.x+door.side*.72,1.65,door.segment.position.z+door.doorZ),
    look:new THREE.Vector3(house.position.x+door.side*2.74,1.62,door.segment.position.z+door.doorZ),
  };
  activeRoomDoor=door;
  closedDoor=null;
  showRoomContent(key);
  phase='approaching-room';insideUI.hidden=true;dragYaw=0;playChime();
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduceMotion?120:1450;
  setTimeout(()=>transition.classList.add('active'),duration);
  setTimeout(()=>{
    if(phase!=='approaching-room')return;
    phase='room';roomStage.visible=true;
    Object.entries(roomSets).forEach(([name,set])=>{set.visible=name===key});
    camera.position.set(0,1.72,roomStage.position.z+8.2);
    camera.lookAt(0,2,roomStage.position.z-4.5);
    roomUI.hidden=false;app.classList.add('room-mode');
    transition.classList.remove('active');
  },duration+490);
}
function leaveRoom(){
  if(phase!=='room'||!roomJourney||!activeRoomDoor)return;
  phase='leaving-room';
  roomUI.hidden=true;
  transition.classList.add('active');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  transition.style.transitionDuration=reduceMotion?'.01s':'';
  setTimeout(()=>{
    if(phase!=='leaving-room')return;
    roomStage.visible=false;
    app.classList.remove('room-mode');
    camera.position.copy(roomJourney.to);
    camera.lookAt(roomJourney.look);
    activeRoomDoor.hinge.rotation.y=activeRoomDoor.side*1.25;
    roomExit={
      start:clock.getElapsedTime(),
      closeEnd:reduceMotion ? .18 : 1.6,
      retreatEnd:reduceMotion ? .36 : 2.75,
      corridorLook:new THREE.Vector3(house.position.x,1.85,roomJourney.from.z-12),
    };
    transition.classList.remove('active');
  },reduceMotion?40:470);
}

document.querySelector('#exit-button').addEventListener('click',exit);
function walk(distance){
  if(phase!=='inside')return;
  walkTarget=Math.max(0,walkTarget+distance);
  if(distance>0)playChime();
}
document.querySelector('#walk-forward').addEventListener('click',()=>walk(8));
document.querySelector('#walk-back').addEventListener('click',()=>walk(-8));
document.querySelector('#room-back').addEventListener('click',leaveRoom);
document.querySelector('#home-link').addEventListener('click',e=>{e.preventDefault();if(phase==='inside')exit()});
document.querySelector('#sound-toggle').addEventListener('click',()=>{soundOn=!soundOn;document.querySelector('#sound-toggle').setAttribute('aria-pressed',String(soundOn));document.querySelector('#sound-label').textContent=soundOn?'SOUND ON':'SOUND OFF';playChime()});

function setPointer(e){const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1}
function isCenterWalkTarget(){return Math.abs(pointer.x)<.36&&Math.abs(pointer.y)<.62}
window.addEventListener('keydown',e=>{
  if(phase==='room'&&e.key==='Escape'){leaveRoom();return}
  if(phase!=='inside'||e.altKey||e.ctrlKey||e.metaKey)return;
  if(e.target instanceof HTMLElement&&e.target.matches('input, textarea, select, [contenteditable="true"]'))return;
  if(e.key==='ArrowUp'||e.key==='w'||e.key==='W'){
    e.preventDefault();walk(e.repeat?3:6);
  }else if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){
    e.preventDefault();walk(e.repeat?-3:-6);
  }
});
renderer.domElement.addEventListener('pointerdown',e=>{dragStart={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{
  pointerX=(e.clientX/innerWidth)*2-1;
  if(dragStart&&phase==='inside'){
    const dx=e.clientX-dragStart.lastX;
    const dy=e.clientY-dragStart.lastY;
    if(Math.hypot(e.clientX-dragStart.x,e.clientY-dragStart.y)>4)dragStart.moved=true;
    if(e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx))walkTarget=Math.max(0,walkTarget-dy*.045);
    else dragYaw=THREE.MathUtils.clamp(dragYaw-dx*.004,-.56,.56);
    dragStart.lastX=e.clientX;
    dragStart.lastY=e.clientY;
  }
  if(phase==='outside'||phase==='inside'){
    setPointer(e);raycaster.setFromCamera(pointer,camera);
    const targets=phase==='outside'?doorTargets:artTargets;
    renderer.domElement.style.cursor=(phase==='inside'&&isCenterWalkTarget())||raycaster.intersectObjects(targets,false).length?'pointer':'grab';
  }
});
window.addEventListener('wheel',e=>{
  if(phase!=='inside')return;
  e.preventDefault();
  walkTarget=Math.max(0,walkTarget+e.deltaY*.024);
},{passive:false});
renderer.domElement.addEventListener('pointerup',e=>{
  if(!dragStart)return;
  const moved=dragStart.moved||Math.hypot(e.clientX-dragStart.x,e.clientY-dragStart.y)>9;
  dragStart=null;if(moved)return;
  setPointer(e);raycaster.setFromCamera(pointer,camera);
  if(phase==='outside'&&raycaster.intersectObjects(doorTargets,false).length)enter();
  else if(phase==='inside'){
    const hit=raycaster.intersectObjects(artTargets,false)[0];
    if(hit)enterRoom(hit.object.userData.project);
    else if(isCenterWalkTarget())walk(6);
  }
});

function resize(){
  const w=sceneRoot.clientWidth,h=sceneRoot.clientHeight;
  camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);
  house.position.x=w<800?0:2.8;
  const petX=w<500?[-2,-1.2]:[-3.55,-2.28];
  house.userData.pets.forEach((pet,i)=>{pet.position.x=petX[i]});
}
window.addEventListener('resize',resize);
resize();
camera.position.set(0,3.4,16);
camera.lookAt(house.position.x*.35,2.6,0);

function animate(){
  requestAnimationFrame(animate);
  const t=clock.getElapsedTime();
  const inside=phase==='inside'||phase==='entering'||phase==='approaching-room'||(phase==='leaving-room'&&!!roomExit);
  const mobile=innerWidth<800;
  if(phase==='inside'){
    walkProgress=THREE.MathUtils.lerp(walkProgress,walkTarget,.065);
    if(Math.abs(walkProgress-walkTarget)<.02)walkProgress=walkTarget;
  }
  const segmentIndex=Math.floor(walkProgress/SEGMENT_LENGTH);
  corridorSegments.forEach((segment,i)=>{
    const worldIndex=i+Math.ceil((segmentIndex-i)/SEGMENT_COUNT)*SEGMENT_COUNT;
    segment.position.z=-worldIndex*SEGMENT_LENGTH;
  });
  if(phase==='approaching-room'&&roomJourney){
    const travel=THREE.MathUtils.smoothstep(t-roomJourney.start,.25,1.45);
    camera.position.copy(roomJourney.from).lerp(roomJourney.to,travel);
  }else if(phase==='leaving-room'&&roomExit){
    const retreat=THREE.MathUtils.smoothstep(t-roomExit.start,roomExit.closeEnd,roomExit.retreatEnd);
    camera.position.copy(roomJourney.to).lerp(roomJourney.from,retreat);
  }else if(phase==='room'||phase==='leaving-room'){
    camera.position.set(0,1.72,roomStage.position.z+8.2);
  }else{
    cameraGoal.set(inside?house.position.x:0,inside?1.78:(mobile?3.8:3.4),inside?1.5-walkProgress:(mobile?19:16));
    camera.position.lerp(cameraGoal,inside?.085:.028);
  }
  const loopIndex=Math.max(0,Math.floor(-camera.position.z/LOOP_LENGTH));
  corridorDoors.forEach((door)=>{
    const {hinge,segment,doorZ,side}=door;
    const distanceToDoor=camera.position.z-(segment.position.z+doorZ);
    const approaching=1-THREE.MathUtils.smoothstep(distanceToDoor,4.5,8.5);
    const passing=THREE.MathUtils.smoothstep(distanceToDoor,-2,0);
    if(closedDoor===door&&distanceToDoor>9.5)closedDoor=null;
    const openAmount=phase==='inside'&&closedDoor!==door?approaching*passing:0;
    const selected=phase==='approaching-room'&&activeRoomDoor===door;
    const journeyAmount=selected?THREE.MathUtils.smoothstep(t-roomJourney.start,.8,1.38):0;
    if(phase==='leaving-room'&&roomExit&&activeRoomDoor===door){
      const closing=THREE.MathUtils.smoothstep(t-roomExit.start,roomExit.closeEnd*.25,roomExit.closeEnd);
      hinge.rotation.y=side*1.25*(1-closing);
    }else{
      hinge.rotation.y=THREE.MathUtils.lerp(hinge.rotation.y,side*(selected?1.25*journeyAmount:.68*openAmount),.12);
    }
  });
  loopDoors.forEach(({gateway,left,right},slot)=>{
    const boundary=loopIndex+slot-1;
    gateway.visible=inside&&boundary>=0;
    if(!gateway.visible)return;
    gateway.position.z=-(boundary+1)*LOOP_LENGTH;
    const distance=camera.position.z-(house.position.z+gateway.position.z);
    const approaching=1-THREE.MathUtils.smoothstep(distance,4,10);
    const passing=THREE.MathUtils.smoothstep(distance,-3,0);
    const openAmount=approaching*passing;
    left.rotation.y=THREE.MathUtils.lerp(left.rotation.y,-1.55*openAmount,.11);
    right.rotation.y=THREE.MathUtils.lerp(right.rotation.y,1.55*openAmount,.11);
  });
  camera.fov=THREE.MathUtils.lerp(camera.fov,inside||phase==='room'||phase==='leaving-room'?54:42,.04);
  camera.updateProjectionMatrix();
  const yaw=inside?dragYaw:(mobile?0:pointerX*.035);
  if(phase==='approaching-room'&&roomJourney){
    const turn=THREE.MathUtils.smoothstep(t-roomJourney.start,0,.8);
    lookGoal.copy(roomJourney.fromLook).lerp(roomJourney.look,turn);
  }else if(phase==='leaving-room'&&roomExit){
    const turn=THREE.MathUtils.smoothstep(t-roomExit.start,roomExit.closeEnd,roomExit.retreatEnd);
    lookGoal.copy(roomJourney.look).lerp(roomExit.corridorLook,turn);
  }else if(phase==='room'||phase==='leaving-room'){
    lookGoal.set(0,2,roomStage.position.z-4.5);
  }else{
    lookGoal.set(inside?house.position.x+Math.sin(yaw)*10:house.position.x*(mobile?1:.44)+pointerX*.25,inside?1.85:(mobile?4.55:2.6),inside?camera.position.z-12:0);
  }
  camera.lookAt(lookGoal);
  interiorLight.position.set(phase==='room'||(phase==='leaving-room'&&!roomExit)?0:house.position.x,3,camera.position.z-4);
  if(phase==='outside')house.userData.pets.forEach((pet,i)=>{pet.position.y=.03+Math.sin(t*1.5+i*1.8)*.018});
  doorPivot.rotation.y=THREE.MathUtils.lerp(doorPivot.rotation.y,inside||phase==='room'||phase==='leaving-room'?-1.46:0,.055);
  house.rotation.y=phase==='outside'?Math.sin(t*.34)*.008:0;
  renderer.render(scene,camera);
  if(phase==='leaving-room'&&roomExit&&t-roomExit.start>=roomExit.retreatEnd){
    closedDoor=activeRoomDoor;
    phase='inside';insideUI.hidden=false;
    roomJourney=null;activeRoomDoor=null;roomExit=null;
    transition.style.transitionDuration='';
  }
}
animate();
window.addEventListener('load',()=>document.querySelector('#loading').classList.add('done'));
