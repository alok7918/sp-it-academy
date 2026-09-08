/* =========================================================
   COURSE GRID
   Renders course cards and wires up the category filter.
   The whole card is a link — clicking anywhere on a tile
   opens that course page.
   ========================================================= */

function courseHref(url) {
  // courseData urls are written relative to the site root
  // (e.g. "courses/mern-stack/"). On the /courses/ listing
  // page we drop the leading "courses/" segment.
  var inCoursesDir = /\/courses\/(index\.html)?$/.test(location.pathname);
  return inCoursesDir ? url.replace(/^courses\//, "") : url;
}

function renderCourses(filter = "all") {
  const grid = document.getElementById("course-grid");
  if (!grid) return;

  grid.innerHTML = courseData
    .filter(c => filter === "all" || c.category === filter)
    .map(c => `<a class="course-card" href="${courseHref(c.url)}">
        <span class="tag">${c.category.replace("-", " ")}</span>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <div class="course-bottom">
          <span>${c.duration}</span>
          <span class="course-cta">View Program →</span>
        </div>
      </a>`)
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCourses();

  document.querySelectorAll(".filter").forEach(btn =>
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCourses(btn.dataset.filter);
    })
  );
});
