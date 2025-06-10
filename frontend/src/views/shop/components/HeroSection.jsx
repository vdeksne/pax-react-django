import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../../../assets/css/products.css";

const HeroSection = ({ userData }) => {
  return (
    <section className="m-4 mt-0">
      <div className="position-relative">
        <video
          src={
            window.innerWidth <= 768
              ? "/assets/video/video.mp4"
              : "/assets/video/desktop.mp4"
          }
          style={{
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            maxWidth: "100vw",
            borderRadius: "clamp(1rem, 1rem, 1rem)",
            aspectRatio: window.innerWidth <= 768 ? "9/16" : "16/9",
            background: "rgba(0,0,0,0.5)",
          }}
          className="img-products-hero"
          frameBorder="0"
          allow="autoplay; fullscreen"
          title="Products Hero Video"
          autoPlay
          loop
          muted
          playsInline
        />

        <div
          className="position-absolute top-0 start-0 w-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            maxWidth: "100vw",
            borderRadius: "clamp(1rem, 1rem, 1rem)",
            aspectRatio: window.innerWidth <= 768 ? "9/16" : "16/8.5",
            height: "calc(100% - 8px)",
          }}
        >
          <div className="products-main-video-container">
            <h1 className="display-4">
              <p className="mb-2">
                <span className="responsive-text">
                  Fuel Creativity. Power Independence.
                </span>
              </p>
              <p className="mb-4">
                <span className="responsive-text">
                  Connect. Collaborate. Create.
                </span>
              </p>
            </h1>

            <p className="mb-5 responsive-text-small">
              <span>
                Empowering artists and designers to share their work, build
                their brand, and shape their future.
              </span>
            </p>

            {userData ? (
              <Link
                to="/customer/account"
                className="btn-main responsive-button"
                data-ga-category="cta-join"
                data-ga-c="Click"
                data-ga-l="start-trial-hero"
              >
                Account
              </Link>
            ) : (
              <Link
                to="/login"
                className="btn-main responsive-button"
                data-ga-category="cta-join"
                data-ga-c="Click"
                data-ga-l="start-trial-hero"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  userData: PropTypes.object,
};

export default HeroSection;
