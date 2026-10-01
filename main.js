const sky = document.getElementById("sky");
const ctx = sky.getContext("2d");
const stars = [];
const sparks = [];

function resize() {
  sky.width = window.innerWidth;
  sky.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

for (let i = 0; i < 90; i += 1) {
  stars.push({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.4 + 0.3,
    a: Math.random(),
    s: Math.random() * 0.008 + 0.002
  });
}
for (let i = 0; i < 28; i += 1) {
  sparks.push({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.8 + 0.6,
    v: Math.random() * 0.00045 + 0.00015
  });
}

function drawSky() {
  ctx.clearRect(0, 0, sky.width, sky.height);
  stars.forEach((star) => {
    star.a += star.s;
    const alpha = 0.25 + Math.abs(Math.sin(star.a)) * 0.75;
    ctx.beginPath();
    ctx.fillStyle = `rgba(246, 240, 228, ${alpha})`;
    ctx.arc(star.x * sky.width, star.y * sky.height, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  sparks.forEach((spark) => {
    spark.y -= spark.v;
    if (spark.y < -0.02) spark.y = 1.02;
    ctx.beginPath();
    ctx.fillStyle = "rgba(240, 193, 74, 0.75)";
    ctx.arc(spark.x * sky.width, spark.y * sky.height, spark.r, 0, Math.PI * 2);
    ctx.fill();
  });
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    requestAnimationFrame(drawSky);
  }
}
drawSky();

const toggle = document.querySelector(".nav-toggle");
toggle.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      const label = button.querySelector("em");
      const previous = label.textContent;
      label.textContent = "Copied";
      button.classList.add("copied");
      setTimeout(() => {
        label.textContent = previous;
        button.classList.remove("copied");
      }, 1400);
    } catch (error) {
      button.querySelector("em").textContent = "Select";
    }
  });
});

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const videos = document.querySelectorAll(".reels video");
if (!reduce && "IntersectionObserver" in window) {
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.play().catch(() => {});
      else entry.target.pause();
    });
  }, { threshold: 0.35 });
  videos.forEach((video) => watcher.observe(video));
}

const dialog = document.getElementById("lightbox");
const shot = dialog.querySelector("img");
document.querySelectorAll(".mosaic a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    shot.src = link.href;
    shot.alt = link.querySelector("img").alt;
    dialog.showModal();
  });
});
dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const stage = document.querySelector(".portrait");
if (!reduce) {
  window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    stage.style.translate = `${x}px ${y}px`;
  });
}
