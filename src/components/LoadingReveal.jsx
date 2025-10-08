import { useState, useEffect, useRef } from 'react'; 
import './LoadingReveal.css';
import { useNavigate } from "react-router-dom";

const LoadingReveal = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [firstImageAnimating, setFirstImageAnimating] = useState(true);

  const ellipseRef = useRef(null);
  const buttonEllipseRef = useRef(null);
  const rafRef = useRef(null);
  const buttonRafRef = useRef(null);

  const SLIDE_DURATION = 6000;

  const getResponsiveDimensions = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      return { width: 353, height: 114, viewBox: "0 0 353 114", cx: 176.5, cy: 57, rx: 176.5, ry: 57 };
    } else if (screenWidth <= 1024) {
      return { width: 984, height: 316, viewBox: "0 0 984 316", cx: 492, cy: 158, rx: 492, ry: 158 };
    } else {
      return { width: 1400, height: 450, viewBox: "0 0 1400 450", cx: 700, cy: 225, rx: 700, ry: 225 };
    }
  };

  const dimensions = getResponsiveDimensions();

  // Initial oval drawing with loading numbers
  useEffect(() => {
    const el = ellipseRef.current;
    if (!el) return;

    const { rx, ry } = dimensions;
    const circumference = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));

    el.style.strokeDasharray = `${circumference}`;
    el.style.strokeDashoffset = `${circumference}`;

    const totalDuration = 2000;
    const start = performance.now();

    function step(now) {
      const t = Math.min(1, (now - start) / totalDuration);
      const eased = 1 - Math.pow(1 - t, 3);

      el.style.strokeDashoffset = `${circumference * (1 - eased)}`;
      setLoadingProgress(Math.floor(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        el.style.strokeDashoffset = `0`;
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setShowContent(true);
          setShowButton(true);
        }, 300);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Handle slideshow + button animation
  useEffect(() => {
    if (!showButton) return;

    const buttonEl = buttonEllipseRef.current;
    if (!buttonEl) return;

    const buttonRx = 80;
    const buttonRy = 25;
    const circumference =
      Math.PI *
      (3 * (buttonRx + buttonRy) - Math.sqrt((3 * buttonRx + buttonRy) * (buttonRx + 3 * buttonRy)));

    buttonEl.style.strokeDasharray = circumference;
    buttonEl.style.strokeDashoffset = circumference;

    const start = performance.now();

    function animate(now) {
      const t = Math.min(1, (now - start) / SLIDE_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);

      buttonEl.style.strokeDashoffset = circumference * (1 - eased);

      if (t < 1) {
        buttonRafRef.current = requestAnimationFrame(animate);
      } else {
        buttonEl.style.strokeDashoffset = 0;
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }

    buttonRafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(buttonRafRef.current);
  }, [currentIndex, showButton]);

  return (
    <div className="reveal-container">
      {/* Top Left Brand */}
      <div className={`brand-text ${showContent ? 'visible' : ''}`}>
        <h1>SCOUT</h1>
        <p>
          Product of <button onClick={() => navigate('/explore-nomad')}>Explore Nomad</button>
        </p>
      </div>

      {/* Center Oval */}
      <div className="oval-container">
        <div className={`oval-shape ${isLoading ? 'loading' : 'loaded'}`}>
          {isLoading && <div className="loading-percentage">{String(loadingProgress).padStart(3, '0')}</div>}

          {!isLoading && (
            <div className="oval-image-wrapper">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`oval-image ${
                    currentIndex === index ? 'active' : ''
                  } ${index === 0 && firstImageAnimating ? 'first-image' : ''}`}
                  style={{
                    backgroundImage: `linear-gradient(0deg, rgba(36, 36, 36, 0.20) 0%, rgba(36, 36, 36, 0.20) 100%), url(${img})`,
                  }}
                  onAnimationEnd={() => {
                    if(index === 0) setFirstImageAnimating(false);
                  }}
                />
              ))}
            </div>
          )}

          {/* Dynamic Button */}
          {showButton && (
            <div className="co-working-button">
              <svg className="button-svg" viewBox="0 0 160 50" preserveAspectRatio="xMidYMid meet">
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
              <div className="button-text">{buttonLabels[currentIndex]}</div>
            </div>
          )}
        </div>

        {/* SVG Border */}
        <svg className={`oval-svg ${!isLoading ? 'fade-out' : ''}`} viewBox={dimensions.viewBox} preserveAspectRatio="xMidYMid meet">
          <ellipse
            ref={ellipseRef}
            cx={dimensions.cx}
            cy={dimensions.cy}
            rx={dimensions.rx}
            ry={dimensions.ry}
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom Right Content */}
      <div className={`bottom-content ${showContent ? 'visible' : ''}`}>
        <p className="description">
          Scout is the AI companion built to cut through nomad chaos — one calm place to search, plan, and connect.
        </p>

        <button onClick={() => navigate('/join-waitlist')} className="cta-button">
          <div className="arrows-container">{Array(36).fill(0).map((_, i) => <span key={i} className="arrow">→</span>)}</div>
          <span>→ Join waitlist</span>
        </button>

        <div className="waitlist-text-container">
          <button onClick={() => navigate('/values-of-waitlist')} className="waitlist-text">Values of waitlist</button>
        </div>
      </div>
    </div>
  );
};

export default LoadingReveal;
