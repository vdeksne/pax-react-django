import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/products.css";

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
          <div
            key={c.id}
            className="category-card"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={c.image}
              alt={c.title}
              className="img-fluid rounded-circle"
              style={{
                width: "clamp(60px, 10vw, 100px)",
                height: "clamp(60px, 10vw, 100px)",
                objectFit: "cover",
              }}
            />
            <Link
              to={`/category/${c.slug}`}
              className="text-dark text-decoration-none fw-bold"
              style={{
                fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
                textAlign: "center",
              }}
            >
              {c.title}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
