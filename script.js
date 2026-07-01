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

/* --- Neon World Map Implementation --- */
function initGlobe() {
  const canvas = document.getElementById('globe-canvas');
  const popup = document.getElementById('map-popup');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

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
  window.addEventListener('resize', resizeCanvas);

  const clients = [
    { id: 'cityguilds', title: 'City & Guilds', lat: 53.8008, lon: -1.5491, color: '#bd00ff', desc: 'Excelled in City & Guilds to implement process improvements and automation solutions, leading to a 35% increase in operational efficiency and enhanced reporting capabilities for better decision-making.' },
    { id: 'fiserv_bin', title: 'Fiserv - 8 Digit BIN Conversion', lat: 13.0827, lon: 80.2707, color: '#00f0ff', desc: 'Delivered end-to-end implementation projects for enterprise clients, consistently achieving 100% adherence to project timelines and budget commitments while ensuring smooth stakeholder alignment. Conducted in-depth business and data analysis, providing actionable insights that improved decision-making efficiency and enhanced implementation outcomes. Drove process and organizational optimization initiatives, contributing to improved operational effectiveness, faster adoption rates, and measurable business value realization for clients.' },
    { id: 'fiserv_kent', title: 'Fiserv - Kent', lat: 17.3850, lon: 78.4867, color: '#00f0ff', desc: 'Led client onboarding and platform configuration activities, successfully configuring media, letters, statements, and notices for multiple clients, reducing deployment effort by 30% through standardized implementation practices. Managed end-to-end validation, testing, and migration processes across QA and Development environments, achieving 99%+ configuration accuracy and minimizing production defects. Collaborated closely with onshore teams during sprint and release cycles, accelerating wave-release readiness by 20% and ensuring seamless delivery of client-specific requirements through rigorous UAT and quality assurance.' },
    { id: 'homeserve', title: 'HomeServe PLC - HS Ensura', lat: 35.0456, lon: -85.3097, color: '#ff6ec7', desc: 'Led pricing and product configuration across 200+ On-Bill and Off-Bill partners, improving pricing accuracy by ~37% and reducing configuration turnaround times by 21% through process optimization and automation. Streamlined price increase and revenue-cycle workflows, collaborating with business stakeholders to enhance operational efficiency while ensuring seamless integration across Ensura and partner platforms. Drove UAT, application support, and synchronization testing, contributing to 99% configuration quality, faster issue resolution, and improved stakeholder confidence in product launches and pricing changes.' },
    { id: 'att', title: 'AT&T - Common Services Integration', lat: 17.3850, lon: 78.4867, color: '#0072ff', desc: 'Provided production support for mission-critical middleware applications, achieving 99.9% service availability through proactive monitoring, incident management, and SLA adherence. Performed root cause analysis, patch deployments, DR synchronization, and migration activities, reducing recurring production incidents by 25%+ and strengthening platform stability. Collaborated with development, testing, and vendor teams to resolve complex issues, optimize JVM performance, and ensure successful delivery of releases within defined change windows.' },
    { id: 'farmers_dashboard', title: 'Farmers Insurance - eFolio Dashboard', lat: 34.1683, lon: -118.6058, color: '#39ff14', desc: 'Developed and enhanced business-critical application components, delivering change requests with 100% adherence to functional requirements and improving overall system usability. Partnered with client and onsite stakeholders to translate business requirements into scalable technical solutions, enabling faster delivery cycles and improved customer satisfaction. Implemented business logic and application enhancements, contributing to greater process efficiency and reducing manual intervention across key insurance workflows.' },
    { id: 'farmers_eagent', title: 'Farmers Insurance - eAgent Dashboard', lat: 17.3850, lon: 78.4867, color: '#39ff14', desc: 'Managed application support, defect resolution, and incident handling, improving application stability by 20%+ through proactive monitoring and rapid issue remediation. Developed and maintained key application modules and change requests, enabling continuous platform enhancements while ensuring high-quality code delivery. Monitored server health and application performance, providing actionable insights through daily reporting and technical reviews that improved service reliability and stakeholder visibility.' }
  ];

  const continentShapes = [
    {
      points: [
        { lat: 72, lon: -168 }, { lat: 70, lon: -138 }, { lat: 64, lon: -125 }, { lat: 58, lon: -120 },
        { lat: 50, lon: -127 }, { lat: 46, lon: -123 }, { lat: 42, lon: -130 }, { lat: 34, lon: -119 },
        { lat: 28, lon: -96 }, { lat: 19, lon: -82 }, { lat: 12, lon: -73 }, { lat: 7, lon: -80 },
        { lat: 8, lon: -95 }, { lat: 14, lon: -110 }, { lat: 23, lon: -114 }, { lat: 32, lon: -124 },
        { lat: 41, lon: -139 }, { lat: 50, lon: -162 }, { lat: 60, lon: -165 }
      ]
    },
    {
      points: [
        { lat: 71, lon: -24 }, { lat: 64, lon: -8 }, { lat: 58, lon: 6 }, { lat: 54, lon: 14 },
        { lat: 49, lon: 12 }, { lat: 44, lon: 2 }, { lat: 41, lon: -5 }, { lat: 36, lon: -8 },
        { lat: 35, lon: -15 }, { lat: 39, lon: -24 }, { lat: 48, lon: -25 }, { lat: 56, lon: -16 },
        { lat: 62, lon: -20 }
      ]
    },
    {
      points: [
        { lat: 45, lon: -5 }, { lat: 38, lon: 2 }, { lat: 35, lon: 14 }, { lat: 32, lon: 24 },
        { lat: 26, lon: 29 }, { lat: 19, lon: 20 }, { lat: 14, lon: 12 }, { lat: 10, lon: 8 },
        { lat: 5, lon: 8 }, { lat: -1, lon: 14 }, { lat: -8, lon: 13 }, { lat: -15, lon: 18 },
        { lat: -22, lon: 15 }, { lat: -29, lon: 12 }, { lat: -34, lon: 18 }, { lat: -36, lon: 28 },
        { lat: -27, lon: 32 }, { lat: -20, lon: 40 }, { lat: -8, lon: 40 }, { lat: 2, lon: 35 },
        { lat: 10, lon: 30 }, { lat: 18, lon: 25 }, { lat: 28, lon: 18 }, { lat: 35, lon: 10 }
      ]
    },
    {
      points: [
        { lat: 57, lon: 58 }, { lat: 50, lon: 52 }, { lat: 45, lon: 61 }, { lat: 40, lon: 74 },
        { lat: 35, lon: 86 }, { lat: 27, lon: 94 }, { lat: 18, lon: 94 }, { lat: 10, lon: 90 },
        { lat: 2, lon: 94 }, { lat: -6, lon: 94 }, { lat: -13, lon: 100 }, { lat: -20, lon: 97 },
        { lat: -28, lon: 100 }, { lat: -37, lon: 117 }, { lat: -33, lon: 131 }, { lat: -18, lon: 132 },
        { lat: -6, lon: 129 }, { lat: 6, lon: 123 }, { lat: 22, lon: 115 }, { lat: 35, lon: 103 },
        { lat: 45, lon: 86 }, { lat: 52, lon: 72 }, { lat: 56, lon: 65 }
      ]
    },
    {
      points: [
        { lat: -10, lon: 112 }, { lat: -20, lon: 120 }, { lat: -32, lon: 132 }, { lat: -31, lon: 146 },
        { lat: -24, lon: 154 }, { lat: -14, lon: 148 }, { lat: -4, lon: 137 }, { lat: 6, lon: 130 }
      ]
    }
  ];

  function latLonToCanvas(lat, lon) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const marginX = width * 0.08;
    const marginY = height * 0.08;
    const mapW = width - marginX * 2;
    const mapH = height - marginY * 2;
    return {
      x: marginX + ((lon + 180) / 360) * mapW,
      y: marginY + ((90 - lat) / 180) * mapH
    };
  }

  function drawWorldMap() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const ocean = ctx.createLinearGradient(0, 0, width, height);
    ocean.addColorStop(0, 'rgba(2, 10, 25, 0.96)');
    ocean.addColorStop(1, 'rgba(4, 18, 33, 0.96)');
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(width * 0.62, height * 0.34, 0, width * 0.62, height * 0.34, width * 0.6);
    glow.addColorStop(0, 'rgba(0, 240, 255, 0.16)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(width * 0.62, height * 0.34, width * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.rect(width * 0.08, height * 0.08, width * 0.84, height * 0.84);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.14)';
    ctx.strokeStyle = 'rgba(255,255,255,0.36)';
    ctx.lineWidth = 1.4;
    continentShapes.forEach(shape => {
      if (!shape.points || shape.points.length < 3) return;
      ctx.beginPath();
      shape.points.forEach((point, index) => {
        const p = latLonToCanvas(point.lat, point.lon);
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.8;
    for (let lon = -180; lon <= 180; lon += 30) {
      ctx.beginPath();
      const p1 = latLonToCanvas(90, lon);
      const p2 = latLonToCanvas(-90, lon);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      const p1 = latLonToCanvas(lat, -180);
      const p2 = latLonToCanvas(lat, 180);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function computePins() {
    return clients.map(c => ({
      ...c,
      proj: latLonToCanvas(c.lat, c.lon),
      visible: true
    }));
  }

  function drawPinsAndArcs() {
    const pinSet = computePins();

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.23)';
    ctx.lineWidth = 1.3;
    for (let i = 0; i < pinSet.length - 1; i++) {
      const a = pinSet[i];
      const b = pinSet[i + 1];
      ctx.beginPath();
      ctx.moveTo(a.proj.x, a.proj.y);
      ctx.lineTo(b.proj.x, b.proj.y);
      ctx.stroke();
    }
    ctx.restore();

    pinSet.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.color + '33';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 14;
      ctx.arc(p.proj.x, p.proj.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(p.proj.x, p.proj.y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.2;
      ctx.arc(p.proj.x, p.proj.y, 9, 0, Math.PI * 2);
      ctx.stroke();
    });

    return pinSet;
  }

  let lastPinSet = [];
  canvas.addEventListener('click', (ev) => {
    const rect = canvas.getBoundingClientRect();
    const mx = ev.clientX - rect.left;
    const my = ev.clientY - rect.top;
    let nearest = null;
    let nd = 9999;
    lastPinSet.forEach(p => {
      const dx = mx - p.proj.x;
      const dy = my - p.proj.y;
      const dist = Math.hypot(dx, dy);
      if (dist < nd && dist < 22) { nd = dist; nearest = p; }
    });
    if (nearest) {
      showPopupFor(nearest);
    } else {
      hidePopup();
    }
  });

  function showPopupFor(p) {
    if (!popup) return;
    popup.innerHTML = `<button class="close-btn">✕</button><div class="title">${p.title}</div><div class="desc">${p.desc}</div>`;
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

  function animate() {
    drawWorldMap();
    lastPinSet = drawPinsAndArcs();
    requestAnimationFrame(animate);
  }

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
