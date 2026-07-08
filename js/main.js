(() => {
  const header = document.querySelector("[data-header]");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const revealItems = [...document.querySelectorAll(".reveal")];
  const profileFrame = document.querySelector(".profile-frame");
  const profileImage = document.querySelector("[data-profile-image]");
  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
  const contactForm = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  const setActiveLink = () => {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    let current = null;

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;

      if (top <= 120) {
        current = section;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`);
    });
  };

  const setParallax = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const itemCenter = rect.top + rect.height / 2;
      const offset = (viewportCenter - itemCenter) * 0.025;

      item.style.setProperty("--parallax-y", `${Math.max(Math.min(offset, 10), -10)}px`);
    });
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const menu = document.querySelector(".navbar-collapse.show");
      if (menu && window.bootstrap) {
        window.bootstrap.Collapse.getInstance(menu)?.hide();
      }
    });
  });

  profileImage?.addEventListener("error", () => {
    profileFrame?.classList.add("is-fallback");
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const data = new FormData(contactForm);
      const subject = encodeURIComponent(`Contacto desde portafolio - ${data.get("name")}`);
      const body = encodeURIComponent(`${data.get("message")}\n\nCorreo: ${data.get("email")}`);

      formStatus.textContent = "Abriendo tu cliente de correo...";
      window.location.href = `mailto:gmandujano60@outlook.com?subject=${subject}&body=${body}`;
      contactForm.reset();
    });
  }

  window.addEventListener("scroll", () => {
    setHeaderState();
    setActiveLink();
    setParallax();
  }, { passive: true });

  setHeaderState();
  setActiveLink();
  setParallax();
})();
