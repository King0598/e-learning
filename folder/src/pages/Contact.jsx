import React from "react";
import "../index.css";

const Contact = () => {
  return (
    <div className="contact-page">

      {/* ===== HERO / HEADER SECTION ===== */}
      <section className="hero contact-hero">
        <div className="hero-overlay">
          <h1>Contact Us</h1>
          <p>We’d love to hear from you! Reach out for support, feedback, or questions.</p>
        </div>
      </section>

      {/* ===== CONTACT FORM SECTION ===== */}
      <section className="contact-form-section">
        <h2>Send Us a Message</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="text" placeholder="Subject" required />
          <textarea placeholder="Message" rows="6" required></textarea>
          <button type="submit">Submit</button>
        </form>
      </section>

      {/* ===== CONTACT INFO SECTION ===== */}
      <section className="contact-info-section">
        <h2>Contact Info</h2>
        <p><strong>Email:</strong> info@elearningrepo.com</p>
        <p><strong>Phone:</strong> +251 912 345 678</p>
        <p><strong>Address:</strong> Bahir Dar University, Ethiopia</p>
        {/* Optional: embed Google Map */}
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.123456789!2d37.383!3d11.592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b7c8a1f2f50c0b%3A0xabcdef1234567890!2sBahir%20Dar%20University!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set" 
            width="100%" 
            height="300" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Bahir Dar University Map"
          ></iframe>
        </div>
      </section>

    </div>
  );
};

export default Contact;
