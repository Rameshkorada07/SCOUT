import { useState, useEffect, useRef } from 'react';
import './LoadingReveal.css';
import { useNavigate } from "react-router-dom";
const LoadingReveal = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  
  const ellipseRef = useRef(null);
  const buttonEllipseRef = useRef(null);
  const rafRef = useRef(null);
  const buttonRafRef = useRef(null);
const navigate = useNavigate();
  // Get responsive dimensions
  const getResponsiveDimensions = () => {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 768) {
      // Mobile: Width 353, Height 114
      return {
        width: 353,
        height: 114,
        viewBox: "0 0 353 114",
        cx: 176.5,
        cy: 57,
        rx: 176.5,
        ry: 57
      };
    } else if (screenWidth <= 1024) {
      // Tablet: Width 984, Height 316
      return {
        width: 984,
        height: 316,
        viewBox: "0 0 984 316",
        cx: 492,
        cy: 158,
        rx: 492,
        ry: 158
      };
    } else {
      // Desktop: Width 1400, Height 450
      return {
        width: 1400,
        height: 450,
        viewBox: "0 0 1400 450",
        cx: 700,
        cy: 225,
        rx: 700,
        ry: 225
      };
    }
  };

  const dimensions = getResponsiveDimensions();

  useEffect(() => {
    const el = ellipseRef.current;
    if (!el) return;

    // Calculate ellipse circumference using responsive dimensions
    const { rx, ry } = dimensions;
    const circumference = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));

    // Initialize stroke dash
    el.style.strokeDasharray = `${circumference}`;
    el.style.strokeDashoffset = `${circumference}`;

    const totalDuration = 2000;
    const start = performance.now();

    function step(now) {
      const t = Math.min(1, (now - start) / totalDuration);
      const eased = 1 - Math.pow(1 - t, 3);

      // Update counter
      const newCount = Math.floor(eased * 100);
      setLoadingProgress(newCount);

      // Update stroke
      const offset = circumference * (1 - eased);
      el.style.strokeDashoffset = `${offset}`;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setLoadingProgress(100);
        el.style.strokeDashoffset = `0`;
        setTimeout(() => {
          setIsLoading(false);
          setShowContent(true);
          // Start button animation after image loads
          setTimeout(() => {
            setShowButton(true);
          }, 200);
        }, 100);
      }
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Button animation effect
  useEffect(() => {
    if (!showButton) return;
    
    const buttonEl = buttonEllipseRef.current;
    if (!buttonEl) return;

    // Calculate button ellipse circumference
    const buttonRx = 80; // Button width radius
    const buttonRy = 25; // Button height radius
    const buttonCircumference = Math.PI * (3 * (buttonRx + buttonRy) - Math.sqrt((3 * buttonRx + buttonRy) * (buttonRx + 3 * buttonRy)));

    // Initialize button stroke dash
    buttonEl.style.strokeDasharray = `${buttonCircumference}`;
    buttonEl.style.strokeDashoffset = `${buttonCircumference}`;

    const buttonDuration = 1500; // 1.5 seconds
    const start = performance.now();

    function buttonStep(now) {
      const t = Math.min(1, (now - start) / buttonDuration);
      const eased = 1 - Math.pow(1 - t, 3);

      // Update button stroke
      const offset = buttonCircumference * (1 - eased);
      buttonEl.style.strokeDashoffset = `${offset}`;

      if (t < 1) {
        buttonRafRef.current = requestAnimationFrame(buttonStep);
      } else {
        buttonEl.style.strokeDashoffset = `0`;
      }
    }

    buttonRafRef.current = requestAnimationFrame(buttonStep);

    return () => {
      if (buttonRafRef.current) cancelAnimationFrame(buttonRafRef.current);
    };
  }, [showButton]);

  return (
    <div className="reveal-container">
      {/* Top Left Brand */}
      <div className={`brand-text ${showContent ? 'visible' : ''}`}>
        <h1>SCOUT</h1>
        <p>Product of <button onClick={() => navigate('/explore-nomad')}>Explore Nomad</button></p>
      </div>

      {/* Center Oval */}
      <div className="oval-container">
        <div className={`oval-shape ${isLoading ? 'loading' : 'loaded'}`}>
          {isLoading && (
            <div className="loading-percentage">{String(loadingProgress).padStart(3, '0')}</div>
          )}
          {!isLoading && (
            // <img 
            //   src="/center.JPG"
            //   alt="Scout co-working showcase"
            //   className="oval-image"
            //   onLoad={() => setImageLoaded(true)}
            // />
            <div className="oval-image"></div>
          )}
          
          {/* CO-WORKING Button */}
          {showButton && (
            <div className="co-working-button">
              <svg 
                className="button-svg"
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
              <div className="button-text">CO-WORKING</div>
            </div>
          )}
        </div>
        
        {/* SVG Border Drawing */}
        <svg 
          className={`oval-svg ${!isLoading ? 'fade-out' : ''}`}
          viewBox={dimensions.viewBox}
          preserveAspectRatio="xMidYMid meet"
        >
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
        <button  onClick={() => navigate('/join-waitlist')} className="cta-button">
          <div className="arrows-container">
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
            <span className="arrow">→</span>
          </div>
          <span>→ Join waitlist</span>
        </button>
        <div className="waitlist-text-container">
          <button onClick={() => navigate('/values-of-waitlist')} className="waitlist-text" >Values of waitlist</button>
        </div>
        
      </div>
    </div>
  );
};

export default LoadingReveal;
