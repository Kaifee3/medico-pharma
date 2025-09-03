import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const footerStyle = {
    width: "100%", 
    background: "linear-gradient(135deg, #006633, #004225)",
    color: "#fff",
    padding: "15px 0 15px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
  };

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "1200px",   
    margin: "0 auto",     
    gap: "30px",
    padding: "0 20px",   
    boxSizing: "border-box",
  };

  const sectionStyle = {
    flex: "1 1 250px",
  };

  const headingStyle = {
    fontSize: "1.5rem",
    marginBottom: "15px",
    color: "#ffe082",
  };

  const socialIconsStyle = {
    display: "flex",
    justifyContent: "flex-start",
  };

  const iconStyle = {
    margin: "0 10px",
    color: "#fff",
    fontSize: "1.8rem",
    cursor: "pointer",
    transition: "transform 0.3s ease, color 0.3s ease",
  };

  const iconHover = (e) => {
    e.target.style.transform = "scale(1.2)";
    e.target.style.color = "#00ff99";
  };

  const iconLeave = (e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.color = "#fff";
  };

  const contactTextStyle = {
    margin: "5px 0",
    fontSize: "1rem",
    transition: "color 0.3s ease",
  };

  const contactHover = (e) => {
    e.target.style.color = "#00ff99";
  };

  const footerBottomStyle = {
    marginTop: "30px",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#cfd8dc",
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Follow Us</h2>
          <div style={socialIconsStyle}>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebook style={iconStyle} onMouseEnter={iconHover} onMouseLeave={iconLeave} />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FaInstagram style={iconStyle} onMouseEnter={iconHover} onMouseLeave={iconLeave} />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
              <FaYoutube style={iconStyle} onMouseEnter={iconHover} onMouseLeave={iconLeave} />
            </a>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Contact Us</h2>
          <p
            style={contactTextStyle}
            onMouseEnter={contactHover}
            onMouseLeave={(e) => (e.target.style.color = "#fff")}
          >
            Email: info@lifecare.com
          </p>
          <p
            style={contactTextStyle}
            onMouseEnter={contactHover}
            onMouseLeave={(e) => (e.target.style.color = "#fff")}
          >
            Phone: +91 987654321
          </p>
        </div>
      </div>

      <div style={footerBottomStyle}>
        &copy; {new Date().getFullYear()} LifeCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
