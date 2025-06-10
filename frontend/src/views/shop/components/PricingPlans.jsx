import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/products.css";

const PricingPlans = () => {
  return (
    <section className="price_plan_area section_padding_130_80" id="pricing">
      <div className="container">
        <div className="row justify-content-center">
          <div className="mb-4">
            <div className="section-heading text-center gotham-light">
              <h6 className="responsive-text">Pricing Plans</h6>
              <h3 className="responsive-text">Choose Your Perfect Plan</h3>
              <p className="responsive-text">
                Select the plan that best fits your needs and start selling
                today.
              </p>
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center text-start">
          {/* Basic Plan */}
          <div className="col">
            <div className="single_price_plan h-100">
              <div className="title">
                <h3>Basic</h3>
                <p>For Individual Shoppers</p>
              </div>
              <div className="price">
                <h4>Free</h4>
              </div>
              <div className="description">
                <p>
                  <i className="fas fa-check"></i> Basic Product Access
                </p>
                <p>
                  <i className="fas fa-check"></i> Standard Shipping
                </p>
                <p>
                  <i className="fas fa-times"></i> Priority Support
                </p>
                <p>
                  <i className="fas fa-times"></i> Exclusive Deals
                </p>
                <p>
                  <i className="fas fa-times"></i> Premium Products
                </p>
              </div>
              <div className="button">
                <Link className="btn-main-pricing" to="/register">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="col">
            <div className="single_price_plan active h-100">
              <div className="side-shape"></div>
              <div className="title">
                <span>Popular</span>
                <h3>Premium</h3>
                <p>For Regular Shoppers</p>
              </div>
              <div className="price">
                <h4>$9.99</h4>
              </div>
              <div className="description">
                <p>
                  <i className="fas fa-check"></i> All Basic Features
                </p>
                <p>
                  <i className="fas fa-check"></i> Priority Shipping
                </p>
                <p>
                  <i className="fas fa-check"></i> 24/7 Support
                </p>
                <p>
                  <i className="fas fa-check"></i> Exclusive Deals
                </p>
                <p>
                  <i className="fas fa-times"></i> Premium Products
                </p>
              </div>
              <div className="button">
                <Link className="btn-main-pricing" to="/register">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="col">
            <div className="single_price_plan h-100">
              <div className="title">
                <h3>Enterprise</h3>
                <p>For Business Customers</p>
              </div>
              <div className="price">
                <h4>$49.99</h4>
              </div>
              <div className="description">
                <p>
                  <i className="fas fa-check"></i> All Premium Features
                </p>
                <p>
                  <i className="fas fa-check"></i> Express Shipping
                </p>
                <p>
                  <i className="fas fa-check"></i> Dedicated Support
                </p>
                <p>
                  <i className="fas fa-check"></i> VIP Deals
                </p>
                <p>
                  <i className="fas fa-check"></i> Premium Products
                </p>
              </div>
              <div className="button">
                <Link className="btn-main-pricing" to="/register">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
