import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BRAND, CATEGORIES, COPY, PRODUCTS, SERVICES } from "./data";
import { useEnquiry } from "./enquiry";
import { ProductCard } from "./ui";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function Home() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const featured = PRODUCTS.slice(0, 6);

  return (
    <>
      <section className="home-search">
        <div className="wrap">
          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              nav(`/shop?q=${encodeURIComponent(q)}`);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Your gift here"
            />
            <button className="enquiry-pill" type="submit">Search</button>
          </form>
        </div>
      </section>
      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i}>Giftwale · Creating Memories · Enquiry, not checkout · Call {BRAND.phoneDisplay}</span>
          ))}
        </div>
      </div>
      <section className="section">
        <div className="wrap">
          <h2>Gifts for every occasion</h2>
          <p className="lede">{COPY.handcrafted}</p>
          <div className="cats">
            {CATEGORIES.map((c) => (
              <Link className="cat" key={c.id} to={`/shop?cat=${c.id}`}>
                <small>Collection</small>
                <b>{c.label}</b>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>Handpicked for enquiry</h2>
          <p className="lede">{COPY.curated}</p>
          <div className="grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <p style={{ textAlign: "center", marginTop: 32 }}>
            <Link className="enquiry-pill" to="/shop">See the full gift list</Link>
          </p>
        </div>
      </section>
    </>
  );
}

export function Shop() {
  const query = useQuery();
  const [cat, setCat] = useState(query.get("cat") || "all");
  const [q, setQ] = useState(query.get("q") || "");
  const list = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const okCat = cat === "all" || p.category === cat;
      const hay = `${p.name} ${p.blurb} ${p.tags.join(" ")}`.toLowerCase();
      return okCat && hay.includes(q.toLowerCase());
    });
  }, [cat, q]);

  return (
    <section className="section">
      <div className="wrap">
        <h2>Search Your gift here</h2>
        <p className="lede">Prices are shared after we speak. Add pieces to your enquiry list, then we confirm quantity, personalisation and delivery offline.</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Your gift here"
          style={{ width: "min(420px, 100%)", marginTop: 16, borderRadius: 999, border: "1.5px solid #2b2b2b", padding: "12px 16px" }}
        />
        <div className="filters">
          <button className={`chip ${cat === "all" ? "active" : ""}`} onClick={() => setCat("all")}>All gifts</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className={`chip ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="about-grid">
          <div className="founder-frame">
            <img src={BRAND.founder.photo} alt={`${BRAND.founder.name}, founder of Giftwale`} />
            <div className="founder-badge">
              <small>{BRAND.founder.title}</small>
              <strong>{BRAND.founder.name}</strong>
            </div>
          </div>
          <div>
            <div className="kicker" style={{ color: "var(--gold)" }}>{BRAND.tagline}</div>
            <h2>About Us</h2>
            <p>{COPY.welcome}</p>
            <p>{COPY.range}</p>
            <p>{COPY.priority}</p>
            <p><strong>{BRAND.slogan}</strong></p>
          </div>
        </div>
        <div className="gold-band">
          {SERVICES.map((s) => (
            <div className="service" key={s.title}>
              <div className="kicker">{s.icon === "boxes" ? "Moq:30" : "Giftwale"}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnquiryForm({ title = "Contact Us" }) {
  const { items, clear } = useEnquiry();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    product: items.map((i) => `${i.name} x${i.qty}`).join(", "),
    qty: items.reduce((n, i) => n + i.qty, 0) || BRAND.moq,
    note: "",
  });

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    const payload = { ...form, items, createdAt: new Date().toISOString() };
    const prev = JSON.parse(localStorage.getItem("giftwale-enquiries") || "[]");
    localStorage.setItem("giftwale-enquiries", JSON.stringify([payload, ...prev]));
    clear();
    setSent(true);
  }

  const wa = `https://wa.me/${BRAND.phone}?text=${encodeURIComponent(
    `Hello Giftwale, I would like to enquire.\nName: ${form.name}\nProduct: ${form.product}\nQTY: ${form.qty}`
  )}`;

  if (sent) {
    return (
      <div className="form-card success">
        <h2>Enquiry received</h2>
        <p>Thank you. There is no online payment on Giftwale. We will confirm your order after a call, WhatsApp note or email — then packing begins.</p>
        <div className="next-steps">
          <a className="send" href={`tel:+${BRAND.phone}`}>Call {BRAND.phoneDisplay}</a>
          <a className="ghost" href={wa} target="_blank" rel="noreferrer">Continue on WhatsApp</a>
          <a className="ghost" href={`mailto:${BRAND.email}`}>Email {BRAND.email}</a>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h1>{title}</h1>
      <div className="heart-rule"><span>♥</span></div>
      <div className="field">
        <label>Name</label>
        <input required placeholder="Enter Your Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div className="field">
        <label>Mobile Number</label>
        <input required placeholder="Enter your Mobile Number" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
      </div>
      <div className="field">
        <label>Your email-Id</label>
        <input required type="email" placeholder="Enter your Email Id" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div className="field">
        <label>Product</label>
        <input placeholder="search Your product here" value={form.product} onChange={(e) => set("product", e.target.value)} />
      </div>
      <div className="field">
        <label>QTY</label>
        <div className="qty-row">
          <input type="number" min="1" placeholder="QTY" value={form.qty} onChange={(e) => set("qty", e.target.value)} />
          <span className="moq">Moq:{BRAND.moq}</span>
        </div>
      </div>
      <div className="field">
        <label>Note</label>
        <textarea placeholder="Personalisation, occasion, delivery city" value={form.note} onChange={(e) => set("note", e.target.value)} />
      </div>
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
        After you send this, we place the order only once we have spoken. No payment gateway.
      </p>
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <button className="send" type="submit" style={{ minWidth: 180 }}>Send</button>
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <section className="section" style={{ paddingTop: 28 }}>
      <div className="wrap">
        <div className="form-shell">
          <img src={`${import.meta.env.BASE_URL}images/asset-16.png`} alt="" />
          <div className="form-veil" />
          <EnquiryForm title="Contact Us" />
        </div>
      </div>
    </section>
  );
}

export function EnquiryPage() {
  return (
    <section className="section" style={{ paddingTop: 28 }}>
      <div className="wrap">
        <div className="form-shell">
          <img src={`${import.meta.env.BASE_URL}images/asset-13.png`} alt="" />
          <div className="form-veil" />
          <EnquiryForm title="ENQUIRY NOW" />
        </div>
      </div>
    </section>
  );
}

export function Privacy() {
  return (
    <section className="wrap legal-page">
      <h2>Privacy Policy</h2>
      <p>Giftwale collects your name, mobile number, email and gift preferences only to complete an offline enquiry. Details stay with the Giftwale team and are used to call, WhatsApp or email you about your order. We do not process card payments on this website.</p>
    </section>
  );
}

export function Terms() {
  return (
    <section className="wrap legal-page">
      <h2>Terms & condition</h2>
      <p>Enquiries on this website are requests, not paid orders. Quantity, personalisation, wholesale Moq:{BRAND.moq}, pricing and delivery are confirmed after a conversation. Giftwale may accept or decline a request after that discussion.</p>
    </section>
  );
}
