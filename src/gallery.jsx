import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, tileSize } from "./data";
import { useEnquiry } from "./enquiry";

export function filterGifts(list, cat, q) {
  const query = q.trim().toLowerCase();
  return list.filter((p) => {
    const okCat = cat === "all" || p.category === cat;
    const hay = `${p.name} ${p.blurb} ${p.tags.join(" ")}`.toLowerCase();
    return okCat && (!query || hay.includes(query));
  });
}

export function GiftReveal({ product, onClose }) {
  const { add } = useEnquiry();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  if (!product) return null;
  const cat = CATEGORIES.find((c) => c.id === product.category);

  return (
    <motion.div className="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" className="reveal-dim" onClick={onClose} aria-label="Close gift" />
      <motion.article
        className="reveal-card"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img layoutId={`gift-img-${product.id}`} src={product.image} alt={product.name} />
        <div className="reveal-copy">
          <p className="eyebrow">{cat?.title || product.category}</p>
          <h2>{product.name}</h2>
          <p>{product.blurb}</p>
          <label>
            Note
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
          </label>
          <label>
            Quantity
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} />
          </label>
          <div className="reveal-actions">
            <button
              type="button"
              className="btn"
              data-cursor="bag"
              onClick={(event) => {
                add({ ...product, note }, qty, { x: event.clientX, y: event.clientY });
                onClose();
                navigate("/enquiry");
              }}
            >
              Enquiry
            </button>
            <button type="button" className="btn-ghost" onClick={onClose}>
              Keep looking
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export function GiftTile({ product, index, onOpen, variant = "tile" }) {
  const cat = CATEGORIES.find((c) => c.id === product.category);
  return (
    <motion.button
      type="button"
      className={`gift-tile tile-${tileSize(index)} ${variant === "panel" ? "is-panel" : ""}`}
      data-cursor="product"
      data-thumb={product.image}
      onClick={() => onOpen(product)}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="gift-ribbon" aria-hidden />
      <div className="gift-visual">
        <motion.img layoutId={`gift-img-${product.id}`} src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="gift-meta">
        <small>{cat?.label || product.tags[0]}</small>
        <strong>{product.name}</strong>
        <p>{product.blurb}</p>
        <em>Enquiry</em>
      </div>
    </motion.button>
  );
}

export function ShopCard({ product, index, onOpen }) {
  const { add } = useEnquiry();
  const navigate = useNavigate();
  const cat = CATEGORIES.find((c) => c.id === product.category);
  return (
    <motion.article
      className="shop-card"
      data-cursor="product"
      data-thumb={product.image}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="shop-card-visual"
        role="button"
        tabIndex={0}
        onClick={() => onOpen(product)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(product);
          }
        }}
      >
        <small>{cat?.label || product.tags[0]}</small>
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="shop-card-copy">
        <strong>{product.name}</strong>
        <p>{product.blurb}</p>
        <button
          type="button"
          className="shop-card-enquiry"
          data-cursor="bag"
          onClick={(event) => {
            add(product, 1, { x: event.clientX, y: event.clientY });
            navigate("/enquiry");
          }}
        >
          Enquiry
        </button>
      </div>
    </motion.article>
  );
}

export function GiftGallery({ products, cat = "all", query = "", layout = "masonry" }) {
  const [active, setActive] = useState(null);
  const list = useMemo(() => filterGifts(products, cat, query), [products, cat, query]);

  return (
    <>
      <div className={layout === "shop" ? "shop-grid" : "gallery"}>
        {list.map((product, index) =>
          layout === "shop" ? (
            <ShopCard key={product.id} product={product} index={index} onOpen={setActive} />
          ) : (
            <GiftTile key={product.id} product={product} index={index} onOpen={setActive} />
          )
        )}
      </div>
      {list.length === 0 && <p className="empty-gifts">No pieces in this range yet. Try another category.</p>}
      <AnimatePresence>{active && <GiftReveal product={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </>
  );
}

export function GiftRail({ products, variant = "tile" }) {
  const [active, setActive] = useState(null);
  return (
    <>
      <div className={`gift-rail ${variant === "panel" ? "is-panel" : ""}`}>
        {products.map((product, index) => (
          <GiftTile key={product.id} product={product} index={index} onOpen={setActive} variant={variant} />
        ))}
      </div>
      <AnimatePresence>{active && <GiftReveal product={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </>
  );
}

export function GiftCatalogue({ products }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(null);
  const [on, setOn] = useState(0);
  const nodes = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setOn(Number(entry.target.dataset.index));
        });
      },
      { threshold: 0.48, rootMargin: "-8% 0px -28% 0px" }
    );
    nodes.current.forEach((node) => node && io.observe(node));
    return () => io.disconnect();
  }, [products]);

  const ease = [0.22, 1, 0.36, 1];
  const reveal = (delay) =>
    reduce
      ? { initial: false, whileInView: undefined }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-12%" },
          transition: { duration: 0.62, delay, ease },
        };

  return (
    <div className="catalogue">
      <aside className="catalogue-progress" aria-label="Product progress">
        {products.map((product, index) => (
          <button
            type="button"
            key={product.id}
            className={on === index ? "is-on" : ""}
            data-cursor="nav"
            onClick={() => nodes.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </aside>
      <div className="catalogue-list">
        {products.map((product, index) => {
          const cat = CATEGORIES.find((c) => c.id === product.category);
          const flip = index % 2 === 1;
          return (
            <article
              key={product.id}
              className={`catalogue-row ${flip ? "is-flip" : ""} ${on === index ? "is-on" : ""}`}
              data-index={index}
              ref={(node) => {
                nodes.current[index] = node;
              }}
            >
              <motion.button
                type="button"
                className="catalogue-visual"
                data-cursor="product"
                data-thumb={product.image}
                onClick={() => setOpen(product)}
                initial={reduce ? false : { opacity: 0, scale: 0.94, x: flip ? 28 : -28 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.72, ease }}
              >
                <img src={product.image} alt={product.name} loading="lazy" />
              </motion.button>
              <div className="catalogue-copy">
                <motion.small className="eyebrow" {...reveal(0.08)}>
                  {cat?.label || product.tags[0]}
                </motion.small>
                <motion.h3 {...reveal(0.16)}>{product.name}</motion.h3>
                <motion.p {...reveal(0.24)}>{product.blurb}</motion.p>
                <motion.button
                  type="button"
                  className="text-link"
                  data-cursor="cta"
                  onClick={() => setOpen(product)}
                  {...reveal(0.32)}
                >
                  View Gift →
                </motion.button>
              </div>
            </article>
          );
        })}
      </div>
      <AnimatePresence>{open && <GiftReveal product={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}
