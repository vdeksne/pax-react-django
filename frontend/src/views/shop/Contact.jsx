import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page" style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        className="text-center text-white py-5"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
          paddingTop: "100px",
          paddingBottom: "80px",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1
                className="display-3 fw-bold mb-4"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
              >
                Get in Touch
              </h1>
              <p
                className="lead fs-4 mb-4"
                style={{ opacity: 0.95, lineHeight: "1.8" }}
              >
                We'd Love to Hear From You
              </p>
              <p className="fs-5" style={{ opacity: 0.9 }}>
                Have a question, suggestion, or just want to say hello? We're
                here to help and always happy to connect with our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container py-5">
          <div className="row g-4">
            {[
              {
                icon: "fas fa-envelope",
                title: "Email Us",
                description:
                  "Send us an email anytime and we'll respond within 24 hours.",
                contact: "support@paxcreative.com",
                color: "#ffffff",
                bgColor: "#000000",
              },
              {
                icon: "fas fa-phone",
                title: "Call Us",
                description:
                  "Our support team is available Monday to Friday, 9 AM - 6 PM EST.",
                contact: "+1 (555) 123-4567",
                color: "#000000",
                bgColor: "#ffffff",
              },
              {
                icon: "fas fa-map-marker-alt",
                title: "Visit Us",
                description:
                  "Stop by our headquarters for in-person assistance and consultations.",
                contact: "123 Creative Street, New York, NY 10001",
                color: "#ffffff",
                bgColor: "#1a1a1a",
              },
            ].map((method, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className="card h-100 border-0 shadow-lg"
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="card-body p-5 text-center"
                    style={{
                      background: `linear-gradient(135deg, ${method.bgColor} 0%, ${method.bgColor}dd 100%)`,
                      color: method.color,
                    }}
                  >
                    <div className="mb-4">
                      <i
                        className={`${method.icon} fa-3x`}
                        style={{ opacity: 0.9, color: method.color }}
                      ></i>
                    </div>
                    <h3
                      className="h4 fw-bold mb-3"
                      style={{ color: method.color }}
                    >
                      {method.title}
                    </h3>
                    <p
                      className="mb-3"
                      style={{
                        lineHeight: "1.7",
                        color: method.color,
                        opacity: 0.9,
                      }}
                    >
                      {method.description}
                    </p>
                    <p
                      className="fw-bold mb-0"
                      style={{ color: method.color, fontSize: "1.1rem" }}
                    >
                      {method.contact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">Send Us a Message</h2>
                <p className="lead text-muted">
                  Fill out the form below and we'll get back to you as soon as
                  possible
                </p>
              </div>
              <div
                className="card border-0 shadow-lg"
                style={{ borderRadius: "20px", overflow: "hidden" }}
              >
                <div
                  className="card-body p-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  }}
                >
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label
                          htmlFor="name"
                          className="form-label fw-bold"
                          style={{ color: "#000000" }}
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          style={{
                            borderRadius: "10px",
                            border: "2px solid #e9ecef",
                            padding: "12px 15px",
                          }}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="email"
                          className="form-label fw-bold"
                          style={{ color: "#000000" }}
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{
                            borderRadius: "10px",
                            border: "2px solid #e9ecef",
                            padding: "12px 15px",
                          }}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="col-12">
                        <label
                          htmlFor="subject"
                          className="form-label fw-bold"
                          style={{ color: "#000000" }}
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          style={{
                            borderRadius: "10px",
                            border: "2px solid #e9ecef",
                            padding: "12px 15px",
                          }}
                          placeholder="How can we help you?"
                        />
                      </div>
                      <div className="col-12">
                        <label
                          htmlFor="message"
                          className="form-label fw-bold"
                          style={{ color: "#000000" }}
                        >
                          Message
                        </label>
                        <textarea
                          className="form-control form-control-lg"
                          id="message"
                          name="message"
                          rows="6"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          style={{
                            borderRadius: "10px",
                            border: "2px solid #e9ecef",
                            padding: "12px 15px",
                            resize: "vertical",
                          }}
                          placeholder="Tell us more about your inquiry..."
                        ></textarea>
                      </div>
                      <div className="col-12 text-center">
                        <button
                          type="submit"
                          className="btn btn-lg px-5 py-3 fw-bold"
                          style={{
                            borderRadius: "50px",
                            fontSize: "1.1rem",
                            transition: "all 0.3s ease",
                            background:
                              "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                            color: "#ffffff",
                            border: "none",
                            minWidth: "200px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow =
                              "0 10px 30px rgba(0, 0, 0, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <i className="fas fa-paper-plane me-2"></i>
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-5 text-white"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
        }}
      >
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              Frequently Asked Questions
            </h2>
            <p className="lead" style={{ opacity: 0.95 }}>
              Quick answers to common questions
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {[
                {
                  question: "How do I become a creator on Pax?",
                  answer:
                    "Simply click on 'Become a Creator' in the navigation menu, fill out the registration form, and our team will review your application. Once approved, you can start uploading your artwork and building your store.",
                },
                {
                  question: "What are the commission rates?",
                  answer:
                    "We offer competitive commission rates starting at 15% per sale. As you grow and reach certain milestones, you may qualify for reduced rates. All pricing details are transparent and available in your vendor dashboard.",
                },
                {
                  question: "How long does shipping take?",
                  answer:
                    "Shipping times vary depending on the creator and your location. Most orders are processed within 2-3 business days, with standard shipping taking 5-7 business days. Express shipping options are available at checkout.",
                },
                {
                  question: "Can I return or exchange a product?",
                  answer:
                    "Yes! We offer a 30-day return policy on most items. If you're not satisfied with your purchase, contact our support team or the creator directly through the order page. Custom or personalized items may have different return policies.",
                },
                {
                  question: "How do I track my order?",
                  answer:
                    "Once your order ships, you'll receive a tracking number via email. You can also view all your orders and their status in your account dashboard under 'My Orders'.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="card border-0 shadow-sm mb-3"
                  style={{
                    borderRadius: "15px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3" style={{ color: "#ffffff" }}>
                      <i className="fas fa-question-circle me-2"></i>
                      {faq.question}
                    </h5>
                    <p
                      className="mb-0"
                      style={{
                        color: "#ffffff",
                        opacity: 0.9,
                        lineHeight: "1.7",
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold mb-4">Office Hours</h2>
              <p className="lead text-muted mb-4">
                We're here to help you during these times
              </p>
              <div
                className="card border-0 shadow-lg"
                style={{ borderRadius: "20px", overflow: "hidden" }}
              >
                <div
                  className="card-body p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  }}
                >
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
                    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
                    { day: "Sunday", hours: "Closed" },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center py-3"
                      style={{
                        borderBottom: index < 2 ? "1px solid #e9ecef" : "none",
                      }}
                    >
                      <span className="fw-bold" style={{ color: "#000000" }}>
                        {schedule.day}
                      </span>
                      <span className="text-muted">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="card border-0 shadow-lg"
                style={{ borderRadius: "20px", overflow: "hidden" }}
              >
                <div
                  className="card-body p-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                    minHeight: "300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="text-center" style={{ color: "#ffffff" }}>
                    <i
                      className="fas fa-clock fa-5x mb-4"
                      style={{ opacity: 0.9, color: "#ffffff" }}
                    ></i>
                    <h3 className="h4 fw-bold" style={{ color: "#ffffff" }}>
                      We're Always Listening
                    </h3>
                    <p
                      className="mt-3"
                      style={{ opacity: 0.95, color: "#ffffff" }}
                    >
                      Even outside office hours, you can reach us via email and
                      we'll respond as soon as possible
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
