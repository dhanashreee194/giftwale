import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRAND } from "./data";

const KEY = "giftwale-seen-open";

export function Opening() {
  const [show, setShow] = useState(false);
  const [brief, setBrief] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const seen = sessionStorage.getItem(KEY);
    setBrief(Boolean(seen));
    setShow(true);
    const timer = window.setTimeout(finish, seen ? 900 : 3600);
    return () => window.clearTimeout(timer);
  }, []);

  function finish() {
    sessionStorage.setItem(KEY, "1");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`opening ${brief ? "is-brief" : ""}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" className="opening-skip" onClick={finish}>
            Skip
          </button>
          <div className="opening-stage">
            <div className="opening-confetti" aria-hidden>
              {Array.from({ length: 8 }).map((_, i) => <i key={i} />)}
            </div>
            <div className="opening-glow" />
            <div className="opening-box">
              <div className="opening-lid">
                <img src={`${import.meta.env.BASE_URL}images/asset-15.png`} alt="" />
              </div>
              <div className="opening-body">
                <strong>{BRAND.name}</strong>
                <span>{BRAND.tagline}</span>
              </div>
              <span className="opening-ribbon-v" />
              <span className="opening-ribbon-h" />
              <span className="opening-bow" />
            </div>
            <div className="opening-bits" aria-hidden>
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
