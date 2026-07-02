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
  // Guard against missing D3 library (e.g. offline mode)
  if (typeof d3 === 'undefined') {
    const container = document.getElementById('client-map');
    if (container) {
      container.innerHTML = `<div class="flex items-center justify-center h-full text-gray-400 text-xs text-center p-4">
        <div>
          <i class="fa-solid fa-satellite-dish text-neoncyan text-2xl mb-3 animate-pulse"></i>
          <p class="font-tech text-white tracking-wider">OFFLINE - RADAR UPLINK DESYNC</p>
          <p class="mt-1 text-gray-500 max-w-xs mx-auto">Please connect to the internet to load external D3 assets and initialize the 3D neon globe.</p>
        </div>
      </div>`;
    }
    return;
  }

  const canvas = document.getElementById('globe-canvas');
  const popup = document.getElementById('map-popup');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  // State variables (defined early to avoid Temporal Dead Zone issues)
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let activePin = null;
  let hoveredPin = null;

  // Client Experience locations (chronological order)
  const clients = [
    {
      id: 'farmers_eagent',
      client: 'Farmers Insurance',
      project: 'eAgent Dashboard',
      location: 'Hyderabad, Telangana - India',
      lat: 17.44110700511055, 
      lon: 78.37791119185727,
      color: '#39ff14', // neongreen
      experience: [
        'Managed application support, defect resolution, and incident handling, improving application stability by <strong class="glow-text-green-sm">20%</strong> through <strong class="glow-text-green-sm">proactive monitoring and rapid issue remediation.</strong>',
        'Developed and maintained key application modules and change requests, enabling continuous platform enhancements while ensuring <strong class="glow-text-green-sm">high-quality code delivery</strong>.',
        'Monitored server health and application performance, providing actionable insights through daily reporting and technical reviews that improved <strong class="glow-text-green-sm">service reliability and stakeholder visibility</strong>.'
      ]
    },
    {
      id: 'farmers_dashboard',
      client: 'Farmers Insurance',
      project: 'eFolio Dashboard',
      location: 'Woodland Hills, California - USA',
      lat: 34.186174859481184,
      lon: -118.60200405338564,
      color: '#dc14ff', // neonpurple
      experience: [
        '<strong class="glow-text-purple-sm">Developed and enhanced business-critical application</strong> components, delivering change requests with <strong class="glow-text-purple-sm">100% adherence</strong> to functional requirements and improving overall system usability.',
        'Partnered with client and onsite stakeholders to translate business requirements into scalable technical solutions, enabling <strong class="glow-text-purple-sm">faster delivery cycles</strong> and <strong class="glow-text-purple-sm">improved customer satisfaction.</strong>',
        '<strong class="glow-text-purple-sm">Implemented business logic and application enhancements</strong>, contributing to <strong class="glow-text-purple-sm">greater process efficiency</strong> and reducing manual intervention across key workflows.'
      ]
    },
    {
      id: 'att',
      client: 'AT&T',
      project: 'Common Services Integration',
      location: 'Hyderabad, Telangana - India',
      lat: 13.064487167965432,
      lon: 77.51749558158743,
      color: '#0072ff', // neonblue
      experience: [
        '<strong class="glow-text-blue-sm">Provided production support for mission-critical middleware applications</strong>, achieving <strong class="glow-text-blue-sm">99.9% service availability</strong> through <strong class="glow-text-blue-sm">proactive monitoring, incident management, and SLA adherence.</strong>',
        'Performed <strong class="glow-text-blue-sm">root cause analysis, patch deployments, DR synchronization, and migration activities</strong>, reducing recurring production incidents by <strong class="glow-text-blue-sm">25%</strong> and strengthening platform stability.',
        'Collaborated with development, testing, and vendor teams to <strong class="glow-text-blue-sm">resolve complex issues, optimize JVM performance, and ensure successful delivery</strong> of releases within defined change windows.'
      ]
    },
    {
      id: 'homeserve',
      client: 'HomeServe PLC',
      project: 'HS Ensura',
      location: 'Chattanooga, Tennessee - USA',
      lat: 35.04841967028044,
      lon: -85.15554002085922,
      color: '#ff6ec7', // neonpink
      experience: [
        '<strong class="glow-text-pink-sm">Led pricing and product configuration</strong> across 200+ On-Bill and Off-Bill partners, improving pricing accuracy by <strong class="glow-text-pink-sm">~37%</strong> and reducing configuration turnaround times by <strong class="glow-text-pink-sm">21%</strong> through process optimization and automation.',
        'Streamlined <strong class="glow-text-pink-sm">price increase and revenue-cycle workflows</strong>, collaborating with business stakeholders to enhance operational efficiency while ensuring <strong class="glow-text-pink-sm">seamless integration</strong> across Ensura and partner platforms.',
        'Drove <strong class="glow-text-pink-sm">UAT, application support, and synchronization testing</strong>, contributing to <strong class="glow-text-pink-sm">99% configuration quality</strong>, faster issue resolution, and improved stakeholder confidence.'
      ]
    },
    {
      id: 'fiserv_kent',
      client: 'Fiserv',
      project: 'KENT Letters & Statements',
      location: 'Chennai, Tamil Nadu - India',
      lat: 12.91347988330609,
      lon: 80.22022417843846,
      color: '#00f0ff', // neoncyan
      experience: [
        '<strong class="glow-text-cyan-sm">Led client onboarding and platform configuration activities</strong>, successfully configuring media, letters, statements, and notices for multiple clients, reducing deployment effort by <strong class="glow-text-cyan-sm">30%</strong> through standardized implementation practices.',
        'Managed <strong class="glow-text-cyan-sm">end-to-end validation, testing, and migration processes</strong> across QA and Development environments, achieving <strong class="glow-text-cyan-sm">99%+ configuration accuracy</strong> and minimizing production defects.',
        'Collaborated closely with onshore teams during sprint and release cycles, accelerating wave-release readiness by <strong class="glow-text-cyan-sm">20%</strong> and ensuring seamless delivery of client-specific requirements through rigorous UAT.'
      ]
    },
    {
      id: 'fiserv_bin',
      client: 'Fiserv',
      project: '8 Digit BIN conversion',
      location: 'Chennai, Tamil Nadu - India',
      lat: 10.79447187962901,
      lon: 76.63691598344852,
      color: '#ff2d2d', // neonred
      experience: [
        '<strong class="glow-text-cyan-sm">Delivered end-to-end implementation projects</strong> for enterprise clients, consistently achieving <strong class="glow-text-cyan-sm">100% adherence</strong> to project timelines and budget commitments while ensuring smooth stakeholder alignment.',
        'Conducted in-depth business and data analysis, providing <strong class="glow-text-cyan-sm">actionable insights</strong> that improved decision-making efficiency and enhanced implementation outcomes.',
        'Drove process and organizational optimization initiatives, contributing to improved operational effectiveness, <strong class="glow-text-cyan-sm">faster adoption rates</strong>, and measurable business value realization for clients.'
      ]
    },
    {
      id: 'cityguilds',
      client: 'City & Guilds',
      project: 'Awarding Organisation - Centre Operations',
      location: 'Wakefield, West Yorkshire - UK',
      lat: 53.70011165280542, 
      lon: -1.5078706398613282,
      color: '#bd00ff', // neonpurple
      experience: [
        '<strong class="glow-text-purple-sm">Led and developed a high-performing operations team</strong>, balancing priorities across multiple workstreams while improving service delivery efficiency by <strong class="glow-text-purple-sm">30%</strong> through effective workload management, coaching, and capability development.',
        '<strong class="glow-text-purple-sm">Drove business transformation and operational improvement initiatives</strong>, leading discovery workshops, stakeholder engagement, and early-stage analysis across five strategic programmes, ensuring alignment between business goals and technology solutions.',
        '<strong class="glow-text-purple-sm">Designed end-to-end process models, governance frameworks, and Power BI reporting solutions</strong>, delivering <strong class="glow-text-purple-sm">95%</strong> reduction in process inefficiencies, <strong class="glow-text-purple-sm">30%</strong> increase in solution adoption, and enhanced KPI visibility for data-driven decision-making.'
      ]
    }
  ];

  let width = 600;
  let height = 360;
  let dpr = window.devicePixelRatio || 1;

  // D3 Projection and Path Generator
  const projection = d3.geoOrthographic()
    .scale(150)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  const pathGenerator = d3.geoPath(projection, ctx);
  const graticule = d3.geoGraticule();

  // Rotation angles: [yaw, pitch, roll]
  let rotation = [0, -20, 0];
  projection.rotate(rotation);

  let worldData = null;
  let countries = null;
  let globeLoaded = false;

  // Fetch world map data
  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(response => response.json())
    .then(data => {
      worldData = data;
      if (typeof topojson !== 'undefined') {
        countries = topojson.feature(worldData, worldData.objects.countries);
        globeLoaded = true;
      }
    })
    .catch(err => {
      console.warn("Failed to load country outlines, falling back to graticule radar mode.", err);
    });

  // Zoom controls configuration
  let zoomScale = 1.0;
  const zoomSlider = document.getElementById('globe-zoom');
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');

  function updateZoom() {
    if (zoomSlider) {
      zoomSlider.value = zoomScale;
    }
    const sphereRadius = Math.min(width, height) * 0.42 * zoomScale;
    projection.scale(sphereRadius).translate([width / 2, height / 2]);
    projection.rotate(rotation); // Maintain rotation state after zoom
    if (activePin) {
      positionPopup(activePin);
    }
  }

  if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => {
      zoomScale = parseFloat(e.target.value);
      updateZoom();
    });
  }

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      zoomScale = Math.min(6.0, zoomScale + 0.15);
      updateZoom();
    });
  }

  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      zoomScale = Math.max(0.6, zoomScale - 0.15);
      updateZoom();
    });
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Adjust scale based on size and zoomScale
    updateZoom();
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse Drag Rotation configuration

  // Smooth centering animation variables
  let rotationInterpolator = null;
  let transitionProgress = 0;
  const transitionDuration = 35; // ~0.6s at 60fps

  function startCenterAnimation(lon, lat) {
    const start = projection.rotate();
    // To center [lon, lat] on screen, we rotate the globe to [-lon, -lat, start[2]]
    const end = [-lon, -lat, start[2]];
    rotationInterpolator = d3.interpolate(start, end);
    transitionProgress = 0;
  }

  // Pre-calculate flight path segments in the requested sequence and loop back to start
  const pathSegments = [];
  for (let i = 0; i < clients.length; i++) {
    const p1 = clients[i];
    const p2 = clients[(i + 1) % clients.length];
    const dist = d3.geoDistance([p1.lon, p1.lat], [p2.lon, p2.lat]);
    const interpolator = d3.geoInterpolate([p1.lon, p1.lat], [p2.lon, p2.lat]);

    const points = [];
    const steps = Math.max(15, Math.round(dist * 35));
    for (let s = 0; s <= steps; s++) {
      points.push(interpolator(s / steps));
    }

    pathSegments.push({
      from: p1,
      to: p2,
      dist: dist,
      interpolator: interpolator,
      lineString: {
        type: "LineString",
        coordinates: points
      }
    });
  }
  const totalDistance = pathSegments.reduce((sum, seg) => sum + seg.dist, 0);
  const totalTravelTime = 10000; // 10 seconds total journey loop

  // Draw stem and glowing pin head
  function drawPin(x, y, color, isHovered, labelText, pinNumber) {
    // Stem
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 16);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Pin head glow
    ctx.beginPath();
    ctx.arc(x, y - 16, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = isHovered ? 18 : 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pin head center white dot
    ctx.beginPath();
    ctx.arc(x, y - 16, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Base ring on surface
    ctx.beginPath();
    ctx.ellipse(x, y, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Visible pin number badge
    if (pinNumber !== undefined) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y - 30, 8.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(5, 5, 5, 0.95)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.1;
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 9px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(pinNumber), x, y - 30);
      ctx.restore();
    }

    // Label on hover
    if (isHovered && labelText) {
      ctx.save();
      ctx.font = 'bold 11px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';

      const txtWidth = ctx.measureText(labelText).width;
      ctx.fillStyle = 'rgba(5, 5, 5, 0.85)';
      ctx.fillRect(x - txtWidth/2 - 6, y - 36, txtWidth + 12, 16);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x - txtWidth/2 - 6, y - 36, txtWidth + 12, 16);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, x, y - 24);
      ctx.restore();
    }
  }

  function renderPopup(p) {
    if (!popup) return;
    const clientHeading = p.project ? `${p.client} - ${p.project}` : p.client;
    
    // Construct bullet points
    let bulletListHtml = '';
    p.experience.forEach(bullet => {
      bulletListHtml += `<li>${bullet}</li>`;
    });

    popup.innerHTML = `<button class="close-btn">✕</button>
      <div class="title">${clientHeading} - ${p.location}</div>
      <div class="desc"><ul>${bulletListHtml}</ul></div>`;
    popup.classList.remove('hidden');
    positionPopup(p);
  }

  function positionPopup(p) {
    if (!popup || !p) return;
    const proj = projection([p.lon, p.lat]);
    if (!proj) return;

    const pCenter = projection.invert([width / 2, height / 2]);
    const isVisible = d3.geoDistance(pCenter, [p.lon, p.lat]) < Math.PI / 2;

    if (!isVisible) {
      popup.classList.add('hidden');
      return;
    }

    const containerRect = canvas.getBoundingClientRect();
    let left = proj[0];
    let top = proj[1] - 22; // Offset above pin

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    // Account for boundary collision
    const popupRect = popup.getBoundingClientRect();
    const edgePadding = 16;
    if (popupRect.left < containerRect.left + edgePadding) {
      popup.style.left = `${left + (containerRect.left + edgePadding - popupRect.left)}px`;
      popup.style.transform = 'translate(0, -100%)';
    } else if (popupRect.right > containerRect.right - edgePadding) {
      popup.style.left = `${left - (popupRect.right - containerRect.right + edgePadding)}px`;
      popup.style.transform = 'translate(0, -100%)';
    } else {
      popup.style.transform = 'translate(-50%, -100%)';
    }
  }

  function hidePopup() {
    if (!popup) return;
    popup.classList.add('hidden');
    activePin = null;
  }

  // Draw globe frame
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Space background & Radial Glow
    ctx.save();
    const radial = ctx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, projection.scale() * 1.5);
    radial.addColorStop(0, 'rgba(5, 15, 35, 0.45)');
    radial.addColorStop(0.6, 'rgba(3, 8, 20, 0.2)');
    radial.addColorStop(1, 'rgba(5, 5, 5, 0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, projection.scale() * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Draw Sphere base
    ctx.beginPath();
    pathGenerator({ type: "Sphere" });
    ctx.fillStyle = "rgba(4, 10, 24, 0.75)";
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 3. Draw Graticule lines
    ctx.beginPath();
    pathGenerator(graticule());
    ctx.strokeStyle = "rgba(189, 0, 255, 0.08)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // 4. Draw Countries outlines
    if (globeLoaded && countries) {
      ctx.beginPath();
      pathGenerator(countries);
      ctx.fillStyle = "rgba(0, 114, 255, 0.04)";
      ctx.fill();

      // Glowing stroke for outlines
      ctx.save();
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 4;
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.restore();
    }

    // 5. Draw Flight arcs connecting points (Double-pass glowing neon line)
    ctx.save();
    pathSegments.forEach(seg => {
      // Glow pass (solid, wide, translucent)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 4.0;
      ctx.beginPath();
      pathGenerator(seg.lineString);
      ctx.stroke();

      // Core pass (dashed, sharp, bright neon cyan)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      pathGenerator(seg.lineString);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    ctx.restore();

    // 6. Draw Aircraft flying along flight arc path
    const elapsed = Date.now() % totalTravelTime;
    const progress = elapsed / totalTravelTime;
    const targetDist = progress * totalDistance;
    let distAccum = 0;
    let activeSeg = null;
    let segProgress = 0;

    for (const seg of pathSegments) {
      if (seg.dist > 0) {
        if (distAccum + seg.dist >= targetDist) {
          activeSeg = seg;
          segProgress = (targetDist - distAccum) / seg.dist;
          break;
        }
        distAccum += seg.dist;
      }
    }
    if (!activeSeg && pathSegments.length > 0) {
      activeSeg = pathSegments[pathSegments.length - 1];
      segProgress = 1.0;
    }

    if (activeSeg) {
      const pulseLoc = activeSeg.interpolator(segProgress);
      const projPulse = projection(pulseLoc);
      if (projPulse) {
        const pCenter = projection.invert([width / 2, height / 2]);
        const isPulseVisible = d3.geoDistance(pCenter, pulseLoc) < Math.PI / 2;
        if (isPulseVisible) {
          // Calculate heading using a small delta step in progress
          const nextProgress = Math.min(1.0, segProgress + 0.005);
          const nextLoc = activeSeg.interpolator(nextProgress);
          const projNext = projection(nextLoc);
          
          let angle = 0;
          if (projNext) {
            angle = Math.atan2(projNext[1] - projPulse[1], projNext[0] - projPulse[0]);
          }

          ctx.save();
          ctx.translate(projPulse[0], projPulse[1]);
          ctx.rotate(angle);

          // Draw stylized vector aircraft pointing to the right (angle 0)
          ctx.beginPath();
          ctx.moveTo(8, 0);       // Nose
          ctx.lineTo(-4, -5);     // Left wingtip
          ctx.lineTo(-2, -1.5);   // Left wing back
          ctx.lineTo(-6, -1.5);   // Left tail stabilizer
          ctx.lineTo(-6, 1.5);    // Right tail stabilizer
          ctx.lineTo(-2, 1.5);    // Right wing back
          ctx.lineTo(-4, 5);      // Right wingtip
          ctx.closePath();

          // Aircraft body fill with neon glow
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Exhaust flame/trail (hot pink neon)
          ctx.beginPath();
          ctx.moveTo(-6, 0);
          ctx.lineTo(-12, 0);
          ctx.strokeStyle = 'rgba(255, 110, 199, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.restore();
        }
      }
    }

    // 7. Draw physical pins
    const pCenter = projection.invert([width / 2, height / 2]);
    clients.forEach((p, index) => {
      const isVisible = d3.geoDistance(pCenter, [p.lon, p.lat]) < Math.PI / 2;
      if (isVisible) {
        const proj = projection([p.lon, p.lat]);
        if (proj) {
          const isHovered = (hoveredPin && hoveredPin.id === p.id);
          const label = p.client;
          drawPin(proj[0], proj[1], p.color, isHovered, label, index + 1);
        }
      }
    });

    // 8. Update floating popup position dynamically
    if (activePin) {
      positionPopup(activePin);
    }
  }

  // Interaction handlers
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
    rotationInterpolator = null; // Interrupt animation
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Check hover state when not dragging
    if (!isDragging) {
      let foundHover = null;
      const pCenter = projection.invert([width / 2, height / 2]);
      
      clients.forEach(p => {
        const isVisible = d3.geoDistance(pCenter, [p.lon, p.lat]) < Math.PI / 2;
        if (isVisible) {
          const proj = projection([p.lon, p.lat]);
          if (proj) {
            // Check closeness to pin head (proj[1]-16) or pin base (proj[1])
            const dx = mx - proj[0];
            const dy = my - (proj[1] - 16);
            if (Math.hypot(dx, dy) < 10) {
              foundHover = p;
            }
          }
        }
      });

      hoveredPin = foundHover;
      canvas.style.cursor = hoveredPin ? 'pointer' : 'default';
    } else {
      // Rotate globe on drag
      const dx = e.clientX - previousMousePosition.x;
      const dy = e.clientY - previousMousePosition.y;

      rotation[0] += dx * 0.22;
      rotation[1] -= dy * 0.22;
      rotation[1] = Math.max(-55, Math.min(55, rotation[1])); // Limit tilt

      projection.rotate(rotation);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('click', (e) => {
    if (hoveredPin) {
      activePin = hoveredPin;
      renderPopup(activePin);
      startCenterAnimation(activePin.lon, activePin.lat);
    } else {
      // Close popup if user clicks empty globe space (not dragging)
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      // Ensure it wasn't a drag release
      if (Math.hypot(e.clientX - previousMousePosition.x, e.clientY - previousMousePosition.y) < 3) {
        hidePopup();
      }
    }
  });

  // Popup close button listener delegation
  popup.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-btn')) {
      hidePopup();
    }
  });

  // Main animation frame loop
  let lastTime = Date.now();
  function animate() {
    const now = Date.now();
    const dt = now - lastTime;
    lastTime = now;

    // Smooth transition centering animation
    if (rotationInterpolator) {
      transitionProgress += 1.8 / transitionDuration;
      if (transitionProgress >= 1) {
        projection.rotate(rotationInterpolator(1));
        rotation = projection.rotate();
        rotationInterpolator = null;
      } else {
        projection.rotate(rotationInterpolator(transitionProgress));
        rotation = projection.rotate();
      }
    } else if (!isDragging && !activePin) {
      // Slow auto rotation when idle
      rotation[0] += 0.008 * dt;
      projection.rotate(rotation);
    }

    draw();
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
    const file = e.filename ? e.filename.split('/').pop() : 'unknown';
    errEl.textContent = `${e.message} (${file}:${e.lineno || 0})`;
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
