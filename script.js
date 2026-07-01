// Check Matter.js load
const { Engine, World, Bodies, Mouse, MouseConstraint, Runner } = Matter;

// Skills Data Extracted from Resume
const skillsData = [
  { name: "Agile", category: "delivery" },
  { name: "Waterfall", category: "delivery" },
  { name: "Jira", category: "delivery" },
  { name: "Power BI", category: "analytics" },
  { name: "Tableau", category: "analytics" },
  { name: "Microsoft Fabric", category: "analytics" },
  { name: "BPMN", category: "modelling" },
  { name: "As-Is / To-Be", category: "modelling" },
  { name: "User Journeys", category: "modelling" },
  { name: "MS Power Platform", category: "automation" },
  { name: "RPA & NLP", category: "automation" },
  { name: "GenAI & LLM", category: "automation" },
  { name: "Neural Networks", category: "automation" },
  { name: "Process Modelling", category: "modelling" },
  { name: "KPI Design", category: "analytics" },
  { name: "Continuous Improvement", category: "delivery" },
  { name: "UAT", category: "delivery" },
  { name: "R / R Shiny", category: "analytics" },
  { name: "SAP", category: "analytics" },
  { name: "Visio", category: "modelling" },
  { name: "Miro", category: "modelling" },
  { name: "Business Analysis", category: "modelling" },
  { name: "Automation", category: "automation" },
  { name: "Project Management", category: "delivery" },
  { name: "SWOT", category: "analytics" },
  { name: "RCA", category: "analytics" },
  { name: "SDLC", category: "delivery" }
];

// Initialize Canvas
const canvas = document.getElementById('physics-canvas');
const context = canvas.getContext('2d');

// Matter.js Setup
const engine = Engine.create({
  gravity: { x: 0, y: 0 } // Zero Gravity
});
const world = engine.world;
const runner = Runner.create();

let walls = [];
let cardBodies = [];
let skillBodies = [];
let mouseConstraint;
let mouse;

// Helper to draw rounded rectangle in Canvas
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/* --- Neon Globe / Map Implementation --- */
function initGlobe() {
  const canvas = document.getElementById('globe-canvas');
  const popup = document.getElementById('map-popup');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  // Handle HiDPI
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(600, rect.width) * dpr;
    canvas.height = Math.max(360, rect.height) * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); });

  const center = () => ({ x: canvas.width / (2 * (window.devicePixelRatio||1)), y: canvas.height / (2 * (window.devicePixelRatio||1)) });
  let radius = Math.min(canvas.width / (2*(window.devicePixelRatio||1)), canvas.height / (2*(window.devicePixelRatio||1))) - 26;

  // Simple client locations (approx lat, lon)
  const clients = [
    { id: 'cityguilds', title: 'City & Guilds', lat: 53.8008, lon: -1.5491, color: '#bd00ff', desc: 'Excelled in City & Guilds to implement process improvements and automation solutions, leading to a 35% increase in operational efficiency and enhanced reporting capabilities for better decision-making.' },
    { id: 'fiserv_bin', title: 'Fiserv - 8 Digit BIN Conversion', lat: 13.0827, lon: 80.2707, color: '#00f0ff', desc: 'Delivered end-to-end implementation projects for enterprise clients, consistently achieving 100% adherence to project timelines and budget commitments while ensuring smooth stakeholder alignment. Conducted in-depth business and data analysis, providing actionable insights that improved decision-making efficiency and enhanced implementation outcomes. Drove process and organizational optimization initiatives, contributing to improved operational effectiveness, faster adoption rates, and measurable business value realization for clients.' },
    { id: 'fiserv_kent', title: 'Fiserv - Kent', lat: 17.3850, lon: 78.4867, color: '#00f0ff', desc: 'Led client onboarding and platform configuration activities, successfully configuring media, letters, statements, and notices for multiple clients, reducing deployment effort by 30% through standardized implementation practices. Managed end-to-end validation, testing, and migration processes across QA and Development environments, achieving 99%+ configuration accuracy and minimizing production defects. Collaborated closely with onshore teams during sprint and release cycles, accelerating wave-release readiness by 20% and ensuring seamless delivery of client-specific requirements through rigorous UAT and quality assurance.' },
    { id: 'homeserve', title: 'HomeServe PLC - HS Ensura', lat: 35.0456, lon: -85.3097, color: '#ff6ec7', desc: 'Led pricing and product configuration across 200+ On-Bill and Off-Bill partners, improving pricing accuracy by ~37% and reducing configuration turnaround times by 21% through process optimization and automation. Streamlined price increase and revenue-cycle workflows, collaborating with business stakeholders to enhance operational efficiency while ensuring seamless integration across Ensura and partner platforms. Drove UAT, application support, and synchronization testing, contributing to 99% configuration quality, faster issue resolution, and improved stakeholder confidence in product launches and pricing changes.' },
    { id: 'att', title: 'AT&T - Common Services Integration', lat: 17.3850, lon: 78.4867, color: '#0072ff', desc: 'Provided production support for mission-critical middleware applications, achieving 99.9% service availability through proactive monitoring, incident management, and SLA adherence. Performed root cause analysis, patch deployments, DR synchronization, and migration activities, reducing recurring production incidents by 25%+ and strengthening platform stability. Collaborated with development, testing, and vendor teams to resolve complex issues, optimize JVM performance, and ensure successful delivery of releases within defined change windows.' },
    { id: 'farmers_dashboard', title: 'Farmers Insurance - eFolio Dashboard', lat: 34.1683, lon: -118.6058, color: '#39ff14', desc: 'Developed and enhanced business-critical application components, delivering change requests with 100% adherence to functional requirements and improving overall system usability. Partnered with client and onsite stakeholders to translate business requirements into scalable technical solutions, enabling faster delivery cycles and improved customer satisfaction. Implemented business logic and application enhancements, contributing to greater process efficiency and reducing manual intervention across key insurance workflows.' },
    { id: 'farmers_eagent', title: 'Farmers Insurance - eAgent Dashboard', lat: 17.3850, lon: 78.4867, color: '#39ff14', desc: 'Managed application support, defect resolution, and incident handling, improving application stability by 20%+ through proactive monitoring and rapid issue remediation. Developed and maintained key application modules and change requests, enabling continuous platform enhancements while ensuring high-quality code delivery. Monitored server health and application performance, providing actionable insights through daily reporting and technical reviews that improved service reliability and stakeholder visibility.' }
  ];

  // Load equirectangular world map texture for visible outlines
  const mapImg = new Image();
  mapImg.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2000px-World_map_-_low_resolution.svg.png';
  let mapLoaded = false;
  let mapError = false;
  mapImg.onload = () => { mapLoaded = true; mapError = false; };
  mapImg.onerror = () => {
    mapLoaded = false;
    mapError = true;
    console.warn('Globe map texture failed to load, using fallback outline.');
  };

  // Globe rotation state
  let rotY = 0; // longitude rotation (radians)
  let rotX = 0; // latitude rotation
  let targetRotY = 0;
  let targetRotX = 0;

  // Utility functions
  function degToRad(d) { return d * Math.PI / 180; }

  function latLonToCartesian(lat, lon, r) {
    const phi = degToRad(90 - lat);
    const theta = degToRad(lon + 180);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    return { x, y, z };
  }

  function rotatePoint(p, rx, ry) {
    // rotate around X (rx) then Y (ry)
    // X rotation
    let x = p.x;
    let y = p.y * Math.cos(rx) - p.z * Math.sin(rx);
    let z = p.y * Math.sin(rx) + p.z * Math.cos(rx);
    // Y rotation
    const nx = x * Math.cos(ry) + z * Math.sin(ry);
    const nz = -x * Math.sin(ry) + z * Math.cos(ry);
    return { x: nx, y: y, z: nz };
  }

  function project(p) {
    const c = center();
    // simple orthographic projection with slight perspective
    const scale = 1.0 + (p.z / (radius * 4));
    return { x: c.x + p.x * scale, y: c.y - p.y * scale, z: p.z };
  }

  const fallbackLandmasses = [
    [
      { lat: 60, lon: -145 }, { lat: 56, lon: -135 }, { lat: 50, lon: -120 }, { lat: 45, lon: -100 },
      { lat: 35, lon: -90 }, { lat: 30, lon: -80 }, { lat: 22, lon: -75 }, { lat: 10, lon: -80 },
      { lat: 2, lon: -75 }, { lat: -12, lon: -60 }, { lat: -22, lon: -55 }, { lat: -30, lon: -60 },
      { lat: -20, lon: -80 }, { lat: -12, lon: -100 }, { lat: 10, lon: -110 }, { lat: 30, lon: -120 },
      { lat: 45, lon: -135 }, { lat: 55, lon: -145 }
    ],
    [
      { lat: 70, lon: -20 }, { lat: 65, lon: 0 }, { lat: 60, lon: 20 }, { lat: 55, lon: 30 },
      { lat: 50, lon: 10 }, { lat: 50, lon: -10 }, { lat: 58, lon: -20 }, { lat: 66, lon: -25 }
    ],
    [
      { lat: 45, lon: 0 }, { lat: 35, lon: 10 }, { lat: 30, lon: 20 }, { lat: 10, lon: 20 },
      { lat: 5, lon: 10 }, { lat: -5, lon: 10 }, { lat: -10, lon: 20 }, { lat: -20, lon: 20 },
      { lat: -30, lon: 10 }, { lat: -35, lon: 0 }, { lat: -20, lon: -10 }, { lat: 0, lon: -10 }
    ],
    [
      { lat: 50, lon: 60 }, { lat: 45, lon: 70 }, { lat: 40, lon: 85 }, { lat: 30, lon: 95 },
      { lat: 15, lon: 100 }, { lat: 5, lon: 105 }, { lat: -10, lon: 100 }, { lat: -20, lon: 95 },
      { lat: -30, lon: 100 }, { lat: -40, lon: 115 }, { lat: -35, lon: 130 }, { lat: -15, lon: 130 },
      { lat: 5, lon: 130 }, { lat: 20, lon: 120 }, { lat: 35, lon: 110 }, { lat: 47, lon: 95 }
    ],
    [
      { lat: -10, lon: 110 }, { lat: -20, lon: 120 }, { lat: -30, lon: 135 }, { lat: -25, lon: 150 },
      { lat: -15, lon: 145 }, { lat: -5, lon: 140 }, { lat: 5, lon: 130 }
    ]
  ];

  function drawFallbackLandmasses() {
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;

    fallbackLandmasses.forEach(shape => {
      let started = false;
      ctx.beginPath();
      shape.forEach((coord, idx) => {
        const cart = latLonToCartesian(coord.lat, coord.lon, radius * 0.94);
        const rotated = rotatePoint(cart, rotX, rotY);
        if (rotated.z <= 0) {
          started = false;
          return;
        }
        const p = project(rotated);
        if (!started) {
          ctx.moveTo(p.x, p.y);
          started = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      });
      if (started) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  // Compute projected positions for pins
  function computePins() {
    radius = Math.min(canvas.width / (2*(window.devicePixelRatio||1)), canvas.height / (2*(window.devicePixelRatio||1))) - 26;
    return clients.map(c => {
      const cart = latLonToCartesian(c.lat, c.lon, radius * 0.92);
      const rotated = rotatePoint(cart, rotX, rotY);
      const proj = project(rotated);
      return Object.assign({}, c, { cart, rotated, proj, visible: rotated.z > -radius * 0.95 });
    });
  }

  // Draw functions
  function drawGlobe() {
    const c = center();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // outer glow
    const grad = ctx.createRadialGradient(c.x, c.y, radius * 0.3, c.x, c.y, radius * 1.1);
    grad.addColorStop(0, 'rgba(0,240,255,0.06)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(c.x, c.y, radius + 8, 0, Math.PI * 2);
    ctx.fill();

    // globe base
    // draw textured map clipped to globe
    ctx.save();
    ctx.beginPath();
    ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
    ctx.clip();
    if (mapLoaded) {
      const mapH = radius * 2;
      const mapW = mapH * 2; // equirectangular ratio
      const offset = ((rotY / (Math.PI * 2)) * mapW) % mapW;
      ctx.drawImage(mapImg, -offset + c.x - mapW/2, c.y - mapH/2, mapW, mapH);
      ctx.drawImage(mapImg, -offset + c.x - mapW/2 + mapW, c.y - mapH/2, mapW, mapH);
    } else {
      const globeGrad = ctx.createRadialGradient(c.x - radius * 0.3, c.y - radius * 0.3, radius * 0.1, c.x, c.y, radius);
      globeGrad.addColorStop(0, 'rgba(0,114,255,0.08)');
      globeGrad.addColorStop(1, 'rgba(10,10,10,0.85)');
      ctx.fillStyle = globeGrad;
      ctx.fillRect(c.x - radius, c.y - radius, radius * 2, radius * 2);
      drawFallbackLandmasses();
    }
    ctx.restore();

    // rim
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(0,240,255,0.12)';
    ctx.beginPath();
    ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // lat / lon grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.8;
    for (let lat = -60; lat <= 60; lat += 20) {
      ctx.beginPath();
      const points = 80;
      for (let i = 0; i <= points; i++) {
        const lon = (i / points) * 360 - 180;
        const cart = latLonToCartesian(lat, lon, radius);
        const r = rotatePoint(cart, rotX, rotY);
        const p = project(r);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 30) {
      ctx.beginPath();
      const points = 80;
      for (let i = 0; i <= points; i++) {
        const lat = (i / points) * 180 - 90;
        const cart = latLonToCartesian(lat, lon, radius);
        const r = rotatePoint(cart, rotX, rotY);
        const p = project(r);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  }

  function drawPinsAndArcs() {
    const pinSet = computePins();

    // draw arcs between consecutive clients in the array
    for (let i = 0; i < pinSet.length - 1; i++) {
      const a = pinSet[i];
      const b = pinSet[i + 1];
      if (!a.visible && !b.visible) continue;
      // great-circle interpolation
      const steps = 60;
      ctx.beginPath();
      for (let t = 0; t <= steps; t++) {
        const f = t / steps;
        // slerp between normalized cart vectors
        const va = normalizeVec(a.cart);
        const vb = normalizeVec(b.cart);
        const angle = Math.acos(Math.min(1, Math.max(-1, dot(va, vb))));
        const sinAngle = Math.sin(angle) || 1e-6;
        const s1 = Math.sin((1 - f) * angle) / sinAngle;
        const s2 = Math.sin(f * angle) / sinAngle;
        const vx = va.x * s1 + vb.x * s2;
        const vy = va.y * s1 + vb.y * s2;
        const vz = va.z * s1 + vb.z * s2;
        const pt = rotatePoint({ x: vx * radius * 0.98, y: vy * radius * 0.98, z: vz * radius * 0.98 }, rotX, rotY);
        const p = project(pt);
        if (t === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(0,240,255,0.22)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    // draw pins
    pinSet.forEach(p => {
      if (!p.visible) return;
      // glow
      ctx.beginPath();
      ctx.fillStyle = p.color + '33';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 14;
      ctx.arc(p.proj.x, p.proj.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // core
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(p.proj.x, p.proj.y, 3, 0, Math.PI * 2);
      ctx.fill();
      // ring
      ctx.beginPath();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.2;
      ctx.arc(p.proj.x, p.proj.y, 9, 0, Math.PI * 2);
      ctx.stroke();
    });

    return pinSet;
  }

  // Vec helpers
  function dot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function len(v) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }
  function normalizeVec(v) { const l = len(v) || 1; return { x: v.x / l, y: v.y / l, z: v.z / l }; }

  // Interaction
  let lastPinSet = [];
  canvas.addEventListener('click', (ev) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const mx = (ev.clientX - rect.left) * (dpr);
    const my = (ev.clientY - rect.top) * (dpr);
    // find nearest visible pin
    let nearest = null;
    let nd = 9999;
    lastPinSet.forEach(p => {
      if (!p.visible) return;
      const dx = mx / dpr - p.proj.x;
      const dy = my / dpr - p.proj.y;
      const dist = Math.hypot(dx, dy);
      if (dist < nd && dist < 22) { nd = dist; nearest = p; }
    });
    if (nearest) {
      showPopupFor(nearest, rect);
      rotateToClient(nearest);
    } else {
      hidePopup();
    }
  });

  function showPopupFor(p, rect) {
    if (!popup) return;
    popup.innerHTML = `<button class=\"close-btn\">✕</button><div class=\"title\">${p.title}</div><div class=\"desc\">${p.desc}</div>`;
    popup.classList.remove('hidden');

    const containerRect = canvas.getBoundingClientRect();
    let left = p.proj.x;
    let top = p.proj.y;
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    const popupRect = popup.getBoundingClientRect();
    const edgePadding = 16;
    if (popupRect.left < containerRect.left + edgePadding) {
      popup.style.left = `${left + (containerRect.left + edgePadding - popupRect.left)}px`;
      popup.style.transform = 'translate(0, -120%)';
    } else if (popupRect.right > containerRect.right - edgePadding) {
      popup.style.left = `${left - (popupRect.right - containerRect.right + edgePadding)}px`;
      popup.style.transform = 'translate(0, -120%)';
    } else {
      popup.style.transform = 'translate(-50%, -120%)';
    }

    if (popupRect.top < containerRect.top + edgePadding) {
      popup.style.top = `${top + edgePadding}px`;
      popup.style.transform = 'translate(-50%, 0)';
    }

    const btn = popup.querySelector('.close-btn');
    if (btn) btn.onclick = () => { hidePopup(); };
  }

  function hidePopup() {
    if (!popup) return;
    popup.classList.add('hidden');
  }

  function rotateToClient(client) {
    // target rotations to bring the pin roughly to center
    // approximate: rotY should be -lon, rotX should be lat*0.6
    targetRotY = degToRad(-client.lon);
    targetRotX = degToRad(client.lat) * 0.6;
  }

  // Mouse / touch drag to rotate globe
  let isDragging = false;
  let lastX = 0, lastY = 0;
  const dragSensitivity = 0.007; // radians per pixel

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    // update target rotations
    targetRotY += dx * dragSensitivity;
    targetRotX += dy * dragSensitivity * -1; // invert so dragging up rotates north
    // clamp latitude rotation
    const maxLat = Math.PI / 3;
    targetRotX = Math.max(-maxLat, Math.min(maxLat, targetRotX));
    // hide popup while dragging
    hidePopup();
  });
  window.addEventListener('pointerup', (e) => { isDragging = false; });

  // Smooth animation loop
  function animate() {
    // ease rotations
    const ease = 0.08;
    rotY += (targetRotY - rotY) * ease;
    rotX += (targetRotX - rotX) * ease;

    drawGlobe();
    lastPinSet = drawPinsAndArcs();
    requestAnimationFrame(animate);
  }

  // Initialize default rotation to show Europe/UK
  targetRotY = degToRad(10);
  targetRotX = degToRad(0);

  animate();
}

// Check Overlap with Card Rects
function isOverlapping(x, y, w, h, rects) {
  const buffer = 30;
  for (const r of rects) {
    if (x + w/2 > r.left - buffer &&
        x - w/2 < r.right + buffer &&
        y + h/2 > r.top - buffer &&
        y - h/2 < r.bottom + buffer) {
      return true;
    }
  }
  return false;
}

// Diagnostics Helper
function updateDiagnostics() {
  try {
    const sizeEl = document.getElementById('debug-canvas-size');
    const statusEl = document.getElementById('debug-engine-status');
    const pillsEl = document.getElementById('debug-pills-count');
    const obstaclesEl = document.getElementById('debug-obstacles-count');
    
    if (sizeEl) sizeEl.textContent = `${canvas.width} x ${canvas.height} px`;
    if (statusEl) statusEl.textContent = "ACTIVE";
    if (pillsEl) pillsEl.textContent = skillBodies.length;
    if (obstaclesEl) obstaclesEl.textContent = cardBodies.length;
  } catch (err) {
    console.error("Diagnostics error:", err);
  }
}

// Global JS error listener for diagnostics panel
window.addEventListener('error', (e) => {
  const errEl = document.getElementById('debug-last-error');
  if (errEl) {
    errEl.textContent = `${e.message} (${e.filename.split('/').pop()}:${e.lineno})`;
    errEl.classList.remove('text-green-400');
    errEl.classList.add('text-red-400');
  }
});

// Initialize Physics Environment
function initPhysics() {
  // Clear World
  World.clear(world);
  Engine.clear(engine);
  
  const width = window.innerWidth;
  const height = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    window.innerHeight,
    2000 // Ensure at least 2000px height fallback
  );
  
  canvas.width = width;
  canvas.height = height;

  // 1. Create Boundaries (Walls)
  const wallThickness = 100;
  const leftWall = Bodies.rectangle(-wallThickness/2, height/2, wallThickness, height, { isStatic: true });
  const rightWall = Bodies.rectangle(width + wallThickness/2, height/2, wallThickness, height, { isStatic: true });
  const ceiling = Bodies.rectangle(width/2, -wallThickness/2, width, wallThickness, { isStatic: true });
  const floor = Bodies.rectangle(width/2, height + wallThickness/2, width, wallThickness, { isStatic: true });
  
  walls = [leftWall, rightWall, ceiling, floor];
  World.add(world, walls);

  // 2. Query Card Obstacles
  const cardElements = document.querySelectorAll('.physics-obstacle');
  const cardRects = [];
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  
  cardBodies = [];
  cardElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const docX = rect.left + scrollX + rect.width / 2;
      const docY = rect.top + scrollY + rect.height / 2;
      
      const body = Bodies.rectangle(docX, docY, rect.width, rect.height, {
        isStatic: true,
        label: 'card-obstacle'
      });
      
      cardRects.push({
        left: rect.left + scrollX,
        right: rect.right + scrollX,
        top: rect.top + scrollY,
        bottom: rect.bottom + scrollY
      });
      cardBodies.push(body);
      World.add(world, body);
    }
  });

  // 3. Add Skills Pills
  skillBodies = [];
  skillsData.forEach((skill, index) => {
    const pillHeight = 38;
    const pillWidth = skill.name.length * 8 + 42;
    
    // Distribute skills along the height of the document
    let spawnYMin = 100;
    let spawnYMax = height - 200;
    
    // Group distribution
    if (index < 8) {
      // Hero area
      spawnYMin = 150;
      spawnYMax = window.innerHeight - 150;
    } else if (index < 16) {
      // Experience area
      spawnYMin = window.innerHeight + 100;
      spawnYMax = window.innerHeight * 2.2;
    } else {
      // Bottom/Contact area
      spawnYMin = window.innerHeight * 2.2;
      spawnYMax = height - 150;
    }
    
    // Find a safe spot without overlapping cards
    let rx = Math.random() * (width - pillWidth - 100) + 50 + pillWidth/2;
    let ry = Math.random() * (spawnYMax - spawnYMin) + spawnYMin;
    let attempts = 0;
    
    while (isOverlapping(rx, ry, pillWidth, pillHeight, cardRects) && attempts < 80) {
      rx = Math.random() * (width - pillWidth - 100) + 50 + pillWidth/2;
      ry = Math.random() * (spawnYMax - spawnYMin) + spawnYMin;
      attempts++;
    }
    
    const body = Bodies.rectangle(rx, ry, pillWidth, pillHeight, {
      restitution: 0.85,
      friction: 0.02,
      frictionAir: 0.008,
      label: 'skill-pill',
      plugin: {
        skill: {
          name: skill.name,
          category: skill.category,
          width: pillWidth,
          height: pillHeight
        }
      }
    });
    
    // Apply a random initial velocity vector
    const speed = 1.2;
    const angle = Math.random() * Math.PI * 2;
    Matter.Body.setVelocity(body, {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    });
    
    skillBodies.push(body);
    World.add(world, body);
  });

  // 4. Mouse interaction
  mouse = Mouse.create(canvas);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
      render: { visible: false }
    }
  });
  World.add(world, mouseConstraint);
  // Update System Diagnostics Panel
  updateDiagnostics();
}




// Custom Render Loop
function renderCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Guard: wait if physics is not initialized yet
  if (!mouseConstraint) {
    requestAnimationFrame(renderCanvas);
    return;
  }
  
  // Draw Connection Lines when dragging (subtle link)
  if (mouseConstraint.body) {

    const body = mouseConstraint.body;
    if (body.label === 'skill-pill') {
      context.beginPath();
      context.moveTo(mouse.position.x, mouse.position.y);
      context.lineTo(body.position.x, body.position.y);
      context.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      context.lineWidth = 1.5;
      context.setLineDash([5, 5]);
      context.stroke();
      context.setLineDash([]);
    }
  }

  // Render Skill Pills
  skillBodies.forEach(body => {
    const { name, category, width, height } = body.plugin.skill;
    
    context.save();
    context.translate(body.position.x, body.position.y);
    context.rotate(body.angle);
    
    // Determine Gradient & Theme Colors based on category
    const gradient = context.createLinearGradient(-width/2, -height/2, width/2, height/2);
    let borderStroke = 'rgba(255, 255, 255, 0.15)';
    let glowColor = 'rgba(255, 255, 255, 0.1)';
    let isHovered = (mouseConstraint.body === body);
    
    if (category === 'analytics') {
      // Neon Cyan
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 114, 255, 0.08)');
      borderStroke = isHovered ? '#00f0ff' : 'rgba(0, 240, 255, 0.55)';
      glowColor = 'rgba(0, 240, 255, 0.3)';
    } else if (category === 'automation') {
      // Neon Purple
      gradient.addColorStop(0, 'rgba(189, 0, 255, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 114, 255, 0.08)');
      borderStroke = isHovered ? '#bd00ff' : 'rgba(189, 0, 255, 0.55)';
      glowColor = 'rgba(189, 0, 255, 0.3)';
    } else if (category === 'delivery') {
      // Electric Blue / Violet
      gradient.addColorStop(0, 'rgba(0, 114, 255, 0.25)');
      gradient.addColorStop(1, 'rgba(189, 0, 255, 0.08)');
      borderStroke = isHovered ? '#0072ff' : 'rgba(0, 114, 255, 0.55)';
      glowColor = 'rgba(0, 114, 255, 0.3)';
    } else {
      // Modelling / Business Analysis - Glassy White Glow
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.04)');
      borderStroke = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.45)';
      glowColor = 'rgba(255, 255, 255, 0.15)';
    }

    // Outer Glow Shadow
    context.shadowColor = glowColor;
    context.shadowBlur = isHovered ? 20 : 10;
    
    // Draw Pill Background
    context.fillStyle = gradient;
    context.strokeStyle = borderStroke;
    context.lineWidth = isHovered ? 2.5 : 1.2;
    
    drawRoundedRect(context, -width/2, -height/2, width, height, 19);
    context.fill();
    context.shadowBlur = 0; // reset shadow for text
    context.stroke();
    
    // Draw Text Centered
    context.fillStyle = '#f3f4f6';
    context.font = '500 13px "Inter", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, 0, 0);
    
    context.restore();
  });
  
  requestAnimationFrame(renderCanvas);
}

// Maintain Float Drift & Speed Limits
Matter.Events.on(engine, 'afterUpdate', () => {
  if (!mouseConstraint) return;
  skillBodies.forEach(body => {
    // 1. Cap maximum velocity to prevent tunnel issues
    const maxSpeed = 4.5;
    if (body.speed > maxSpeed) {
      const ratio = maxSpeed / body.speed;
      Matter.Body.setVelocity(body, {
        x: body.velocity.x * ratio,
        y: body.velocity.y * ratio
      });
    }
    
    // 2. Keep floating dynamically in Zero-Gravity (avoid stopping)
    const minSpeed = 0.35;
    if (body.speed < minSpeed && mouseConstraint.body !== body) {
      const angle = Math.random() * Math.PI * 2;
      const forceMagnitude = 0.00015;
      Matter.Body.applyForce(body, body.position, {
        x: Math.cos(angle) * forceMagnitude,
        y: Math.sin(angle) * forceMagnitude
      });
    }
    
    // 3. Soft screen bounce adjustment (teleport wrap fallback if walls failed)
    const padding = 20;
    if (body.position.x < -padding || body.position.x > canvas.width + padding ||
        body.position.y < -padding || body.position.y > canvas.height + padding) {
      Matter.Body.setPosition(body, {
        x: Math.min(Math.max(body.position.x, 50), canvas.width - 50),
        y: Math.min(Math.max(body.position.y, 50), canvas.height - 50)
      });
    }
  });
});

// Run Matter engine
Runner.run(runner, engine);
requestAnimationFrame(renderCanvas);

// Init on load
window.addEventListener('load', () => {
  initPhysics();
  initTypewriter();
  initMagneticButtons();
  initScrollReveal();
  initGlobe();
});

// Re-init on window resizing (with debounce)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initPhysics();
  }, 250);
});


/* --- Dynamic Typist / Glitch Effect --- */
function initTypewriter() {
  const textElement = document.getElementById('typewriter-job-title');
  if (!textElement) return;
  
  const titles = [
    "Operations Technical Lead",
    "Automation & Process Specialist",
    "Continuous Improvement Leader"
  ];
  
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
      // Deleting characters
      textElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      // Typing characters
      textElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120;
    }
    
    // Handle state switch
    if (!isDeleting && charIndex === currentTitle.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 500; // Pause before typing next word
    }
    
    setTimeout(type, typingSpeed);
  }
  
  setTimeout(type, 1000);
}


/* --- Magnetic Button Hover Effect --- */
function initMagneticButtons() {
  const magneticEls = document.querySelectorAll('.magnetic-btn');
  
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    
    magneticEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Center of element
      const elX = rect.left + scrollX + rect.width / 2;
      const elY = rect.top + scrollY + rect.height / 2;
      
      const distance = Math.hypot(mouseX - elX, mouseY - elY);
      const inner = el.querySelector('.magnetic-btn-inner');
      
      const radius = 100; // Activation distance
      if (distance < radius) {
        // Pull strength scaling
        const strength = 0.35;
        const dx = (mouseX - elX) * strength;
        const dy = (mouseY - elY) * strength;
        
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        if (inner) {
          inner.style.transform = `translate(${dx * 0.4}px, ${dy * 0.4}px)`;
        }
        
        // Add active neon box glow
        el.style.borderColor = 'rgba(0, 240, 255, 0.8)';
        el.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.4)';
      } else {
        // Reset transforms smoothly
        el.style.transform = 'translate(0px, 0px)';
        if (inner) {
          inner.style.transform = 'translate(0px, 0px)';
        }
        el.style.borderColor = '';
        el.style.boxShadow = '';
      }
    });
  });
}


/* --- Intersection Observer Scroll Reveal --- */
function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);
  
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}
