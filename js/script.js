// =========================
// Mobile Navigation
// =========================

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("nav");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    navigation.classList.toggle("nav-open");
  });
}

// =========================
// Close Mobile Menu
// =========================

const navigationLinks = document.querySelectorAll("nav a");

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("nav-open");
  });
});

// =========================
// Smooth Scroll
// =========================

navigationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (targetId.startsWith("#")) {
      event.preventDefault();

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  });
});

// =========================
// Header Shadow on Scroll
// =========================

const header = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// =========================
// Fade-In Animation
// =========================

const animatedElements = document.querySelectorAll(
  ".product-card, .review-grid blockquote",
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  },
);

animatedElements.forEach((element) => {
  element.classList.add("fade-in");

  observer.observe(element);
});
