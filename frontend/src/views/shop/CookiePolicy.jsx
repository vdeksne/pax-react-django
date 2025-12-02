import React from "react";

function CookiePolicy() {
  const sections = [
    {
      id: "what-are-cookies",
      title: "1. What Are Cookies?",
      content: `Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.

Cookies allow a website to recognize your device and store some information about your preferences or past actions. This helps us provide you with a better experience when you browse our website and allows us to improve our services.`,
    },
    {
      id: "how-we-use-cookies",
      title: "2. How We Use Cookies",
      content: `Pax Creative Platform uses cookies for several purposes:

**Essential Cookies**: These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.

**Performance Cookies**: These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works.

**Functionality Cookies**: These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.

**Targeting/Advertising Cookies**: These cookies are used to deliver advertisements that are more relevant to you and your interests. They also help limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.`,
    },
    {
      id: "types-of-cookies",
      title: "3. Types of Cookies We Use",
      content: `We use the following types of cookies on our Platform:

**Session Cookies**: Temporary cookies that are deleted when you close your browser. These are essential for the website to function properly.

**Persistent Cookies**: Cookies that remain on your device for a set period or until you delete them. These help us recognize you when you return to our website.

**First-Party Cookies**: Cookies set directly by Pax on your device.

**Third-Party Cookies**: Cookies set by third-party services that appear on our pages, such as analytics providers or advertising networks.`,
    },
    {
      id: "specific-cookies",
      title: "4. Specific Cookies We Use",
      content: `Here are some specific cookies we use and their purposes:

**Authentication Cookies**: Used to keep you logged in to your account and maintain your session.

**Shopping Cart Cookies**: Remember items you add to your shopping cart as you browse the website.

**Preference Cookies**: Store your language preferences, currency settings, and other customization options.

**Analytics Cookies**: Help us understand how visitors use our website, which pages are most popular, and how users navigate through the site.

**Marketing Cookies**: Track your browsing habits to show you relevant advertisements on other websites.`,
    },
    {
      id: "third-party-cookies",
      title: "5. Third-Party Cookies",
      content: `We may use third-party services that set cookies on your device. These include:

**Google Analytics**: Helps us understand website traffic and user behavior.

**Payment Processors**: Cookies from payment providers to process transactions securely.

**Social Media Platforms**: Cookies from social media platforms when you share content or log in using social media accounts.

**Advertising Networks**: Cookies from advertising partners to deliver relevant ads.

These third parties have their own privacy policies and cookie policies. We encourage you to review them.`,
    },
    {
      id: "managing-cookies",
      title: "6. Managing Cookies",
      content: `You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.

**Browser Settings**: You can control cookies through your browser settings. Most browsers allow you to:
- See what cookies you have and delete them individually
- Block third-party cookies
- Block all cookies from specific sites
- Block all cookies
- Delete all cookies when you close your browser

**Opt-Out Tools**: You can opt out of certain third-party cookies using tools provided by those services, such as:
- Google Analytics Opt-out Browser Add-on
- Network Advertising Initiative opt-out page
- Digital Advertising Alliance opt-out page

Please note that blocking or deleting cookies may impact your experience on our website. Some features may not function properly if cookies are disabled.`,
    },
    {
      id: "cookie-consent",
      title: "7. Cookie Consent",
      content: `When you first visit our website, we will ask for your consent to use cookies (except for essential cookies, which are necessary for the website to function).

You can withdraw your consent at any time by:
- Adjusting your browser settings
- Using our cookie preference center (if available)
- Contacting us directly

Your consent preferences will be stored and remembered for future visits.`,
    },
    {
      id: "updates",
      title: "8. Updates to This Policy",
      content: `We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.

We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.`,
    },
    {
      id: "contact",
      title: "9. Contact Us",
      content: `If you have any questions about our use of cookies or this Cookie Policy, please contact us at:

- Email: privacy@paxcreative.com
- Address: 123 Creative Street, New York, NY 10001
- Phone: +1 (555) 123-4567`,
    },
  ];

  return (
    <div className="cookie-policy-page" style={{ minHeight: "100vh" }}>
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
                Cookie Policy
              </h1>
              <p
                className="lead fs-4 mb-4"
                style={{ opacity: 0.95, lineHeight: "1.8" }}
              >
                How We Use Cookies
              </p>
              <p className="fs-5" style={{ opacity: 0.9 }}>
                Last Updated: January 1, 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
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
                  <p
                    className="lead mb-4"
                    style={{ lineHeight: "1.8", color: "#000000" }}
                  >
                    This Cookie Policy explains how Pax Creative Platform ("we",
                    "us", or "our") uses cookies and similar technologies when
                    you visit our website. It explains what these technologies
                    are and why we use them, as well as your rights to control
                    our use of them.
                  </p>
                  <p style={{ lineHeight: "1.8", color: "#000000" }}>
                    By using our website, you consent to the use of cookies in
                    accordance with this policy. If you do not agree to our use
                    of cookies, you should set your browser settings accordingly
                    or not use our website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className="mb-5"
                  id={section.id}
                  style={{
                    scrollMarginTop: "100px",
                  }}
                >
                  <div
                    className="card border-0 shadow-sm"
                    style={{
                      borderRadius: "15px",
                      border: "1px solid #e9ecef",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 5px 20px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 2px 10px rgba(0,0,0,0.05)";
                    }}
                  >
                    <div className="card-body p-4">
                      <h3
                        className="fw-bold mb-4"
                        style={{
                          color: "#000000",
                          fontSize: "1.5rem",
                          borderBottom: "2px solid #000000",
                          paddingBottom: "10px",
                        }}
                      >
                        {section.title}
                      </h3>
                      <div
                        style={{
                          color: "#000000",
                          lineHeight: "1.8",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {section.content
                          .split("\n\n")
                          .map((paragraph, pIndex) => {
                            // Check if paragraph starts with ** (bold text)
                            if (
                              paragraph.startsWith("**") &&
                              paragraph.endsWith("**")
                            ) {
                              const text = paragraph.slice(2, -2);
                              return (
                                <p key={pIndex} className="fw-bold mb-3">
                                  {text}
                                </p>
                              );
                            }
                            // Check if paragraph has **text** pattern
                            const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                            return (
                              <p key={pIndex} className="mb-3">
                                {parts.map((part, partIndex) => {
                                  if (
                                    part.startsWith("**") &&
                                    part.endsWith("**")
                                  ) {
                                    return (
                                      <strong key={partIndex}>
                                        {part.slice(2, -2)}
                                      </strong>
                                    );
                                  }
                                  return <span key={partIndex}>{part}</span>;
                                })}
                              </p>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
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
                className="fas fa-cookie-bite fa-3x mb-4"
                style={{ opacity: 0.9 }}
              ></i>
              <h2 className="display-5 fw-bold mb-4">
                Manage Your Cookie Preferences
              </h2>
              <p className="lead mb-4" style={{ opacity: 0.95 }}>
                You have control over cookies. Adjust your browser settings or
                contact us if you have questions about how we use cookies on our
                platform.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <a
                  href="mailto:privacy@paxcreative.com"
                  className="btn btn-lg px-5 py-3 fw-bold"
                  style={{
                    borderRadius: "50px",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    color: "#000000",
                    border: "none",
                    textDecoration: "none",
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
                  <i className="fas fa-envelope me-2"></i>
                  Contact Privacy Team
                </a>
                <a
                  href="/contact"
                  className="btn btn-lg px-5 py-3 fw-bold"
                  style={{
                    borderRadius: "50px",
                    fontSize: "1.1rem",
                    borderWidth: "2px",
                    borderColor: "#ffffff",
                    color: "#ffffff",
                    background: "transparent",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
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
                  <i className="fas fa-comments me-2"></i>
                  General Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CookiePolicy;
