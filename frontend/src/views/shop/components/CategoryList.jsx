import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/products.css";

/** Local Pax-style icons (black + orange) — keyed by API category slug */
const CATEGORY_ICON_SRC = {
  hats: "/assets/categories/hats.svg",
  hoodies: "/assets/categories/hoodies.svg",
  bags: "/assets/categories/bags.svg",
  shirts: "/assets/categories/shirts.svg",
  socks: "/assets/categories/socks.svg",
  art: "/assets/categories/art.svg",
};

function categoryImageUrl(category) {
  const local = CATEGORY_ICON_SRC[category.slug];
  if (local) return local;
  return category.image;
}

const CategoryList = ({ categories }) => {
  return (
    <>
      <section className="text-center container">
        <div className="row">
          <div className="mx-auto">
            <h1 className="fw-light heading-main">Product Categories</h1>
          </div>
        </div>
      </section>
      <div className="d-flex justify-content-center flex-wrap gap-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/category/${c.slug}`}
            className="category-card text-dark text-decoration-none"
            style={{ display: "block" }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={categoryImageUrl(c)}
              alt={c.title}
              className="img-fluid d-block mx-auto"
              style={{
                width: "clamp(60px, 10vw, 100px)",
                height: "clamp(60px, 10vw, 100px)",
                objectFit: "contain",
              }}
            />
            <div
              className="fw-bold text-center"
              style={{
                fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
                marginTop: "0.35rem",
              }}
            >
              {c.title}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
