const heroSlides=[
{number:"01",title:'Build Skills.<br><span>Build Your Career.</span>',description:"Learn industry-relevant technology, build real projects and prepare for your next career opportunity.",primary:"Explore Courses",url:"courses/",code:'const career = {\n  skills: ["Code", "Data"],\n  projects: true,\n  jobReady: true\n};'},
{number:"02",title:'Become a <span>Full Stack</span> Developer.',description:"Master frontend, backend, databases and deployment by building real-world applications.",primary:"Explore Full Stack",url:"courses/mern-stack/",code:'const developer = {\n  frontend: ["HTML", "CSS", "React"],\n  backend: ["Node", "APIs"],\n  deploy: true\n};'},
{number:"03",title:'Turn <span>Data</span> Into Decisions.',description:"Build practical skills across spreadsheets, SQL, Python, visualization and business intelligence.",primary:"Explore Data Analytics",url:"courses/data-analytics/",code:'const analyst = {\n  sql: true,\n  python: true,\n  dashboards: true\n};'},
{number:"04",title:'Become <span>Job Ready.</span>',description:"Learn, practice, build projects, create your portfolio and prepare for technical interviews.",primary:"Start Your Journey",url:"contact/",code:'const journey = ["Learn","Build","Portfolio","Interview"];'}
];

let heroIndex = 0, heroTimer;

const ANIMATED_IDS = ["hero-title", "hero-description", "hero-primary"];

function renderHero(index) {
  const s = heroSlides[index];
  if (!s) return;

  const title   = document.getElementById("hero-title");
  const desc    = document.getElementById("hero-description");
  const primary = document.getElementById("hero-primary");
  const code    = document.getElementById("hero-code");
  const num     = document.getElementById("slide-number");
  const bar     = document.getElementById("progress-bar");

  // restart the text transition
  ANIMATED_IDS.forEach(id => document.getElementById(id)?.classList.remove("slide-change"));
  void (title && title.offsetWidth);

  requestAnimationFrame(() => {
    if (title)   title.innerHTML = s.title;
    if (desc)    desc.textContent = s.description;
    if (primary) {
      primary.innerHTML = s.primary + ' <span class="btn-arrow">→</span>';
      primary.href = s.url;
    }
    if (code)    code.textContent = s.code;
    if (num)     num.textContent = s.number;
    if (bar)     bar.style.width = ((index + 1) / heroSlides.length * 100) + "%";

    ANIMATED_IDS.forEach(id => document.getElementById(id)?.classList.add("slide-change"));
  });
}

function nextHero() {
  heroIndex = (heroIndex + 1) % heroSlides.length;
  renderHero(heroIndex);
  resetHeroTimer();
}

function prevHero() {
  heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
  renderHero(heroIndex);
  resetHeroTimer();
}

function resetHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = setInterval(nextHero, 6000);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("next-slide")?.addEventListener("click", nextHero);
  document.getElementById("prev-slide")?.addEventListener("click", prevHero);
  renderHero(0);
  resetHeroTimer();
});
