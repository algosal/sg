import React from "react";
import Navbar from "../Navbar";
import profileImage from "../../assets/profile.jpg";
import "./MeetSalman.css"; // import your new css file

const MeetSalman = () => {
  return (
    <div className="meet-container">
      <Navbar />

      <header className="meet-header">
        <div className="header-left">Meet Salman Saeed</div>
        <span className="header-right meet-arabicName">سلمان سعید</span>
      </header>

      <div className="meet-content">
        <div className="meet-content-flex">
          <div style={{ flex: 1 }}>
            <p className="meet-paragraph">
              Salman Saeed is a pioneering entrepreneur, technologist, and
              strategic visionary shaping the future across multiple sectors.
              Leveraging deep expertise in artificial intelligence, finance, and
              software architecture, he designs integrated business ecosystems
              that harmonize innovation with operational excellence and
              subtlety.
            </p>
            <p className="meet-paragraph">
              Mr. Saeed is an avid believer in the power of imagination and the
              laws of manifestation. Deeply influenced by the teachings of
              Neville Goddard and the philosophy of abundance, he has cultivated
              a life and business style that emerges from inner conviction,
              creative visualization, and unwavering self-belief.
            </p>
            <p className="meet-paragraph">
              To him, the outer world is merely a reflection of the inner state,
              and true transformation begins within. Just as a seed becomes a
              forest, every thought sown with faith manifests into reality. His
              methods are a blend of metaphysical insight and pragmatic action —
              a rare fusion of spirit and strategy.
            </p>
            <p className="meet-paragraph">
              Through persistent visualization and unwavering inner dialogue,
              Mr. Saeed transforms intention into tangible achievement. He
              believes the mind, when disciplined by faith, becomes the
              architect of destiny — building outcomes long before they appear
              in the material world. His daily life is steeped in meditation,
              scripting, and conscious assumption — not as rituals, but as
              technologies of the self. In his view, imagination is not
              escapism; it is creation. Each inspired thought is a blueprint,
              and each belief is a command. By aligning emotion with thought and
              action with purpose, Salman unlocks an inner harmony that radiates
              outward — into businesses, relationships, and communities. This is
              not mere philosophy — it’s a deliberate way of living, taught by
              mystics and now applied to modern enterprise with elegance and
              force.
            </p>
          </div>
          <div className="meet-imageContainer">
            <img src={profileImage} alt="Salman Saeed" className="meet-image" />
          </div>
        </div>

        <p className="meet-lastParagraph">
          “Imagine better than the best you know,” Neville Goddard once said — a
          principle Salman lives by. His work and character are testimony to the
          transformative power of belief and the creative command of the mind.
          He doesn't just build businesses — he builds realities, one thought at
          a time.
        </p>

        <footer className="meet-footer">© سلمان سعید</footer>
      </div>
    </div>
  );
};

export default MeetSalman;
