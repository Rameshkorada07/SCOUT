import React, { useState, useEffect, useRef } from "react";
import "./ExploreNomad.css";
import { ArrowRight } from "lucide-react"; // arrow icon
import { useNavigate } from "react-router-dom";
import { useWaitlistCount } from "@/hooks/useWaitlistCount";

const ExploreNomad = () => {
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
    <section className="explore-section">
      {/* Top Left SCOUT */}
      <div className="top-left-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>SCOUT</div>

      {/* Top Right Link */}
      <div className="top-right-link">
        <a onClick={() => navigate('/values-of-waitlist')}>Values of waitlist</a>
      </div>

      {/* Center Content */}
      <div className="explore-content">
        <h3 className="explore-subheading">Product Of</h3>

        <div className="heading-container">
          <img src="/explore-nomad-img.png" alt="image" />
          <h1 className="explore-heading">Explore Nomad</h1>
        </div>
        

        <p className="explore-text">
          Scout exists because chaos has stolen too much from nomads. What
          should feel like freedom has been turned into noise — endless tabs,
          scattered tools, no clarity.
        </p>

        <p className="explore-text">
          This is our stand. It may not be perfect. It may only be a beginning.
          But beginnings are where movements are born.
        </p>

        <p className="explore-text">
          With your trust and your voice, Scout can grow into more than a
          product. It can become the calm that carries every journey forward.
          This is the Anti-Chaos Movement. And it starts with us — and you.
        </p>

        <p className="explore-text">
          And by joining the waitlist, you’re not just signing up. You’re
          helping create the calm every nomad deserves.
        </p>

        {/* Progress Bar */}
        <div className="progress-container">
          <span className={`progress-value ${isUpdating ? 'updating' : ''}`}>
            {isLoading ? "..." : displayCount}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="progress-value">{targetCount}</span>
        </div>

        {/* Join Button */}
        
          <button onClick={() => navigate('/join-waitlist')} className="explore-button">
          <ArrowRight size={18} />
          Join waitlist
        </button>
       
        

        {/* Hashtag */}
        <p className="explore-hashtag">#AntiChaosNomads</p>
      </div>
    </section>
  );
};

export default ExploreNomad;
