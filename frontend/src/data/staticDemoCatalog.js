/** Bundled catalog for Netlify / UI demo without Django (see `VITE_STATIC_DEMO`). Images live in `/public/demo/`. */

const I = (file) => `/demo/${file}`;

export const STATIC_DEMO_VENDOR = {
  id: 2,
  name: "Victory",
  slug: "demo-vendor-2",
  image: I("pax-hat.png"),
};

/** @type {{ id: number; title: string; slug: string; image: string; active: boolean }[]} */
export const STATIC_DEMO_CATEGORIES = [
  { id: 1, title: "Hats", slug: "hats", image: I("pax-hat.png"), active: true },
  { id: 2, title: "Hoodies", slug: "hoodies", image: I("pax-hoodie.jpg"), active: true },
  { id: 3, title: "Bags", slug: "bags", image: I("pax-tote.jpg"), active: true },
  { id: 4, title: "Shirts", slug: "shirts", image: I("pax-tshirt.png"), active: true },
  { id: 5, title: "Socks", slug: "socks", image: I("pax-socks.jpg"), active: true },
  { id: 6, title: "Fine Art", slug: "art", image: I("pax-poster.jpg"), active: true },
];

const _rows = [
  {
    id: 1,
    title: "Pax Hat",
    image: I("pax-hat.png"),
    description: "",
    category: 1,
    tags: null,
    brand: null,
    price: "10.00",
    old_price: "20.00",
    shipping_amount: "1.00",
    stock_qty: 100,
    in_stock: true,
    status: "published",
    type: "regular",
    featured: true,
    hot_deal: false,
    special_offer: false,
    digital: false,
    views: 10,
    orders: 0,
    saved: 0,
    sku: "SKU39621",
    pid: "cmbhlmnzle",
    slug: "pax-hat",
    date: "2025-06-09T15:32:57Z",
    product_rating: null,
    rating_count: 0,
    order_count: 0,
  },
  {
    id: 2,
    title: "Pax T-shirt",
    image: I("pax-tshirt.png"),
    description:
      "Elevate your everyday look with this classic T-shirt. Made from soft, breathable fabric, it's designed for all-day comfort and effortless style.",
    category: 4,
    tags: "shirt",
    brand: null,
    price: "20.00",
    old_price: "50.00",
    shipping_amount: "1.00",
    stock_qty: 100,
    in_stock: true,
    status: "published",
    type: "regular",
    featured: true,
    hot_deal: false,
    special_offer: false,
    digital: false,
    views: 0,
    orders: 0,
    saved: 0,
    sku: "SKU67956",
    pid: "xpgkmakbzj",
    slug: "pax-t-shirt",
    date: "2025-06-09T16:30:43Z",
    product_rating: 5,
    rating_count: 1,
    order_count: 0,
  },
  {
    id: 3,
    title: "Pax Hoodie",
    image: I("pax-hoodie.jpg"),
    description: "",
    category: 2,
    tags: null,
    brand: null,
    price: "100.00",
    old_price: "120.00",
    shipping_amount: "1.00",
    stock_qty: 200,
    in_stock: true,
    status: "published",
    type: "regular",
    featured: true,
    hot_deal: false,
    special_offer: false,
    digital: false,
    views: 0,
    orders: 0,
    saved: 0,
    sku: "SKU99824",
    pid: "cbqnrbybih",
    slug: "pax-hoodie",
    date: "2025-06-09T16:34:02Z",
    product_rating: null,
    rating_count: 0,
    order_count: 0,
  },
  {
    id: 4,
    title: "Pax Socks",
    image: I("pax-socks.jpg"),
    description:
      "Comfort with attitude. The Pax Socks offer breathable support and a clean white design accented with the Pax emblem.",
    category: 5,
    tags: null,
    brand: null,
    price: "10.00",
    old_price: "20.00",
    shipping_amount: "0.97",
    stock_qty: 20,
    in_stock: true,
    status: "published",
    type: "regular",
    featured: true,
    hot_deal: false,
    special_offer: false,
    digital: false,
    views: 0,
    orders: 0,
    saved: 0,
    sku: "SKU41683",
    pid: "oxeegvbgfg",
    slug: "pax-socks",
    date: "2025-06-09T16:35:20Z",
    product_rating: null,
    rating_count: 0,
    order_count: 0,
  },
  {
    id: 5,
    title: "Pax Tote Bag",
    image: I("pax-tote.jpg"),
    description:
      "Carry confidence wherever you go. The Pax Tote Bag blends practicality with bold visual identity.",
    category: 3,
    tags: null,
    brand: null,
    price: "10.00",
    old_price: "15.00",
    shipping_amount: "1.00",
    stock_qty: 100,
    in_stock: true,
    status: "published",
    type: "regular",
    featured: true,
    hot_deal: false,
    special_offer: false,
    digital: false,
    views: 0,
    orders: 0,
    saved: 0,
    sku: "SKU30242",
    pid: "bkkqyicnvz",
    slug: "pax-tote-bag",
    date: "2025-06-09T16:35:55Z",
    product_rating: null,
    rating_count: 0,
    order_count: 0,
  },
  {
    id: 6,
    title: "Pax Poster -  Banksy",
    image: I("pax-poster.jpg"),
    description:
      "Bring iconic street-art energy to your space. This Banksy-inspired Art Poster makes a powerful statement.",
    category: 6,
    tags: null,
    brand: null,
    price: "50.00",
    old_price: "100.00",
    shipping_amount: "1.00",
    stock_qty: 100,
    in_stock: true,
    status: "published",
    type: "regular",
    featured: true,
    hot_deal: false,
    special_offer: false,
    digital: false,
    views: 0,
    orders: 0,
    saved: 0,
    sku: "SKU20504",
    pid: "bchtgudxfv",
    slug: "pax-poster-banksy",
    date: "2025-06-09T16:36:43Z",
    product_rating: 5,
    rating_count: 1,
    order_count: 0,
  },
  {
    id: 10,
    title: "Fika Hoodie",
    image: I("fika-hoodie.png"),
    description:
      "Designed for comfort with a distinctive back print and lifestyle collage — demo piece from the Pax catalog.",
    category: 2,
    tags: "Hoodie",
    brand: "Pax",
    price: "100.00",
    old_price: "150.00",
    shipping_amount: "1.00",
    stock_qty: 10,
    in_stock: true,
    status: "published",
    type: "regular",
    featured: false,
    hot_deal: false,
    special_offer: false,
    digital: false,
    views: 0,
    orders: 0,
    saved: 0,
    sku: "SKU60355",
    pid: "bzechxsrmh",
    slug: "fika-hoodie-6mug",
    date: "2025-06-10T06:48:45.290Z",
    product_rating: null,
    rating_count: 0,
    order_count: 0,
  },
];

function pct(oldP, price) {
  const o = Number(oldP);
  const p = Number(price);
  if (!o || o <= 0) return 0;
  return Math.round(((o - p) / o) * 100);
}

function withVendor(row) {
  return { ...row, vendor: STATIC_DEMO_VENDOR, get_precentage: pct(row.old_price, row.price) };
}

/** List / grid shape (matches DRF list serializer). */
export function getStaticDemoProducts() {
  return _rows.map(withVendor);
}

function detailShape(row) {
  const base = withVendor(row);
  return {
    ...base,
    gallery: [],
    specification: [],
    color: [],
    size: [],
  };
}

/** Product detail (matches DRF retrieve). */
export function getStaticProductBySlug(slug) {
  const row = _rows.find((r) => r.slug === slug);
  if (!row) return null;
  return detailShape(row);
}

/** Category detail with embedded `products` like `CategorySerializer`. */
export function getStaticCategoryWithProducts(slug) {
  const cat = STATIC_DEMO_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  const products = getStaticDemoProducts().filter((p) => p.category === cat.id);
  return {
    ...cat,
    products,
  };
}
