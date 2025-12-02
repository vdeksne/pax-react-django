import React, { useState } from "react";
import { Link } from "react-router-dom";

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Growing Your Creative Business in 2025",
      excerpt:
        "Discover proven strategies to scale your creative business and reach new audiences in the digital marketplace.",
      author: "Sarah Johnson",
      date: "January 15, 2025",
      category: "Business",
      readTime: "5 min read",
      image: "📸",
      featured: true,
    },
    {
      id: 2,
      title: "The Art of Pricing Your Creative Work",
      excerpt:
        "Learn how to value your artwork appropriately and set prices that reflect your skill and market demand.",
      author: "Michael Chen",
      date: "January 12, 2025",
      category: "Tips",
      readTime: "7 min read",
      image: "🎨",
      featured: false,
    },
    {
      id: 3,
      title: "Building Your Brand as a Digital Artist",
      excerpt:
        "Essential steps to create a memorable brand identity that resonates with your target audience and sets you apart.",
      author: "Emma Rodriguez",
      date: "January 10, 2025",
      category: "Branding",
      readTime: "6 min read",
      image: "✨",
      featured: false,
    },
    {
      id: 4,
      title: "Social Media Strategies for Creators",
      excerpt:
        "Maximize your social media presence with these actionable tips to engage followers and drive sales.",
      author: "David Park",
      date: "January 8, 2025",
      category: "Marketing",
      readTime: "8 min read",
      image: "📱",
      featured: false,
    },
    {
      id: 5,
      title: "From Hobby to Full-Time: A Creator's Journey",
      excerpt:
        "An inspiring story of how one artist turned their passion into a sustainable full-time career.",
      author: "Lisa Thompson",
      date: "January 5, 2025",
      category: "Stories",
      readTime: "10 min read",
      image: "🌟",
      featured: false,
    },
    {
      id: 6,
      title: "Photography Techniques for Product Showcases",
      excerpt:
        "Professional photography tips to make your products stand out and attract more customers.",
      author: "James Wilson",
      date: "January 3, 2025",
      category: "Tips",
      readTime: "6 min read",
      image: "📷",
      featured: false,
    },
    {
      id: 7,
      title: "Understanding Copyright and Licensing",
      excerpt:
        "A comprehensive guide to protecting your creative work and understanding your rights as an artist.",
      author: "Rachel Green",
      date: "December 28, 2024",
      category: "Legal",
      readTime: "12 min read",
      image: "⚖️",
      featured: false,
    },
    {
      id: 8,
      title: "Creating Compelling Product Descriptions",
      excerpt:
        "Learn how to write product descriptions that sell by highlighting features and connecting with customers emotionally.",
      author: "Tom Anderson",
      date: "December 25, 2024",
      category: "Marketing",
      readTime: "5 min read",
      image: "✍️",
      featured: false,
    },
  ];

  const categories = [
    "All",
    "Business",
    "Tips",
    "Branding",
    "Marketing",
    "Stories",
    "Legal",
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const featuredPost = blogPosts.find((post) => post.featured);

  return (
    <div className="blog-page" style={{ minHeight: "100vh" }}>
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
                Pax Blog
              </h1>
              <p
                className="lead fs-4 mb-4"
                style={{ opacity: 0.95, lineHeight: "1.8" }}
              >
                Insights, Tips, and Stories for Creators
              </p>
              <p className="fs-5" style={{ opacity: 0.9 }}>
                Discover expert advice, inspiring stories, and practical tips to
                grow your creative business
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="container py-4">
            <div className="text-center mb-4">
              <h3 className="h5 fw-bold text-uppercase text-muted mb-0">
                Featured Article
              </h3>
            </div>
            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: "20px", overflow: "hidden" }}
            >
              <div className="row g-0">
                <div className="col-lg-6">
                  <div
                    className="h-100 d-flex align-items-center justify-content-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                      minHeight: "400px",
                      fontSize: "8rem",
                    }}
                  >
                    {featuredPost.image}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div
                    className="card-body p-5 h-100 d-flex flex-column justify-content-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    }}
                  >
                    <span
                      className="badge mb-3 px-3 py-2"
                      style={{
                        background: "#000000",
                        color: "#ffffff",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {featuredPost.category}
                    </span>
                    <h2
                      className="display-6 fw-bold mb-3"
                      style={{ color: "#000000" }}
                    >
                      {featuredPost.title}
                    </h2>
                    <p
                      className="lead mb-4"
                      style={{
                        color: "#000000",
                        opacity: 0.8,
                        lineHeight: "1.7",
                      }}
                    >
                      {featuredPost.excerpt}
                    </p>
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          background: "#000000",
                          color: "#ffffff",
                          fontSize: "1.2rem",
                        }}
                      >
                        {featuredPost.author.charAt(0)}
                      </div>
                      <div>
                        <p
                          className="mb-0 fw-bold"
                          style={{ color: "#000000" }}
                        >
                          {featuredPost.author}
                        </p>
                        <p className="mb-0 text-muted small">
                          {featuredPost.date} · {featuredPost.readTime}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.id}`}
                      className="btn btn-lg px-4 py-2 fw-bold align-self-start"
                      style={{
                        borderRadius: "50px",
                        background:
                          "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                        color: "#ffffff",
                        border: "none",
                        transition: "all 0.3s ease",
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
                      Read More <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      <section className="py-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="btn px-4 py-2 fw-bold"
                style={{
                  borderRadius: "50px",
                  transition: "all 0.3s ease",
                  border: "2px solid",
                  ...(selectedCategory === category
                    ? {
                        background:
                          "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                        color: "#ffffff",
                        borderColor: "#000000",
                      }
                    : {
                        background: "transparent",
                        color: "#000000",
                        borderColor: "#e9ecef",
                      }),
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = "#000000";
                    e.currentTarget.style.background = "#f8f9fa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = "#e9ecef";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row g-4">
            {filteredPosts
              .filter((post) => !post.featured)
              .map((post) => (
                <div key={post.id} className="col-lg-4 col-md-6">
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
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
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        height: "200px",
                        background:
                          "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                        fontSize: "4rem",
                      }}
                    >
                      {post.image}
                    </div>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <span
                          className="badge px-3 py-1 me-2"
                          style={{
                            background: "#f8f9fa",
                            color: "#000000",
                            borderRadius: "15px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          {post.category}
                        </span>
                        <span className="text-muted small">
                          {post.readTime}
                        </span>
                      </div>
                      <h4
                        className="fw-bold mb-3"
                        style={{
                          color: "#000000",
                          fontSize: "1.25rem",
                          lineHeight: "1.4",
                        }}
                      >
                        {post.title}
                      </h4>
                      <p
                        className="text-muted mb-3"
                        style={{ lineHeight: "1.7", fontSize: "0.95rem" }}
                      >
                        {post.excerpt}
                      </p>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{
                              width: "35px",
                              height: "35px",
                              background: "#000000",
                              color: "#ffffff",
                              fontSize: "0.9rem",
                            }}
                          >
                            {post.author.charAt(0)}
                          </div>
                          <div>
                            <p
                              className="mb-0 small fw-bold"
                              style={{ color: "#000000" }}
                            >
                              {post.author}
                            </p>
                            <p className="mb-0 small text-muted">{post.date}</p>
                          </div>
                        </div>
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-decoration-none"
                          style={{ color: "#000000" }}
                        >
                          <i className="fas fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
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
                className="fas fa-envelope-open-text fa-3x mb-4"
                style={{ opacity: 0.9 }}
              ></i>
              <h2 className="display-5 fw-bold mb-3">Stay Updated</h2>
              <p className="lead mb-4" style={{ opacity: 0.95 }}>
                Subscribe to our newsletter and never miss a new article, tip,
                or story from the Pax community
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

export default Blog;
