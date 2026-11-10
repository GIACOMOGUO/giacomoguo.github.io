// Replace demo entries here. Images are relative to index.html.
window.portfolio = {
  contactEmail: "",
  featured: "fold",
  projects: [
    {
      id: "fold",
      title: "Fold Chair",
      year: "2026",
      category: "Furniture",
      type: "Seating study",
      ratio: "landscape",
      demo: true,
      summary: "One continuous gesture between seat and structure.",
      description: "A seating concept built around the line where a plane becomes a support. The study uses a vermilion finish to make the silhouette legible from across a room.",
      images: {
        object: { src: "assets/fold-object.svg", alt: "Vermilion cantilever chair on a neutral backdrop" },
        context: { src: "assets/fold-context.svg", alt: "Vermilion chair in a plaster gallery" }
      },
      hero: { src: "assets/hero.svg", alt: "Sculptural vermilion chair in an empty gallery with oblique daylight" }
    },
    {
      id: "strata",
      title: "Strata Light",
      year: "2026",
      category: "Lighting",
      type: "Ambient light study",
      ratio: "portrait",
      demo: true,
      summary: "A low light held between stacked volumes.",
      description: "A lighting concept that uses shallow layers to hide the source and spread a soft wash. A dark olive body gives the illuminated edge a clear boundary.",
      images: {
        object: { src: "assets/strata-object.svg", alt: "Olive table light made of stacked layers" },
        context: { src: "assets/strata-context.svg", alt: "Layered olive light casting an ambient glow in a dark interior" }
      }
    },
    {
      id: "orbit",
      title: "Orbit Table",
      year: "2026",
      category: "Objects",
      type: "Occasional table study",
      ratio: "square",
      demo: true,
      summary: "A circular surface balanced on an open frame.",
      description: "An occasional table concept that keeps the volume below its surface open. Curved supports give the object a different profile as you move around it.",
      images: {
        object: { src: "assets/orbit-object.svg", alt: "Rust-red occasional table with open curved supports" },
        context: { src: "assets/orbit-context.svg", alt: "Rust-red table in a quiet architectural interior" }
      }
    }
  ]
};
