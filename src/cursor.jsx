import { useEffect, useRef, useState } from "react";

const HOT = "a, button, .card, .cat, .chip, .reel-go, .reel-stamp, summary";

export function GiftCursor() {
  const node = useRef(null);
  const pos = useRef({ x: -80, y: -80 });
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return undefined;

    setLive(true);
    document.documentElement.classList.add("gift-cursor-on");

    const onMove = (event) => {
      pos.current = { x: event.clientX, y: event.clientY };
      const overText = event.target.closest("input, textarea, select, [contenteditable='true']");
      setOpen(!overText && Boolean(event.target.closest(HOT)));
      if (node.current) {
        node.current.classList.toggle("is-text", Boolean(overText));
      }
    };

    let frame = 0;
    const tick = () => {
      if (node.current) {
        node.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("gift-cursor-on");
    };
  }, []);

  if (!live) return null;

  return (
    <div ref={node} className={`gift-cursor ${open ? "is-open" : ""}`} aria-hidden>
      <div className="gc-scene">
        <div className="gc-lid">
          <span className="gc-bow" />
        </div>
        <div className="gc-body">
          <span className="gc-pop" />
        </div>
        <span className="gc-band" />
      </div>
    </div>
  );
}
