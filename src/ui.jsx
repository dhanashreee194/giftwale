import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BRAND } from "./data";
import { useEnquiry } from "./enquiry";

export function Logo() {
  return (
    <Link to="/" className="brand">
      <img src={`${import.meta.env.BASE_URL}images/asset-15.png`} alt="Giftwale logo" />
      <div className="brand-copy">
        <strong>{BRAND.name}</strong>
        <span>{BRAND.tagline}</span>
      </div>
    </Link>
  );
}

export function Header() {
  const { count, setOpen } = useEnquiry();
  const [menu, setMenu] = useState(false);

  return (
    <header className="site-header">
      <div className="wrap">
        <div className="utility">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/enquiry">ENQUIRY NOW</NavLink>
          <NavLink to="/contact">contact us</NavLink>
        </div>
        <div className="header-row">
          <Logo />
          <nav className="nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Gifts</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/contact">Contact Us</NavLink>
          </nav>
          <div className="header-actions">
            <button className="icon-btn menu-toggle" onClick={() => setMenu((v) => !v)} aria-label="Menu">
              ☰
            </button>
            <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Enquiry list">
              ✉
              {count > 0 && <span className="count">{count}</span>}
            </button>
            <Link className="enquiry-pill" to="/enquiry">
              Enquiry
            </Link>
          </div>
        </div>
        {menu && (
          <div className="mobile-nav">
            <NavLink to="/" onClick={() => setMenu(false)}>Home</NavLink>
            <NavLink to="/shop" onClick={() => setMenu(false)}>Gifts</NavLink>
            <NavLink to="/about" onClick={() => setMenu(false)}>About Us</NavLink>
            <NavLink to="/enquiry" onClick={() => setMenu(false)}>ENQUIRY NOW</NavLink>
            <NavLink to="/contact" onClick={() => setMenu(false)}>Contact Us</NavLink>
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Logo />
          <p style={{ maxWidth: "42ch", color: "#cfc6b6" }}>
            Elegant personalized gifting solutions designed with luxury, love, and timeless style.
          </p>
        </div>
        <div>
          <h4>Visit</h4>
          <p><Link to="/">Home</Link></p>
          <p><Link to="/about">About Us</Link></p>
          <p><Link to="/contact">Contact Us</Link></p>
        </div>
        <div>
          <h4>Talk to us</h4>
          <p>Call Now: {BRAND.phoneDisplay}</p>
          <p>Email Id - {BRAND.email}</p>
          <p>Moq:{BRAND.moq} for wholesale bulk orders</p>
        </div>
      </div>
      <div className="wrap legal">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms & condition</Link>
      </div>
    </footer>
  );
}

export function ProductCard({ product }) {
  const { add } = useEnquiry();
  return (
    <article className="card">
      <div className="card-media">
        <span className="tag">{product.tags[0]}</span>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p>{product.blurb}</p>
        <div className="card-actions">
          <span className="price">On enquiry</span>
          <button className="enquiry-pill" onClick={() => add(product)}>
            Enquiry
          </button>
        </div>
      </div>
    </article>
  );
}

export function Tray() {
  const { items, open, setOpen, update, remove, count } = useEnquiry();
  const navigate = useNavigate();
  if (!open && count === 0) return null;
  return (
    <>
      <div className={`backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`tray ${open ? "open" : ""}`}>
        <div className="tray-head">
          <h3>Your enquiry list</h3>
          <button className="icon-btn" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="tray-items">
          {items.length === 0 && <p>Add gifts you would like us to prepare. We confirm every order by phone or WhatsApp — no online payment.</p>}
          {items.map((item) => (
            <div className="tray-item" key={item.id}>
              <img src={item.image} alt="" />
              <div>
                <strong>{item.name}</strong>
                <div>
                  QTY{" "}
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => update(item.id, Number(e.target.value))}
                    style={{ width: 64 }}
                  />
                </div>
              </div>
              <button className="ghost" onClick={() => remove(item.id)}>Remove</button>
            </div>
          ))}
        </div>
        <div className="tray-foot">
          <p className="moq">Wholesale Moq:{BRAND.moq}</p>
          <button
            className="send"
            style={{ width: "100%" }}
            onClick={() => {
              setOpen(false);
              navigate("/enquiry");
            }}
          >
            Send enquiry
          </button>
        </div>
      </aside>
    </>
  );
}

export function Unwrap() {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <div className="unwrap" onAnimationEnd={() => setGone(true)}>
      <div className="unwrap-panel" />
      <div className="ribbon" />
      <div className="bow" />
    </div>
  );
}
