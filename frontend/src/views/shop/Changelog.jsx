function Changelog() {
  const changelogEntries = [
    {
      version: "2.5.0",
      date: "January 15, 2025",
      type: "major",
      changes: [
        {
          category: "New Features",
          items: [
            "Introduced advanced analytics dashboard for creators",
            "Added bulk product upload functionality",
            "Implemented real-time order tracking system",
            "Launched mobile app for iOS and Android",
          ],
        },
        {
          category: "Improvements",
          items: [
            "Enhanced search algorithm for better product discovery",
            "Improved checkout process with saved payment methods",
            "Optimized image loading for faster page performance",
            "Updated vendor dashboard with new metrics",
          ],
        },
        {
          category: "Bug Fixes",
          items: [
            "Fixed issue with image uploads on mobile devices",
            "Resolved payment processing errors for international orders",
            "Corrected email notification delivery delays",
            "Fixed display issues on high-resolution screens",
          ],
        },
      ],
    },
    {
      version: "2.4.2",
      date: "December 20, 2024",
      type: "patch",
      changes: [
        {
          category: "Improvements",
          items: [
            "Enhanced security measures for payment processing",
            "Improved error messages for better user experience",
          ],
        },
        {
          category: "Bug Fixes",
          items: [
            "Fixed cart persistence issue across sessions",
            "Resolved notification badge display problem",
            "Corrected timezone handling in order history",
          ],
        },
      ],
    },
    {
      version: "2.4.0",
      date: "December 5, 2024",
      type: "major",
      changes: [
        {
          category: "New Features",
          items: [
            "Added wishlist functionality for customers",
            "Implemented product comparison feature",
            "Launched subscription-based products",
            "Introduced multi-language support",
          ],
        },
        {
          category: "Improvements",
          items: [
            "Redesigned product detail pages",
            "Enhanced vendor profile pages",
            "Improved mobile responsiveness",
            "Updated notification system",
          ],
        },
      ],
    },
    {
      version: "2.3.1",
      date: "November 18, 2024",
      type: "patch",
      changes: [
        {
          category: "Bug Fixes",
          items: [
            "Fixed image upload issues for vendor settings",
            "Resolved checkout calculation errors",
            "Corrected email template rendering",
            "Fixed dashboard loading performance",
          ],
        },
      ],
    },
    {
      version: "2.3.0",
      date: "November 1, 2024",
      type: "major",
      changes: [
        {
          category: "New Features",
          items: [
            "Introduced vendor coupon system",
            "Added product review and rating system",
            "Implemented live chat support",
            "Launched affiliate program",
          ],
        },
        {
          category: "Improvements",
          items: [
            "Enhanced product filtering options",
            "Improved order management interface",
            "Updated email notification templates",
            "Optimized database queries for better performance",
          ],
        },
      ],
    },
    {
      version: "2.2.0",
      date: "October 10, 2024",
      type: "major",
      changes: [
        {
          category: "New Features",
          items: [
            "Added social media integration for product sharing",
            "Implemented advanced product search with filters",
            "Launched vendor analytics dashboard",
            "Introduced automated inventory management",
          ],
        },
        {
          category: "Improvements",
          items: [
            "Redesigned homepage with better product showcase",
            "Enhanced mobile shopping experience",
            "Improved payment gateway integration",
            "Updated user interface with modern design",
          ],
        },
      ],
    },
  ];

  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case "major":
        return {
          background: "#000000",
          color: "#ffffff",
        };
      case "minor":
        return {
          background: "#1a1a1a",
          color: "#ffffff",
        };
      case "patch":
        return {
          background: "#2d2d2d",
          color: "#ffffff",
        };
      default:
        return {
          background: "#000000",
          color: "#ffffff",
        };
    }
  };

  return (
    <div className="changelog-page" style={{ minHeight: "100vh" }}>
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
                Changelog
              </h1>
              <p
                className="lead fs-4 mb-4"
                style={{ opacity: 0.95, lineHeight: "1.8" }}
              >
                Track Our Platform Updates
              </p>
              <p className="fs-5" style={{ opacity: 0.9 }}>
                Stay informed about new features, improvements, and fixes
                we&apos;re continuously making to enhance your experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Changelog Entries */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {changelogEntries.map((entry, index) => (
                <div
                  key={index}
                  className="mb-5"
                  style={{
                    position: "relative",
                    paddingLeft:
                      index < changelogEntries.length - 1 ? "30px" : "0",
                  }}
                >
                  {index < changelogEntries.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "60px",
                        bottom: "-40px",
                        width: "2px",
                        background: "#e9ecef",
                      }}
                    ></div>
                  )}
                  <div
                    className="card border-0 shadow-lg"
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div
                      className="card-body p-5"
                      style={{
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <span
                            className="badge px-3 py-2 fw-bold"
                            style={{
                              ...getTypeBadgeStyle(entry.type),
                              borderRadius: "20px",
                              fontSize: "0.9rem",
                            }}
                          >
                            {entry.type.toUpperCase()}
                          </span>
                          <h2
                            className="mb-0 fw-bold"
                            style={{ color: "#000000", fontSize: "2rem" }}
                          >
                            Version {entry.version}
                          </h2>
                        </div>
                        <span
                          className="text-muted fw-bold"
                          style={{ fontSize: "1rem" }}
                        >
                          {entry.date}
                        </span>
                      </div>

                      {entry.changes.map((changeGroup, groupIndex) => (
                        <div key={groupIndex} className="mb-4">
                          <h4
                            className="fw-bold mb-3"
                            style={{
                              color: "#000000",
                              fontSize: "1.25rem",
                              borderBottom: "2px solid #000000",
                              paddingBottom: "8px",
                              display: "inline-block",
                            }}
                          >
                            {changeGroup.category}
                          </h4>
                          <ul
                            className="mb-0"
                            style={{
                              listStyle: "none",
                              paddingLeft: "0",
                            }}
                          >
                            {changeGroup.items.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="mb-2 d-flex align-items-start"
                                style={{ color: "#000000" }}
                              >
                                <i
                                  className="fas fa-check-circle me-3 mt-1"
                                  style={{ color: "#000000", minWidth: "20px" }}
                                ></i>
                                <span style={{ lineHeight: "1.7" }}>
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section
        className="py-5 text-white"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <i
                className="fas fa-bell fa-3x mb-4"
                style={{ opacity: 0.9 }}
              ></i>
              <h2 className="display-5 fw-bold mb-3">Never Miss an Update</h2>
              <p className="lead mb-4" style={{ opacity: 0.95 }}>
                Subscribe to our newsletter to receive notifications about new
                features, improvements, and important updates directly in your
                inbox
              </p>
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="input-group input-group-lg">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email address"
                      style={{
                        borderRadius: "50px 0 0 50px",
                        border: "none",
                        padding: "15px 25px",
                      }}
                    />
                    <button
                      className="btn px-5 fw-bold"
                      type="button"
                      style={{
                        borderRadius: "0 50px 50px 0",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                        color: "#000000",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Subscribe
                    </button>
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

export default Changelog;
