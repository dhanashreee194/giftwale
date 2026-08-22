const img = (file) => `${import.meta.env.BASE_URL}images/${file}`;

export const BRAND = {
  name: "Giftwale",
  tagline: "CREATING MEMORIES",
  slogan: "Celebrate Every Moment with the Perfect Gift!",
  phoneDisplay: "91- 70702 46161",
  phone: "917070246161",
  email: "temp@gmail.com",
  moq: 30,
  founder: {
    name: "Lakshmi Subash",
    title: "Founder",
    photo: img("founder.jpg"),
  },
};

export const COPY = {
  welcome:
    "Welcome to Giftwale, your one-stop destination for unique, creative, and memorable gifts for every occasion. We believe that every gift carries emotions, memories, and love, which is why we offer a carefully selected collection of products designed to make every moment special.",
  range:
    "From birthday gifts, anniversary surprises, and personalized items to festive hampers and corporate gifting solutions, we provide a wide range of high-quality products that suit every style and budget. Our goal is to help you find the perfect gift that brings smiles and creates unforgettable memories.",
  priority:
    "At Giftwale, customer satisfaction is our priority. We focus on quality, creativity, timely service, and unique designs to ensure every customer enjoys a smooth and delightful shopping experience. Whether you are celebrating a special occasion or simply want to make someone feel valued, we are here to make gifting more meaningful and memorable.",
  elegant:
    "Elegant personalized gifting solutions designed with luxury, love, and timeless style.",
  curated:
    "Thoughtfully curated premium gifts crafted to make every celebration memorable and special",
  handcrafted:
    "Discover handcrafted gift collections perfect for birthdays, weddings, and corporate occasions.",
};

export const CATEGORIES = [
  { id: "birthday", label: "Birthday Gift", title: "Birthday Gift", image: img("asset-10.jpg"), tone: "teal" },
  { id: "wedding", label: "Wedding Gift", title: "Wedding Gift", image: img("asset-13.png"), tone: "navy" },
  { id: "return", label: "Return Gift", title: "Return Gift", image: img("asset-12.png"), tone: "amber" },
  { id: "corporate", label: "Corporate Gift", title: "Corporate Gift", image: img("asset-02.png"), tone: "gold" },
];

export const SEARCH_HINTS = [
  { label: "Birthday Gift", q: "birthday" },
  { label: "Wedding Gift", q: "wedding" },
  { label: "Return Gift", q: "return" },
  { label: "Corporate Gift", q: "corporate" },
  { label: "Personalized", q: "personalized" },
];

export function tileSize(index) {
  return ["lg", "sm", "md", "sm", "lg", "md"][index % 6];
}

export const SERVICES = [
  {
    title: "Customized Gifting",
    icon: "ribbon",
    text: "Names, logos and messages engraved or printed so every piece feels made for the person who receives it.",
  },
  {
    title: "Corporates Gifting",
    icon: "card",
    text: "Executive hampers, desk sets and branded drinkware for client relationships and team celebrations.",
  },
  {
    title: "Whole - Sale bulk Order",
    icon: "boxes",
    text: `Call Now: ${BRAND.phoneDisplay}. Email Id - ${BRAND.email}. Moq:${BRAND.moq}`,
  },
];

export const PRODUCTS = [
  {
    id: "hopewood-hamper",
    name: "Hopewood Premium Gift Hamper",
    category: "corporate",
    image: img("asset-16.png"),
    blurb: COPY.elegant,
    tags: ["Luxury", "Hamper"],
  },
  {
    id: "durga-jute-bags",
    name: "Festive Jute Return Gift Bags",
    category: "return",
    image: img("asset-12.png"),
    blurb: COPY.handcrafted,
    tags: ["Return Gift", "Handcrafted"],
  },
  {
    id: "folk-bird-totes",
    name: "Folk Bird Canvas Tote Pair",
    category: "wedding",
    image: img("asset-13.png"),
    blurb: COPY.curated,
    tags: ["Wedding", "Handcrafted"],
  },
  {
    id: "paisley-pouches",
    name: "Paisley Jewellery Gift Pouches",
    category: "wedding",
    image: img("asset-14.png"),
    blurb: COPY.handcrafted,
    tags: ["Wedding", "Luxury"],
  },
  {
    id: "jute-window-tote",
    name: "Natural Jute Window Tote",
    category: "return",
    image: img("asset-11.png"),
    blurb: COPY.elegant,
    tags: ["Return Gift", "Eco"],
  },
  {
    id: "canvas-pocket-tote",
    name: "Jute & Canvas Pocket Tote",
    category: "birthday",
    image: img("asset-10.jpg"),
    blurb: COPY.curated,
    tags: ["Birthday", "Eco"],
  },
  {
    id: "sport-vacuum-cup",
    name: "The Best Sport Vacuum Cup",
    category: "corporate",
    image: img("asset-00.png"),
    blurb: COPY.elegant,
    tags: ["Corporate", "Drinkware"],
  },
  {
    id: "smart-cup",
    name: "Smart Cup with LED Temperature Lid",
    category: "corporate",
    image: img("asset-01.png"),
    blurb: COPY.curated,
    tags: ["Corporate", "Tech"],
  },
  {
    id: "cork-office-set",
    name: "Cork & Chrome Corporate Desk Set",
    category: "corporate",
    image: img("asset-02.png"),
    blurb: COPY.handcrafted,
    tags: ["Corporate", "Eco"],
  },
  {
    id: "teacher-pen-stand",
    name: "World Best Teacher Wooden Pen Set",
    category: "birthday",
    image: img("asset-04.png"),
    blurb: COPY.curated,
    tags: ["Birthday", "Personalized"],
  },
  {
    id: "medical-desk-set",
    name: "Personalized Medical Desk Clock Set",
    category: "corporate",
    image: img("asset-05.png"),
    blurb: COPY.elegant,
    tags: ["Corporate", "Personalized"],
  },
  {
    id: "ca-desk-set",
    name: "CA Executive Gold Desk Set",
    category: "corporate",
    image: img("asset-07.png"),
    blurb: COPY.elegant,
    tags: ["Corporate", "Personalized"],
  },
  {
    id: "wooden-phone-organizer",
    name: "Handcrafted Wooden Phone Organizer",
    category: "corporate",
    image: img("asset-08.png"),
    blurb: COPY.handcrafted,
    tags: ["Corporate", "Handcrafted"],
  },
  {
    id: "house-clock-organizer",
    name: "Wooden House Clock Desk Organizer",
    category: "birthday",
    image: img("asset-06.png"),
    blurb: COPY.curated,
    tags: ["Birthday", "Handcrafted"],
  },
  {
    id: "led-acrylic-stand",
    name: "LED Acrylic Multi Branding Pen Stand",
    category: "corporate",
    image: img("asset-03.jpg"),
    blurb: COPY.elegant,
    tags: ["Corporate", "Personalized"],
  },
  {
    id: "slatted-wood-organizer",
    name: "Two-Tone Wooden Desk Organizer",
    category: "return",
    image: img("asset-09.jpg"),
    blurb: COPY.handcrafted,
    tags: ["Return Gift", "Handcrafted"],
  },
];
