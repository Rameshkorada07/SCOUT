import React, { useState, useEffect, useRef } from "react";
import "./ValuesOfWaitlist.css";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWaitlistCount } from "@/hooks/useWaitlistCount";

const ValuesOfWaitlist = () => {
  const navigate = useNavigate();
  const { count, targetCount, percentage, isLoading } = useWaitlistCount();
  const [displayCount, setDisplayCount] = useState(count);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevCountRef = useRef(count);

  // Animate number counting
  useEffect(() => {
    if (prevCountRef.current !== count) {
      setIsUpdating(true);
      
      const startCount = prevCountRef.current;
      const endCount = count;
      const duration = 800; // 800ms animation
      const steps = 30;
      const increment = (endCount - startCount) / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setDisplayCount(Math.round(startCount + (increment * currentStep)));
        } else {
          setDisplayCount(endCount);
          clearInterval(timer);
          setIsUpdating(false);
        }
      }, duration / steps);

      prevCountRef.current = count;

      return () => clearInterval(timer);
    }
  }, [count]);

  return (
    <section className="values-section">
      {/* Top Left SCOUT */}
      <div className="top-left-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>SCOUT</div>

      {/* Top Right Link */}
      <div className="top-right-link">
        <p>Product of <button onClick={() => navigate('/explore-nomad')}>Explore Nomad</button></p>
      </div>

      {/* Center Content */}
      <div className="values-content">
        <h3 className="values-subheading">Values Of Waitlist</h3>

        {/* Big Heading */}
        <div className="values-heading">
          <p>Early Member Access</p>
          <p>Unique Explorer Number</p>
          <p>Features Feedback</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container2">
          <span className={`progress-value2 ${isUpdating ? 'updating' : ''}`}>
            {isLoading ? "..." : displayCount}
          </span>
          <div className="progress-bar2">
            <div 
              className="progress-fill2" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="progress-value2">{targetCount}</span>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/join-waitlist")}
          className="values-button"
        >
          <ArrowRight size={18} />
          Join waitlist
        </button>

        {/* Hashtag */}
        <p className="values-hashtag">#AntiChaosNomads</p>
      </div>
    </section>
  );
};

export default ValuesOfWaitlist;
