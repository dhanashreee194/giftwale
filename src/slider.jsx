import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SLIDES } from "./data";

export function HeaderSlider() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 5400);
    return () => window.clearInterval(id);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <div
      className={`reel ${isHome ? "reel-tall" : "reel-slim"}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="reel-sprockets" aria-hidden>
        {Array.from({ length: 14 }).map((_, hole) => (
          <i key={hole} />
        ))}
      </div>

      {SLIDES.map((item, slot) => (
        <article
          key={item.id}
          className={`reel-slide ${slot === index ? "is-current" : ""}`}
          aria-hidden={slot !== index}
        >
          <img src={item.image} alt="" />
          <div className="reel-shade" />
        </article>
      ))}

      <div className="reel-card">
        <span className="reel-kicker">{slide.kicker}</span>
        <h1>{slide.title}</h1>
        {isHome && <p>{slide.text}</p>}
        <Link className="enquiry-pill" to={slide.href}>
          {slide.action}
        </Link>
      </div>

      <div className="reel-rail" role="tablist" aria-label="Header gift windows">
        {SLIDES.map((item, slot) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={slot === index}
            className={`reel-stamp ${slot === index ? "is-on" : ""}`}
            onClick={() => setIndex(slot)}
          >
            {item.stamp}
          </button>
        ))}
        <button type="button" className="reel-go" onClick={() => setIndex((current) => (current + 1) % SLIDES.length)}>
          Pull ribbon
        </button>
      </div>
    </div>
  );
}
