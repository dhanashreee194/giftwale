import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GiftCursor } from "./cursor";
import { EnquiryProvider } from "./enquiry";
import { Opening } from "./opening";
import { About, Contact, EnquiryPage, Home, Privacy, Shop, Terms } from "./pages";
import { Bag, Footer, Header } from "./ui";

export default function App() {
  return (
    <BrowserRouter basename="/giftwale">
      <EnquiryProvider>
        <GiftCursor />
        <Opening />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
        <Bag />
      </EnquiryProvider>
    </BrowserRouter>
  );
}
