import { useState, useEffect, useRef } from "react";
import React from "react";
import "./JoinWaitlist.css";
import { useNavigate } from "react-router-dom";

const JoinWaitlist = () => {
  const [details, setDetails] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const images = [
    "/community.jpg",
    "/main.jpg",
    "/co-living.jpg",
    "/flights.jpg",
    "/sim.jpg",
    "/insurance.jpg",
    "/visa.jpg",
    "/nomad-news.jpg",
    "/nomad-stories.jpg"
  ];

  const buttonLabels = [
    "COMMUNITY",
    "CO-WORKING",
    "CO-LIVING",
    "FLIGHTS",
    "SIM",
    "INSURANCE",
    "VISA",
    "NOMAD NEWS",
    "NOMAD STORIES"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstImageAnimating, setFirstImageAnimating] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const buttonEllipseRef = useRef(null);
  const buttonRafRef = useRef(null);

  // 🔁 Image cycle
  useEffect(() => {
    setShowButton(false);
    const showBtnTimer = setTimeout(() => setShowButton(true), 200);

    const changeImgTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      clearTimeout(showBtnTimer);
      clearTimeout(changeImgTimer);
    };
  }, [currentIndex, images.length]);

  // ⭕ Button ellipse animation
  useEffect(() => {
    if (!showButton) return;
    const buttonEl = buttonEllipseRef.current;
    if (!buttonEl) return;

    const buttonRx = 80;
    const buttonRy = 25;
    const circumference =
      Math.PI *
      (3 * (buttonRx + buttonRy) -
        Math.sqrt((3 * buttonRx + buttonRy) * (buttonRx + 3 * buttonRy)));

    buttonEl.style.strokeDasharray = circumference;
    buttonEl.style.strokeDashoffset = circumference;

    const duration = 4000;
    const start = performance.now();

    function animate(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      buttonEl.style.strokeDashoffset = circumference * (1 - eased);

      if (t < 1) {
        buttonRafRef.current = requestAnimationFrame(animate);
      } else {
        buttonEl.style.strokeDashoffset = 0;
      }
    }

    buttonRafRef.current = requestAnimationFrame(animate);
    return () => {
      if (buttonRafRef.current) cancelAnimationFrame(buttonRafRef.current);
    };
  }, [showButton]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="waitlist-section">
      {/* ✅ Always visible top-right link */}
      <p className="top-right-link always-visible">
        Product of{" "}
        <button onClick={() => navigate("/explore-nomad")}>
          Explore Nomad
        </button>
      </p>

      {/* LEFT SIDE */}
      <div className="waitlist-left">
        <h1 className="heading">SCOUT</h1>

        <div className="waitlist-form">
          {submitted ? (
            <div className="thank-you">
              <h1>Thank You!</h1>
              <p>
                Welcome to the Anti-Chaos Movement. Check your email to confirm
                and receive your unique explorer number.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={details.name}
                onChange={(e) =>
                  setDetails({ ...details, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={details.email}
                onChange={(e) =>
                  setDetails({ ...details, email: e.target.value })
                }
                required
              />
              <button type="submit">→ Join Wait-list</button>
            </form>
          )}
        </div>

        <div className="waitlist-bottom">
          <p>The all in one place built for digital nomads by digital nomads</p>
          <span>↓</span>
        </div>
      </div>

      {/* RIGHT SIDE with smooth transition */}
      <div className="waitlist-right">
        <div className="oval-image-wrapper">
          {images.map((img, index) => (
            <div
              key={index}
              className={`oval-image ${
                currentIndex === index ? "active" : ""
              }`}
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(22, 22, 22, 0.35), rgba(22, 22, 22, 0.35)), url(${img})`
              }}
              onAnimationEnd={() => {
                if (index === 0) setFirstImageAnimating(false);
              }}
            />
          ))}
        </div>

        <div className="right-content">
          {showButton && (
            <div className="co-working-button2">
              <svg
                className="button-svg2"
                viewBox="0 0 160 50"
                preserveAspectRatio="xMidYMid meet"
              >
                <ellipse
                  ref={buttonEllipseRef}
                  cx="80"
                  cy="25"
                  rx="80"
                  ry="25"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
              <div className="button-text2">
                {buttonLabels[currentIndex]}
              </div>
            </div>
          )}

          <p>The all in one place built for digital nomads by digital nomads</p>
        </div>

        <button
          onClick={() => navigate("/values-of-waitlist")}
          className="bottom-right-link"
        >
          Values of waitlist
        </button>
      </div>
    </div>
  );
};

export default JoinWaitlist;
