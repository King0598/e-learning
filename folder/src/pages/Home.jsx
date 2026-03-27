import React from "react";
import "../index.css"; // Make sure this path is correct
import bit_door from "../assets/bit_door_13.jpg"; // Ensure the image is in the correct path
import CENG from "../assets/CENG.png";
import civiv from "../assets/civiv.png";
import COENG from "../assets/COENG.jpg";
import EENG from "../assets/EENG.png";
import MENG from "../assets/MENG.jpg";
const Home = () => {
  return (
    <div className="home">

      {/* ===== HERO SECTION ===== */}
      <section className="hero"
      style={{ backgroundImage: `url(${bit_door})` }} // set background here
      >
        <div className="hero-overlay">
          <h1>Learn, Share & Grow</h1>
          <p>
            Welcome to our learning repository website — a platform built for
            students to explore knowledge, access organized learning materials,
            and interact with lecturers to enhance their learning experience.
          </p>
        </div>
      </section>

      {/* ===== CARDS SECTION ===== */}
      <section className="cards-section">
        <h2 className="popularE-l">Popular E-learning Categories</h2>
        <div className="cards-container">
          {/* Card 1 */}
          <div className="card">
            <img  src={MENG} alt="Hardware" />
            <p className="card-title">Mechanical Engineering</p>
            <p className="card-text">
               Explore the design, analysis, and manufacturing of machines and mechanical systems, from engines and robots to heating and cooling systems.
            </p>
            <p className="card-note">
              💡 "Ideal for problem-solvers — mechanical engineers turn principles of motion and energy into real-world innovations!"
</p>
            
          </div>

          {/* Card 2 */}
          <div className="card">
            <img src={civiv} alt="Programming" />
            <p className="card-title">Civil Engineering</p>
            <p className="card-text">
              Study the design, construction, and maintenance of infrastructure like buildings, bridges, roads, and water systems to shape the built environment.
            </p>
            <p className="card-note">
              💡 "Perfect for future builders — civil engineers turn ideas into safe and lasting structures that serve communities!"
            </p>
          </div>

          {/* Card 3 */}
          <div className="card">
            <img src={COENG} alt="Frontend" />
            <p className="card-title">Computer Engineering</p>
            <p className="card-text">
              Explore the design and development of computer systems, from microprocessors and embedded systems to networking and software-hardware integration.
            </p>
            <p className="card-note">
              💡 "Perfect for aspiring engineers — understanding both hardware and software gives you the power to build innovative computing solutions!"
            </p>
          </div>

          {/* Card 4 */}
          <div className="card">
            <img src={EENG} alt="Networking" />
            <p className="card-title">Electrical Engineering</p>
            <p className="card-text">
               Dive into the study of electricity, circuits, power systems, and electronics to design and manage the electrical infrastructure that powers modern life.
            </p>
            <p className="card-note">
              💡 "Great for problem-solvers — mastering electrical systems is key to building everything from gadgets to smart grids!"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
