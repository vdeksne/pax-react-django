import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page" style={{ minHeight: "100vh" }}>
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
                Welcome to Pax
              </h1>
              <p
                className="lead fs-4 mb-4"
                style={{ opacity: 0.95, lineHeight: "1.8" }}
              >
                A Creative Platform Where Art Meets Commerce
              </p>
              <p className="fs-5" style={{ opacity: 0.9 }}>
                Empowering artists, designers, and creators to share their
                passion with the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-6">
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
                  className="card-body p-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    color: "#000000",
                  }}
                >
                  <div className="mb-4">
                    <i
                      className="fas fa-bullseye fa-3x"
                      style={{ opacity: 0.9, color: "#000000" }}
                    ></i>
                  </div>
                  <h2 className="h3 fw-bold mb-4" style={{ color: "#000000" }}>
                    Our Mission
                  </h2>
                  <p
                    className="fs-5"
                    style={{ lineHeight: "1.8", color: "#000000" }}
                  >
                    To create a vibrant marketplace where creativity thrives and
                    artists can turn their passion into a sustainable business.
                    We believe every creator deserves a platform to showcase
                    their unique vision and connect with audiences who
                    appreciate authentic artistry.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
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
                  className="card-body p-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                    color: "#ffffff",
                  }}
                >
                  <div className="mb-4">
                    <i
                      className="fas fa-eye fa-3x"
                      style={{ opacity: 0.9, color: "#ffffff" }}
                    ></i>
                  </div>
                  <h2 className="h3 fw-bold mb-4" style={{ color: "#ffffff" }}>
                    Our Vision
                  </h2>
                  <p
                    className="fs-5"
                    style={{ lineHeight: "1.8", color: "#ffffff" }}
                  >
                    To become the world's leading creative marketplace, where
                    innovation meets tradition, and where every artist finds
                    their community. We envision a future where creative work is
                    valued, accessible, and celebrated across all cultures and
                    communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Our Core Values</h2>
            <p className="lead text-muted">
              The principles that guide everything we do
            </p>
          </div>
          <div className="row g-4">
            {[
              {
                icon: "fas fa-palette",
                title: "Creativity First",
                description:
                  "We celebrate originality and encourage artists to express their unique voice without boundaries.",
                color: "#ffffff",
                bgColor: "#000000",
              },
              {
                icon: "fas fa-handshake",
                title: "Community Driven",
                description:
                  "Building connections between creators and art lovers, fostering a supportive ecosystem.",
                color: "#000000",
                bgColor: "#ffffff",
              },
              {
                icon: "fas fa-shield-alt",
                title: "Trust & Quality",
                description:
                  "Ensuring every transaction is secure and every product meets our high standards.",
                color: "#ffffff",
                bgColor: "#1a1a1a",
              },
              {
                icon: "fas fa-rocket",
                title: "Innovation",
                description:
                  "Continuously evolving our platform with cutting-edge features and tools for creators.",
                color: "#000000",
                bgColor: "#f8f9fa",
              },
              {
                icon: "fas fa-globe",
                title: "Accessibility",
                description:
                  "Making art and creative products accessible to everyone, everywhere.",
                color: "#ffffff",
                bgColor: "#000000",
              },
              {
                icon: "fas fa-heart",
                title: "Passion",
                description:
                  "We're driven by our love for art and our commitment to supporting the creative community.",
                color: "#000000",
                bgColor: "#ffffff",
              },
            ].map((value, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className="card h-100 border-0 shadow-sm"
                  style={{
                    borderRadius: "15px",
                    transition: "all 0.3s ease",
                    border: "1px solid #e9ecef",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <div className="card-body p-4 text-center">
                    <div
                      className="mb-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        margin: "0 auto",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${value.bgColor} 0%, ${value.bgColor}dd 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className={`${value.icon} fa-2x`}
                        style={{ fontSize: "2rem", color: value.color }}
                      ></i>
                    </div>
                    <h4 className="fw-bold mb-3">{value.title}</h4>
                    <p className="text-muted" style={{ lineHeight: "1.7" }}>
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-5 text-white"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row g-4 text-center">
            {[
              { number: "10K+", label: "Active Creators" },
              { number: "50K+", label: "Artworks" },
              { number: "100K+", label: "Happy Customers" },
              { number: "150+", label: "Countries" },
            ].map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="p-4">
                  <h2
                    className="display-4 fw-bold mb-3"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
                  >
                    {stat.number}
                  </h2>
                  <p className="fs-5" style={{ opacity: 0.95 }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold mb-4">Our Story</h2>
              <p className="lead text-muted mb-4">
                Born from a passion for creativity and innovation
              </p>
              <p
                className="mb-3"
                style={{ lineHeight: "1.8", fontSize: "1.1rem" }}
              >
                Pax was founded with a simple yet powerful vision: to bridge the
                gap between talented creators and art enthusiasts worldwide. We
                recognized that many artists struggle to find the right platform
                to showcase their work and build a sustainable business.
              </p>
              <p
                className="mb-3"
                style={{ lineHeight: "1.8", fontSize: "1.1rem" }}
              >
                Today, Pax has grown into a thriving community where artists can
                focus on what they do best—creating—while we handle the
                complexities of e-commerce, marketing, and customer service.
              </p>
              <p style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
                Every day, we're inspired by the incredible talent on our
                platform and the stories of artists who have turned their
                passion into their profession.
              </p>
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
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="text-center" style={{ color: "#000000" }}>
                    <i
                      className="fas fa-paint-brush fa-5x mb-4"
                      style={{ opacity: 0.9, color: "#000000" }}
                    ></i>
                    <h3 className="h4 fw-bold" style={{ color: "#000000" }}>
                      Creativity Unleashed
                    </h3>
                    <p
                      className="mt-3"
                      style={{ opacity: 0.95, color: "#000000" }}
                    >
                      Join thousands of creators sharing their art with the
                      world
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container py-5">
          <div
            className="card border-0 shadow-lg text-white text-center"
            style={{
              borderRadius: "25px",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
            }}
          >
            <div className="card-body p-5">
              <h2 className="display-5 fw-bold mb-4">
                Ready to Start Your Creative Journey?
              </h2>
              <p className="lead mb-4" style={{ opacity: 0.95 }}>
                Join our community of creators and art lovers today
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link
                  to="/vendor/register/"
                  className="btn btn-lg px-5 py-3 fw-bold"
                  style={{
                    borderRadius: "50px",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    color: "#000000",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(255, 255, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <i className="fas fa-store me-2"></i>
                  Become a Creator
                </Link>
                <Link
                  to="/shop"
                  className="btn btn-lg px-5 py-3 fw-bold"
                  style={{
                    borderRadius: "50px",
                    fontSize: "1.1rem",
                    borderWidth: "2px",
                    borderColor: "#ffffff",
                    color: "#ffffff",
                    background: "transparent",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <i className="fas fa-shopping-bag me-2"></i>
                  Explore Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
