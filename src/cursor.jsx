import { useEffect, useRef, useState } from "react";

const POP_MODES = new Set(["cta", "product", "category", "bag", "image"]);

function modeFrom(target) {
  if (!target || target.closest("input, textarea, select")) return "text";
  const hit = target.closest("[data-cursor]");
  return hit?.getAttribute("data-cursor") || "idle";
}

export function GiftCursor() {
  const wrap = useRef(null);
  const mouse = useRef({ x: -80, y: -80 });
  const point = useRef({ x: -80, y: -80 });
  const vel = useRef({ x: 0, y: 0 });
  const hoverEl = useRef(null);
  const popTimer = useRef(0);
  const [live, setLive] = useState(false);
  const [mode, setMode] = useState("idle");
  const [thumb, setThumb] = useState("");
  const [popping, setPopping] = useState(false);
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return undefined;
    setLive(true);
    document.documentElement.classList.add("gift-cursor-on");

    const onMove = (event) => {
      mouse.current = { x: event.clientX, y: event.clientY };
      const next = modeFrom(event.target);
      setMode(next);
      const tile = event.target.closest("[data-thumb]");
      setThumb(tile?.getAttribute("data-thumb") || "");

      const hit = event.target.closest("[data-cursor]");
      if (hit !== hoverEl.current) {
        hoverEl.current = hit;
        window.clearTimeout(popTimer.current);
        if (hit && POP_MODES.has(next)) {
          setPopping(true);
          popTimer.current = window.setTimeout(() => setPopping(false), 680);
        } else {
          setPopping(false);
        }
      }
    };

    let frame = 0;
    let last = 0;
    const tick = (now) => {
      const ease = 0.18;
      const prev = point.current;
      point.current = {
        x: prev.x + (mouse.current.x - prev.x) * ease,
        y: prev.y + (mouse.current.y - prev.y) * ease,
      };
      vel.current = {
        x: point.current.x - prev.x,
        y: point.current.y - prev.y,
      };
      const speed = Math.hypot(vel.current.x, vel.current.y);
      const rot = Math.max(-18, Math.min(18, vel.current.x * 4));
      if (wrap.current) {
        wrap.current.style.transform = `translate3d(${point.current.x}px, ${point.current.y}px, 0) rotate(${rot}deg)`;
      }
      if (speed > 3.2 && now - last > 70) {
        last = now;
        const spark = {
          id: `${now}`,
          x: point.current.x,
          y: point.current.y,
          kind: ["gold", "dot", "teal"][Math.floor(now / 80) % 3],
        };
        setTrail((list) => [...list.slice(-5), spark]);
        window.setTimeout(() => {
          setTrail((list) => list.filter((item) => item.id !== spark.id));
        }, 420);
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      window.clearTimeout(popTimer.current);
      document.documentElement.classList.remove("gift-cursor-on");
    };
  }, []);

  if (!live) return null;

  return (
    <>
      <div className="cursor-trail" aria-hidden>
        {trail.map((item) => (
          <i key={item.id} className={item.kind} style={{ left: item.x, top: item.y }} />
        ))}
      </div>
      <div ref={wrap} className={`gift-cursor is-${mode}${popping ? " is-popping" : ""}`} aria-hidden>
        <div className="gb">
          <div className="gb-lid" />
          <div className="gb-body" />
          <span className="gb-band" />
          <span className="gb-bow" />
          <span className="gb-pop">
            {thumb ? <img src={thumb} alt="" /> : <i />}
          </span>
          <span className="gb-sparks"><i /><i /><i /></span>
        </div>
      </div>
    </>
  );
}
