import React from "react";

function Terms() {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: `By accessing and using Pax Creative Platform ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      id: "description",
      title: "2. Description of Service",
      content: `Pax is an online marketplace that connects creators with customers. We provide a platform for artists, designers, and creators to showcase and sell their creative work. Pax facilitates transactions but is not a party to any agreement between creators and customers.`,
    },
    {
      id: "user-accounts",
      title: "3. User Accounts",
      content: `To use certain features of the Platform, you must register for an account. You agree to:
- Provide accurate, current, and complete information during registration
- Maintain and promptly update your account information
- Maintain the security of your password and identification
- Accept all responsibility for activity that occurs under your account
- Notify us immediately of any unauthorized use of your account`,
    },
    {
      id: "creator-responsibilities",
      title: "4. Creator Responsibilities",
      content: `As a creator on Pax, you agree to:
- Provide accurate descriptions of your products and services
- Deliver products as described and within stated timeframes
- Maintain the quality and authenticity of your work
- Comply with all applicable laws and regulations
- Respect intellectual property rights of others
- Handle customer inquiries and support professionally`,
    },
    {
      id: "customer-responsibilities",
      title: "5. Customer Responsibilities",
      content: `As a customer, you agree to:
- Provide accurate payment and shipping information
- Review product descriptions carefully before purchasing
- Respect creator intellectual property rights
- Use purchased products in accordance with their intended purpose
- Contact creators directly for product-specific inquiries`,
    },
    {
      id: "payments",
      title: "6. Payments and Fees",
      content: `Pax charges a commission fee on each transaction. Current commission rates are displayed in your vendor dashboard. All prices are listed in the currency specified on the Platform. Payment processing is handled through secure third-party payment processors. Refunds are subject to our refund policy and individual creator policies.`,
    },
    {
      id: "intellectual-property",
      title: "7. Intellectual Property",
      content: `All content on the Platform, including but not limited to text, graphics, logos, images, and software, is the property of Pax or its content suppliers and is protected by copyright and other intellectual property laws. Creators retain ownership of their original work. By listing products on Pax, creators grant Pax a license to display and promote their work on the Platform.`,
    },
    {
      id: "prohibited-conduct",
      title: "8. Prohibited Conduct",
      content: `You agree not to:
- Violate any applicable laws or regulations
- Infringe upon the intellectual property rights of others
- Upload malicious code, viruses, or harmful content
- Engage in fraudulent or deceptive practices
- Harass, abuse, or harm other users
- Use the Platform for any illegal or unauthorized purpose
- Interfere with or disrupt the Platform's operation`,
    },
    {
      id: "disputes",
      title: "9. Dispute Resolution",
      content: `In the event of a dispute between creators and customers, Pax may facilitate communication but is not responsible for resolving disputes. We encourage parties to resolve issues directly. For disputes that cannot be resolved, Pax may provide mediation services or refer parties to appropriate legal channels.`,
    },
    {
      id: "limitation-liability",
      title: "10. Limitation of Liability",
      content: `Pax provides the Platform "as is" and "as available" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid to Pax in the 12 months preceding the claim.`,
    },
    {
      id: "termination",
      title: "11. Termination",
      content: `Either party may terminate this agreement at any time. Pax reserves the right to suspend or terminate accounts that violate these terms. Upon termination, your right to use the Platform will immediately cease. Provisions that by their nature should survive termination will remain in effect.`,
    },
    {
      id: "changes",
      title: "12. Changes to Terms",
      content: `Pax reserves the right to modify these terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the Platform after changes constitutes acceptance of the new terms. It is your responsibility to review these terms periodically.`,
    },
    {
      id: "governing-law",
      title: "13. Governing Law",
      content: `These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Pax operates, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.`,
    },
    {
      id: "contact",
      title: "14. Contact Information",
      content: `If you have any questions about these Terms of Service, please contact us at:
- Email: legal@paxcreative.com
- Address: 123 Creative Street, New York, NY 10001
- Phone: +1 (555) 123-4567`,
    },
  ];

  return (
    <div className="terms-page" style={{ minHeight: "100vh" }}>
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
                Terms of Service
              </h1>
              <p
                className="lead fs-4 mb-4"
                style={{ opacity: 0.95, lineHeight: "1.8" }}
              >
                Please Read Carefully
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
                    Welcome to Pax Creative Platform. These Terms of Service
                    ("Terms") govern your access to and use of our website,
                    services, and platform. By using Pax, you agree to be bound
                    by these Terms.
                  </p>
                  <p style={{ lineHeight: "1.8", color: "#000000" }}>
                    These Terms constitute a legally binding agreement between
                    you and Pax. If you do not agree with any part of these
                    Terms, you must not use our Platform. We may update these
                    Terms from time to time, and your continued use of the
                    Platform after such changes constitutes acceptance of the
                    updated Terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
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
                        {section.content}
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
                className="fas fa-file-contract fa-3x mb-4"
                style={{ opacity: 0.9 }}
              ></i>
              <h2 className="display-5 fw-bold mb-4">
                Questions About Our Terms?
              </h2>
              <p className="lead mb-4" style={{ opacity: 0.95 }}>
                If you have any questions or concerns about these Terms of
                Service, please don't hesitate to reach out to our legal team.
                We're here to help clarify any aspects of our terms and ensure
                you have a clear understanding of your rights and
                responsibilities.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <a
                  href="mailto:legal@paxcreative.com"
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
                  Contact Legal Team
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

export default Terms;
