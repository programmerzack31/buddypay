import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet"; // ✅ SEO support
import heroImage from "../assets/ChatGPT Image Jul 31, 2025, 08_59_30 PM.png";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./HomePage.css";

const features = [
  { title: "Instant Transfers ⚡", desc: "Send and receive money in seconds worldwide." },
  { title: "AI Fraud Protection 🔒", desc: "Smart detection keeps your money safe." },
  { title: "Split Bills Easily 🍕", desc: "Settle dinner or trips instantly with friends." },
  { title: "Global Currency Conversion 💱", desc: "Send and receive in multiple currencies." },
  { title: "Track Every Transaction 📊", desc: "Smart history with insights & reports." },
  { title: "Rewards & Cashback 🎁", desc: "Earn points every time you make a payment." },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="homepage">
      <Helmet>
        <title>BuddyPay - Smarter & Faster Payments</title>
        <meta
          name="description"
          content="BuddyPay is the next-generation payment platform for secure, instant, and rewarding money transfers."
        />
      </Helmet>

      {/* Neon Animated Background */}
      <div className="neon-bg">
        <div className="gradient-circle circle1"></div>
        <div className="gradient-circle circle2"></div>
        <div className="gradient-circle circle3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <motion.div
          className="hero-image-container"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <img src={heroImage} alt="BuddyPay Hero" className="hero-img" loading="lazy" />
          <div className="hero-shine"></div>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Your Money, <span className="highlight">Smarter</span> & <span className="highlight">Faster</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          BuddyPay is the next-generation payment platform for secure, instant, and rewarding money transfers.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <button className="btn-primary" onClick={() => navigate("/signup")}>
            🚀 Get Started
          </button>
          <button className="btn-secondary" onClick={() => navigate("/transfer")}>
            💸 Send Money
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose BuddyPay?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 200, 0.6)" }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} BuddyPay. All rights reserved.</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
