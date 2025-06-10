import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaShoppingCart, FaSpinner } from "react-icons/fa";
import "../../../assets/css/products.css";

const ProductGrid = ({
  currentItems,
  handleColorButtonClick,
  handleSizeButtonClick,
  handleQtyChange,
  handleAddToCart,
  handleAddToWishlist,
  selectedProduct,
  colorImage,
  selectedColors,
  selectedSize,
  qtyValue,
  loadingStates,
}) => {
  return (
    <section className="product-grid-section">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        {currentItems.map((product) => (
          <div className="col" key={product.id}>
            <div className="card h-100 card-product-grid">
              <div
                className="bg-image hover-zoom ripple"
                data-mdb-ripple-color="light"
              >
                <Link to={`/detail/${product.slug}`}>
                  <img
                    src={
                      selectedProduct === product.id && colorImage
                        ? colorImage
                        : product.image
                    }
                    className="w-100"
                    style={{
                      height: "clamp(200px, 30vw, 300px)",
                      objectFit: "cover",
                    }}
                    alt={product.title}
                  />
                </Link>
              </div>
              <div className="card-body card-text p-0 pt-4">
                <h6 className="">
                  By:{" "}
                  <Link to={`/vendor/${product?.vendor?.slug}`}>
                    {product.vendor.name}
                  </Link>
                </h6>
                <Link to={`/detail/${product.slug}`} className="text-reset">
                  <h5 className="card-title mb-3">
                    {product.title.slice(0, 30)}
                  </h5>
                </Link>
                <h6 className="mb-3">${product.price}</h6>

                <div className="heart-container">
                  {product.color?.length > 0 || product.size?.length > 0 ? (
                    <div className="btn-group">
                      <button
                        className="dropdown-toggle btn-main-pricing"
                        type="button"
                        id="dropdownMenuClickable"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="false"
                        aria-expanded="false"
                      >
                        Variation
                      </button>
                      <ul
                        className="dropdown-menu"
                        style={{ maxWidth: "400px" }}
                        aria-labelledby="dropdownMenuClickable"
                      >
                        {/* Quantity */}
                        <div className="d-flex flex-column mb-2 mt-2 p-1">
                          <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                            <li>
                              <input
                                type="number"
                                className="form-control"
                                placeholder="Quantity"
                                onChange={(e) => handleQtyChange(e, product.id)}
                                min={1}
                                value={qtyValue}
                              />
                            </li>
                          </div>
                        </div>

                        {/* Size */}
                        {product?.size?.length > 0 && (
                          <div className="d-flex flex-column">
                            <li className="p-1">
                              <b>Size</b>:{" "}
                              {selectedSize[product.id] || "Select a size"}
                            </li>
                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap gap-2">
                              {product.size.map((size) => (
                                <li key={size.id}>
                                  <button
                                    className="btn-secondary btn-sm"
                                    onClick={(e) =>
                                      handleSizeButtonClick(
                                        e,
                                        product.id,
                                        size.name
                                      )
                                    }
                                  >
                                    {size.name}
                                  </button>
                                </li>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Color */}
                        {product.color?.length > 0 && (
                          <div className="d-flex flex-column mt-3">
                            <li className="p-1 color_name_div">
                              <b>Color</b>:{" "}
                              {selectedColors[product.id] || "Select a color"}
                            </li>
                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap gap-2">
                              {product.color.map((color) => (
                                <li key={color.id}>
                                  <button
                                    className="color-button"
                                    style={{
                                      backgroundColor: color.color_code,
                                      width: "2rem",
                                      height: "2rem",
                                      borderRadius: "50%",
                                      border:
                                        selectedColors[product.id] ===
                                        color.name
                                          ? "2px solid #000"
                                          : "none",
                                    }}
                                    onClick={(e) =>
                                      handleColorButtonClick(
                                        e,
                                        product.id,
                                        color.name,
                                        color.image
                                      )
                                    }
                                    aria-label={`Select ${color.name} color`}
                                  />
                                </li>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add To Cart */}
                        <div className="d-flex mt-3 p-1 w-100">
                          <button
                            onClick={() =>
                              handleAddToCart(
                                product.id,
                                product.price,
                                product.shipping_amount
                              )
                            }
                            disabled={loadingStates[product.id] === "Adding..."}
                            className="w-100 btn-main-pricing"
                          >
                            {loadingStates[product.id] === "Added to Cart" ? (
                              <>
                                Added to Cart <FaCheckCircle />
                              </>
                            ) : loadingStates[product.id] === "Adding..." ? (
                              <>
                                Adding to Cart{" "}
                                <FaSpinner className="fas fa-spin" />
                              </>
                            ) : (
                              <>
                                {loadingStates[product.id] || "Add to Cart"}{" "}
                                <FaShoppingCart />
                              </>
                            )}
                          </button>
                        </div>
                      </ul>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        handleAddToCart(
                          product.id,
                          product.price,
                          product.shipping_amount
                        )
                      }
                      disabled={loadingStates[product.id] === "Adding..."}
                      className="me-1 mb-1 btn-main-pricing"
                    >
                      {loadingStates[product.id] === "Added to Cart" ? (
                        <>
                          Added to Cart <FaCheckCircle />
                        </>
                      ) : loadingStates[product.id] === "Adding..." ? (
                        <>
                          Adding to Cart <FaSpinner className="fas fa-spin" />
                        </>
                      ) : (
                        <>
                          {loadingStates[product.id] || "Add to Cart"}{" "}
                          <FaShoppingCart />
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => handleAddToWishlist(product.id)}
                    className="btn"
                    aria-label="Add to wishlist"
                  >
                    <svg
                      width="18"
                      height="15"
                      viewBox="0 0 18 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.3704 0.189733C11.8978 -0.584476 10.0383 1.20594 9.3527 2.05295C8.64327 1.20594 6.78266 -0.584379 4.33501 0.189733C2.45051 0.794736 1.10435 2.41595 0.88333 4.35191C0.638564 6.74733 1.86239 10.5229 9.15664 14.9518C9.20541 14.9764 9.27903 15 9.35265 15C9.42627 15 9.47503 14.9754 9.54865 14.9518C16.8429 10.4995 18.0905 6.72376 17.822 4.35191C17.6011 2.43954 16.255 0.794736 14.3704 0.189733Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
