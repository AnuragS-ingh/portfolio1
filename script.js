// Bubble animation
const container = document.querySelector(".Intro-animation-container");
const introSection = document.querySelector(".Introduction");
const bubbles = [];
const bubbleCount = 100;
const colors = [
  "#ff0080",
  "#00ffff",
  "#ffff00",
  "#00ff00",
  "#ff6600",
  "#ff00ff",
];

let mouse = { x: 0, y: 0, active: false };

// Track mouse
introSection.addEventListener("mousemove", (e) => {
  const rect = introSection.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  mouse.active = true;
});

introSection.addEventListener("mouseleave", () => {
  mouse.active = false;
});

// Container center
const centerX = container.clientWidth / 2;
const centerY = container.clientHeight / 2;
const clusterRadius = 80; // radius of initial cluster

// Pulsation parameters
let pulseAngle = 0;
const pulseSpeed = 0.03;
const pulseAmplitude = 15;

// Create bubbles in circular cluster
for (let i = 0; i < bubbleCount; i++) {
  const size = Math.random() * 20 + 15;
  const angle = (i / bubbleCount) * Math.PI * 2;
  const radiusOffset = clusterRadius * Math.sqrt(Math.random());

  const x = centerX + Math.cos(angle) * radiusOffset;
  const y = centerY + Math.sin(angle) * radiusOffset;

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
  container.appendChild(bubble);

  bubbles.push({
    el: bubble,
    baseX: x,
    baseY: y,
    x: x,
    y: y,
    radius: size / 2,
    vx: (Math.random() - 0.5) * 1,
    vy: (Math.random() - 0.5) * 1,
  });
}

// Main animation
function animate() {
  pulseAngle += pulseSpeed;

  bubbles.forEach((b1, i) => {
    let ax = 0;
    let ay = 0;

    let targetX, targetY;

    if (mouse.active) {
      // Trailing effect: first bubble follows cursor, others follow previous bubble
      targetX = i === 0 ? mouse.x : bubbles[i - 1].x;
      targetY = i === 0 ? mouse.y : bubbles[i - 1].y;

      ax += (targetX - b1.x) * 0.03;
      ay += (targetY - b1.y) * 0.03;
    } else {
      // Random drifting
      targetX = b1.x + (Math.random() - 0.5) * 0.05;
      targetY = b1.y + (Math.random() - 0.5) * 0.05;
    }

    // Separation to avoid overlapping
    bubbles.forEach((b2) => {
      if (b1 === b2) return;
      const dx = b1.x - b2.x;
      const dy = b1.y - b2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = b1.radius + b2.radius + 2;
      if (dist < minDist && dist > 0) {
        ax += (dx / dist) * (minDist - dist) * 0.05;
        ay += (dy / dist) * (minDist - dist) * 0.05;
      }
    });

    // Add pulsation only if mouse not active
    if (!mouse.active) {
      const angle = (i / bubbleCount) * Math.PI * 2;
      targetX = b1.baseX + Math.cos(angle + pulseAngle) * pulseAmplitude;
      targetY = b1.baseY + Math.sin(angle + pulseAngle) * pulseAmplitude;
      ax += (targetX - b1.x) * 0.02;
      ay += (targetY - b1.y) * 0.02;
    }

    // Update velocity with damping
    b1.vx = (b1.vx + ax) * 0.6;
    b1.vy = (b1.vy + ay) * 0.6;

    // Update position
    b1.x += b1.vx;
    b1.y += b1.vy;

    // Bounce off container edges
    if (b1.x - b1.radius < 0) {
      b1.x = b1.radius;
      b1.vx *= -1;
    }
    if (b1.x + b1.radius > container.clientWidth) {
      b1.x = container.clientWidth - b1.radius;
      b1.vx *= -1;
    }
    if (b1.y - b1.radius < 0) {
      b1.y = b1.radius;
      b1.vy *= -1;
    }
    if (b1.y + b1.radius > container.clientHeight) {
      b1.y = container.clientHeight - b1.radius;
      b1.vy *= -1;
    }

    // Apply transform
    b1.el.style.transform = `translate(${b1.x - b1.radius}px, ${
      b1.y - b1.radius
    }px)`;
  });

  requestAnimationFrame(animate);
}

animate();
