import { createContext, useContext, useMemo, useState } from "react";

const EnquiryContext = createContext(null);

export function EnquiryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const api = useMemo(
    () => ({
      items,
      open,
      setOpen,
      add(product, qty = 1) {
        setItems((prev) => {
          const found = prev.find((p) => p.id === product.id);
          if (found) {
            return prev.map((p) =>
              p.id === product.id ? { ...p, qty: p.qty + qty } : p
            );
          }
          return [...prev, { ...product, qty }];
        });
        setOpen(true);
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
      count: items.reduce((n, i) => n + i.qty, 0),
    }),
    [items, open]
  );

  return <EnquiryContext.Provider value={api}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  return useContext(EnquiryContext);
}
