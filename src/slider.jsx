import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BRAND, CATEGORIES, COPY } from "./data";

const img = (file) => `${import.meta.env.BASE_URL}images/${file}`;

const SLIDES = [
  {
    id: "welcome",
    eyebrow: BRAND.tagline,
    title: BRAND.slogan,
    text: COPY.elegant,
    image: img("asset-16.png"),
    search: true,
  },
  {
    id: "categories",
    eyebrow: BRAND.tagline,
    title: COPY.curated,
    image: img("asset-13.png"),
    categories: true,
  },
  {
    id: "shop",
    eyebrow: "Shop",
    title: COPY.handcrafted,
    text: COPY.elegant,
    image: img("asset-02.png"),
    cta: { to: "/shop", label: "Shop" },
  },
];

function HeroSearch() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      className="hero-search"
      onSubmit={(e) => {
        e.preventDefault();
        nav(`/shop?q=${encodeURIComponent(q)}`);
      }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Your gift here"
        aria-label="Search Your gift here"
      />
      <button className="btn" type="submit" data-cursor="cta">Search</button>
    </form>
  );
}

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[index];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [paused]);

  function go(next) {
    setIndex((current) => (current + next + SLIDES.length) % SLIDES.length);
  }

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="hero-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            className="hero-slide-photo"
            src={slide.image}
            alt=""
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6.2, ease: "linear" }}
          />
          <div className="hero-slide-veil" />
          <div className="wrap hero-slide-copy">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {slide.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
            >
              {slide.title}
            </motion.h1>
            {slide.text && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3 }}
              >
                {slide.text}
              </motion.p>
            )}
            {slide.search && <HeroSearch />}
            {slide.categories && (
              <div className="hero-slide-cats">
                {CATEGORIES.map((item) => (
                  <Link key={item.id} data-cursor="category" to={`/shop?cat=${item.id}`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            {slide.cta && (
              <Link className="btn" data-cursor="cta" to={slide.cta.to}>
                {slide.cta.label}
              </Link>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="hero-slide-nav">
        <button type="button" aria-label="Previous slide" onClick={() => go(-1)}>‹</button>
        <ol>
          {SLIDES.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className={i === index ? "is-on" : ""}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            </li>
          ))}
        </ol>
        <button type="button" aria-label="Next slide" onClick={() => go(1)}>›</button>
      </div>
    </section>
  );
}
