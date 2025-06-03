import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Products from "./Products";

function CategoryProducts() {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const { slug } = useParams();
  const axios = apiInstance;

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
                    <h5 className="card-title mb-3">{product.title}</h5>
                    <p className="card-text">${product.price}</p>
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
