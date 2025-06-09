import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/cartID";

function CategoryProducts() {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const { slug } = useParams();
  const axios = apiInstance;
  const userData = UserData();
  const cart_id = CartID();
  const currentAddress = GetCurrentAddress();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(`category/${slug}/`);
        setCategory(response.data);
        setCategoryProducts(response.data.products || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  const addToCart = async (product) => {
    try {
      const formData = new FormData();
      formData.append("product", product.id);
      formData.append("user", userData?.user_id || "undefined");
      formData.append("qty", 1);
      formData.append("price", product.price);
      formData.append("shipping_amount", product.shipping_amount);
      formData.append("country", currentAddress.country);
      formData.append("size", "No Size");
      formData.append("color", "No Color");
      formData.append("cart_id", cart_id);

      const response = await axios.post("cart-view/", formData);
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Added To Cart",
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add to cart",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div>
      <main className="mt-5">
        <div className="container">
          <section className="text-center">
            <div className="row">
              <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light heading-main">{category?.title}</h1>
                <p className="lead">Browse our {category?.title} collection</p>
              </div>
            </div>
          </section>

          <div className="row">
            {categoryProducts.map((product) => (
              <div className="col-lg-4 col-md-12 mb-4" key={product.id}>
                <div className="card">
                  <div
                    className="bg-image hover-zoom ripple"
                    data-mdb-ripple-color="light"
                  >
                    <img
                      src={product.image}
                      className="w-100"
                      style={{
                        width: "100px",
                        height: "300px",
                        objectFit: "cover",
                      }}
                      alt={product.title}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">${product.price}</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="btn-main-pricing"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CategoryProducts;
