import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BRAND, CATEGORIES, COPY, PRODUCTS, SERVICES } from "./data";
import { useEnquiry } from "./enquiry";
import { GiftGallery } from "./gallery";
import { HeroSlider } from "./slider";
import { CategoryPicker } from "./ui";

export function Home() {
  return (
    <>
      <HeroSlider />
      <section className="section needs" id="categories">
        <div className="wrap">
          <p className="eyebrow">{BRAND.tagline}</p>
          <h2>{COPY.curated}</h2>
          <div className="need-grid is-four">
            {CATEGORIES.map((item) => (
              <Link key={item.id} className={`need-card tone-${item.tone}`} data-cursor="category" to={`/shop?cat=${item.id}`}>
                <img src={item.image} alt="" />
                <strong>{item.label}</strong>
                <span>Shop</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section collection" id="shop">
        <div className="wrap featured-head">
          <div>
            <p className="eyebrow">Shop</p>
            <h2>{COPY.handcrafted}</h2>
          </div>
          <Link className="text-link" data-cursor="cta" to="/shop">Shop</Link>
        </div>
        <div className="wrap shop-wide">
          <GiftGallery products={PRODUCTS.slice(0, 12)} layout="shop" />
        </div>
      </section>
      <section className="section branding" id="services">
        <div className="wrap">
          <p className="eyebrow">{BRAND.name}</p>
          <h2>Customized Gifting</h2>
          <div className="brand-grid">
            {SERVICES.map((item) => (
              <article key={item.title} data-cursor="cta">
                <p className="eyebrow">{item.icon === "boxes" ? `Moq:${BRAND.moq}` : BRAND.tagline}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section founder-band" id="about">
        <div className="wrap about-grid">
          <motion.div
            className="founder-frame"
            data-cursor="image"
            data-thumb={BRAND.founder.photo}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={BRAND.founder.photo} alt={`${BRAND.founder.name}, founder of Giftwale`} />
            <div className="founder-badge">
              <small>{BRAND.founder.title}</small>
              <strong>{BRAND.founder.name}</strong>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">{BRAND.tagline}</p>
            <h2>About Us</h2>
            <p>{COPY.welcome}</p>
            <p>{COPY.range}</p>
            <Link className="btn" data-cursor="cta" to="/about">About Us</Link>
          </motion.div>
        </div>
      </section>
      <section className="section home-enquiry" id="enquiry">
        <div className="wrap enquiry-split">
          <div>
            <p className="eyebrow">{BRAND.tagline}</p>
            <h2>Contact Us</h2>
            <p>Call Now: {BRAND.phoneDisplay}. Email Id - {BRAND.email}. Moq:{BRAND.moq}</p>
          </div>
          <EnquiryForm title="ENQUIRY NOW" compact />
        </div>
      </section>
    </>
  );
}

export function Shop() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [cat, setCat] = useState(params.get("cat") || "all");
  const [q, setQ] = useState(params.get("q") || "");
  const current = CATEGORIES.find((c) => c.id === cat);

  useEffect(() => {
    const next = new URLSearchParams(search);
    setCat(next.get("cat") || "all");
    setQ(next.get("q") || "");
  }, [search]);

  return (
    <section className="shop-page">
      <div className="wrap shop-wide shop-intro">
        <motion.div
          className="shop-intro-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Shop</p>
          <h1>Search Your gift here</h1>
          <p className="lede">{current?.label || COPY.handcrafted}</p>
        </motion.div>
        <motion.figure
          className="shop-hero-shot"
          data-cursor="image"
          data-thumb={`${import.meta.env.BASE_URL}images/asset-16.png`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          <img src={`${import.meta.env.BASE_URL}images/asset-16.png`} alt="Hopewood Premium Gift Hamper" />
        </motion.figure>
      </div>
      <div className="wrap shop-wide">
        <form
          className="hero-search shop-search"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Your gift here"
            aria-label="Search Your gift here"
          />
        </form>
        <CategoryPicker cat={cat} onChange={setCat} />
        <GiftGallery products={PRODUCTS} cat={cat} query={q} layout="shop" />
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="section about-page">
      <div className="wrap about-grid">
        <div className="founder-frame">
          <img src={BRAND.founder.photo} alt={`${BRAND.founder.name}, founder of Giftwale`} />
          <div className="founder-badge">
            <small>{BRAND.founder.title}</small>
            <strong>{BRAND.founder.name}</strong>
          </div>
        </div>
        <div>
          <p className="eyebrow">{BRAND.tagline}</p>
          <h2>About Us</h2>
          <p>{COPY.welcome}</p>
          <p>{COPY.range}</p>
          <p>{COPY.priority}</p>
          <p><strong>{BRAND.slogan}</strong></p>
        </div>
      </div>
      <div className="wrap gold-band">
        {SERVICES.map((s) => (
          <div className="service" key={s.title}>
            <p className="eyebrow">{s.icon === "boxes" ? `Moq:${BRAND.moq}` : BRAND.tagline}</p>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EnquiryForm({ title = "Contact Us", compact = false }) {
  const { items, clear } = useEnquiry();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    product: items.map((i) => `${i.name} x${i.qty}`).join(", "),
    qty: items.reduce((n, i) => n + i.qty, 0) || BRAND.moq,
    note: items.map((i) => i.note).filter(Boolean).join(" · "),
  });

  useEffect(() => {
    if (!items.length) return;
    setForm((current) => ({
      ...current,
      product: items.map((item) => `${item.name} x${item.qty}`).join(", "),
      qty: items.reduce((n, item) => n + item.qty, 0) || BRAND.moq,
      note: items.map((item) => item.note).filter(Boolean).join(" · ") || current.note,
    }));
  }, [items]);

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
      <div className={`form-card success ${compact ? "is-embed" : ""}`}>
        <h2>ENQUIRY NOW</h2>
        <p>Call Now: {BRAND.phoneDisplay}. Email Id - {BRAND.email}. Moq:{BRAND.moq}</p>
        <div className="next-steps">
          <a className="btn" href={`tel:+${BRAND.phone}`}>Call {BRAND.phoneDisplay}</a>
          <a className="btn-ghost" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
          <a className="btn-ghost" href={`mailto:${BRAND.email}`}>Email {BRAND.email}</a>
        </div>
      </div>
    );
  }

  return (
    <form className={`form-card ${compact ? "is-embed" : ""}`} onSubmit={submit}>
      <p className="eyebrow">{BRAND.tagline}</p>
      <h1>{title}</h1>
      <div className="field">
        <label>Name</label>
        <input required placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div className="field">
        <label>Mobile</label>
        <input required placeholder="Mobile" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
      </div>
      <div className="field">
        <label>Email</label>
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div className="field">
        <label>Product</label>
        <input value={form.product} onChange={(e) => set("product", e.target.value)} />
      </div>
      <div className="field">
        <label>QTY</label>
        <div className="qty-row">
          <input type="number" min="1" value={form.qty} onChange={(e) => set("qty", e.target.value)} />
          <span className="moq">Moq:{BRAND.moq}</span>
        </div>
      </div>
      <div className="field">
        <label>Note</label>
        <textarea placeholder="Note" value={form.note} onChange={(e) => set("note", e.target.value)} />
      </div>
      <button className="btn" data-cursor="bag" type="submit">Send</button>
    </form>
  );
}

export function Contact() {
  return (
    <section className="section form-page">
      <div className="wrap">
        <EnquiryForm title="Contact Us" />
      </div>
    </section>
  );
}

export function EnquiryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="section form-page">
      <div className="wrap">
        <EnquiryForm title="ENQUIRY NOW" />
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
