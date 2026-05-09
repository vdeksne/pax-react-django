import { Link } from "react-router-dom";
import "../../../assets/css/products.css";
import PropTypes from "prop-types";

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
  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <section className="text-center container">
        <div className="row">
          <div className="mx-auto">
            <h1 className="fw-light heading-main">Product Categories</h1>
            <div className="text-muted">No categories available.</div>
          </div>
        </div>
      </section>
    );
  }

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
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={
                categoryImageUrl(c) ||
                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              }
              alt={c.title}
              className="img-fluid"
              style={{
                width: "clamp(60px, 10vw, 100px)",
                height: "clamp(60px, 10vw, 100px)",
                objectFit: "contain",
              }}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.src =
                  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
              }}
            />
            <span
              className="fw-bold"
              style={{
                fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              {c.title}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
};

export default CategoryList;
