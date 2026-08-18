/**
 * RENZ BRIAN VELEZ · PORTFOLIO SCRIPT ENGINE
 * Synthesizes Zen Yin-Yang Ambient Physics with Interactive Developer Terminal
 */

(function () {
  'use strict';

  // ---------- 1. THEME ENGINE (Yin / Yang) ----------
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const STORAGE_KEY = 'rbv-zen-theme';

  function applyTheme(theme) {
    if (theme === 'yin') {
      root.setAttribute('data-theme', 'yin');
    } else {
      root.removeAttribute('data-theme');
    }
    // Notify canvas of theme change
    if (window.updateCanvasTheme) {
      window.updateCanvasTheme(theme);
    }
  }

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('yin');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isYin = root.getAttribute('data-theme') === 'yin';
      const nextTheme = isYin ? 'yang' : 'yin';
      applyTheme(nextTheme);
      localStorage.setItem(STORAGE_KEY, nextTheme);
    });
  }

  // ---------- MOBILE MENU DRAWER ----------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenuBtn.classList.toggle('open');
      mobileNavDrawer.classList.toggle('open', isOpen);
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        mobileNavDrawer.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileNavDrawer.contains(e.target)) {
        mobileMenuBtn.classList.remove('open');
        mobileNavDrawer.classList.remove('open');
      }
    });
  }

  // ---------- 2. CUSTOM CURSOR & MAGNETIC MICRO-INTERACTIONS ----------
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('cursorDot');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
    if (cursorDot) cursorDot.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
    if (cursorDot) cursorDot.style.opacity = '1';
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    if (cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Magnetic hover effect & Split Name Interactive Toggle
  const heroName = document.getElementById('heroName');
  if (heroName) {
    heroName.addEventListener('click', () => {
      heroName.classList.toggle('split-active');
    });
  }

  const hoverTargets = document.querySelectorAll('a, button, .project-card, .stat-box, .telemetry-card-mini, .term-btn, .cmd-chip, .interactive-split-name');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('hovering');
    });
    target.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('hovering');
      target.style.transform = '';
    });
    if (target.classList.contains('magnetic')) {
      target.addEventListener('mousemove', (e) => {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        target.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
    }
  });

  // ---------- 3. AMBIENT ZEN / CYBER CANVAS PARTICLES ----------
  const canvas = document.getElementById('zenCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const PARTICLE_COUNT = Math.min(Math.floor(window.innerWidth / 20), 45);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Subtle mouse pull
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          this.x += dx * 0.004;
          this.y += dy * 0.004;
        }

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }
      draw(isYin) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (isYin) {
          // Cyber ember / cyan glow in Yin mode
          ctx.fillStyle = `rgba(226, 93, 69, ${this.alpha * 0.8})`;
        } else {
          // Sumi ink particles in Yang mode
          ctx.fillStyle = `rgba(24, 20, 15, ${this.alpha * 0.45})`;
        }
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      const isYin = root.getAttribute('data-theme') === 'yin';
      ctx.clearRect(0, 0, width, height);

      // Draw faint interconnecting constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = isYin
              ? `rgba(226, 93, 69, ${lineAlpha})`
              : `rgba(24, 20, 15, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw(isYin);
      });

      requestAnimationFrame(animateCanvas);
    }
    requestAnimationFrame(animateCanvas);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.updateCanvasTheme = function () {
      // triggered on theme switch
    };
  }

  // ---------- 4. PROJECT CATEGORY FILTER BAR ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ---------- 5. INTERACTIVE SECURITY & AUTOMATION TERMINAL ----------
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalBody = document.getElementById('terminalBody');

  const COMMAND_RESPONSES = {
    help: `
<div class="terminal-line info"><strong>Available Commands:</strong></div>
<div class="terminal-line muted">  • <span class="highlight">status</span>    : Check live Command Center & system telemetry</div>
<div class="terminal-line muted">  • <span class="highlight">projects</span>  : List key projects & GitHub repositories</div>
<div class="terminal-line muted">  • <span class="highlight">snmp</span>      : Run Network SNMP Exporter & PEN/OID discovery probe</div>
<div class="terminal-line muted">  • <span class="highlight">speedtest</span> : Probe office internet latency & bandwidth metrics</div>
<div class="terminal-line muted">  • <span class="highlight">darktrace</span> : Run Darktrace security telemetry exporter simulation</div>
<div class="terminal-line muted">  • <span class="highlight">japanese</span>  : Launch Unfriendly Japanese (JLPT N5-N4 platform)</div>
<div class="terminal-line muted">  • <span class="highlight">skills</span>    : Display technical capability matrix</div>
<div class="terminal-line muted">  • <span class="highlight">certs</span>     : Display PhilNITS FE & JLPT certifications</div>
<div class="terminal-line muted">  • <span class="highlight">whoami</span>    : Display profile & bio</div>
<div class="terminal-line muted">  • <span class="highlight">theme</span>     : Toggle Yin/Yang theme (usage: theme yin | theme yang)</div>
<div class="terminal-line muted">  • <span class="highlight">contact</span>   : Get email, phone, and social endpoints</div>
<div class="terminal-line muted">  • <span class="highlight">clear</span>     : Clear terminal output screen</div>
`,
    status: `
<div class="terminal-line success">[SYS_TELEMETRY: OPTIMAL]</div>
<div class="terminal-line info">OPERATOR      : Renz Brian "Zen" Velez [善] (R&D Engineer)</div>
<div class="terminal-line info">LOCATION      : Bogo City, Cebu, Philippines</div>
<div class="terminal-line info">COMMAND CENTER: 6 Teams Monitored (Windows, Network, Cloud, SRE, Cyber, Storage)</div>
<div class="terminal-line info">EXPORTERS     : SNMP Auto-Discovery · Speedtest Daemon · Darktrace Bridge</div>
<div class="terminal-line info">ACTIVE BOTS   : Securio Governance · Zoom API Ingestion · PAD Web QA</div>
<div class="terminal-line success">SECURITY AUDIT: 100% Passed · Escalation Bridges Operational</div>
`,
    projects: `
<div class="terminal-line info"><strong>Selected Projects Database:</strong></div>
<div class="terminal-line muted">[01] <strong>Network SNMP Exporter</strong> : Auto-discovery & PEN/OID metrics parser for Grafana</div>
<div class="terminal-line muted">[02] <strong>Office Speedtest</strong>     : Automated bandwidth & latency SLA telemetry in Grafana</div>
<div class="terminal-line muted">[03] <strong>Darktrace Exporter</strong>   : Prometheus/Grafana security anomaly parser</div>
<div class="terminal-line muted">[04] <strong>Unfriendly Japanese</strong>  : JLPT N5 to N4 Japanese grammar platform (<a href="https://zentenshi.github.io/chipp/" target="_blank" style="color:#48CAE4">zentenshi.github.io/chipp</a>)</div>
<div class="terminal-line muted">[05] <strong>AltruWiz</strong>              : React, TypeScript, Firebase community platform (<a href="https://github.com/AltruWiz/altruWiz" target="_blank" style="color:#48CAE4">github.com/AltruWiz/altruWiz</a>)</div>
<div class="terminal-line muted">[06] <strong>SharePoint SPFx</strong>      : Power Apps & Automate enterprise tools for JP client</div>
<div class="terminal-line muted">[07] <strong>Zoom API Sync</strong>        : Automated operational call telemetry in Google Sheets</div>
<div class="terminal-line muted">[08] <strong>AHRide</strong>               : Decoupled full-stack delivery app (<a href="https://github.com/AHRide/AHRide" target="_blank" style="color:#48CAE4">github.com/AHRide/AHRide</a>)</div>
<div class="terminal-line muted">[09] <strong>Audibook</strong>             : Android Gradle native audio chapter player (<a href="https://github.com/zentenshi/audibookfinal" target="_blank" style="color:#48CAE4">github.com/zentenshi/audibookfinal</a>)</div>
`,
    snmp: `
<div class="terminal-line success">[SNMP_EXPORTER // AUTO-DISCOVERY ENGINE]</div>
<div class="terminal-line info">PROBE STATUS  : 200 OK · Scanning Subnets</div>
<div class="terminal-line muted">Discovery     : Polling Private Enterprise Numbers (PEN) & Enterprise OIDs...</div>
<div class="terminal-line info">Discovered    : Switches, Routers, Firewalls, Storage Nodes</div>
<div class="terminal-line success">Ingestion     : CPU, Memory, Disk usage & Interface Traffic -> Grafana Dashboard</div>
`,
    speedtest: `
<div class="terminal-line success">[OFFICE_SPEEDTEST_EXPORTER // NETWORK SLA]</div>
<div class="terminal-line info">ISP GATEWAY   : Enterprise Fiber Backbone</div>
<div class="terminal-line info">LATENCY       : 8ms | JITTER: 1.2ms</div>
<div class="terminal-line info">THROUGHPUT    : ↓ 480 Mbps | ↑ 465 Mbps</div>
<div class="terminal-line success">STATUS        : Optimal · Continuous Grafana Time-Series Stream Active</div>
`,
    japanese: `
<div class="terminal-line success">[UNFRIENDLY JAPANESE // 日本語文法]</div>
<div class="terminal-line info">NAME        : Unfriendly Japanese (JLPT N5 - N4 Grammar)</div>
<div class="terminal-line info">TARGET      : JLPT N5 - N4 Grammar, Verb Conjugations, Contextual Patterns</div>
<div class="terminal-line info">LIVE SITE   : <a href="https://zentenshi.github.io/chipp/" target="_blank" style="color:#48CAE4">https://zentenshi.github.io/chipp/</a></div>
<div class="terminal-line info">REPOSITORY  : <a href="https://github.com/zentenshi/chipp" target="_blank" style="color:#48CAE4">https://github.com/zentenshi/chipp</a></div>
<div class="terminal-line muted">Description : Interactive educational platform built with Jekyll & GitHub Pages.</div>
`,
    chipp: `
<div class="terminal-line success">[UNFRIENDLY JAPANESE // 日本語文法]</div>
<div class="terminal-line info">NAME        : Unfriendly Japanese (JLPT N5 - N4 Grammar)</div>
<div class="terminal-line info">LIVE SITE   : <a href="https://zentenshi.github.io/chipp/" target="_blank" style="color:#48CAE4">https://zentenshi.github.io/chipp/</a></div>
<div class="terminal-line info">REPOSITORY  : <a href="https://github.com/zentenshi/chipp" target="_blank" style="color:#48CAE4">https://github.com/zentenshi/chipp</a></div>
`,
    skills: `
<div class="terminal-line info"><strong>Capabilities Matrix:</strong></div>
<div class="terminal-line success">● IT Operations   : Incident Escalation, Monitoring, Agile Scrum, Grafana</div>
<div class="terminal-line success">● Cybersecurity   : Darktrace Metrics, Securio Governance, Log Auditing</div>
<div class="terminal-line success">● Power Platform  : Power Apps, Power Automate Cloud/Desktop RPA, SPFx, Dataverse</div>
<div class="terminal-line success">● Development     : JS/TS, React, Go, Python, C, HTML/CSS, REST APIs</div>
<div class="terminal-line success">● Bilingual       : English (Fluent), Japanese (JLPT N4)</div>
`,
    darktrace: `
<div class="terminal-line alert">[DARKTRACE_EXPORTER: INITIATING STREAM...]</div>
<div class="terminal-line muted">Connecting to Darktrace Cyber AI appliance endpoint... [200 OK]</div>
<div class="terminal-line muted">Extracting anomaly telemetry payload: 142 events parsed.</div>
<div class="terminal-line success">Metrics transformation complete -> Exported to Grafana dashboard.</div>
<div class="terminal-line info">Status: 0 Unresolved Critical Incidents in Command Center floor.</div>
`,
    certs: `
<div class="terminal-line info"><strong>Official Certifications & Degrees:</strong></div>
<div class="terminal-line success">✔ PhilNITS Fundamental IT Engineer (FE) — Equivalent to Japan ITEE FE</div>
<div class="terminal-line success">✔ JLPT N4 — Japanese Language Proficiency Test Certified Passer</div>
<div class="terminal-line success">✔ Microsoft PL-100 — Power Platform App Maker Accredited</div>
<div class="terminal-line success">✔ BS in Computer Engineering — CIT-U (President, ICPEP-SE CIT-U Chapter)</div>
`,
    whoami: `
<div class="terminal-line info">Renz Brian "Zen" Velez (善) — R&D Engineer @ Advanced World Solutions Inc.</div>
<div class="terminal-line muted">Philosophy: Order from noise. Merging vigilant Command Center infrastructure monitoring with autonomous scripting and cyber telemetry.</div>
`,
    contact: `
<div class="terminal-line info"><strong>Contact Channels:</strong></div>
<div class="terminal-line muted">Email    : <a href="mailto:just.renz.official@gmail.com" style="color:#48CAE4">just.renz.official@gmail.com</a></div>
<div class="terminal-line muted">Phone    : +63 927 535 7462</div>
<div class="terminal-line muted">LinkedIn : <a href="https://linkedin.com/in/velezrenz" target="_blank" style="color:#48CAE4">linkedin.com/in/velezrenz</a></div>
<div class="terminal-line muted">GitHub   : <a href="https://github.com/zentenshi" target="_blank" style="color:#48CAE4">github.com/zentenshi</a></div>
`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      if (terminalOutput) terminalOutput.innerHTML = '';
      return;
    }

    if (cmd === 'theme yin' || cmd === 'theme yang') {
      const chosen = cmd.split(' ')[1];
      applyTheme(chosen);
      localStorage.setItem(STORAGE_KEY, chosen);
      printTerminalLine(`renz@rbv-ops:~$ ${rawCmd}`, 'cmd-echo');
      printTerminalLine(`Theme successfully switched to: <strong>${chosen.toUpperCase()}</strong>`, 'success');
      return;
    }

    if (cmd === 'theme') {
      const isYin = root.getAttribute('data-theme') === 'yin';
      const next = isYin ? 'yang' : 'yin';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      printTerminalLine(`renz@rbv-ops:~$ ${rawCmd}`, 'cmd-echo');
      printTerminalLine(`Theme toggled to: <strong>${next.toUpperCase()}</strong>`, 'success');
      return;
    }

    printTerminalLine(`renz@rbv-ops:~$ ${rawCmd}`, 'cmd-echo');

    if (COMMAND_RESPONSES[cmd]) {
      const outputDiv = document.createElement('div');
      outputDiv.innerHTML = COMMAND_RESPONSES[cmd];
      if (terminalOutput) terminalOutput.appendChild(outputDiv);
    } else {
      printTerminalLine(`command not found: "${cmd}". Type <span class="highlight">help</span> for command list.`, 'alert');
    }

    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  function printTerminalLine(content, cssClass = '') {
    if (!terminalOutput) return;
    const line = document.createElement('div');
    line.className = `terminal-line ${cssClass}`;
    line.innerHTML = content;
    terminalOutput.appendChild(line);
    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        executeCommand(val);
        terminalInput.value = '';
      }
    });
  }

  // Quick preset button handlers
  const termBtns = document.querySelectorAll('.term-btn, .cmd-chip');
  termBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        if (terminalInput) terminalInput.focus();
      }
    });
  });

  // ---------- 6. SCROLL REVEAL (IntersectionObserver) ----------
  const revealables = document.querySelectorAll('.section, .hero-content, .telemetry-card-mini, .timeline-item, .project-card, .stat-box, .skill-card, .cred-box, .terminal-wrapper');
  revealables.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealables.forEach((el) => observer.observe(el));
})();
