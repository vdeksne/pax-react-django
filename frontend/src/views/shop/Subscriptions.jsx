import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import "../../App.css";

const Subscriptions = () => {
  const navigate = useNavigate();
  const axios = apiInstance;
  const userData = UserData();
  const [loading, setLoading] = useState({});

  // Function to handle subscription order creation
  const handleGetStarted = async (plan) => {
    const planId = plan.id;
    setLoading((prev) => ({ ...prev, [planId]: true }));

    try {
      // Parse price from plan (remove $ sign, handle "Free")
      let planPrice = 0;
      if (plan.price && plan.price !== "Free") {
        planPrice =
          parseFloat(
            plan.price.replace("$", "").replace("/month", "").trim()
          ) || 0;
      }

      // Create subscription order
      const formData = new FormData();
      formData.append("plan_name", plan.name.toLowerCase());
      formData.append("plan_price", planPrice.toString());

      // Add user info if available
      if (userData?.user_id) {
        formData.append("user_id", userData.user_id.toString());
      }
      if (userData?.full_name) {
        formData.append("full_name", userData.full_name);
      }
      if (userData?.email) {
        formData.append("email", userData.email);
      }

      const response = await axios.post("create-subscription-order/", formData);

      if (response.data && response.data.order_oid) {
        // Navigate to checkout with the order ID
        navigate(`/checkout/${response.data.order_oid}`);
      } else {
        throw new Error("Failed to create subscription order");
      }
    } catch (error) {
      console.error("Error creating subscription order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to create subscription order. Please try again.",
      });
      setLoading((prev) => ({ ...prev, [planId]: false }));
    }
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      tagline: "Test it out for free",
      price: "Free",
      description:
        "Perfect for creators who are just starting out. Get access to essential features and start building your presence.",
      features: [
        {
          title: "Basic Platform Access",
          description:
            "Full access to our platform with all core features. Create your profile, upload products, and start selling.",
          included: true,
        },
        {
          title: "Standard Shipping",
          description:
            "Reliable shipping options for your customers. Standard delivery times apply to all orders.",
          included: true,
        },
        {
          title: "Priority Support",
          description:
            "Get help when you need it with our standard support channels. Response time within 48 hours.",
          included: false,
        },
        {
          title: "Exclusive Deals",
          description:
            "Access to special promotions and discounts available only to premium members.",
          included: false,
        },
        {
          title: "Premium Products",
          description:
            "Sell premium and exclusive products with advanced customization options.",
          included: false,
        },
      ],
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      tagline: "For Real Creatives",
      price: "$9.99",
      period: "/month",
      description:
        "The most popular choice for serious creators. Unlock advanced features and priority support to grow your business.",
      features: [
        {
          title: "All Basic Features",
          description:
            "Everything included in the Basic plan, plus exclusive premium features to enhance your experience.",
          included: true,
        },
        {
          title: "Priority Shipping",
          description:
            "Faster shipping options for your customers. Expedited delivery with tracking and insurance included.",
          included: true,
        },
        {
          title: "24/7 Support",
          description:
            "Round-the-clock customer support via email, chat, and phone. Get instant help whenever you need it.",
          included: true,
        },
        {
          title: "Exclusive Deals",
          description:
            "Early access to sales, special discounts, and exclusive offers not available to basic members.",
          included: true,
        },
        {
          title: "Advanced Features",
          description:
            "Access to analytics dashboard, advanced product customization, and API integrations.",
          included: false,
        },
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tagline: "For Business Customers",
      price: "$49.99",
      period: "/month",
      description:
        "The ultimate solution for businesses and high-volume creators. Everything you need to scale your operations.",
      features: [
        {
          title: "All Premium Features",
          description:
            "Complete access to all Premium features, plus enterprise-grade tools and capabilities.",
          included: true,
        },
        {
          title: "Express Shipping",
          description:
            "Fastest shipping options with same-day and next-day delivery. White-glove service for your customers.",
          included: true,
        },
        {
          title: "Dedicated Support",
          description:
            "Your own dedicated account manager and priority support team. Direct line to our experts.",
          included: true,
        },
        {
          title: "VIP Deals",
          description:
            "Exclusive VIP pricing, custom payment terms, and personalized deals tailored to your business.",
          included: true,
        },
        {
          title: "Advanced Features",
          description:
            "Full analytics suite, custom integrations, white-label options, and advanced automation tools.",
          included: true,
        },
      ],
      popular: false,
    },
  ];

  return (
    <div className="subscriptions-page">
      <div className="container py-5">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="subscriptions-title mb-3">Subscription Plans</h1>
          <p className="subscriptions-subtitle">
            Choose the perfect plan for your creative journey
          </p>
        </div>

        {/* Plans Grid */}
        <div className="row g-4 mb-5">
          {plans.map((plan) => (
            <div key={plan.id} className="col-lg-4 col-md-6">
              <div
                className={`subscription-card ${
                  plan.popular ? "subscription-card-popular" : ""
                }`}
              >
                {plan.popular && (
                  <div className="subscription-badge">Most Popular</div>
                )}
                <div className="subscription-header">
                  <h2 className="subscription-name">{plan.name}</h2>
                  <p className="subscription-tagline">{plan.tagline}</p>
                </div>
                <div className="subscription-price">
                  <span className="price-amount">{plan.price}</span>
                  {plan.period && (
                    <span className="price-period">{plan.period}</span>
                  )}
                </div>
                <p className="subscription-description">{plan.description}</p>
                <div className="subscription-features">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`feature-item ${
                        feature.included
                          ? "feature-included"
                          : "feature-excluded"
                      }`}
                    >
                      <div className="feature-icon">
                        {feature.included ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.6667 5L7.50004 14.1667L3.33337 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 5L15 15M15 5L5 15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="feature-content">
                        <h4 className="feature-title">{feature.title}</h4>
                        <p className="feature-description">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="subscription-cta">
                  <button
                    onClick={() => handleGetStarted(plan)}
                    className="subscription-button"
                    disabled={loading[plan.id]}
                  >
                    {loading[plan.id] ? "Processing..." : "Get Started"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="subscription-comparison">
          <h2 className="comparison-title text-center mb-5">Compare Plans</h2>
          <div className="table-responsive">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Basic</th>
                  <th>Premium</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Platform Access</td>
                  <td>
                    <span className="check-mark">✓</span>
                  </td>
                  <td>
                    <span className="check-mark">✓</span>
                  </td>
                  <td>
                    <span className="check-mark">✓</span>
                  </td>
                </tr>
                <tr>
                  <td>Shipping</td>
                  <td>Standard</td>
                  <td>Priority</td>
                  <td>Express</td>
                </tr>
                <tr>
                  <td>Support</td>
                  <td>Standard</td>
                  <td>24/7</td>
                  <td>Dedicated</td>
                </tr>
                <tr>
                  <td>Exclusive Deals</td>
                  <td>
                    <span className="cross-mark">✗</span>
                  </td>
                  <td>
                    <span className="check-mark">✓</span>
                  </td>
                  <td>
                    <span className="check-mark">✓</span>
                  </td>
                </tr>
                <tr>
                  <td>Advanced Features</td>
                  <td>
                    <span className="cross-mark">✗</span>
                  </td>
                  <td>
                    <span className="cross-mark">✗</span>
                  </td>
                  <td>
                    <span className="check-mark">✓</span>
                  </td>
                </tr>
                <tr>
                  <td>Analytics Dashboard</td>
                  <td>
                    <span className="cross-mark">✗</span>
                  </td>
                  <td>
                    <span className="cross-mark">✗</span>
                  </td>
                  <td>
                    <span className="check-mark">✓</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="subscription-faq mt-5">
          <h2 className="faq-title text-center mb-5">
            Frequently Asked Questions
          </h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="faq-item">
                <h4 className="faq-question">Can I change my plan later?</h4>
                <p className="faq-answer">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes will be reflected in your next billing cycle.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="faq-item">
                <h4 className="faq-question">
                  What payment methods do you accept?
                </h4>
                <p className="faq-answer">
                  We accept all major credit cards, PayPal, and bank transfers
                  for Enterprise plans.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="faq-item">
                <h4 className="faq-question">
                  Is there a contract or commitment?
                </h4>
                <p className="faq-answer">
                  No long-term contracts. You can cancel your subscription at
                  any time with no penalties.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="faq-item">
                <h4 className="faq-question">Do you offer refunds?</h4>
                <p className="faq-answer">
                  Yes, we offer a 30-day money-back guarantee on all paid plans.
                  Contact support for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
