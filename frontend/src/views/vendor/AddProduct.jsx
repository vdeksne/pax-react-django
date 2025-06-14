import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const userData = UserData();

  if (UserData()?.vendor_id === 0) {
    window.location.href = "/vendor/register/";
  }

  const [product, setProduct] = useState({
    title: "",
    image: null,
    description: "",
    category: "",
    tags: "",
    brand: "",
    price: "",
    old_price: "",
    shipping_amount: "",
    stock_qty: "",
    vendor: userData?.vendor_id,
  });
  const [specifications, setSpecifications] = useState([
    { title: "", content: "" },
  ]);
  const [colors, setColors] = useState([
    { name: "", color_code: "", image: null },
  ]);
  const [sizes, setSizes] = useState([{ name: "", price: 0.0 }]);
  const [gallery, setGallery] = useState([{ image: null }]);
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axios = apiInstance;
  const navigate = useNavigate();
  const handleAddMore = (setStateFunction) => {
    setStateFunction((prevState) => [...prevState, {}]);
  };

  console.log(product.category);

  const handleRemove = (index, setStateFunction) => {
    setStateFunction((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  const handleInputChange = (index, field, value, setStateFunction) => {
    setStateFunction((prevState) => {
      const newState = [...prevState];
      newState[index][field] = value;
      return newState;
    });
  };

  const handleImageChange = (index, event, setStateFunction) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setStateFunction((prevState) => {
          const newState = [...prevState];
          newState[index].image = { file, preview: reader.result };
          return newState;
        });
      };

      reader.readAsDataURL(file);
    } else {
      // Handle the case when no file is selected
      setStateFunction((prevState) => {
        const newState = [...prevState];
        newState[index].image = null; // Set image to null
        newState[index].preview = null; // Optionally set preview to null
        return newState;
      });
    }
  };

  const handleProductInputChange = (event) => {
    setProduct({
      ...product,
      [event.target.name]: event.target.value,
    });
  };

  const handleProductFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({
          ...product,
          image: {
            file: file,
            preview: reader.result,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      axios.get("category/").then((res) => {
        setCategory(res.data);
      });
    };
    fetchCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (
      product.title == "" ||
      product.description == "" ||
      product.price == "" ||
      product.category === null ||
      product.shipping_amount == "" ||
      product.stock_qty == "" ||
      product.image === null
    ) {
      setIsLoading(false);
      Swal.fire({
        icon: "warning",
        title: "Missing Fields!",
        text: "All fields are required to create a product",
      });
      return;
    }

    // Validate image size (max 2MB)
    if (
      product.image &&
      product.image.file &&
      product.image.file.size > 2 * 1024 * 1024
    ) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Image Too Large",
        text: "Please upload an image smaller than 2MB",
      });
      return;
    }

    try {
      const formData = new FormData();

      // Log the product data before sending
      console.log("Product data being sent:", {
        ...product,
        image: product.image ? "Image file present" : "No image",
      });

      // Append product data
      Object.entries(product).forEach(([key, value]) => {
        if (key === "image" && value && value.file) {
          console.log("Appending image file:", value.file);
          formData.append("image", value.file);
        } else if (key !== "image") {
          formData.append(key, value);
        }
      });

      // Only append non-empty specifications
      specifications
        .filter((spec) => spec.title && spec.content)
        .forEach((specification, index) => {
          Object.entries(specification).forEach(([key, value]) => {
            formData.append(`specifications[${index}][${key}]`, value);
          });
        });

      // Only append non-empty colors
      colors
        .filter((color) => color.name && color.color_code)
        .forEach((color, index) => {
          Object.entries(color).forEach(([key, value]) => {
            if (key === "image" && value && value.file) {
              formData.append(`colors[${index}][${key}]`, value.file);
            } else {
              formData.append(`colors[${index}][${key}]`, String(value));
            }
          });
        });

      // Only append non-empty sizes
      sizes
        .filter((size) => size.name && size.price > 0)
        .forEach((size, index) => {
          Object.entries(size).forEach(([key, value]) => {
            formData.append(`sizes[${index}][${key}]`, value);
          });
        });

      // Only append non-empty gallery images
      gallery
        .filter((item) => item.image && item.image.file)
        .forEach((item, index) => {
          formData.append(`gallery[${index}][image]`, item.image.file);
        });

      // Log the FormData contents
      for (let pair of formData.entries()) {
        console.log(
          pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        );
      }

      const response = await apiInstance.post(
        `vendor-product-create/${userData?.vendor_id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Product Created Successfully",
          text: "This product has been successfully created",
        });
        navigate("/vendor/products/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      console.log("Full error response:", error.response);

      // Extract error message from different possible response formats
      let errorMessage = "Failed to create product. Please try again.";
      if (error.response?.data) {
        if (Array.isArray(error.response.data)) {
          errorMessage =
            error.response.data[0]?.image?.[0] ||
            error.response.data[0]?.message ||
            errorMessage;
        } else if (typeof error.response.data === "object") {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            errorMessage;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <Sidebar />
          {/*/col*/}
          <div className="col-md-9 col-lg-10 main mt-4">
            <div className="container">
              <form
                className="main-body"
                method="POST"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
              >
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                  >
                    <div className="row gutters-sm shadow p-4 rounded">
                      <h4 className="mb-4">Product Details</h4>
                      <div className="col-md-4 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex flex-column align-items-center text-center">
                              {product.image && product.image.preview ? (
                                <img
                                  src={product.image.preview}
                                  alt="Product Thumbnail Preview"
                                  style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: 10,
                                  }}
                                />
                              ) : (
                                <img
                                  src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                  style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: 10,
                                  }}
                                  alt=""
                                />
                              )}

                              <div className="mt-3">
                                {product.title !== "" && (
                                  <h4 className="text-dark">{product.title}</h4>
                                )}
                                {product.title === "" && (
                                  <h4 className="text-dark">Product Title</h4>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="card mb-3">
                          <div className="card-body">
                            <div className="row text-dark">
                              <div className="col-lg-12 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Product Thumbnail
                                </label>
                                <input
                                  type="file"
                                  className="form-control"
                                  name="image"
                                  id=""
                                  onChange={handleProductFileChange}
                                />
                              </div>
                              <div className="col-lg-12 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id=""
                                  name="title"
                                  value={product.title || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-12 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Description
                                </label>
                                <textarea
                                  className="form-control"
                                  id=""
                                  cols={30}
                                  rows={10}
                                  name="description"
                                  value={product.description || ""}
                                  onChange={handleProductInputChange}
                                />
                                {/* <CKEditor
                                                                    editor={ClassicEditor}
                                                                    data="<p>Hello from CKEditor&nbsp;5!</p>"
                                                                    onReady={editor => {
                                                                        // You can store the "editor" and use when it is needed.
                                                                        console.log('Editor is ready to use!', editor);
                                                                    }}
                                                                    onChange={(event) => handleProductInputChange()}
                                                                    onBlur={(event, editor) => {
                                                                        console.log('Blur.', editor);
                                                                    }}
                                                                    onFocus={(event, editor) => {
                                                                        console.log('Focus.', editor);
                                                                    }}
                                                                /> */}
                              </div>
                              <div className="col-lg-6 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Category
                                </label>
                                <select
                                  className="select form-control"
                                  id=""
                                  name="category"
                                  value={product.category || ""}
                                  onChange={handleProductInputChange}
                                >
                                  <option value="">- Select -</option>
                                  {category.map((c, index) => (
                                    <option key={index} value={c.id}>
                                      {c.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Brand
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="brand"
                                  value={product.brand || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Sale Price
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="price"
                                  value={product.price || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Regular Price
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="old_price"
                                  value={product.old_price || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Shipping Amount
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="shipping_amount"
                                  value={product.shipping_amount || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Stock Qty
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="stock_qty"
                                  value={product.stock_qty || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-12 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Tags
                                </label>
                                <br />
                                <input
                                  type="text"
                                  className="form-control"
                                  name="tags"
                                  value={product.tags || ""}
                                  onChange={handleProductInputChange}
                                />
                                <span
                                  style={{ fontSize: 12 }}
                                  className="text-muted"
                                >
                                  NOTE: Seperate tags with comma
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                  >
                    <div className="row gutters-sm shadow p-4 rounded">
                      <h4 className="mb-4">Product Image</h4>
                      <div className="col-md-12">
                        <div className="card mb-3">
                          <div className="card-body">
                            {gallery.map((item, index) => (
                              <div
                                key={`gallery-${index}`}
                                className="row text-dark mb-5"
                              >
                                <div className="col-lg-3">
                                  {item.image && (
                                    <img
                                      src={item.image.preview}
                                      alt={`Preview for gallery item ${
                                        index + 1
                                      }`}
                                      style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: 5,
                                      }}
                                    />
                                  )}

                                  {!item.image && (
                                    <img
                                      src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                      alt={`Preview for gallery item ${
                                        index + 1
                                      }`}
                                      style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: 5,
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="col-lg-6 mb-2">
                                  <label htmlFor="" className="mb-2">
                                    Product Image
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    name=""
                                    id=""
                                    onChange={(e) =>
                                      handleImageChange(index, e, setGallery)
                                    }
                                  />
                                </div>
                                <div className="col-lg-3">
                                  <button
                                    onClick={() =>
                                      handleRemove(index, setGallery)
                                    }
                                    type="button"
                                    className="btn-main-pricing mt-4"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}

                            {gallery < 1 && <h4>No Images Selected</h4>}

                            <button
                              type="button"
                              onClick={() => handleAddMore(setGallery)}
                              className="btn mt-2"
                            >
                              <i className="fas fa-plus" /> Add More Images
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-contact"
                    role="tabpanel"
                    aria-labelledby="pills-contact-tab"
                  >
                    <div className="row gutters-sm shadow p-4 rounded">
                      <h4 className="mb-4">Specifications</h4>
                      <div className="col-md-12">
                        <div className="card mb-3">
                          <div className="card-body">
                            {specifications.map((specification, index) => (
                              <div
                                key={`spec-${index}`}
                                className="row text-dark"
                              >
                                <div className="col-lg-3 mb-2">
                                  <label htmlFor="" className="mb-2">
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={specification.title || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "title",
                                        e.target.value,
                                        setSpecifications
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-lg-6 mb-2">
                                  <label htmlFor="" className="mb-2">
                                    Content
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={specification.content || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "content",
                                        e.target.value,
                                        setSpecifications
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-lg-3 mb-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemove(index, setSpecifications)
                                    }
                                    className="btn-main-pricing mt-4"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}

                            {specifications.length < 1 && (
                              <h4>No Specification Form</h4>
                            )}

                            <button
                              type="button"
                              onClick={() => handleAddMore(setSpecifications)}
                              className="btn mt-2"
                            >
                              <i className="fas fa-plus" /> Add More
                              Specifications
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="pills-size"
                    role="tabpanel"
                    aria-labelledby="pills-size-tab"
                  >
                    <div className="row gutters-sm shadow p-4 rounded">
                      <h4 className="mb-4">Sizes</h4>
                      <div className="col-md-12">
                        <div className="card mb-3">
                          <div className="card-body">
                            {sizes.map((s, index) => (
                              <div
                                key={`size-${index}`}
                                className="row text-dark"
                              >
                                <div className="col-lg-3 mb-2">
                                  <label htmlFor="" className="mb-2">
                                    Size
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name=""
                                    placeholder="XXL"
                                    id=""
                                    value={s.name || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "name",
                                        e.target.value,
                                        setSizes
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-lg-6 mb-2">
                                  <label htmlFor="" className="mb-2">
                                    Price
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="$20"
                                    className="form-control"
                                    name=""
                                    id=""
                                    value={s.price || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "price",
                                        e.target.value,
                                        setSizes
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-lg-3 mt-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemove(index, setSizes)
                                    }
                                    className="btn mt-4"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                            {sizes < 1 && <h4>No Size Added</h4>}
                            <button
                              type="button"
                              onClick={() => handleAddMore(setSizes)}
                              className="btn mt-2"
                            >
                              <i className="fas fa-plus" /> Add More Sizes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-color"
                    role="tabpanel"
                    aria-labelledby="pills-color-tab"
                  >
                    <div className="row gutters-sm shadow p-4 rounded">
                      <h4 className="mb-4">Color</h4>
                      <div className="col-md-12">
                        <div className="card mb-3">
                          <div className="card-body">
                            {colors.map((c, index) => (
                              <div
                                key={`color-${index}`}
                                className="row text-dark mb-3"
                              >
                                <div className="col-lg-2 mb-2">
                                  <label htmlFor="" className="mb-2">
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name=""
                                    placeholder="Green"
                                    id=""
                                    value={c.name || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "name",
                                        e.target.value,
                                        setColors
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-lg-2 mb-2">
                                  <label htmlFor="" className="mb-2">
                                    Code
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="#f4f7f6"
                                    className="form-control"
                                    name=""
                                    id=""
                                    value={c.color_code || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "color_code",
                                        e.target.value,
                                        setColors
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-lg-3 mb-2">
                                  <label htmlFor="" className="mb-2">
                                    Image
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    name=""
                                    id=""
                                    onChange={(e) =>
                                      handleImageChange(index, e, setColors)
                                    }
                                  />
                                </div>

                                <div className="col-lg-3 mt-2">
                                  {c.image && (
                                    <img
                                      src={c.image.preview}
                                      alt={`Preview for gallery item ${
                                        index + 1
                                      }`}
                                      style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: 5,
                                      }}
                                    />
                                  )}
                                  {!c.image && (
                                    <img
                                      src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                      alt={`Preview for gallery item ${
                                        index + 1
                                      }`}
                                      style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: 5,
                                      }}
                                    />
                                  )}
                                </div>

                                <div className="col-lg-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemove(index, setColors)
                                    }
                                    className="btn-main-pricing mt-4"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}

                            {colors < 1 && <h4>No Colors Added</h4>}

                            <button
                              type="button"
                              onClick={() => handleAddMore(setColors)}
                              className="btn mt-2"
                            >
                              <i className="fas fa-plus" /> Add More Colors
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ul
                      className="nav nav-pills mb-3 d-flex justify-content-center mt-5 gap-2"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="btn-main-pricing"
                          id="pills-home-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-home"
                          type="button"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                        >
                          Information
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="btn-main-pricing"
                          id="pills-profile-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-profile"
                          type="button"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                        >
                          Gallery
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="btn-main-pricing"
                          id="pills-contact-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-contact"
                          type="button"
                          role="tab"
                          aria-controls="pills-contact"
                          aria-selected="false"
                        >
                          Specifications
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="btn-main-pricing"
                          id="pills-size-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-size"
                          type="button"
                          role="tab"
                          aria-controls="pills-size"
                          aria-selected="false"
                        >
                          Size
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="btn-main-pricing"
                          id="pills-color-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-color"
                          type="button"
                          role="tab"
                          aria-controls="pills-color"
                          aria-selected="false"
                        >
                          Color
                        </button>
                      </li>
                    </ul>
                    <div className="d-flex justify-content-center mb-5">
                      {isLoading === false && (
                        <button type="submit" className="btn-main-pricing">
                          Create Product
                        </button>
                      )}

                      {isLoading === true && (
                        <button disabled className="btn-main-pricing">
                          Creating... <i className="fa fa-spinner fa-spin" />{" "}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
