import { createContext, useContext, useMemo, useState } from "react";

const EnquiryContext = createContext(null);

export function EnquiryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  const api = useMemo(
    () => ({
      items,
      open,
      setOpen,
      pulse,
      add(product, qty = 1, origin) {
        setItems((prev) => {
          const found = prev.find((p) => p.id === product.id);
          if (found) {
            return prev.map((p) =>
              p.id === product.id ? { ...p, qty: p.qty + qty, note: product.note ?? p.note } : p
            );
          }
          return [...prev, { ...product, qty, note: product.note || "" }];
        });
        setPulse((n) => n + 1);
        window.dispatchEvent(new CustomEvent("giftwale-fly", {
          detail: { image: product.image, x: origin?.x ?? window.innerWidth / 2, y: origin?.y ?? window.innerHeight / 2 },
        }));
      },
      update(id, qty) {
        setItems((prev) =>
          prev
            .map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
            .filter((p) => p.qty > 0)
        );
      },
      remove(id) {
        setItems((prev) => prev.filter((p) => p.id !== id));
      },
      clear() {
        setItems([]);
      },
      note(id, value) {
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, note: value } : p)));
      },
      count: items.reduce((n, i) => n + i.qty, 0),
    }),
    [items, open, pulse]
  );

  return <EnquiryContext.Provider value={api}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  return useContext(EnquiryContext);
}
