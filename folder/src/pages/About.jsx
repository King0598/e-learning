import React from "react";
import "../index.css"; // make sure path is correct
import aboutBanner from "../assets/about_banner.jpg"; // add a suitable banner image
import team1 from "../assets/team1.jpg"; // example team photos
import team2 from "../assets/team2.png";

const About = () => {
  return (
    <div className="about-page">

      {/* ===== HERO / HEADER SECTION ===== */}
      <section 
        className="hero"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        <div className="hero-overlay">
          <h1>About Us</h1>
          <p>Our Mission & Vision: Empowering students and lecturers with organized learning resources.</p>
        </div>
      </section>

      {/* ===== MISSION / VISION ===== */}
      <section className="mission-section">
        <div className="mission-container">
          <h2>Our Mission</h2>
          <p>
            Our platform provides students with easy access to a wide range of courses, 
            organized by year and subject. Lecturers can upload course materials and notes, 
            making learning flexible, collaborative, and interactive.
          </p>
          <h2>Our Vision</h2>
          <p>
            We aim to create a seamless learning experience where knowledge is accessible anytime, 
            helping students excel in their studies while supporting lecturers in sharing resources efficiently.
          </p>
        </div>
      </section>

      {/* ===== TEAM SECTION ===== */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-container">
          <div className="team-card">
            <img src={team1} alt="Dr. A - Founder" />
            <h3>TESFA TEGEGNE (Assoc. Prof.)</h3>
            <p>Dean, Faculty of Computing</p>
          </div>
          <div className="team-card">
            <img src={team2} alt="Lecturer B" />
            <h3>Lecturer B</h3>
            <p>Course Coordinator</p>
          </div>
        </div>
      </section>

      {/* ===== HISTORY / STORY ===== */}
      <section className="history-section">
        <h2>Our Story</h2>
        <p>
          Our e-learning repository was created to bridge the gap between students and lecturers. 
          We noticed a need for a centralized platform where course materials could be easily accessed, 
          organized, and shared. Since launching, hundreds of students and lecturers have benefited from our service.
        </p>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <h2>Get Started Today!</h2>
        <p>Sign up now to explore courses, upload resources, and make learning more efficient.</p>
        <a href="/signup" className="cta-button">Create Account</a>
      </section>

    </div>
  );
};

export default About;
