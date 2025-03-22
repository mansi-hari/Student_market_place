import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css"; // Import the CSS file
import heroVideo from "../Assets/heroimage.mp4"; // Adjust the path to your video


const Hero = () => {
  return (
    <div className='hero-container'>
      {/* Left Section - Gradient Background */}
      <div className='hero-left'>
        <div className='hero-content'>
          {/* Headline with Looping Typewriter Animation */}
          <h1 className='typewriter'>
          'Sell your stuff, Bag a bargain'
          </h1>
          {/* Subheadline with Slide-Up Animation */}
          <p className='slide-up' style={{ animationDelay: "2.5s" }}>
            "Track prices, get alerts, and grab the best deals on your favorite products from your Fellow friends."
          </p>
          {/* Button with Zoom-In Animation */}
          <Link to="/products" className="shop-now-button zoom-in" style={{ animationDelay: "3s" }}>
            Explore Now
          </Link>
        </div>
      </div>
      {/* Right Section - Video */}
      <div className='hero-right'>
        <video autoPlay loop muted className='hero-video'>
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Hero;