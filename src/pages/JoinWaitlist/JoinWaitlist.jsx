import { useState } from "react";
import React from "react";
import "./JoinWaitlist.css";
import { useNavigate } from "react-router-dom";

const JoinWaitlist = () => {
  const [details, setDetails] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  const navigate = useNavigate();

  return (
    <div className="waitlist-section">

      <div className="waitlist-left">
        <h1 className="heading">SCOUT</h1>
        <p className="top-right-link">
          Product of <button onClick={() => navigate('/explore-nomad')}>Explore Nomad</button>
        </p>
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

      <div className="waitlist-right">
        <div className="right-content">
            <button>Co-Working</button>
            <p>The all in one place built for digital nomads by digital nomads</p>
        </div>
        <button onClick={() => navigate('/values-of-waitlist')} className="bottom-right-link">Values of waitlist</button>
      </div>
      
    </div>
  );
};

export default JoinWaitlist;
