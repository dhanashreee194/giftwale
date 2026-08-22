import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BRAND, CATEGORIES, SEARCH_HINTS } from "./data";
import { useEnquiry } from "./enquiry";

export function Logo({ compact = false }) {
  return (
    <Link to="/" className={`brand ${compact ? "is-compact" : ""}`}>
      <span className="brand-mark">
        <img src={`${import.meta.env.BASE_URL}images/asset-15.png`} alt="Giftwale logo" />
      </span>
      <div className="brand-copy">
        <strong>{BRAND.name}</strong>
        <span>{BRAND.tagline}</span>
      </div>
    </Link>
  );
}

export function Header() {
  const { count, setOpen } = useEnquiry();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const location = useLocation();
  const overHero = location.pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`mast ${scrolled ? "is-scrolled" : ""} ${overHero ? "is-over" : ""}`}>
        <span className="mast-ribbon" aria-hidden />
        <span className="mast-bow" aria-hidden />
        <div className="wrap mast-row">
          <Logo compact={scrolled} />
          <nav className="nav">
            <NavLink to="/" end data-cursor="nav">Home</NavLink>
            <NavLink to="/shop" data-cursor="nav">Shop</NavLink>
            <NavLink to="/about" data-cursor="nav">About Us</NavLink>
            <NavLink to="/contact" data-cursor="nav">Contact Us</NavLink>
          </nav>
          <div className="mast-actions">
            <button type="button" className="icon-quiet" data-cursor="nav" onClick={() => setSearch(true)} aria-label="Search">
              Search
            </button>
            <button type="button" className="icon-quiet menu-toggle" data-cursor="nav" onClick={() => setMenu((v) => !v)} aria-label="Menu">
              Menu
            </button>
            <button type="button" className="btn" data-cursor="bag" onClick={() => setOpen(true)}>
              ENQUIRY NOW{count > 0 ? ` · ${count}` : ""}
            </button>
          </div>
        </div>
        {menu && (
          <div className="mobile-nav wrap">
            <NavLink to="/" end onClick={() => setMenu(false)}>Home</NavLink>
            <NavLink to="/shop" onClick={() => setMenu(false)}>Shop</NavLink>
            <NavLink to="/about" onClick={() => setMenu(false)}>About Us</NavLink>
            <NavLink to="/contact" onClick={() => setMenu(false)}>Contact Us</NavLink>
            <NavLink to="/enquiry" onClick={() => setMenu(false)}>ENQUIRY NOW</NavLink>
          </div>
        )}
      </header>
      <AnimatePresence>{search && <SearchLayer onClose={() => setSearch(false)} />}</AnimatePresence>
    </>
  );
}

function SearchLayer({ onClose }) {
  const nav = useNavigate();
  const [q, setQ] = useState("");

  function go(term) {
    onClose();
    nav(`/shop?q=${encodeURIComponent(term)}`);
  }

  return (
    <motion.div className="search-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" className="reveal-dim" onClick={onClose} aria-label="Close search" />
      <motion.form
        className="search-panel"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
      >
        <p className="eyebrow">Shop</p>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Birthday Gift, Corporate Gift…"
        />
        <div className="search-hints">
          {SEARCH_HINTS.map((hint) => (
            <button type="button" key={hint.q} data-cursor="category" onClick={() => go(hint.q)}>
              {hint.label}
            </button>
          ))}
        </div>
      </motion.form>
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-ribbon" aria-hidden />
      <div className="wrap footer-grid">
        <div>
          <Logo />
          <p>{BRAND.slogan}</p>
        </div>
        <div>
          <p className="eyebrow">Shop</p>
          <p><Link to="/shop?cat=birthday">Birthday Gift</Link></p>
          <p><Link to="/shop?cat=wedding">Wedding Gift</Link></p>
          <p><Link to="/shop?cat=return">Return Gift</Link></p>
          <p><Link to="/shop?cat=corporate">Corporate Gift</Link></p>
        </div>
        <div>
          <p className="eyebrow">Talk to us</p>
          <p>Call {BRAND.phoneDisplay}</p>
          <p>{BRAND.email}</p>
          <p>Wholesale Moq:{BRAND.moq}</p>
          <p><Link to="/about">About Us</Link></p>
          <p><Link to="/contact">Contact Us</Link></p>
        </div>
      </div>
      <div className="wrap footer-end">
        <em>{BRAND.tagline}</em>
        <div className="legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

export function Bag() {
  const { items, open, setOpen, update, remove, note, count, pulse, clear } = useEnquiry();
  const navigate = useNavigate();
  const [fly, setFly] = useState(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const onFly = (event) => {
      const bag = document.querySelector(".gift-bag");
      const box = bag?.getBoundingClientRect();
      setFly({
        image: event.detail.image,
        fromX: event.detail.x,
        fromY: event.detail.y,
        toX: box ? box.left + box.width / 2 : window.innerWidth - 60,
        toY: box ? box.top + box.height / 2 : window.innerHeight - 60,
      });
      window.setTimeout(() => setFly(null), 620);
    };
    window.addEventListener("giftwale-fly", onFly);
    return () => window.removeEventListener("giftwale-fly", onFly);
  }, []);

  useEffect(() => {
    if (!pulse) return undefined;
    setToast(true);
    const timer = window.setTimeout(() => setToast(false), 1800);
    return () => window.clearTimeout(timer);
  }, [pulse]);

  return (
    <>
      {fly && (
        <img
          className="fly-gift"
          src={fly.image}
          alt=""
          style={{
            "--from-x": `${fly.fromX}px`,
            "--from-y": `${fly.fromY}px`,
            "--to-x": `${fly.toX}px`,
            "--to-y": `${fly.toY}px`,
          }}
        />
      )}
      {toast && <p className="select-toast">Added to enquiry</p>}
      <button
        type="button"
        className={`gift-bag ${pulse ? "is-pulse" : ""}`}
        data-cursor="bag"
        onClick={() => setOpen(true)}
        aria-label="Enquiry"
      >
        <i className="bag-ico" aria-hidden />
        <span>ENQUIRY NOW</span>
        <b>{count}</b>
      </button>
      <div className={`backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`tray ${open ? "open" : ""}`}>
        <div className="tray-head">
          <div>
            <p className="eyebrow">{BRAND.tagline}</p>
            <h3>ENQUIRY NOW</h3>
          </div>
          <button type="button" className="icon-quiet" onClick={() => setOpen(false)}>Close</button>
        </div>
        <div className="tray-items">
          {items.length === 0 && (
            <p>Call Now: {BRAND.phoneDisplay}. Email Id - {BRAND.email}. Moq:{BRAND.moq}</p>
          )}
          {items.map((item) => (
            <div className="tray-item" key={item.id}>
              <img src={item.image} alt="" />
              <div>
                <strong>{item.name}</strong>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => update(item.id, Number(e.target.value))}
                />
                <input
                  placeholder="Note"
                  value={item.note || ""}
                  onChange={(e) => note(item.id, e.target.value)}
                />
              </div>
              <button type="button" className="btn-ghost" onClick={() => remove(item.id)}>Remove</button>
            </div>
          ))}
        </div>
        <div className="tray-foot">
          <p className="moq">Wholesale Moq:{BRAND.moq}</p>
          <button
            type="button"
            className="btn"
            disabled={!items.length}
            onClick={() => {
              setOpen(false);
              navigate("/enquiry");
            }}
          >
            ENQUIRY NOW
          </button>
          {items.length > 0 && (
            <button type="button" className="btn-ghost" onClick={clear}>Clear</button>
          )}
        </div>
      </aside>
    </>
  );
}

export function CategoryPicker({ cat, onChange }) {
  const chips = [
    { id: "all", title: "Shop", label: "Shop", tone: "navy", image: `${import.meta.env.BASE_URL}images/asset-16.png` },
    ...CATEGORIES,
  ];
  return (
    <div className="shop-filters">
      {chips.map((item) => (
        <button
          type="button"
          key={item.id}
          data-cursor="category"
          className={cat === item.id ? "is-on" : ""}
          onClick={() => onChange(item.id)}
        >
          {item.label || item.title}
        </button>
      ))}
    </div>
  );
}
