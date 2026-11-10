(() => {
  "use strict";

  const { projects, featured, contactEmail } = window.portfolio;
  const app = document.querySelector("#app");
  const main = document.querySelector("main");
  const peek = document.querySelector(".project-peek");
  const peekImage = peek.querySelector("img");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const categories = ["All", ...new Set(projects.map(project => project.category))];
  const labels = { home: "Home", work: "Work", about: "About", collaborate: "Collaborate" };
  let mode = "object";
  let filter = "All";
  let revealObserver;
  let routed = false;

  function html(value) {
    const escaped = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value ?? "").replace(/[&<>"']/g, char => escaped[char]);
  }

  function number(index) {
    return String(index + 1).padStart(2, "0");
  }

  function projectLink(project) {
    return "#/work/" + encodeURIComponent(project.id);
  }

  function imageMarkup(image, eager = false) {
    return `<img src="${html(image.src)}" alt="${html(image.alt)}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
  }

  function modeSwitch() {
    return `<div class="mode-switch" role="group" aria-label="Image display mode">
      <button type="button" data-mode="object" aria-pressed="${mode === "object"}">Object</button>
      <button type="button" data-mode="context" aria-pressed="${mode === "context"}">Context</button>
    </div>`;
  }

  function card(project) {
    const index = projects.indexOf(project);
    return `<article class="project-card" data-reveal>
      <a href="${projectLink(project)}" data-project="${html(project.id)}">
        <div class="project-media ratio-${html(project.ratio)}" data-media="${html(project.id)}" data-parallax>
          ${imageMarkup(project.images[mode])}
          ${project.demo ? '<span class="image-tag">Demo</span>' : ""}
        </div>
        <div class="project-meta">
          <div class="project-info"><span>№ ${number(index)}</span> <span>${html(project.category)} / ${html(project.year)}</span></div>
          <h3 class="project-title">${html(project.title)} <span aria-hidden="true">↗</span></h3>
          <p class="project-summary">${html(project.summary)}</p>
        </div>
      </a>
    </article>`;
  }

  function selectedWork(onHome) {
    const filterMarkup = categories.map(category =>
      `<button type="button" data-category="${html(category)}" aria-pressed="${category === filter}">${html(category)}</button>`
    ).join("");
    return `<section class="section-shell work-section" aria-label="Selected work">
      ${onHome ? `<div class="section-head" data-reveal>
        <p class="eyebrow"><span class="section-number">01</span> / Project index</p>
        <h2>Selected<br>work<span>.</span></h2>
        <p>Studies in furniture, lighting and objects. The projects shown here are demo concepts.</p>
      </div>` : ""}
      <div class="work-toolbar">
        <div class="filter-set" role="group" aria-label="Filter work">${filterMarkup}</div>
        ${modeSwitch()}
      </div>
      <p class="sr-only" id="work-count" role="status"></p>
      <div class="project-grid" id="project-grid"></div>
      ${onHome ? '<a class="text-link work-all" href="#/work">View the work index <span aria-hidden="true">↗</span></a>' : ""}
    </section>`;
  }

  function home() {
    const project = projects.find(item => item.id === featured) ?? projects[0];
    return `<section class="hero">
      <div class="hero-head">
        <p class="eyebrow"><span class="accent-dot"></span> Independent design practice</p>
        <h1>Giacomo Guo<span>.</span></h1>
        <div class="hero-meta"><span>Independent Product &amp; Furniture Designer</span><span>Milano, Italy <span aria-hidden="true">↗</span></span></div>
      </div>
      ${project ? `<figure class="hero-media" data-parallax>
        ${imageMarkup(project.hero ?? project.images.context, true)}
        <a class="hero-index" href="${projectLink(project)}">Explore ${html(project.title)} <span aria-hidden="true">↗</span></a>
        <figcaption class="hero-caption">${project.demo ? "Demo concept" : html(project.category)} / ${html(project.year)}</figcaption>
      </figure>` : ""}
    </section>
    ${selectedWork(true)}
    <section class="dark-panel" aria-label="About the practice">
      <div class="section-shell about-layout" data-reveal>
        <div class="about-intro"><p class="eyebrow"><span class="section-number">02</span> / About the practice</p><h2>Designing<br>for everyday<br>use<span>.</span></h2></div>
        <div class="capabilities"><p>I’m Giacomo Guo, an independent product and furniture designer based in Milano, Italy. I’m interested in how proportion, materials and the way we use an object shape its form.</p><a class="text-link" href="#/about">About the practice <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
    <section class="section-shell home-contact" data-reveal>
      <p class="eyebrow"><span class="section-number">03</span> / Collaborate</p>
      <h2>Have a project<br>in mind<span>?</span></h2>
      <a class="text-link" href="#/collaborate">Start a conversation <span aria-hidden="true">↗</span></a>
    </section>`;
  }

  function subhead(kicker, title, description) {
    return `<div class="section-shell subhead">
      <p class="eyebrow"><span class="accent-dot"></span> ${kicker}</p>
      <h1>${title}<span>.</span></h1><p>${description}</p>
    </div>`;
  }

  function about() {
    return `${subhead("02 / The practice", "About", "Independent product and furniture design in Milano, Italy.")}
      <section class="dark-panel">
        <div class="section-shell about-layout">
          <div class="about-intro"><p class="eyebrow">Approach / Milano, IT</p><h2>Form begins<br>with use<span>.</span></h2></div>
          <div class="capabilities"><p>I’m Giacomo Guo. I’m drawn to objects that make their purpose clear through shape, proportion and material.</p><p>I’m interested in working with furniture brands, design studios and commercial clients who want to develop new products together.</p></div>
        </div>
      </section>
      <section class="section-shell practice-list" data-reveal>
        <p class="eyebrow">Areas of focus</p>
        <ol>
          <li><h2>Furniture design</h2><p>Seating, tables and freestanding pieces.</p></li>
          <li><h2>Product design</h2><p>Lighting and objects for everyday settings.</p></li>
          <li><h2>Design development</h2><p>Concept exploration, material direction and visual communication.</p></li>
        </ol>
        <a class="text-link" href="#/collaborate">Discuss a project <span aria-hidden="true">↗</span></a>
      </section>`;
  }

  function collaborate() {
    const recipient = contactEmail ? `<a class="text-link" href="mailto:${html(contactEmail)}">${html(contactEmail)} ↗</a>`
      : '<p class="preview-note">The studio email will be added before launch. You can prepare and copy a brief here.</p>';
    return `${subhead("03 / Enquiries", "Collaborate", "For furniture brands, design studios and commercial partners.")}
      <section class="section-shell contact-panel">
        <div class="contact-copy">
          <p class="eyebrow">Project enquiries / Milano, IT</p>
          <h2>Tell me about<br>your project<span>.</span></h2>
          <p>Share what you’re developing, where you are in the process and when you’d like to begin.</p>
          ${recipient}
        </div>
        <form class="contact-form">
          <label>Name or studio <input name="name" autocomplete="organization" required></label>
          <label>Project type <select name="type"><option>Furniture</option><option>Product or lighting</option><option>Other collaboration</option></select></label>
          <label>Project brief <textarea name="brief" rows="5" required></textarea></label>
          <button class="action-button" type="submit">Prepare enquiry <span aria-hidden="true">↗</span></button>
          <div class="enquiry-output" hidden>
            <label>Enquiry draft <textarea readonly rows="7"></textarea></label>
            <button class="action-button" type="button" data-copy>Copy draft</button>
            ${contactEmail ? '<a class="text-link" data-mail>Open in email ↗</a>' : ""}
          </div>
          <p class="form-status" role="status"></p>
        </form>
      </section>`;
  }

  // Optional 3D module mount. The still image remains available as a fallback.
  function viewerSlot(project) {
    if (!project.viewer?.src) return "";
    return `<section class="viewer-slot" data-viewer-src="${html(project.viewer.src)}" aria-label="Object viewer">
      ${imageMarkup(project.images.object)}
    </section>`;
  }

  function detail(project) {
    const index = projects.indexOf(project);
    const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
    const other = mode === "object" ? "context" : "object";
    return `<article class="section-shell project-detail">
      <a class="back-link" href="#/work">← Work index</a>
      <div class="detail-head">
        <div><p class="eyebrow">${number(index)} / ${html(project.category)} ${project.demo ? "/ Demo concept" : ""}</p><h1>${html(project.title)}<span>.</span></h1></div>
        <dl class="detail-facts"><div><dt>Year</dt><dd>${html(project.year)}</dd></div><div><dt>Study</dt><dd>${html(project.type)}</dd></div></dl>
      </div>
      <div class="work-toolbar"><p class="eyebrow">Project imagery</p>${modeSwitch()}</div>
      <div class="project-media detail-media ratio-${html(project.ratio)}" data-media="${html(project.id)}" data-parallax>
        ${imageMarkup(project.images[mode], true)}
        ${project.demo ? '<span class="image-tag">Demo</span>' : ""}
      </div>
      <section class="project-gallery" data-reveal>
        <div class="project-story"><p class="eyebrow">Project notes</p><h2>${html(project.summary)}</h2><p>${html(project.description)}</p>${project.demo ? '<p class="preview-note">Illustrative concept for the website preview.</p>' : ""}</div>
        <figure class="project-media ratio-${html(project.ratio)}" data-alternate="${html(project.id)}">
          ${imageMarkup(project.images[other])}
          <figcaption class="image-tag">${other}</figcaption>
        </figure>
      </section>
      ${viewerSlot(project)}
      ${next ? `<a class="next-project text-link" href="${projectLink(next)}">Next study / ${html(next.title)} <span aria-hidden="true">↗</span></a>` : ""}
    </article>`;
  }

  function observeReveals(container) {
    if (!revealObserver) return;
    container.querySelectorAll("[data-reveal]").forEach(element => revealObserver.observe(element));
  }

  function renderCards() {
    const grid = document.querySelector("#project-grid");
    if (!grid) return;
    grid.querySelectorAll("[data-reveal]").forEach(element => revealObserver?.unobserve(element));
    const visible = filter === "All" ? projects : projects.filter(project => project.category === filter);
    grid.innerHTML = visible.map(card).join("") || "<p>No projects in this view yet.</p>";
    document.querySelector("#work-count").textContent = `${visible.length} ${visible.length === 1 ? "project" : "projects"}`;
    observeReveals(grid);
  }

  function parseRoute() {
    const path = location.hash.slice(2).split("/");
    if (!location.hash || !location.hash.startsWith("#/")) return { page: "home" };
    if (path[0] === "work" && path.length === 2) {
      const project = projects.find(item => encodeURIComponent(item.id) === path[1]);
      if (project) return { page: "work", project };
    }
    if (Object.hasOwn(labels, path[0]) && path.length === 1) return { page: path[0] };
    return { page: "missing" };
  }

  function renderRoute() {
    const { page, project } = parseRoute();
    const views = {
      home,
      work: () => project ? detail(project) : subhead("01 / Project index", "Work", "Explore the demo collection by category or switch between isolated objects and views in context.") + selectedWork(false),
      about,
      collaborate,
      missing: () => subhead("Project index", "Page unavailable", 'This link does not match a page. <a class="text-link" href="#/work">Explore work ↗</a>')
    };
    revealObserver?.disconnect();
    peek.hidden = true;
    document.body.dataset.page = project ? "detail" : page;
    document.title = page === "home" ? "Giacomo Guo — Product & Furniture Design" : `${project?.title ?? labels[page] ?? "Page unavailable"} — Giacomo Guo`;
    app.innerHTML = `<div class="page">${views[page]()}</div>`;
    document.querySelectorAll("[data-nav]").forEach(link => {
      if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    renderCards();
    observeReveals(app);
    if (routed) {
      window.scrollTo({ top: 0, behavior: "instant" });
      main.focus({ preventScroll: true });
    }
    routed = true;
  }

  function updateImage(target, image) {
    const img = target.querySelector("img");
    img.alt = image.alt;
    img.src = image.src;
  }

  function changeMode(nextMode) {
    mode = nextMode;
    peek.hidden = true;
    const alternate = mode === "object" ? "context" : "object";
    app.querySelectorAll("[data-mode]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    });
    app.querySelectorAll("[data-media]").forEach(target => {
      const project = projects.find(item => item.id === target.dataset.media);
      updateImage(target, project.images[mode]);
    });
    app.querySelectorAll("[data-alternate]").forEach(target => {
      const project = projects.find(item => item.id === target.dataset.alternate);
      updateImage(target, project.images[alternate]);
      target.querySelector("figcaption").textContent = alternate;
    });
  }

  app.addEventListener("click", async event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.category) {
      filter = button.dataset.category;
      peek.hidden = true;
      app.querySelectorAll("[data-category]").forEach(option => {
        option.setAttribute("aria-pressed", String(option.dataset.category === filter));
      });
      renderCards();
    }
    if (button.dataset.mode) changeMode(button.dataset.mode);
    if (button.hasAttribute("data-copy")) {
      const form = button.closest("form");
      const output = form.querySelector(".enquiry-output textarea");
      const status = form.querySelector(".form-status");
      try {
        await navigator.clipboard.writeText(output.value);
        status.textContent = "Draft copied.";
      } catch {
        output.focus();
        output.select();
        status.textContent = "Draft selected. Use your device’s copy command.";
      }
    }
  });

  app.addEventListener("submit", event => {
    const form = event.target.closest(".contact-form");
    if (!form) return;
    event.preventDefault();
    const data = new FormData(form);
    const subject = `Project enquiry · ${data.get("type")}`;
    const body = `Hello Giacomo,\n\n${data.get("brief").trim()}\n\n${data.get("name").trim()}`;
    const output = form.querySelector(".enquiry-output");
    output.hidden = false;
    output.querySelector("textarea").value = `${subject}\n\n${body}`;
    const mail = output.querySelector("[data-mail]");
    if (mail) mail.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.querySelector(".form-status").textContent = "Draft ready to copy.";
    output.querySelector("textarea").focus();
  });

  app.addEventListener("pointermove", event => {
    if (!finePointer.matches || event.pointerType !== "mouse") return;
    const media = event.target.closest("[data-parallax]");
    if (media && !reducedMotion.matches) {
      const bounds = media.getBoundingClientRect();
      media.style.setProperty("--px", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 10}px`);
      media.style.setProperty("--py", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 10}px`);
    }
    const title = event.target.closest(".project-title");
    if (!title) {
      peek.hidden = true;
      return;
    }
    const project = projects.find(item => item.id === title.closest("[data-project]").dataset.project);
    if (peekImage.getAttribute("src") !== project.images[mode].src) peekImage.src = project.images[mode].src;
    peek.querySelector("span").textContent = project.demo ? "DEMO PREVIEW" : "PROJECT PREVIEW";
    peek.hidden = false;
    const width = peek.offsetWidth;
    const height = peek.offsetHeight;
    const x = event.clientX + width + 32 < innerWidth ? event.clientX + 16 : event.clientX - width - 16;
    peek.style.left = `${Math.max(8, x)}px`;
    peek.style.top = `${Math.max(8, Math.min(event.clientY - 22, innerHeight - height - 8))}px`;
  }, { passive: true });

  app.addEventListener("pointerout", event => {
    const media = event.target.closest("[data-parallax]");
    if (media && !media.contains(event.relatedTarget)) {
      media.style.removeProperty("--px");
      media.style.removeProperty("--py");
    }
    const title = event.target.closest(".project-title");
    if (title && !title.contains(event.relatedTarget)) peek.hidden = true;
  });
  window.addEventListener("scroll", () => { peek.hidden = true; }, { passive: true });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") peek.hidden = true;
  });
  document.querySelector(".skip-link").addEventListener("click", event => {
    event.preventDefault();
    main.focus();
  });

  if ("IntersectionObserver" in window) {
    document.body.classList.add("motion-ready");
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12px", threshold: 0.06 });
  }
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
})();
